// Port di src/components/promoter/MonthlyRevenueBarChart.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from '@/ui/recharts';
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval, eachMonthOfInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Div, H } from '@/ui/html';

const fmt = (v) => `€${Number(v).toLocaleString('it-IT')}`;
const BAR_COLOR = 'hsl(275 72% 52%)';

export default function MonthlyRevenueBarChart({ attendances, events }) {
  const data = useMemo(() => {
    if (!attendances.length || !events.length) return [];

    // Trova il primo e l'ultimo mese con dati
    let earliest = null;
    let latest = null;
    const eventsById = new Map(events.map(e => [e.id, e]));
    for (const a of attendances) {
      if (a.client_id) continue;
      const ev = eventsById.get(a.event_id);
      if (!ev?.date) continue;
      let d;
      try { d = parseISO(ev.date); } catch { continue; }
      if (!earliest || d < earliest) earliest = d;
      if (!latest || d > latest) latest = d;
    }
    if (!earliest || !latest) return [];

    const from = startOfMonth(earliest);
    const to = endOfMonth(latest);
    const monthList = eachMonthOfInterval({ start: from, end: to });

    return monthList.map(ms => {
      const me = endOfMonth(ms);
      const label = format(ms, 'MMM yy', { locale: it });
      let total = 0;
      for (const a of attendances) {
        if (a.client_id) continue;
        const ev = eventsById.get(a.event_id);
        if (!ev?.date) continue;
        let d;
        try { d = parseISO(ev.date); } catch { continue; }
        if (isWithinInterval(d, { start: ms, end: me })) total += a.revenue || 0;
      }
      return { label, total };
    });
  }, [attendances, events]);

  if (data.length === 0) return null;

  return (
    <Div className="rounded-xl bg-card border border-border p-5 space-y-3">
      <H className="font-semibold text-sm">Fatturato Mensile Totale — dal primo all'ultimo mese</H>
      <ChartFullscreen title="Fatturato Mensile Totale">
        <Div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'hsl(240 5% 50%)', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={12}
              />
              <YAxis
                tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `€${v}`}
              />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid hsl(240 5% 85%)', borderRadius: 8, fontSize: 12, color: '#111111', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                labelStyle={{ color: '#111111', fontWeight: 600 }}
                itemStyle={{ color: '#374151' }}
                cursor={{ fill: 'hsl(275 72% 52% / 0.08)' }}
                formatter={(v) => [fmt(v), 'Fatturato']}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.map((_, i) => <Cell key={i} fill={BAR_COLOR} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Div>
      </ChartFullscreen>
    </Div>
  );
}