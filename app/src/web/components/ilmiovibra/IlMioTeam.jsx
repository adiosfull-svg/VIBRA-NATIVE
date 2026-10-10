// Port di src/components/ilmiovibra/IlMioTeam.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchTeamAttendances, teamAttendancesKey } from '@/web/lib/safeData';
import { localDayKey, makeDayRangeCheck } from '@/legacy/utils/dateUtils';
import { Users, Euro, TrendingUp, Calendar, LayoutGrid, BarChart3, Swords } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from '@/ui/recharts';
import { calcTables } from '@/legacy/utils/tables';
import { MonthSelect, YearSelect } from '@/web/components/shared/MonthYearPicker';
import TeamBacheca from './TeamBacheca';
import TeamCumulativeCharts from './TeamCumulativeCharts';
import PresenzaFatturatoTable from '@/web/components/promoter/PresenzaFatturatoTable';
import MonthlyVenueChart from './MonthlyVenueChart';
import UPlotBarChart from '@/web/components/promoter/UPlotBarChart';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Btn, Div, P, Span } from '@/ui/html';

const COLORS = [
  'hsl(275 72% 52%)', 'hsl(200 70% 50%)', 'hsl(150 60% 45%)',
  'hsl(40 80% 55%)', 'hsl(340 65% 55%)', 'hsl(20 80% 55%)', 'hsl(180 60% 45%)'
];

const fmt = (v) => `€${Number(v).toLocaleString('it-IT')}`;

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '8px',
  fontSize: 12,
  color: '#ffffff',
};

// Array vuoto a identità STABILE (con `= []` ogni render ne crea uno nuovo finché i dati non ci sono
// e tutti i useMemo che lo hanno tra le dipendenze si ricalcolano a ogni render).
const EMPTY_ARR = [];

// Monta i blocchi pesanti (grafici uPlot/recharts) a stadi, UNO per volta e solo DOPO le animazioni di
// ingresso della pagina (che restano quelle originali). Prima i ~12 grafici del tab si montavano tutti
// nello stesso render: un unico task lungo proprio mentre parte l'animazione di apertura.
function useStagedMount(total, startDelay = 520) {
  const ssr = typeof window === 'undefined';
  const [stage, setStage] = useState(ssr ? total : 0);
  useEffect(() => {
    if (ssr || stage >= total) return;
    if (stage === 0) {
      const t = setTimeout(() => setStage(1), startDelay);
      return () => clearTimeout(t);
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setStage((x) => x + 1)); });
    return () => { cancelAnimationFrame(raf1); if (raf2) cancelAnimationFrame(raf2); };
  }, [stage, total, ssr, startDelay]);
  return stage;
}

// Segnaposto STATICO (nessuna animazione) della stessa altezza del grafico: niente salti di layout.
function ChartSlot({ ready, height, children }) {
  return ready ? children : <Div style={{ height }} />;
}

