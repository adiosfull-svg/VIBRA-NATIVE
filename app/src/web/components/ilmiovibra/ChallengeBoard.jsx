// Port di src/components/ilmiovibra/ChallengeBoard.jsx (convertito da scripts/port/codemod.mjs).
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useMemo } from 'react';
import { motion } from '@/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import { parseISO, isWithinInterval } from 'date-fns';
import { Swords, Gift, Calendar, Trophy } from '@/ui/icons.generated';
import { calcTables } from '@/legacy/utils/tables';

import { Div, H, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const METRIC_LABELS = {
  fatturato: 'Fatturato',
  tavoli: 'Tavoli chiusi',
  manuale: 'Punteggio',
};

function computeLeaderboard(challenge, promoters, attendances, events) {
  const participantIds = challenge.participant_ids?.length > 0
    ? challenge.participant_ids
    : promoters.filter(p => p.status !== 'inattivo').map(p => p.id);

  if (challenge.metric_type === 'manuale') {
    return participantIds
      .map(id => ({
        id,
        name: promoters.find(p => p.id === id)?.name || '—',
        photoUrl: promoters.find(p => p.id === id)?.photo_url,
        value: challenge.manual_scores?.[id] || 0,
      }))
      .sort((a, b) => b.value - a.value);
  }

  // fatturato / tavoli: calcolati automaticamente dalle serate nel periodo della sfida
  const from = challenge.start_date ? parseISO(challenge.start_date) : null;
  const to = challenge.end_date ? parseISO(challenge.end_date) : null;

  const eventIds = new Set(
    events.filter(e => {
      if (!e.date) return false;
      if (!from || !to) return true;
      try { return isWithinInterval(parseISO(e.date), { start: from, end: to }); }
      catch { return false; }
    }).map(e => e.id)
  );

  const valueMap = {};
  attendances.forEach(a => {
    if (!a.promoter_id || a.client_id || !eventIds.has(a.event_id) || !participantIds.includes(a.promoter_id)) return;
    const ev = events.find(e => e.id === a.event_id);
    const value = challenge.metric_type === 'tavoli'
      ? calcTables(a.revenue || 0, null, ev?.table_threshold || 300)
      : (a.revenue || 0);
    valueMap[a.promoter_id] = (valueMap[a.promoter_id] || 0) + value;
  });

  return participantIds
    .map(id => ({
      id,
      name: promoters.find(p => p.id === id)?.name || '—',
      photoUrl: promoters.find(p => p.id === id)?.photo_url,
      value: valueMap[id] || 0,
    }))
    .sort((a, b) => b.value - a.value);
}

function formatValue(metricType, value) {
  if (metricType === 'fatturato') return `€${value.toLocaleString('it-IT')}`;
  if (metricType === 'tavoli') return `${value} tav.`;
  return value.toLocaleString('it-IT');
}

function LeaderboardRow({ entry, position, metricType }) {
  const isLeader = position === 0;
  return (
    <Div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${isLeader ? 'bg-yellow-400/10 border border-yellow-400/30' : 'bg-secondary/30 border border-border/40'}`}>
      <Span className={`text-xs font-bold w-5 text-center shrink-0 ${isLeader ? 'text-yellow-400' : 'text-muted-foreground'}`}>
        {isLeader ? <Trophy className="w-3.5 h-3.5" /> : `#${position + 1}`}
      </Span>
      <Div className="w-6 h-6 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
        {entry.photoUrl ? <Img src={entry.photoUrl} alt={entry.name} className="w-full h-full object-cover" /> : <Span className="text-[9px] font-bold">{entry.name?.charAt(0)}</Span>}
      </Div>
      <Span className={`flex-1 text-xs font-semibold truncate ${isLeader ? 'text-yellow-300' : 'text-foreground'}`}>{entry.name}</Span>
      <Span className={`text-xs font-bold shrink-0 ${isLeader ? 'text-yellow-400' : 'text-primary'}`}>{formatValue(metricType, entry.value)}</Span>
    </Div>
  );
}

export default function ChallengeBoard() {
  const { data: challenges = [] } = useQuery({
    queryKey: ['vibra-challenges'],
    queryFn: () => base44.entities.VibraChallenge.filter({ is_active: true }, '-created_date'),
    staleTime: 60000, refetchOnWindowFocus: false, retry: 0,
  });

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 5 * 60000, refetchOnWindowFocus: false, retry: 0,
  });

  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
    enabled: challenges.some(c => c.metric_type !== 'manuale'),
refetchOnWindowFocus: false, retry: 0,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled: challenges.some(c => c.metric_type !== 'manuale'),
    staleTime: 5 * 60000, refetchOnWindowFocus: false, retry: 0,
  });

  const leaderboards = useMemo(() => {
    const map = {};
    challenges.forEach(c => { map[c.id] = computeLeaderboard(c, promoters, attendances, events); });
    return map;
  }, [challenges, promoters, attendances, events]);

  if (challenges.length === 0) return null;

  return (
    <Div className="space-y-4">
      <Div className="flex items-center gap-2">
        <Swords className="w-4 h-4 text-primary" />
        <H className="text-xs font-bold uppercase tracking-widest text-primary">Sfide in Bacheca</H>
      </Div>
      <Div className="space-y-3">
        {challenges.map((c, i) => {
          const leaderboard = leaderboards[c.id] || [];
          const metricType = c.metric_type || 'fatturato';
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card p-5 space-y-3"
              style={{ boxShadow: '0 4px 24px -8px rgba(167,139,250,0.18)' }}
            >
              <Div className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
              <Div className="space-y-1">
                <P className="font-bold text-sm">{c.title}</P>
                {c.description && <P className="text-xs text-muted-foreground">{c.description}</P>}
                {c.prize && (
                  <P className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" /> In palio: {c.prize}
                  </P>
                )}
                <Div className="flex items-center gap-3 flex-wrap">
                  <Span className="text-[10px] text-muted-foreground">📊 {METRIC_LABELS[metricType]}</Span>
                  {(c.start_date || c.end_date) && (
                    <Span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {c.start_date || '...'} → {c.end_date || '...'}
                    </Span>
                  )}
                </Div>
              </Div>

              {leaderboard.length > 0 && (
                <Div className="space-y-1.5 pt-1">
                  {leaderboard.map((entry, pos) => (
                    <LeaderboardRow key={entry.id} entry={entry} position={pos} metricType={metricType} />
                  ))}
                </Div>
              )}
            </motion.div>
          );
        })}
      </Div>
    </Div>
  );
}