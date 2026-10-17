// Transizioni CSS sul telefono (transition nello style o classi transition-*): opacità, colore di
// sfondo, comparsa/scomparsa del backdrop-blur e trasformazioni delle classi (scale/rotate/translate),
// animati con Animated sul driver nativo. Le classi transition-* non
// passano a NativeWind (webClasses: la sua interop andava in loop sul dettaglio cliente); qui si
// anima solo ciò che serve, il resto cambia subito come prima.
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { IDENTITY_TRANSFORM, type ClassTransform, type TransitionSpec } from './cssTransitionSpec';
export { classOpacity, classTransform, transitionSpec, withoutClassTransform, type ClassTransform, type TransitionSpec } from './cssTransitionSpec';

const TRANSFORM_KEYS = ['translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate'] as const;

const EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

/**
 * Valori animati per un elemento con transizione. `opacity`/`backgroundColor`: valori di arrivo
 * (undefined = non toccati); `blurPx`: blur richiesto ora (0 = nessuno). Restituisce lo style animato
 * e il blur da disegnare con la sua opacità (resta montato durante la dissolvenza in uscita).
 */
export function useCssTransition(spec: TransitionSpec | null, opacity: number | undefined, backgroundColor: string | undefined, blurPx: number, transform: ClassTransform | null = null) {
  const op = useRef<Animated.Value | null>(null);
  const tf = useRef<{ values: Record<string, Animated.Value>; last: ClassTransform; style: unknown[] } | null>(null);
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

  // trasformazioni: create solo quando le classi ne danno una diversa dall'identità (un `transition-all` senza
  // scale/rotate non deve coprire le trasformazioni date da altro, es. active:scale-95)
  const tfTarget = spec?.transform && transform ? transform : null;
  // valore del disegno precedente: se la prima trasformazione arriva dopo il montaggio parte da lì
  const tfSeen = useRef(tfTarget);
  if (tfTarget && !tf.current && tfTarget !== IDENTITY_TRANSFORM) {
    const from = tfSeen.current ?? tfTarget;
    const values = Object.fromEntries(TRANSFORM_KEYS.map((k) => [k, new Animated.Value(from[k])]));
    tf.current = {
      values, last: from,
      style: TRANSFORM_KEYS.map((k) => (k === 'rotate'
        ? { rotate: values.rotate.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] }) }
        : { [k]: values[k] })),
    };
  }
  tfSeen.current = tfTarget;
  const tfKey = tfTarget ? TRANSFORM_KEYS.map((k) => tfTarget[k]).join(',') : '';
  useEffect(() => {
    const t = tf.current;
    if (!tfTarget || !t) return;
    const changed = TRANSFORM_KEYS.filter((k) => t.last[k] !== tfTarget[k]);
    t.last = tfTarget;
    if (!changed.length) return;
    const a = Animated.parallel(changed.map((k) => Animated.timing(t.values[k], { toValue: tfTarget[k], duration: spec!.transform, easing: EASE, useNativeDriver: true })));
    a.start();
    return () => a.stop();
  }, [tfKey]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const tfStyle = tfTarget && tf.current ? tf.current.style : null;
  const style: Record<string, unknown> | null = opTarget != null || bgState || tfStyle
    ? {
        ...(opTarget != null && op.current ? { opacity: op.current } : null),
        ...(bgState ? { backgroundColor: bgState.color } : null),
        ...(tfStyle ? { transform: tfStyle } : null),
      }
    : null;
  return {
    style,
    /** blur da disegnare ora (px) e la sua opacità animata (null: nessuna transizione sul blur) */
    blurPx: blurMs ? (blurPx || shownBlur) : blurPx,
    blurOpacity: blurMs ? blur.current?.v ?? null : null,
  };
}
