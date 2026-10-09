// Port di src/components/shared/SortPills.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';

import { Btn, Div, Span } from '@/ui/html';

/**
 * Selettore a pill — stile "rinnovato" (reference: Weekend / Da Ricontattare).
 * Label + pill rounded-full; attivo = bg-primary filled con shadow,
 * inattivo = border sottile su bg-secondary. Supporta icone opzionali.
 */
export default function SortPills({ label, options, value, onChange, className = '', scrollable = false, children }) {
  return (
    <Div className={`flex items-center gap-1.5 ${scrollable ? 'flex-nowrap overflow-x-auto no-scrollbar' : 'flex-wrap'} ${className}`}>
      {label &&
      <Span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 shrink-0">{label}</Span>
      }
      {options.map(({ key, label: lbl, icon: Icon }) =>
      <Btn
        key={key}
        onClick={() => onChange(key)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
        value === key ?
        "bg-[#551a8e] text-primary-foreground shadow-sm shadow-primary/30" :
        'bg-[#151518] text-muted-foreground border border-border/40 hover:bg-secondary hover:text-foreground'}`
        }>
        
          {Icon && <Icon className="w-3 h-3" />}
          {lbl}
        </Btn>
      )}
      {children}
    </Div>
  );

}