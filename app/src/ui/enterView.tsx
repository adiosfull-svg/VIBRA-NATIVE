// Contenitori animati all'entrata per i contenuti nei Portal (ui/dialog, ui/menu): vedi useEnterProgress.
import { useMemo, type ReactNode } from 'react';
import { Animated, Platform, StyleSheet, type ViewStyle } from 'react-native';
import { useEnterProgress } from './anim';

const WEB = Platform.OS === 'web';

/** Velo + contenuto (tutto lo strato del Portal): dissolvenza, e per i menu lo scivolamento di 8 px dall'alto. */
export function EnterLayer({ children, ms = 150, slide = 0 }: { children: ReactNode; ms?: number; slide?: number }) {
  const v = useEnterProgress(WEB ? 0 : ms);
  const style = useMemo(() => [
    StyleSheet.absoluteFill,
    WEB ? null : {
      opacity: v,
      ...(slide ? { transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [slide, 0] }) }] } : null),
    },
  ], [v, slide]);
  return <Animated.View pointerEvents="box-none" style={style}>{children}</Animated.View>;
}

/** Finestra del dialog: zoom-in-95 (200 ms come duration-200 dell'originale). */
export function EnterZoom({ children, ms = 200, style }: { children: ReactNode; ms?: number; style?: ViewStyle }) {
  const v = useEnterProgress(WEB ? 0 : ms);
  const animated = useMemo(() => [style, WEB ? null : { transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }], [v, style]);
  return <Animated.View style={animated}>{children}</Animated.View>;
}
