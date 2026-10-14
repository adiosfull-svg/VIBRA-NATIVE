// Port di src/components/promoter/PromoterCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Pencil, Instagram, Target, Star, ChevronDown, GripVertical, Users, UserPlus } from '@/ui/icons.generated';
import { useNavigate } from '@/web/router';
import { preloadPage } from '@/web/lib/pagePreload';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import { startOfWeek, format, subWeeks, parseISO, isWithinInterval, endOfWeek } from 'date-fns';
import { it } from 'date-fns/locale';
import { computePromoterAggregates } from '@/legacy/utils/promoterAggregates';
import PromoterGoalsProgress from './PromoterGoalsProgress';
import { PromoterSeasonStatsCompact } from './PromoterSeasonStats';
import PromoterInstagramGrowth from './PromoterInstagramGrowth';

import { Btn, Div, P, Span } from '@/ui/html';
import { A, Defs, Img, Stop, SvgLinearGradient } from '@/ui/elements';

const RUOLI_LABELS = {
  fondatore: 'Fondatore',
  super4: 'Super 4',
  capogruppo: 'Capogruppo',
  pr: 'PR',
  ragazza_immagine: 'Ragazza Immagine',
};

export default function PromoterCard({ promoter, attendances, events, onEdit, onGoals, onUpdateFollowers, clients = [], achievements = [], promoterAchievements = [], promoterRanks = [], dragHandleProps }) {
  const navigate = useNavigate();
  const [showTopEvents, setShowTopEvents] = useState(false);
  const [topEventsLimit, setTopEventsLimit] = useState(5);
  const [showSeasons, setShowSeasons] = useState(false);
  const [showIgGrowth, setShowIgGrowth] = useState(false);

  // Mappa eventi per lookup O(1) invece di events.find lineare per ogni presenza.
  const eventsById = useMemo(() => {
    const m = {};
    (events || []).forEach(e => { m[e.id] = e; });
    return m;
  }, [events]);

  // Aggregazione condivisa: stessi numeri di classifica e Miei Progressi
  // (filtro anti-orfane + deduplica per event_id + soglia tavoli dell'evento).
  const agg = useMemo(
    () => computePromoterAggregates(promoter.id, attendances, events),
    [promoter.id, attendances, events]
  );
  const pa = agg.myAtts;
  const totalRevenue = agg.totalRevenue;
  const totalPresences = agg.serateFatturate;
  const totalTables = agg.totalTables;
  const monthlyRevenue = agg.monthlyRevenue;
  const monthlyTables = agg.monthlyTables;
  const monthlyFri = agg.monthlyFri;
  const monthlySat = agg.monthlySat;
  const monthlySun = agg.monthlySun;

  const now = useMemo(() => new Date(), []);

  // Grafico ultime 12 settimane
  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(now, 11 - i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const label = format(weekStart, 'dd/MM', { locale: it });
    const revenue = pa.reduce((s, a) => {
      const event = eventsById[a.event_id];
      if (!event?.date) return s;
      const d = parseISO(event.date);
      if (isWithinInterval(d, { start: weekStart, end: weekEnd })) {
        return s + (a.revenue || 0);
      }
      return s;
    }, 0);
    return { label, revenue };
  });

  const hasChartData = weeklyData.some(w => w.revenue > 0);

  // Deferred chart render: Recharts ResponsiveContainer + AreaChart è costoso
  // (ResizeObserver + layout SVG + paint). Renderizzarlo subito al mount per
  // ogni card compete con l'animazione dash-fade-up → stutter. Rimandiamo a
  // requestIdleCallback così il chart appare dopo che l'animazione è terminata.
  const [chartReady, setChartReady] = useState(false);
  useEffect(() => {
    if (!hasChartData) return;
    let cancelled = false;
    const run = () => { if (!cancelled) setChartReady(true); };
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(run, { timeout: 2000 });
      return () => { cancelled = true; cancelIdleCallback(id); };
    }
    const t = setTimeout(run, 500);
    return () => { cancelled = true; clearTimeout(t); };
  }, [hasChartData]);

  return (
    <Btn
      className="relative rounded-xl bg-card border border-border p-5 hover:border-primary/30 transition-all group flex flex-col gap-4 cursor-pointer"
      onClick={() => navigate(`/promoter/${promoter.id}`)}
      onPointerDown={() => preloadPage('/promoter/:id')}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
      {/* Header */}
      <Div className="flex items-start justify-between">
        <Div className="flex items-center gap-3">
          <Div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm overflow-hidden relative flex-shrink-0">
            {promoter.photo_url ? (
              <Img
                src={promoter.photo_url}
                alt={promoter.name}
                style={{
                  position: 'absolute',
                  width: `${Math.max((promoter.photo_zoom || 1), 1) * 100}%`,
                  height: `${Math.max((promoter.photo_zoom || 1), 1) * 100}%`,
                  objectFit: 'cover',
                  left: `calc(50% + ${promoter.photo_offset_x || 0}px)`,
                  top: `calc(50% + ${promoter.photo_offset_y || 0}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="aspect-square"
              />
            ) : promoter.name?.charAt(0)?.toUpperCase()}
          </Div>
          <Div>
          <P className="font-semibold text-sm">{promoter.name}</P>
          <Div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className={promoter.status === 'attivo' ? 'border-green-500/30 text-green-400 text-[10px]' : 'text-[10px]'}>
              {promoter.status}
            </Badge>
            {promoter.ruolo && (
              <Badge variant="secondary" className="text-[10px]">
                {RUOLI_LABELS[promoter.ruolo] || promoter.ruolo}
              </Badge>
            )}
            {promoter.promoter_from && (
              <Badge variant="secondary" className="text-[10px] bg-secondary/50">
                Promoter dal {format(parseISO(promoter.promoter_from), 'd MMM yyyy', { locale: it })}
              </Badge>
            )}
          </Div>
          </Div>
        </Div>
        <Div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" title="Obiettivi" onClick={e => { e.stopPropagation(); onGoals?.(); }}>
            <Target className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onEdit(); }}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          {dragHandleProps && (
            <Btn
              {...dragHandleProps}
              onClick={e => e.stopPropagation()}
              className="h-7 w-7 flex items-center justify-center cursor-grab active:cursor-grabbing rounded hover:bg-secondary/50"
              accessibilityLabel="Trascina per spostare"
            >
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
            </Btn>
          )}
        </Div>
      </Div>

      {/* Stats */}
      <Div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
        <Div className="rounded-lg bg-secondary/30 p-3">
           <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Fatturato Totale</P>
           <P className="text-lg font-bold text-primary">€{totalRevenue.toLocaleString('it-IT')}</P>
           <P className="text-[10px] text-muted-foreground mt-1">{totalTables.toFixed(1).replace('.', ',')} tavoli</P>
         </Div>
        <Div className="rounded-lg bg-secondary/30 p-3">
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Questo Mese</P>
          <P className="text-lg font-bold" style={{ color: '#60a5fa' }}>€{monthlyRevenue.toLocaleString('it-IT')}</P>
          <P className="text-[10px] text-muted-foreground mt-1">
            {monthlyTables.toFixed(1).replace('.', ',')} tavoli
            {monthlyTables > 0 && (
              <Span className="ml-1 opacity-70">
                (V:{monthlyFri.toFixed(1).replace('.', ',')} S:{monthlySat.toFixed(1).replace('.', ',')} D:{monthlySun.toFixed(1).replace('.', ',')})
              </Span>
            )}
          </P>
        </Div>
        <Div className="rounded-lg bg-secondary/30 p-3">
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Presenza fatturato</P>
          <P className="text-lg font-bold text-green-400">{totalPresences}</P>
          <P className="text-[10px] text-muted-foreground mt-1">serate</P>
        </Div>
      </Div>

      {/* Instagram — rigo espandibile con crescita follower/following */}
      {(() => {
        const igHandle = promoter.ig_username_synced || promoter.instagram;
        const followers = promoter.ig_followers_synced || promoter.instagram_followers || 0;
        const following = promoter.ig_following_synced || promoter.instagram_following || 0;
        const hasIg = igHandle || followers || following || promoter.ig_user_id;
        if (!hasIg) return null;
        return (
          <Btn
            className="rounded-lg border border-pink-500/20 overflow-hidden bg-gradient-to-r from-pink-500/[0.04] to-fuchsia-500/[0.04]"
            onClick={e => e.stopPropagation()}
          >
            <Btn
              button
              onClick={() => setShowIgGrowth(s => !s)}
              className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-pink-500/5 transition-colors">
              <Div className="flex items-center gap-2 min-w-0">
                <Div className="p-1 rounded-md bg-pink-500/15 shrink-0">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                </Div>
                {igHandle ? (
                  <A
                    href={`https://instagram.com/${igHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => { e.stopPropagation(); }}
                    className="text-xs text-pink-400 hover:underline font-medium truncate"
                  >
                    @{igHandle}
                  </A>
                ) : (
                  <Span className="text-xs text-muted-foreground">Instagram</Span>
                )}
              </Div>
              <Div className="flex items-center gap-3 shrink-0">
                <Div className="flex items-center gap-3 text-[11px]">
                  <Span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-pink-400" />
                    <Span className="font-semibold text-foreground">{Number(followers).toLocaleString('it-IT')}</Span>
                    <Span className="text-muted-foreground">follower</Span>
                  </Span>
                  <Span className="flex items-center gap-1">
                    <UserPlus className="w-3 h-3 text-fuchsia-400" />
                    <Span className="font-semibold text-foreground">{Number(following).toLocaleString('it-IT')}</Span>
                    <Span className="text-muted-foreground">seguiti</Span>
                  </Span>
                </Div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showIgGrowth ? 'rotate-180' : ''}`} />
              </Div>
            </Btn>
            {showIgGrowth && (
              <Div className="border-t border-pink-500/15 px-3 py-3 bg-secondary/20">
                <PromoterInstagramGrowth promoterId={promoter.id} />
              </Div>
            )}
          </Btn>
        );
      })()}

      {/* Goals progress */}
      {promoter.goals?.length > 0 && (
        <Btn className="border-t border-border pt-3" onClick={e => e.stopPropagation()}>
          <PromoterGoalsProgress promoter={promoter} attendances={pa} events={events} clients={clients} achievements={achievements} promoterAchievements={promoterAchievements} promoterRanks={promoterRanks} compact />
        </Btn>
      )}

      {/* Top serate */}
      {pa.length > 0 && (
        <Btn className="border-t border-border pt-3" onClick={e => e.stopPropagation()}>
          <Btn
            button
            onClick={() => { setShowTopEvents(s => !s); setTopEventsLimit(5); }}
            className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors w-full">
            <Star className="w-3 h-3 text-amber-400" />
            Top serate
            <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${showTopEvents ? 'rotate-180' : ''}`} />
          </Btn>
          {showTopEvents && (() => {
            const topEvts = [...pa]
              .map(a => ({ a, ev: eventsById[a.event_id] }))
              .filter(x => x.ev)
              .sort((x, y) => (y.a.revenue || 0) - (x.a.revenue || 0))
              .slice(0, topEventsLimit);
            return (
              <Div className="mt-2 space-y-1">
                {topEvts.map(({ a, ev }, i) => (
                  <Div key={a.id} className="flex items-center gap-2 text-xs rounded bg-secondary/30 px-2 py-1.5">
                    <Span className="font-bold text-amber-400 w-4">{i + 1}</Span>
                    <Div className="flex-1 min-w-0">
                      <P className="truncate font-medium text-[11px]">{ev.name}</P>
                      <P className="text-[10px] text-muted-foreground">{ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : ''}</P>
                    </Div>
                    <Span className="font-bold text-primary text-[11px]">€{(a.revenue || 0).toLocaleString('it-IT')}</Span>
                  </Div>
                ))}
                {pa.length > 5 && topEventsLimit === 5 && (
                  <Btn
                    button
                    onClick={() => setTopEventsLimit(10)}
                    className="w-full text-[10px] text-primary hover:opacity-80 py-1">
                    Mostra top 10
                  </Btn>
                )}
                {topEventsLimit === 10 && pa.length > 5 && (
                  <Btn
                    button
                    onClick={() => setTopEventsLimit(5)}
                    className="w-full text-[10px] text-muted-foreground hover:opacity-80 py-1">
                    Riduci a top 5
                  </Btn>
                )}
              </Div>
            );
          })()}
        </Btn>
      )}

      {/* Stagioni */}
      {pa.length > 0 && (
        <Btn className="border-t border-border pt-3" onClick={e => e.stopPropagation()}>
          <Btn
            button
            onClick={() => setShowSeasons(s => !s)}
            className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors w-full">
            Confronto Stagioni
            <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${showSeasons ? 'rotate-180' : ''}`} />
          </Btn>
          {showSeasons && (
            <Div className="mt-2">
              <PromoterSeasonStatsCompact attendances={pa} events={events} />
            </Div>
          )}
        </Btn>
      )}

      {/* Weekly chart */}
      <Div>
        <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Andamento Settimanale — ultime 12 settimane</P>
        {hasChartData ? (
          chartReady ? (
            <Div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <Defs>
                    <SvgLinearGradient id={`grad-${promoter.id}`} x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="5%" stopColor="hsl(270 60% 55%)" stopOpacity={0.3} />
                      <Stop offset="95%" stopColor="hsl(270 60% 55%)" stopOpacity={0} />
                    </SvgLinearGradient>
                  </Defs>
                  <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 9 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(240 6% 8%)',
                      border: '1px solid hsl(240 5% 18%)',
                      borderRadius: '6px',
                      fontSize: 11,
                      color: 'hsl(0 0% 95%)',
                    }}
                    formatter={(v) => [`€${v.toLocaleString('it-IT')}`, 'Fatturato']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(270 60% 55%)"
                    strokeWidth={2}
                    fill={`url(#grad-${promoter.id})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Div>
          ) : (
            <Div className="h-20" />
          )
        ) : (
          <Div className="h-20 flex items-center justify-center rounded-lg bg-secondary/20">
            <P className="text-xs text-muted-foreground">Nessun dato nelle ultime 12 settimane</P>
          </Div>
        )}
      </Div>
    </Btn>
  );
}