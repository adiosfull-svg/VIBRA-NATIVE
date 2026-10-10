// Strati della pagina sul telefono: position: sticky e backdrop-filter del CSS.
//
// sticky: in RN non esiste. Page (web/components/layout/Page.tsx) dà lo scroll come Animated.Value
// (driver nativo) e un elemento `sticky` si sposta in giù quanto serve per restare a `top` dal bordo
// della pagina: stesso effetto del CSS, calcolato sul thread della UI (niente scatti).
//
// blur: su Android expo-blur sfoca solo con blurMethod "dimezis" e un BlurTargetView, il contenuto
// da sfocare, che NON può contenere la BlurView stessa (Dimezis BlurView 3). Quindi:
//  - nav bar e overlay alla radice: il bersaglio è la pagina in primo piano (Page la avvolge);
//  - barra sticky: il bersaglio sono i fratelli che la seguono (ciò che le scorre sotto), che il
//    contenitore raccoglie in un BlurTargetView (StickySplit).
// Altrove (blur dentro la pagina) resta il velo semitrasparente di prima.
import { BlurTargetView, BlurView } from 'expo-blur';
import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from 'react';
import { Animated, Platform, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacingPx } from './webClasses';

// ── scroll della pagina per gli sticky ───────────────────────────────────────
export type PageLayer = {
  /** contentOffset.y dello ScrollView (Animated.event col driver nativo) */
  scrollY: Animated.Value;
  /** posizione y di un elemento nel contenuto della pagina (null se non misurabile) */
  offsetOf: (el: unknown) => number | null;
  /** avvisa quando cambia l'altezza del contenuto (gli sticky rimisurano la loro posizione) */
  onContentChange: (fn: () => void) => () => void;
};
export const PageLayerContext = createContext<PageLayer | null>(null);

const STICKY = /(^|\s)sticky(\s|$)/;
export const isNativeSticky = (className?: string) => Platform.OS !== 'web' && !!className && STICKY.test(className);

/** top-[env(safe-area-inset-top)] / top-0 / top-N / top-[Npx|Nrem] → px dal bordo della pagina. */
export function stickyTop(className: string, insetTop: number): number {
  const m = className.match(/(?:^|\s)top-(\S+)/);
  if (!m) return 0;
  const v = m[1];
  if (v.includes('safe-area-inset-top')) return insetTop;
  const arb = v.match(/^\[(-?[\d.]+)(px|rem)\]$/);
  if (arb) return Number(arb[1]) * (arb[2] === 'rem' ? 16 : 1);
  return spacingPx(v);
}

/**
 * translateY che tiene l'elemento a `top` dal bordo della pagina quando lo scroll lo porterebbe
 * più su. ref va dato all'elemento; onLayout rimisura la sua posizione nel contenuto.
 */
export function useStickyPin(className: string) {
  const layer = useContext(PageLayerContext);
  const insets = useSafeAreaInsets();
  const top = stickyTop(className, insets.top);
  const ref = useRef<View>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const measure = useCallback(() => {
    const y = layer?.offsetOf(ref.current);
    if (y != null) setOffset((o) => (o != null && Math.abs(o - y) < 0.5 ? o : y));
  }, [layer]);
  useEffect(() => layer?.onContentChange(measure), [layer, measure]);
  const onLayout = useCallback((_e: LayoutChangeEvent) => measure(), [measure]);
  if (!layer || offset == null) return { ref, onLayout, style: null };
  const start = offset - top;
  const translateY = layer.scrollY.interpolate({ inputRange: [start, start + 1], outputRange: [0, 1], extrapolateLeft: 'clamp', extrapolateRight: 'extend' });
  return { ref, onLayout, style: { transform: [{ translateY }] } };
}

// ── bersagli del blur ────────────────────────────────────────────────────────
/** Bersaglio della barra sticky: i fratelli che la seguono (StickySplit). */
export const StickyBlurTargetContext = createContext<View | null>(null);

type PageTarget = { el: View | null };
const pageTargets: PageTarget[] = [];
const targetListeners = new Set<() => void>();
const notify = () => targetListeners.forEach((fn) => fn());

/** Page: registra il proprio BlurTargetView; focus() quando torna in primo piano. */
export function registerPageBlurTarget() {
  const t: PageTarget = { el: null };
  pageTargets.push(t);
  return {
    set(el: View | null) { if (t.el !== el) { t.el = el; if (pageTargets[pageTargets.length - 1] === t) notify(); } },
    focus() {
      const i = pageTargets.indexOf(t);
      if (i >= 0 && i !== pageTargets.length - 1) { pageTargets.splice(i, 1); pageTargets.push(t); notify(); }
    },
    unregister() {
      const i = pageTargets.indexOf(t);
      if (i >= 0) { pageTargets.splice(i, 1); notify(); }
    },
  };
}

const topTarget = () => pageTargets[pageTargets.length - 1]?.el ?? null;
const subscribe = (fn: () => void) => { targetListeners.add(fn); return () => { targetListeners.delete(fn); }; };

/** Contenuto della pagina in primo piano (per ciò che sta fuori dalla pagina: nav bar, overlay). */
export function usePageBlurTarget(): View | null {
  return useSyncExternalStore(subscribe, topTarget, topTarget);
}

// Android: blur vero solo da Android 12 (prima Dimezis è lento: velo come prima).
// EXPO_PUBLIC_TEST_NO_BLUR=1 (solo build di test sull'emulatore): sempre velo.
const BLUR_METHOD = process.env.EXPO_PUBLIC_TEST_NO_BLUR === '1' ? 'none' as const : 'dimezisBlurViewSdk31Plus' as const;

/** BlurView di expo-blur col bersaglio giusto (vedi in cima). */
export function NativeBlur({ intensity, tint = 'dark', target, style }: { intensity: number; tint?: 'dark' | 'default'; target: View | null; style?: object }) {
  // expo-blur legge blurTarget.current al montaggio e quando cambia: un oggetto nuovo per bersaglio
  const blurTarget = useRef<{ current: View | null }>({ current: null });
  if (blurTarget.current.current !== target) blurTarget.current = { current: target };
  return (
    <BlurView
      pointerEvents="none"
      intensity={intensity}
      tint={tint}
      blurMethod={target ? BLUR_METHOD : 'none'}
      blurTarget={target ? (blurTarget.current as RefObject<View | null>) : undefined}
      style={style ?? StyleSheet.absoluteFill}
    />
  );
}

/**
 * Contenitore con un figlio `sticky` (telefono): i fratelli dopo la barra vanno in un BlurTargetView
 * (colonna con lo stesso gap del contenitore), bersaglio del blur della barra.
 */
export function StickySplit({ before, sticky, after, gap }: { before: ReactNode[]; sticky: ReactNode; after: ReactNode[]; gap: number }) {
  const [target, setTarget] = useState<View | null>(null);
  return (
    <>
      {before}
      <StickyBlurTargetContext.Provider value={target}>{sticky}</StickyBlurTargetContext.Provider>
      {after.length ? <BlurTargetView ref={setTarget as never} style={{ rowGap: gap }}>{after}</BlurTargetView> : null}
    </>
  );
}
