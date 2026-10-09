// Port di src/components/dashboard/RevenueTimelineWidget.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { TrendingUp } from '@/ui/icons.generated';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine
} from '@/ui/recharts';
import { parseISO, format } from 'date-fns';
import { it } from 'date-fns/locale';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Btn, Div, P, Span } from '@/ui/html';
import { Defs, Stop, SvgLinearGradient } from '@/ui/elements';

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '10px',
  fontSize: 12,
  color: '#fff',
};

export default function RevenueTimelineWidget({ delay = 0 }) {
  const [chartType, setChartType] = useState('area');
  const [monthRange, setMonthRange] = useState(12);

  // Aggregate server-side: il server raggruppa per mese e restituisce ~24-60 righe
  // invece di caricare 5000 eventi e ridurli in JS. Zero main-thread blocking.
  const { data: aggData } = useQuery({
    queryKey: ['events-monthly-revenue'],
    queryFn: () => base44.entities.Event.aggregate({
      dateBucket: { field: 'date', unit: 'month' },
      sum: 'total_revenue',
      limit: 1000,
    }),
    staleTime: 30 * 60000,
    gcTime: 45 * 60000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
    placeholderData: keepPreviousData,
  });

  const data = useMemo(() => {
    if (!aggData?.rows) return [];
    // Server restituisce {rows: [{date: "YYYY-MM", sum_total_revenue, count}]}
    const rows = aggData.rows
      .map(r => ({ date: r.date, revenue: r.sum_total_revenue || 0 }))
      .sort((a, b) => a.date.localeCompare(b.date));
    const slice = monthRange === 'all' ? rows : rows.slice(-monthRange);
    return slice.map(r => ({
      label: format(parseISO(r.date + '-01'), 'MMM yy', { locale: it }),
      revenue: r.revenue,
    }));
  }, [aggData, monthRange]);

  const hasData = data.some(d => d.revenue > 0);
  const avg = hasData ? Math.round(data.filter(d => d.revenue > 0).reduce((s, d) => s + d.revenue, 0) / data.filter(d => d.revenue > 0).length) : 0;

  return (
    <Div
      className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5"
      style={{ animationDelay: `${delay}s` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, #60a5fa, transparent)', opacity: 0.7 }} />

      <Div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <Div className="flex items-center gap-2">
          <Div className="p-1.5 rounded-lg bg-violet-500/15">
            <TrendingUp className="w-4 h-4 text-violet-400" />
          </Div>
          <P className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Andamento Fatturato</P>
        </Div>
        <Div className="flex items-center gap-2">
          <Div className="flex gap-1 p-1 rounded-xl bg-secondary/30">
            {[6, 12, 24, 'all'].map(m => (
              <Btn key={m} onClick={() => setMonthRange(m)}
                className={`text-[11px] font-medium px-2 py-1 rounded-lg transition-all duration-200 ${monthRange === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {m === 'all' ? 'Sempre' : `${m}m`}
              </Btn>
            ))}
          </Div>
          <Div className="flex gap-1 p-1 rounded-xl bg-secondary/30">
            {[['area', '~'], ['bar', '▐']].map(([type, icon]) => (
              <Btn key={type} onClick={() => setChartType(type)}
                className={`text-[11px] font-medium px-2 py-1 rounded-lg transition-all duration-200 ${chartType === type ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {icon}
              </Btn>
            ))}
          </Div>
        </Div>
      </Div>

      {!hasData ? (
        <Div className="h-52 flex items-center justify-center">
          <P className="text-sm text-muted-foreground">Nessun dato disponibile</P>
        </Div>
      ) : (
        <ChartFullscreen title="Andamento Fatturato">
        <Div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <Defs>
                  <SvgLinearGradient x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                    <Stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </SvgLinearGradient>
                </Defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 14%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                <ReferenceLine y={avg} stroke="#a78bfa" strokeDasharray="4 4" strokeOpacity={0.4} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [`€${Number(v).toLocaleString('it-IT')}`, 'Fatturato']} />
                <Area type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={2.5} fill="url(#grad-timeline)" dot={false} activeDot={{ r: 5, fill: '#a78bfa' }} />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 14%)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [`€${Number(v).toLocaleString('it-IT')}`, 'Fatturato']} />
                <Bar dataKey="revenue" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Div>
        </ChartFullscreen>
      )}

      {avg > 0 && (
        <P className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <Span className="w-2 h-0.5 inline-block bg-violet-400/50 rounded" />
          Media mensile: <Span className="text-violet-400 font-semibold ml-1">€{avg.toLocaleString('it-IT')}</Span>
        </P>
      )}
    </Div>
  );
}