// Pre-calcolo memoizzato per TUTTI i membri del team.
// - presenze del team raggruppate per promoter in UN solo passaggio (le altre non servono);
// - ogni presenza porta già giorno/mese ('YYYY-MM-DD' locale) e giorno della settimana: totali, mesi e
//   giorni si ottengono aggregando UNA volta, senza rifare per ogni mese (fino a 40+) un ciclo con
//   isWithinInterval su tutte le presenze (mesi × promoter × presenze confronti di Date);
// - NON dipende da `selected`: toggolare le chip non fa ricalcolare.
// I risultati sono identici a prima (stesso ordine di somma).
function useBuildData(teamPromoters, allAttendances, events, fromDate, toDate) {
  return useMemo(() => {
    const eventsById = new Map(events.map(e => [e.id, e]));
    const teamIds = new Set(teamPromoters.map(p => p.id));
    const inPeriod = makeDayRangeCheck(fromDate, toDate);

    // promoter_id -> { rev, tables, presenze, byMonth: Map('YYYY-MM' -> {rev,tables}), byDay: {5,6,0,x} }
    const acc = new Map();
    const getAcc = (id) => {
      let a = acc.get(id);
      if (!a) {
        a = { rev: 0, tables: 0, presenze: 0, byMonth: new Map(),
          byDay: { 5: { rev: 0, tables: 0 }, 6: { rev: 0, tables: 0 }, 0: { rev: 0, tables: 0 }, x: { rev: 0, tables: 0 } } };
        acc.set(id, a);
      }
      return a;
    };

    for (const a of allAttendances) {
      if (a.client_id) continue;
      if (!teamIds.has(a.promoter_id)) continue;
      const ev = eventsById.get(a.event_id);
      if (!ev?.date) continue;
      const [y, m, d] = ev.date.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      const dayKey = localDayKey(dt);
      if (!inPeriod(dayKey)) continue;   // identico a isWithinInterval(dt, {fromDate, toDate}), anche a intervallo invertito
      const dow = dt.getDay();
      const rv = a.revenue || 0;
      const t = calcTables(rv, ev.is_extra ? 0 : dow);
      const pa = getAcc(a.promoter_id);
      pa.rev += rv;
      pa.tables += t;
      if (rv > 0) pa.presenze++;
      const mk = dayKey.slice(0, 7);
      let mb = pa.byMonth.get(mk);
      if (!mb) { mb = { rev: 0, tables: 0 }; pa.byMonth.set(mk, mb); }
      mb.rev += rv;
      mb.tables += t;
      const bucket = ev.is_extra ? pa.byDay.x : pa.byDay[dow];
      if (bucket) { bucket.rev += rv; bucket.tables += t; }
    }
    const EMPTY_ACC = { rev: 0, tables: 0, presenze: 0, byMonth: new Map(), byDay: { 5: { rev: 0, tables: 0 }, 6: { rev: 0, tables: 0 }, 0: { rev: 0, tables: 0 }, x: { rev: 0, tables: 0 } } };

    // Totali per ogni promoter nel periodo
    const totalsAll = teamPromoters.map((p, i) => {
      const pa = acc.get(p.id) || EMPTY_ACC;
      return { id: p.id, name: p.name, revenue: pa.rev, tables: pa.tables, presenze: pa.presenze, fill: COLORS[i % COLORS.length] };
    });

    // Mensile: per ogni mese, per ogni promoter, fatturato + tavoli
    const monthList = eachMonthOfInterval({ start: fromDate, end: toDate });
    const months = monthList.map(ms => {
      const mk = `${ms.getFullYear()}-${String(ms.getMonth() + 1).padStart(2, '0')}`;
      const entry = { label: format(ms, 'MMM yy', { locale: it }) };
      teamPromoters.forEach(p => {
        const mb = (acc.get(p.id) || EMPTY_ACC).byMonth.get(mk);
        entry[p.name] = mb ? mb.rev : 0;
        entry[`${p.name}_t`] = mb ? mb.tables : 0;
      });
      return entry;
    });

    // Per giorno della settimana nel periodo
    const byDay = [
      { label: 'Venerdì', slot: 5 }, { label: 'Sabato', slot: 6 },
      { label: 'Domenica', slot: 0 }, { label: 'Extra - Festivi', slot: 'x' },
    ].map(({ label, slot }) => {
      const entry = { label };
      teamPromoters.forEach(p => {
        const b = (acc.get(p.id) || EMPTY_ACC).byDay[slot];
        entry[p.name] = b.rev;
        entry[`${p.name}_t`] = b.tables;
      });
      return entry;
    });

    return { totalsAll, months, byDay };
  }, [teamPromoters, allAttendances, events, fromDate, toDate]);
}

