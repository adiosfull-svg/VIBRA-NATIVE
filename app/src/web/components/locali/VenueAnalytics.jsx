// Port di src/components/locali/VenueAnalytics.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/ui/recharts';
import { calcTables } from '@/legacy/utils/tables';
import { TrendingUp, Trophy, CalendarRange } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import VenueMonthCompare from './VenueMonthCompare';
import { getEventDow } from '@/legacy/utils/dateUtils';

import { Btn, Div, H, P, Span } from '@/ui/html';

const ALL_VENUES = [
  { key: 'Frontemare',               label: 'Venerdì · Estate',   hex: '#60a5fa' },
  { key: 'Nemesi Club Type',         label: 'Venerdì · Inverno',  hex: '#818cf8' },
  { key: 'Mantra',                   label: 'Sabato · Estate',    hex: '#fb923c' },
  { key: 'Hi.Club Brass',            label: 'Sabato · Inverno',   hex: '#4ade80' },
  { key: 'Toma',                     label: 'Domenica · Estate',  hex: '#fbbf24' },
  { key: 'Superstar Pineta',         label: 'Domenica · Inverno', hex: '#f472b6' },
  { key: 'Paprika Scilla',           label: 'Venerdì · Estate',   hex: '#38bdf8' },
  { key: 'Estasi Scilla',            label: 'Venerdì · Estate',   hex: '#7dd3fc' },
  { key: 'Fantasya Living',          label: 'Venerdì · Inverno',  hex: '#a5b4fc' },
  { key: 'Loonatica Maison del Mare',label: 'Sabato · Estate',    hex: '#ea580c' },
  { key: 'Kolossal Brass',           label: 'Sabato · Inverno',   hex: '#86efac' },
  { key: 'Chapeau Club Type',        label: 'Domenica · Inverno', hex: '#c084fc' },
  { key: '__festivo__',              label: 'Extra / Festivi',    hex: '#ef4444' },
];

const SEASONS = [
  {
    key: '2022-2023',
    label: 'Stagione 2022–2023',
    dateFrom: '2022-10-10',
    dateTo:   '2023-10-09',
    venues: ['Loonatica Maison del Mare'],
  },
  {
    key: '2023-2024',
    label: 'Stagione 2023–2024',
    dateFrom: '2023-10-10',
    dateTo:   '2024-10-09',
    venues: ['Fantasya Living', 'Kolossal Brass', 'Chapeau Club Type', 'Paprika Scilla', 'Mantra', 'Toma'],
  },
  {
    key: '2024-2025',
    label: 'Stagione 2024–2025',
    dateFrom: '2024-10-10',
    dateTo:   '2025-10-09',
    venues: ['Fantasya Living', 'Kolossal Brass', 'Chapeau Club Type', 'Estasi Scilla', 'Mantra', 'Toma'],
  },
  {
    key: '2025-2026',
    label: 'Stagione 2025–2026',
    dateFrom: '2025-10-10',
    dateTo:   '2026-10-09',
    venues: ['Nemesi Club Type', 'Hi.Club Brass', 'Superstar Pineta', 'Frontemare', 'Mantra', 'Toma'],
  },
];

const METRICS = [
  { key: 'revenue', label: 'Fatturato (€)' },
  { key: 'tables',  label: 'Tavoli' },
  { key: 'avg',     label: 'Media/serata (€)' },
];

function getVenueEvents(venueKey, events) {
  if (venueKey === '__festivo__') return events.filter(e => e.is_extra);
  return events.filter(e => e.venue === venueKey);
}

function getEventRev(ev, attendances) {
  if (ev.total_revenue) return ev.total_revenue;
  return attendances.filter(a => a.event_id === ev.id).reduce((s, a) => s + (a.revenue || 0), 0);
}



