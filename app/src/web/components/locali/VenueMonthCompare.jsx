// Port di src/components/locali/VenueMonthCompare.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { parseISO, startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Plus, X, TrendingUp, TrendingDown, GitCompare } from '@/ui/icons.generated';
import { calcTables } from '@/legacy/utils/tables';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { getEventDow } from '@/legacy/utils/dateUtils';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

function getVenueEvents(venueKey, events) {
  if (venueKey === '__festivo__') return events.filter(e => e.is_extra);
  return events.filter(e => e.venue === venueKey);
}
function getEventRev(ev, attendances) {
  if (ev.total_revenue) return ev.total_revenue;
  return attendances.filter(a => a.event_id === ev.id).reduce((s, a) => s + (a.revenue || 0), 0);
}


function computeMonthStats(venueKey, monthStr, events, attendances) {
  if (!monthStr) return null;
  const [y, m] = monthStr.split('-').map(Number);
  const from = startOfMonth(new Date(y, m - 1, 1));
  const to = endOfMonth(from);
  const vEvents = getVenueEvents(venueKey, events).filter(ev => {
    if (!ev.date) return false;
    try { return isWithinInterval(parseISO(ev.date), { start: from, end: to }); } catch { return false; }
  }).sort((a, b) => a.date.localeCompare(b.date));

  let totalRev = 0, totalTables = 0;
  const eventsList = vEvents.map(ev => {
    const rev = getEventRev(ev, attendances);
    const dow = getEventDow(ev);
    const tables = calcTables(rev, dow, ev.table_threshold);
    totalRev += rev;
    totalTables += tables;
    return { id: ev.id, date: ev.date, name: ev.name, revenue: rev, tables: Math.round(tables * 10) / 10 };
  });

  return {
    monthStr,
    label: format(from, 'MMMM yyyy', { locale: it }),
    totalRev: Math.round(totalRev),
    totalTables: Math.round(totalTables * 10) / 10,
    serate: vEvents.length,
    avgRev: vEvents.length > 0 ? Math.round(totalRev / vEvents.length) : 0,
    eventsList,
  };
}

export default function VenueMonthCompare({ events, attendances, venues }) {
  const [venueKey, setVenueKey] = useState(venues[2]?.key || venues[0]?.key);
  const [periods, setPeriods] = useState(['', '']);

  const addPeriod = () => setPeriods(p => [...p, '']);
  const removePeriod = (idx) => setPeriods(p => p.filter((_, i) => i !== idx));
  const updatePeriod = (idx, value) => setPeriods(p => p.map((v, i) => i === idx ? value : v));

  const stats = periods.map(p => computeMonthStats(venueKey, p, events, attendances));
  const validStats = stats.filter(Boolean);

  const gridColsClass = validStats.length >= 4
    ? 'sm:grid-cols-2 xl:grid-cols-4'
    : validStats.length === 3
    ? 'sm:grid-cols-2 lg:grid-cols-3'
    : 'sm:grid-cols-2';

  return (
    <Div className="rounded-2xl bg-card border border-border p-5 space-y-4">
      <SectionHeader icon={GitCompare} title="Confronto Mensile — stesso locale in periodi diversi" color="#a78bfa" />

      {/* Selettore locale */}
      <Div className="flex flex-wrap items-center gap-2">
        <Span className="text-xs text-muted-foreground">Locale:</Span>
        {venues.map(v => (
          <Btn
            button
            key={v.key}
            onClick={() => setVenueKey(v.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all"
            style={venueKey === v.key
              ? { background: v.hex + '22', borderColor: v.hex, color: v.hex, fontWeight: 600 }
              : { borderColor: 'hsl(240 5% 18%)', color: 'hsl(240 5% 55%)' }
            }>
            <Span className="w-2 h-2 rounded-full" style={{ background: venueKey === v.key ? v.hex : 'hsl(240 5% 40%)' }} />
            {v.key === '__festivo__' ? 'Extra/Festivi' : v.key}
          </Btn>
        ))}
      </Div>

      {/* Selettori periodo */}
      <Div className="flex flex-wrap items-center gap-2">
        <Span className="text-xs text-muted-foreground">Mesi da confrontare:</Span>
        {periods.map((p, idx) => (
          <Div key={idx} className="flex items-center gap-1">
            <HtmlInput
              type="month"
              value={p}
              onChange={e => updatePeriod(idx, e.target.value)}
              className="px-2 py-1.5 rounded-lg text-xs bg-secondary/40 border border-border text-foreground"
              style={{ colorScheme: 'dark' }}
            />
            {periods.length > 2 && (
              <Btn
                button
                onClick={() => removePeriod(idx)}
                className="text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5" />
              </Btn>
            )}
          </Div>
        ))}
        <Btn
          button
          onClick={addPeriod}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
          <Plus className="w-3.5 h-3.5" />Aggiungi mese
        </Btn>
      </Div>

      {/* Cards affiancate */}
      {validStats.length === 0 ? (
        <Div className="rounded-xl bg-secondary/20 p-8 text-center">
          <P className="text-xs text-muted-foreground">Seleziona almeno un mese per vedere i dettagli</P>
        </Div>
      ) : (
        <Div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
          {validStats.map((s, idx) => {
            const prev = validStats[idx - 1];
            const diffPct = prev && prev.totalRev > 0 ? Math.round(((s.totalRev - prev.totalRev) / prev.totalRev) * 100) : null;
            return (
              <Div key={s.monthStr} className="rounded-xl bg-secondary/20 border border-border p-4 space-y-3">
                <Div className="flex items-center justify-between gap-2">
                  <P className="text-sm font-semibold capitalize">{s.label}</P>
                  {diffPct !== null && (
                    <Span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${diffPct >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {diffPct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {diffPct >= 0 ? '+' : ''}{diffPct}%
                    </Span>
                  )}
                </Div>

                <Div className="grid grid-cols-2 gap-2">
                  <Div className="rounded-lg bg-card p-2.5">
                    <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Fatturato</P>
                    <P className="text-base font-bold text-primary">€{s.totalRev.toLocaleString('it-IT')}</P>
                  </Div>
                  <Div className="rounded-lg bg-card p-2.5">
                    <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Tavoli</P>
                    <P className="text-base font-bold">{s.totalTables}</P>
                  </Div>
                  <Div className="rounded-lg bg-card p-2.5">
                    <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Serate</P>
                    <P className="text-base font-bold">{s.serate}</P>
                  </Div>
                  <Div className="rounded-lg bg-card p-2.5">
                    <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Media/serata</P>
                    <P className="text-base font-bold">€{s.avgRev.toLocaleString('it-IT')}</P>
                  </Div>
                </Div>

                {s.eventsList.length > 0 && (
                  <Div className="space-y-1 pt-2 border-t border-border">
                    <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Dettaglio serate</P>
                    {s.eventsList.map(ev => (
                      <Div key={ev.id} className="flex items-center justify-between text-[11px]">
                        <Span className="text-muted-foreground truncate">{format(parseISO(ev.date), 'd MMM', { locale: it })}</Span>
                        <Span className="font-medium">€{ev.revenue.toLocaleString('it-IT')}</Span>
                        <Span className="text-muted-foreground w-10 text-right">{ev.tables}t</Span>
                      </Div>
                    ))}
                  </Div>
                )}
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}