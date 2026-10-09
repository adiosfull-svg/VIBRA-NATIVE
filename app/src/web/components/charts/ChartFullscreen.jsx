// Port di src/components/charts/ChartFullscreen.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, cloneElement } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { Maximize2, X, RotateCw, BarChart3 } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { lockScroll } from '@/web/lib/scrollLock';

import { Btn, Div, Span } from '@/ui/html';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';

/**
 * Wrapper che aggiunge un pulsante "schermo intero" a qualsiasi grafico.
 *
 * L'overlay è un POPUP a tutto schermo (fixed inset-0) che riproduce
 * l'intestazione grafica della card originale (gradient + icona + titolo
 * stile SectionHeader + chiusura).
 *
 *  - scrollable=false (grafici con zoom, uPlot): area overflow-hidden, il
 *    grafico riempie lo schermo. Zoom/pan fluidi (NESSUN backdrop-blur e
 *    NESSUN transform CSS sugli antenati del canvas).
 *  - scrollable=true (grafici statici, recharts/heatmap): area overflow-auto,
 *    centrato verticalmente se non riempie.
 *
 * rotateOnMobile (grafici di andamento/confronto): su mobile forza
 * l'orientamento orizzontale in modo NATIVO (Screen Orientation API +
 * Fullscreen API) — non tramite transform CSS. In questo modo l'intera
 * vista (intestazione + grafico) è orizzontale, il grafico riempie tutto
 * lo schermo utile, e zoom/pan di uPlot restano fluidi e identici allo
 * stato inline verticale (le coordinate touch mappano correttamente perché
 * non c'è alcuna rotazione CSS). Se il lock non è disponibile, l'utente
 * può ruotare manualmente il telefono (l'overlay fixed segue il viewport).
 *
 * Le "chips"/legende sono escluse dal fullscreen (passate come prop `aside`
 * delle ChartCard, ignorate in fullscreen): viene mostrato solo il grafico.
 *
 * Chiusura: tasto X, ESC, e Back di Android (history pushState + popstate).
 */
const ChartFullscreen = React.forwardRef(function ChartFullscreen({ title, children, className, scrollable = true, buttonPosition = 'top', icon = BarChart3, accentColor = '#a78bfa', rotateOnMobile = false, bare = false, externalTrigger = false }, ref) {
  const [open, setOpen] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  const handleClose = () => setOpen(false);

  const handleOpen = async () => {
    setOpen(true);
    if (rotateOnMobile) {
      // Forza landscape nativamente: nessun transform CSS → zoom/pan fluidi.
      // Richiesto attivazione utente (siamo nel click del pulsante).
      try { await webDocument.documentElement.requestFullscreen(); } catch {}
      try { if (screen.orientation) await screen.orientation.lock('landscape'); } catch {}
    }
  };

  // Permette al bottone (renderito esternamente nell'header) di aprire l'overlay
  React.useImperativeHandle(ref, () => ({ open: handleOpen }), [handleOpen]);

  // Back button gestito dallo stack centralizzato (OverlayStackContext).
  useOverlay(open, () => setOpen(false));

  // Dimensioni viewport (per il hint "ruota il telefono" quando ancora portrait)
  useEffect(() => {
    const update = () => setDims({ w: webWindow.innerWidth, h: webWindow.innerHeight });
    update();
    webWindow.addEventListener('resize', update);
    webWindow.addEventListener('orientationchange', update);
    return () => {
      webWindow.removeEventListener('resize', update);
      webWindow.removeEventListener('orientationchange', update);
    };
  }, []);

  // Lock scroll body (ref-counted) + ESC
  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    webWindow.addEventListener('keydown', onKey);
    return () => {
      unlock();
      webWindow.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Sblocca orientamento + esci fullscreen alla chiusura
  useEffect(() => {
    if (!open || !rotateOnMobile) return;
    return () => {
      try { if (screen.orientation) screen.orientation.unlock(); } catch {}
      try { if (webDocument.fullscreenElement) webDocument.exitFullscreen(); } catch {}
    };
  }, [open, rotateOnMobile]);

  const isMobile = dims.w > 0 && dims.w < 820;
  const isPortrait = dims.h > dims.w;
  const showRotateHint = rotateOnMobile && isMobile && isPortrait;

  return (
    <Div className={`relative ${className || ''}`}>
      <Div className="group/chart relative w-full">
        {children}
        {!externalTrigger && (
          <Btn
            onClick={handleOpen}
            className={`absolute ${buttonPosition === 'bottom' ? 'bottom-2' : 'top-2'} right-2 z-20 p-1.5 rounded-lg bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all duration-200 opacity-70 group-hover/chart:opacity-100 focus:opacity-100`}
            accessibilityLabel="Schermo intero">
            <Maximize2 className="w-3.5 h-3.5" />
          </Btn>
        )}
      </Div>

      {createPortal(
        <>
          {open && (
            <Div
              key="fs-overlay"
              className="fixed inset-0 z-[10000] bg-background flex flex-col p-3 chart-fs-in"
            >
              {bare ? (
                <Div className="flex-1 min-h-0 relative overflow-auto">
                  <Btn
                    onClick={handleClose}
                    className="absolute top-2 right-2 z-30 p-2 rounded-lg bg-black/50 border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition"
                    accessibilityLabel="Chiudi">
                    <X className="w-4 h-4" />
                  </Btn>
                  {showRotateHint && (
                    <Div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 text-[11px] text-white/60 select-none pointer-events-none">
                      <RotateCw className="w-3.5 h-3.5 animate-pulse" />
                      <Span>Ruota il telefono in orizzontale</Span>
                    </Div>
                  )}
                  <Div className="min-h-full flex flex-col justify-center">
                    {children}
                  </Div>
                </Div>
              ) : (
                <Div
                  className="relative rounded-2xl border border-white/[0.06] bg-card flex-1 min-h-0 flex flex-col overflow-hidden"
                  style={{ boxShadow: `0 4px 24px -6px ${accentColor}18` }}
                >
                  <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
                    style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

                  <Div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                    <SectionHeader icon={icon} title={title} color={accentColor} />
                    <Btn
                      onClick={handleClose}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition shrink-0"
                      accessibilityLabel="Chiudi">
                      <X className="w-4 h-4" />
                    </Btn>
                  </Div>

                  <Div className={`flex-1 min-h-0 relative ${scrollable ? 'overflow-auto' : 'overflow-hidden'}`}>
                    {showRotateHint && (
                      <Div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 text-[11px] text-white/60 select-none pointer-events-none">
                        <RotateCw className="w-3.5 h-3.5 animate-pulse" />
                        <Span>Ruota il telefono in orizzontale</Span>
                      </Div>
                    )}
                    <Div className={`${scrollable ? 'min-h-full' : 'h-full'} flex flex-col justify-center`}>
                      {cloneElement(children, { fullscreen: true, scrollable })}
                    </Div>
                  </Div>
                </Div>
              )}
            </Div>
          )}
        </>,
        webDocument.body
      )}
    </Div>
  );
});

export default ChartFullscreen;

/**
 * Bottone "schermo intero" riutilizzabile, da posizionare nell'header
 * della card (es. a sinistra di un select). Richiede il ChartFullscreen
 * collegato via ref: onClick={() => fsRef.current?.open()}.
 */
export function FullscreenButton({ onClick, className = '', title = 'Schermo intero' }) {
  return (
    <Btn
      onClick={onClick}
      className={`shrink-0 p-1.5 rounded-lg bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all duration-200 ${className}`}
      accessibilityLabel={title}>
      <Maximize2 className="w-3.5 h-3.5" />
    </Btn>
  );
}