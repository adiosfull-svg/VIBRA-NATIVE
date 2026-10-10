// Port di src/components/programmazione/SeminaRecettivitaSlider.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';

const LEVELS = [
  { value: 1, emoji: '🌱', label: 'Da coltivare', desc: 'Instaurare rapporto o rubarla', color: '#94a3b8' },
  { value: 2, emoji: '🔥', label: 'Ottima empatia', desc: 'Buona chat avviata', color: '#fbbf24' },
  { value: 3, emoji: '⚡', label: 'Super recettiva', desc: 'Prossima per venire', color: '#34d399' },
];

/**
 * Slider recettività a 3 livelli per le semine.
 * Barra cliccabile che apre un piccolo popup fluido per scegliere il livello.
 *
 * Fix chiave: stopPropagation su onPointerDown blocca sia il drag handler della
 * card (SeminaAgenda) sia il long-press handler globale (ClientSerateMenu)
 * che intercettava i click sui [data-client-id]. Il popup usa CSS animations
 * (menu-pop-in) invece di AnimatePresence+createPortal che non comunicavano.
 */
export default function SeminaRecettivitaSlider({ semina, promoterId }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [popupPos, setPopupPos] = useState(null);
  const btnRef = useRef(null);

  const level = semina.recettivita || 1;
  const current = LEVELS.find(l => l.value === level) || LEVELS[0];

  const openPopup = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const popupW = 200;
      const popupH = 180;
      const x = Math.max(8, Math.min(rect.left, webWindow.innerWidth - popupW - 8));
      const y = Math.min(rect.bottom + 6, webWindow.innerHeight - popupH - 8);
      setPopupPos({ x, y, w: popupW });
    }
    setOpen(true);
    setClosing(false);
  };

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 140);
  };

  const togglePopup = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (open) closePopup();
    else openPopup(e);
  };

  const setLevel = async (newLevel) => {
    closePopup();
    if (newLevel === level) return;
    // Optimistic
    qc.setQueriesData({ queryKey: ['semine', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(s => s.id === semina.id ? { ...s, recettivita: newLevel } : s);
    });
    try {
      await base44.entities.Semina.update(semina.id, { recettivita: newLevel });
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    } catch {
      qc.invalidateQueries({ queryKey: ['semine', promoterId] });
    }
  };

  // Chiudi popup su scroll/resize/ESC
  useEffect(() => {
    if (!open) return;
    const close = () => closePopup();
    const onKey = (e) => { if (e.key === 'Escape') closePopup(); };
    webWindow.addEventListener('scroll', close, { passive: true, capture: true });
    webWindow.addEventListener('resize', close);
    webWindow.addEventListener('keydown', onKey);
    return () => {
      webWindow.removeEventListener('scroll', close, { capture: true });
      webWindow.removeEventListener('resize', close);
      webWindow.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <Btn
        button
        ref={btnRef}
        onClick={togglePopup}
        onPointerDown={e => { e.stopPropagation(); }}
        onTouchStart={e => { e.stopPropagation(); }}
        className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors"
      >
        <Span className="text-sm leading-none">{current.emoji}</Span>
        <Div className="flex-1 flex gap-0.5">
          {LEVELS.map(l => (
            <Div
              key={l.value}
              className="flex-1 h-1.5 rounded-full transition-colors duration-300"
              style={{ background: l.value <= level ? current.color : 'hsl(240 5% 18%)' }}
            />
          ))}
        </Div>
        <Span className="text-[9px] font-medium truncate max-w-[80px]" style={{ color: current.color }}>
          {current.label}
        </Span>
      </Btn>

      {open && popupPos && createPortal(
        <>
          <Btn
            className={`fixed inset-0 z-[10001] ${closing ? 'backdrop-fade-out' : 'backdrop-fade-in'}`}
            onClick={closePopup}
            onTouchStart={e => { if (e.target === e.currentTarget) { e.preventDefault(); closePopup(); } }} />
          <Div
            className={`fixed z-[10002] rounded-xl border border-pink-500/30 bg-popover shadow-2xl overflow-hidden ${closing ? 'menu-pop-out' : 'menu-pop-in'}`}
            style={{ left: popupPos.x, top: popupPos.y, width: popupPos.w, transformOrigin: 'top center' }}
          >
            <Div className="px-3 py-2 border-b border-border/40 bg-secondary/40">
              <P className="text-[10px] font-semibold uppercase tracking-wider text-pink-400">Recettività</P>
            </Div>
            <Div className="p-1.5 space-y-1">
              {LEVELS.map(l => (
                <Btn
                  button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  onPointerDown={e => e.stopPropagation()}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    l.value === level ? 'bg-pink-500/15' : 'hover:bg-secondary/40'
                  }`}>
                  <Span className="text-lg leading-none">{l.emoji}</Span>
                  <Div className="flex-1 min-w-0">
                    <P className="text-xs font-medium" style={{ color: l.value === level ? l.color : undefined }}>
                      {l.label}
                    </P>
                    {l.desc && (
                      <P className="text-[9px] text-muted-foreground">{l.desc}</P>
                    )}
                  </Div>
                  {l.value === level && (
                    <Span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                  )}
                </Btn>
              ))}
            </Div>
          </Div>
        </>,
        webDocument.body
      )}
    </>
  );
}