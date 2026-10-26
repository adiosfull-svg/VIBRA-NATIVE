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
import { Component, createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from 'react';
import { Animated, PixelRatio, Platform, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacingPx } from './webClasses';
import { THEME } from './palette.generated';
import { useScreenNavigation } from '../web/screenNavigation';
import { TEST_DIAG } from '../lib/testDiag';

// ── scroll della pagina per gli sticky ───────────────────────────────────────
export type PageLayer = {
  /** contentOffset.y dello ScrollView (Animated.event col driver nativo) */
  scrollY: Animated.Value;
  /** posizione y di un elemento nel contenuto della pagina (null se non misurabile) */
  offsetOf: (el: unknown) => number | null;
  /** avvisa quando cambia l'altezza del contenuto (gli sticky rimisurano la loro posizione) */
  onContentChange: (fn: () => void) => () => void;
  /** scroll di QUESTA pagina (valore e ascolto): con le tab montate quello globale è della pagina visibile */
  y: () => number;
  viewportHeight: () => number;
  onScroll: (fn: () => void) => () => void;
  /** pull-to-refresh della pagina (RefreshControl nativo dello ScrollView): null per toglierlo */
  setRefreshHandler: (fn: (() => Promise<unknown> | void) | null) => void;
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
  const nav = useScreenNavigation();
  // Da pagina nascosta (tab precaricata) measureLayout dà una posizione sbagliata (0): la barra partiva già
  // traslata dell'altezza della barra di stato, con un buco sopra e il contenuto sotto coperto, e nessuno
  // la rimisurava (il suo layout non cambia più). Da nascosta non si misura; si misura al focus.
  const measure = useCallback(() => {
    try { if (nav?.isFocused && !nav.isFocused()) return; } catch { /* fuori da un navigatore */ }
    const y = layer?.offsetOf(ref.current);
    if (TEST_DIAG) console.log(`VIBRA sticky ${className.slice(0, 40)} layer=${!!layer} el=${!!ref.current} y=${y}`);
    if (y != null) setOffset((o) => (o != null && Math.abs(o - y) < 0.5 ? o : y));
  }, [layer, nav, className]);
  useEffect(() => layer?.onContentChange(measure), [layer, measure]);
  useEffect(() => {
    if (!nav?.addListener) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const off = nav.addListener('focus', () => {
      measure();
      // il primo disegno dopo il focus può cambiare ancora l'altezza di ciò che sta sopra
      if (t) clearTimeout(t);
      t = setTimeout(measure, 300);
    });
    return () => { off(); if (t) clearTimeout(t); };
  }, [nav, measure]);
  const onLayout = useCallback((_e: LayoutChangeEvent) => measure(), [measure]);
  if (!layer || offset == null) return { ref, onLayout, style: null };
  const start = offset - top;
  const translateY = layer.scrollY.interpolate({ inputRange: [start, start + 1], outputRange: [0, 1], extrapolateLeft: 'clamp', extrapolateRight: 'extend' });
  return { ref, onLayout, style: { transform: [{ translateY }] } };
}

// ── bersagli del blur ────────────────────────────────────────────────────────
/** Bersaglio della barra sticky: i fratelli che la seguono (StickySplit). */
export const StickyBlurTargetContext = createContext<View | null>(null);
/**
 * Bersaglio troppo alto per sfocarlo: Dimezis (RenderNodeBlurController) dà al nodo del blur la
 * dimensione di TUTTO il bersaglio; oltre il limite delle texture della GPU il blur non si disegna e
 * restava solo il velo al 30% (in Clienti, ~44.000 px, si leggevano le righe attraverso la barra).
 */
export const StickyBlurTooTallContext = createContext(false);
const MAX_BLUR_TARGET_PX = 8192;

type PageTarget = { el: View | null };
const pageTargets: PageTarget[] = [];
const targetListeners = new Set<() => void>();
const notify = () => targetListeners.forEach((fn) => fn());

/** Page: registra il proprio BlurTargetView; focus() quando torna in primo piano. */
export function registerPageBlurTarget(front = true) {
  const t: PageTarget = { el: null };
  // una pagina montata senza focus (tab precaricata) va in fondo: resta bersaglio quella visibile
  if (front) pageTargets.push(t); else pageTargets.unshift(t);
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

// Blur vero spento (23/10): sui telefoni veri Dimezis ridisegna e sfoca la pagina a ogni fotogramma e, con
// la pagina avvolta nel suo bersaglio, rende più caro ogni disegno. Test Lab con e senza (run 39703039384 →
// 39882323979, stesso percorso): Pixel 8 Pro frame persi 10,9% → 3,1% (mediana 10,9 → 8,1 ms, schermo a
// 120 Hz = 8,3 ms), Galaxy S24 28,1% → 23,4%. Al posto del vetro un velo col colore della pagina (come
// prima del blur); niente BlurTargetView attorno alle pagine. Per riprovarlo: LIVE_BLUR = true.
export const LIVE_BLUR = false;
const BLUR_METHOD = LIVE_BLUR && process.env.EXPO_PUBLIC_TEST_NO_BLUR !== '1' ? 'dimezisBlurViewSdk31Plus' as const : 'none' as const;

/** Contenitore che il blur può sfocare (BlurTargetView); senza blur vero una View semplice. */
export const BlurTarget = (LIVE_BLUR ? BlurTargetView : View) as typeof View;

/**
 * Errore dentro BlurView (es. "Unable to find node on an unmounted component": il bersaglio è la pagina
 * appena smontata, prima che il registro passi alla nuova): niente blur per quel momento (resta il velo)
 * invece della schermata d'errore dell'app; si riprova al bersaglio successivo.
 */
class BlurGuard extends Component<{ target: unknown; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidUpdate(prev: { target: unknown }) {
    if (this.state.failed && prev.target !== this.props.target) this.setState({ failed: false });
  }
  render() { return this.state.failed ? null : this.props.children; }
}

/** BlurView di expo-blur col bersaglio giusto (vedi in cima). */
export function NativeBlur(props: { intensity: number; tint?: 'dark' | 'default'; target: View | null; style?: object; veil?: number }) {
  // senza blur vero: velo col colore della pagina (opacità `veil`), il contenuto sotto resta appena visibile
  if (!LIVE_BLUR) return <View pointerEvents="none" style={[props.style ?? StyleSheet.absoluteFill, { backgroundColor: PAGE_BG, opacity: props.veil ?? 0.7 }]} />;
  return <BlurGuard target={props.target}><NativeBlurInner {...props} /></BlurGuard>;
}
const PAGE_BG = THEME.background;

function NativeBlurInner({ intensity, tint = 'dark', target, style }: { intensity: number; tint?: 'dark' | 'default'; target: View | null; style?: object }) {
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
  const [tooTall, setTooTall] = useState(false);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setTooTall(e.nativeEvent.layout.height * PixelRatio.get() > MAX_BLUR_TARGET_PX);
  }, []);
  return (
    <>
      {before}
      <StickyBlurTooTallContext.Provider value={tooTall}>
        <StickyBlurTargetContext.Provider value={tooTall ? null : target}>{sticky}</StickyBlurTargetContext.Provider>
      </StickyBlurTooTallContext.Provider>
      {after.length ? <BlurTarget ref={setTarget as never} onLayout={onLayout} style={{ rowGap: gap }}>{after}</BlurTarget> : null}
    </>
  );
}
