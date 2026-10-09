// Eventi touch/pointer/mouse/wheel dei <div> del web su Div e Btn.
// Sul web passano invariati (react-native-web li inoltra al DOM). Sul telefono:
//  - onTouchStart/Move/End: eventi touch di RN con la forma del web (touches[i].clientX/Y,
//    target/currentTarget, preventDefault/stopPropagation); onTouchCancel ricade su onTouchEnd
//    (sul telefono un tocco che diventa scroll finisce con cancel)
//  - onPointerDown/Move/Up: dagli stessi eventi touch (clientX/Y del dito)
//  - onMouseEnter/Move/Down/Up/Leave: emulati come fa il browser del telefono dopo un tap:
//    sull'elemento toccato mousemove/mouseenter/mousedown/mouseup, e mouseleave su quelli
//    toccati prima quando il tap cade altrove (serve HoverRoot attorno all'app)
//  - onWheel: non esiste, ignorato
import { useRef } from 'react';
import { Platform, type GestureResponderEvent } from 'react-native';

type AnyFn = (e: any) => void;
type Handlers = Partial<Record<(typeof ALL)[number], AnyFn>>;
/** Handler con gli eventi del web (vedi sopra). */
export type WebGestureProps = Handlers;

const TOUCH = ['onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'] as const;
const POINTER = ['onPointerDown', 'onPointerMove', 'onPointerUp', 'onPointerCancel', 'onPointerEnter', 'onPointerLeave'] as const;
const MOUSE = ['onMouseDown', 'onMouseMove', 'onMouseUp', 'onMouseEnter', 'onMouseLeave'] as const;
const ALL = [...TOUCH, ...POINTER, ...MOUSE, 'onWheel'] as const;

/** Separa gli handler web dalle altre prop. */
export function splitGestureProps<P extends object>(props: P): [Handlers, Omit<P, (typeof ALL)[number]>] {
  const handlers: Handlers = {};
  const rest: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if ((ALL as readonly string[]).includes(k)) { if (v) handlers[k as keyof Handlers] = v as AnyFn; }
    else rest[k] = v;
  }
  return [handlers, rest as Omit<P, (typeof ALL)[number]>];
}

type NativeTouch = { pageX: number; pageY: number; locationX: number; locationY: number; identifier: number };
const webTouch = (t: NativeTouch) => ({
  clientX: t.pageX, clientY: t.pageY, pageX: t.pageX, pageY: t.pageY, screenX: t.pageX, screenY: t.pageY,
  identifier: t.identifier,
});

/** Evento touch di RN → evento con la forma del web. */
export function webTouchEvent(e: GestureResponderEvent, type: string) {
  const n = e.nativeEvent as unknown as { touches?: NativeTouch[]; changedTouches?: NativeTouch[]; pageX: number; pageY: number };
  const touches = (n.touches ?? []).map(webTouch);
  const changedTouches = (n.changedTouches ?? [n as unknown as NativeTouch]).map(webTouch);
  const first = touches[0] ?? changedTouches[0] ?? webTouch(n as unknown as NativeTouch);
  return {
    type, touches, targetTouches: touches, changedTouches,
    clientX: first.clientX, clientY: first.clientY, pageX: first.pageX, pageY: first.pageY,
    button: 0, buttons: type.endsWith('up') || type.endsWith('end') ? 0 : 1, pointerType: 'touch', pointerId: 1, isPrimary: true,
    shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
    target: e.target, currentTarget: e.currentTarget, nativeEvent: e.nativeEvent,
    get defaultPrevented() { return e.isDefaultPrevented?.() ?? false; },
    preventDefault: () => e.preventDefault?.(),
    stopPropagation: () => e.stopPropagation?.(),
    persist: () => {},
  };
}

// ── hover emulato ──────────────────────────────────────────────────────────
type HoverEntry = { current: Handlers };
let hovered = new Set<HoverEntry>();
let tapped: Set<HoverEntry> | null = null;
let fallback: ReturnType<typeof setTimeout> | null = null;

/** Fine del tap: mouseleave su chi era "sotto il mouse" e ora no, mouseenter sui nuovi. */
export function flushHover() {
  if (fallback) { clearTimeout(fallback); fallback = null; }
  const next = tapped ?? new Set<HoverEntry>();
  tapped = null;
  const ev = { type: 'mouse', preventDefault() {}, stopPropagation() {} };
  for (const h of hovered) if (!next.has(h)) h.current.onMouseLeave?.(ev);
  hovered = next;
}

function registerTap(entry: HoverEntry) {
  if (!tapped) tapped = new Set();
  tapped.add(entry);
  // se nessun HoverRoot riceve il tocco, chiude comunque il giro
  if (!fallback) fallback = setTimeout(flushHover, 0);
}

/** Prop da mettere sulla radice dell'app (onTouchEnd) per chiudere ogni tap. */
export const hoverRootProps = Platform.OS === 'web' ? {} : { onTouchEnd: () => flushHover() };

const TAP_SLOP = 10;

/** Prop native per una View a partire dagli handler web. */
export function useWebGestures(handlers: Handlers): Record<string, AnyFn> {
  const ref = useRef<Handlers>(handlers);
  ref.current = handlers;
  const start = useRef<{ x: number; y: number } | null>(null);
  if (Platform.OS === 'web') return handlers as Record<string, AnyFn>;

  const h = handlers;
  const hasMouse = MOUSE.some((k) => h[k]);
  const hasPointer = h.onPointerDown || h.onPointerMove || h.onPointerUp || h.onPointerCancel;
  const out: Record<string, AnyFn> = {};
  if (h.onTouchStart || hasPointer || hasMouse) {
    out.onTouchStart = (e: GestureResponderEvent) => {
      start.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
      ref.current.onTouchStart?.(webTouchEvent(e, 'touchstart'));
      ref.current.onPointerDown?.(webTouchEvent(e, 'pointerdown'));
    };
  }
  if (h.onTouchMove || h.onPointerMove) {
    out.onTouchMove = (e: GestureResponderEvent) => {
      ref.current.onTouchMove?.(webTouchEvent(e, 'touchmove'));
      ref.current.onPointerMove?.(webTouchEvent(e, 'pointermove'));
    };
  }
  if (h.onTouchEnd || h.onPointerUp || hasMouse) {
    out.onTouchEnd = (e: GestureResponderEvent) => {
      ref.current.onTouchEnd?.(webTouchEvent(e, 'touchend'));
      ref.current.onPointerUp?.(webTouchEvent(e, 'pointerup'));
      const s = start.current;
      const { pageX, pageY } = e.nativeEvent;
      if (hasMouse && s && Math.abs(pageX - s.x) < TAP_SLOP && Math.abs(pageY - s.y) < TAP_SLOP) {
        const was = hovered.has(ref);
        const m = (type: string) => ({ ...webTouchEvent(e, type), pointerType: undefined });
        ref.current.onMouseMove?.(m('mousemove'));
        if (!was) ref.current.onMouseEnter?.(m('mouseenter'));
        ref.current.onMouseDown?.(m('mousedown'));
        ref.current.onMouseUp?.(m('mouseup'));
        registerTap(ref);
      }
    };
  }
  if (h.onTouchCancel || h.onTouchEnd || h.onPointerCancel || h.onPointerUp) {
    out.onTouchCancel = (e: GestureResponderEvent) => {
      (ref.current.onTouchCancel ?? ref.current.onTouchEnd)?.(webTouchEvent(e, 'touchcancel'));
      (ref.current.onPointerCancel ?? ref.current.onPointerUp)?.(webTouchEvent(e, 'pointercancel'));
    };
  }
  return out;
}
