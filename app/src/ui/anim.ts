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
    if (open) setMounted(true);
    const anim = Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: open ? inMs : outMs,
      easing: open ? easingIn : easingOut,
      useNativeDriver: true,
    });
    anim.start(({ finished }) => { if (finished && !open) setMounted(false); });
    return () => anim.stop();
  }, [open, progress, inMs, outMs, easingIn, easingOut]);
  return { progress, mounted };
}
