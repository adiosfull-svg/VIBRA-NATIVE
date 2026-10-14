// Port di src/components/promoter/DayTypeFilterToggle.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';

import { Btn, Div, Span } from '@/ui/html';

const OPTIONS = [
  { key: 'ven', label: 'Ven', color: 'hsl(275 72% 52%)' },
  { key: 'sab', label: 'Sab', color: 'hsl(200 70% 50%)' },
  { key: 'dom', label: 'Dom', color: 'hsl(150 60% 45%)' },
  { key: 'extra', label: 'Extra', color: 'hsl(40 80% 55%)' },
];

/**
 * Toggle per filtrare i grafici mensili per tipo di giorno.
 * Default: Overall (dayFilter vuoto = tutti i giorni cumulati).
 * Selezionando Ven/Sab/Dom/Extra si restringe ai soli giorni scelti.
 */
export default function DayTypeFilterToggle({ dayFilter, onChange }) {
  const isOverall = !dayFilter || dayFilter.length === 0;
  const toggle = (key) => {
    onChange(dayFilter.includes(key) ? dayFilter.filter(k => k !== key) : [...dayFilter, key]);
  };
  return (
    <Div className="flex items-center gap-1.5 flex-wrap">
      <Btn
        button
        onClick={() => onChange([])}
        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
          isOverall ? 'bg-white/[0.06] border-white/15 text-foreground' : 'border-white/[0.06] text-muted-foreground/60'
        }`}>
        Overall
      </Btn>
      <Span className="text-[10px] text-muted-foreground/30">|</Span>
      {OPTIONS.map(o => {
        const active = dayFilter.includes(o.key);
        return (
          <Btn
            button
            key={o.key}
            onClick={() => toggle(o.key)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
            style={active
              ? { background: `${o.color}20`, borderColor: `${o.color}55`, color: o.color }
              : { borderColor: 'hsl(240 5% 18%)', color: 'hsl(240 5% 55%)' }}>
            {o.label}
          </Btn>
        );
      })}
    </Div>
  );
}