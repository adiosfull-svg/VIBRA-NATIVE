// height: 'auto' di framer-motion (pannelli che si aprono: initial height 0 → animate 'auto' → exit 0).
// In RN 'auto' non si anima: l'elemento compariva già alla sua misura e la pagina sotto saltava. Qui un
// contenitore con overflow nascosto anima la sua altezza fino alla misura naturale del contenuto (letta con
// onLayout: il contenuto non si restringe, viene solo tagliato), poi torna 'auto' così il pannello segue i
// cambi del contenuto. Animazione di Reanimated sul thread UI; all'uscita dalla misura attuale a `exitTo`.
import { useEffect, useRef, type ReactNode } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming, type EasingFunction } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type Transition = { duration?: number; delay?: number; ease?: string | number[] };

function easing(ease?: string | number[]): EasingFunction {
  if (Array.isArray(ease) && ease.length === 4) return Easing.bezier(ease[0], ease[1], ease[2], ease[3]) as unknown as EasingFunction;
  if (ease === 'linear') return Easing.linear;
  if (ease === 'easeIn') return Easing.in(Easing.ease);
  if (ease === 'easeInOut') return Easing.inOut(Easing.ease);
  return Easing.out(Easing.cubic); // default framer-motion ~ easeOut (come ui/motion)
}

const CLIP = { overflow: 'hidden' } as const;

export function AutoHeight({ from, exiting, exitTo, transition, onExitDone, children }: {
  /** altezza di partenza (initial.height); null = già aperto (AnimatePresence initial={false}) */
  from: number | null;
  exiting: boolean;
  exitTo: number | null;
  transition?: Transition;
  onExitDone?: () => void;
  children: ReactNode;
}) {
  const h = useSharedValue(from ?? 0);
  // 1 = altezza 'auto' (aperto), 0 = altezza animata
  const auto = useSharedValue(from == null ? 1 : 0);
  const natural = useRef(-1);
  const grown = useRef(from == null);
  const duration = (transition?.duration ?? 0.3) * 1000;
  const delay = (transition?.delay ?? 0) * 1000;
  const ease = easing(transition?.ease);

  const open = () => { grown.current = true; auto.value = 1; };
  const onLayout = (e: LayoutChangeEvent) => {
    const H = e.nativeEvent.layout.height;
    if (Math.abs(H - natural.current) < 0.5) return;
    natural.current = H;
    if (grown.current || exiting) return;
    // in apertura (anche se il contenuto cambia a metà): verso la misura naturale
    h.value = withDelay(delay, withTiming(H, { duration, easing: ease }, (finished) => {
      if (finished) scheduleOnRN(open);
    }));
  };

  useEffect(() => {
    if (!exiting) return;
    if (exitTo == null) return;
    const done = onExitDone;
    // dalla misura attuale (aperto: quella naturale) verso l'altezza d'uscita
    if (grown.current) h.value = Math.max(0, natural.current);
    auto.value = 0;
    h.value = withTiming(exitTo, { duration, easing: ease }, (finished) => {
      if (finished && done) scheduleOnRN(done);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting]);

  const style = useAnimatedStyle(() => (auto.value ? { height: 'auto' as const } : { height: h.value }));
  return (
    <Animated.View style={[CLIP, style]}>
      <View onLayout={onLayout}>{children}</View>
    </Animated.View>
  );
}
