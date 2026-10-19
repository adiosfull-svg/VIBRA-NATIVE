// Port di src/components/promoter/PromoterQuickInfoPopup.jsx (convertito da scripts/port/codemod.mjs).
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarDays, Flame, Trophy, TrendingUp, Crown, Star } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { computePromoterQuickInfo } from '@/legacy/utils/promoterQuickInfo';
import { computeAutoUnlocked, computePromoterStats } from '@/legacy/utils/achievementLogic';
import { computePRPoints, getRankInfo, getDynamicRankTiers } from '@/legacy/utils/rankSystem';
import { getDisplayWeekRange, getMonthRange, getPromoterPosition } from '@/legacy/utils/vibraRanking';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import { fetchByPromoter, fetchAll } from '@/web/lib/safeData';

import { Btn, Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const Q = { staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 0 };

function VibraLogoBadge({ logoDataUrl }) {
  return (
    <Div className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded overflow-hidden flex items-center justify-center opacity-60">
      {logoDataUrl
        ? <Img src={logoDataUrl} alt="" className="w-4 h-4 object-contain" />
        : <Star className="w-3 h-3 text-primary" />}
    </Div>
  );
}

function RankMini({ current, next, progress, prPoints, prToNext, isGoat }) {
  if (!current) return null;
  return (
    <Div className="relative rounded-lg border px-3 py-2.5 overflow-hidden"
      style={{ borderColor: `${current.color}40`, background: `${current.color}0d` }}>
      <Div className="flex items-center gap-2">
        <Div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-lg"
          style={{ borderColor: `${current.color}50`, background: `${current.color}15` }}>
          {current.emoji}
        </Div>
        <Div className="min-w-0 flex-1">
          <P className="text-[9px] uppercase tracking-wider text-muted-foreground">Rank</P>
          <P className="text-xs font-bold truncate" style={{ color: current.color }}>{current.label}</P>
        </Div>
        <Div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bold shrink-0"
          style={{ borderColor: `${current.color}40`, color: current.color, background: `${current.color}12` }}>
          <Star className="w-2.5 h-2.5" />
          {Math.round(prPoints).toLocaleString('it-IT')}
        </Div>
      </Div>
      {!isGoat && next ? (
        <Div className="mt-2 space-y-1">
          <Div className="relative w-full h-2 rounded-full overflow-hidden bg-secondary/50 border border-white/[0.05]">
            <Div className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${current.color}cc, ${next.color}cc)`,
                boxShadow: `0 0 8px ${current.color}80`,
              }} />
          </Div>
          <Div className="flex justify-between text-[9px] text-muted-foreground">
            <Span style={{ color: current.color }} className="font-semibold">{Math.round(prPoints).toLocaleString('it-IT')} PR</Span>
            <Span style={{ color: next.color }} className="font-semibold">-{Math.round(prToNext).toLocaleString('it-IT')} al {next.label}</Span>
          </Div>
        </Div>
      ) : (
        <P className="mt-1.5 text-[10px] font-bold text-center" style={{ color: current.color }}>👑 G.O.A.T.</P>
      )}
    </Div>
  );
}

function PositionCard({ label, position, total, revenue, noData, logoDataUrl }) {
  const posColor = position === 1 ? 'text-yellow-400' : position <= 3 ? 'text-orange-400' : 'text-muted-foreground';
  return (
    <Div className="relative rounded-lg border px-3 py-2.5 bg-card/60 border-border/40 overflow-hidden">
      <P className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</P>
      {noData || position == null ? (
        <P className="text-sm text-muted-foreground mt-0.5">Nessun dato</P>
      ) : (
        <Div className="flex items-baseline gap-1.5 mt-0.5">
          <Span className={`text-lg font-black ${posColor}`}>#{position}</Span>
          <Span className="text-[10px] text-muted-foreground">su {total}</Span>
          <Span className="ml-auto text-xs font-bold text-primary">€{revenue.toLocaleString('it-IT')}</Span>
        </Div>
      )}
      <VibraLogoBadge logoDataUrl={logoDataUrl} />
    </Div>
  );
}

export default function PromoterQuickInfoPopup({ open, promoter, onClose }) {
  const { logoDataUrl } = useVibraLogo();

  const { data: myAttendances = [], isLoading: la } = useQuery({
    queryKey: ['attendances-by-promoter', promoter?.id], queryFn: () => fetchByPromoter(base44.entities.EventAttendance, promoter.id, { sort: '-created_date' }),
    enabled: !!open && !!promoter, ...Q,
  });
  const { data: allAttendances = [], isLoading: laa } = useQuery({
    queryKey: ['attendances-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE, queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
    enabled: !!open && !!promoter, ...Q,
  });
  const { data: events = [], isLoading: le } = useQuery({
    queryKey: ['events'], queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled: !!open && !!promoter, ...Q,
  });
  const { data: promoters = [], isLoading: lp } = useQuery({
    queryKey: ['promoters'], queryFn: () => base44.entities.Promoter.list(),
    enabled: !!open && !!promoter, ...Q,
  });
  const { data: clients = [], isLoading: lc } = useQuery({
    queryKey: ['clients-all'], staleTime: STALE_FULL_TABLE, gcTime: GC_FULL_TABLE, queryFn: () => fetchAll(base44.entities.Client, {}, { sort: '-created_date' }),
    enabled: !!open && !!promoter, ...Q,
  });
  const { data: achievements = [], isLoading: lac } = useQuery({
    queryKey: ['achievements'], queryFn: () => base44.entities.Achievement.filter({ is_active: true }),
    enabled: !!open && !!promoter, ...Q,
  });

  const rankData = useMemo(() => {
    if (!promoter || achievements.length === 0) return null;
    const stats = computePromoterStats(promoter, clients, myAttendances, events, promoters);
    const unlocked = computeAutoUnlocked(achievements, stats);
    const pr = computePRPoints(achievements, unlocked, stats);
    const isGoat = achievements.length > 0 && unlocked.size === achievements.length;
    const tiers = getDynamicRankTiers(achievements);
    return { ...getRankInfo(pr, isGoat, tiers), prPoints: pr, isGoat };
  }, [promoter, achievements, clients, myAttendances, events, promoters]);

  const vsData = useMemo(() => {
    if (!promoter) return null;
    const w = getDisplayWeekRange();
    const m = getMonthRange();
    return {
      week: getPromoterPosition(promoters, events, allAttendances, w.from, w.to, promoter.id),
      month: getPromoterPosition(promoters, events, allAttendances, m.from, m.to, promoter.id),
    };
  }, [promoter, promoters, events, allAttendances]);

  if (!open || !promoter) return null;

  const loading = la || laa || le || lp || lc || lac;
  const pa = myAttendances.filter(a => !a.client_id);
  const info = computePromoterQuickInfo(promoter, pa, events);

  const rows = [
    {
      icon: CalendarDays, color: '#60a5fa', label: 'Data di inizio',
      value: info.promoterFrom ? format(new Date(info.promoterFrom), 'd MMM yyyy', { locale: it }) : '—',
    },
    {
      icon: Flame, color: '#f59e0b', label: 'Streak tavoli in corso',
      value: info.currentStreak > 0 ? `${info.currentStreak} serate` : 'Nessuna',
    },
    {
      icon: Trophy, color: '#a78bfa', label: 'Streak più lunga',
      value: info.longestStreak > 0 ? `${info.longestStreak} serate` : '—',
    },
    {
      icon: TrendingUp, color: '#34d399', label: 'Serate con fatturato',
      value: `${info.serateConFatturato} su ${info.totalSerate}`,
    },
  ];

  return (
    <Div
      className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 backdrop-fade-in p-4"
      onPointerDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); onClose(); } }}>
      <Div className="menu-pop-in w-full max-w-sm rounded-2xl border border-white/10 bg-popover shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <Div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-secondary/40 sticky top-0 z-10">
          <Div className="flex items-center gap-2 min-w-0">
            {promoter.photo_url
              ? <Img src={promoter.photo_url} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
              : <Div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {promoter.name?.charAt(0)?.toUpperCase()}
                </Div>}
            <P className="text-xs font-semibold text-foreground truncate">Info rapide · {promoter.name}</P>
          </Div>
          <Btn
            button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground shrink-0 text-lg leading-none">×</Btn>
        </Div>

        <Div className="p-4 space-y-2.5">
          {loading ? (
            <Div className="flex items-center justify-center py-8">
              <Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </Div>
          ) : (
            <>
              {rankData && (
                <RankMini current={rankData.current} next={rankData.next} progress={rankData.progress}
                  prPoints={rankData.prPoints} prToNext={rankData.prToNext} isGoat={rankData.isGoat} />
              )}

              {vsData && (
                <Div className="grid grid-cols-2 gap-2">
                  <PositionCard label="Vibra VS Settimana" {...vsData.week} logoDataUrl={logoDataUrl} />
                  <PositionCard label="Vibra VS Mese" {...vsData.month} logoDataUrl={logoDataUrl} />
                </Div>
              )}

              {rows.map((r, i) => (
                <Div key={i} className="flex items-center gap-3 rounded-lg bg-card/60 border border-border/40 px-3 py-2.5">
                  <Div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: `${r.color}1a` }}>
                    <r.icon className="w-4 h-4" style={{ color: r.color }} />
                  </Div>
                  <Div className="min-w-0 flex-1">
                    <P className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.label}</P>
                    <P className="text-sm font-semibold text-foreground truncate">{r.value}</P>
                  </Div>
                </Div>
              ))}

              {/* Top serata di sempre */}
              {info.topEvent ? (
                <Div className="flex items-center gap-3 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2.5">
                  <Div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-amber-500/15">
                    <Crown className="w-4 h-4 text-amber-400" />
                  </Div>
                  <Div className="min-w-0 flex-1">
                    <P className="text-[10px] uppercase tracking-wider text-amber-400/80">Top serata di sempre</P>
                    <P className="text-sm font-semibold text-foreground truncate">
                      {info.topEvent.name}{info.topEvent.venue ? ` · ${info.topEvent.venue}` : ''}
                    </P>
                    <P className="text-[11px] text-muted-foreground">
                      {format(new Date(info.topEvent.date), 'd MMM yyyy', { locale: it })} · €{info.topRevenue.toLocaleString('it-IT')}
                    </P>
                  </Div>
                </Div>
              ) : (
                <Div className="flex items-center gap-3 rounded-lg bg-card/60 border border-border/40 px-3 py-2.5">
                  <Div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-secondary">
                    <Crown className="w-4 h-4 text-muted-foreground" />
                  </Div>
                  <P className="text-sm text-muted-foreground">Nessuna serata con fatturato</P>
                </Div>
              )}
            </>
          )}
        </Div>
      </Div>
    </Div>
  );
}