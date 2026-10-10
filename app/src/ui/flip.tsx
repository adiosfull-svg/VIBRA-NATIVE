// Card che si gira (classi semina-flip-* dell'index.css) sul telefono. Sul web le regole CSS vere
// (customCss.web.ts: preserve-3d, backface-visibility, retro ruotato) bastano; in RN la rotazione
// del contenitore non nasconde la faccia girata, quindi ruotano le due facce: davanti rotateY(r),
// dietro rotateY(r + 180), entrambe con backfaceVisibility hidden e la prospettiva di 1200px.
import { createContext, useContext, useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';

type Flip = { deg: number; animate: boolean };
export const FlipContext = createContext<Flip | null>(null);

const FACE = /(^|\s)semina-flip-(front|back)(\s|$)/;
const INNER = /(^|\s)semina-flip-inner(\s|$)/;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** semina-flip-inner (solo telefono): rotateY dello style → contesto per le facce, niente transform proprio. */
export function flipInner(className: string | undefined, style: Record<string, any> | undefined, rawStyle: unknown): { flip: Flip; style: Record<string, any> } | null {
  if (Platform.OS === 'web' || !className || !INNER.test(className)) return null;
  const t = Array.isArray(style?.transform) ? style!.transform : [];
  const rot = t.find((x: Record<string, unknown>) => 'rotateY' in x)?.rotateY;
  const deg = typeof rot === 'string' ? parseFloat(rot) : 0;
  const raw = rawStyle && typeof rawStyle === 'object' && !Array.isArray(rawStyle) ? (rawStyle as { transition?: unknown }).transition : undefined;
  const { transform: _t, ...rest } = style ?? {};
  return { flip: { deg, animate: raw !== 'none' }, style: rest };
}

/** Stile animato di una faccia (semina-flip-front/back) dentro un semina-flip-inner, o null. */
export function useFlipFace(className: string | undefined) {
  const flip = useContext(FlipContext);
  const kind = className?.match(FACE)?.[2] as 'front' | 'back' | undefined;
  // l'Animated.Value serve solo alle facce: niente allocazione a ogni render di ogni Div
  const ref = useRef<Animated.Value | null>(null);
  if (kind && !ref.current) ref.current = new Animated.Value(flip?.deg ?? 0);
  const value = ref.current;
  const deg = flip?.deg ?? 0;
  const animate = flip?.animate ?? false;
  useEffect(() => {
    if (!kind || !value) return;
    if (!animate) { value.setValue(deg); return; }
    const a = Animated.timing(value, { toValue: deg, duration: 400, easing: EASE, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [deg, animate, kind, value]);
  if (!flip || !kind || !value) return null;
  const offset = kind === 'back' ? 180 : 0;
  const rotateY = value.interpolate({ inputRange: [-360, 360], outputRange: [`${-360 + offset}deg`, `${360 + offset}deg`] });
  return [
    kind === 'back' ? StyleSheet.absoluteFill : null,
    { backfaceVisibility: 'hidden' as const, transform: [{ perspective: 1200 }, { rotateY }] },
  ];
}
