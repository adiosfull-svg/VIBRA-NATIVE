// Port di src/components/promoter/ExPrMonthlyTable.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';

import { Div, H, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const fmt = (v) => v ? `€${Number(v).toLocaleString('it-IT', { maximumFractionDigits: 0 })}` : '—';

const MONTH_NAMES = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const monthLabel = (k) => {
  const [y, m] = k.split('-');
  return `${MONTH_NAMES[+m - 1]} ${y.slice(2)}`;
};

export default function ExPrMonthlyTable({ rows, months }) {
  return (
    <Div className="rounded-xl bg-card border border-border p-5 space-y-4">
      <Div>
        <H className="text-sm font-semibold text-muted-foreground">Fatturato Ex PR per Mese</H>
        <P className="text-[10px] text-muted-foreground/60 mt-0.5">Andamento mensile di ogni Ex PR</P>
      </Div>
      <Div className="overflow-x-auto client-table-scrollbar">
        <Table className="text-xs min-w-full">
          <Thead>
            <Tr className="border-b border-border">
              <Th className="sticky left-0 bg-card px-3 py-2 text-left font-medium text-muted-foreground z-10 whitespace-nowrap">Ex PR</Th>
              {months.map(m => (
                <Th key={m} className="px-2 py-2 text-right font-medium text-muted-foreground whitespace-nowrap">{monthLabel(m)}</Th>
              ))}
              <Th className="px-3 py-2 text-right font-bold text-muted-foreground whitespace-nowrap">Totale</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map(r => (
              <Tr key={r.name} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                <Td className="sticky left-0 bg-card px-3 py-2 font-medium whitespace-nowrap">{r.name}</Td>
                {months.map(m => (
                  <Td key={m} className="px-2 py-2 text-right text-muted-foreground whitespace-nowrap">
                    {r.monthly[m] ? fmt(r.monthly[m]) : <Span className="text-muted-foreground/30">—</Span>}
                  </Td>
                ))}
                <Td className="px-3 py-2 text-right font-bold whitespace-nowrap">{fmt(r.total)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Div>
    </Div>
  );
}