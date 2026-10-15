// Transizioni CSS sul telefono (transition nello style o classi transition-*): opacità, colore di
// sfondo e comparsa/scomparsa del backdrop-blur, animati con Animated. Le classi transition-* non
// passano a NativeWind (webClasses: la sua interop andava in loop sul dettaglio cliente); qui si
// anima solo ciò che serve, il resto cambia subito come prima.
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import type { TransitionSpec } from './cssTransitionSpec';
export { classOpacity, transitionSpec, type TransitionSpec } from './cssTransitionSpec';

const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

/**
 * Valori animati per un elemento con transizione. `opacity`/`backgroundColor`: valori di arrivo
 * (undefined = non toccati); `blurPx`: blur richiesto ora (0 = nessuno). Restituisce lo style animato
 * e il blur da disegnare con la sua opacità (resta montato durante la dissolvenza in uscita).
 */
export function useCssTransition(spec: TransitionSpec | null, opacity: number | undefined, backgroundColor: string | undefined, blurPx: number) {
  const op = useRef<Animated.Value | null>(null);
  const bg = useRef<{ v: Animated.Value; from: string; to: string; color: Animated.AnimatedInterpolation<string> } | null>(null);
  const blur = useRef<{ v: Animated.Value; px: number } | null>(null);
  const [shownBlur, setShownBlur] = useState(blurPx);

  const opTarget = spec?.opacity && opacity != null ? opacity : undefined;
  // ultimo valore di arrivo: al montaggio (valore già a destinazione) niente animazione da x a x
  const opLast = useRef<number | undefined>(undefined);
  if (opTarget != null && !op.current) { op.current = new Animated.Value(opTarget); opLast.current = opTarget; }
  useEffect(() => {
    if (opTarget == null || !op.current) return;
    if (opLast.current === opTarget) return;
    opLast.current = opTarget;
    const a = Animated.timing(op.current, { toValue: opTarget, duration: spec!.opacity, easing: EASE, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [opTarget]); // eslint-disable-line react-hooks/exhaustive-deps

  const bgTarget = spec?.backgroundColor ? backgroundColor : undefined;
  const makeBg = (start: number, from: string, to: string) => {
    const v = new Animated.Value(start);
    return { v, from, to, color: v.interpolate({ inputRange: [0, 1], outputRange: [from, to] }) };
  };
  if (bgTarget && !bg.current) bg.current = makeBg(1, bgTarget, bgTarget);
  if (bgTarget && bg.current && bg.current.to !== bgTarget) bg.current = makeBg(0, bg.current.to, bgTarget);
  const bgState = bg.current;
  useEffect(() => {
    if (!bgState || !spec?.backgroundColor) return;
    // da un colore a sé stesso (montaggio): niente animazione (prima 150-300 ms di aggiornamenti per nulla)
    if (bgState.from === bgState.to) return;
    // colore animato sul thread UI (RN 0.86: backgroundColor è tra gli stili del driver nativo)
    const a = Animated.timing(bgState.v, { toValue: 1, duration: spec.backgroundColor, easing: EASE, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [bgState]); // eslint-disable-line react-hooks/exhaustive-deps

  const blurMs = spec?.blur;
  if (blurMs && !blur.current) blur.current = { v: new Animated.Value(blurPx ? 1 : 0), px: blurPx };
  useEffect(() => {
    if (!blurMs || !blur.current) { setShownBlur(blurPx); return; }
    const b = blur.current;
    if (blurPx) { b.px = blurPx; setShownBlur(blurPx); }
    const a = Animated.timing(b.v, { toValue: blurPx ? 1 : 0, duration: blurMs, easing: EASE, useNativeDriver: true });
    a.start(({ finished }) => { if (finished && !blurPx) setShownBlur(0); });
    return () => a.stop();
  }, [blurPx, blurMs]);

  const style: Record<string, unknown> | null = opTarget != null || bgState
    ? {
        ...(opTarget != null && op.current ? { opacity: op.current } : null),
        ...(bgState ? { backgroundColor: bgState.color } : null),
      }
    : null;
  return {
    style,
    /** blur da disegnare ora (px) e la sua opacità animata (null: nessuna transizione sul blur) */
    blurPx: blurMs ? (blurPx || shownBlur) : blurPx,
    blurOpacity: blurMs ? blur.current?.v ?? null : null,
  };
}
