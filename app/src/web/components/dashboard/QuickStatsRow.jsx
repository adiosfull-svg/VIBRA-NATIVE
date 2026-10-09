// Port di src/components/dashboard/QuickStatsRow.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import AnimatedNumber from './AnimatedNumber';

import { Div, P } from '@/ui/html';

export default function QuickStatsRow({ events, promoters, delay = 0 }) {
  // Tavoli totali: somma del contatore cumulativo gia' pronto su ogni promoter
  // (aggiornato in background), niente piu' bisogno di scaricare le presenze.
  const totalTavoli = promoters.reduce((sum, p) => sum + (p.cum_total_tables || 0), 0);

  const avgPerEvent = events.length > 0
    ? Math.round(events.reduce((s, e) => s + (e.total_revenue || 0), 0) / events.length)
    : 0;

  const bestEvent = [...events].sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))[0];
  const bestEventRev = bestEvent?.total_revenue || 0;

  const STATS = [
    { label: 'Tavoli Totali', raw: Math.round(totalTavoli * 10) / 10, decimals: 1, prefix: '', color: '#60a5fa' },
    { label: 'Media a Serata', raw: avgPerEvent, decimals: 0, prefix: '€', color: '#4ade80' },
    { label: 'Serate Totali', raw: events.length, decimals: 0, prefix: '', color: '#fb923c' },
    { label: 'Record Serata', raw: bestEventRev, decimals: 0, prefix: '€', color: '#f472b6' },
  ];

  return (
    <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STATS.map((s, i) => (
        <Div
          key={s.label}
          className="dash-fade-up relative overflow-hidden rounded-xl border border-white/[0.05] bg-card/50 p-4 text-center group hover:border-white/[0.12] transition-all duration-300"
          style={{ boxShadow: `inset 0 0 20px ${s.color}08`, animationDelay: `${delay}s` }}
        >
          <Div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${s.color}15, transparent 70%)` }} />
          <P className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{s.label}</P>
          <P className="text-xl font-black" style={{ color: s.color }}>
            <AnimatedNumber key={s.label} target={s.raw} prefix={s.prefix} decimals={s.decimals} />
          </P>
        </Div>
      ))}
    </Div>
  );
}
