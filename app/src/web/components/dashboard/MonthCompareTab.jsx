// Port di src/components/dashboard/MonthCompareTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { parseISO, startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from '@/legacy/utils/tables';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { TrendingUp, TrendingDown, Minus, Crown, DollarSign, BarChart3, CalendarDays, Users, ArrowRight, ChevronDown } from '@/ui/icons.generated';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, Img } from '@/ui/elements';

const FESTIVO_ICON_URL = 'https://media.base44.com/images/public/69de4f1f7f53d9f187d01392/8e5c2672c_image.png';
const COLOR_A = '#a78bfa';
const COLOR_B = '#60a5fa';

// ── Calcoli ──
function computeMonthStats(events, attendances, promoters, monthStr) {
  if (!monthStr) return null;
  const [y, m] = monthStr.split('-').map(Number);
  const monthDate = new Date(y, m - 1, 1);
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);

  const monthEvents = events
    .filter(e => e.date && isWithinInterval(parseISO(e.date), { start, end }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalRevenue = monthEvents.reduce((s, e) => s + (e.total_revenue || 0), 0);

  // Stat per-promoter
  const promoterMap = {};
  promoters.forEach(p => { promoterMap[p.id] = { id: p.id, name: p.name, revenue: 0, tables: 0, events: new Set() }; });

  let totalTables = 0;
  monthEvents.forEach(ev => {
    const [ey, em, ed] = ev.date.split('-').map(Number);
    const dow = new Date(ey, em - 1, ed).getDay();
    const eventAtts = attendances.filter(a => a.event_id === ev.id && a.promoter_id && !a.client_id);
    eventAtts.forEach(a => {
      const tables = calcTables(a.revenue || 0, dow, ev.table_threshold);
      totalTables += tables;
      if (promoterMap[a.promoter_id]) {
        promoterMap[a.promoter_id].revenue += a.revenue || 0;
        promoterMap[a.promoter_id].tables += tables;
        promoterMap[a.promoter_id].events.add(ev.id);
      }
    });
  });

  const promoterRanking = Object.values(promoterMap)
    .map(p => ({ ...p, events: p.events.size }))
    .filter(p => p.revenue > 0 || p.tables > 0)
    .sort((a, b) => b.revenue - a.revenue);

  const bestPromoter = promoterRanking[0] || null;

  // Breakdown serata per serata
  const eventBreakdown = monthEvents.map(ev => {
    const [ey, em, ed] = ev.date.split('-').map(Number);
    const dow = new Date(ey, em - 1, ed).getDay();
    const eventAtts = attendances.filter(a => a.event_id === ev.id && a.promoter_id && !a.client_id);
    const eventTables = eventAtts.reduce((s, a) => s + calcTables(a.revenue || 0, dow, ev.table_threshold), 0);
    const eventPromoterRanking = eventAtts
      .map(a => {
        const p = promoters.find(pr => pr.id === a.promoter_id);
        return { promoter: p, status: p?.status, revenue: a.revenue || 0, tables: calcTables(a.revenue || 0, dow, ev.table_threshold) };
      })
      .filter(x => x.promoter)
      .sort((a, b) => b.revenue - a.revenue);
    return {
      id: ev.id,
      name: ev.name,
      date: ev.date,
      venue: ev.venue || '',
      isExtra: ev.is_extra,
      revenue: ev.total_revenue || 0,
      tables: eventTables,
      topPromoter: eventPromoterRanking[0] || null,
      promoterCount: eventAtts.length,
      promoterList: eventPromoterRanking,
    };
  });

  return {
    monthStr,
    monthLabel: format(monthDate, 'MMMM yyyy', { locale: it }),
    totalRevenue,
    totalTables,
    eventCount: monthEvents.length,
    bestPromoter,
    promoterRanking,
    eventBreakdown,
  };
}

// ── UI Helpers ──
function VenueLogo({ venue, isExtra, size = 'w-6 h-6' }) {
  const { getVenueLogo } = useAllVenueLogos();
  const { logoUrl } = venue ? getVenueLogo(venue) : { logoUrl: '' };
  if (logoUrl) {
    return (
      <Div className={`${size} rounded overflow-hidden bg-card flex items-center justify-center shrink-0`}>
        <Img src={logoUrl} alt={venue} className="w-full h-full object-contain" />
      </Div>
    );
  }
  if (isExtra) {
    return (
      <Div className={`${size} rounded overflow-hidden bg-card flex items-center justify-center shrink-0`}>
        <Img src={FESTIVO_ICON_URL} alt="Festivo" className="w-full h-full object-contain" />
      </Div>
    );
  }
  return (
    <Div className={`${size} rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-secondary`}>
      {venue?.charAt(0) || '?'}
    </Div>
  );
}

function DeltaPct({ current, previous, invert = false, money = false }) {
  if (previous === 0 && current === 0) return <Span className="text-xs text-muted-foreground">—</Span>;
  if (previous === 0) return <Span className="text-xs text-green-400 font-semibold">Nuovo</Span>;
  const diff = current - previous;
  const pct = (diff / previous) * 100;
  const isUp = pct > 0.5;
  const isDown = pct < -0.5;
  if (!isUp && !isDown) return (
    <Span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="w-3 h-3" />0%
          </Span>
  );
  const positive = invert ? isDown : isUp;
  return (
    <Span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {money && diff !== 0 ? `€${Math.abs(diff).toLocaleString('it-IT')} (${isUp ? '+' : ''}${pct.toFixed(1)}%)` : `${isUp ? '+' : ''}${pct.toFixed(1)}%`}
    </Span>
  );
}

function KpiCompareCard({ icon: Icon, label, statsA, statsB, fmt }) {
  const valA = statsA?.value ?? 0;
  const valB = statsB?.value ?? 0;
  return (
    <Div className="rounded-xl border border-white/[0.06] bg-card p-3.5 space-y-2.5">
      <Div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <P className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</P>
      </Div>
      <Div className="grid grid-cols-2 gap-2">
        <Div className="text-left">
          <P className="text-lg font-bold leading-tight" style={{ color: COLOR_A }}>{fmt(valA)}</P>
          <P className="text-[9px] text-muted-foreground capitalize">{statsA?.label || '—'}</P>
        </Div>
        <Div className="text-right">
          <P className="text-lg font-bold leading-tight" style={{ color: COLOR_B }}>{fmt(valB)}</P>
          <P className="text-[9px] text-muted-foreground capitalize">{statsB?.label || '—'}</P>
        </Div>
      </Div>
      <Div className="pt-1.5 border-t border-white/[0.04]">
        <DeltaPct current={valA} previous={valB} money={label.includes('Fatturato')} />
      </Div>
    </Div>
  );
}

// ── Tile Serata Espandibile ──
function EventTile({ ev, color }) {
  const [expanded, setExpanded] = useState(false);
  const hasPromoters = ev.promoterList && ev.promoterList.length > 0;

  return (
    <Div className="rounded-lg bg-secondary/20 overflow-hidden">
      <Btn
        onClick={() => hasPromoters && setExpanded(e => !e)}
        className={`w-full flex items-center gap-2.5 p-2.5 transition-colors ${hasPromoters ? 'hover:bg-secondary/30 cursor-pointer' : 'cursor-default'}`}
      >
        <VenueLogo venue={ev.venue} isExtra={ev.isExtra} />
        <Div className="flex-1 min-w-0 text-left">
          <P className="text-xs font-medium truncate">{ev.name}</P>
          <P className="text-[10px] text-muted-foreground">
            {format(parseISO(ev.date), 'd MMM yyyy', { locale: it })}
            {ev.topPromoter?.promoter && <Span> · 🏆 {ev.topPromoter.promoter.name}</Span>}
          </P>
        </Div>
        <Div className="text-right shrink-0">
          <P className="text-xs font-bold" style={{ color }}>€{ev.revenue.toLocaleString('it-IT')}</P>
          <P className="text-[10px] text-muted-foreground">{ev.tables.toFixed(1)} tav. · {ev.promoterCount} PR</P>
        </Div>
        {hasPromoters && (
          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        )}
      </Btn>
      {expanded && hasPromoters && (
        <Div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-white/[0.04]">
          {ev.promoterList.map((p, i) => {
            const isInattivo = p.status === 'inattivo';
            return (
              <Div key={i} className={`flex items-center gap-2 text-xs py-1 px-1 rounded ${isInattivo ? 'opacity-50' : ''}`}>
                <Span className="w-5 text-center text-[10px] font-bold text-muted-foreground">{i + 1}</Span>
                <Span className="flex-1 truncate font-medium">{p.promoter.name}{isInattivo && <Span className="text-[9px] text-muted-foreground ml-1">(inattivo)</Span>}</Span>
                <Span className="text-muted-foreground text-[10px] w-14 text-right">{p.tables.toFixed(1)} tav.</Span>
                <Span className="font-semibold w-20 text-right" style={{ color: p.revenue > 0 ? color : undefined }}>€{p.revenue.toLocaleString('it-IT')}</Span>
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}

// ── Main Component ──
export default function MonthCompareTab({ events, attendances, promoters }) {
  const now = new Date();
  const defaultA = format(now, 'yyyy-MM');
  const defaultB = format(new Date(now.getFullYear() - 1, now.getMonth(), 1), 'yyyy-MM');
  const [monthA, setMonthA] = useState(defaultA);
  const [monthB, setMonthB] = useState(defaultB);

  const statsA = useMemo(() => computeMonthStats(events, attendances, promoters, monthA), [events, attendances, promoters, monthA]);
  const statsB = useMemo(() => computeMonthStats(events, attendances, promoters, monthB), [events, attendances, promoters, monthB]);

  // Trova promoter presenti in entrambi i mesi per confronto diretto
  const commonPromoterIds = useMemo(() => {
    if (!statsA || !statsB) return [];
    const setA = new Set(statsA.promoterRanking.map(p => p.id));
    return statsB.promoterRanking.filter(p => setA.has(p.id)).map(p => p.id);
  }, [statsA, statsB]);

  if (!statsA || !statsB) return null;

  return (
    <Div className="space-y-4">
      {/* ── Selettore Mesi ── */}
      <Div className="flex flex-wrap items-center gap-3">
        <Div className="flex items-center gap-2">
          <Span className="w-2.5 h-2.5 rounded-full" style={{ background: COLOR_A }} />
          <HtmlInput
            type="month"
            value={monthA}
            onChange={e => setMonthA(e.target.value)}
            className="text-sm bg-card border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary capitalize"
            style={{ borderColor: COLOR_A + '50' }}
          />
        </Div>
        <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
        <Div className="flex items-center gap-2">
          <Span className="w-2.5 h-2.5 rounded-full" style={{ background: COLOR_B }} />
          <HtmlInput
            type="month"
            value={monthB}
            onChange={e => setMonthB(e.target.value)}
            className="text-sm bg-card border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary capitalize"
            style={{ borderColor: COLOR_B + '50' }}
          />
        </Div>
      </Div>

      {/* ── KPI Confronto ── */}
      <Div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCompareCard
          icon={DollarSign}
          label="Fatturato Totale"
          statsA={{ value: statsA.totalRevenue, label: statsA.monthLabel }}
          statsB={{ value: statsB.totalRevenue, label: statsB.monthLabel }}
          fmt={v => `€${v.toLocaleString('it-IT')}`}
        />
        <KpiCompareCard
          icon={BarChart3}
          label="Tavoli Totali"
          statsA={{ value: statsA.totalTables, label: statsA.monthLabel }}
          statsB={{ value: statsB.totalTables, label: statsB.monthLabel }}
          fmt={v => v.toFixed(1)}
        />
        <KpiCompareCard
          icon={CalendarDays}
          label="Serate"
          statsA={{ value: statsA.eventCount, label: statsA.monthLabel }}
          statsB={{ value: statsB.eventCount, label: statsB.monthLabel }}
          fmt={v => String(v)}
        />
        <KpiCompareCard
          icon={Users}
          label="Promoter Attivi"
          statsA={{ value: statsA.promoterRanking.length, label: statsA.monthLabel }}
          statsB={{ value: statsB.promoterRanking.length, label: statsB.monthLabel }}
          fmt={v => String(v)}
        />
      </Div>

      {/* ── Miglior Promoter Confronto ── */}
      <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[{ stats: statsA, color: COLOR_A, label: 'A' }, { stats: statsB, color: COLOR_B, label: 'B' }].map(({ stats, color, label }) => (
          <Div key={label} className="rounded-xl border p-4 space-y-2" style={{ borderColor: color + '30', background: color + '06' }}>
            <Div className="flex items-center gap-2">
              <Crown className="w-4 h-4" style={{ color }} />
              <P className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>Miglior Promoter — {stats.monthLabel}</P>
            </Div>
            {stats.bestPromoter ? (
              <Div className="flex items-center justify-between">
                <Div>
                  <P className="text-sm font-bold text-foreground">{stats.bestPromoter.name}</P>
                  <P className="text-[10px] text-muted-foreground">{stats.bestPromoter.events} serate · {stats.bestPromoter.tables.toFixed(1)} tavoli</P>
                </Div>
                <P className="text-lg font-bold" style={{ color }}>€{stats.bestPromoter.revenue.toLocaleString('it-IT')}</P>
              </Div>
            ) : (
              <P className="text-xs text-muted-foreground">Nessun dato</P>
            )}
          </Div>
        ))}
      </Div>

      {/* ── Classifica Promoter Confronto ── */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4 space-y-3">
        <P className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Classifica Promoter a Confronto</P>
        <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[{ stats: statsA, color: COLOR_A }, { stats: statsB, color: COLOR_B }].map(({ stats, color }) => (
            <Div key={color} className="space-y-1.5">
              <P className="text-[10px] font-semibold capitalize" style={{ color }}>{stats.monthLabel}</P>
              {stats.promoterRanking.length === 0 ? (
                <P className="text-xs text-muted-foreground py-2">Nessun dato</P>
              ) : (
                stats.promoterRanking.slice(0, 8).map((p, i) => (
                  <Div key={p.id} className="flex items-center gap-2 text-xs py-1">
                    <Span className="w-5 text-center text-[10px] font-bold text-muted-foreground">{i + 1}</Span>
                    <Span className="flex-1 truncate font-medium">{p.name}</Span>
                    <Span className="text-muted-foreground text-[10px] w-16 text-right">{p.tables.toFixed(1)} tav.</Span>
                    <Span className="font-bold w-20 text-right" style={{ color }}>€{p.revenue.toLocaleString('it-IT')}</Span>
                  </Div>
                ))
              )}
            </Div>
          ))}
        </Div>
      </Div>

      {/* ── Dettaglio Serata per Serata ── */}
      <Div className="rounded-xl border border-white/[0.06] bg-card overflow-hidden">
        <Div className="px-4 py-3 border-b border-white/[0.06]">
          <P className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dettaglio Serate a Confronto</P>
        </Div>
        <Div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.04]">
          {[{ stats: statsA, color: COLOR_A }, { stats: statsB, color: COLOR_B }].map(({ stats, color }) => (
            <Div key={color} className="p-3 space-y-2">
              <P className="text-[10px] font-semibold capitalize px-1" style={{ color }}>{stats.monthLabel} — {stats.eventCount} serate</P>
              {stats.eventBreakdown.length === 0 ? (
                <P className="text-xs text-muted-foreground px-1 py-2">Nessuna serata</P>
              ) : (
                stats.eventBreakdown.map(ev => (
                  <EventTile key={ev.id} ev={ev} color={color} />
                ))
              )}
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  );
}
