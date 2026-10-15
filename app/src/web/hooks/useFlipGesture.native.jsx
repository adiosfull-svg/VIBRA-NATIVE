// Versione per il telefono di useFlipGesture (src/hooks/useFlipGesture.js): stessa API, senza il DOM.
// L'originale scrive transform/transition direttamente sull'elemento (innerRef.current.style) e usa
// pointer capture; qui tutto passa da `rotation`/`transition`, che html.tsx traduce in rotazioni
// animate delle due facce (classi semina-flip-*). Gesto: trascinamento orizzontale con inclinazione
// (max ±25°); oltre la soglia la card si gira, altrimenti torna com'era. «Gira» cambia `flipped`.
import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

const SWIPE_THRESHOLD = 60;
const CANCEL_DIST = 8;
const MAX_TILT = 25;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export function useFlipGesture(flipped, setFlipped) {
  const [rotation, setRotation] = useState(flipped ? 180 : 0);
  const [transition, setTransition] = useState(true);
  const tilt = useRef(new Animated.Value(0)).current;
  // vero durante il trascinamento (un solo setState all'inizio e uno alla fine): la card monta il retro
  const [tilting, setTilting] = useState(false);
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
      setTilting(true);
    }
    // PORT: inclinazione sul thread UI (setValue), niente setState a ogni movimento del dito: prima ogni
    // move ridisegnava tutta la card e l'inclinazione restava indietro rispetto al dito
    tilt.setValue(Math.max(-MAX_TILT, Math.min(MAX_TILT, dx / 4)));
  }, [flipped, tilt]);

  const end = useCallback((e) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.active) return;
    const dx = (e?.clientX ?? d.x) - d.x;
    setTilting(false);
    // l'inclinazione torna a 0 con la stessa curva della rotazione: oltre la soglia la card gira (l'effetto
    // su `flipped` anima fino a 0/180) e la somma va liscia fino alla faccia nuova, altrimenti torna com'era
    Animated.timing(tilt, { toValue: 0, duration: 400, easing: EASE, useNativeDriver: true }).start();
    if (Math.abs(dx) >= SWIPE_THRESHOLD) setFlipped(!flipped);
  }, [flipped, setFlipped, tilt]);

  return { rotation, transition, innerRef, onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, tilt, tilting };
}