export default function VenueAnalytics({ events, attendances }) {
  const [selectedVenues, setSelectedVenues] = useState([ALL_VENUES[0].key, ALL_VENUES[2].key]);
  const [metric, setMetric] = useState('revenue');
  const [months, setMonths] = useState(12); // 0 = da sempre

  const toggleVenue = (key) => {
    setSelectedVenues(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const now = new Date();

  // Costruisce dati mensili per ogni venue selezionata
  const effectiveMonths = months === 0
    ? (() => {
        // calcola quanti mesi coprire dall'evento più vecchio
        const allDates = events.map(e => e.date).filter(Boolean).sort();
        if (!allDates.length) return 12;
        const oldest = parseISO(allDates[0]);
        const diff = (now.getFullYear() - oldest.getFullYear()) * 12 + (now.getMonth() - oldest.getMonth()) + 1;
        return Math.max(diff, 1);
      })()
    : months;

  const monthLabels = Array.from({ length: effectiveMonths }, (_, i) => {
    const ms = startOfMonth(subMonths(now, effectiveMonths - 1 - i));
    return format(ms, 'MMM yy', { locale: it });
  });

  const chartData = monthLabels.map((label, i) => {
    const ms = startOfMonth(subMonths(now, effectiveMonths - 1 - i));
    const me = endOfMonth(ms);
    const entry = { label };

    selectedVenues.forEach(vKey => {
      const vEvents = getVenueEvents(vKey, events).filter(ev => {
        if (!ev.date) return false;
        try { return isWithinInterval(parseISO(ev.date), { start: ms, end: me }); } catch { return false; }
      });

      let totalRev = 0, totalTables = 0;
      vEvents.forEach(ev => {
        const rev = getEventRev(ev, attendances);
        const dow = getEventDow(ev);
        totalRev += rev;
        totalTables += calcTables(rev, dow, ev.table_threshold);
      });

      if (metric === 'revenue') entry[vKey] = Math.round(totalRev);
      else if (metric === 'tables') entry[vKey] = Math.round(totalTables * 10) / 10;
      else if (metric === 'avg') entry[vKey] = vEvents.length > 0 ? Math.round(totalRev / vEvents.length) : 0;

      // store event count for tooltip
      entry[`${vKey}__serate`] = vEvents.length;
    });

    return entry;
  });

  // Calcola stats per una stagione
  const calcSeasonStats = (season) => {
    const from = parseISO(season.dateFrom);
    const to = parseISO(season.dateTo);
    return season.venues.map(vKey => {
      const vInfo = ALL_VENUES.find(v => v.key === vKey);
      const vEvents = getVenueEvents(vKey, events).filter(ev => {
        if (!ev.date) return false;
        try { return isWithinInterval(parseISO(ev.date), { start: from, end: to }); } catch { return false; }
      });
      let totalRev = 0, totalTables = 0;
      vEvents.forEach(ev => {
        const rev = getEventRev(ev, attendances);
        const dow = getEventDow(ev);
        totalRev += rev;
        totalTables += calcTables(rev, dow, ev.table_threshold);
      });
      return {
        key: vKey,
        hex: vInfo?.hex || '#888',
        totalRev,
        totalTables: Math.round(totalTables),
        serate: vEvents.length,
        avgRev: vEvents.length > 0 ? Math.round(totalRev / vEvents.length) : 0,
      };
    }).sort((a, b) => b.totalRev - a.totalRev);
  };

  // Totali per confronto card
  const venueTotals = ALL_VENUES.map(v => {
    const vEvents = getVenueEvents(v.key, events);
    let totalRev = 0, totalTables = 0;
    vEvents.forEach(ev => {
      const rev = getEventRev(ev, attendances);
      const dow = getEventDow(ev);
      totalRev += rev;
      totalTables += calcTables(rev, dow, ev.table_threshold);
    });
    return {
      ...v,
      totalRev,
      totalTables,
      avgRev: vEvents.length > 0 ? Math.round(totalRev / vEvents.length) : 0,
      serate: vEvents.length,
    };
  }).sort((a, b) => b.totalRev - a.totalRev);

  const tooltipStyle = {
    background: 'hsl(240 6% 8%)',
    border: '1px solid hsl(240 5% 18%)',
    borderRadius: 8,
    fontSize: 12,
    color: 'hsl(0 0% 95%)',
  };

  const fmt = (v) => metric === 'tables' ? v : `€${Number(v).toLocaleString('it-IT')}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const rowData = payload[0]?.payload || {};
    return (
      <Div style={tooltipStyle} className="p-3 min-w-[160px]">
        <P className="font-semibold text-xs mb-2" style={{ color: 'hsl(0 0% 95%)' }}>{label}</P>
        {payload.map(entry => {
          const serateCnt = rowData[`${entry.dataKey}__serate`] ?? 0;
          const vInfo = ALL_VENUES.find(x => x.key === entry.dataKey);
          const vLabel = vInfo?.key === '__festivo__' ? 'Extra/Festivi' : vInfo?.key || entry.dataKey;
          return (
            <Div key={entry.dataKey} className="mb-2 last:mb-0">
              <P style={{ color: entry.color }} className="font-medium text-xs">{vLabel}</P>
              <P style={{ color: entry.color }} className="text-xs">
                {metric === 'revenue' ? 'Fatturato' : metric === 'tables' ? 'Tavoli' : 'Media'}: {fmt(entry.value)}
              </P>
              {metric === 'revenue' && (
                <P className="text-[11px]" style={{ color: 'hsl(240 5% 60%)' }}>
                  {serateCnt} {serateCnt === 1 ? 'serata' : 'serate'}
                </P>
              )}
            </Div>
          );
        })}
      </Div>
    );
  };

  return (
    <Div className="space-y-6">

      {/* Selettore locali */}
      <Div className="rounded-2xl bg-card border border-border p-5 space-y-4">
        <Div className="flex flex-wrap items-center gap-3">
          <Span className="text-sm font-semibold">Confronta locali:</Span>
          <Div className="flex flex-wrap gap-2">
            {ALL_VENUES.map(v => {
              const isOn = selectedVenues.includes(v.key);
              return (
                <Btn
                  button
                  key={v.key}
                  onClick={() => toggleVenue(v.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all"
                  style={isOn
                    ? { background: v.hex + '22', borderColor: v.hex, color: v.hex, fontWeight: 600 }
                    : { borderColor: 'hsl(240 5% 18%)', color: 'hsl(240 5% 55%)' }
                  }>
                  <Span className="w-2 h-2 rounded-full" style={{ background: isOn ? v.hex : 'hsl(240 5% 40%)' }} />
                  {v.key === '__festivo__' ? 'Extra/Festivi' : v.key}
                </Btn>
              );
            })}
          </Div>
        </Div>

        {/* Metrica + periodo */}
        <Div className="flex flex-wrap items-center gap-4">
          <Div className="flex items-center gap-2">
            <Span className="text-xs text-muted-foreground">Metrica:</Span>
            <Div className="flex gap-1">
              {METRICS.map(m => (
                <Btn
                  button
                  key={m.key}
                  onClick={() => setMetric(m.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    metric === m.key
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}>
                  {m.label}
                </Btn>
              ))}
            </Div>
          </Div>
          <Div className="flex items-center gap-2 ml-auto flex-wrap">
            <Span className="text-xs text-muted-foreground">Periodo:</Span>
            {[6, 12, 24].map(m => (
              <Btn
                button
                key={m}
                onClick={() => setMonths(m)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  months === m
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground'
                }`}>
                {m} mesi
              </Btn>
            ))}
            <Btn
              button
              onClick={() => setMonths(0)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                months === 0
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground'
              }`}>
              Da sempre
            </Btn>
          </Div>
        </Div>
      </Div>

      {/* Grafico */}
      {selectedVenues.length < 2 ? (
        <Div className="rounded-2xl bg-card border border-border p-12 text-center">
          <P className="text-muted-foreground text-sm">Seleziona almeno 2 locali per confrontarli</P>
        </Div>
      ) : (
        <Div className="rounded-2xl bg-card border border-border p-5">
          <SectionHeader icon={TrendingUp} title={`${METRICS.find(m => m.key === metric)?.label} — ${months === 0 ? 'da sempre' : `ultimi ${months} mesi`}`} color="#a78bfa" className="mb-4" />
          <Div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
                <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={fmt} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={name => {
                    const v = ALL_VENUES.find(x => x.key === name);
                    return v?.key === '__festivo__' ? 'Extra/Festivi' : v?.key || name;
                  }}
                  wrapperStyle={{ fontSize: 11 }}
                />
                {selectedVenues.map(vKey => {
                  const v = ALL_VENUES.find(x => x.key === vKey);
                  return (
                    <Line
                      key={vKey}
                      type="monotone"
                      dataKey={vKey}
                      stroke={v?.hex || '#888'}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: v?.hex }}
                      activeDot={{ r: 5 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </Div>
        </Div>
      )}

      {/* Confronto mensile stesso locale */}
      <VenueMonthCompare events={events} attendances={attendances} venues={ALL_VENUES} />

      {/* Tabella ranking */}
      <Div className="rounded-2xl bg-card border border-border overflow-hidden">
        <Div className="px-5 py-4 border-b border-border">
          <SectionHeader icon={Trophy} title="Ranking All-Time — tutti i locali" color="#fbbf24" />
        </Div>
        <Div className="divide-y divide-border">
          {venueTotals.map((v, i) => (
            <Div
              key={v.key}
              className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                selectedVenues.includes(v.key) ? 'bg-secondary/20' : ''
              }`}
            >
              <Span className="text-sm text-muted-foreground w-6 text-right">{i + 1}</Span>
              <Div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: v.hex }} />
              <Span className="text-sm font-medium flex-1 truncate">
                {v.key === '__festivo__' ? 'Extra / Festivi' : v.key}
              </Span>
              <Span className="text-xs text-muted-foreground">{v.serate} serate</Span>
              <Span className="text-xs text-muted-foreground w-20 text-right">avg €{v.avgRev.toLocaleString('it-IT')}</Span>
              <Span className="text-xs text-muted-foreground w-16 text-right">{Math.round(v.totalTables)} t</Span>
              <Span className="text-sm font-bold w-28 text-right">€{v.totalRev.toLocaleString('it-IT')}</Span>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Stagioni */}
      <Div className="space-y-4">
        <SectionHeader icon={CalendarRange} title="Stagioni" color="#a78bfa" size="lg" />
        {SEASONS.map(season => {
          const stats = calcSeasonStats(season);
          const totalStagione = stats.reduce((s, v) => s + v.totalRev, 0);
          return (
            <Div key={season.key} className="rounded-2xl bg-card border border-border overflow-hidden">
              <Div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <Div>
                  <H className="text-sm font-semibold">{season.label}</H>
                  <P className="text-xs text-muted-foreground mt-0.5">
                    {season.dateFrom.split('-').reverse().join('/')} → {season.dateTo.split('-').reverse().join('/')}
                  </P>
                </Div>
                <Div className="text-right">
                  <P className="text-xs text-muted-foreground">Totale stagione</P>
                  <P className="text-sm font-bold text-primary">€{totalStagione.toLocaleString('it-IT')}</P>
                </Div>
              </Div>
              <Div className="divide-y divide-border">
                {stats.map((v, i) => (
                  <Div key={v.key} className="flex items-center gap-4 px-5 py-3">
                    <Span className="text-sm text-muted-foreground w-5 text-right">{i + 1}</Span>
                    <Div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: v.hex }} />
                    <Span className="text-sm font-medium flex-1 truncate">{v.key}</Span>
                    <Span className="text-xs text-muted-foreground">{v.serate} serate</Span>
                    <Span className="text-xs text-muted-foreground w-20 text-right hidden sm:block">avg €{v.avgRev.toLocaleString('it-IT')}</Span>
                    <Span className="text-xs text-muted-foreground w-14 text-right hidden sm:block">{v.totalTables} t</Span>
                    <Span className="text-sm font-bold w-28 text-right">€{v.totalRev.toLocaleString('it-IT')}</Span>
                  </Div>
                ))}
              </Div>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}