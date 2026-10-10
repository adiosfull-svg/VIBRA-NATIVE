// Port di src/components/ai/ModelSelector.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Zap, ZapOff } from '@/ui/icons.generated';
import { makeTapHandlers } from '@/web/lib/tapHandlers';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';

/**
 * Selettore compatto del modello per VibraGPT.
 * - "avanzato"  → agente consulente_strategico (gpt_5_5, ~15 crediti)
 * - "standard"  → agente consulente_strategico_lite (automatic, ~3 crediti)
 * Il modello è fissato alla creazione della conversazione; il selettore
 * influisce sulle nuove chat.
 */
export default function ModelSelector({ tier, onTierChange, canUseAvanzato = true }) {
  const [open, setOpen] = useState(false);
  const lastTouchRef = useRef(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    webWindow.addEventListener('mousedown', close);
    webWindow.addEventListener('touchstart', close, { passive: true });
    return () => { webWindow.removeEventListener('mousedown', close); webWindow.removeEventListener('touchstart', close); };
  }, [open]);

  const isAvanzato = tier !== 'standard';

  return (
    <Div ref={ref} className="relative shrink-0">
      <Btn
        button
        {...makeTapHandlers(lastTouchRef, () => setOpen(v => !v))}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all ${
          isAvanzato
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
        }`}
        accessibilityLabel="Modello VibraGPT">
        {isAvanzato ? <Zap className="w-3 h-3" /> : <ZapOff className="w-3 h-3" />}
        <Span className="hidden sm:inline">{isAvanzato ? 'Avanzato' : 'Standard'}</Span>
        <ChevronDown className="w-3 h-3" />
      </Btn>
      {open && (
        <Div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl min-w-[240px] overflow-hidden menu-pop-in">
          {canUseAvanzato && (
          <Btn
            button
            onClick={() => { onTierChange('avanzato'); setOpen(false); }}
            className={`w-full text-left px-3.5 py-3 hover:bg-secondary/40 transition-all ${isAvanzato ? 'bg-primary/10' : ''}`}>
            <Div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <Span className="text-xs font-semibold text-primary">Avanzato</Span>
              <Span className="ml-auto text-[10px] text-muted-foreground">~15 cr</Span>
            </Div>
            <P className="text-[11px] text-muted-foreground mt-1">gpt_5_5 · più profondo, ragionamento complesso</P>
          </Btn>
          )}
          <Btn
            button
            onClick={() => { onTierChange('standard'); setOpen(false); }}
            className={`w-full text-left px-3.5 py-3 hover:bg-secondary/40 transition-all ${!isAvanzato ? 'bg-primary/10' : ''}`}>
            <Div className="flex items-center gap-2">
              <ZapOff className="w-3.5 h-3.5 text-muted-foreground" />
              <Span className="text-xs font-semibold text-foreground">Standard</Span>
              <Span className="ml-auto text-[10px] text-muted-foreground">~3 cr</Span>
            </Div>
            <P className="text-[11px] text-muted-foreground mt-1">automatic · veloce, economico, ottimo per uso quotidiano</P>
          </Btn>
          <Div className="px-3.5 py-2 border-t border-border bg-secondary/20">
            <P className="text-[10px] text-muted-foreground leading-snug">Si applica alla prossima nuova chat. Le conversazioni aperte mantengono il modello con cui sono iniziate.</P>
          </Div>
        </Div>
      )}
    </Div>
  );
}