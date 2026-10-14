// Port di src/components/promoter/PromoterInstagramGrowth.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from '@/ui/recharts';
import { format, parseISO, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { base44 } from '@/lib/base44';
import { TrendingUp, TrendingDown, Minus, Users, UserPlus } from '@/ui/icons.generated';

import { Div, P, Span } from '@/ui/html';

/**
 * Pannello di crescita Instagram (follower + following) mostrato all'espansione
 * del rigo IG nella PromoterCard. Carica gli snapshot giornalieri
 * (InstagramProfileSnapshot) del promoter e li plotta come mini line chart
 * a due serie, con i delta sul periodo disponibile.
 */
export default function PromoterInstagramGrowth({ promoterId }) {
  const { data: snapshots = [], isLoading } = useQuery({
    queryKey: ['ig-snapshots', promoterId],
    queryFn: () => base44.entities.InstagramProfileSnapshot.filter({ promoter_id: promoterId }, 'date', 120),
    enabled: !!promoterId,
    staleTime: 5 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const sorted = useMemo(
    () => [...snapshots].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [snapshots]
  );

  const chartData = useMemo(
    () => sorted.map(s => ({
      date: s.date,
      label: format(parseISO(s.date), 'd MMM', { locale: it }),
      followers: s.followers ?? 0,
      following: s.following ?? 0,
    })),
    [sorted]
  );

  const growth = useMemo(() => {
    if (sorted.length < 2) return null;
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const fDelta = (last.followers ?? 0) - (first.followers ?? 0);
    const fgDelta = (last.following ?? 0) - (first.following ?? 0);
    const days = Math.max(1, differenceInDays(parseISO(last.date), parseISO(first.date)));
    return { fDelta, fgDelta, days, firstDate: first.date, lastDate: last.date, count: sorted.length };
  }, [sorted]);

  if (isLoading) {
    return (
      <Div className="flex items-center justify-center py-4">
        <Div className="w-4 h-4 border-2 border-pink-500/40 border-t-pink-400 rounded-full animate-spin" />
      </Div>
    );
  }

  // Due assi Y separati (follower a sinistra, seguiti a destra), ciascuno con
  // dominio calcolato sulla propria serie. Con un asse unico le due serie
  // (~360 unità di distanza) con delta di 1-3 appaiono piatte; separandole
  // ogni linea mostra la sua pendenza reale.
  const fVals = chartData.length ? chartData.map(d => d.followers) : [0];
  const gVals = chartData.length ? chartData.map(d => d.following) : [0];
  const fMin = Math.min(...fVals), fMax = Math.max(...fVals);
  const gMin = Math.min(...gVals), gMax = Math.max(...gVals);
  const fSpan = fMax - fMin, gSpan = gMax - gMin;
  const fPad = fSpan > 0 ? Math.max(1, Math.round(fSpan * 0.25)) : Math.max(1, Math.round(fMax * 0.02) || 1);
  const gPad = gSpan > 0 ? Math.max(1, Math.round(gSpan * 0.25)) : Math.max(1, Math.round(gMax * 0.02) || 1);
  const followersDomain = [Math.max(0, fMin - fPad), fMax + fPad];
  const followingDomain = [Math.max(0, gMin - gPad), gMax + gPad];

  if (sorted.length === 0) {
    return (
      <P className="text-[11px] text-muted-foreground text-center py-3">Nessuno snapshot di crescita disponibile. Verrà registrato automaticamente ogni giorno.
              </P>
    );
  }

  const DeltaBadge = ({ value, label, color }) => {
    const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
    const cls = value > 0 ? 'text-emerald-400' : value < 0 ? 'text-red-400' : 'text-muted-foreground';
    return (
      <Div className="flex items-center gap-1.5 rounded-lg bg-secondary/40 px-2 py-1.5">
        <Icon className={`w-3.5 h-3.5 ${cls}`} />
        <Div className="leading-tight">
          <P className={`text-sm font-bold ${cls}`}>{value > 0 ? '+' : ''}{value.toLocaleString('it-IT')}</P>
          <P className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</P>
        </Div>
      </Div>
    );
  };

  return (
    <Div className="space-y-3">
      {growth && (
        <Div className="flex items-center justify-between gap-2">
          <Div className="flex gap-2">
            <DeltaBadge value={growth.fDelta} label="Follower" />
            <DeltaBadge value={growth.fgDelta} label="Seguiti" />
          </Div>
          <Span className="text-[10px] text-muted-foreground text-right leading-tight">
            {growth.count} snapshot{'\n'}in {growth.days} gg
          </Span>
        </Div>
      )}

      {chartData.length >= 2 ? (
        <Div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="hsl(240 5% 18%)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'hsl(240 5% 45%)', fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis yAxisId="followers" domain={followersDomain} hide />
              <YAxis yAxisId="following" orientation="right" domain={followingDomain} hide />
              <Tooltip
                contentStyle={{
                  background: 'hsl(240 6% 8%)',
                  border: '1px solid hsl(240 5% 18%)',
                  borderRadius: '6px',
                  fontSize: 11,
                  color: 'hsl(0 0% 95%)',
                }}
                labelStyle={{ color: 'hsl(240 5% 55%)', fontSize: 10 }}
              />
              <Line
                yAxisId="followers"
                type="monotone"
                dataKey="followers"
                stroke="#ec4899"
                strokeWidth={2}
                dot={false}
                name="Follower"
              />
              <Line
                yAxisId="following"
                type="monotone"
                dataKey="following"
                stroke="#a78bfa"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 3"
                name="Seguiti"
              />
            </LineChart>
          </ResponsiveContainer>
        </Div>
      ) : (
        <P className="text-[11px] text-muted-foreground text-center py-2">
          Serve almeno un secondo snapshot per plottare la crescita.
        </P>
      )}

      <Div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <Span className="flex items-center gap-1">
          <Span className="w-2.5 h-0.5 rounded-full bg-pink-500" /> Follower
        </Span>
        <Span className="flex items-center gap-1">
          <Span className="w-2.5 h-0.5 rounded-full bg-violet-400" /> Seguiti
        </Span>
      </Div>
    </Div>
  );
}