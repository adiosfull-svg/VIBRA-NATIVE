// Animazioni di comparsa/scomparsa equivalenti alle classi CSS dell'app web
// (menu-pop-in/out, backdrop-fade-in/out, transition-transform duration-300).
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

// cubic-bezier(0.22,1,0.36,1) e cubic-bezier(0.4,0,1,1) dell'originale
export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN = Easing.bezier(0.4, 0, 1, 1);

/** progress 0→1 all'apertura e 1→0 alla chiusura; `mounted` resta vero finché l'uscita non finisce. */
export function usePresence(open: boolean, inMs = 160, outMs = 140, easingIn = EASE_OUT, easingOut = EASE_IN) {
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    // apertura: prima si monta il contenuto, l'animazione parte al disegno successivo (prima partiva nello
    // stesso effect e su Android il pannello compariva già quasi opaco, senza la comparsa)
    if (open && !mounted) { setMounted(true); return; }
    const anim = Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: open ? inMs : outMs,
      easing: open ? easingIn : easingOut,
      useNativeDriver: true,
    });
    anim.start(({ finished }) => { if (finished && !open) setMounted(false); });
    return () => anim.stop();
  }, [open, mounted, progress, inMs, outMs, easingIn, easingOut]);
  return { progress, mounted };
}

/**
 * Entrata dei contenuti in un Portal (dialog, popover, menu): `animate-in fade-in-0 zoom-in-95 /
 * slide-in-from-top-2` di shadcn. Il componente si monta all'apertura, quindi l'animazione parte al montaggio
 * (driver nativo). L'uscita resta immediata: rn-primitives smonta il contenuto alla chiusura.
 */
export function useEnterProgress(ms: number) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.bezier(0, 0, 0.2, 1), useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [v, ms]);
  return v;
}
