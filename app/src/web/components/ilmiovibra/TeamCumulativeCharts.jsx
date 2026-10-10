// Port di src/components/ilmiovibra/TeamCumulativeCharts.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval, eachMonthOfInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import { Euro, BarChart2, CalendarDays } from '@/ui/icons.generated';
import { MonthSelect, YearSelect } from '@/web/components/shared/MonthYearPicker';
import { useAppSetting } from '@/web/hooks/useAppSetting';
import { calcTables } from '@/legacy/utils/tables';
import { validDayKey, localDayKey, makeDayRangeCheck } from '@/legacy/utils/dateUtils';
import UPlotLineChart from '@/web/components/promoter/UPlotLineChart';
import UPlotBarChart from '@/web/components/promoter/UPlotBarChart';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { TrendingUp } from '@/ui/icons.generated';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '8px',
  fontSize: 12,
  color: '#ffffff',
};
const fmt = (v) => `€${Number(v).toLocaleString('it-IT')}`;

// Locali sincronizzati con pages/Locali
const ALL_VENUES = [
  { key: 'Frontemare',                hex: '#60a5fa' },
  { key: 'Nemesi Club Type',          hex: '#818cf8' },
  { key: 'Mantra',                    hex: '#fb923c' },
  { key: 'Hi.Club Brass',             hex: '#4ade80' },
  { key: 'Toma',                      hex: '#fbbf24' },
  { key: 'Superstar Pineta',          hex: '#f472b6' },
  { key: 'Paprika Scilla',            hex: '#38bdf8' },
  { key: 'Estasi Scilla',             hex: '#7dd3fc' },
  { key: 'Fantasya Living',           hex: '#a5b4fc' },
  { key: 'Loonatica Maison del Mare', hex: '#ea580c' },
  { key: 'Kolossal Brass',            hex: '#86efac' },
  { key: 'Chapeau Club Type',         hex: '#c084fc' },
  { key: '__festivo__',               hex: '#ef4444' },
];

function VenueLogo({ venueKey }) {
  const key = venueKey || '__festivo__';
  const [logoUrl] = useAppSetting('venue_logo_' + key);
  const VENUE_HEX = {
    'Frontemare': '#60a5fa', 'Nemesi Club Type': '#818cf8', 'Mantra': '#fb923c',
    'Hi.Club Brass': '#4ade80', 'Toma': '#fbbf24', 'Superstar Pineta': '#f472b6',
    'Paprika Scilla': '#38bdf8', 'Estasi Scilla': '#7dd3fc', 'Fantasya Living': '#a5b4fc',
    'Loonatica Maison del Mare': '#ea580c', 'Kolossal Brass': '#86efac', 'Chapeau Club Type': '#c084fc',
  };
  const hex = venueKey ? (VENUE_HEX[venueKey] || '#888') : '#ef4444';
  if (!logoUrl) return <Span className="w-4 h-4 rounded flex-shrink-0" style={{ background: hex }} />;
  return (
    <Div className="w-4 h-4 rounded overflow-hidden flex-shrink-0 bg-card">
      <Img src={logoUrl} alt="" className="w-full h-full object-contain" />
    </Div>
  );
}

// Segnaposto STATICO della stessa altezza del grafico (nessuna animazione, nessun salto di layout).
function ChartSlot({ ready, height, children }) {
  return ready ? children : <Div style={{ height }} />;
}

