// Port di label.jsx, skeleton.jsx, progress.jsx, separator.
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, View } from 'react-native';
import { cn } from './cn';
import { Div } from './html';
import { Text, useInlineBox } from './text';

export function Label({ className, children, nativeID }: { className?: string; children?: ReactNode; nativeID?: string; htmlFor?: string }) {
  const cls = cn('text-sm font-medium leading-none', className);
  // <label> è in linea: in un blocco la sua riga è alta quanto l'interlinea del blocco
  const inlineBox = useInlineBox(cls);
  const text = <Text nativeID={nativeID} className={cls}>{children}</Text>;
  return inlineBox ? <View style={inlineBox}>{text}</View> : text;
}

/** animate-pulse rounded-md bg-primary/10 */
export function Skeleton({ className }: { className?: string }) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View style={{ opacity }}>
      <Div className={cn('rounded-md bg-primary/10', className)} />
    </Animated.View>
  );
}

export function Progress({ className, value, indicatorClassName }: { className?: string; value?: number; indicatorClassName?: string }) {
  const pct = Math.max(0, Math.min(100, value || 0));
  return (
    <Div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}>
      <Div className={cn('h-full bg-primary', indicatorClassName)} style={{ width: `${pct}%` }} />
    </Div>
  );
}
