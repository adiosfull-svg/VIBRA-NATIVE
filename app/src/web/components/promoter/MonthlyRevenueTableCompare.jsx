// Port di src/components/promoter/MonthlyRevenueTableCompare.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, eachMonthOfInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from '@/legacy/utils/tables';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Table } from '@/ui/icons.generated';

import { Div, Span } from '@/ui/html';

import {
  HtmlOption,
  HtmlSelect,
  Table as HtmlTable,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@/ui/elements';

const COLORS = [
  'hsl(275 72% 52%)', 'hsl(200 70% 50%)', 'hsl(150 60% 45%)',
  'hsl(40 80% 55%)', 'hsl(340 65% 55%)', 'hsl(20 80% 55%)', 'hsl(180 60% 45%)'
];

/**
 * Tabella fatturato mensile dettagliata per i promoter selezionati.
 * L'aggregazione pesante (loop su allAttendances + events.find) è memoizzata
 * sui dati grezzi per TUTTI i promoter: toggolare le chip non fa ricalcolare,
 * deriva solo le righe da mostrare (operazione cheap).
 */
function MonthlyRevenueTableCompare({ filtered, allAttendances, events, fromDate, toDate, promoters }) {
  const monthList = useMemo(() => eachMonthOfInterval({ start: fromDate, end: toDate }), [fromDate, toDate]);

  // Pre-calcolo per TUTTI i promoter, memoizzato su dati grezzi (stable al toggle).
  const monthData = useMemo(() => {
    const eventsById = new Map(events.map(e => [e.id, e]));
    // Raggruppa presenze per promoter una sola volta
    const byPromoter = new Map();
    for (const a of allAttendances) {
      if (!a.event_id || a.client_id) continue;
      const arr = byPromoter.get(a.promoter_id);
      if (arr) arr.push(a);
      else byPromoter.set(a.promoter_id, [a]);
    }

    return monthList.map(ms => {
      const me = endOfMonth(ms);
      const label = format(ms, 'MMMM yyyy', { locale: it });
      const shortLabel = format(ms, 'MMM yy', { locale: it });

      const rowsByPromoter = {};
      promoters.forEach(p => {
        const recs = byPromoter.get(p.id) || [];
        let rev = 0, tables = 0;
        for (const a of recs) {
          const ev = eventsById.get(a.event_id);
          if (!ev?.date) continue;
          try {
            const d = parseISO(ev.date);
            if (!isWithinInterval(d, { start: ms, end: me })) continue;
          } catch { continue; }
          const rv = a.revenue || 0;
          rev += rv;
          const [y, mo, dy] = ev.date.split('-').map(Number);
          tables += calcTables(rv, new Date(y, mo - 1, dy).getDay());
        }
        rowsByPromoter[p.id] = { promoter: p, rev, tables };
      });

      return { label, shortLabel, rowsByPromoter, monthStart: ms };
    });
  }, [monthList, allAttendances, events, promoters]);

  // Mese selezionato (default: ultimo mese)
  const [selectedIdx, setSelectedIdx] = useState(monthData.length - 1);
  const selected = monthData[selectedIdx];
  if (!selected) return null;

  // Deriva le righe solo dai promoter selezionati (cheap)
  const displayRows = filtered.map(p => selected.rowsByPromoter[p.id]).filter(Boolean);
  const totalRev = displayRows.reduce((s, r) => s + r.rev, 0);
  const sortedRows = [...displayRows].sort((a, b) => b.rev - a.rev);

  return (
    <Div className="rounded-xl bg-card border border-border p-5 space-y-4" style={{ overflow: 'visible' }}>
      <Div className="flex items-center justify-between flex-wrap gap-3">
        <SectionHeader icon={Table} title="Fatturato Mensile - Tabella dettagliata" color="#a78bfa" />
        <HtmlSelect
          value={selectedIdx}
          onChange={e => setSelectedIdx(Number(e.target.value))}
          className="bg-secondary/60 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary capitalize"
        >
          {monthData.map((m, i) => (
            <HtmlOption key={i} value={i}>{m.label}</HtmlOption>
          ))}
        </HtmlSelect>
      </Div>

      <Div className="text-xs text-muted-foreground capitalize font-medium">
        {selected.label} — Totale: <Span className="text-primary font-bold">€{totalRev.toLocaleString('it-IT')}</Span>
      </Div>

      <Div style={{ overflowX: 'auto' }}>
        <HtmlTable className="w-full text-sm" style={{ minWidth: 340 }}>
          <Thead>
            <Tr className="border-b border-border">
              <Th className="text-left py-2 px-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold w-6">#</Th>
              <Th className="text-left py-2 px-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Promoter</Th>
              <Th className="text-right py-2 px-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Fatturato</Th>
              <Th className="text-right py-2 px-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Tavoli</Th>
              <Th className="text-right py-2 px-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">% sul totale</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedRows.map((row, i) => {
              const colorIdx = promoters.findIndex(p => p.id === row.promoter.id);
              const color = COLORS[colorIdx >= 0 ? colorIdx % COLORS.length : i % COLORS.length];
              const pct = totalRev > 0 ? ((row.rev / totalRev) * 100).toFixed(1) : '0.0';
              const hasRevenue = row.rev > 0;
              return (
                <Tr key={row.promoter.id} className={`border-b border-border/40 transition-colors ${hasRevenue ? 'hover:bg-secondary/20' : 'opacity-40'}`}>
                  <Td className="py-2 px-1.5 text-xs text-muted-foreground">{i + 1}</Td>
                  <Td className="py-2 px-1.5">
                    <Div className="flex items-center gap-1.5">
                      <Span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <Span className="font-medium text-xs leading-tight">{row.promoter.name}</Span>
                    </Div>
                  </Td>
                  <Td className="py-2 px-1.5 text-right">
                    <Span className={`font-bold text-xs ${hasRevenue ? 'text-primary' : 'text-muted-foreground'}`}>
                      {hasRevenue ? `€${row.rev.toLocaleString('it-IT')}` : '—'}
                    </Span>
                  </Td>
                  <Td className="py-2 px-1.5 text-right">
                    <Span className="text-xs text-muted-foreground">{row.tables > 0 ? Number(row.tables.toFixed(1)) : '—'}</Span>
                  </Td>
                  <Td className="py-2 px-1.5 text-right">
                    {hasRevenue ? (
                      <Div className="flex items-center justify-end gap-2">
                        <Div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <Div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </Div>
                        <Span className="text-xs text-muted-foreground w-8 text-right">{pct}%</Span>
                      </Div>
                    ) : (
                      <Span className="text-xs text-muted-foreground">—</Span>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          {totalRev > 0 && (
            <Tfoot>
              <Tr className="border-t border-border">
                <Td colSpan={2} className="py-2.5 px-1.5 text-xs font-bold text-foreground">Totale</Td>
                <Td className="py-2.5 px-1.5 text-right text-xs font-bold text-primary">€{totalRev.toLocaleString('it-IT')}</Td>
                <Td className="py-2.5 px-1.5 text-right text-xs text-muted-foreground">
                  {Number(sortedRows.reduce((s, r) => s + r.tables, 0).toFixed(1))}
                </Td>
                <Td className="py-2.5 px-1.5 text-right text-xs text-muted-foreground">100%</Td>
              </Tr>
            </Tfoot>
          )}
        </HtmlTable>
      </Div>
    </Div>
  );
}

export default MonthlyRevenueTableCompare;