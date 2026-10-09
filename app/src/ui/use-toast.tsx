// Port di src/components/ui/use-toast.jsx + toaster.jsx + toast.jsx: stessa API
// (toast({ title, description, variant, duration }) / useToast()) e stesso aspetto
// (in alto su telefono, chiusura automatica dopo 3s, variante destructive rossa).
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from './cn';
import { Div } from './html';
import { X } from './icons.generated';
import { Text } from './text';

type ToastProps = { id?: string; title?: ReactNode; description?: ReactNode; action?: ReactNode; variant?: 'default' | 'destructive'; duration?: number; className?: string };
type ToastItem = ToastProps & { id: string };

const TOAST_LIMIT = 20;
let toasts: ToastItem[] = [];
const listeners = new Set<(t: ToastItem[]) => void>();
let count = 0;

function emit() { for (const l of listeners) l(toasts); }

export function dismiss(id?: string) {
  toasts = id ? toasts.filter((t) => t.id !== id) : [];
  emit();
}

export function toast(props: ToastProps) {
  const id = String(++count);
  toasts = [{ ...props, id }, ...toasts].slice(0, TOAST_LIMIT);
  emit();
  return {
    id,
    dismiss: () => dismiss(id),
    update: (next: ToastProps) => { toasts = toasts.map((t) => (t.id === id ? { ...t, ...next } : t)); emit(); },
  };
}

export function useToast() {
  const [state, setState] = useState(toasts);
  useEffect(() => { listeners.add(setState); return () => { listeners.delete(setState); }; }, []);
  return { toasts: state, toast, dismiss };
}

function ToastView({ id, title, description, action, variant, duration, className }: ToastItem) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    const t = setTimeout(() => dismiss(id), duration || 3000);
    return () => clearTimeout(t);
  }, [id, duration, anim]);
  const destructive = variant === 'destructive';
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) }] }}>
      <Div className={cn(
        'relative flex w-full items-center justify-between overflow-hidden rounded-md border p-6 pr-8 shadow-lg mt-2',
        destructive ? 'border-destructive bg-destructive text-destructive-foreground' : 'border-border bg-background text-foreground',
        className,
      )}>
        <Div className="gap-1 flex-1">
          {title ? <Text className={cn('text-sm font-semibold', destructive && 'text-destructive-foreground')}>{title}</Text> : null}
          {description ? <Text className={cn('text-sm opacity-90', destructive && 'text-destructive-foreground')}>{description}</Text> : null}
        </Div>
        {action}
        <Pressable onPress={() => dismiss(id)} accessibilityLabel="Chiudi" hitSlop={8} style={{ position: 'absolute', right: 8, top: 8, opacity: 0.6 }}>
          <X className={cn('h-4 w-4', destructive ? 'text-destructive-foreground' : 'text-foreground/50')} />
        </Pressable>
      </Div>
    </Animated.View>
  );
}

/** Da montare una volta sola, sopra a tutto (app/_layout.tsx). */
export function Toaster() {
  const { toasts: list } = useToast();
  const insets = useSafeAreaInsets();
  if (!list.length) return null;
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top, left: 0, right: 0, padding: 16, zIndex: 10010 }}>
      {list.map((t) => <ToastView key={t.id} {...t} />)}
    </View>
  );
}
