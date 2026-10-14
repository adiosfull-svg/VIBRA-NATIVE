// Port di src/components/promoter/MonthlyCompare.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { parseISO, getDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { calcTables } from '@/legacy/utils/tables';
import { ArrowRightLeft } from '@/ui/icons.generated';

import { Btn, Div, H, P } from '@/ui/html';
import { HtmlOption, HtmlSelect, Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

function computeMonthStats(attendances, events, year, month) {
  const mStart = startOfMonth(new Date(year, month));
  const mEnd = endOfMonth(new Date(year, month));

  let total = 0, fri = 0, sat = 0, sun = 0, extra = 0;
  let tabFri = 0, tabSat = 0, tabSun = 0, tabExtra = 0;
  const presentEventIds = new Set();

  attendances.forEach(a => {
    if (a.client_id) return;
    const ev = events.find(e => e.id === a.event_id);
    if (!ev?.date) return;
    const d = parseISO(ev.date);
    if (!isWithinInterval(d, { start: mStart, end: mEnd })) return;
    const rev = a.revenue || 0;
    total += rev;
    presentEventIds.add(a.event_id);

    if (ev.is_extra) {
      extra += rev;
      tabExtra += calcTables(rev, 0, ev.table_threshold || 300);
    } else {
      const dow = getDay(d);
      const t = calcTables(rev, dow, ev.table_threshold || null);
      if (dow === 5) { fri += rev; tabFri += t; }
      else if (dow === 6) { sat += rev; tabSat += t; }
      else if (dow === 0) { sun += rev; tabSun += t; }
    }
  });

  return {
    total, fri, sat, sun, extra,
    totalTables: tabFri + tabSat + tabSun + tabExtra,
    tabFri, tabSat, tabSun, tabExtra,
    presenze: presentEventIds.size,
  };
}

function euroDelta(a, b) {
  if (a === 0 && b === 0) return { text: '—', cls: 'text-muted-foreground' };
  const diff = b - a;
  const pct = a > 0 ? Math.round((diff / a) * 100) : (b > 0 ? 100 : 0);
  const eur = diff >= 0
    ? `+€${diff.toLocaleString('it-IT')}`
    : `€${diff.toLocaleString('it-IT')}`;
  const pctStr = pct >= 0 ? `+${pct}%` : `${pct}%`;
  return {
    text: `${eur} (${pctStr})`,
    cls: diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-muted-foreground',
  };
}

function numDelta(a, b, isTavoli = false) {
  if (a === 0 && b === 0) return { text: '—', cls: 'text-muted-foreground' };
  const diff = b - a;
  const pct = a > 0 ? Math.round((diff / a) * 100) : (b > 0 ? 100 : 0);
  const val = isTavoli ? diff.toFixed(1).replace('.', ',') : diff;
  const sign = diff > 0 ? '+' : '';
  const pctStr = pct >= 0 ? `+${pct}%` : `${pct}%`;
  return {
    text: `${sign}${val} (${pctStr})`,
    cls: diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-muted-foreground',
  };
}

export default function MonthlyCompare({ attendances, events }) {
  const now = new Date();
  const [month1, setMonth1] = useState(now.getMonth());
  const [year1, setYear1] = useState(now.getFullYear());
  const [month2, setMonth2] = useState(now.getMonth() === 0 ? 11 : now.getMonth() - 1);
  const [year2, setYear2] = useState(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
  const [compared, setCompared] = useState(false);

  const stats1 = useMemo(() => computeMonthStats(attendances, events, year1, month1), [attendances, events, year1, month1]);
  const stats2 = useMemo(() => computeMonthStats(attendances, events, year2, month2), [attendances, events, year2, month2]);

  const yearOptions = [];
  const minYear = 2022;
  for (let y = now.getFullYear(); y >= minYear; y--) yearOptions.push(y);

  const label1 = `${MONTHS[month1]} ${year1}`;
  const label2 = `${MONTHS[month2]} ${year2}`;

  const rows = [
    { label: 'Fatturato',       v1: stats1.total,       v2: stats2.total,       fmt: euroDelta },
    { label: 'Tavoli',          v1: stats1.totalTables,  v2: stats2.totalTables,  fmt: (a, b) => numDelta(a, b, true) },
    { label: 'Presenze fatt.',  v1: stats1.presenze,     v2: stats2.presenze,     fmt: numDelta },
    { label: 'Venerdì',         v1: stats1.fri,           v2: stats2.fri,           fmt: euroDelta },
    { label: 'Sabato',          v1: stats1.sat,           v2: stats2.sat,           fmt: euroDelta },
    { label: 'Domenica',        v1: stats1.sun,           v2: stats2.sun,           fmt: euroDelta },
    { label: 'Extra',           v1: stats1.extra,         v2: stats2.extra,         fmt: euroDelta },
  ];

  const formatVal = (v, row) => {
    if (row.fmt === euroDelta) return `€${v.toLocaleString('it-IT')}`;
    if (row.label === 'Tavoli') return v.toFixed(1).replace('.', ',');
    return v;
  };

  return (
    <Div className="rounded-xl bg-card border border-border overflow-hidden">
      <Div className="p-4 border-b border-border space-y-3">
        <H className="font-semibold text-sm flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-primary" />
          Confronta Mesi
        </H>
        <Div className="grid grid-cols-2 gap-3">
          <Div className="space-y-1.5">
            <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Mese 1</P>
            <Div className="flex gap-2">
              <HtmlSelect value={month1} onChange={e => { setMonth1(Number(e.target.value)); setCompared(false); }}
                className="flex-1 bg-secondary border border-border rounded px-2 py-1.5 text-xs">
                {MONTHS.map((m, i) => <HtmlOption key={i} value={i}>{m}</HtmlOption>)}
              </HtmlSelect>
              <HtmlSelect value={year1} onChange={e => { setYear1(Number(e.target.value)); setCompared(false); }}
                className="w-[72px] bg-secondary border border-border rounded px-2 py-1.5 text-xs">
                {yearOptions.map(y => <HtmlOption key={y} value={y}>{y}</HtmlOption>)}
              </HtmlSelect>
            </Div>
          </Div>
          <Div className="space-y-1.5">
            <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Mese 2</P>
            <Div className="flex gap-2">
              <HtmlSelect value={month2} onChange={e => { setMonth2(Number(e.target.value)); setCompared(false); }}
                className="flex-1 bg-secondary border border-border rounded px-2 py-1.5 text-xs">
                {MONTHS.map((m, i) => <HtmlOption key={i} value={i}>{m}</HtmlOption>)}
              </HtmlSelect>
              <HtmlSelect value={year2} onChange={e => { setYear2(Number(e.target.value)); setCompared(false); }}
                className="w-[72px] bg-secondary border border-border rounded px-2 py-1.5 text-xs">
                {yearOptions.map(y => <HtmlOption key={y} value={y}>{y}</HtmlOption>)}
              </HtmlSelect>
            </Div>
          </Div>
        </Div>
        <Btn
          button
          onClick={() => setCompared(true)}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
          Confronta {label1} vs {label2}
        </Btn>
      </Div>

      {compared && (
        <Div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <Thead>
              <Tr className="bg-secondary/30 border-b border-border">
                <Th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Metrica</Th>
                <Th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">{label1}</Th>
                <Th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">{label2}</Th>
                <Th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Δ</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, i) => {
                const d = row.fmt(row.v1, row.v2);
                return (
                  <Tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <Td className="px-4 py-2.5 font-medium text-xs">{row.label}</Td>
                    <Td className="px-4 py-2.5 text-right text-xs">{formatVal(row.v1, row)}</Td>
                    <Td className="px-4 py-2.5 text-right text-xs">{formatVal(row.v2, row)}</Td>
                    <Td className={`px-4 py-2.5 text-right text-xs font-semibold ${d.cls}`}>{d.text}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Div>
      )}
    </Div>
  );
}