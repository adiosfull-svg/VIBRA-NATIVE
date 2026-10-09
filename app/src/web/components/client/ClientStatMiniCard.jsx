// Port di src/components/client/ClientStatMiniCard.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';

import { Btn, Div, P } from '@/ui/html';

/**
 * Card statistica compatta per la Clienti page, in stile Dashboard:
 * glow radiale, linea accento in alto, hover lift, entrata dash-fade-up.
 */
export default function ClientStatMiniCard({ icon: Icon, label, value, color = '#a78bfa', delay = 0, onClick }) {
  const Comp = onClick ? Btn : Div;
  return (
    <Comp
      onClick={onClick}
      className={`dash-fade-up relative overflow-hidden rounded-xl border border-white/[0.06] bg-card px-2 py-1.5 text-left group transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Div
        className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 -translate-y-6 translate-x-6 group-hover:opacity-25 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <Div className="relative flex items-center gap-1.5">
        <Div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color.slice(0, 7)}20` }}>
          <Icon className="w-3 h-3" style={{ color }} />
        </Div>
        <Div className="min-w-0">
          <P className="text-[10px] text-muted-foreground truncate">{label}</P>
          <P className="text-sm font-bold truncate" style={{ color }}>{value}</P>
        </Div>
      </Div>
    </Comp>
  );
}
