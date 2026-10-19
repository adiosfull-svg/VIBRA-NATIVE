// Port di src/components/shared/MobileFastScroll.jsx: barra di scorrimento trascinabile sul bordo destro
// (stile rubrica): fascia di 22 px, pollice sottile (4 px, 8 px durante il trascinamento) alto quanto la
// porzione visibile (minimo 36 px), visibile solo se la pagina scorre (> 8 px).
//
// Nell'originale è una sola per la finestra; qui ogni pagina ha il suo ScrollView, quindi una per Page
// (Page.tsx). Tutto sul thread UI (docs/REGOLE-PRESTAZIONI.md §5): la posizione del pollice segue lo
// scroll della pagina (useScrollOffset, senza JS a ogni frame) e il trascinamento (gesto RNGH) scorre la
// pagina con scrollTo di Reanimated. Al JS arrivano solo le misure (altezza del contenuto e della pagina),
// che cambiano di rado.
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, GestureHandlerRootView, GestureStateManager, useManualGesture } from 'react-native-gesture-handler';
import Animated, { Easing, scrollTo, useAnimatedStyle, useScrollOffset, useSharedValue, withTiming, type AnimatedRef } from 'react-native-reanimated';
import { THEME } from './palette.generated';

const TRACK_W = 22;
const MIN_THUMB = 36;
// transition: width 150ms ease-out, opacity 150ms ease-out
const T = { duration: 150, easing: Easing.bezier(0, 0, 0.58, 1) };

export type FastScrollHandle = { setMetrics: (contentHeight: number, viewportHeight: number) => void };

type Props = { scrollRef: AnimatedRef<any> };

export const FastScroll = forwardRef<FastScrollHandle, Props>(function FastScroll({ scrollRef }, ref) {
  const offset = useScrollOffset(scrollRef);
  const max = useSharedValue(0);
  const vh = useSharedValue(0);
  const thumbH = useSharedValue(MIN_THUMB);
  const drag = useSharedValue(0); // 0..1 (animato): larghezza e opacità
  const dragging = useSharedValue(false);
  const startY = useSharedValue(0);
  const startScroll = useSharedValue(0);
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    setMetrics(sh: number, ch: number) {
      const m = sh - ch;
      const show = ch > 0 && m > 8;
      if (show) {
        max.value = m;
        vh.value = ch;
        thumbH.value = Math.max(MIN_THUMB, (ch / sh) * ch);
      }
      setVisible(show);
    },
  }), [max, vh, thumbH]);

  const gesture = useManualGesture({
    onTouchesDown: (e) => {
      'worklet';
      if (e.numberOfTouches > 1 || max.value <= 8) return;
      GestureStateManager.activate(e.handlerTag);
      dragging.value = true;
      drag.value = withTiming(1, T);
      startY.value = e.changedTouches[0].absoluteY;
      startScroll.value = offset.value;
    },
    onTouchesMove: (e) => {
      'worklet';
      if (!dragging.value) return;
      const t = e.allTouches[0];
      if (!t || max.value <= 0) return;
      const scrollPerPx = max.value / Math.max(1, vh.value - thumbH.value);
      const ns = startScroll.value + (t.absoluteY - startY.value) * scrollPerPx;
      scrollTo(scrollRef, 0, Math.max(0, Math.min(max.value, ns)), false);
    },
    onTouchesUp: (e) => {
      'worklet';
      if (e.numberOfTouches > 0) return;
      dragging.value = false;
      drag.value = withTiming(0, T);
      GestureStateManager.deactivate(e.handlerTag);
    },
    onFinalize: () => {
      'worklet';
      if (!dragging.value) return;
      dragging.value = false;
      drag.value = withTiming(0, T);
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    const room = Math.max(0, vh.value - thumbH.value);
    const top = max.value > 0 ? Math.max(0, Math.min(room, (offset.value / max.value) * room)) : 0;
    return {
      height: thumbH.value,
      width: 4 + 4 * drag.value,
      opacity: 0.3 + 0.55 * drag.value,
      transform: [{ translateY: top }],
    };
  });

  if (!visible) return null;
  return (
    <GestureHandlerRootView style={styles.track}>
      <GestureDetector gesture={gesture}>
        <View style={StyleSheet.absoluteFill} collapsable={false}>
          <Animated.View pointerEvents="none" style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
});

/** ref a funzione che passa lo ScrollView sia al ref della pagina sia all'animated ref. */
export function useMergedScrollRef<T>(own: { current: T | null }, animated: AnimatedRef<any>) {
  return useCallback((node: T | null) => {
    own.current = node;
    (animated as unknown as (n: T | null) => void)(node);
  }, [own, animated]);
}

const styles = StyleSheet.create({
  // fixed right-0 top-0 bottom-0 w-[22px] z-40
  track: { position: 'absolute', right: 0, top: 0, bottom: 0, width: TRACK_W, zIndex: 40 },
  // absolute right-1.5 rounded-full bg-foreground/40
  thumb: { position: 'absolute', right: 6, top: 0, borderRadius: 9999, backgroundColor: THEME.foreground + '66' },
});
