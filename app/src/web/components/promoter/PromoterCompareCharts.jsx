// Port di src/components/promoter/PromoterCompareCharts.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useRef, useLayoutEffect } from 'react';
import { motion } from '@/ui/motion';
import { format, startOfMonth, endOfMonth, isWithinInterval, eachMonthOfInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from '@/ui/recharts';
import { calcTables } from '@/legacy/utils/tables';
import { isVisibleInStats } from '@/legacy/utils/promoterVisibility';
import { Euro, Hash, TrendingUp, Activity, BarChart3, CalendarDays, Grid3X3, Trophy, CalendarCheck, CalendarRange } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import MonthlyRevenueTableCompare from './MonthlyRevenueTableCompare';
import SerateCompareTable from './SerateCompareTable';
import PresenzaFatturatoTable from './PresenzaFatturatoTable';
import { PromoterSeasonStatsTable } from './PromoterSeasonStats';
import { MonthSelect, YearSelect } from '@/web/components/shared/MonthYearPicker';
import PromoterChartLegend from './PromoterChartLegend';
import DayTypeFilterToggle from './DayTypeFilterToggle';
import UPlotLineChart from './UPlotLineChart';
import UPlotBarChart from './UPlotBarChart';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { G, Img, SvgText } from '@/ui/elements';

// Palette base (fallback per promoter senza colore dedicato): 12 tonalità sgargianti ben distinte
const COLORS = [
  'hsl(0 80% 58%)',    // rosso
  'hsl(30 92% 55%)',   // arancione
  'hsl(52 95% 55%)',   // giallo
  'hsl(90 80% 50%)',   // verde lime
  'hsl(140 72% 48%)',  // verde smeraldo
  'hsl(172 78% 46%)',  // turchese
  'hsl(192 88% 50%)',  // ciano
  'hsl(215 85% 58%)',  // azzurro
  'hsl(235 82% 62%)',  // blu reale
  'hsl(270 85% 64%)',  // indaco
  'hsl(300 80% 62%)',  // magenta
  'hsl(335 85% 62%)',  // rosa
];

// Colori fissi per promoter specifici (match case-insensitive sul nome).
// I match più lunghi (nome completo) vanno PRIMA dei match brevi (solo nome) per priorità.
const SPECIAL_COLORS = [
  { match: 'antonio iacovelli', color: 'hsl(0 80% 58%)' },    // rosso
  { match: 'francesco cristiano', color: '#65007b' },      // viola scuro (ex Eugenio)
  { match: 'di tota', color: 'hsl(0 0% 22%)' },              // nero (visibile su sfondo scuro)
  { match: 'que fue', color: '#fe6d00' },                 // arancio-rosso
  { match: 'giammarco', color: '#0054fe' },              // blu
  { match: 'genny', color: '#0a6c00' },                  // verde scuro
  { match: 'mirko', color: '#00fffc' },                  // ciano chiaro
  { match: 'sara', color: 'hsl(270 85% 64%)' },            // indaco
  { match: 'eugenio', color: 'hsl(90 80% 50%)' },          // verde lime (ex Francesco Cristiano)
  { match: 'natalia', color: 'hsl(335 85% 62%)' },          // rosa
  { match: 'alessia', color: 'hsl(30 92% 55%)' },          // arancione
  { match: 'alberto', color: 'hsl(52 95% 55%)' },          // giallo
  { match: 'cenzino', color: '#0c00fe' },                // blu elettrico
  { match: 'francesco', color: 'hsl(110 75% 48%)' },        // verde brillante
  { match: 'cristiano', color: 'hsl(300 80% 62%)' },        // magenta
];

function colorForPromoter(p, idx) {
  const norm = (p.name || '').trim().toLowerCase();
  const special = SPECIAL_COLORS.find(s => norm.includes(s.match));
  if (special) return special.color;
  return COLORS[idx % COLORS.length];
}

// Aggiunge alpha a un colore hex (#rrggbb) o hsl/hsla (sintassi space-separated).
function withAlpha(color, alphaHex) {
  if (!color) return color;
  if (color.startsWith('#')) return color + alphaHex;
  if (/^hsla?\(/.test(color)) {
    const a = Math.round((parseInt(alphaHex, 16) / 255) * 100) / 100;
    return color.replace(/^hsl\(/, 'hsla(').replace(/\)$/, ` / ${a})`);
  }
  return color;
}

const fmt = (v) => `€${Number(v).toLocaleString('it-IT')}`;

// Tick a due righe per evitare che i nomi lunghi vengano tagliati sugli assi verticali
function NameTick({ x, y, payload }) {
  const words = String(payload.value).split(' ');
  const first = words[0];
  const rest = words.slice(1).join(' ');
  return (
    <G transform={`translate(${x},${y})`}>
      <SvgText x={0} y={0} dy={rest ? -2 : 4} textAnchor="end" fontSize={11} fill="hsl(0 0% 85%)">{first}</SvgText>
      {rest && <SvgText x={0} y={0} dy={12} textAnchor="end" fontSize={10} fill="hsl(0 0% 60%)">{rest}</SvgText>}
    </G>
  );
}

function ChartCard({ title, delay = 0, accentColor = '#a78bfa', icon: Icon = BarChart3, children, fullscreen = false, scrollable = false, aside = null }) {
  if (fullscreen) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative rounded-2xl border border-white/[0.06] bg-card p-5"
      style={{ overflow: 'visible', boxShadow: `0 4px 24px -6px ${accentColor}18` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      <SectionHeader icon={Icon} title={title} color={accentColor} className="mb-4" />
      {children}
      {aside}
    </motion.div>
  );
}

function matchesDayType({ ev, dow }, dayTypes) {
  if (!dayTypes || dayTypes.length === 0) return true;
  return dayTypes.some(dt => {
    if (dt === 'extra') return ev.is_extra;
    if (dt === 'ven') return dow === 5 && !ev.is_extra;
    if (dt === 'sab') return dow === 6 && !ev.is_extra;
    if (dt === 'dom') return dow === 0 && !ev.is_extra;
    return false;
  });
}

// Pre-calcola i dati per TUTTI i promoter, indipendentemente dalla selezione.
// Memoizzato solo su dati grezzi (allAttendances/events/dates/dayFilter/colors),
// NON sulla selezione: toggolare le chip non fa ricalcolare questa funzione.
function useBuildData(promoters, allAttendances, events, fromDate, toDate, dayFilter, colorByPromoterId) {
  return useMemo(() => {
    const eventsById = new Map(events.map(e => [e.id, e]));

    // Raggruppa le presenze per promoter (una sola passata su allAttendances).
    const byPromoter = new Map(); // promoter_id -> [{ a, ev, d, dow }]
    for (const a of allAttendances) {
      if (!a.event_id || a.client_id) continue;
      const ev = eventsById.get(a.event_id);
      if (!ev?.date) continue;
      const [y, m, dd] = ev.date.split('-').map(Number);
      const d = new Date(y, m - 1, dd);
      const dow = d.getDay();
      const arr = byPromoter.get(a.promoter_id);
      if (arr) arr.push({ a, ev, d, dow });
      else byPromoter.set(a.promoter_id, [{ a, ev, d, dow }]);
    }

    const monthList = eachMonthOfInterval({ start: fromDate, end: toDate });

    // Totale fatturato/tavoli/presenze per promoter nel periodo
    const totalsByPromoterId = {};
    promoters.forEach(p => {
      const recs = byPromoter.get(p.id) || [];
      let rev = 0, tables = 0, presenze = 0;
      for (const r of recs) {
        if (!isWithinInterval(r.d, { start: fromDate, end: toDate })) continue;
        const rv = r.a.revenue || 0;
        rev += rv;
        tables += calcTables(rv, r.ev.is_extra ? 0 : r.dow);
        if (rv > 0) presenze++;
      }
      totalsByPromoterId[p.id] = { name: p.name, revenue: rev, tables, presenze, fill: colorByPromoterId[p.id] };
    });

    // Mensile: per ogni mese, per ogni promoter, fatturato + tavoli (con filtro tipo giorno)
    const months = monthList.map(ms => {
      const me = endOfMonth(ms);
      const entry = { label: format(ms, 'MMM yy', { locale: it }) };
      promoters.forEach(p => {
        const recs = byPromoter.get(p.id) || [];
        let rev = 0, tables = 0;
        for (const r of recs) {
          if (!isWithinInterval(r.d, { start: ms, end: me })) continue;
          if (!matchesDayType({ ev: r.ev, dow: r.dow }, dayFilter)) continue;
          const rv = r.a.revenue || 0;
          rev += rv;
          tables += calcTables(rv, r.ev.is_extra ? 0 : r.dow);
        }
        entry[p.name] = rev;
        entry[`${p.name}_t`] = tables;
      });
      return entry;
    });

    // Per giorno della settimana nel periodo
    const byDay = [
      { label: 'Venerdì', dow: 5 },
      { label: 'Sabato', dow: 6 },
      { label: 'Domenica', dow: 0 },
      { label: 'Extra - Festivi', dow: -1 },
    ].map(({ label, dow }) => {
      const entry = { label };
      promoters.forEach(p => {
        const recs = byPromoter.get(p.id) || [];
        let rev = 0, tables = 0;
        for (const r of recs) {
          if (!isWithinInterval(r.d, { start: fromDate, end: toDate })) continue;
          if (dow === -1) {
            if (!r.ev.is_extra) continue;
          } else {
            if (r.dow !== dow || r.ev.is_extra) continue;
          }
          const rv = r.a.revenue || 0;
          rev += rv;
          tables += calcTables(rv, dow === -1 ? 0 : dow);
        }
        entry[p.name] = rev;
        entry[`${p.name}_t`] = tables;
      });
      return entry;
    });

    // Presenza fatturato mensile (serate con revenue > 0)
    const presenzeMensili = monthList.map(ms => {
      const me = endOfMonth(ms);
      const entry = { label: format(ms, 'MMM yy', { locale: it }) };
      promoters.forEach(p => {
        const recs = byPromoter.get(p.id) || [];
        let count = 0;
        for (const r of recs) {
          if ((r.a.revenue || 0) > 0 && isWithinInterval(r.d, { start: ms, end: me })) count++;
        }
        entry[p.name] = count;
      });
      return entry;
    });

    return { totalsByPromoterId, months, byDay, presenzeMensili };
  }, [promoters, allAttendances, events, fromDate, toDate, dayFilter, colorByPromoterId]);
}

export default function PromoterCompareCharts({ promoters, allAttendances, events }) {
  const active = promoters.filter(p => isVisibleInStats(p));
  const [selected, setSelected] = useState(() => active.map(p => p.id));
  const pendingAnchor = useRef(null);

  // Mappa colore stabile per promoter (indipendente dalla selezione)
  const colorByPromoterId = useMemo(() => {
    const map = {};
    let colorIdx = 0;
    promoters.forEach((p) => {
      map[p.id] = colorForPromoter(p, colorIdx);
      const norm = (p.name || '').trim().toLowerCase();
      const isSpecial = SPECIAL_COLORS.some(s => norm.includes(s.match));
      if (!isSpecial) colorIdx++;
    });
    return map;
  }, [promoters]);

  const now = new Date();
  const [fromYear, setFromYear] = useState(2023);
  const [fromMonth, setFromMonth] = useState(0);
  const [toYear, setToYear] = useState(now.getFullYear());
  const [toMonth, setToMonth] = useState(now.getMonth());
  const [dayFilter, setDayFilter] = useState([]);

  // Date memoizzate: reference stabile finché non cambiano mese/anno → i child memo non re-renderano al toggle
  const fromDate = useMemo(() => startOfMonth(new Date(fromYear, fromMonth, 1)), [fromYear, fromMonth]);
  const toDate = useMemo(() => endOfMonth(new Date(toYear, toMonth, 1)), [toYear, toMonth]);

  // Dati pre-calcolati per TUTTI i promoter (stable al toggle delle chip)
  const { totalsByPromoterId, months, byDay, presenzeMensili } = useBuildData(promoters, allAttendances, events, fromDate, toDate, dayFilter, colorByPromoterId);

  // Subset selezionato (memo: reference stabile finché `selected` non cambia)
  const filtered = useMemo(() => promoters.filter(p => selected.includes(p.id)), [promoters, selected]);
  const totals = useMemo(() => filtered.map(p => totalsByPromoterId[p.id]).filter(Boolean), [filtered, totalsByPromoterId]);
  const totalsByRevenue = useMemo(() => [...totals].sort((a, b) => b.revenue - a.revenue), [totals]);
  const totalsByTables = useMemo(() => [...totals].sort((a, b) => b.tables - a.tables), [totals]);

  // Series / xLabels memoizzati: uPlot si re-inizializza SOLO quando cambia davvero la selezione,
  // non ad ogni render (prima venivano distrutti/ricreati i canvas ad ogni render).
  const seriesRev = useMemo(() => filtered.map(p => ({ key: p.name, name: p.name, color: colorByPromoterId[p.id] })), [filtered, colorByPromoterId]);
  const seriesTables = useMemo(() => filtered.map(p => ({ key: `${p.name}_t`, name: p.name, color: colorByPromoterId[p.id] })), [filtered, colorByPromoterId]);
  const xLabelsMonths = useMemo(() => months.map(m => m.label), [months]);
  const xLabelsByDay = useMemo(() => byDay.map(d => d.label), [byDay]);

  const togglePromoter = (id, e) => {
    const el = e?.currentTarget;
    if (el) {
      pendingAnchor.current = { el, oldTop: el.getBoundingClientRect().top, scrollY: webWindow.scrollY };
    }
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Mantiene la posizione visiva quando i grafici sopra si accorciano:
  // ancoriamo lo scroll al chip cliccato e lo riposizioniamo dopo il re-render.
  useLayoutEffect(() => {
    const a = pendingAnchor.current;
    pendingAnchor.current = null;
    if (!a || !a.el.isConnected) return;
    const newTop = a.el.getBoundingClientRect().top;
    const delta = newTop - a.oldTop;
    if (Math.abs(delta) > 1) {
      webWindow.scrollTo(0, a.scrollY + delta);
    }
  }, [selected]);

  const tooltipStyle = {
    background: 'hsl(240 6% 8%)',
    border: '1px solid hsl(240 5% 18%)',
    borderRadius: '8px',
    fontSize: 12,
    color: '#ffffff',
  };
  const tooltipWrapperStyle = { zIndex: 50, pointerEvents: 'none' };
  const tooltipLabelStyle = { color: '#ffffff' };
  const tooltipItemStyle = { color: '#ffffff' };

  if (promoters.length < 2) {
    return (
      <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-8 text-center"
        style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.06)' }}>
        <P className="text-sm text-muted-foreground">Aggiungi almeno 2 promoter per vedere i confronti</P>
      </Div>
    );
  }

  return (
    <Div className="space-y-5">

      {/* Selettore periodo storico */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-3 sm:p-4 space-y-2"
        style={{ boxShadow: '0 4px 24px -6px rgba(96,165,250,0.08)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-40"
          style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
        <Span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Periodo storico</Span>
        <Div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Span className="text-[10px] sm:text-xs text-muted-foreground">Da</Span>
          <MonthSelect value={fromMonth} onChange={setFromMonth} />
          <YearSelect value={fromYear} onChange={setFromYear} />
          <Span className="text-[10px] sm:text-xs text-muted-foreground">A</Span>
          <MonthSelect value={toMonth} onChange={setToMonth} />
          <YearSelect value={toYear} onChange={setToYear} />
        </Div>
        <P className="text-[10px] sm:text-xs text-muted-foreground">
          {format(fromDate, 'MMM yyyy', { locale: it })} → {format(toDate, 'MMM yyyy', { locale: it })}
        </P>
      </motion.div>

      {/* Selettore promoter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2"
      >
        {promoters.map((p) => {
          const color = colorByPromoterId[p.id];
          const isSelected = selected.includes(p.id);
          return (
            <Btn
              button
              key={p.id}
              onClick={(e) => togglePromoter(p.id, e)}
              className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                isSelected
                  ? 'bg-white/[0.06] border-white/10 text-foreground shadow-sm'
                  : 'bg-transparent border-white/[0.06] text-muted-foreground/50 opacity-60'
              }`}
              style={isSelected ? { boxShadow: `0 0 0 1px ${withAlpha(color, '33')}, 0 2px 10px -2px ${withAlpha(color, '30')}` } : undefined}>
              {p.photo_url ? (
                <Img
                  src={p.photo_url}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover shrink-0 border-2"
                  style={{ borderColor: color, opacity: isSelected ? 1 : 0.5 }}
                />
              ) : (
                <Span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: color, opacity: isSelected ? 1 : 0.5 }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </Span>
              )}
              <Span className="truncate">{p.name}</Span>
            </Btn>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <P className="text-sm text-muted-foreground text-center py-8">Seleziona almeno un promoter</P>
      )}

      {filtered.length > 0 && (
        <>
          {/* 1. Fatturato Totale */}
          <ChartFullscreen title="Fatturato Totale" icon={Euro} accentColor="#a78bfa">
          <ChartCard title="Fatturato Totale" delay={0.1} icon={Euro}>
            <ResponsiveContainer width="100%" height={Math.max(110, filtered.length * 44)}>
              <BarChart data={totalsByRevenue} layout="vertical" margin={{ left: -10, right: -10 }} barCategoryGap="0%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={fmt} />
                <YAxis type="category" dataKey="name" tick={<NameTick />} tickLine={false} axisLine={false} width={78} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} wrapperStyle={tooltipWrapperStyle} allowEscapeViewBox={{ x: true, y: true }} formatter={(v) => [fmt(v), 'Fatturato']} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={26}>
                  {totalsByRevenue.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          </ChartFullscreen>

          {/* 2. Tavoli Totali */}
          <ChartFullscreen title="Tavoli Totali Prodotti" icon={Hash} accentColor="#60a5fa">
          <ChartCard title="Tavoli Totali Prodotti" delay={0.12} accentColor="#60a5fa" icon={Hash}>
            <ResponsiveContainer width="100%" height={Math.max(110, filtered.length * 44)}>
              <BarChart data={totalsByTables} layout="vertical" margin={{ left: -10, right: -10 }} barCategoryGap="0%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={<NameTick />} tickLine={false} axisLine={false} width={78} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} wrapperStyle={tooltipWrapperStyle} allowEscapeViewBox={{ x: true, y: true }} formatter={(v) => [Number(v).toFixed(1), 'Tavoli']} />
                <Bar dataKey="tables" radius={[0, 6, 6, 0]} maxBarSize={26}>
                  {totalsByTables.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          </ChartFullscreen>

          {/* 2b. Presenza fatturato — tabella mensile */}
          <ChartFullscreen title="Presenza Fatturato — Mensile" bare scrollable icon={CalendarCheck} accentColor="#4ade80" rotateOnMobile>
            <PresenzaFatturatoTable
              filtered={filtered}
              presenzeMensili={presenzeMensili}
              totals={totals}
              promoters={promoters}
              allAttendances={allAttendances}
              events={events}
            />
          </ChartFullscreen>

          {/* Toggle filtro tipo giorno — controlla i grafici mensili 3/4/5 */}
          <Div className="flex items-center justify-between flex-wrap gap-2 rounded-xl border border-white/[0.06] bg-card px-3 py-2">
            <Span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vista mensile</Span>
            <DayTypeFilterToggle dayFilter={dayFilter} onChange={setDayFilter} />
          </Div>

          {/* 3. Fatturato Mensile — andamento linee */}
          <ChartFullscreen title="Fatturato Mensile — Andamento" scrollable={false} icon={TrendingUp} accentColor="#a78bfa" rotateOnMobile>
            <ChartCard title="Fatturato Mensile — Andamento" delay={0.14} icon={TrendingUp} aside={<PromoterChartLegend promoters={promoters} colors={promoters.map(p => colorByPromoterId[p.id])} onToggle={togglePromoter} selectedIds={selected} />}>
              <UPlotLineChart
                data={months}
                series={seriesRev}
                xLabels={xLabelsMonths}
                valueFormatter={fmt}
                height={400}
              />
            </ChartCard>
          </ChartFullscreen>

          {/* 4. Tavoli Mensili — andamento */}
          <ChartFullscreen title="Tavoli Mensili — Andamento" scrollable={false} icon={Activity} accentColor="#60a5fa" rotateOnMobile>
            <ChartCard title="Tavoli Mensili — Andamento" delay={0.16} accentColor="#60a5fa" icon={Activity} aside={<PromoterChartLegend promoters={promoters} colors={promoters.map(p => colorByPromoterId[p.id])} onToggle={togglePromoter} selectedIds={selected} />}>
              <UPlotLineChart
                data={months}
                series={seriesTables}
                xLabels={xLabelsMonths}
                valueFormatter={v => Number(v).toFixed(1)}
                height={400}
              />
            </ChartCard>
          </ChartFullscreen>

          {/* 5. Fatturato mensile barre */}
          <ChartFullscreen title="Fatturato Mensile — Confronto" scrollable={false} icon={BarChart3} accentColor="#a78bfa" rotateOnMobile>
            <ChartCard title="Fatturato Mensile — Confronto" delay={0.18} icon={BarChart3} aside={<PromoterChartLegend promoters={promoters} colors={promoters.map(p => colorByPromoterId[p.id])} onToggle={togglePromoter} selectedIds={selected} />}>
              <UPlotBarChart
                data={months}
                series={seriesRev}
                xLabels={xLabelsMonths}
                valueFormatter={fmt}
                height={250}
              />
            </ChartCard>
          </ChartFullscreen>

          {/* 5b. Tabella testuale fatturato mensile */}
          <MonthlyRevenueTableCompare
            filtered={filtered}
            allAttendances={allAttendances}
            events={events}
            fromDate={fromDate}
            toDate={toDate}
            promoters={promoters}
          />

          {/* 5c. Confronto per Serate — chip locale + tabella per serata + chip promoter */}
          <ChartFullscreen title="Confronto per Serate" bare scrollable icon={CalendarRange} accentColor="#60a5fa" rotateOnMobile>
            <SerateCompareTable
              promoters={promoters}
              allAttendances={allAttendances}
              events={events}
            />
          </ChartFullscreen>

          {/* 6. Per giorno — fatturato */}
          <ChartFullscreen title="Fatturato per Giorno" scrollable={false} icon={CalendarDays} accentColor="#a78bfa" rotateOnMobile>
            <ChartCard title="Fatturato per Giorno (Ven / Sab / Dom)" delay={0.2} icon={CalendarDays} aside={<PromoterChartLegend promoters={promoters} colors={promoters.map(p => colorByPromoterId[p.id])} onToggle={togglePromoter} selectedIds={selected} />}>
              <UPlotBarChart
                data={byDay}
                series={seriesRev}
                xLabels={xLabelsByDay}
                valueFormatter={fmt}
                height={440}
              />
            </ChartCard>
          </ChartFullscreen>

          {/* 7. Per giorno — tavoli */}
          <ChartFullscreen title="Tavoli per Giorno" scrollable={false} icon={Grid3X3} accentColor="#60a5fa" rotateOnMobile>
            <ChartCard title="Tavoli per Giorno (Ven / Sab / Dom)" delay={0.22} accentColor="#60a5fa" icon={Grid3X3} aside={<PromoterChartLegend promoters={promoters} colors={promoters.map(p => colorByPromoterId[p.id])} onToggle={togglePromoter} selectedIds={selected} />}>
              <UPlotBarChart
                data={byDay}
                series={seriesTables}
                xLabels={xLabelsByDay}
                valueFormatter={v => Number(v).toFixed(1)}
                height={440}
              />
            </ChartCard>
          </ChartFullscreen>

          {/* 8. Confronto Stagioni */}
          <ChartCard title="Confronto Stagioni per Promoter" delay={0.24} accentColor="#4ade80" icon={Trophy}>
            <PromoterSeasonStatsTable
              promoters={promoters}
              selectedIds={selected}
              allAttendances={allAttendances}
              events={events}
            />
          </ChartCard>
        </>
      )}
    </Div>
  );
}