// Port di src/components/promoter/PromoterCardMobile.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Pencil, Instagram, Target, ChevronDown, Star, GripVertical } from '@/ui/icons.generated';
import { useNavigate } from '@/web/router';
import { preloadPage } from '@/web/lib/pagePreload';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import { parseISO, isWithinInterval, format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { it } from 'date-fns/locale';
import { computePromoterAggregates } from '@/legacy/utils/promoterAggregates';
import PromoterGoalsProgress from './PromoterGoalsProgress';
import { PromoterSeasonStatsCompact } from './PromoterSeasonStats';
import CachedImage from '@/web/components/shared/CachedImage';

import { Btn, Div, P, Span } from '@/ui/html';
import { A, Defs, Stop, SvgLinearGradient } from '@/ui/elements';

const RUOLI_LABELS = {
  fondatore: 'Fondatore',
  super4: 'Super 4',
  capogruppo: 'Capogruppo',
  pr: 'PR',
  ragazza_immagine: 'Ragazza Immagine',
};

// Card compatta pensata per la visualizzazione mobile, con opzione di espansione
// per mostrare gli stessi dati approfonditi della card desktop.
export default function PromoterCardMobile({ promoter, attendances, events, onEdit, onGoals, clients = [], achievements = [], promoterAchievements = [], promoterRanks = [], dragHandleProps }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const eventsById = useMemo(() => {
    const m = {};
    (events || []).forEach(e => { m[e.id] = e; });
    return m;
  }, [events]);

  // Aggregazione condivisa: stessi numeri di classifica, card desktop e Miei Progressi.
  const agg = useMemo(
    () => computePromoterAggregates(promoter.id, attendances, events),
    [promoter.id, attendances, events]
  );
  const pa = agg.myAtts;
  const totalRevenue = agg.totalRevenue;
  const totalTables = agg.totalTables;
  const monthlyRevenue = agg.monthlyRevenue;

  const now = useMemo(() => new Date(), []);

  const topEvents = expanded
    ? [...pa]
        .map(a => ({ a, ev: eventsById[a.event_id] }))
        .filter(x => x.ev)
        .sort((x, y) => (y.a.revenue || 0) - (x.a.revenue || 0))
        .slice(0, 5)
    : [];

  const weeklyData = expanded
    ? Array.from({ length: 12 }, (_, i) => {
        const weekStart = startOfWeek(subWeeks(now, 11 - i), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const label = format(weekStart, 'dd/MM', { locale: it });
        const revenue = pa.reduce((s, a) => {
          const event = eventsById[a.event_id];
          if (!event?.date) return s;
          const d = parseISO(event.date);
          return isWithinInterval(d, { start: weekStart, end: weekEnd }) ? s + (a.revenue || 0) : s;
        }, 0);
        return { label, revenue };
      })
    : [];
  const hasChartData = weeklyData.some(w => w.revenue > 0);

  return (
    <Btn
      className="relative rounded-xl bg-card border border-border p-3 active:border-primary/30 transition-all cursor-pointer space-y-2.5"
      onClick={() => navigate(`/promoter/${promoter.id}`)}
      onPointerDown={() => preloadPage('/promoter/:id')}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
      {/* Riga 1: avatar + nome + azioni */}
      <Div className="flex items-center gap-2.5">
        <Div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm overflow-hidden relative flex-shrink-0">
          {promoter.photo_url ? (
            <CachedImage
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

        <Div className="flex-1 min-w-0">
          <P className="font-semibold text-sm truncate">{promoter.name}</P>
          <Div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <Badge variant="outline" className={`shrink-0 ${promoter.status === 'attivo' ? 'border-green-500/30 text-green-400 text-[9px]' : 'text-[9px]'}`}>
              {promoter.status}
            </Badge>
            {promoter.ruolo && (
              <Badge variant="secondary" className="text-[9px] shrink-0">
                {RUOLI_LABELS[promoter.ruolo] || promoter.ruolo}
              </Badge>
            )}
            {promoter.instagram && (
              <A
                href={`https://instagram.com/${promoter.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="shrink-0"
              >
                <Instagram className="w-3 h-3 text-pink-400" />
              </A>
            )}
          </Div>
        </Div>

        <Btn className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
          {onGoals && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" title="Obiettivi" onClick={() => onGoals()}>
              <Target className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit()}>
            <Pencil className="w-4 h-4" />
          </Button>
          {dragHandleProps && (
            <Div
              {...dragHandleProps}
              className="h-8 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing rounded hover:bg-secondary/50"
              accessibilityLabel="Trascina per spostare"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </Div>
          )}
        </Btn>
      </Div>

      {/* Riga 2: mini stats */}
      <Div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
        <Div className="text-center">
          <P className="text-[9px] text-muted-foreground uppercase tracking-wider">Totale</P>
          <P className="text-xs font-bold text-primary">€{totalRevenue.toLocaleString('it-IT')}</P>
        </Div>
        <Div className="text-center">
          <P className="text-[9px] text-muted-foreground uppercase tracking-wider">Mese</P>
          <P className="text-xs font-bold" style={{ color: '#60a5fa' }}>€{monthlyRevenue.toLocaleString('it-IT')}</P>
        </Div>
        <Div className="text-center">
          <P className="text-[9px] text-muted-foreground uppercase tracking-wider">Tavoli</P>
          <P className="text-xs font-bold" style={{ color: '#4ade80' }}>{totalTables.toFixed(1).replace('.', ',')}</P>
        </Div>
      </Div>

      {/* Pulsante espansione */}
      <Btn
        button
        onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}
        className="flex items-center justify-center gap-1 w-full text-[10px] text-muted-foreground hover:text-foreground py-1 border-t border-border">
        {expanded ? 'Mostra meno' : 'Mostra tutti i dati'}
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </Btn>

      {expanded && (
        <Btn className="space-y-2.5" onClick={e => e.stopPropagation()}>
          {(promoter.instagram_followers || promoter.instagram_following) && (
            <Div className="rounded-lg bg-secondary/30 px-3 py-2 border border-border/50 flex items-center gap-3 text-[11px] text-muted-foreground">
              {promoter.instagram_followers ? (
                <Span><Span className="font-semibold text-foreground">{Number(promoter.instagram_followers).toLocaleString('it-IT')}</Span> follower</Span>
              ) : null}
              {promoter.instagram_following ? (
                <Span><Span className="font-semibold text-foreground">{Number(promoter.instagram_following).toLocaleString('it-IT')}</Span> seguiti</Span>
              ) : null}
            </Div>
          )}

          {promoter.goals?.length > 0 && (
            <Div className="border-t border-border pt-2.5">
              <PromoterGoalsProgress promoter={promoter} attendances={pa} events={events} clients={clients} achievements={achievements} promoterAchievements={promoterAchievements} promoterRanks={promoterRanks} compact />
            </Div>
          )}

          {topEvents.length > 0 && (
            <Div className="border-t border-border pt-2.5">
              <P className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
                <Star className="w-3 h-3 text-amber-400" /> Top serate
              </P>
              <Div className="space-y-1">
                {topEvents.map(({ a, ev }, i) => (
                  <Div key={a.id} className="flex items-center gap-2 text-xs rounded bg-secondary/30 px-2 py-1.5">
                    <Span className="font-bold text-amber-400 w-4">{i + 1}</Span>
                    <Div className="flex-1 min-w-0">
                      <P className="truncate font-medium text-[11px]">{ev.name}</P>
                      <P className="text-[10px] text-muted-foreground">{ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : ''}</P>
                    </Div>
                    <Span className="font-bold text-primary text-[11px]">€{(a.revenue || 0).toLocaleString('it-IT')}</Span>
                  </Div>
                ))}
              </Div>
            </Div>
          )}

          {pa.length > 0 && (
            <Div className="border-t border-border pt-2.5">
              <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Confronto Stagioni</P>
              <PromoterSeasonStatsCompact attendances={pa} events={events} />
            </Div>
          )}

          <Div className="border-t border-border pt-2.5">
            <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Andamento Settimanale — ultime 12 settimane</P>
            {hasChartData ? (
              <Div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <Defs>
                      <SvgLinearGradient id={`grad-mob-${promoter.id}`} x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="5%" stopColor="hsl(270 60% 55%)" stopOpacity={0.3} />
                        <Stop offset="95%" stopColor="hsl(270 60% 55%)" stopOpacity={0} />
                      </SvgLinearGradient>
                    </Defs>
                    <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 8 }} tickLine={false} axisLine={false} />
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
                    <Area type="monotone" dataKey="revenue" stroke="hsl(270 60% 55%)" strokeWidth={2} fill={`url(#grad-mob-${promoter.id})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Div>
            ) : (
              <Div className="h-16 flex items-center justify-center rounded-lg bg-secondary/20">
                <P className="text-[11px] text-muted-foreground">Nessun dato nelle ultime 12 settimane</P>
              </Div>
            )}
          </Div>
        </Btn>
      )}
    </Btn>
  );
}