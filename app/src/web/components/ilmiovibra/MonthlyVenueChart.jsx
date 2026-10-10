// Port di src/components/ilmiovibra/MonthlyVenueChart.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { parseISO, isWithinInterval, startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { validDayKey, makeDayRangeCheck } from '@/legacy/utils/dateUtils';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Home } from '@/ui/icons.generated';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Btn, Div, P, Span } from '@/ui/html';

const VENUES = [
  { key: 'Frontemare',                color: '#60a5fa' },
  { key: 'Paprika Scilla',            color: '#38bdf8' },
  { key: 'Estasi Scilla',             color: '#7dd3fc' },
  { key: 'Nemesi Club Type',          color: '#818cf8' },
  { key: 'Fantasya Living',           color: '#a5b4fc' },
  { key: 'Mantra',                    color: '#fb923c' },
  { key: 'Loonatica Maison del Mare', color: '#ea580c' },
  { key: 'Hi.Club Brass',             color: '#4ade80' },
  { key: 'Kolossal Brass',            color: '#86efac' },
  { key: 'Toma',                      color: '#fbbf24' },
  { key: 'Superstar Pineta',          color: '#f472b6' },
  { key: 'Chapeau Club Type',         color: '#c084fc' },
  { key: '__extra__',                 color: '#ef4444', label: 'Extra/Festivi' },
];

const PERIODS = [
  { label: '1M',  months: 1 },
  { label: '3M',  months: 3 },
  { label: '6M',  months: 6 },
  { label: '12M', months: 12 },
  { label: 'Sempre', months: null },
];

function fmt(v) {
  return `€${Number(v).toLocaleString('it-IT')}`;
}

function HBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <Div className="flex items-center gap-2">
      <Div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
        <Div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
      </Div>
      <Span className="text-xs font-semibold w-20 text-right shrink-0 tabular-nums">{fmt(value)}</Span>
    </Div>
  );
}

