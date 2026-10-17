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
type ToastItem = ToastProps & { id: string; leaving?: boolean };

const TOAST_LIMIT = 20;
let toasts: ToastItem[] = [];
const listeners = new Set<(t: ToastItem[]) => void>();
let count = 0;

function emit() { for (const l of listeners) l(toasts); }

// chiusura: prima l'animazione d'uscita (ToastView), poi via dall'elenco (prima spariva di colpo)
export function dismiss(id?: string) {
  toasts = toasts.map((t) => (!id || t.id === id ? { ...t, leaving: true } : t));
  emit();
}
function remove(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
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

// PORT: chi chiama useToast usa solo toast/dismiss (verificato in tutto il codice): un oggetto costante e
// nessuna iscrizione. Prima ogni componente con useToast (decine, anche nelle pagine precaricate) si
// ridisegnava a ogni toast dell'app. L'elenco lo segue solo Toaster (useToastList).
const TOAST_API = { toast, dismiss };
export function useToast() {
  return TOAST_API;
}

function useToastList() {
  const [state, setState] = useState(toasts);
  useEffect(() => { listeners.add(setState); setState(toasts); return () => { listeners.delete(setState); }; }, []);
  return state;
}

function ToastView({ id, title, description, action, variant, duration, className, leaving }: ToastItem) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (leaving) return;
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    const t = setTimeout(() => dismiss(id), duration || 3000);
    return () => clearTimeout(t);
  }, [id, duration, anim, leaving]);
  useEffect(() => {
    if (!leaving) return;
    const a = Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: true });
    a.start(({ finished }) => { if (finished) remove(id); });
    return () => a.stop();
  }, [leaving, id, anim]);
  const destructive = variant === 'destructive';
  return (
    <Animated.View pointerEvents={leaving ? 'none' : 'auto'} style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) }] }}>
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
  const list = useToastList();
  const insets = useSafeAreaInsets();
  if (!list.length) return null;
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top, left: 0, right: 0, padding: 16, zIndex: 10010 }}>
      {list.map((t) => <ToastView key={t.id} {...t} />)}
    </View>
  );
}
