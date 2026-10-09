// Port di src/components/ilmiovibra/PiantinaFullscreen.jsx (convertito da scripts/port/codemod.mjs).
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, Copy, Download, Share2 } from '@/ui/icons.generated';
import { shareMedia } from '@/legacy/utils/downloadMaterials';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

/**
 * PiantinaFullscreen — overlay full-screen per visualizzare piantine/listini/loghi.
 *
 * ── REGOLA FONDAMENTALE (vale in tutta l'app, per sempre) ──
 * Il tasto back di Android e il tasto X chiudono SEMPRE un solo popup alla
 * volta, mai tutto insieme. Questo componente chiude solo se stesso via
 * onClose: non chiude il popup genitore (es. VibraSearch). useOverlay
 * (OverlayStackContext) gestisce il sentinel history (push + cleanup
 * automatico centralizzato) e stopPropagation sul root isola l'overlay dal
 * Dialog sottostante (nessun outside-click).
 *
 * ── Pinch-to-zoom naturale ──
 * Lo zoom avviene verso il midpoint delle due dita: il punto sotto le dita
 * resta fisso durante lo zoom (come Google Maps, foto native iOS/Android).
 * Formula: newOffset = mid - (mid - startOffset) * (newScale / startScale)
 * dove mid è il midpoint relativo al centro del container.
 *
 * ── Bypass react-remove-scroll ──
 * I listener touch sono sul root element (non su window) con capture: true,
 * così funzionano anche quando un Dialog Radix è aperto sotto e blocca i
 * touchmove su window/document.
 */
const MIN_SCALE = 1;
const MAX_SCALE = 6;

