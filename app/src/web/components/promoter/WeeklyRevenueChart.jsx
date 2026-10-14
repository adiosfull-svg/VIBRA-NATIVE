// Port di src/components/promoter/WeeklyRevenueChart.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import { startOfWeek, format, subWeeks, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Btn, Div, H, Span } from '@/ui/html';
import { Defs, Stop, SvgLinearGradient } from '@/ui/elements';

const LINES = [
  { key: 'fri',     label: 'Venerdì',  color: 'hsl(200 70% 50%)' },
  { key: 'sat',     label: 'Sabato',   color: 'hsl(40 80% 55%)' },
  { key: 'sun',     label: 'Domenica', color: 'hsl(340 65% 55%)' },
  { key: 'extra',   label: 'Extra',    color: 'hsl(0 72% 51%)' },
  { key: 'overall', label: 'Overall',  color: 'hsl(275 72% 62%)' },
];

export default function WeeklyRevenueChart({ attendances, events, weeks = 12 }) {
  const [visible, setVisible] = useState({ fri: true, sat: true, sun: true, extra: true, overall: false });
  // Ogni lunedì etichetta il weekend appena terminato (ven/sab/dom PRIMA
  // di quel lunedì). L'ultimo punto è il lunedì della settimana corrente,
  // che mostra il weekend più recente completato.
  const refMonday = startOfWeek(new Date(), { weekStartsOn: 1 });

  const data = Array.from({ length: weeks }, (_, i) => {
    const weekStart = subWeeks(refMonday, weeks - 1 - i); // lunedì
    const label = format(weekStart, 'dd/MM', { locale: it });

    // Weekend appena terminato: venerdì, sabato, domenica prima di questo lunedì
    const friDate = format(subDays(weekStart, 3), 'yyyy-MM-dd');
    const satDate = format(subDays(weekStart, 2), 'yyyy-MM-dd');
    const sunDate = format(subDays(weekStart, 1), 'yyyy-MM-dd');

    let fri = 0, sat = 0, sun = 0, extra = 0;
    attendances.forEach(a => {
      if (a.client_id) return;
      const ev = events.find(e => e.id === a.event_id);
      if (!ev?.date) return;
      const rev = a.revenue || 0;
      if (ev.is_extra) {
        if (ev.date === friDate || ev.date === satDate || ev.date === sunDate) extra += rev;
      } else {
        if (ev.date === friDate) fri += rev;
        else if (ev.date === satDate) sat += rev;
        else if (ev.date === sunDate) sun += rev;
      }
    });

    return { label, fri, sat, sun, extra, overall: fri + sat + sun + extra };
  });

  const toggle = (key) => setVisible(v => ({ ...v, [key]: !v[key] }));

  return (
    <Div className="rounded-xl bg-card border border-border p-5 space-y-4">
      <H className="font-semibold text-sm">Andamento Settimanale — ultime {weeks} settimane</H>

      {/* Toggle buttons */}
      <Div className="flex flex-wrap gap-2">
        {LINES.map(({ key, label, color }) => (
          <Btn
            button
            key={key}
            onClick={() => toggle(key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
              visible[key]
                ? 'border-transparent text-white'
                : 'border-border text-muted-foreground bg-transparent'
            }`}
            style={visible[key] ? { background: color, borderColor: color } : {}}>
            <Span
              className="w-2 h-2 rounded-full"
              style={{ background: visible[key] ? 'white' : color }}
            />
            {label}
          </Btn>
        ))}
      </Div>

      <ChartFullscreen title="Andamento Settimanale">
        <Div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Defs>
                {LINES.map(({ key, color }) => (
                  <SvgLinearGradient key={key} id={`grad-w-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="5%" stopColor={color} stopOpacity={0.25} />
                    <Stop offset="95%" stopColor={color} stopOpacity={0} />
                  </SvgLinearGradient>
                ))}
              </Defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
              <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(240 5% 50%)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip
                contentStyle={{ background: 'hsl(240 6% 8%)', border: '1px solid hsl(240 5% 18%)', borderRadius: 8, fontSize: 12, color: 'hsl(0 0% 95%)' }}
                formatter={(v, name) => {
                  const line = LINES.find(l => l.key === name);
                  return [`€${v.toLocaleString('it-IT')}`, line?.label || name];
                }}
              />
              {LINES.map(({ key, color }) =>
                visible[key] ? (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    strokeWidth={key === 'overall' ? 2.5 : 2}
                    strokeDasharray={key === 'overall' ? '5 3' : undefined}
                    fill={`url(#grad-w-${key})`}
                    dot={false}
                  />
                ) : null
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Div>
      </ChartFullscreen>
    </Div>
  );
}