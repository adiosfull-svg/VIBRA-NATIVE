// animate-spin / animate-pulse di Tailwind sul telefono, con Animated sul driver nativo.
// NativeWind (react-native-css-interop) le esegue con Reanimated: worklet a ogni frame sul thread UI,
// anche nelle schermate nascoste (tab precaricate, pagine sotto nello stack). Misurato sull'emulatore
// (modalità fluidità, VIBRA_SLOW): AnimationFrameQueue/performOperations di Reanimated tra le voci più
// pesanti dopo il montaggio. Qui stessi keyframe e tempi di Tailwind, fermi quando la schermata non è a fuoco.
//   spin:  rotate 0 → 360deg, 1s linear infinite
//   pulse: opacity 1 → .5 → 1, 2s cubic-bezier(.4,0,.6,1) infinite
// animate-bounce / animate-ping (rari, solo in schermate secondarie) restano a NativeWind.
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useScreenFocused } from './fixedPortal';

export type CssAnimationKind = 'spin' | 'pulse';

const CSS_ANIM = /(?:^|\s)animate-(spin|pulse)(?=\s|$)/;
const CSS_ANIM_ALL = /(?:^|\s)animate-(?:spin|pulse)(?=\s|$)/g;

export function cssAnimationOf(className?: string): CssAnimationKind | null {
  if (!className) return null;
  const m = className.match(CSS_ANIM);
  return m ? (m[1] as CssAnimationKind) : null;
}

export function withoutCssAnimation(className: string): string {
  return className.replace(CSS_ANIM_ALL, ' ').trim();
}

const PULSE_EASE = Easing.bezier(0.4, 0, 0.6, 1);

/** Stile animato (driver nativo) per spin/pulse; il loop si ferma quando la schermata perde il fuoco. */
export function useCssAnimation(kind: CssAnimationKind) {
  const focused = useScreenFocused();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!focused) return undefined;
    v.setValue(0);
    const anim = kind === 'spin'
      ? Animated.loop(Animated.timing(v, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }))
      : Animated.loop(Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 1000, easing: PULSE_EASE, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 1000, easing: PULSE_EASE, useNativeDriver: true }),
      ]));
    anim.start();
    return () => anim.stop();
  }, [focused, kind, v]);
  return useMemo(() => (kind === 'spin'
    ? { transform: [{ rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }
    : { opacity: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) }), [kind, v]);
}
