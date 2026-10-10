// Port di src/components/ilmiovibra/GuadagniDettagliatiNuovo.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useRef } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchByPromoter } from '@/web/lib/safeData';
import { parseISO, startOfWeek, endOfWeek, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from '@/legacy/utils/tables';
import { ChevronDown, Trophy, TrendingUp, Home, Calendar, Star } from '@/ui/icons.generated';
import UPlotLineChart from '@/web/components/promoter/UPlotLineChart';
import ChartFullscreen, { FullscreenButton } from '@/web/components/charts/ChartFullscreen';
import SectionHeader from '@/web/components/shared/SectionHeader';
import ProiezioneMese from '@/web/components/ilmiovibra/ProiezioneMese';

import { Btn, Div, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const GUADAGNI_COLOR = '#a78bfa';

// Icona professionale con sfondo tint (stesso stile di SectionHeader / Mie Note)
function IconBadge({ icon: Icon, color }) {
  return (
    <Span className="inline-flex items-center justify-center p-1 rounded-lg shrink-0" style={{ background: `${color}1a` }}>
      <Icon className="w-3.5 h-3.5" style={{ color }} />
    </Span>
  );
}

function calcGuadagno(att) {
  return Number(att.guadagno_pct || 0) + Number(att.guadagno_fuori_mano || 0);
}

// Array vuoto a identità STABILE: con `= []` ogni render crea un array nuovo finché i dati non ci sono
// e tutti i useMemo che lo hanno tra le dipendenze si ricalcolano a ogni render.
const EMPTY_ARR = [];

// Primo giorno del mese (ora locale), come startOfMonth di date-fns ma senza dipendenza dal modulo.
function startOfMonthLocal(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }

// Chiave mese 'YYYY-MM' di una data evento: per le date solo-giorno (il caso reale) è una semplice
// sottostringa; per qualsiasi altro formato si passa da parseISO in ora locale (come faceva l'intervallo).
function monthKeyOf(dateStr) {
  if (dateStr.length === 10) return dateStr.slice(0, 7);
  const d = parseISO(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Giorno della settimana da 'YYYY-MM-DD' senza parseISO (stesso valore di getDay(parseISO(d)))
function dowOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

export default function GuadagniDettagliatiNuovo({ promoter }) {
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const guadagniFsRef = useRef(null);

  const { data: events = EMPTY_ARR } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // SOLO le presenze di questo promoter. Prima scaricava l'INTERA tabella presenze (5000+ righe,
  // decine di richieste in fila) per poi tenerne soltanto le proprie: l'esitazione all'apertura del
  // tab. Stessa chiave e stesso fetcher di "I miei progressi" (['attendances', id]): già precaricata
  // da prefetchCriticalData, quindi a cache calda i dati sono pronti subito. Il risultato filtrato
  // (promoter_id === id && !client_id) è identico a prima.
  const { data: attendances = EMPTY_ARR } = useQuery({
    queryKey: ['attendances', promoter?.id],
    queryFn: () => fetchByPromoter(base44.entities.EventAttendance, promoter.id, { sort: '-created_date' }),
    enabled: !!promoter?.id,
    staleTime: 15 * 60000,
    gcTime: 20 * 60000,
    refetchOnWindowFocus: false,
    retry: 0,
    placeholderData: keepPreviousData,
  });

  // Lookup O(1) eventi
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);

  const myAtts = useMemo(
    () => promoter?.id ? attendances.filter(a => a.promoter_id === promoter.id && !a.client_id) : EMPTY_ARR,
    [attendances, promoter?.id]
  );

  // ── Statistiche avanzate ──────────────────────────────────────────────────
  const advancedStats = useMemo(() => {
    if (myAtts.length === 0 || events.length === 0) return null;

    const withEvent = myAtts
      .map(a => {
        const ev = eventsById.get(a.event_id);
        if (!ev?.date) return null;
        const guadagno = calcGuadagno(a);
        const dayOfWeek = dowOf(ev.date);
        return { att: a, ev, guadagno, dayOfWeek };
      })
      .filter(Boolean)
      .filter(x => x.guadagno > 0);

    if (withEvent.length === 0) return null;

    const best = withEvent.reduce((a, b) => a.guadagno > b.guadagno ? a : b);

    const venueMap = {};
    withEvent.forEach(({ att, ev, guadagno }) => {
      const venue = ev.venue || 'Sconosciuto';
      if (!venueMap[venue]) venueMap[venue] = { totalPct: 0, totalExtra: 0, total: 0, count: 0 };
      venueMap[venue].totalPct += Number(att.guadagno_pct || 0);
      venueMap[venue].totalExtra += Number(att.guadagno_fuori_mano || 0);
      venueMap[venue].total += guadagno;
      venueMap[venue].count++;
    });
    const venueAvg = Object.entries(venueMap)
      .map(([venue, { totalPct, totalExtra, total, count }]) => ({
        venue,
        avgPct: totalPct / count,
        avgExtra: totalExtra / count,
        avg: total / count,
        count,
      }))
      .sort((a, b) => b.avg - a.avg);

    const extraAtts = withEvent.filter(x => x.ev.is_extra);
    const extraAvg = extraAtts.length > 0
      ? extraAtts.reduce((s, x) => s + x.guadagno, 0) / extraAtts.length
      : null;

    const calcDayAvg = (dayNum) => {
      const d = withEvent.filter(x => x.dayOfWeek === dayNum);
      if (d.length === 0) return null;
      return { avg: d.reduce((s, x) => s + x.guadagno, 0) / d.length, count: d.length };
    };

    const monthMap = {};
    withEvent.forEach(({ ev, guadagno }) => {
      const mk = ev.date.slice(0, 7);
      monthMap[mk] = (monthMap[mk] || 0) + guadagno;
    });
    const bestMonth = Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0];

    return {
      best,
      venueAvg,
      extraAvg,
      extraCount: extraAtts.length,
      venerdì: calcDayAvg(5),
      sabato: calcDayAvg(6),
      domenica: calcDayAvg(0),
      bestMonth,
    };
  }, [myAtts, events, eventsById]);

  // ── Mesi + dati mensili (memoizzati una sola volta) ───────────────────────
  // Costruisco l'intervallo mesi e, per ogni mese, le presenze filtrate + aggregati.
  // Le presenze per mese vengono calcolate UNA volta e riportate nell'oggetto mese,
  // così l'espansione (settimane) le riutilizza senza rifare il filter.
  const monthlyData = useMemo(() => {
    if (myAtts.length === 0) return [];

    const datedAtts = myAtts
      .map(a => ({ att: a, dateStr: eventsById.get(a.event_id)?.date }))
      .filter(x => x.dateStr)
      .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

    if (datedAtts.length === 0) return [];

    const firstDate = startOfMonthLocal(parseISO(datedAtts[0].dateStr));
    const lastDate = startOfMonthLocal(parseISO(datedAtts[datedAtts.length - 1].dateStr));

    const months = [];
    let current = lastDate;
    while (current >= firstDate) {
      months.unshift(current);
      current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    }

    // UN solo passaggio: ogni presenza va nel bucket del suo mese ('YYYY-MM').
    // Prima, per ogni mese (fino a 48+) si rifaceva filter + parseISO + isWithinInterval su TUTTE
    // le presenze (mesi × presenze parse di date). L'ordine all'interno del mese resta quello
    // cronologico della lista già ordinata, quindi i risultati sono identici.
    const buckets = new Map();
    for (const x of datedAtts) {
      const key = monthKeyOf(x.dateStr);
      let b = buckets.get(key);
      if (!b) { b = []; buckets.set(key, b); }
      const [y, m, d] = x.dateStr.split('-').map(Number);
      b.push({ att: x.att, dow: new Date(y, m - 1, d).getDay(), dateStr: x.dateStr });
    }

    return months.map(monthStart => {
      const monthAtts = buckets.get(`${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`) || EMPTY_ARR;

      const guadagno = monthAtts.reduce((s, x) => s + calcGuadagno(x.att), 0);
      const tables = monthAtts.reduce((s, x) => s + calcTables(x.att.revenue || 0, x.dow), 0);

      return {
        monthStart,
        monthLabel: format(monthStart, 'MMM yy', { locale: it }),
        guadagno,
        tables,
        serate: monthAtts.length,
        atts: monthAtts,
      };
    });
  }, [myAtts, eventsById]);

  // Versione inversa (più recente prima) — memoizzata, non ricreata a ogni render
  const monthlyDataDesc = useMemo(() => [...monthlyData].reverse(), [monthlyData]);

  // ── Riepilogo: guadagno annuo (anno selezionato) + media mensile ────────────
  const summaryStats = useMemo(() => {
    if (monthlyData.length === 0) return null;
    const years = [...new Set(monthlyData.map(m => m.monthStart.getFullYear()))].sort();
    const yearGuadagno = monthlyData
      .filter(m => m.monthStart.getFullYear() === selectedYear)
      .reduce((s, m) => s + m.guadagno, 0);
    const totalGuadagno = monthlyData.reduce((s, m) => s + m.guadagno, 0);
    const avgMensile = totalGuadagno / monthlyData.length;
    const yearIdx = years.indexOf(selectedYear);
    return {
      yearGuadagno,
      avgMensile,
      year: selectedYear,
      years,
      canPrev: yearIdx > 0,
      canNext: yearIdx < years.length - 1,
    };
  }, [monthlyData, selectedYear]);

  // Dati/serie/labels del chart memoizzati (uPlot si re-init solo quando cambiano davvero)
  const chartData = useMemo(() => monthlyData.map(m => ({ guadagno: m.guadagno })), [monthlyData]);
  const chartSeries = useMemo(() => [{ key: 'guadagno', name: 'Guadagni', color: GUADAGNI_COLOR }], []);
  const chartXLabels = useMemo(() => monthlyData.map(m => m.monthLabel), [monthlyData]);
  const chartValueFormatter = useMemo(() => (v => `€${Number(v).toLocaleString('it-IT')}`), []);

  if (!promoter?.id) {
    return <Div className="rounded-xl bg-card border border-border p-8 text-center"><P className="text-sm text-muted-foreground">Nessun profilo promoter.</P></Div>;
  }

  return (
    <Div className="space-y-4">
      {/* ── Andamento del mese vs media storica + stima fine mese ── */}
      <ProiezioneMese promoter={promoter} events={events} attendances={attendances} />

      {/* Timeline Guadagni Mensili — uPlot */}
      {monthlyData.length > 0 && (
        <Div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 space-y-3"
          style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.10)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
            style={{ background: `linear-gradient(90deg, transparent, ${GUADAGNI_COLOR}, transparent)` }} />
          <Div className="flex items-center justify-between">
            <SectionHeader icon={TrendingUp} title="Timeline Guadagni Mensili" color={GUADAGNI_COLOR} />
            <FullscreenButton onClick={() => guadagniFsRef.current?.open()} />
          </Div>
          <ChartFullscreen ref={guadagniFsRef} title="Timeline Guadagni Mensili" scrollable={false} icon={TrendingUp} accentColor={GUADAGNI_COLOR} rotateOnMobile externalTrigger>
            <Div style={{ height: 192 }}>
              <UPlotLineChart
                data={chartData}
                series={chartSeries}
                xLabels={chartXLabels}
                valueFormatter={chartValueFormatter}
                height={192}
                rightPad={1.0}
              />
            </Div>
          </ChartFullscreen>
        </Div>
      )}

      {/* ── Riepilogo guadagno annuo + media mensile ── */}
      {summaryStats && (
        <Div className="grid grid-cols-2 gap-3 dash-fade-up">
          <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 space-y-1">
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
              style={{ background: `linear-gradient(90deg, transparent, ${GUADAGNI_COLOR}, transparent)` }} />
            <Div className="flex items-center justify-between">
              <P className="text-[11px] text-muted-foreground uppercase tracking-wider">Guadagno {summaryStats.year}</P>
              {summaryStats.years.length > 1 && (
                <Div className="flex items-center gap-1">
                  <Btn
                    button
                    onClick={() => setSelectedYear(summaryStats.years[summaryStats.years.indexOf(selectedYear) - 1])}
                    disabled={!summaryStats.canPrev}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-secondary/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    accessibilityLabel="Anno precedente">
                    <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                  </Btn>
                  <Span className="text-[11px] font-semibold tabular-nums min-w-[34px] text-center" style={{ color: GUADAGNI_COLOR }}>
                    {summaryStats.year}
                  </Span>
                  <Btn
                    button
                    onClick={() => setSelectedYear(summaryStats.years[summaryStats.years.indexOf(selectedYear) + 1])}
                    disabled={!summaryStats.canNext}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-secondary/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    accessibilityLabel="Anno successivo">
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                  </Btn>
                </Div>
              )}
            </Div>
            <P className="text-2xl font-bold leading-tight" style={{ color: GUADAGNI_COLOR }}>
              €{Math.round(summaryStats.yearGuadagno).toLocaleString('it-IT')}
            </P>
            <P className="text-[10px] text-muted-foreground">
              {summaryStats.year === new Date().getFullYear() ? 'Totale guadagni dell\'anno in corso' : `Totale guadagni del ${summaryStats.year}`}
            </P>
          </Div>
          <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 space-y-1">
            <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
              style={{ background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)' }} />
            <P className="text-[11px] text-muted-foreground uppercase tracking-wider">Media mensile</P>
            <P className="text-2xl font-bold leading-tight text-sky-400">
              €{Math.round(summaryStats.avgMensile).toLocaleString('it-IT')}
            </P>
            <P className="text-[10px] text-muted-foreground">Media su {monthlyData.length} mesi di attività</P>
          </Div>
        </Div>
      )}

      {/* ── Statistiche Avanzate ── */}
      {advancedStats && (
        <Div
          className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 space-y-3"
          style={{ boxShadow: '0 4px 32px -8px rgba(251,191,36,0.08)' }}
        >
          <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
          <SectionHeader icon={Trophy} title="Statistiche Avanzate" color="#fbbf24" />

          {/* Serata migliore + Mese migliore */}
          <Div className="grid grid-cols-2 gap-2">
            <Div className="relative overflow-hidden rounded-xl bg-secondary/20 border border-white/[0.05] px-3 py-2.5">
              <Div className="flex items-center gap-1.5 mb-1">
                <IconBadge icon={Trophy} color="#fbbf24" />
                <P className="text-[10px] text-muted-foreground leading-none">Serata con più guadagno</P>
              </Div>
              <P className="font-bold text-base leading-tight text-yellow-400">€{advancedStats.best.guadagno.toLocaleString('it-IT')}</P>
              <P className="text-[10px] text-muted-foreground leading-tight mt-0.5">{advancedStats.best.ev.venue || advancedStats.best.ev.name} · {format(parseISO(advancedStats.best.ev.date), 'd MMM yy', { locale: it })}</P>
            </Div>
            {advancedStats.bestMonth && (
              <Div className="relative overflow-hidden rounded-xl bg-secondary/20 border border-white/[0.05] px-3 py-2.5">
                <Div className="flex items-center gap-1.5 mb-1">
                  <IconBadge icon={Calendar} color="#34d399" />
                  <P className="text-[10px] text-muted-foreground leading-none">Mese migliore</P>
                </Div>
                <P className="font-bold text-base leading-tight text-emerald-400">€{Math.round(advancedStats.bestMonth[1]).toLocaleString('it-IT')}</P>
                <P className="text-[10px] text-muted-foreground leading-tight mt-0.5">{format(parseISO(advancedStats.bestMonth[0] + '-01'), 'MMMM yyyy', { locale: it })}</P>
              </Div>
            )}
          </Div>

          {/* Media per giorno */}
          <Div className="rounded-xl bg-secondary/20 border border-white/[0.05] px-3 py-2.5">
            <P className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1.5"><IconBadge icon={TrendingUp} color="#38bdf8" /> Guadagno medio per giorno</P>
            <Div className="grid grid-cols-4 gap-2">
              {[['Ven', advancedStats.venerdì, 'text-blue-400'], ['Sab', advancedStats.sabato, 'text-violet-400'], ['Dom', advancedStats.domenica, 'text-amber-400']].map(([label, data, color]) => (
                <Div key={label}>
                  <P className="text-[10px] text-muted-foreground leading-none">{label}{data ? ` (${data.count})` : ''}</P>
                  <P className={`font-bold text-base leading-tight ${color}`}>{data ? `€${Math.round(data.avg).toLocaleString('it-IT')}` : '–'}</P>
                </Div>
              ))}
              {advancedStats.extraAvg !== null && (
                <Div>
                  <P className="text-[10px] text-muted-foreground leading-none flex items-center gap-1"><IconBadge icon={Star} color="#f472b6" /> Extra ({advancedStats.extraCount})</P>
                  <P className="font-bold text-base leading-tight text-pink-400">€{Math.round(advancedStats.extraAvg).toLocaleString('it-IT')}</P>
                </Div>
              )}
            </Div>
          </Div>

          {/* Tabella locali — grafica Growth League */}
          {advancedStats.venueAvg.length > 0 && (
            <Div className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card">
              <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
                style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
              <Div className="px-4 pt-3 pb-1">
                <SectionHeader icon={Home} title="Media per locale" color="#a78bfa" />
              </Div>
              <Div className="overflow-x-auto client-table-scrollbar">
                <Table className="w-full text-sm min-w-[420px]">
                  <Thead>
                    <Tr className="border-b border-white/[0.06] text-left">
                      <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Locale</Th>
                      <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Serate</Th>
                      <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-primary/80 text-right">% Fatt.</Th>
                      <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-blue-400/80 text-right">Extra</Th>
                      <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80 text-right">Tot.</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {advancedStats.venueAvg.map(({ venue, avgPct, avgExtra, avg, count }) => (
                      <Tr key={venue} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <Td className="px-3 py-2.5 text-xs font-medium truncate max-w-[160px]">{venue}</Td>
                        <Td className="px-3 py-2.5 text-xs text-muted-foreground text-right">{count}</Td>
                        <Td className="px-3 py-2.5 text-xs font-semibold text-right text-primary/90">€{Math.round(avgPct).toLocaleString('it-IT')}</Td>
                        <Td className="px-3 py-2.5 text-xs font-semibold text-right text-blue-400/90">€{Math.round(avgExtra).toLocaleString('it-IT')}</Td>
                        <Td className="px-3 py-2.5 text-xs font-bold text-right text-cyan-400/90">€{Math.round(avg).toLocaleString('it-IT')}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Div>
              <P className="text-[10px] text-muted-foreground/60 px-4 py-2.5 border-t border-white/[0.04]">
                Media calcolata sulle serate con guadagno registrato · % Fatt. = media guadagno percentuale · Extra = media guadagno extra · Tot. = media totale
              </P>
            </Div>
          )}
        </Div>
      )}

      {/* Mesi (inversi: più recente prima) */}
      <Div className="space-y-2">
        {monthlyDataDesc.map((month, idx) => {
          const isExpanded = expandedMonth === idx;
          return (
            <Div
              key={idx}
              className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card"
            >
              <Btn
                button
                onClick={() => setExpandedMonth(isExpanded ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors duration-200">
                <Div className="flex items-center gap-3 flex-1 text-left">
                  <P className="font-semibold text-sm capitalize">{month.monthLabel}</P>
                  <Div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto pr-3">
                    <Span>{month.serate} serate</Span>
                    <Span>{month.tables.toFixed(1).replace('.', ',')} tavoli</Span>
                  </Div>
                  <Span className="font-bold text-primary text-sm min-w-[100px] text-right">
                    €{month.guadagno.toLocaleString('it-IT')}
                  </Span>
                </Div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </Btn>

              {isExpanded && (
                <Div className="overflow-hidden dash-fade-up" style={{ animationDuration: '0.25s' }}>
                    <Div className="border-t border-white/[0.06] px-4 py-4 bg-secondary/10 space-y-3">
                      {month.atts.length === 0 ? (
                        <P className="text-xs text-muted-foreground text-center py-2">Nessuna serata</P>
                      ) : (() => {
                        const weeklyMap = new Map();
                        month.atts.forEach(({ att, dateStr }) => {
                          const weekStart = startOfWeek(parseISO(dateStr), { weekStartsOn: 1 });
                          const weekKey = format(weekStart, 'yyyy-MM-dd');
                          if (!weeklyMap.has(weekKey)) weeklyMap.set(weekKey, { start: weekStart, atts: [] });
                          weeklyMap.get(weekKey).atts.push(att);
                        });
                        const sortedWeeks = Array.from(weeklyMap.values()).sort((a, b) => a.start - b.start);
                        return sortedWeeks.map((week, wIdx) => {
                          const weekGuadagnoPct = week.atts.reduce((s, a) => s + Number(a.guadagno_pct || 0), 0);
                          const weekGuadagnoFuoriMano = week.atts.reduce((s, a) => s + Number(a.guadagno_fuori_mano || 0), 0);
                          const weekGuadagnoTotal = weekGuadagnoPct + weekGuadagnoFuoriMano;
                          const weekEnd = endOfWeek(week.start, { weekStartsOn: 1 });
                          const weekLabel = `${format(week.start, 'd MMM', { locale: it })} - ${format(weekEnd, 'd MMM', { locale: it })}`;
                          return (
                            <Div key={wIdx} className="rounded-xl bg-card/50 border border-white/[0.05] p-3 space-y-2">
                              <P className="text-xs font-semibold text-muted-foreground">{weekLabel}</P>
                              <Div className="grid grid-cols-3 gap-2 text-[11px]">
                                <Div className="rounded-lg bg-secondary/50 p-2">
                                  <P className="text-muted-foreground">% Guadagno</P>
                                  <P className="font-bold text-primary">€{weekGuadagnoPct.toLocaleString('it-IT')}</P>
                                </Div>
                                <Div className="rounded-lg bg-secondary/50 p-2">
                                  <P className="text-muted-foreground">Guadagno Extra</P>
                                  <P className="font-bold text-blue-400">€{weekGuadagnoFuoriMano.toLocaleString('it-IT')}</P>
                                </Div>
                                <Div className="rounded-lg bg-secondary/50 p-2">
                                  <P className="text-muted-foreground">Totale</P>
                                  <P className="font-bold text-green-400">€{weekGuadagnoTotal.toLocaleString('it-IT')}</P>
                                </Div>
                              </Div>
                            </Div>
                          );
                        });
                      })()}
                    </Div>
                </Div>
                )}
            </Div>
          );
        })}
      </Div>

      {monthlyData.length === 0 && (
        <P className="text-xs text-muted-foreground text-center py-8">Nessun dato disponibile.</P>
      )}
    </Div>
  );
}