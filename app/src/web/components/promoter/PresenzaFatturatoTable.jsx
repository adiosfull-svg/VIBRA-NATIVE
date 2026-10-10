// Port di src/components/promoter/PresenzaFatturatoTable.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, parseISO } from 'date-fns';
import { validDayKey, localDayKey } from '@/legacy/utils/dateUtils';
import { it } from 'date-fns/locale';
import { MonthSelect, YearSelect } from '@/web/components/shared/MonthYearPicker';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { CalendarCheck } from '@/ui/icons.generated';


import { Div, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@/ui/elements';


const COLORS = [
  'hsl(275 72% 52%)', 'hsl(200 70% 50%)', 'hsl(150 60% 45%)',
  'hsl(40 80% 55%)', 'hsl(340 65% 55%)', 'hsl(20 80% 55%)', 'hsl(180 60% 45%)'
];

/**
 * Tabella "Presenza fatturato" mensile in confronto.
 * L'aggregazione pesante (Set di event_id per promoter + intersezione per mese)
 * è memoizzata sui dati grezzi per TUTTI i promoter: toggolare le chip non fa
 * ricalcolare, deriva solo le colonne da mostrare (operazione cheap).
 */
function PresenzaFatturatoTable({ filtered, promoters, allAttendances, events }) {
  const now = new Date();
  const [fromYear, setFromYear] = useState(now.getFullYear());
  const [fromMonth, setFromMonth] = useState(0);
  const [toYear, setToYear] = useState(now.getFullYear());
  const [toMonth, setToMonth] = useState(now.getMonth());

  const fromDate = useMemo(() => startOfMonth(new Date(fromYear, fromMonth, 1)), [fromYear, fromMonth]);
  const toDate = useMemo(() => endOfMonth(new Date(toYear, toMonth, 1)), [toYear, toMonth]);

  const allAtts = allAttendances || [];
  const allEvents = events || [];

  // Pre-calcolo per TUTTI i promoter, memoizzato su dati grezzi + date (stable al toggle).
  const tableMonths = useMemo(() => {
    // Set di event_id con revenue>0 per ogni promoter (una sola passata)
    const presentEventIdsByPromoter = new Map();
    for (const a of allAtts) {
      if (a.client_id || (a.revenue || 0) <= 0) continue;
      const set = presentEventIdsByPromoter.get(a.promoter_id);
      if (set) set.add(a.event_id);
      else presentEventIdsByPromoter.set(a.promoter_id, new Set([a.event_id]));
    }
    // Set di tutti gli event_id (per conteggio serate) — non necessario come Set, usiamo filtering

    // Eventi per mese ('YYYY-MM') in UN passaggio (prima: per ogni mese un ciclo su TUTTI gli eventi
    // con parseISO + isWithinInterval = mesi × eventi parse di date a ogni render).
    const idsByMonth = new Map();
    for (const ev of allEvents) {
      if (!ev.date) continue;
      let day = validDayKey(ev.date);
      if (!day) {
        try { const d = parseISO(ev.date); if (isNaN(d)) continue; day = localDayKey(d); } catch { continue; }
      }
      const mk = day.slice(0, 7);
      let set = idsByMonth.get(mk);
      if (!set) { set = new Set(); idsByMonth.set(mk, set); }
      set.add(ev.id);
    }
    const NO_IDS = new Set();

    return eachMonthOfInterval({ start: fromDate, end: toDate }).map(ms => {
      const label = format(ms, 'MMM yy', { locale: it });

      // Eventi reali del mese
      const monthEventIds = idsByMonth.get(`${ms.getFullYear()}-${String(ms.getMonth() + 1).padStart(2, '0')}`) || NO_IDS;
      const totalSerate = monthEventIds.size;

      const entry = { label, totalSerate };
      promoters.forEach(p => {
        const presentIds = presentEventIdsByPromoter.get(p.id);
        if (!presentIds) { entry[p.name] = 0; return; }
        let count = 0;
        for (const id of presentIds) if (monthEventIds.has(id)) count++;
        entry[p.name] = count;
      });

      return entry;
    });
  }, [allAtts, allEvents, fromDate, toDate, promoters]);

  // Deriva colonne/totali solo dai promoter selezionati (cheap)
  const localTotals = filtered.map(p => {
    const idx = promoters.indexOf(p);
    return {
      name: p.name,
      total: tableMonths.reduce((s, row) => s + (row[p.name] || 0), 0),
      totalSerate: tableMonths.reduce((s, row) => s + (row.totalSerate || 0), 0),
      color: COLORS[idx % COLORS.length],
    };
  });

  const grandTotalPresenze = tableMonths.reduce((s, row) =>
    s + filtered.reduce((ps, p) => ps + (row[p.name] || 0), 0), 0
  );
  const grandTotalSerate = tableMonths.reduce((s, row) => s + (row.totalSerate || 0), 0);

  return (
    <Div className="relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] p-5 space-y-4"
      style={{ boxShadow: '0 4px 24px -6px rgba(74,222,128,0.10)' }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, #4ade80, transparent)' }} />
      <Div className="flex flex-wrap items-center gap-3 justify-between">
        <SectionHeader icon={CalendarCheck} title="Presenza Fatturato — Mensile" color="#4ade80" />
        <Div className="flex items-center gap-2 flex-wrap text-xs">
          <Span className="text-muted-foreground">Da</Span>
          <MonthSelect value={fromMonth} onChange={setFromMonth} />
          <YearSelect value={fromYear} onChange={setFromYear} />
          <Span className="text-muted-foreground">A</Span>
          <MonthSelect value={toMonth} onChange={setToMonth} />
          <YearSelect value={toYear} onChange={setToYear} />
        </Div>
      </Div>

      {tableMonths.length === 0 ? (
        <P className="text-sm text-muted-foreground text-center py-4">Nessun dato nel periodo selezionato</P>
      ) : (
        <Div className="overflow-x-auto client-table-scrollbar">
          <Table className="text-sm border-collapse w-full" style={{ minWidth: '100%' }}>
            <Thead>
              <Tr className="border-b border-white/[0.06]">
                <Th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-20">Mese</Th>
                <Th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Serate</Th>
                {filtered.map((p) => {
                  const idx = promoters.indexOf(p);
                  return (
                    <Th key={p.id} className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: COLORS[idx % COLORS.length] }}>
                      {p.name.split(' ')[0]}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {tableMonths.map((row, i) => (
                <Tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <Td className="px-3 py-2.5 font-medium text-xs capitalize text-muted-foreground">{row.label}</Td>
                  <Td className="px-3 py-2.5 text-center text-xs text-muted-foreground font-semibold">{row.totalSerate}</Td>
                  {filtered.map((p) => {
                    const val = row[p.name] || 0;
                    const tot = row.totalSerate || 0;
                    const isMax = val === tot && tot > 0;
                    const idx = promoters.indexOf(p);
                    return (
                      <Td key={p.id} className="px-3 py-2.5 text-center">
                        {tot > 0 ? (
                          <Span
                            className={`font-bold text-sm ${isMax ? 'text-green-400' : ''}`}
                            style={!isMax ? { color: COLORS[idx % COLORS.length] } : {}}
                          >
                            {val}/{tot}
                          </Span>
                        ) : (
                          <Span className="text-muted-foreground/40 text-xs">—</Span>
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr className="border-t-2 border-white/[0.08] bg-secondary/20">
                <Td className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Totale</Td>
                <Td className="px-3 py-2.5 text-center text-xs text-muted-foreground font-bold">{grandTotalSerate}</Td>
                {localTotals.map((lt) => (
                  <Td key={lt.name} className="px-3 py-2.5 text-center">
                    <Span className="font-bold text-sm" style={{ color: lt.color }}>
                      {lt.total}/{lt.totalSerate}
                    </Span>
                  </Td>
                ))}
              </Tr>
            </Tfoot>
          </Table>
        </Div>
      )}
    </Div>
  );
}

export default PresenzaFatturatoTable;