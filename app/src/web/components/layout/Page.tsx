// Struttura di pagina di AppLayout.jsx: intestazione in linea + contenuto "main-content p-4"
// (pt 0.5rem) + spazio in fondo per la barra di navigazione (4.5rem + safe area).
import { useFocusEffect } from 'expo-router';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, type ReactNode } from 'react';
import { RefreshControl, ScrollView, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../../ui/cn';
import { Div } from '../../../ui/html';
import { THEME } from '../../../ui/palette.generated';
import AppHeader from './AppHeader';
import { pageScroll } from '../../shims/pageScroll';

type Props = Omit<ScrollViewProps, 'children'> & {
  children?: ReactNode;
  title?: string;
  className?: string;
  onRefresh?: () => Promise<unknown> | void;
  refreshing?: boolean;
};

// Lo scroll di questa pagina fa le veci di quello della finestra nel codice web (shims/pageScroll).
const Page = forwardRef<ScrollView, Props>(({ children, title, className, onRefresh, refreshing = false, onScroll, onContentSizeChange, ...props }, ref) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  useImperativeHandle(ref, () => scrollRef.current as ScrollView);
  const handle = useRef<ReturnType<typeof pageScroll.register> | null>(null);
  useEffect(() => {
    const h = pageScroll.register((y, animated) => scrollRef.current?.scrollTo({ y, animated }));
    handle.current = h;
    return () => h.unregister();
  }, []);
  useFocusEffect(useCallback(() => { handle.current?.focus(); }, []));
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    handle.current?.report(e.nativeEvent.contentOffset.y);
    onScroll?.(e);
  }, [onScroll]);
  const handleContentSize = useCallback((w: number, h: number) => {
    handle.current?.setContentHeight(h);
    onContentSizeChange?.(w, h);
  }, [onContentSizeChange]);
  return (
    <ScrollView
      ref={scrollRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onContentSizeChange={handleContentSize}
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}
      keyboardShouldPersistTaps="handled"
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME['accent-foreground']} /> : undefined}
      {...props}
    >
      <AppHeader title={title} />
      <Div className={cn('p-4 pt-2', className)}>{children}</Div>
    </ScrollView>
  );
});
Page.displayName = 'Page';
export default Page;
