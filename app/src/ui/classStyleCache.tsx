// Stile delle classi Tailwind in cache (solo telefono). NativeWind risolve `className` in ogni
// componente con uno stato suo (riduttore, osservabili, variabili, media query): il banco della gara
// (app/src/app/dev/bench.tsx) misurava una View con classi ~1,7 volte una View con lo stesso style.
// Per classi che non dipendono da stato, posizione o tempo il risultato è sempre lo stesso (tema fisso,
// varianti di larghezza legate alla larghezza dello schermo): la prima volta passano da NativeWind con
// un componente che ne registra lo stile (CaptureView/CapturePressable); dalla seconda Div e Btn usano
// View/Pressable semplici con quello stile. Le classi dinamiche passano sempre da NativeWind.
import { forwardRef, type ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { cssInterop } from 'nativewind';
import { cssViewport } from './webStyle';

const styles = new Map<string, unknown>();
const staticCache = new Map<string, boolean>();

// varianti ammesse: solo larghezza dello schermo (tutte le altre dipendono da stato o posizione:
// hover/active/focus/disabled, group-/peer-, first/last/odd/even, dark, placeholder, aria/data, ...)
const MEDIA = new Set(['sm', 'md', 'lg', 'xl', '2xl', 'max-sm', 'max-md', 'max-lg', 'max-xl', 'max-2xl']);
// proprietà animate o che definiscono variabili CSS
const DYNAMIC_BASE = /^!?-?(transition|animate|duration|ease|delay|will-change)/;

function isStatic(cls: string): boolean {
  let v = staticCache.get(cls);
  if (v !== undefined) return v;
  v = true;
  for (const c of cls.split(/\s+/)) {
    if (!c) continue;
    if (c.includes('[--') || c.startsWith('@')) { v = false; break; }
    // ':' dentro i valori arbitrari ([url(...)], [calc(...)]) non è una variante
    const parts = c.replace(/\[[^\]]*\]/g, '[]').split(':');
    const base = parts.pop() ?? '';
    if (DYNAMIC_BASE.test(base) || parts.some((p) => !MEDIA.has(p))) { v = false; break; }
  }
  staticCache.set(cls, v);
  return v;
}

const BREAKPOINTS = [640, 768, 1024, 1280, 1536];
function key(cls: string): string {
  if (!cls.includes(':')) return cls;
  // con varianti di larghezza lo stile dipende dalla fascia di larghezza dello schermo
  const w = cssViewport.width;
  return `${cls}|${BREAKPOINTS.filter((b) => w >= b).length}`;
}

export type ClassStyle = { cached: true; style: unknown } | { cached: false; key: string | null };

/** Stile in cache per queste classi, oppure la chiave con cui registrarlo (null: classi dinamiche). */
export function classStyle(cls: string): ClassStyle {
  if (!isStatic(cls)) return { cached: false, key: null };
  const k = key(cls);
  return styles.has(k) ? { cached: true, style: styles.get(k) } : { cached: false, key: k };
}

type CaptureProps = { __cacheKey?: string | null; __extraStyle?: unknown; style?: unknown };

/** View con className passata da NativeWind che registra lo stile risolto delle classi. */
export const CaptureView = forwardRef<View, ComponentProps<typeof View> & CaptureProps>(
  function CaptureView({ __cacheKey, __extraStyle, style, ...rest }, ref) {
    if (__cacheKey && !styles.has(__cacheKey)) styles.set(__cacheKey, style ?? null);
    return <View ref={ref} {...rest} style={[style as never, __extraStyle as never]} />;
  },
);
cssInterop(CaptureView, { className: 'style' });

/** Come CaptureView, per i pulsanti. */
export const CapturePressable = forwardRef<View, ComponentProps<typeof Pressable> & CaptureProps>(
  function CapturePressable({ __cacheKey, __extraStyle, style, ...rest }, ref) {
    if (__cacheKey && !styles.has(__cacheKey)) styles.set(__cacheKey, style ?? null);
    return <Pressable ref={ref} {...rest} style={[style as never, __extraStyle as never]} />;
  },
);
cssInterop(CapturePressable, { className: 'style' });
