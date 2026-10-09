// Port di src/components/event/EventPromoterChart.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from '@/ui/recharts';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Div } from '@/ui/html';

const COLORS = ['hsl(275,60%,55%)', 'hsl(200,70%,50%)', 'hsl(150,60%,45%)', 'hsl(40,80%,55%)', 'hsl(340,65%,55%)', 'hsl(20,70%,55%)', 'hsl(260,50%,60%)'];

export default function EventPromoterChart({ promoterRows }) {
  if (!promoterRows || promoterRows.length === 0) return null;

  const data = promoterRows
    .sort((a, b) => b.revenue - a.revenue)
    .map(r => ({ name: r.promoter.name, revenue: r.revenue }));

  return (
    <ChartFullscreen title="Fatturato per Promoter">
      <Div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: 'hsl(240 6% 8%)', border: '1px solid hsl(240 5% 18%)', borderRadius: '6px', fontSize: 11, color: '#ffffff' }}
              labelStyle={{ color: '#ffffff' }}
              itemStyle={{ color: '#ffffff' }}
              formatter={(v) => [`€${v.toLocaleString('it-IT')}`, 'Fatturato']}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Div>
    </ChartFullscreen>
  );
}
