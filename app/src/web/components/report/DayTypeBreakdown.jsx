// Port di src/components/report/DayTypeBreakdown.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';

import { Div, H, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@/ui/elements';

const DAY_TYPES = [
  { key: 'ven', label: 'Ven', full: 'Venerdì', color: '#60a5fa' },
  { key: 'sab', label: 'Sab', full: 'Sabato', color: '#4ade80' },
  { key: 'dom', label: 'Dom', full: 'Domenica', color: '#fbbf24' },
  { key: 'extra', label: 'Extra', full: 'Extra / Festivi', color: '#f472b6' },
];

function getDayType(ev) {
  if (ev.is_extra) return 'extra';
  if (!ev.date) return null;
  const [y, m, d] = ev.date.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  if (dow === 5) return 'ven';
  if (dow === 6) return 'sab';
  if (dow === 0) return 'dom';
  return null;
}

function computeDayTypeRevenue(promoterId, attendances, events, from, to) {
  const evById = new Map(events.map(e => [e.id, e]));
  const result = { ven: 0, sab: 0, dom: 0, extra: 0 };
  attendances.forEach(a => {
    if (a.promoter_id !== promoterId || a.present === false || a.client_id) return;
    const ev = evById.get(a.event_id);
    if (!ev || !ev.date) return;
    if (from && ev.date < from) return;
    if (to && ev.date > to) return;
    const dt = getDayType(ev);
    if (dt && result[dt] !== undefined) result[dt] += a.revenue || 0;
  });
  return result;
}

const fmt = (v) => v != null && v !== 0 ? `${v > 0 ? '€' : '−€'}${Math.abs(Number(v)).toLocaleString('it-IT')}` : '—';
const fmtDelta = (v) => v !== 0 ? `${v > 0 ? '+' : ''}${v > 0 ? '€' : '−€'}${Math.abs(Number(v)).toLocaleString('it-IT')}` : '—';

export default function DayTypeBreakdown({ selectedPromoters, attendances, events, period1, period2 }) {
  const rows = useMemo(() => selectedPromoters.map(p => {
    const p1 = computeDayTypeRevenue(p.id, attendances, events, period1.from, period1.to);
    const p2 = computeDayTypeRevenue(p.id, attendances, events, period2.from, period2.to);
    return {
      nome: p.name,
      p1, p2,
      delta: {
        ven: p2.ven - p1.ven,
        sab: p2.sab - p1.sab,
        dom: p2.dom - p1.dom,
        extra: p2.extra - p1.extra,
      },
    };
  }), [selectedPromoters, attendances, events, period1, period2]);

  // Totali
  const totals = useMemo(() => {
    const t = { p1: { ven: 0, sab: 0, dom: 0, extra: 0 }, p2: { ven: 0, sab: 0, dom: 0, extra: 0 } };
    rows.forEach(r => {
      DAY_TYPES.forEach(d => { t.p1[d.key] += r.p1[d.key]; t.p2[d.key] += r.p2[d.key]; });
    });
    return t;
  }, [rows]);

  if (!rows.length) return null;

  return (
    <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
      <H className="text-sm font-semibold border-b border-border pb-2 mb-3">Fatturato per Giorno — Ven / Sab / Dom / Extra</H>
      <P className="text-[10px] text-muted-foreground mb-3">
        Fatturato del promoter suddiviso per tipo di serata. Blu = P1, Verde = P2, ultimo blocco = delta P2−P1.
      </P>
      <Div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <Thead>
            <Tr className="text-left text-muted-foreground border-b border-border">
              <Th className="py-2 pr-3" rowSpan={2}>Promoter</Th>
              {DAY_TYPES.map(d => (
                <Th key={d.key} className="py-1 px-2 text-center border-l border-border" colSpan={3}>
                  <Span style={{ color: d.color }} className="font-semibold">{d.full}</Span>
                </Th>
              ))}
            </Tr>
            <Tr className="text-left text-muted-foreground border-b border-border">
              {DAY_TYPES.map(d => (
                <React.Fragment key={d.key}>
                  <Th className="py-1 px-2 text-right border-l border-border text-blue-400 text-[10px]">P1</Th>
                  <Th className="py-1 px-2 text-right text-emerald-400 text-[10px]">P2</Th>
                  <Th className="py-1 px-2 text-right text-muted-foreground text-[10px]">Δ</Th>
                </React.Fragment>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r, i) => (
              <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                <Td className="py-2 pr-3 font-medium whitespace-nowrap">{r.nome}</Td>
                {DAY_TYPES.map(d => (
                  <React.Fragment key={d.key}>
                    <Td className="py-2 px-2 text-right border-l border-border/30 text-blue-400/90">{fmt(r.p1[d.key])}</Td>
                    <Td className="py-2 px-2 text-right text-emerald-400/90">{fmt(r.p2[d.key])}</Td>
                    <Td className={`py-2 px-2 text-right font-semibold ${r.delta[d.key] > 0 ? 'text-emerald-400' : r.delta[d.key] < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                      {fmtDelta(r.delta[d.key])}
                    </Td>
                  </React.Fragment>
                ))}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr className="border-t-2 border-border font-semibold">
              <Td className="py-2 pr-3">Totale</Td>
              {DAY_TYPES.map(d => (
                <React.Fragment key={d.key}>
                  <Td className="py-2 px-2 text-right border-l border-border/30 text-blue-400">{fmt(totals.p1[d.key])}</Td>
                  <Td className="py-2 px-2 text-right text-emerald-400">{fmt(totals.p2[d.key])}</Td>
                  <Td className={`py-2 px-2 text-right ${totals.p2[d.key] - totals.p1[d.key] > 0 ? 'text-emerald-400' : totals.p2[d.key] - totals.p1[d.key] < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {fmtDelta(totals.p2[d.key] - totals.p1[d.key])}
                  </Td>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
        </Table>
      </Div>
    </Div>
  );
}