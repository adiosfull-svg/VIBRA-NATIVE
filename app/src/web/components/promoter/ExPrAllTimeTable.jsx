// Port di src/components/promoter/ExPrAllTimeTable.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from '@/ui/recharts';
import DeferredChart from '@/web/components/shared/DeferredChart';

import { Div, H, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const GRAY_COLOR = 'hsl(240 5% 45%)';
const GRAY_LIGHT = 'hsl(240 5% 55%)';

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '8px',
  fontSize: 12,
  color: '#ffffff',
};

const fmt = (v) => `€${Number(v).toLocaleString('it-IT')}`;

export default function ExPrAllTimeTable({ allAttendances, events, fromDate, toDate }) {
  // Raccogli tutte le attendance ex PR nel periodo
  const exPrData = useMemo(() => {
    const map = {}; // nome → revenue totale

    allAttendances.forEach(a => {
      if (!a.notes || !a.notes.startsWith('__ex_pr__')) return;
      const ev = events.find(e => e.id === a.event_id);
      if (!ev?.date) return;

      // Filtra per periodo
      if (fromDate && toDate) {
        try {
          const d = parseISO(ev.date);
          if (!isWithinInterval(d, { start: fromDate, end: toDate })) return;
        } catch { return; }
      }

      // Estrai nome: __ex_pr__:Nome oppure __ex_pr__ (vecchio formato → "Ex PR")
      // Normalizza spazi (trim + collapse) E maiuscole/minuscole per unificare
      // duplicati come "PATTY" / "patty" / "Patty" in un'unica voce.
      const rawName = a.notes.startsWith('__ex_pr__:')
        ? a.notes.slice('__ex_pr__:'.length)
        : 'Ex PR (aggregato)';
      const name = rawName.trim().replace(/\s+/g, ' ');
      const key = name.toLowerCase();

      if (!map[key]) map[key] = { name, revenue: 0 };
      map[key].revenue += (a.revenue || 0);
    });

    return Object.values(map)
      .map(({ name, revenue }) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [allAttendances, events, fromDate, toDate]);

  if (exPrData.length === 0) return null;

  const totalExPr = exPrData.reduce((s, r) => s + r.revenue, 0);

  return (
    <Div className="rounded-xl bg-card border border-border p-5 space-y-4">
      <Div className="flex items-center justify-between flex-wrap gap-2">
        <Div>
          <H className="text-sm font-semibold text-muted-foreground">Fatturato Ex PR — All Time</H>
          <P className="text-[10px] text-muted-foreground/60 mt-0.5">Promoter non riconosciuti al momento dell'importazione</P>
        </Div>
        <Span className="text-sm font-bold text-muted-foreground">{fmt(totalExPr)} totale</Span>
      </Div>

      {/* Grafico barre orizzontali */}
      <DeferredChart style={{ height: Math.max(80, exPrData.length * 44) }}><ResponsiveContainer width="100%" height="100%">
        <BarChart data={exPrData} layout="vertical" margin={{ left: 0, right: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `€${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: 'hsl(240 5% 55%)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            formatter={(v) => [fmt(v), 'Fatturato']}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
            {exPrData.map((_, i) => (
              <Cell key={i} fill={i === 0 ? GRAY_LIGHT : GRAY_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer></DeferredChart>

      {/* Tabella dettaglio */}
      <Div className="rounded-lg border border-border overflow-hidden">
        <Table className="w-full text-sm">
          <Thead>
            <Tr className="bg-secondary/30 border-b border-border">
              <Th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">#</Th>
              <Th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Nome</Th>
              <Th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Fatturato</Th>
              <Th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">% sul totale ex PR</Th>
            </Tr>
          </Thead>
          <Tbody>
            {exPrData.map((row, i) => {
              const pct = totalExPr > 0 ? ((row.revenue / totalExPr) * 100).toFixed(1) : '0.0';
              return (
                <Tr key={i} className="border-b border-border/50 last:border-0">
                  <Td className="px-4 py-2.5 text-xs text-muted-foreground/60">{i + 1}</Td>
                  <Td className="px-4 py-2.5">
                    <Div className="flex items-center gap-2">
                      <Div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                        {row.name.charAt(0).toUpperCase()}
                      </Div>
                      <Span className="text-muted-foreground font-medium">{row.name}</Span>
                    </Div>
                  </Td>
                  <Td className="px-4 py-2.5 text-right font-bold text-muted-foreground">{fmt(row.revenue)}</Td>
                  <Td className="px-4 py-2.5 text-right text-xs text-muted-foreground/70">{pct}%</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Div>
    </Div>
  );
}