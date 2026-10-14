// Port di src/components/promoter/ExPrTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { Users, UserX } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import ExPrAllTimeTable from './ExPrAllTimeTable';
import ExPrMonthlyTable from './ExPrMonthlyTable';
import ExPrDayTypeTable from './ExPrDayTypeTable';
import EmptyState from '@/web/components/shared/EmptyState';

import { Div, P, Span } from '@/ui/html';

export default function ExPrTab({ attendances, events }) {
  const { rows, allMonths } = useMemo(() => {
    const eventsById = new Map(events.map(e => [e.id, e]));
    const byName = {};
    for (const a of attendances) {
      if (!a.notes || !a.notes.startsWith('__ex_pr__')) continue;
      const ev = eventsById.get(a.event_id);
      if (!ev?.date) continue;
      const rawName = a.notes.startsWith('__ex_pr__:') ? a.notes.slice('__ex_pr__:'.length) : 'Ex PR (aggregato)';
      const name = rawName.trim().replace(/\s+/g, ' ');
      const key = name.toLowerCase();
      const rev = a.revenue || 0;
      if (!byName[key]) byName[key] = { name, total: 0, monthly: {}, dayType: { ven: 0, sab: 0, dom: 0, extra: 0 } };
      byName[key].total += rev;
      const monthKey = ev.date.slice(0, 7);
      byName[key].monthly[monthKey] = (byName[key].monthly[monthKey] || 0) + rev;
      const [y, m, dd] = ev.date.split('-').map(Number);
      const dow = new Date(y, m - 1, dd).getDay();
      if (ev.is_extra) byName[key].dayType.extra += rev;
      else if (dow === 5) byName[key].dayType.ven += rev;
      else if (dow === 6) byName[key].dayType.sab += rev;
      else if (dow === 0) byName[key].dayType.dom += rev;
    }
    const rows = Object.values(byName).sort((a, b) => b.total - a.total);
    const allMonths = [...new Set(rows.flatMap(r => Object.keys(r.monthly)))].sort();
    return { rows, allMonths };
  }, [attendances, events]);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nessun Ex PR"
        description="I promoter non riconosciuti durante l'importazione delle serate appariranno qui."
      />
    );
  }

  const totalExPr = rows.reduce((s, r) => s + r.total, 0);

  return (
    <Div className="space-y-5">
      <Div className="flex items-center justify-between flex-wrap gap-2 rounded-xl bg-card border border-border p-4">
        <Div>
          <SectionHeader icon={UserX} title="Ex PR — Promoter non riconosciuti" color="#fb923c" />
          <P className="text-[10px] text-muted-foreground/60 mt-1">
            {rows.length} promoter · €{totalExPr.toLocaleString('it-IT')} totale all-time
          </P>
        </Div>
        <Span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">All-time · Mesi · Ven/Sab/Dom/Extra</Span>
      </Div>

      <ExPrAllTimeTable allAttendances={attendances} events={events} />
      <ExPrMonthlyTable rows={rows} months={allMonths} />
      <ExPrDayTypeTable rows={rows} />
    </Div>
  );
}