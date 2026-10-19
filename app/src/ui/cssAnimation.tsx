// animate-spin / animate-pulse di Tailwind sul telefono, con Animated sul driver nativo.
// NativeWind (react-native-css-interop) le esegue con Reanimated: worklet a ogni frame sul thread UI,
// anche nelle schermate nascoste (tab precaricate, pagine sotto nello stack). Misurato sull'emulatore
// (modalità fluidità, VIBRA_SLOW): AnimationFrameQueue/performOperations di Reanimated tra le voci più
// pesanti dopo il montaggio. Qui stessi keyframe e tempi di Tailwind, fermi quando la schermata non è a fuoco.
//   spin:  rotate 0 → 360deg, 1s linear infinite
//   pulse: opacity 1 → .5 → 1, 2s cubic-bezier(.4,0,.6,1) infinite
// animate-bounce / animate-ping (rari, solo in schermate secondarie) restano a NativeWind.
// Inoltre le entrate/uscite una tantum dell'index.css dell'originale (menu-pop-in/out, backdrop-fade-in/out,
// search-*, heatmap-row-in, chart-fs-in): sul telefono non esistevano, i menu comparivano di colpo e in
// chiusura restavano fermi 140 ms prima di sparire.
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useScreenFocused } from './fixedPortal';

type Frame = { opacity?: number; scale?: number; translateX?: number; translateY?: number };
type OneShot = { from: Frame; to: Frame; ms: number; easing: (t: number) => number };

const EASE_OUT_EXPO = Easing.bezier(0.22, 1, 0.36, 1);
const EASE_IN_CSS = Easing.bezier(0.4, 0, 1, 1);
const CSS_EASE_OUT = Easing.bezier(0, 0, 0.58, 1);
const CSS_EASE_IN = Easing.bezier(0.42, 0, 1, 1);

// stessi keyframe, durate e curve dell'index.css dell'originale
const ONE_SHOT: Record<string, OneShot> = {
  'menu-pop-in': { from: { opacity: 0, scale: 0.9, translateY: -6 }, to: { opacity: 1, scale: 1, translateY: 0 }, ms: 160, easing: EASE_OUT_EXPO },
  'menu-pop-out': { from: { opacity: 1, scale: 1, translateY: 0 }, to: { opacity: 0, scale: 0.9, translateY: -6 }, ms: 140, easing: EASE_IN_CSS },
  'backdrop-fade-in': { from: { opacity: 0 }, to: { opacity: 1 }, ms: 160, easing: CSS_EASE_OUT },
  'backdrop-fade-out': { from: { opacity: 1 }, to: { opacity: 0 }, ms: 140, easing: CSS_EASE_IN },
  'search-fade-in': { from: { opacity: 0 }, to: { opacity: 1 }, ms: 180, easing: CSS_EASE_OUT },
  'search-slide-up': { from: { opacity: 0, translateY: 8 }, to: { opacity: 1, translateY: 0 }, ms: 240, easing: EASE_OUT_EXPO },
  'search-tile-in': { from: { opacity: 0, translateY: 8 }, to: { opacity: 1, translateY: 0 }, ms: 220, easing: EASE_OUT_EXPO },
  'heatmap-row-in': { from: { opacity: 0, translateX: -8 }, to: { opacity: 1, translateX: 0 }, ms: 300, easing: EASE_OUT_EXPO },
  'chart-fs-in': { from: { opacity: 0 }, to: { opacity: 1 }, ms: 120, easing: CSS_EASE_OUT },
};

export type CssAnimationKind = 'spin' | 'pulse' | keyof typeof ONE_SHOT;

const NAMES = ['animate-spin', 'animate-pulse', ...Object.keys(ONE_SHOT)].join('|');
const CSS_ANIM = new RegExp(`(?:^|\\s)(${NAMES})(?=\\s|$)`);
const CSS_ANIM_ALL = new RegExp(`(?:^|\\s)(?:${NAMES})(?=\\s|$)`, 'g');

export function cssAnimationOf(className?: string): CssAnimationKind | null {
  if (!className) return null;
  const m = className.match(CSS_ANIM);
  return m ? (m[1].replace(/^animate-/, '') as CssAnimationKind) : null;
}

export function withoutCssAnimation(className: string): string {
  return className.replace(CSS_ANIM_ALL, ' ').trim();
}

const FRAME_DEFAULT: Required<Frame> = { opacity: 1, scale: 1, translateX: 0, translateY: 0 };

/** Entrata/uscita una tantum: parte al montaggio e a ogni cambio di classe (in → out), poi resta sull'arrivo. */
function useOneShot(kind: string | null) {
  const v = useRef(new Animated.Value(0)).current;
  const spec = kind ? ONE_SHOT[kind] : null;
  useEffect(() => {
    if (!spec) return undefined;
    v.setValue(0);
    const a = Animated.timing(v, { toValue: 1, duration: spec.ms, easing: spec.easing, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [spec, v]);
  return useMemo(() => {
    if (!spec) return null;
    const keys = [...new Set([...Object.keys(spec.from), ...Object.keys(spec.to)])] as (keyof Frame)[];
    const at = (k: keyof Frame) => v.interpolate({ inputRange: [0, 1], outputRange: [spec.from[k] ?? FRAME_DEFAULT[k], spec.to[k] ?? FRAME_DEFAULT[k]] });
    const transform = keys.filter((k) => k !== 'opacity').map((k) => ({ [k]: at(k) }));
    return { ...(keys.includes('opacity') ? { opacity: at('opacity') } : null), ...(transform.length ? { transform } : null) };
  }, [spec, v]);
}

const NO_LOOP_CSS = /pulse|all/.test(process.env.EXPO_PUBLIC_TEST_NO_LOOP ?? '');
const PULSE_EASE = Easing.bezier(0.4, 0, 0.6, 1);

/** Stile animato (driver nativo) per spin/pulse; il loop si ferma quando la schermata perde il fuoco. */
export function useCssAnimation(kind: CssAnimationKind) {
  const focused = useScreenFocused();
  const v = useRef(new Animated.Value(0)).current;
  const loop = kind === 'spin' || kind === 'pulse';
  const oneShot = useOneShot(loop ? null : kind);
  useEffect(() => {
    if (!focused || !loop || NO_LOOP_CSS) return undefined;
    v.setValue(0);
    const anim = kind === 'spin'
      ? Animated.loop(Animated.timing(v, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }))
      : Animated.loop(Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 1000, easing: PULSE_EASE, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 1000, easing: PULSE_EASE, useNativeDriver: true }),
      ]));
    anim.start();
    return () => anim.stop();
  }, [focused, kind, loop, v]);
  const loopStyle = useMemo(() => (kind === 'spin'
    ? { transform: [{ rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }
    : { opacity: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) }), [kind, v]);
  return oneShot ?? loopStyle;
}