function ChartCard({ title, icon: Icon = BarChart3, accentColor = '#a78bfa', children, fullscreen = false }) {
  if (fullscreen) return <>{children}</>;
  return (
    <Div
      className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-5"
      style={{ boxShadow: `0 4px 24px -6px ${accentColor}18` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      <SectionHeader icon={Icon} title={title} color={accentColor} className="mb-4" />
      {children}
    </Div>
  );
}

export default function IlMioTeam({ promoter, isActive = true }) {
  const qc = useQueryClient();
  const { data: promoters = EMPTY_ARR, isFetched: promotersFetched } = useQuery({ queryKey: ['promoters'], queryFn: () => base44.entities.Promoter.list(), enabled: isActive, staleTime: 15 * 60000, gcTime: 20 * 60000, refetchOnWindowFocus: false, retry: 0 });
  const { data: events = EMPTY_ARR } = useQuery({ queryKey: ['events'], queryFn: () => base44.entities.Event.list('-date', 5000), enabled: isActive, staleTime: 15 * 60000, gcTime: 20 * 60000, refetchOnWindowFocus: false, retry: 0 });

  const now = new Date();
  const [fromYear, setFromYear] = useState(2023);
  const [fromMonth, setFromMonth] = useState(0);
  const [toYear, setToYear] = useState(now.getFullYear());
  const [toMonth, setToMonth] = useState(now.getMonth());
  const fromDate = useMemo(() => startOfMonth(new Date(fromYear, fromMonth, 1)), [fromYear, fromMonth]);
  const toDate = useMemo(() => endOfMonth(new Date(toYear, toMonth, 1)), [toYear, toMonth]);

  // Team derivato e memoizzato (ref stabile finché non cambia davvero la composizione)
  const teamMembers = useMemo(
    () => promoters.filter(p => p.referente_id === promoter.id && p.id !== promoter.id),
    [promoters, promoter.id]
  );
  const activeTeam = useMemo(
    () => [promoter, ...teamMembers.filter(m => m.ruolo !== 'ragazza_immagine')],
    [promoter, teamMembers]
  );
  const bonusMembers = useMemo(
    () => teamMembers.filter(m => m.ruolo === 'ragazza_immagine'),
    [teamMembers]
  );

  // SOLO le presenze dei membri del team (una richiesta per membro, in parallelo; la propria è già
  // in cache). Prima scaricava l'INTERA tabella presenze (5000+ righe a pagine da 1000 in fila,
  // ~6 round-trip consecutivi) per usarne una frazione: l'esitazione all'apertura del tab.
  // Si aspetta che i promoter siano caricati per scaricare UNA volta sola con gli id corretti.
  const teamIds = useMemo(() => activeTeam.map(p => p.id), [activeTeam]);
  const { data: attendances = EMPTY_ARR } = useQuery({
    queryKey: teamAttendancesKey(teamIds),
    queryFn: () => fetchTeamAttendances(qc, base44.entities.EventAttendance, teamIds),
    enabled: isActive && promotersFetched && teamIds.length > 0,
    staleTime: 15 * 60000, gcTime: 20 * 60000, refetchOnWindowFocus: false, retry: 0,
  });

  const teamKey = activeTeam.map(p => p.id).join(',');
  const [selected, setSelected] = useState(() => activeTeam.map(p => p.id));
  useEffect(() => {
    setSelected(activeTeam.map(p => p.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamKey]);

  // Mappa colori stabile per promoter
  const colorByPromoterId = useMemo(() => {
    const m = {};
    activeTeam.forEach((p, i) => { m[p.id] = COLORS[i % COLORS.length]; });
    return m;
  }, [activeTeam]);

  // Dati pre-calcolati per TUTTO il team (stable al toggle delle chip)
  const { totalsAll, months, byDay } = useBuildData(activeTeam, attendances, events, fromDate, toDate);

  // Subset selezionato (memo)
  const filtered = useMemo(() => activeTeam.filter(p => selected.includes(p.id)), [activeTeam, selected]);
  const totals = useMemo(() => totalsAll.filter(t => selected.includes(t.id)), [totalsAll, selected]);
  const totalsByRevenue = useMemo(() => [...totals].sort((a, b) => b.revenue - a.revenue), [totals]);
  const totalsByTables = useMemo(() => [...totals].sort((a, b) => b.tables - a.tables), [totals]);

  // Serie memoizzate per uPlot (re-init solo quando cambia la selezione)
  const seriesRev = useMemo(
    () => filtered.map(p => ({ key: p.name, name: p.name, color: colorByPromoterId[p.id] })),
    [filtered, colorByPromoterId]
  );
  const seriesTables = useMemo(
    () => filtered.map(p => ({ key: `${p.name}_t`, name: p.name, color: colorByPromoterId[p.id] })),
    [filtered, colorByPromoterId]
  );
  const xLabelsMonths = useMemo(() => months.map(m => m.label), [months]);
  const xLabelsByDay = useMemo(() => byDay.map(d => d.label), [byDay]);

  // Totali per la bacheca
  const bacheaTotalRevenue = totals.reduce((s, t) => s + t.revenue, 0);
  const bacheaTotalTables = totals.reduce((s, t) => s + t.tables, 0);

  // Stadi di montaggio dei grafici (vedi useStagedMount): 1-5 = grafici del team cumulativo,
  // 6-8 = barre recharts, 9-11 = grafici uPlot di confronto.
  const stage = useStagedMount(11);

  return (
    <Div className="space-y-8">

      {/* ── BACHECA TEAM ── */}
      <TeamBacheca
        promoter={promoter}
        activeTeam={activeTeam}
        bonusMembers={bonusMembers}
        totalRevenue={bacheaTotalRevenue}
        totalTables={bacheaTotalTables}
      />

      {teamMembers.length === 0 && (
        <Div className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-10 text-center space-y-3">
          <Users className="w-10 h-10 text-muted-foreground mx-auto" />
          <P className="font-semibold">Nessun membro nel team</P>
          <P className="text-sm text-muted-foreground max-w-xs mx-auto">I promoter che ti scelgono come referente appariranno automaticamente qui.</P>
        </Div>
      )}

      {filtered.length > 0 && (
        <>
          {/* ── GRAFICI CUMULATIVI ── */}
          <TeamCumulativeCharts activeTeam={activeTeam} allAttendances={attendances} events={events} stage={stage} />

          {/* ── DIVIDER confronto ── */}
          <SectionHeader icon={Swords} title="Confronto Promoter a Promoter" color="#a78bfa" size="lg" className="mt-2" />

          {/* Periodo */}
          <Div
            className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-4 flex flex-wrap items-center gap-4"
            style={{ boxShadow: '0 4px 20px -6px rgba(96,165,250,0.08)' }}
          >
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-40"
              style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />
            <SectionHeader icon={Calendar} title="Periodo storico" color="#60a5fa" />
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

          {/* Filtro membri */}
          <Div className="flex flex-wrap gap-2">
            {activeTeam.map((p) => {
              const color = colorByPromoterId[p.id];
              const isSelected = selected.includes(p.id);
              return (
                <Btn
                  button
                  key={p.id}
                  onClick={() => setSelected(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    isSelected ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                  }`}>
                  <Span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <Span className="flex items-center gap-1">
                    <Span>{p.name}{p.id === promoter.id ? ' (tu)' : ''}</Span>
                    {p.promoter_from && (
                      <Span className="text-[10px] text-muted-foreground/70 px-1.5 py-0.5 rounded bg-secondary/30 border border-border/50">
                        dal {format(parseISO(p.promoter_from), 'd MMM yy', { locale: it })}
                      </Span>
                    )}
                  </Span>
                </Btn>
              );
            })}
          </Div>

          {/* Presenza fatturato mensile */}
          <PresenzaFatturatoTable
            filtered={filtered}
            promoters={activeTeam}
            allAttendances={attendances}
            events={events}
          />

          {/* 1. Fatturato Totale */}
          <ChartFullscreen title="Fatturato Totale nel Periodo" icon={Euro} accentColor="#a78bfa">
            <ChartCard title="Fatturato Totale nel Periodo" icon={Euro} accentColor="#a78bfa">
              <ChartSlot ready={stage >= 6} height={Math.max(120, filtered.length * 48)}>
              <ResponsiveContainer width="100%" height={Math.max(120, filtered.length * 48)}>
                <BarChart data={totalsByRevenue} layout="vertical" margin={{ left: 0, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={fmt} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(0 0% 85%)', fontSize: 12 }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 5% 18%)' }} formatter={(v) => [fmt(v), 'Fatturato']} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#ffffff' }} />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                    {totalsByRevenue.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </ChartSlot>
            </ChartCard>
          </ChartFullscreen>

          {/* 2. Tavoli Totali */}
          <ChartFullscreen title="Tavoli Totali Prodotti" icon={LayoutGrid} accentColor="#60a5fa">
            <ChartCard title="Tavoli Totali Prodotti" icon={LayoutGrid} accentColor="#60a5fa">
              <ChartSlot ready={stage >= 7} height={Math.max(120, filtered.length * 48)}>
              <ResponsiveContainer width="100%" height={Math.max(120, filtered.length * 48)}>
                <BarChart data={totalsByTables} layout="vertical" margin={{ left: 0, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(0 0% 85%)', fontSize: 12 }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 5% 18%)' }} formatter={(v) => [Number(v).toFixed(1), 'Tavoli']} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#ffffff' }} />
                  <Bar dataKey="tables" radius={[0, 6, 6, 0]}>
                    {totalsByTables.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </ChartSlot>
            </ChartCard>
          </ChartFullscreen>

          {/* 3. Presenze */}
          <ChartFullscreen title="Presenze con Fatturato" icon={Calendar} accentColor="#4ade80">
            <ChartCard title="Presenze con Fatturato" icon={Calendar} accentColor="#4ade80">
              <ChartSlot ready={stage >= 8} height={Math.max(120, filtered.length * 48)}>
              <ResponsiveContainer width="100%" height={Math.max(120, filtered.length * 48)}>
                <BarChart data={totals} layout="vertical" margin={{ left: 0, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(0 0% 85%)', fontSize: 12 }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 5% 18%)' }} formatter={(v) => [v, 'Serate']} itemStyle={{ color: '#ffffff' }} labelStyle={{ color: '#ffffff' }} />
                  <Bar dataKey="presenze" radius={[0, 6, 6, 0]}>
                    {totals.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </ChartSlot>
            </ChartCard>
          </ChartFullscreen>

          {/* 4. Fatturato Mensile per Locale */}
          <MonthlyVenueChart promoterId={promoter.id} attendances={attendances} events={events} />

          {/* 5. Fatturato Mensile — Confronto (uPlot) */}
          <ChartFullscreen title="Fatturato Mensile — Confronto" scrollable={false} icon={TrendingUp} accentColor="#a78bfa" rotateOnMobile>
            <ChartCard title="Fatturato Mensile — Confronto" icon={TrendingUp} accentColor="#a78bfa">
              <ChartSlot ready={stage >= 9} height={240}>
              <UPlotBarChart
                data={months}
                series={seriesRev}
                xLabels={xLabelsMonths}
                valueFormatter={fmt}
                height={240}
              />
              </ChartSlot>
            </ChartCard>
          </ChartFullscreen>

          {/* 6. Fatturato per Giorno (uPlot) */}
          <ChartFullscreen title="Fatturato per Giorno (Ven / Sab / Dom)" scrollable={false} icon={BarChart3} accentColor="#60a5fa" rotateOnMobile>
            <ChartCard title="Fatturato per Giorno (Ven / Sab / Dom)" icon={BarChart3} accentColor="#60a5fa">
              <ChartSlot ready={stage >= 10} height={220}>
              <UPlotBarChart
                data={byDay}
                series={seriesRev}
                xLabels={xLabelsByDay}
                valueFormatter={fmt}
                height={220}
              />
              </ChartSlot>
            </ChartCard>
          </ChartFullscreen>

          {/* 7. Tavoli per Giorno (uPlot) */}
          <ChartFullscreen title="Tavoli per Giorno (Ven / Sab / Dom)" scrollable={false} icon={LayoutGrid} accentColor="#60a5fa" rotateOnMobile>
            <ChartCard title="Tavoli per Giorno (Ven / Sab / Dom)" icon={LayoutGrid} accentColor="#60a5fa">
              <ChartSlot ready={stage >= 11} height={220}>
              <UPlotBarChart
                data={byDay}
                series={seriesTables}
                xLabels={xLabelsByDay}
                valueFormatter={v => Number(v).toFixed(1)}
                height={220}
              />
              </ChartSlot>
            </ChartCard>
          </ChartFullscreen>
        </>
      )}
    </Div>
  );
}