export default function PiantinaFullscreen({ src, label, onClose, disableBackClose = false }) {
  const containerRef = useRef(null);
  const rootRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(null);

  // ── Gesture refs (mutati nei handler senza re-render) ──
  const pinchRef = useRef({
    active: false,
    startDist: 0,
    startScale: 1,
    startOffsetX: 0,
    startOffsetY: 0,
    // Midpoint del pinch relativo al centro del container (in px)
    midX: 0,
    midY: 0,
  });
  const panRef = useRef({
    active: false,
    startX: 0, startY: 0,
    startOffsetX: 0, startOffsetY: 0,
  });
  const mousePanRef = useRef({ active: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 });

  // Stato vivo per scale/offset nei handler nativi (evita stale closure)
  const liveState = useRef({ scale: 1, offset: { x: 0, y: 0 } });
  useEffect(() => { liveState.current = { scale, offset }; }, [scale, offset]);

  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const clampOffset = useCallback((s, ox, oy) => {
    const el = containerRef.current;
    if (!el) return { x: ox, y: oy };
    const maxX = (el.clientWidth * (s - 1)) / 2;
    const maxY = (el.clientHeight * (s - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, ox)),
      y: Math.max(-maxY, Math.min(maxY, oy)),
    };
  }, []);

  // --- Escape key ---
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
    webWindow.addEventListener('keydown', onKey);
    return () => webWindow.removeEventListener('keydown', onKey);
  }, []);

  // --- Stack overlay centralizzato (OverlayStackContext) ---
  // useOverlay registra questo overlay nello stack globale: il back button
  // chiude solo questo popup (non il genitore), e la X pulisce il sentinel
  // automaticamente. disableBackClose = true se il genitore gestisce già.
  useOverlay(true, onClose, disableBackClose);

  // --- Isola l'overlay dal Dialog sottostante ---
  // Ferma la propagazione di pointer/touch al document: il Dialog di ricerca
  // non rileva "outside click" quando si tocca la piantina, e non chiude la
  // ricerca. Il click NON viene fermato (serve ai bottoni React onClick e
  // al tap-to-close sul container).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stop = (e) => e.stopPropagation();
    const evts = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
    evts.forEach(evt => root.addEventListener(evt, stop));
    return () => evts.forEach(evt => root.removeEventListener(evt, stop));
  }, []);

  // --- Touch + Wheel nativi sul root element (bypassa react-remove-scroll) ---
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Midpoint relativo al centro del container (per zoom verso il pinch point)
    const getMidRelativeToCenter = (t1, t2) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return {
        x: ((t1.clientX + t2.clientX) / 2) - cx,
        y: ((t1.clientY + t2.clientY) / 2) - cy,
      };
    };

    const onTouchStart = (e) => {
      const ls = liveState.current;
      if (e.touches.length === 2) {
        e.preventDefault();
        const [t1, t2] = e.touches;
        const mid = getMidRelativeToCenter(t1, t2);
        pinchRef.current = {
          active: true,
          startDist: Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY),
          startScale: ls.scale,
          startOffsetX: ls.offset.x,
          startOffsetY: ls.offset.y,
          midX: mid.x,
          midY: mid.y,
        };
        panRef.current.active = false;
      } else if (e.touches.length === 1) {
        panRef.current = {
          active: true,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startOffsetX: ls.offset.x,
          startOffsetY: ls.offset.y,
        };
      }
    };

    const onTouchMove = (e) => {
      const pinch = pinchRef.current;
      const pan = panRef.current;

      if (pinch.active && e.touches.length === 2) {
        e.preventDefault();
        const [t1, t2] = e.touches;
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        if (pinch.startDist > 0) {
          const ratio = dist / pinch.startDist;
          const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinch.startScale * ratio));
          // Zoom verso il midpoint iniziale: il punto sotto le dita resta fisso.
          // newOffset = mid - (mid - startOffset) * (newScale / startScale)
          const scaleRatio = newScale / pinch.startScale;
          const newOffsetX = pinch.midX - (pinch.midX - pinch.startOffsetX) * scaleRatio;
          const newOffsetY = pinch.midY - (pinch.midY - pinch.startOffsetY) * scaleRatio;
          const clamped = clampOffset(newScale, newOffsetX, newOffsetY);
          setScale(newScale);
          setOffset(clamped);
        }
      } else if (pan.active && e.touches.length === 1 && liveState.current.scale > 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - pan.startX;
        const dy = e.touches[0].clientY - pan.startY;
        setOffset(clampOffset(liveState.current.scale, pan.startOffsetX + dx, pan.startOffsetY + dy));
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length === 0) {
        pinchRef.current.active = false;
        panRef.current.active = false;
      } else if (e.touches.length === 1 && pinchRef.current.active) {
        // Transizione pinch→pan col dito rimanente
        pinchRef.current.active = false;
        const ls = liveState.current;
        panRef.current = {
          active: true,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startOffsetX: ls.offset.x,
          startOffsetY: ls.offset.y,
        };
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.3 : 0.3;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, liveState.current.scale + delta));
      if (newScale === MIN_SCALE) { setScale(1); setOffset({ x: 0, y: 0 }); }
      else setScale(newScale);
    };

    root.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
    root.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
    root.addEventListener('touchend', onTouchEnd, { capture: true, passive: true });
    root.addEventListener('wheel', onWheel, { capture: true, passive: false });
    return () => {
      root.removeEventListener('touchstart', onTouchStart, { capture: true });
      root.removeEventListener('touchmove', onTouchMove, { capture: true });
      root.removeEventListener('touchend', onTouchEnd, { capture: true });
      root.removeEventListener('wheel', onWheel, { capture: true });
    };
  }, [clampOffset]);

  // --- Mouse pan (desktop, dopo zoom) ---
  const onMouseDown = (e) => {
    if (liveState.current.scale <= 1) return;
    mousePanRef.current = {
      active: true, startX: e.clientX, startY: e.clientY,
      startOffsetX: offset.x, startOffsetY: offset.y,
    };
  };
  const onMouseMove = (e) => {
    if (!mousePanRef.current.active) return;
    const dx = e.clientX - mousePanRef.current.startX;
    const dy = e.clientY - mousePanRef.current.startY;
    setOffset(clampOffset(liveState.current.scale, mousePanRef.current.startOffsetX + dx, mousePanRef.current.startOffsetY + dy));
  };
  const onMouseUp = () => { mousePanRef.current.active = false; };

  // --- Button zoom ---
  const zoomBy = (delta) => {
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
    setScale(newScale);
    if (newScale === MIN_SCALE) setOffset({ x: 0, y: 0 });
  };

  // --- Copy / Download ---
  const handleCopy = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      if (webNavigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await webNavigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      } else {
        await webNavigator.clipboard.writeText(src);
      }
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 500);
    } catch {
      try { await webNavigator.clipboard.writeText(src); setCopied(true); setTimeout(() => setCopied(false), 500); } catch {}
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = webDocument.createElement('a');
      a.href = url;
      a.download = (label || 'immagine').replace(/[^a-z0-9]/gi, '_');
      webDocument.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      webWindow.open(src, '_blank');
    }
  };

  // Condividi verso app esterne (WhatsApp, Telegram, Mail...)
  const handleShare = () => { shareMedia(src, label || 'immagine'); };

  const cursorClass = scale > 1 ? 'cursor-grab' : '';

  return (
    <Div
      ref={rootRef}
      className="fixed inset-0 z-[10001] bg-black flex flex-col"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)', pointerEvents: 'auto', touchAction: 'none' }}
    >
      {/* Toolbar */}
      <Div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10 shrink-0">
        <Span className="text-white text-sm font-semibold truncate">{label}</Span>
        <Div className="flex items-center gap-2">
          <Btn onClick={() => zoomBy(0.5)} className="p-2 rounded-lg bg-white/10 text-white active:bg-white/20">
            <ZoomIn className="w-4 h-4" />
          </Btn>
          <Btn onClick={() => zoomBy(-0.5)} className="p-2 rounded-lg bg-white/10 text-white active:bg-white/20">
            <ZoomOut className="w-4 h-4" />
          </Btn>
          <Div className="relative">
            <Btn onClick={handleCopy} className="p-2 rounded-lg bg-white/10 text-white active:bg-white/20" accessibilityLabel="Copia">
              <Copy className="w-4 h-4" />
            </Btn>
            {copied && (
              <Span className="absolute right-0 top-full mt-1.5 z-10 text-[10px] font-medium px-2 py-1 rounded-md bg-emerald-500 text-white shadow-lg whitespace-nowrap">
                Copiato
              </Span>
            )}
          </Div>
          <Btn
            onClick={handleShare}
            className="p-2 rounded-lg bg-white/10 text-white active:bg-white/20"
            accessibilityLabel="Condividi">
            <Share2 className="w-4 h-4" />
          </Btn>
          <Btn onClick={handleDownload} className="p-2 rounded-lg bg-white/10 text-white active:bg-white/20" accessibilityLabel="Scarica">
            <Download className="w-4 h-4" />
          </Btn>
          {/* X: chiude SOLO questo popup (onClose), non il genitore */}
          <Btn onClick={onClose} className="p-2 rounded-lg bg-white/10 text-white active:bg-white/20">
            <X className="w-4 h-4" />
          </Btn>
        </Div>
      </Div>

      {/* Image area */}
      <Btn
        ref={containerRef}
        className={`flex-1 overflow-hidden flex items-center justify-center select-none ${cursorClass}`}
        style={{ touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={(e) => {
          if (e.target === containerRef.current && scale <= 1) onClose();
        }}
      >
        <Img
          src={src}
          alt={label}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'none',
            userSelect: 'none',
            touchAction: 'none',
            pointerEvents: 'auto',
          }} />
      </Btn>

      <Div className="text-center py-2 text-white/40 text-[10px] shrink-0">
        Pizzica/rotella per zoomare · trascina per muovere
      </Div>
    </Div>
  );
}
