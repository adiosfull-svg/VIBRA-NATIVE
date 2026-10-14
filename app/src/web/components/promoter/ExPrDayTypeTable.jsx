// Port di src/components/promoter/ExPrDayTypeTable.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';

import { Div, H, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const fmt = (v) => v ? `€${Number(v).toLocaleString('it-IT', { maximumFractionDigits: 0 })}` : '—';

const COLS = [
  { key: 'ven', label: 'Venerdì', color: 'text-emerald-400' },
  { key: 'sab', label: 'Sabato', color: 'text-yellow-400' },
  { key: 'dom', label: 'Domenica', color: 'text-blue-400' },
  { key: 'extra', label: 'Extra - Festivi', color: 'text-pink-400' },
];

export default function ExPrDayTypeTable({ rows }) {
  return (
    <Div className="rounded-xl bg-card border border-border p-5 space-y-4">
      <Div>
        <H className="text-sm font-semibold text-muted-foreground">Fatturato Ex PR per Giorno</H>
        <P className="text-[10px] text-muted-foreground/60 mt-0.5">Suddivisione per Ven / Sab / Dom / Extra</P>
      </Div>
      <Div className="overflow-x-auto client-table-scrollbar">
        <Table className="w-full text-sm min-w-[560px]">
          <Thead>
            <Tr className="border-b border-border">
              <Th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Ex PR</Th>
              {COLS.map(c => (
                <Th key={c.key} className={`px-3 py-2 text-right text-xs font-medium ${c.color}`}>{c.label}</Th>
              ))}
              <Th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground">Totale</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map(r => (
              <Tr key={r.name} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                <Td className="px-3 py-2.5 font-medium">{r.name}</Td>
                {COLS.map(c => (
                  <Td key={c.key} className="px-3 py-2.5 text-right">
                    {r.dayType[c.key] ? fmt(r.dayType[c.key]) : <Span className="text-muted-foreground/30">—</Span>}
                  </Td>
                ))}
                <Td className="px-3 py-2.5 text-right font-bold">{fmt(r.total)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Div>
    </Div>
  );
}