// Port di src/components/promoter/MonthlyRevenueChart.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import { parseISO, getDay, format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
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

const RANGE_OPTIONS = [
  { label: '6M', value: 6 },
  { label: '12M', value: 12 },
  { label: '24M', value: 24 },
  { label: '36M', value: 36 },
  { label: '48M', value: 48 },
  { label: 'Overall', value: 0 },
];

export default function MonthlyRevenueChart({ attendances, events }) {
  const [visible, setVisible] = useState({ fri: true, sat: true, sun: true, extra: true, overall: false });
  const [selectedRange, setSelectedRange] = useState(12);
  const now = new Date();

  const months = selectedRange > 0 ? selectedRange : (() => {
    let earliest = now;
    attendances.forEach(a => {
      const ev = events.find(e => e.id === a.event_id);
      if (ev?.date) {
        const d = parseISO(ev.date);
        if (d < earliest) earliest = d;
      }
    });
    return Math.max(1, (now.getFullYear() - earliest.getFullYear()) * 12 + (now.getMonth() - earliest.getMonth()) + 1);
  })();

  const data = Array.from({ length: months }, (_, i) => {
    const monthStart = startOfMonth(subMonths(now, months - 1 - i));
    const monthEnd = endOfMonth(monthStart);
    const label = format(monthStart, 'MMM yy', { locale: it });

    let fri = 0, sat = 0, sun = 0, extra = 0;
    attendances.forEach(a => {
      if (a.client_id) return;
      const ev = events.find(e => e.id === a.event_id);
      if (!ev?.date) return;
      const d = parseISO(ev.date);
      if (!isWithinInterval(d, { start: monthStart, end: monthEnd })) return;
      const rev = a.revenue || 0;
      if (ev.is_extra) { extra += rev; }
      else {
        const dow = getDay(d);
        if (dow === 5) fri += rev;
        else if (dow === 6) sat += rev;
        else if (dow === 0) sun += rev;
      }
    });

    return { label, fri, sat, sun, extra, overall: fri + sat + sun + extra };
  });

  const toggle = (key) => setVisible(v => ({ ...v, [key]: !v[key] }));

  return (
    <Div className="rounded-xl bg-card border border-border p-5 space-y-4">
      <Div className="flex items-center justify-between gap-3 flex-wrap">
        <H className="font-semibold text-sm">Andamento Mensile{selectedRange > 0 ? ` — ultimi ${months} mesi` : ' — Overall'}</H>
        <Div className="flex gap-1 flex-wrap">
          {RANGE_OPTIONS.map(opt => (
            <Btn
              button
              key={opt.value}
              onClick={() => setSelectedRange(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                selectedRange === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}>
              {opt.label}
            </Btn>
          ))}
        </Div>
      </Div>

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

      <ChartFullscreen title="Andamento Mensile">
        <Div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Defs>
                {LINES.map(({ key, color }) => (
                  <SvgLinearGradient key={key} id={`grad-m-${key}`} x1="0" y1="0" x2="0" y2="1">
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
                    fill={`url(#grad-m-${key})`}
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