// Pre-calcolo memoizzato in UN solo passaggio sulle presenze del team.
// Prima: per ogni mese del periodo (fino a 40+) si rifaceva un ciclo su tutte le presenze con
// parseISO + isWithinInterval, più un ciclo per ciascuno dei 13 locali: mesi × presenze (e
// locali × presenze) parse di date a ogni apertura. Ora ogni presenza porta il proprio giorno
// 'YYYY-MM-DD' e si aggrega una volta sola (stesso ordine di somma → stessi risultati).
function useCumulativeData(teamPromoters, allAttendances, events, fromDate, toDate) {
  return useMemo(() => {
    const eventsById = new Map(events.map(e => [e.id, e]));
    const teamIds = new Set(teamPromoters.map(p => p.id));
    const inPeriod = makeDayRangeCheck(fromDate, toDate);

    // Giorno locale 'YYYY-MM-DD' se la data cade nel periodo, altrimenti null. Per le date-giorno reali è un
    // confronto fra stringhe (identico a isWithinInterval sul mese); per qualsiasi altro formato
    // si usa il percorso originale (parseISO) così il risultato non cambia mai.
    const dayInRange = (dateStr) => {
      const k = validDayKey(dateStr);
      if (k) return inPeriod(k) ? k : null;
      try {
        const d = parseISO(dateStr);
        return isWithinInterval(d, { start: fromDate, end: toDate }) ? localDayKey(d) : null;
      } catch { return null; }
    };

    const dowOf = (dateStr) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d).getDay();
    };

    // Raggruppa le presenze del team per event_id (una sola passata)
    const attsByEvent = new Map(); // event_id -> [att]
    const filteredAtts = [];
    for (const a of allAttendances) {
      if (a.client_id || !teamIds.has(a.promoter_id)) continue;
      const ev = eventsById.get(a.event_id);
      if (!ev?.date) continue;
      const day = dayInRange(ev.date);
      if (!day) continue;
      const rv = a.revenue || 0;
      const t = calcTables(rv, ev.is_extra ? 0 : dowOf(ev.date));
      filteredAtts.push({ a, ev, day, rv, t });
      const arr = attsByEvent.get(a.event_id);
      if (arr) arr.push(a); else attsByEvent.set(a.event_id, [a]);
    }

    let totalRevenue = 0, totalTables = 0, totalPresenze = 0;
    const byMonthKey = new Map();                                  // 'YYYY-MM' -> { revenue, tables, presenze }
    const dayBuckets = { 5: { revenue: 0, tables: 0 }, 6: { revenue: 0, tables: 0 }, 0: { revenue: 0, tables: 0 }, x: { revenue: 0, tables: 0 } };
    const venueIdx = new Map();                                    // chiave locale -> indici in ALL_VENUES
    ALL_VENUES.forEach((v, i) => { if (v.key !== '__festivo__') { const l = venueIdx.get(v.key); if (l) l.push(i); else venueIdx.set(v.key, [i]); } });
    const festivoIdx = ALL_VENUES.map((v, i) => (v.key === '__festivo__' ? i : -1)).filter(i => i >= 0);
    const venueAcc = ALL_VENUES.map(() => ({ revenue: 0, tables: 0 }));

    for (const { ev, day, rv, t } of filteredAtts) {
      totalRevenue += rv;
      totalTables += t;
      if (rv > 0) totalPresenze++;

      const mk = day.slice(0, 7);
      let mb = byMonthKey.get(mk);
      if (!mb) { mb = { revenue: 0, tables: 0, presenze: 0 }; byMonthKey.set(mk, mb); }
      mb.revenue += rv; mb.tables += t; if (rv > 0) mb.presenze++;

      const db = ev.is_extra ? dayBuckets.x : dayBuckets[dowOf(ev.date)];
      if (db) { db.revenue += rv; db.tables += t; }

      for (const i of (venueIdx.get(ev.venue) || [])) { venueAcc[i].revenue += rv; venueAcc[i].tables += t; }
      if (ev.is_extra) for (const i of festivoIdx) { venueAcc[i].revenue += rv; venueAcc[i].tables += t; }
    }

    // Mensile cumulativo
    const monthList = eachMonthOfInterval({ start: fromDate, end: toDate });
    const monthly = monthList.map(ms => {
      const label = format(ms, 'MMM yy', { locale: it });
      const mb = byMonthKey.get(`${ms.getFullYear()}-${String(ms.getMonth() + 1).padStart(2, '0')}`);
      return { label, revenue: mb ? mb.revenue : 0, tables: mb ? mb.tables : 0, presenze: mb ? mb.presenze : 0 };
    });

    // Per giorno cumulativo
    const byDay = [
      { label: 'Venerdì', b: dayBuckets[5] }, { label: 'Sabato', b: dayBuckets[6] },
      { label: 'Domenica', b: dayBuckets[0] }, { label: 'Extra/Festivi', b: dayBuckets.x },
    ].map(({ label, b }) => ({ label, revenue: b.revenue, tables: b.tables }));

    // Serata per serata (eventi del periodo con fatturato aggregato del team)
    const eventsInRange = events
      .filter(e => dayInRange(e.date) !== null)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

    const perSerata = [];
    for (const ev of eventsInRange) {
      const evAtts = attsByEvent.get(ev.id) || [];
      let revenue = 0, tables = 0;
      for (const a of evAtts) {
        const rv = a.revenue || 0;
        revenue += rv;
        tables += calcTables(rv, ev.is_extra ? 0 : dowOf(ev.date));
      }
      if (revenue > 0) {
        perSerata.push({
          label: format(parseISO(ev.date), 'dd/MM', { locale: it }),
          date: ev.date,
          nome: ev.name,
          venue: ev.venue || (ev.is_extra ? 'Extra/Festivi' : ''),
          revenue,
          tables: Math.round(tables * 10) / 10,
        });
      }
    }

    // Per locale (fatturato aggregato del team nel periodo)
    const perLocale = ALL_VENUES.map((v, i) => ({
      key: v.key, label: v.key === '__festivo__' ? 'Extra/Festivi' : v.key,
      revenue: venueAcc[i].revenue, tables: Math.round(venueAcc[i].tables * 10) / 10, hex: v.hex,
    })).filter(x => x.revenue > 0);

    return { totalRevenue, totalTables, totalPresenze, monthly, byDay, perSerata, perLocale };
  }, [teamPromoters, allAttendances, events, fromDate, toDate]);
}

