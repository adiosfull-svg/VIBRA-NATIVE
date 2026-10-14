// Port di src/components/promoter/MonthlyRevenueHistory.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { parseISO, getDay, format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from '@/legacy/utils/tables';

import { Div, H, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

export default function MonthlyRevenueHistory({ attendances, events }) {
  const now = new Date();

  const allRows = (() => {
    if (!attendances.length) return [];
    let earliest = now;
    attendances.forEach(a => {
      const ev = events.find(e => e.id === a.event_id);
      if (ev?.date) {
        const d = parseISO(ev.date);
        if (d < earliest) earliest = d;
      }
    });
    const totalMonths = Math.max(1,
      (now.getFullYear() - earliest.getFullYear()) * 12 + (now.getMonth() - earliest.getMonth()) + 1
    );

    return Array.from({ length: totalMonths }, (_, i) => {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(monthStart);
      const label = format(monthStart, 'MMMM yyyy', { locale: it });

      let total = 0, fri = 0, sat = 0, sun = 0, extra = 0;
      let tabFri = 0, tabSat = 0, tabSun = 0, tabExtra = 0;
      const presentEventIds = new Set();

      attendances.forEach(a => {
        if (a.client_id) return;
        const ev = events.find(e => e.id === a.event_id);
        if (!ev?.date) return;
        const d = parseISO(ev.date);
        if (!isWithinInterval(d, { start: monthStart, end: monthEnd })) return;
        const rev = a.revenue || 0;
        total += rev;
        presentEventIds.add(a.event_id);

        if (ev.is_extra) {
          extra += rev;
          const customThreshold = ev.table_threshold || 300;
          tabExtra += calcTables(rev, 0, customThreshold);
        } else {
          const dow = getDay(d);
          const customThreshold = ev.table_threshold || null;
          const t = calcTables(rev, dow, customThreshold);
          if (dow === 5) { fri += rev; tabFri += t; }
          else if (dow === 6) { sat += rev; tabSat += t; }
          else if (dow === 0) { sun += rev; tabSun += t; }
        }
      });

      const eventCount = presentEventIds.size;
      const totalTables = tabFri + tabSat + tabSun + tabExtra;

      return { label, total, fri, sat, sun, extra, presenze: eventCount, totalTables, tabFri, tabSat, tabSun, tabExtra };
    }).filter(r => r.total > 0 || r.presenze > 0);
  })();

  const rows = allRows;

  if (rows.length === 0) {
    return (
      <Div className="rounded-xl bg-card border border-border p-8 text-center">
        <P className="text-sm text-muted-foreground">Nessun dato storico disponibile</P>
      </Div>
    );
  }

  return (
    <Div className="rounded-xl bg-card border border-border overflow-hidden">
      <Div className="p-5 border-b border-border">
        <H className="font-semibold text-sm">Storico Fatturato Mensile</H>
      </Div>
      <Div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <Thead>
            <Tr className="bg-secondary/30 border-b border-border">
              <Th className="text-left px-4 py-3 font-medium text-muted-foreground">Mese</Th>
              <Th className="text-right px-4 py-3 font-medium text-muted-foreground">Totale</Th>
              <Th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Venerdì</Th>
              <Th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Sabato</Th>
              <Th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Domenica</Th>
              <Th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Extra</Th>
              <Th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Tavoli</Th>
              <Th className="text-right px-4 py-3 font-medium text-muted-foreground">Pres. fatt.</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r, i) => (
              <Tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                <Td className="px-4 py-3 font-medium capitalize">{r.label}</Td>
                <Td className="px-4 py-3 text-right font-bold text-primary">€{r.total.toLocaleString('it-IT')}</Td>
                <Td className="px-4 py-3 text-right hidden sm:table-cell text-muted-foreground">
                  {r.fri > 0 ? `€${r.fri.toLocaleString('it-IT')}` : '—'}
                </Td>
                <Td className="px-4 py-3 text-right hidden sm:table-cell text-muted-foreground">
                  {r.sat > 0 ? `€${r.sat.toLocaleString('it-IT')}` : '—'}
                </Td>
                <Td className="px-4 py-3 text-right hidden sm:table-cell text-muted-foreground">
                  {r.sun > 0 ? `€${r.sun.toLocaleString('it-IT')}` : '—'}
                </Td>
                <Td className="px-4 py-3 text-right hidden sm:table-cell text-muted-foreground">
                  {r.extra > 0 ? `€${r.extra.toLocaleString('it-IT')}` : '—'}
                </Td>
                <Td className="px-4 py-3 text-right hidden md:table-cell">
                  <Span className="font-semibold text-sm">{r.totalTables.toFixed(1).replace('.', ',')}</Span>
                  {r.totalTables > 0 && (
                    <Span className="text-[10px] text-muted-foreground ml-1 block">
                      (V:{r.tabFri.toFixed(1).replace('.', ',')} S:{r.tabSat.toFixed(1).replace('.', ',')} D:{r.tabSun.toFixed(1).replace('.', ',')}{r.tabExtra > 0 ? ` E:${r.tabExtra.toFixed(1).replace('.', ',')}` : ''})
                    </Span>
                  )}
                </Td>
                <Td className="px-4 py-3 text-right text-muted-foreground">{r.presenze}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Div>
    </Div>
  );
}