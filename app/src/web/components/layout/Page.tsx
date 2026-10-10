// Struttura di pagina di AppLayout.jsx: intestazione in linea + contenuto "main-content p-4"
// (pt 0.5rem) + spazio in fondo per la barra di navigazione (4.5rem + safe area).
import { useFocusEffect } from 'expo-router';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, type ReactNode } from 'react';
import { Animated, Platform, RefreshControl, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../../ui/cn';
import { Div } from '../../../ui/html';
import { THEME } from '../../../ui/palette.generated';
import AppHeader from './AppHeader';
import { pageScroll } from '../../shims/pageScroll';
import { dumpLayout, TEST_DIAG } from '../../../lib/testDiag';
import { BlurTargetView } from 'expo-blur';
import { PageLayerContext, registerPageBlurTarget, type PageLayer } from '../../../ui/pageLayers';

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

const Page = forwardRef<ScrollView, Props>(({ children, title, className, onRefresh, refreshing = false, onScroll, onContentSizeChange, onLayout, ...props }, ref) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  useImperativeHandle(ref, () => scrollRef.current as ScrollView);
  const handle = useRef<ReturnType<typeof pageScroll.register> | null>(null);
  const blurHandle = useRef<ReturnType<typeof registerPageBlurTarget> | null>(null);
  const contentListeners = useRef(new Set<() => void>()).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const h = pageScroll.register(
      (y, animated) => scrollRef.current?.scrollTo({ y, animated }),
      () => (scrollRef.current as unknown as { getInnerViewRef?: () => unknown } | null)?.getInnerViewRef?.() ?? null,
    );
    handle.current = h;
    const b = registerPageBlurTarget();
    blurHandle.current = b;
    return () => { h.unregister(); b.unregister(); blurHandle.current = null; };
  }, []);
  useFocusEffect(useCallback(() => {
    handle.current?.focus(); blurHandle.current?.focus();
    // diagnostica dell'emulatore: radiografia del layout della pagina dopo il caricamento
    if (!TEST_DIAG) return;
    const t = setTimeout(() => dumpLayout(title ?? 'pagina', (scrollRef.current as unknown as { getInnerViewRef?: () => unknown } | null)?.getInnerViewRef?.()), 9000);
    return () => clearTimeout(t);
  }, [title]));
  const setBlurTarget = useCallback((el: View | null) => { blurHandle.current?.set(el); }, []);
  const layer = useMemo<PageLayer>(() => ({
    scrollY,
    offsetOf: (el) => pageScroll.offsetOf(el),
    onContentChange: (fn) => { contentListeners.add(fn); return () => { contentListeners.delete(fn); }; },
  }), [scrollY, contentListeners]);
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    handle.current?.report(e.nativeEvent.contentOffset.y);
    onScroll?.(e);
  }, [onScroll]);
  const animatedScroll = useMemo(
    () => Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: NATIVE_DRIVER, listener: handleScroll }),
    [scrollY, handleScroll],
  );
  const handleContentSize = useCallback((w: number, h: number) => {
    handle.current?.setContentHeight(h);
    contentListeners.forEach((fn) => fn());
    onContentSizeChange?.(w, h);
  }, [onContentSizeChange, contentListeners]);
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    handle.current?.setViewportHeight(e.nativeEvent.layout.height);
    onLayout?.(e);
  }, [onLayout]);
  return (
    <BlurTargetView ref={setBlurTarget as never} style={{ flex: 1, backgroundColor: THEME.background }}>
      <Animated.ScrollView
        ref={scrollRef}
        onLayout={handleLayout}
        onScroll={animatedScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSize}
        style={{ flex: 1, backgroundColor: THEME.background }}
        contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME['accent-foreground']} /> : undefined}
        {...props}
      >
        <PageLayerContext.Provider value={layer}>
          <AppHeader title={title} />
          <Div className={cn('p-4 pt-2', className)}>{children}</Div>
        </PageLayerContext.Provider>
      </Animated.ScrollView>
    </BlurTargetView>
  );
});
Page.displayName = 'Page';
export default Page;
