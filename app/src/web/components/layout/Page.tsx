// Struttura di pagina di AppLayout.jsx: intestazione in linea + contenuto "main-content p-4"
// (pt 0.5rem) + spazio in fondo per la barra di navigazione (4.5rem + safe area).

import { forwardRef, startTransition, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, RefreshControl, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../../ui/cn';
import { Div } from '../../../ui/html';
import { THEME } from '../../../ui/palette.generated';
import AppHeader from './AppHeader';
import { pageScroll } from '../../shims/pageScroll';
import { OwnPathProvider, useScreenNavigation } from '../../router';
import { diagCount, diagMark, diagTime, dumpLayout, TEST_DIAG, useDiagWhy } from '../../../lib/testDiag';
import { BlurTarget, PageLayerContext, registerPageBlurTarget, type PageLayer } from '../../../ui/pageLayers';
import { useAnimatedRef } from 'react-native-reanimated';
import { FastScroll, useMergedScrollRef, type FastScrollHandle } from '../../../ui/fastScroll';
import { haptic } from '../../../ui/haptics';

type Props = Omit<ScrollViewProps, 'children'> & {
  children?: ReactNode;
  title?: string;
  className?: string;
  onRefresh?: () => Promise<unknown> | void;
  refreshing?: boolean;
};

// Lo scroll di questa pagina fa le veci di quello della finestra nel codice web (shims/pageScroll).
// Sul telefono dà anche lo scroll animato agli elementi sticky e il bersaglio del blur della nav
// bar (ui/pageLayers): la pagina è avvolta in un BlurTargetView.
const NATIVE_DRIVER = Platform.OS !== 'web';
let pageSeq = 0;

const Page = forwardRef<ScrollView, Props>(({ children, title, className, onRefresh, refreshing = false, onScroll, onContentSizeChange, onLayout, ...props }, ref) => {
  diagMark('Page render');
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  useImperativeHandle(ref, () => scrollRef.current as ScrollView);
  // scorrimento veloce col pollice (MobileFastScroll dell'originale, ui/fastScroll): sul thread UI
  const animatedScrollRef = useAnimatedRef<ScrollView>();
  const setScrollRef = useMergedScrollRef(scrollRef, animatedScrollRef);
  const fastScroll = useRef<FastScrollHandle | null>(null);
  const handle = useRef<ReturnType<typeof pageScroll.register> | null>(null);
  const blurHandle = useRef<ReturnType<typeof registerPageBlurTarget> | null>(null);
  const contentListeners = useRef(new Set<() => void>()).current;
  const scrollListeners = useRef(new Set<() => void>()).current;
  const own = useRef({ y: 0, viewportHeight: 0, contentHeight: 0 }).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  // contesto stabile dello schermo (useNavigation/useFocusEffect di expo-router ridisegnavano la Page a
  // ogni navigazione, anche delle altre tab)
  const navigation = useScreenNavigation();
  // Pagina precaricata (montata senza focus, lib/preloadRoutes): il contenuto si monta in una transition,
  // che React esegue a pezzi cedendo il passo ai tocchi. Prima il montaggio di una tab (1-2 mila elementi)
  // bloccava il JS per secondi subito dopo l'avvio: un tocco in quel momento non rispondeva.
  // Se la pagina prende il focus prima che la transition finisca, si monta subito (aggiornamento urgente).
  // Pagina dello stack aperta ora (Locali, profilo promoter...): il primo disegno ha solo l'intestazione, così
  // la pagina comincia subito a entrare scorrendo (animazione nativa, Stack del layout) e il contenuto si
  // monta durante lo scorrimento. Prima il tocco aspettava il montaggio di tutta la pagina (fino a 3-4 s).
  const [slideIn] = useState(() => {
    if (!NATIVE_DRIVER) return false;
    try { return !!navigation?.isFocused?.() && navigation?.getState?.()?.type === 'stack'; } catch { return false; }
  });
  const [contentReady, setContentReady] = useState(() => {
    if (slideIn) return false;
    try { return navigation?.isFocused?.() ?? true; } catch { return true; }
  });
  useEffect(() => {
    if (contentReady) return;
    startTransition(() => setContentReady(true));
    if (slideIn) return;
    return navigation?.addListener?.('focus', () => setContentReady(true));
  }, [contentReady, navigation, slideIn]);
  // pull-to-refresh chiesto dal contenuto (hooks/usePullToRefresh.native): RefreshControl nativo,
  // gesto e animazione sul thread UI (docs/REGOLE-PRESTAZIONI.md §5)
  const pageRefresh = useRef<(() => Promise<unknown> | void) | null>(null);
  const [hasPageRefresh, setHasPageRefresh] = useState(false);
  const [pageRefreshing, setPageRefreshing] = useState(false);
  // vibrazione quando il gesto di aggiorna scatta (come le liste native)
  const runPageRefresh = useCallback(async () => {
    haptic.light();
    setPageRefreshing(true);
    try { await pageRefresh.current?.(); } finally { setPageRefreshing(false); }
  }, []);
  useEffect(() => {
    // tab precaricata (montata in background): in fondo agli stack finché non prende il focus
    let front = true;
    try { front = navigation?.isFocused?.() ?? true; } catch { /* fuori da un navigatore */ }
    const h = pageScroll.register(
      (y, animated) => scrollRef.current?.scrollTo({ y, animated }),
      () => (scrollRef.current as unknown as { getInnerViewRef?: () => unknown } | null)?.getInnerViewRef?.() ?? null,
      front,
    );
    handle.current = h;
    const b = registerPageBlurTarget(front);
    blurHandle.current = b;
    // il ref del BlurTargetView arriva PRIMA di questo effect: senza questo la nav bar restava senza
    // bersaglio (niente blur, solo il velo)
    b.set(blurEl.current);
    return () => { h.unregister(); b.unregister(); blurHandle.current = null; };
  }, []);
  useEffect(() => {
    let diagTimer: ReturnType<typeof setTimeout> | null = null;
    const onFocus = () => {
      handle.current?.focus(); blurHandle.current?.focus();
      // diagnostica dell'emulatore: radiografia del layout della pagina dopo il caricamento
      if (!TEST_DIAG) return;
      if (diagTimer) clearTimeout(diagTimer);
      diagTimer = setTimeout(() => dumpLayout(title ?? 'pagina', (scrollRef.current as unknown as { getInnerViewRef?: () => unknown } | null)?.getInnerViewRef?.()), 9000);
    };
    let focused = true;
    try { focused = navigation?.isFocused?.() ?? true; } catch { /* fuori da un navigatore */ }
    if (focused) onFocus();
    const off = navigation?.addListener?.('focus', onFocus);
    return () => { off?.(); if (diagTimer) clearTimeout(diagTimer); };
  }, [navigation, title]);
  // diagnostica: montaggi e smontaggi delle pagine (un rimontaggio ridisegna tutto il contenuto)
  useEffect(() => {
    if (!TEST_DIAG) return;
    const id = ++pageSeq;
    diagMark(`Page monta ${id} ${title ?? ''}`);
    return () => diagMark(`Page smonta ${id} ${title ?? ''}`);
  }, [title]);
  useDiagWhy(`Page ${title ?? ''}`, { children, insets, contentReady, hasPageRefresh, pageRefreshing, navigation, onScroll, onRefresh });
  const blurEl = useRef<View | null>(null);
  const setBlurTarget = useCallback((el: View | null) => { blurEl.current = el; blurHandle.current?.set(el); }, []);
  const layer = useMemo<PageLayer>(() => ({
    scrollY,
    // rispetto al contenuto di QUESTA pagina (con le tab ne sono montate più d'una e quella "in
    // primo piano" cambia solo dopo il layout: la barra sticky si misurava sulla pagina sbagliata)
    offsetOf: (el) => pageScroll.offsetIn(el, (scrollRef.current as unknown as { getInnerViewRef?: () => unknown } | null)?.getInnerViewRef?.()),
    onContentChange: (fn) => { contentListeners.add(fn); return () => { contentListeners.delete(fn); }; },
    y: () => own.y,
    viewportHeight: () => own.viewportHeight,
    onScroll: (fn) => { scrollListeners.add(fn); return () => { scrollListeners.delete(fn); }; },
    setRefreshHandler: (fn) => { pageRefresh.current = fn; setHasPageRefresh(!!fn); },
  }), [scrollY, contentListeners, scrollListeners, own]);
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    own.y = e.nativeEvent.contentOffset.y;
    const t0 = TEST_DIAG ? Date.now() : 0;
    handle.current?.report(own.y);
    const t1 = TEST_DIAG ? Date.now() : 0;
    scrollListeners.forEach((fn) => fn());
    if (TEST_DIAG) { diagTime('scroll-globale', t1 - t0); diagTime('scroll-pagina', Date.now() - t1); diagCount('evento-scroll'); }
    onScroll?.(e);
  }, [onScroll, own, scrollListeners]);
  const animatedScroll = useMemo(
    () => Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: NATIVE_DRIVER, listener: handleScroll }),
    [scrollY, handleScroll],
  );
  const handleContentSize = useCallback((w: number, h: number) => {
    handle.current?.setContentHeight(h);
    own.contentHeight = h;
    fastScroll.current?.setMetrics(h, own.viewportHeight);
    contentListeners.forEach((fn) => fn());
    onContentSizeChange?.(w, h);
  }, [onContentSizeChange, contentListeners, own]);
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    handle.current?.setViewportHeight(e.nativeEvent.layout.height);
    if (own.viewportHeight !== e.nativeEvent.layout.height) {
      own.viewportHeight = e.nativeEvent.layout.height;
      fastScroll.current?.setMetrics(own.contentHeight, own.viewportHeight);
      scrollListeners.forEach((fn) => fn());
    }
    onLayout?.(e);
  }, [onLayout, own, scrollListeners]);
  // Android: con `refreshControl` la ScrollView è avvolta in uno SwipeRefreshLayout (su iOS il controllo è
  // un figlio in più): se il controllo compare DOPO il primo disegno (usePullToRefresh lo registra in un
  // effect) la radice dell'albero cambia tipo e React smonta e rimonta TUTTO il contenuto della pagina.
  // Serate, Semine e Promoter si montavano due volte a ogni apertura (il doppio del tempo e dei disegni).
  // Sul telefono il controllo c'è sempre, abilitato solo quando una pagina registra un handler.
  const runPropRefresh = useCallback(() => { haptic.light(); return onRefresh?.(); }, [onRefresh]);
  const refreshHandler = onRefresh ? runPropRefresh : (hasPageRefresh ? runPageRefresh : null);
  const isRefreshing = !!refreshHandler && (onRefresh ? refreshing : pageRefreshing);
  const refreshControl = Platform.OS === 'web'
    ? (refreshHandler ? <RefreshControl refreshing={isRefreshing} onRefresh={refreshHandler} tintColor={THEME['accent-foreground']} /> : undefined)
    : <RefreshControl enabled={!!refreshHandler} refreshing={isRefreshing} onRefresh={refreshHandler ?? undefined} tintColor={THEME['accent-foreground']} progressBackgroundColor={THEME.card} colors={[THEME.primary]} />;
  return (
    <BlurTarget ref={setBlurTarget as never} style={{ flex: 1, backgroundColor: THEME.background }}>
      <Animated.ScrollView
        ref={setScrollRef}
        onLayout={handleLayout}
        onScroll={animatedScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSize}
        style={{ flex: 1, backgroundColor: THEME.background }}
        contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
        {...(TEST_DIAG ? PAGE_DIAG : null)}
        {...props}
      >
        <OwnPathProvider>
          <PageLayerContext.Provider value={layer}>
            <AppHeader title={title} />
            <Div className={cn('p-4 pt-2', className)}>{contentReady ? children : null}</Div>
          </PageLayerContext.Provider>
        </OwnPathProvider>
      </Animated.ScrollView>
      {Platform.OS !== 'web' && <FastScroll ref={fastScroll} scrollRef={animatedScrollRef} />}
    </BlurTarget>
  );
});
Page.displayName = 'Page';
// build di test: la ScrollView della pagina che prende il tocco (a un pulsante non arriva il tap)
const PAGE_DIAG = {
  onResponderGrant: () => console.log('VIBRA pagina prende-il-tocco'),
  onResponderTerminate: () => console.log('VIBRA pagina perde-il-tocco'),
};
export default Page;
