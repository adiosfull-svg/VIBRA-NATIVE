// Port di src/components/dashboard/AverageTablesStats.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { calcTables } from '@/legacy/utils/tables';
import { Plus, X, Check, BarChart3, CalendarRange } from '@/ui/icons.generated';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import MonthCompareTab from '@/web/components/dashboard/MonthCompareTab';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, Img, Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const PERIOD_COLORS = ['#a78bfa', '#60a5fa', '#34d399'];
const DAY_NAMES = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

const FESTIVO_ICON_URL = 'https://media.base44.com/images/public/69de4f1f7f53d9f187d01392/8e5c2672c_image.png';

// Deriva le righe della tabella direttamente dai locali configurati (fonte unica di verità),
// così qualsiasi locale aggiunto/modificato in Impostazioni compare qui automaticamente.
function buildStatRows(venues) {
  return venues.map(v => {
    const day = (v.day_of_week === null || v.day_of_week === undefined) ? '' : DAY_NAMES[v.day_of_week];
    const sublabel = v.is_extra ? 'Speciali' : [day, v.season_label].filter(Boolean).join(' ');
    return {
      label: v.name,
      sublabel,
      venueKey: v.is_extra ? null : v.name,
      isExtra: !!v.is_extra,
      color: v.color_hex || '#a78bfa',
    };
  });
}

function computeStats(venues, events, attendances, from, to) {
  return buildStatRows(venues).map(({ label, sublabel, venueKey, isExtra, color }) => {
    const filtered = events.filter(e => {
      if (isExtra) {
        if (!e.is_extra) return false;
      } else {
        if (e.venue !== venueKey) return false;
      }
      if (from && to) {
        if (!e.date) return false;
        const d = parseISO(e.date);
        if (!isWithinInterval(d, { start: startOfDay(from), end: endOfDay(to) })) return false;
      }
      return true;
    });

    const totalTables = filtered.reduce((sum, event) => {
      if (!event.date) return sum;
      const [y, m, d] = event.date.split('-').map(Number);
      const dow = new Date(y, m - 1, d).getDay();
      const eventAtts = attendances.filter(a => a.event_id === event.id && a.promoter_id && !a.client_id);
      return sum + eventAtts.reduce((s, a) => s + calcTables(a.revenue || 0, dow, event.table_threshold), 0);
    }, 0);

    // Soglia usata per il calcolo tavoli: presa dall'evento (table_threshold), fallback 300.
    // Se le serate del locale nel periodo hanno soglie diverse, le mostriamo tutte con il conteggio serate.
    const thresholdCounts = {};
    filtered.forEach(e => {
      const t = e.table_threshold ?? 300;
      thresholdCounts[t] = (thresholdCounts[t] || 0) + 1;
    });
    const thresholds = Object.keys(thresholdCounts).map(Number).sort((a, b) => a - b)
      .map(t => ({ value: t, count: thresholdCounts[t] }));

    const avgTables = filtered.length > 0 ? totalTables / filtered.length : 0;
    return { label, sublabel, venueKey, isExtra, venueColor: color, count: filtered.length, avgTables, totalTables, thresholds };
  });
}

