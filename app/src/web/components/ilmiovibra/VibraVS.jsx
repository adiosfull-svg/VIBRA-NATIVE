// Port di src/components/ilmiovibra/VibraVS.jsx (convertito da scripts/port/codemod.mjs).
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useMemo } from 'react';
import { motion } from '@/ui/motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import { parseISO, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Trophy, ChevronUp, ChevronDown, Minus, Swords, Calendar, Star } from '@/ui/icons.generated';
import { useAuth } from '@/lib/auth';
import { computeAutoUnlocked, computePromoterStats } from '@/legacy/utils/achievementLogic';
import { computePRPoints, getRankInfo, getDynamicRankTiers } from '@/legacy/utils/rankSystem';
import ChallengeBoard from './ChallengeBoard';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { isVisibleInStats } from '@/legacy/utils/promoterVisibility';
import { validDayKey, localDayKey } from '@/legacy/utils/dateUtils';

import { Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

// Array vuoto a identità STABILE: con `= []` ogni render ne crea uno nuovo finché i dati non ci sono
// e rankBadges/classifiche (che li hanno tra le dipendenze) si ricalcolerebbero a ogni render.
const EMPTY_ARR = [];

/**
 * Logica settimana:
 * - La settimana va da lunedì a domenica.
 * - Dal lunedì al lunedì successivo si mostrano i dati della settimana PRECEDENTE.
 * - Cioè: se oggi è lunedì o qualsiasi giorno della settimana corrente,
 *   mostriamo la settimana che è appena finita (la precedente).
 * - Questo crea un "reset" ogni lunedì sera.
 */
function getDisplayWeekRange() {
  const now = new Date();
  // Settimana precedente
  const prevWeekDate = subWeeks(now, 1);
  const from = startOfWeek(prevWeekDate, { weekStartsOn: 1 });
  const to = endOfWeek(prevWeekDate, { weekStartsOn: 1 });
  return { from, to };
}

function PromoterAvatar({ name, photoUrl, size = 8 }) {
  const sizeClass = `w-${size} h-${size}`;
  return (
    <Div className={`${sizeClass} rounded-full overflow-hidden shrink-0 border border-white/[0.1] flex items-center justify-center bg-secondary/60`}>
      {photoUrl
        ? <Img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        : <Span className="text-[10px] font-bold text-muted-foreground">{name?.charAt(0)?.toUpperCase()}</Span>
      }
    </Div>
  );
}

function RankRow({ position, name, revenue, variant = 'default', gap, gapLabel, rankBadge, photoUrl }) {
  const styles = {
    above: {
      bg: 'bg-card border-border',
      icon: <ChevronUp className="w-5 h-5 text-green-400" />,
      iconBg: 'bg-green-400/10',
      posColor: 'text-green-400',
      revColor: 'text-green-400',
    },
    me: {
      bg: 'bg-primary/10 border-primary/30',
      icon: <Minus className="w-4 h-4 text-primary" />,
      iconBg: 'bg-primary/20',
      posColor: 'text-primary',
      revColor: 'text-primary',
    },
    below: {
      bg: 'bg-card border-border',
      icon: <ChevronDown className="w-5 h-5 text-red-400" />,
      iconBg: 'bg-red-400/10',
      posColor: 'text-red-400',
      revColor: 'text-red-400',
    },
  };
  const s = styles[variant];
  return (
    <Div className={`rounded-xl border p-4 flex items-center gap-4 ${s.bg}`}>
      <Div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
        {s.icon}
      </Div>
      <PromoterAvatar name={name} photoUrl={photoUrl} size={8} />
      <Div className="flex-1 min-w-0">
        <P className={`text-[10px] uppercase tracking-wider mb-0.5 ${s.posColor}`}>
          #{position} {variant === 'above' ? '· Ti precede' : variant === 'below' ? '· Ti segue' : '· Tu'}
        </P>
        <Div className="flex items-center gap-1.5">
          <P className={`text-sm font-bold truncate ${variant === 'me' ? 'text-primary' : 'text-foreground'}`}>{name}</P>
          {rankBadge && (
            <Span className="text-xs shrink-0 font-semibold px-1.5 py-0.5 rounded-md border"
              style={{ borderColor: `${rankBadge.color}40`, color: rankBadge.color, background: `${rankBadge.color}12`, fontSize: 10 }}>
              {rankBadge.emoji} {rankBadge.label}
            </Span>
          )}
        </Div>
        {gap !== undefined && gap > 0 && (
          <P className="text-[10px] text-muted-foreground mt-0.5">{gapLabel}</P>
        )}
      </Div>
      <Div className="text-right shrink-0">
        <P className={`text-sm font-bold ${s.revColor}`}>€{revenue.toLocaleString('it-IT')}</P>
      </Div>
    </Div>
  );
}

// Calcola rank PR per un promoter usando le stats complete (identico a RankCard/AchievementsTab)
function getPromoterRankBadge(promoter, achievements, dynamicTiers, allAttendances, allClients, allEvents, allPromoters) {
  if (!achievements || achievements.length === 0 || !promoter) return null;
  const stats = computePromoterStats(promoter, allClients, allAttendances, allEvents, allPromoters);
  const unlocked = computeAutoUnlocked(achievements, stats);
  const pr = computePRPoints(achievements, unlocked, stats);
  const isGoat = unlocked.size === achievements.length && achievements.length > 0;
  return getRankInfo(pr, isGoat, dynamicTiers).current;
}

function buildRanking(promoters, events, attendances, from, to) {
  // Date-giorno 'YYYY-MM-DD' e intervallo che parte a mezzanotte (settimana/mese): confronto fra stringhe,
  // stesso esito di isWithinInterval(parseISO(d), ...) senza il parse per ogni evento. Altri casi: percorso originale.
  const fastRange = from.getHours() === 0 && from.getMinutes() === 0 && from.getSeconds() === 0 && from.getMilliseconds() === 0 && +from <= +to;
  const fromKey = fastRange ? localDayKey(from) : null;
  const toKey = fastRange ? localDayKey(to) : null;
  const eventIds = new Set(
    events.filter(e => {
      if (!e.date) return false;
      if (fastRange) {
        const k = validDayKey(e.date);
        if (k) return k >= fromKey && k <= toKey;
      }
      try { return isWithinInterval(parseISO(e.date), { start: from, end: to }); }
      catch { return false; }
    }).map(e => e.id)
  );
  const revenueMap = {};
  attendances.forEach(a => {
    if (!a.promoter_id || a.client_id || !eventIds.has(a.event_id)) return;
    revenueMap[a.promoter_id] = (revenueMap[a.promoter_id] || 0) + (a.revenue || 0);
  });
  return promoters
    .filter(p => isVisibleInStats(p) && p.ruolo !== 'ragazza_immagine')
    .map(p => ({ id: p.id, name: p.name, revenue: revenueMap[p.id] || 0, photoUrl: p.photo_url || null }))
    .sort((a, b) => b.revenue - a.revenue);
}

function RankingSection({ title, subtitle, note, icon: Icon, accentColor, ranking, myPromoter, rankBadges }) {
  const myIndex = ranking.findIndex(p => p.id === myPromoter?.id);
  const myEntry = ranking[myIndex];
  const above = myIndex > 0 ? ranking[myIndex - 1] : null;
  const below = myIndex < ranking.length - 1 ? ranking[myIndex + 1] : null;
  const first = ranking[0];
  const gapFromFirst = first && myEntry ? first.revenue - myEntry.revenue : 0;
  const isFirst = myIndex === 0;
  const position = myIndex + 1;
  const totalPlayers = ranking.length;
  const noData = ranking.every(p => p.revenue === 0);

  const positionColor = position === 1 ? 'text-yellow-400' : position <= 3 ? 'text-orange-400' : 'text-muted-foreground';
  const positionBg = position === 1 ? 'bg-yellow-400/10 border-yellow-400/30' : position <= 3 ? 'bg-orange-400/10 border-orange-400/30' : 'bg-card border-border';

  return (
    <Div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 text-center space-y-2"
        style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.15)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <Div className="flex items-center justify-center mb-2">
          <SectionHeader icon={Icon} title={title} color={accentColor} size="lg" />
        </Div>
        <P className="text-xs text-muted-foreground">{subtitle}</P>
        <P className="text-[10px] text-muted-foreground italic">{note}</P>
        {noData && (
          <P className="text-sm text-muted-foreground italic mt-3">Nessuna serata registrata in questo periodo.</P>
        )}
      </motion.div>

      {!noData && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className={`relative overflow-hidden rounded-2xl border p-6 text-center space-y-1 ${positionBg}`}
            style={{ boxShadow: `0 4px 24px -8px ${position === 1 ? 'rgba(251,191,36,0.2)' : 'rgba(0,0,0,0.2)'}` }}
          >
            {position <= 3 && (
              <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${position === 1 ? '#fbbf24' : '#fb923c'}, transparent)` }} />
            )}
            <P className="text-xs text-muted-foreground uppercase tracking-wider mb-2">La Tua Posizione</P>
            <Div className={`text-6xl font-black ${positionColor}`}>#{position}</Div>
            <P className="text-sm font-semibold text-foreground">{myPromoter.name}</P>
            <P className="text-xl font-bold text-primary mt-1">€{(myEntry?.revenue || 0).toLocaleString('it-IT')}</P>
            <P className="text-xs text-muted-foreground">su {totalPlayers} promoter</P>
          </motion.div>

          <Div className="space-y-2">
            {above ? (
              <RankRow position={myIndex} name={above.name} revenue={above.revenue} variant="above"
                gap={above.revenue - (myEntry?.revenue || 0)}
                gapLabel={`+€${(above.revenue - (myEntry?.revenue || 0)).toLocaleString('it-IT')} davanti a te`}
                photoUrl={above.photoUrl} />
            ) : (
              <Div className="relative overflow-hidden rounded-2xl bg-yellow-400/10 border border-yellow-400/30 p-4 flex items-center gap-3">
                <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
                  style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
                <Trophy className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <P className="text-sm font-bold text-yellow-400">Sei in testa! Mantieni il vantaggio! 🏆</P>
              </Div>
            )}

            <RankRow position={position} name={myPromoter.name} revenue={myEntry?.revenue || 0} variant="me"
              photoUrl={myPromoter.photo_url} />

            {below ? (
              <RankRow position={myIndex + 2} name={below.name} revenue={below.revenue} variant="below"
                gap={(myEntry?.revenue || 0) - below.revenue}
                gapLabel={`-€${((myEntry?.revenue || 0) - below.revenue).toLocaleString('it-IT')} dietro di te`}
                photoUrl={below.photoUrl} />
            ) : (
              <Div className="rounded-2xl bg-card border border-white/[0.06] p-4 text-center">
                <P className="text-xs text-muted-foreground italic">Sei l'ultimo — dai tutto! 💪</P>
              </Div>
            )}
          </Div>

          {!isFirst && (
            <Div className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-5 text-center space-y-1"
              style={{ boxShadow: '0 4px 24px -8px rgba(167,139,250,0.12)' }}>
              <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-40"
                style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
              <P className="text-xs text-muted-foreground">Ti mancano ancora</P>
              <P className="text-2xl font-black text-primary">€{gapFromFirst.toLocaleString('it-IT')}</P>
              <P className="text-xs text-muted-foreground">di fatturato dal <Span className="font-semibold text-foreground">primo posto</Span></P>
            </Div>
          )}
        </>
      )}
    </Div>
  );
}

export default function VibraVS({ myPromoter }) {
  const { user } = useAuth();
  const isAdminOrSuper4 = user?.role === 'admin' || user?.role === 'super4';
  const { from: weekFrom, to: weekTo } = useMemo(() => getDisplayWeekRange(), []);
  const monthFrom = useMemo(() => startOfMonth(new Date()), []);
  const monthTo = useMemo(() => endOfMonth(new Date()), []);

  const { data: promoters = EMPTY_ARR } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 15 * 60000, gcTime: 20 * 60000, refetchOnWindowFocus: false, retry: 0,
  });

  const { data: events = EMPTY_ARR } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 15 * 60000, gcTime: 20 * 60000, refetchOnWindowFocus: false, retry: 0,
  });

  const { data: attendances = EMPTY_ARR } = useQuery({
    queryKey: ['attendances-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
refetchOnWindowFocus: false, retry: 0,
  });

  const { data: achievements = EMPTY_ARR } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.filter({ is_active: true }),
    staleTime: 15 * 60000, gcTime: 20 * 60000, refetchOnWindowFocus: false, retry: 0,
  });

  const { data: clients = EMPTY_ARR } = useQuery({
    queryKey: ['clients-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE,
    queryFn: () => fetchAll(base44.entities.Client, {}, { sort: '-created_date' }),
refetchOnWindowFocus: false, retry: 0,
  });

  const weekRanking = useMemo(() => buildRanking(promoters, events, attendances, weekFrom, weekTo), [promoters, events, attendances, weekFrom, weekTo]);
  const monthRanking = useMemo(() => buildRanking(promoters, events, attendances, monthFrom, monthTo), [promoters, events, attendances, monthFrom, monthTo]);

  // Calcola rank badge per ogni promoter (usato nelle righe classifica e nella classifica PR)
  const rankBadges = useMemo(() => {
    if (achievements.length === 0) return {};
    const dynamicTiers = getDynamicRankTiers(achievements); // uguale per tutti: una volta sola (prima: una per promoter)
    const map = {};
    promoters.forEach(p => {
      map[p.id] = getPromoterRankBadge(p, achievements, dynamicTiers, attendances, clients, events, promoters);
    });
    return map;
  }, [promoters, achievements, attendances, clients, events]);

  // Classifica PR: promoter ordinati per PR points
  const prRanking = useMemo(() => {
    return promoters
      .filter(p => isVisibleInStats(p) && p.ruolo !== 'ragazza_immagine')
      .map(p => {
        const badge = rankBadges[p.id];
        return { id: p.id, name: p.name, rank: badge, photoUrl: p.photo_url || null };
      })
      .sort((a, b) => {
        if (!a.rank && !b.rank) return 0;
        if (!a.rank) return 1;
        if (!b.rank) return -1;
        return (b.rank.minPR || 0) - (a.rank.minPR || 0);
      });
  }, [promoters, rankBadges]);

  const weekLabel = `${weekFrom.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} – ${weekTo.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}`;
  const monthLabel = new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

  if (!myPromoter) {
    return (
      <Div className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-8 text-center">
        <P className="text-muted-foreground text-sm">Profilo promoter non trovato.</P>
      </Div>
    );
  }

  return (
    <Div className="space-y-10">
      <ChallengeBoard />

      <RankingSection
        title="Classifica Settimanale"
        subtitle={<>Settimana: <Span className="text-foreground font-semibold">{weekLabel}</Span></>}
        note="Si aggiorna ogni lunedì con la settimana precedente"
        icon={Swords}
        ranking={weekRanking}
        myPromoter={myPromoter}
        rankBadges={rankBadges}
      />

      <Div className="border-t border-border/40" />

      <RankingSection
        title="Classifica Mensile"
        subtitle={<>Mese in corso: <Span className="text-foreground font-semibold capitalize">{monthLabel}</Span></>}
        note="Aggiornata in tempo reale con le serate del mese corrente"
        icon={Calendar}
        ranking={monthRanking}
        myPromoter={myPromoter}
        rankBadges={rankBadges}
      />

      <Div className="border-t border-border/40" />

      {/* ── Classifica Rank PR ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <Div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 text-center space-y-2"
          style={{ boxShadow: '0 4px 32px -8px rgba(249,228,76,0.12)' }}>
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
            style={{ background: 'linear-gradient(90deg, transparent, #f9e44c, transparent)' }} />
          <Div className="flex items-center justify-center mb-2">
            <SectionHeader icon={Star} title="Classifica Rank PR" color="#fbbf24" size="lg" />
          </Div>
          <P className="text-xs text-muted-foreground">Posizione nel team basata sugli Achievement sbloccati</P>
        </Div>

        <Div className="space-y-2">
          {(() => {
            const myIndex = prRanking.findIndex(e => e.id === myPromoter?.id);
            const visibleEntries = isAdminOrSuper4
              ? prRanking.map((e, i) => ({ entry: e, i }))
              : [
                  myIndex > 0 ? { entry: prRanking[myIndex - 1], i: myIndex - 1 } : null,
                  myIndex >= 0 ? { entry: prRanking[myIndex], i: myIndex } : null,
                  myIndex < prRanking.length - 1 ? { entry: prRanking[myIndex + 1], i: myIndex + 1 } : null,
                ].filter(Boolean);
            return visibleEntries.map(({ entry, i }) => {
              const isMe = entry.id === myPromoter?.id;
              const rank = entry.rank;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`relative overflow-hidden rounded-xl border p-3 flex items-center gap-3 ${
                    isMe ? 'border-primary/40 bg-primary/8' : 'border-border/40 bg-card'
                  }`}
                  style={isMe ? { boxShadow: '0 2px 12px -4px rgba(167,139,250,0.2)' } : {}}
                >
                  {isMe && <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-50"
                    style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />}
                  <Div className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center shrink-0">
                    <Span className="text-[10px] font-bold text-muted-foreground">#{i + 1}</Span>
                  </Div>
                  <PromoterAvatar name={entry.name} photoUrl={entry.photoUrl} size={7} />
                  <P className={`flex-1 text-sm font-semibold truncate ${isMe ? 'text-primary' : 'text-foreground'}`}>
                    {entry.name}{isMe ? ' (tu)' : ''}
                  </P>
                  {rank ? (
                    <Div className="flex items-center gap-1.5 shrink-0">
                      <Span className="text-lg">{rank.emoji}</Span>
                      <Span className="text-xs font-bold px-2 py-0.5 rounded-lg border"
                        style={{ borderColor: `${rank.color}40`, color: rank.color, background: `${rank.color}12` }}>
                        {rank.label}
                      </Span>
                    </Div>
                  ) : (
                    <Span className="text-xs text-muted-foreground">Nessun rank</Span>
                  )}
                </motion.div>
              );
            });
          })()}
        </Div>
      </motion.div>
    </Div>
  );
}