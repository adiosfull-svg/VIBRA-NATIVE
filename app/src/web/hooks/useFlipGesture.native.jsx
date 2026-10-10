// Versione per il telefono di useFlipGesture (src/hooks/useFlipGesture.js): stessa API, senza il DOM.
// L'originale scrive transform/transition direttamente sull'elemento (innerRef.current.style) e usa
// pointer capture; qui tutto passa da `rotation`/`transition`, che html.tsx traduce in rotazioni
// animate delle due facce (classi semina-flip-*). Gesto: trascinamento orizzontale con inclinazione
// (max ±25°); oltre la soglia la card si gira, altrimenti torna com'era. «Gira» cambia `flipped`.
import { useState, useEffect, useRef, useCallback } from 'react';

const SWIPE_THRESHOLD = 60;
const CANCEL_DIST = 8;
const MAX_TILT = 25;

export function useFlipGesture(flipped, setFlipped) {
  const [rotation, setRotation] = useState(flipped ? 180 : 0);
  const [transition, setTransition] = useState(true);
  const innerRef = useRef(null);
  const drag = useRef(null); // { x, y, base, active }

  // `flipped` cambiato da fuori (pulsante Gira): rotazione animata verso la faccia giusta
  useEffect(() => {
    setTransition(true);
    setRotation(flipped ? 180 : 0);
  }, [flipped]);

  const onPointerDown = useCallback((e) => {
    drag.current = { x: e.clientX, y: e.clientY, base: flipped ? 180 : 0, active: false };
  }, [flipped]);

  const onPointerMove = useCallback((e) => {
    // sul telefono il primo evento può essere già un move (il down l'ha preso la ScrollView)
    if (!drag.current) { drag.current = { x: e.clientX, y: e.clientY, base: flipped ? 180 : 0, active: false }; return; }
    const d = drag.current;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.active) {
      if (Math.abs(dx) < CANCEL_DIST || Math.abs(dy) > Math.abs(dx)) return; // verticale: è uno scroll
      d.active = true;
      setTransition(false);
    }
    const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, dx / 4));
    setRotation(d.base + tilt);
  }, [flipped]);

  const end = useCallback((e) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.active) return;
    const dx = (e?.clientX ?? d.x) - d.x;
    setTransition(true);
    // oltre la soglia gira (l'effetto su `flipped` anima fino a 0/180), altrimenti torna com'era
    if (Math.abs(dx) >= SWIPE_THRESHOLD) setFlipped(!flipped);
    else setRotation(d.base);
  }, [flipped, setFlipped]);

  return { rotation, transition, innerRef, onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end };
}
