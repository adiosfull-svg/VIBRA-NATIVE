// Port di src/components/instagram/InstagramGrowthCharts.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from '@/ui/recharts';
import DeferredChart from '@/web/components/shared/DeferredChart';
import { Users, UserCheck, Sprout, TrendingUp } from '@/ui/icons.generated';
import { format, parseISO, subDays } from 'date-fns';
import { it } from 'date-fns/locale';

import { Btn, Div, P, Span } from '@/ui/html';

const RANGES = [
  { key: '30', label: '30gg', days: 30 },
  { key: '90', label: '90gg', days: 90 },
  { key: 'all', label: 'Tutto', days: null },
];

const formatDate = (dateStr) => {
  try { return format(parseISO(dateStr), 'd MMM', { locale: it }); } catch { return dateStr; }
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl text-xs">
      <P className="font-semibold mb-1">{formatDate(label)}</P>
      {payload.map((p, i) => (
        <P key={i} className="text-muted-foreground">
          <Span style={{ color: p.color || p.fill }}>{p.name}: </Span>
          <Span className="font-semibold text-foreground">{p.value}</Span>
        </P>
      ))}
    </Div>
  );
}

export default function InstagramGrowthCharts({ promoterId }) {
  const [range, setRange] = useState('90');

  const { data: snapshots = [], isLoading } = useQuery({
    queryKey: ['ig-profile-snapshots', promoterId],
    queryFn: () => base44.entities.InstagramProfileSnapshot.filter({ promoter_id: promoterId }, 'date', 500),
    enabled: !!promoterId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const chartData = useMemo(() => {
    if (!snapshots.length) return [];
    const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
    const rangeConfig = RANGES.find(r => r.key === range);
    const mapped = sorted.map(s => ({
      date: s.date,
      followers: s.followers || 0,
      following: s.following || 0,
      semine_added: s.semine_added || 0,
    }));
    if (rangeConfig.days) {
      const cutoff = format(subDays(new Date(), rangeConfig.days), 'yyyy-MM-dd');
      return mapped.filter(s => s.date >= cutoff);
    }
    return mapped;
  }, [snapshots, range]);

  const latest = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const first = chartData.length > 0 ? chartData[0] : null;
  const followerDelta = latest && first ? latest.followers - first.followers : 0;
  const followingDelta = latest && first ? latest.following - first.following : 0;
  const semineTotal = chartData.reduce((sum, d) => sum + (d.semine_added || 0), 0);

  if (isLoading) {
    return (
      <Div className="flex items-center justify-center py-8">
        <Div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </Div>
    );
  }

  if (!chartData.length) {
    return (
      <Div className="flex flex-col items-center justify-center py-8 text-center gap-1.5">
        <TrendingUp className="w-6 h-6 text-muted-foreground/30" />
        <P className="text-xs text-muted-foreground/60 font-medium">Nessuno storico ancora</P>
        <P className="text-[10px] text-muted-foreground/40 leading-tight max-w-[200px]">
          I grafici si popoleranno automaticamente nei prossimi giorni, ad ogni sincronizzazione
        </P>
      </Div>
    );
  }

  return (
    <Div className="space-y-2.5 pt-1">
      {/* Range toggle */}
      <Div className="flex gap-1.5">
        {RANGES.map(r => (
          <Btn
            button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
              range === r.key
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                : 'bg-secondary/40 text-muted-foreground border border-transparent hover:bg-secondary/60'
            }`}>
            {r.label}
          </Btn>
        ))}
      </Div>

      {/* Follower chart */}
      <Div className="rounded-xl border border-pink-500/15 bg-secondary/20 p-2.5">
        <Div className="flex items-center justify-between mb-1">
          <Div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-pink-400" />
            <Span className="text-[10px] font-semibold text-pink-300 uppercase tracking-wide">Follower</Span>
          </Div>
          <Div className="flex items-center gap-2">
            <Span className="text-sm font-bold">{(latest?.followers || 0).toLocaleString('it-IT')}</Span>
            {followerDelta !== 0 && (
              <Span className={`text-[10px] font-semibold ${followerDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {followerDelta > 0 ? '+' : ''}{followerDelta}
              </Span>
            )}
          </Div>
        </Div>
        <DeferredChart style={{ height: 70 }}><ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 9, fill: 'hsl(240 5% 55%)' }} interval="preserveStartEnd" minTickGap={30} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(240 5% 55%)' }} width={28} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="followers" stroke="#ec4899" strokeWidth={2} dot={false} name="Follower" />
          </LineChart>
        </ResponsiveContainer></DeferredChart>
      </Div>

      {/* Following chart */}
      <Div className="rounded-xl border border-violet-500/15 bg-secondary/20 p-2.5">
        <Div className="flex items-center justify-between mb-1">
          <Div className="flex items-center gap-1.5">
            <UserCheck className="w-3 h-3 text-violet-400" />
            <Span className="text-[10px] font-semibold text-violet-300 uppercase tracking-wide">Seguiti</Span>
          </Div>
          <Div className="flex items-center gap-2">
            <Span className="text-sm font-bold">{(latest?.following || 0).toLocaleString('it-IT')}</Span>
            {followingDelta !== 0 && (
              <Span className={`text-[10px] font-semibold ${followingDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {followingDelta > 0 ? '+' : ''}{followingDelta}
              </Span>
            )}
          </Div>
        </Div>
        <DeferredChart style={{ height: 70 }}><ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 9, fill: 'hsl(240 5% 55%)' }} interval="preserveStartEnd" minTickGap={30} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(240 5% 55%)' }} width={28} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="following" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Seguiti" />
          </LineChart>
        </ResponsiveContainer></DeferredChart>
      </Div>

      {/* Semine added chart */}
      <Div className="rounded-xl border border-emerald-500/15 bg-secondary/20 p-2.5">
        <Div className="flex items-center justify-between mb-1">
          <Div className="flex items-center gap-1.5">
            <Sprout className="w-3 h-3 text-emerald-400" />
            <Span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wide">Semine aggiunte</Span>
          </Div>
          <Span className="text-sm font-bold">{semineTotal} <Span className="text-[10px] text-muted-foreground font-normal">totale</Span></Span>
        </Div>
        <DeferredChart style={{ height: 70 }}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 9, fill: 'hsl(240 5% 55%)' }} interval="preserveStartEnd" minTickGap={30} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(240 5% 55%)' }} width={20} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="semine_added" fill="#10b981" radius={[2, 2, 0, 0]} name="Semine" />
          </BarChart>
        </ResponsiveContainer></DeferredChart>
      </Div>
    </Div>
  );
}