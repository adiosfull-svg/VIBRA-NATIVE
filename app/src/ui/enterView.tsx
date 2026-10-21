// Contenitori animati all'entrata per i contenuti nei Portal (ui/dialog, ui/menu): vedi useEnterProgress.
// Nei dialog anche l'uscita (usePortalPresence): il contenuto resta montato finché non è sparito.
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, StyleSheet, type ViewStyle } from 'react-native';
import { useEnterProgress } from './anim';

const WEB = Platform.OS === 'web';

type Presence = { layer: Animated.Value; zoom: Animated.Value };
const PresenceContext = createContext<Presence | null>(null);

// curve di tailwindcss-animate: entrata ease-out, uscita `ease` (default delle animation CSS)
const EASE_ENTER = Easing.bezier(0, 0, 0.2, 1);
const EASE_EXIT = Easing.bezier(0.25, 0.1, 0.25, 1);

/**
 * animate-in / animate-out dei dialog di shadcn: all'apertura velo e finestra entrano (150 e 200 ms), alla
 * chiusura escono con le stesse durate e solo dopo il contenuto si smonta (rn-primitives lo toglieva subito:
 * il dialog spariva di colpo). Driver nativo, partito nello stesso giro in cui cambia `open`.
 */
export function usePortalPresence(open: boolean, layerMs = 150, zoomMs = 200) {
  const ref = useRef<Presence | null>(null);
  const p = (ref.current ??= { layer: new Animated.Value(0), zoom: new Animated.Value(0) });
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useEffect(() => {
    if (WEB) {
      if (!open) setMounted(false);
      return;
    }
    if (!mounted) return;
    const to = open ? 1 : 0;
    const easing = open ? EASE_ENTER : EASE_EXIT;
    const anim = Animated.parallel([
      Animated.timing(p.layer, { toValue: to, duration: layerMs, easing, useNativeDriver: true }),
      Animated.timing(p.zoom, { toValue: to, duration: zoomMs, easing, useNativeDriver: true }),
    ]);
    anim.start(({ finished }) => { if (finished && !open) setMounted(false); });
    return () => anim.stop();
  }, [open, mounted, p, layerMs, zoomMs]);
  return { mounted, presence: p };
}

export function PresenceProvider({ value, children }: { value: Presence; children: ReactNode }) {
  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
}

/** Velo + contenuto (tutto lo strato del Portal): dissolvenza, e per i menu lo scivolamento di 8 px dall'alto. */
export function EnterLayer({ children, ms = 150, slide = 0 }: { children: ReactNode; ms?: number; slide?: number }) {
  const presence = useContext(PresenceContext);
  const own = useEnterProgress(WEB || presence ? 0 : ms);
  const v = presence?.layer ?? own;
  const style = useMemo(() => [
    StyleSheet.absoluteFill,
    WEB ? null : {
      opacity: v,
      ...(slide ? { transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [slide, 0] }) }] } : null),
    },
  ], [v, slide]);
  return <Animated.View pointerEvents="box-none" style={style}>{children}</Animated.View>;
}

/** Finestra del dialog: zoom-in-95 / zoom-out-95 (200 ms come duration-200 dell'originale). */
export function EnterZoom({ children, ms = 200, style }: { children: ReactNode; ms?: number; style?: ViewStyle }) {
  const presence = useContext(PresenceContext);
  const own = useEnterProgress(WEB || presence ? 0 : ms);
  const v = presence?.zoom ?? own;
  const animated = useMemo(() => [style, WEB ? null : { transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }], [v, style]);
  return <Animated.View style={animated}>{children}</Animated.View>;
}