function ChartCard({ title, accentColor = '#a78bfa', children, fullscreen = false, aside = null }) {
  if (fullscreen) return <>{children}</>;
  return (
    <Div
      className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-5"
      style={{ boxShadow: `0 4px 24px -6px ${accentColor}18` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      {title && <SectionHeader icon={TrendingUp} title={title} color={accentColor} className="mb-4" />}
      {children}
      {aside}
    </Div>
  );
}

// `stage`: quanti grafici montare (1-5, vedi ChartSlot); default = tutti (uso senza montaggio a stadi).
export default function TeamCumulativeCharts({ activeTeam, allAttendances, events, stage = Infinity }) {
  const now = new Date();
  const [fromYear, setFromYear] = useState(2023);
  const [fromMonth, setFromMonth] = useState(0);
  const [toYear, setToYear] = useState(now.getFullYear());
  const [toMonth, setToMonth] = useState(now.getMonth());
  const fromDate = useMemo(() => startOfMonth(new Date(fromYear, fromMonth, 1)), [fromYear, fromMonth]);
  const toDate = useMemo(() => endOfMonth(new Date(toYear, toMonth, 1)), [toYear, toMonth]);

  const { totalRevenue, totalTables, totalPresenze, monthly, byDay, perSerata, perLocale } =
    useCumulativeData(activeTeam, allAttendances, events, fromDate, toDate);

  const avgSerata = perSerata.length > 0 ? Math.round(perSerata.reduce((s, x) => s + x.revenue, 0) / perSerata.length) : 0;

  // Serie single-series per uPlot
  const seriesRevenue = useMemo(() => [{ key: 'revenue', name: 'Fatturato Team', color: 'hsl(275 72% 52%)' }], []);
  const seriesTables = useMemo(() => [{ key: 'tables', name: 'Tavoli Team', color: 'hsl(200 70% 50%)' }], []);
  const seriesDayRevenue = useMemo(() => [{ key: 'revenue', name: 'Fatturato', color: 'hsl(40 80% 55%)' }], []);
  const seriesSerata = useMemo(() => [{ key: 'revenue', name: 'Fatturato Team', color: 'hsl(200 70% 50%)' }], []);

  const xLabelsMonths = useMemo(() => monthly.map(m => m.label), [monthly]);
  const xLabelsByDay = useMemo(() => byDay.map(d => d.label), [byDay]);
  const xLabelsSerata = useMemo(() => perSerata.map(s => s.label), [perSerata]);

  return (
    <Div className="space-y-6">
      {/* Titolo sezione */}
      <SectionHeader icon={TrendingUp} title="Andamento Cumulativo Team" color="#a78bfa" size="lg" className="mb-2" />

      {/* Periodo */}
      <Div
        className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-4 flex flex-wrap items-center gap-4"
        style={{ boxShadow: '0 4px 20px -6px rgba(96,165,250,0.08)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-40"
          style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
        <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Periodo</Span>
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-xs text-muted-foreground">Da</Span>
          <MonthSelect value={fromMonth} onChange={setFromMonth} />
          <YearSelect value={fromYear} onChange={setFromYear} />
          <Span className="text-xs text-muted-foreground">A</Span>
          <MonthSelect value={toMonth} onChange={setToMonth} />
          <YearSelect value={toYear} onChange={setToYear} />
        </Div>
        <Span className="text-xs text-muted-foreground ml-auto">
          {format(fromDate, 'MMM yyyy', { locale: it })} → {format(toDate, 'MMM yyyy', { locale: it })}
        </Span>
      </Div>

      {/* KPI Cards */}
      <Div className="grid grid-cols-3 gap-3">
        <Div
          className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-4 text-center"
          style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.12)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
          <Euro className="w-5 h-5 text-primary mx-auto mb-1.5" />
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Fatturato Totale</P>
          <P className="text-xl font-bold text-primary">€{totalRevenue.toLocaleString('it-IT')}</P>
        </Div>
        <Div
          className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-4 text-center"
          style={{ boxShadow: '0 4px 24px -6px rgba(96,165,250,0.12)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
          <BarChart2 className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Tavoli Totali</P>
          <P className="text-xl font-bold text-blue-400">{totalTables.toFixed(1).replace('.', ',')}</P>
        </Div>
        <Div
          className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-4 text-center"
          style={{ boxShadow: '0 4px 24px -6px rgba(74,222,128,0.12)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, #4ade80, transparent)' }} />
          <CalendarDays className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Serate fatturate</P>
          <P className="text-xl font-bold text-green-400">{totalPresenze}</P>
        </Div>
      </Div>

      {/* Area chart — fatturato mensile (uPlot line) */}
      <ChartFullscreen title="Fatturato Mensile — Team" scrollable={false} icon={TrendingUp} accentColor="#a78bfa" rotateOnMobile>
        <ChartCard title="Fatturato Mensile — Cumulativo Team">
          <ChartSlot ready={stage >= 1} height={240}>
          <UPlotLineChart
            data={monthly}
            series={seriesRevenue}
            xLabels={xLabelsMonths}
            valueFormatter={fmt}
            height={240}
          />
          </ChartSlot>
        </ChartCard>
      </ChartFullscreen>

      {/* Bar chart — tavoli mensili (uPlot bar) */}
      <ChartFullscreen title="Tavoli Mensili — Team" scrollable={false} icon={TrendingUp} accentColor="#60a5fa" rotateOnMobile>
        <ChartCard title="Tavoli Mensili — Cumulativo Team" accentColor="#60a5fa">
          <ChartSlot ready={stage >= 2} height={220}>
          <UPlotBarChart
            data={monthly}
            series={seriesTables}
            xLabels={xLabelsMonths}
            valueFormatter={v => Number(v).toFixed(1)}
            height={220}
          />
          </ChartSlot>
        </ChartCard>
      </ChartFullscreen>

      {/* Per giorno cumulativo (uPlot bar) */}
      <ChartFullscreen title="Fatturato per Giorno — Team" scrollable={false} icon={TrendingUp} accentColor="#fbbf24" rotateOnMobile>
        <ChartCard title="Fatturato per Giorno — Cumulativo Team" accentColor="#fbbf24">
          <ChartSlot ready={stage >= 3} height={220}>
          <UPlotBarChart
            data={byDay}
            series={seriesDayRevenue}
            xLabels={xLabelsByDay}
            valueFormatter={fmt}
            height={220}
          />
          </ChartSlot>
        </ChartCard>
      </ChartFullscreen>

      {/* Andamento serata per serata (uPlot line) */}
      {perSerata.length > 0 && (
        <ChartFullscreen title="Andamento Serata per Serata — Team" scrollable={false} icon={TrendingUp} accentColor="#a78bfa" rotateOnMobile>
          <ChartCard title="Andamento Serata per Serata — Team" aside={<P className="text-[10px] text-muted-foreground mt-2">Media: {fmt(avgSerata)}</P>}>
            <ChartSlot ready={stage >= 4} height={260}>
            <UPlotLineChart
              data={perSerata}
              series={seriesSerata}
              xLabels={xLabelsSerata}
              valueFormatter={fmt}
              height={260}
            />
            </ChartSlot>
          </ChartCard>
        </ChartFullscreen>
      )}

      {/* Fatturato per locale — barre orizzontali (recharts, pochi locali) */}
      {perLocale.length > 0 && (
        <ChartFullscreen title="Fatturato per Locale — Team" icon={TrendingUp} accentColor="#a78bfa">
          <ChartCard title="Fatturato per Locale — Totale Team" accentColor="#a78bfa">
            <ChartSlot ready={stage >= 5} height={Math.max(180, perLocale.length * 42)}>
            <ResponsiveContainer width="100%" height={Math.max(180, perLocale.length * 42)}>
              <BarChart data={perLocale} layout="vertical" margin={{ left: 0, right: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                <YAxis type="category" dataKey="label" tick={{ fill: 'hsl(0 0% 85%)', fontSize: 11 }} tickLine={false} axisLine={false} width={140} />
                <Tooltip contentStyle={{ ...tooltipStyle, color: '#ffffff' }} labelStyle={{ color: '#ffffff' }} itemStyle={{ color: '#ffffff' }} formatter={(v) => [fmt(v), 'Fatturato Team']} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
            </ChartSlot>
            {/* Lista con loghi */}
            <Div className="mt-4 grid grid-cols-2 gap-2">
              {perLocale.map(d => (
                <Div key={d.key} className="flex items-center justify-between text-xs rounded-lg bg-secondary/20 border border-white/[0.05] px-3 py-2">
                  <Div className="flex items-center gap-1.5 min-w-0">
                    <VenueLogo venueKey={d.key === '__festivo__' ? null : d.key} />
                    <Span className="text-muted-foreground truncate">{d.label}</Span>
                  </Div>
                  <Div className="flex items-center gap-2 shrink-0">
                    <Span className="font-bold text-primary">{fmt(d.revenue)}</Span>
                    <Span className="text-muted-foreground text-[10px]">{d.tables} t.</Span>
                  </Div>
                </Div>
              ))}
            </Div>
          </ChartCard>
        </ChartFullscreen>
      )}
    </Div>
  );
}