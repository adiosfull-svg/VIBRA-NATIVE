// Port di src/components/academy/AcademySideRail.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { createPortal } from '@/web/shims/react-dom';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';
import { Div } from '@/ui/html';
import { Path, Svg } from '@/ui/elements';

/**
 * AcademySideRail — rotella laterale mobile per la Guida all'uso.
 *
 * - Drag verticale con pointer capture
 * - Onda luminosa sul lato destro che segue il dito
 * - Bordo sinistro sempre spento
 * - Fisheye sulle icone durante il drag
 * - Effetto "pop-up" dell'intera sidebar quando viene premuta
 */
export default function AcademySideRail({ items, onJump }) {
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubIndex, setScrubIndex] = useState(-1);
  const [scrubY, setScrubY] = useState(0);
  const [activeId, setActiveId] = useState(items[0]?.id || null);

  const railRef = useRef(null);
  const itemRefs = useRef([]);
  const scrubIndexRef = useRef(-1);
  const scrubbingRef = useRef(false);
  const glassRef = useRef(null);
  const borderPathRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (scrubbingRef.current) return;

      const threshold = 150;
      let bestId = null;
      let bestDist = Infinity;

      for (const item of items) {
        const el = webDocument.getElementById(`academy-tile-${item.id}`);
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top < webWindow.innerHeight && rect.bottom > 0) {
          const dist = Math.abs(rect.top - threshold);

          if (dist < bestDist) {
            bestDist = dist;
            bestId = item.id;
          }
        }
      }

      if (bestId) setActiveId(bestId);
    };

    webWindow.addEventListener('scroll', onScroll, { passive: true });

    onScroll();

    return () => webWindow.removeEventListener('scroll', onScroll);
  }, [items]);

  const getIndexFromY = useCallback((clientY) => {
    if (items.length === 0) return 0;
    if (items.length === 1) return 0;

    const firstEl = itemRefs.current[0];
    const lastEl = itemRefs.current[items.length - 1];

    if (firstEl && lastEl) {
      const fRect = firstEl.getBoundingClientRect();
      const lRect = lastEl.getBoundingClientRect();

      const firstCenter = fRect.top + fRect.height / 2;
      const lastCenter = lRect.top + lRect.height / 2;

      if (lastCenter > firstCenter) {
        const ratio = Math.max(
          0,
          Math.min(
            1,
            (clientY - firstCenter) / (lastCenter - firstCenter)
          )
        );

        return Math.round(ratio * (items.length - 1));
      }
    }

    const rail = railRef.current;
    if (!rail) return 0;

    const rect = rail.getBoundingClientRect();

    if (rect.height === 0) return 0;

    const relY = clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, relY / rect.height));

    return Math.round(ratio * (items.length - 1));
  }, [items.length]);

  const updateRailShape = useCallback((bulgeY, bulgeAmount) => {
    const rail = railRef.current;
    const glass = glassRef.current;
    const borderPath = borderPathRef.current;

    if (!rail || !glass || !borderPath) return;

    const rect = rail.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const r = 20;
    const bh = 50;

    let d;

    if (bulgeAmount > 0 && bulgeY > r && bulgeY < H - r) {
      const by = Math.max(
        r + bh / 2,
        Math.min(H - r - bh / 2, bulgeY)
      );

      d = `M 0 0 L ${W - r} 0 Q ${W} 0 ${W} ${r} L ${W} ${by - bh / 2} Q ${W + bulgeAmount} ${by} ${W} ${by + bh / 2} L ${W} ${H - r} Q ${W} ${H} ${W - r} ${H} L 0 ${H}`;
    } else {
      d = `M 0 0 L ${W - r} 0 Q ${W} 0 ${W} ${r} L ${W} ${H - r} Q ${W} ${H} ${W - r} ${H} L 0 ${H}`;
    }

    glass.style.clipPath = `path('${d}')`;
    borderPath.setAttribute('d', d);
  }, []);

  useEffect(() => {
    updateRailShape(0, 0);

    const onResize = () => updateRailShape(0, 0);

    webWindow.addEventListener('resize', onResize);

    return () => webWindow.removeEventListener('resize', onResize);
  }, [updateRailShape, items.length]);

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    scrubbingRef.current = true;

    const index = getIndexFromY(e.clientY);
    scrubIndexRef.current = index;

    setScrubbing(true);
    setScrubIndex(index);
    setScrubY(e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!scrubbingRef.current) return;

    const y = e.clientY;

    setScrubY(y);

    const newIdx = getIndexFromY(y);

    if (newIdx !== scrubIndexRef.current) {
      scrubIndexRef.current = newIdx;
      setScrubIndex(newIdx);

      if (webNavigator.vibrate) {
        webNavigator.vibrate(6);
      }
    }

    const rail = railRef.current;

    if (rail) {
      updateRailShape(
        y - rail.getBoundingClientRect().top,
        10
      );
    }
  };

  const handlePointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const finalIdx = scrubIndexRef.current;

    scrubbingRef.current = false;

    setScrubbing(false);
    setScrubIndex(-1);

    scrubIndexRef.current = -1;

    updateRailShape(0, 0);

    if (finalIdx >= 0 && finalIdx < items.length) {
      onJump(items[finalIdx].id);
    }
  };

  const handlePointerCancel = () => {
    scrubbingRef.current = false;

    setScrubbing(false);
    setScrubIndex(-1);

    scrubIndexRef.current = -1;

    updateRailShape(0, 0);
  };

  const handleLostPointerCapture = () => {
    if (!scrubbingRef.current) return;

    scrubbingRef.current = false;

    setScrubbing(false);

    updateRailShape(0, 0);
  };

  if (items.length === 0) return null;

  const highlightedIdx = scrubbing
    ? scrubIndex
    : items.findIndex(i => i.id === activeId);

  const getScale = (i) => {
    if (scrubbing) {
      const distance = Math.abs(i - scrubIndex);

      if (distance === 0) return 1.8;
      if (distance === 1) return 1.22;
      if (distance === 2) return 1.04;
      if (distance === 3) return 0.92;
      if (distance === 4) return 0.82;

      return 0.75;
    }

    return i === highlightedIdx ? 1.15 : 1.0;
  };

  // Portal su document.body: la barra è `position: fixed`, ma dentro `.main-content` l'effetto
  // elastico Android (useRubberBandScroll) applica will-change/transform a quel contenitore, che
  // diventa il blocco di riferimento dei figli fixed: la barra si staccava dallo schermo
  // (scompariva e riappariva di scatto) allo scroll veloce e al primo tocco in cima alla pagina.
  return createPortal(
    <>
      <Div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 sm:hidden">
        <motion.div
          ref={railRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handleLostPointerCapture}
          onContextMenu={(e) => e.preventDefault()}
          className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-r-2xl"
          style={{
            touchAction: 'none',
            transformOrigin: 'left center',
            transform: 'translateZ(0)',
            willChange: 'transform',
            WebkitTransform: 'translateZ(0)',
            maxHeight: '62vh',
            overflow: 'visible',
          }}
          animate={{
            scaleX: scrubbing ? 1.08 : 1,
            scaleY: scrubbing ? 1.04 : 1,
            x: scrubbing ? 2 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
            mass: 0.5,
          }}
        >
          <Div
            ref={glassRef}
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: 0,
              width: 'calc(100% + 16px)',
              height: '100%',
              background: 'hsl(var(--card) / 0.6)',
              backdropFilter: 'blur(6px) saturate(160%)',
              WebkitBackdropFilter: 'blur(6px) saturate(160%)',
              opacity: scrubbing ? 1 : 0.72,
              transition: 'opacity 0.15s ease, filter 0.15s ease',
              filter: scrubbing
                ? 'drop-shadow(4px 0 18px rgba(139,92,246,0.32)) drop-shadow(0 6px 16px rgba(0,0,0,0.28))'
                : 'drop-shadow(0 0 6px rgba(139,92,246,0.12))',
              clipPath: 'inset(0 16px 0 0 round 0 16px 16px 0)',
            }}
          />

          <Svg
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: 0,
              width: 'calc(100% + 16px)',
              height: '100%',
              overflow: 'visible',
            }}
          >
            <Path
              ref={borderPathRef}
              fill="none"
              stroke={
                scrubbing
                  ? 'rgba(139,92,246,0.4)'
                  : 'hsl(var(--border) / 0.4)'
              }
              strokeWidth="1"
            />
          </Svg>

          <Div className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-px bg-border/30 pointer-events-none" />

          {items.map((item, i) => {
            const isActive = i === highlightedIdx;
            const scale = getScale(i);

            return (
              <Div
                key={item.id}
                ref={el => {
                  itemRefs.current[i] = el;
                }}
                className="relative flex items-center justify-center"
                style={{
                  width: 22,
                  height: 22,
                  flexShrink: 0,
                }}
              >
                <item.Icon
                  className="transition-all duration-100 ease-out"
                  style={{
                    width: 14 * scale,
                    height: 14 * scale,
                    color: isActive
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--muted-foreground))',
                    opacity: isActive ? 1 : 0.65,
                  }}
                />

                {isActive && (
                  <Div
                    className="absolute -right-1 w-0.5 rounded-full bg-primary"
                    style={{ height: 14 }}
                  />
                )}
              </Div>
            );
          })}
        </motion.div>
      </Div>

      <AnimatePresence>
        {scrubbing &&
          scrubIndex >= 0 &&
          scrubIndex < items.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1.3 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 28,
              }}
              className="fixed left-12 -translate-y-1/2 z-40 px-4 py-2.5 rounded-xl bg-popover border border-primary/30 text-sm font-bold text-primary sm:hidden pointer-events-none whitespace-nowrap"
              style={{
                top: scrubY,
                boxShadow:
                  '0 0 20px 4px rgba(139,92,246,0.3), 0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              {items[scrubIndex].title}
            </motion.div>
          )}
      </AnimatePresence>
    </>,
    webDocument.body
  );
}