export default function MonthlyVenueChart({ promoterId, attendances, events }) {
  const now = new Date();
  const [periodMonths, setPeriodMonths] = useState(6); // null = sempre
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [hiddenVenues, setHiddenVenues] = useState(new Set());

  const { from, to } = useMemo(() => {
    const to = endOfMonth(now);
    if (periodMonths === null) {
      // Trova il mese più vecchio con dati
      const eventMap = {};
      events.forEach(e => { eventMap[e.id] = e; });
      let earliest = now;
      attendances.forEach(a => {
        if (a.promoter_id !== promoterId) return;
        const ev = eventMap[a.event_id];
        if (!ev?.date || !(a.revenue > 0)) return;
        try {
          const d = parseISO(ev.date);
          if (d < earliest) earliest = d;
        } catch {}
      });
      return { from: startOfMonth(earliest), to };
    }
    return { from: startOfMonth(subMonths(now, periodMonths - 1)), to };
  }, [periodMonths, events, attendances, promoterId, now.getMonth(), now.getFullYear()]);

  const { months, activeVenues } = useMemo(() => {
    const myAtts = attendances.filter(a => a.promoter_id === promoterId && !a.client_id);
    const eventMap = {};
    events.forEach(e => { eventMap[e.id] = e; });

    const monthList = eachMonthOfInterval({ start: from, end: to });

    const venueRevByMonth = {};
    VENUES.forEach(v => { venueRevByMonth[v.key] = {}; });

    const inPeriod = makeDayRangeCheck(from, to);
    myAtts.forEach(a => {
      const ev = eventMap[a.event_id];
      if (!ev?.date || !(a.revenue > 0)) return;
      // Date-giorno reali: confronto fra stringhe + mese dalla stringa (stesso risultato di
      // parseISO + isWithinInterval + format, senza il costo per ogni presenza). Altri formati: percorso originale.
      let monthKey;
      const dayKey = validDayKey(ev.date);
      if (dayKey) {
        if (!inPeriod(dayKey)) return;
        monthKey = dayKey.slice(0, 7);
      } else {
        let d;
        try { d = parseISO(ev.date); } catch { return; }
        if (!isWithinInterval(d, { start: from, end: to })) return;
        monthKey = format(d, 'yyyy-MM');
      }
      const venueKey = ev.is_extra ? '__extra__' : (ev.venue || null);
      if (!venueKey || !venueRevByMonth[venueKey]) return;
      venueRevByMonth[venueKey][monthKey] = (venueRevByMonth[venueKey][monthKey] || 0) + (a.revenue || 0);
    });

    const active = VENUES.filter(v => Object.values(venueRevByMonth[v.key]).some(r => r > 0));

    const mths = monthList.map(ms => {
      const mKey = format(ms, 'yyyy-MM');
      const label = format(ms, 'MMM yy', { locale: it });
      const row = { label, mKey };
      active.forEach(v => { row[v.key] = venueRevByMonth[v.key][mKey] || 0; });
      row._total = active.reduce((s, v) => s + (venueRevByMonth[v.key][mKey] || 0), 0);
      return row;
    });

    return { months: mths, activeVenues: active };
  }, [attendances, events, promoterId, from, to]);

  const toggleVenue = (key) => {
    setHiddenVenues(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const displayData = useMemo(() => {
    return activeVenues.map(v => {
      let total;
      if (selectedMonth) {
        const row = months.find(m => m.mKey === selectedMonth);
        total = row ? (row[v.key] || 0) : 0;
      } else {
        total = months.reduce((s, m) => s + (m[v.key] || 0), 0);
      }
      return { ...v, total };
    }).sort((a, b) => b.total - a.total);
  }, [activeVenues, months, selectedMonth]);

  const maxVal = Math.max(...displayData.map(d => d.total), 1);

  // Grafico colonnine: altezza massima per mese (per proporzionare)
  const maxMonthTotal = Math.max(...months.map(m => m._total), 1);

  if (activeVenues.length === 0) {
    return (
      <Div className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-5"
        style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.08)' }}>
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <SectionHeader icon={Home} title="Fatturato per Locale" color="#a78bfa" className="mb-3" />
        <P className="text-sm text-muted-foreground text-center py-6">Nessun dato nel periodo selezionato</P>
      </Div>
    );
  }

  return (
    <Div className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-5 space-y-5"
      style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.10)' }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
      {/* Header + selettore periodo */}
      <Div className="flex items-center justify-between flex-wrap gap-3">
        <SectionHeader icon={Home} title="Fatturato per Locale" color="#a78bfa" />
        <Div className="flex items-center gap-1">
          {PERIODS.map(p => (
            <Btn
              button
              key={p.label}
              onClick={() => { setPeriodMonths(p.months); setSelectedMonth(null); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
                periodMonths === p.months
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}>
              {p.label}
            </Btn>
          ))}
        </Div>
      </Div>

      {/* Grafico colonnine mensile — cliccabile per filtrare */}
      {months.length > 1 && (
        <Div>
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
            Clicca un mese per filtrare
          </P>
          <Div className="flex items-end gap-1" style={{ height: 60 }}>
            {months.map(m => {
              const pct = Math.round((m._total / maxMonthTotal) * 100);
              const isSelected = selectedMonth === m.mKey;
              // Stacked: dividi le venue proporzionalmente
              const visibleVenues = activeVenues.filter(v => !hiddenVenues.has(v.key));
              const visTotal = visibleVenues.reduce((s, v) => s + (m[v.key] || 0), 0);
              const barH = Math.max(pct * 0.44, 2); // max 44px su 60px totali
              return (
                <Btn
                  key={m.mKey}
                  className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer group"
                  onClick={() => setSelectedMonth(m.mKey === selectedMonth ? null : m.mKey)}
                >
                  {/* Barra stacked */}
                  <Div
                    className="w-full flex flex-col-reverse rounded-t overflow-hidden transition-all"
                    style={{ height: `${barH}px`, opacity: isSelected ? 1 : 0.65 }}
                    accessibilityLabel=""
                  >
                    {visTotal > 0 ? visibleVenues.map(v => {
                      const share = (m[v.key] || 0) / visTotal;
                      return (
                        <Div
                          key={v.key}
                          style={{ height: `${share * 100}%`, background: v.color, minHeight: share > 0 ? 1 : 0 }}
                        />
                      );
                    }) : (
                      <Div className="w-full h-full bg-secondary/40 rounded-t" />
                    )}
                  </Div>
                  {/* Label mese */}
                  <Span className={`text-[8px] leading-none transition-colors ${isSelected ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    {m.label}
                  </Span>
                  {/* Totale sotto */}
                  {isSelected && (
                    <Span className="text-[8px] text-primary font-semibold leading-none">
                      {m._total > 0 ? `€${(m._total / 1000).toFixed(1)}k` : '—'}
                    </Span>
                  )}
                </Btn>
              );
            })}
          </Div>
          {selectedMonth && (
            <Div className="flex justify-center mt-1">
              <Btn
                button
                onClick={() => setSelectedMonth(null)}
                className="text-[10px] text-muted-foreground hover:text-foreground underline">
                Mostra tutto il periodo
              </Btn>
            </Div>
          )}
        </Div>
      )}

      {/* Toggle locali */}
      <Div className="flex flex-wrap gap-1.5">
        {activeVenues.map(v => {
          const hidden = hiddenVenues.has(v.key);
          return (
            <Btn
              button
              key={v.key}
              onClick={() => toggleVenue(v.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border transition-all ${hidden ? 'border-border text-muted-foreground opacity-40' : 'border-border text-foreground'}`}>
              <Span className="w-2 h-2 rounded-full shrink-0" style={{ background: hidden ? '#555' : v.color }} />
              {v.label || v.key}
            </Btn>
          );
        })}
      </Div>

      {/* Barre orizzontali per locale */}
      <ChartFullscreen title="Fatturato per Locale">
        <Div className="space-y-3">
          {displayData
            .filter(d => !hiddenVenues.has(d.key) && d.total > 0)
            .map(d => (
              <Div key={d.key}>
                <Div className="flex items-center gap-1.5 mb-1">
                  <Span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                  <Span className="text-xs font-medium">{d.label || d.key}</Span>
                </Div>
                <HBar value={d.total} max={maxVal} color={d.color} />
              </Div>
            ))}
          {displayData.filter(d => !hiddenVenues.has(d.key) && d.total > 0).length === 0 && (
            <P className="text-sm text-muted-foreground text-center py-4">Nessun dato nel mese selezionato</P>
          )}
        </Div>
      </ChartFullscreen>
    </Div>
  );
}