function StatsTable({ stats, color }) {
  const hasData = stats.some(s => s.count > 0);
  const { getVenueLogo } = useAllVenueLogos();

  if (!hasData) return <P className="text-sm text-muted-foreground text-center py-4">Nessun dato nel periodo</P>;
  return (
    <Div className="overflow-x-auto -mx-5 px-5">
      <Table className="w-full text-sm min-w-[340px]">
        <Thead>
          <Tr className="border-b border-white/[0.06]">
            <Th className="text-left px-2 py-2 font-medium text-muted-foreground text-xs">Locale</Th>
            <Th className="text-center px-2 py-2 font-medium text-muted-foreground text-xs whitespace-nowrap">Serate</Th>
            <Th className="text-center px-2 py-2 font-medium text-muted-foreground text-xs whitespace-nowrap">Media Tav.</Th>
            <Th className="text-center px-2 py-2 font-medium text-muted-foreground text-xs whitespace-nowrap">Tot. Tav.</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stats.map((stat, i) => (
            <Tr key={i} className={`border-b border-white/[0.04] ${stat.count === 0 ? 'opacity-30' : 'hover:bg-white/[0.03] transition-colors'}`}>
              <Td className="text-left px-2 py-2.5 text-xs">
                <Div className="flex items-center gap-2">
                  {(() => {
                    const { logoUrl } = stat.venueKey ? getVenueLogo(stat.venueKey) : { logoUrl: '' };
                    const isFestivo = stat.isExtra;
                    return logoUrl ? (
                      <Div className="w-5 h-5 rounded overflow-hidden bg-card flex items-center justify-center shrink-0">
                        <Img src={logoUrl} alt={stat.label} className="w-full h-full object-contain" />
                      </Div>
                    ) : isFestivo ? (
                      <Div className="w-5 h-5 rounded overflow-hidden bg-card flex items-center justify-center shrink-0">
                        <Img src={FESTIVO_ICON_URL} alt={stat.label} className="w-full h-full object-contain" />
                      </Div>
                    ) : (
                      <Div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: stat.venueColor }}>
                        {stat.label.charAt(0)}
                      </Div>
                    );
                  })()}
                  <Div>
                    <P className="font-medium leading-tight">{stat.label}</P>
                    <P className="text-muted-foreground text-[9px]">{stat.sublabel}</P>
                  </Div>
                </Div>
              </Td>
              <Td className="text-center px-2 py-2.5 text-muted-foreground text-xs">{stat.count}</Td>
              <Td className="text-center px-2 py-2.5 text-xs">
                <Span className="font-semibold" style={{ color: stat.count > 0 ? color : undefined }}>
                  {stat.avgTables.toFixed(1)}
                </Span>
                {stat.thresholds.length > 0 && (
                  <P className={`text-[9px] mt-0.5 ${stat.thresholds.length > 1 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                    soglia {stat.thresholds.map(t => stat.thresholds.length > 1 ? `€${t.value} (${t.count})` : `€${t.value}`).join(' / ')}
                  </P>
                )}
              </Td>
              <Td className="text-center px-2 py-2.5 text-muted-foreground text-xs">{stat.totalTables.toFixed(1)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Div>
  );
}

function PeriodSelector({ period, index, color, onUpdate, onRemove }) {
  return (
    <Div className="rounded-lg border p-3 space-y-2" style={{ borderColor: color + '50', background: color + '08' }}>
      <Div className="flex items-center justify-between">
        <Span className="text-xs font-semibold" style={{ color }}>{index === 0 ? 'Periodo' : `Periodo ${index + 1}`}</Span>
        {index > 0 && (
          <Btn
            button
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors">
            <X className="w-3.5 h-3.5" />
          </Btn>
        )}
      </Div>
      <Div className="flex items-center gap-2 flex-wrap">
        <Div className="flex items-center gap-1.5">
          <Span className="text-[10px] text-muted-foreground">Dal</Span>
          <HtmlInput type="date" min="2023-01-01" max="2030-12-31" value={period.from} onChange={e => onUpdate({ ...period, from: e.target.value })} className="text-xs bg-card border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary" />
        </Div>
        <Div className="flex items-center gap-1.5">
          <Span className="text-[10px] text-muted-foreground">Al</Span>
          <HtmlInput type="date" min="2023-01-01" max="2030-12-31" value={period.to} onChange={e => onUpdate({ ...period, to: e.target.value })} className="text-xs bg-card border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary" />
        </Div>
        {period.from && period.to && (
          <Span className="text-[10px] text-green-400 flex items-center gap-0.5"><Check className="w-3 h-3" /> Attivo</Span>
        )}
      </Div>
    </Div>
  );
}

export default function AverageTablesStats({ events, attendances, promoters = [], delay = 0 }) {
  const [periods, setPeriods] = useState([{ from: '', to: '' }]);
  const [activeTab, setActiveTab] = useState('tables');

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
    staleTime: 30 * 60000, gcTime: 45 * 60000, refetchOnMount: false, refetchOnWindowFocus: false, retry: 0,
  });

  const addPeriod = () => { if (periods.length < 3) setPeriods(prev => [...prev, { from: '', to: '' }]); };
  const updatePeriod = (i, updated) => setPeriods(prev => prev.map((p, idx) => idx === i ? updated : p));
  const removePeriod = (i) => setPeriods(prev => prev.filter((_, idx) => idx !== i));

  const activePeriods = periods.filter(p => p.from && p.to);
  const useFilter = activePeriods.length > 0;

  const tabs = [
    { id: 'tables', label: 'Media Tavoli per Locale', icon: BarChart3 },
    { id: 'compare', label: 'Confronto Mesi', icon: CalendarRange },
  ];

  return (
    <Div
      className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5"
      style={{ animationDelay: `${delay}s` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
        style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />

      {/* ── Tab Navigation ── */}
      <Div className="flex items-center gap-1 mb-4 border-b border-white/[0.06] -mx-1 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <Btn
              button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all border-b-2 -mb-px ${
                active
                  ? 'text-purple-400 border-purple-400'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </Btn>
          );
        })}
      </Div>

      {activeTab === 'compare' && (
        <MonthCompareTab events={events} attendances={attendances} promoters={promoters} />
      )}

      {activeTab === 'tables' && (
        <>
        <Div className="flex items-center gap-2 mb-3">
          <Div className="p-1.5 rounded-lg bg-purple-500/15">
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </Div>
          <P className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Media Tavoli per Serata — per locale</P>
        </Div>

      <Div className="space-y-2 mb-4">
        {periods.map((p, i) => (
          <PeriodSelector key={i} period={p} index={i} color={PERIOD_COLORS[i]} onUpdate={(u) => updatePeriod(i, u)} onRemove={() => removePeriod(i)} />
        ))}
        {periods.length < 3 && (
          <Btn
            button
            onClick={addPeriod}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1">
            <Plus className="w-3.5 h-3.5" /> Aggiungi periodo da confrontare
          </Btn>
        )}
      </Div>
      {!useFilter ? (
        <StatsTable stats={computeStats(venues, events, attendances, null, null)} color={PERIOD_COLORS[0]} />
      ) : activePeriods.length === 1 ? (
        <StatsTable stats={computeStats(venues, events, attendances, new Date(activePeriods[0].from), new Date(activePeriods[0].to))} color={PERIOD_COLORS[0]} />
      ) : (
        <Div className="space-y-6">
          {activePeriods.map((p, i) => {
            const idx = periods.indexOf(p);
            return (
              <Div key={i}>
                <Div className="flex items-center gap-2 mb-2">
                  <Div className="w-2.5 h-2.5 rounded-full" style={{ background: PERIOD_COLORS[idx] }} />
                  <Span className="text-xs font-semibold" style={{ color: PERIOD_COLORS[idx] }}>
                    {new Date(p.from).toLocaleDateString('it-IT')} → {new Date(p.to).toLocaleDateString('it-IT')}
                  </Span>
                </Div>
                <StatsTable stats={computeStats(venues, events, attendances, new Date(p.from), new Date(p.to))} color={PERIOD_COLORS[idx]} />
              </Div>
            );
          })}
        </Div>
      )}
        </>
      )}
    </Div>
  );
}
