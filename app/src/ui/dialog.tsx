// Port di src/components/ui/dialog.jsx e alert-dialog.jsx con @rn-primitives.
// Il contenuto è centrato dall'overlay (equivale a fixed + translate -50%); con `popup` su
// telefono è largo 100% - 1.5rem e rounded-2xl, come la variante web. Il bagliore viola
// (radial-gradient a 50% -10%) è disegnato con react-native-svg.
import * as DialogPrimitive from '@rn-primitives/dialog';
import * as AlertDialogPrimitive from '@rn-primitives/alert-dialog';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { buttonVariants } from './button';
import { cn } from './cn';
import { Div } from './html';
import { X } from './icons.generated';
import { Text } from './text';

type WithChildren = { className?: string; children?: ReactNode };

/** radial-gradient(circle at 50% -10%, rgba(167,139,250,.12) 0%, rgba(196,181,253,.05) 35%, transparent 60%) */
function RadialGlow() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const { w, h } = size;
  // dimensione di default CSS: farthest-corner dal centro (w/2, -0.1h)
  const r = Math.hypot(w / 2, h * 1.1);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {w > 0 && (
        <Svg width={w} height={h}>
          <Defs>
            <RadialGradient id="glow" cx={w / 2} cy={-0.1 * h} r={r} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="rgb(167,139,250)" stopOpacity={0.12} />
              <Stop offset="0.35" stopColor="rgb(196,181,253)" stopOpacity={0.05} />
              <Stop offset="0.6" stopColor="rgb(196,181,253)" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={w} height={h} fill="url(#glow)" />
        </Svg>
      )}
    </View>
  );
}

function useMaxHeight(popup?: boolean) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // max-h-[calc(100dvh-7rem-safe-area)] per popup, max-h-[calc(100dvh-2rem)] altrimenti
  return popup ? height - 112 - insets.top - insets.bottom : height - 32;
}

/** <Dialog modal={false}>: niente velo scuro dietro (come Radix), il resto uguale. */
const ModalContext = createContext(true);

export function Dialog({ modal = true, ...props }: DialogPrimitive.RootProps & { modal?: boolean }) {
  return <ModalContext.Provider value={modal}><DialogPrimitive.Root {...props} /></ModalContext.Provider>;
}
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

// Classi di DialogContent nell'originale (ui/dialog.jsx): le classi della pagina si applicano
// alla finestra stessa, come sul web (es. VibraSearch: p-0 flex flex-col h-[88vh] overflow-hidden).
// Centrata dall'overlay (equivale a fixed + translate -50%); overflow-y-auto → scorre (ScrollView sul telefono).
const CONTENT_BASE = 'relative grid w-full max-w-lg overflow-y-auto overscroll-contain gap-4 border border-border bg-background p-6 shadow-lg sm:rounded-lg';
const POPUP_CLASSES = 'max-sm:w-[calc(100%-1.5rem)] max-sm:rounded-2xl sm:rounded-2xl border-border/50 shadow-lg';

export function DialogContent({ className, children, hideCloseButton, popup, style }: WithChildren & {
  hideCloseButton?: boolean; popup?: boolean; style?: object;
  ref?: unknown; onOpenAutoFocus?: unknown; onPointerDownOutside?: unknown; onInteractOutside?: unknown; onEscapeKeyDown?: unknown;
}) {
  const maxHeight = useMaxHeight(popup);
  const modal = useContext(ModalContext);
  // lo sfondo di default (bagliore viola) solo se la pagina non ne dà uno suo
  const ownBackground = !!style && Object.keys(style).some((k) => /^background/.test(k));
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay style={StyleSheet.absoluteFill} className={cn('flex items-center justify-center', modal ? 'bg-black/80' : 'bg-transparent')}>
        <DialogPrimitive.Content style={{ width: '100%', alignItems: 'center' }}>
          <Div className={cn(CONTENT_BASE, popup && POPUP_CLASSES, className)} style={[{ maxHeight }, style]}>
            {ownBackground ? null : <Div className="absolute inset-0"><RadialGlow /></Div>}
            {children}
            {!hideCloseButton && (
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70" accessibilityLabel="Chiudi" hitSlop={8}>
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            )}
          </Div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
}

export const DialogHeader = ({ className, children }: WithChildren) => <Div className={cn('flex flex-col space-y-1.5 text-center', className)}>{children}</Div>;
export const DialogFooter = ({ className, children }: WithChildren) => <Div className={cn('flex flex-col-reverse gap-2', className)}>{children}</Div>;
export const DialogTitle = ({ className, children }: WithChildren) => (
  <DialogPrimitive.Title asChild><Text className={cn('text-lg font-semibold leading-none tracking-tight', className)}>{children}</Text></DialogPrimitive.Title>
);
export const DialogDescription = ({ className, children }: WithChildren) => (
  <DialogPrimitive.Description asChild><Text className={cn('text-sm text-muted-foreground', className)}>{children}</Text></DialogPrimitive.Description>
);

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogContent({ className, children }: WithChildren) {
  const maxHeight = useMaxHeight(false);
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay style={StyleSheet.absoluteFill} className="flex items-center justify-center bg-black/80 px-3">
        <AlertDialogPrimitive.Content style={{ maxHeight }} className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          <RadialGlow />
          <ScrollView bounces={false}>
            <Div className={cn('gap-4 p-6', className)}>{children}</Div>
          </ScrollView>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Overlay>
    </AlertDialogPrimitive.Portal>
  );
}
export const AlertDialogHeader = ({ className, children }: WithChildren) => <Div className={cn('flex flex-col space-y-2 text-center', className)}>{children}</Div>;
export const AlertDialogFooter = ({ className, children }: WithChildren) => <Div className={cn('flex flex-col-reverse gap-2', className)}>{children}</Div>;
export const AlertDialogTitle = ({ className, children }: WithChildren) => (
  <AlertDialogPrimitive.Title asChild><Text className={cn('text-lg font-semibold', className)}>{children}</Text></AlertDialogPrimitive.Title>
);
export const AlertDialogDescription = ({ className, children }: WithChildren) => (
  <AlertDialogPrimitive.Description asChild><Text className={cn('text-sm text-muted-foreground', className)}>{children}</Text></AlertDialogPrimitive.Description>
);
export function AlertDialogAction({ className, children, onClick, disabled }: WithChildren & { onClick?: () => void; disabled?: boolean }) {
  return (
    <AlertDialogPrimitive.Action onPress={onClick} disabled={disabled} className={cn(buttonVariants(), 'flex-row', disabled && 'opacity-50', className)}>
      <Text className="text-sm font-medium text-primary-foreground">{children}</Text>
    </AlertDialogPrimitive.Action>
  );
}
export function AlertDialogCancel({ className, children, onClick }: WithChildren & { onClick?: () => void }) {
  return (
    <AlertDialogPrimitive.Cancel onPress={onClick} className={cn(buttonVariants({ variant: 'outline' }), 'flex-row', className)}>
      <Text className="text-sm font-medium">{children}</Text>
    </AlertDialogPrimitive.Cancel>
  );
}
