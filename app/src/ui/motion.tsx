// Sottoinsieme di framer-motion usato dall'app web, sopra Animated:
//   <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
// Proprietà animate: opacity, x, y, scale, rotate (numeri), anche a keyframe ([0, 1, 0]) e con
// repeat: Infinity; width/height in px o %. height/width 'auto' non sono animabili in RN: l'elemento compare alla sua
// misura naturale. AnimatePresence rende i figli (le animazioni di uscita non sono replicate).
import { Children, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Animated, Easing } from 'react-native';
import { Btn, Div, Span } from './html';

type Target = Record<string, any> | boolean | undefined | string;
type Transition = { duration?: number; delay?: number; ease?: string | number[]; repeat?: number; repeatType?: string };
type MotionProps = {
  initial?: Target; animate?: Target; exit?: Target; transition?: Transition; whileTap?: Target; whileHover?: Target;
  layout?: unknown; layoutId?: string; variants?: unknown; children?: ReactNode; className?: string; style?: any;
  onClick?: () => void; [key: string]: any;
};

const KEYS = ['opacity', 'x', 'y', 'scale', 'rotate'] as const;
const DEFAULTS: Record<string, number> = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };

function easing(ease?: string | number[]) {
  if (Array.isArray(ease) && ease.length === 4) return Easing.bezier(ease[0], ease[1], ease[2], ease[3]);
  if (ease === 'linear') return Easing.linear;
  if (ease === 'easeIn') return Easing.in(Easing.ease);
  if (ease === 'easeInOut') return Easing.inOut(Easing.ease);
  return Easing.out(Easing.cubic); // default framer-motion ~ easeOut
}

// width/height: numeri (px) o percentuali ('45%'); 'auto' non è animabile (misura naturale)
const SIZE_KEYS = ['width', 'height'] as const;
type Size = { n: number; pct: boolean };
function sizeOf(v: unknown): Size | null {
  if (typeof v === 'number') return { n: v, pct: false };
  if (typeof v === 'string' && /^-?[\d.]+(px|%)?$/.test(v.trim())) return { n: parseFloat(v), pct: v.trim().endsWith('%') };
  return null;
}

// x/y in stringa ('12px', '-100%'): numeri; con % la traslazione è relativa all'elemento stesso
const PCT_KEYS = ['x', 'y'] as const;
const toNum = (v: unknown) => (typeof v === 'string' && /^-?[\d.]+(px|%)?$/.test(v.trim()) ? parseFloat(v) : v);
const isPct = (v: unknown) => (Array.isArray(v) ? v.some(isPct) : typeof v === 'string' && v.trim().endsWith('%'));
function numeric(t: Record<string, any> | undefined) {
  if (!t) return t;
  const out: Record<string, any> = { ...t };
  for (const k of PCT_KEYS) if (out[k] != null) out[k] = Array.isArray(out[k]) ? out[k].map(toNum) : toNum(out[k]);
  return out;
}

function useMotion(initial: Target, animate: Target, transition?: Transition) {
  const rawFrom = typeof initial === 'object' ? initial : undefined;
  const rawTo = typeof animate === 'object' ? animate : undefined;
  const pct = new Set(PCT_KEYS.filter((k) => isPct(rawFrom?.[k]) || isPct(rawTo?.[k])));
  const from = numeric(rawFrom);
  const to = numeric(rawTo);
  const values = useRef<Record<string, Animated.Value>>({}).current;
  for (const k of KEYS) {
    if (!values[k]) {
      const start = initial === false ? (Array.isArray(to?.[k]) ? to![k].at(-1) : to?.[k]) : from?.[k];
      const first = Array.isArray(to?.[k]) ? to![k][0] : undefined;
      values[k] = new Animated.Value(typeof start === 'number' ? start : typeof first === 'number' ? first : DEFAULTS[k]);
    }
  }
  // dimensioni: l'unità la decide il valore di arrivo (0 → '45%' parte da 0%)
  const sizes = SIZE_KEYS.filter((k) => sizeOf(to?.[k]) != null);
  for (const k of sizes) {
    if (!values[k]) {
      const start = initial === false ? null : sizeOf(from?.[k]);
      values[k] = new Animated.Value(start ? start.n : sizeOf(to![k])!.n);
    }
  }
  // width/height non vanno col driver nativo: allora niente driver nativo per tutto l'elemento
  const nativeDriver = sizes.length === 0 && pct.size === 0;
  const targetKey = JSON.stringify(to ?? {});
  useEffect(() => {
    if (!to) return;
    const duration = (transition?.duration ?? 0.3) * 1000;
    const delay = (transition?.delay ?? 0) * 1000;
    // valori non numerici (es. 'auto') non si animano: l'elemento resta com'è
    const ok = (v: unknown) => (Array.isArray(v) ? v.every((n) => typeof n === 'number') : Number.isFinite(Number(v)));
    const anims = KEYS.filter((k) => to[k] !== undefined && ok(to[k])).map((k) => {
      const v = to[k];
      if (Array.isArray(v)) {
        const step = duration / Math.max(1, v.length - 1);
        const seq = Animated.sequence(v.slice(1).map((n: number) => Animated.timing(values[k], { toValue: n, duration: step, easing: easing(transition?.ease), useNativeDriver: nativeDriver })));
        return transition?.repeat === Infinity ? Animated.loop(seq) : seq;
      }
      return Animated.timing(values[k], { toValue: Number(v), duration, delay, easing: easing(transition?.ease), useNativeDriver: nativeDriver });
    });
    for (const k of sizes) {
      anims.push(Animated.timing(values[k], { toValue: sizeOf(to[k])!.n, duration, delay, easing: easing(transition?.ease), useNativeDriver: false }));
    }
    const all = Animated.parallel(anims);
    all.start();
    return () => all.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey]);
  const used = new Set([...Object.keys(from ?? {}), ...Object.keys(to ?? {})]);
  const transform: any[] = [];
  const asPct = (v: Animated.Value) => v.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  if (used.has('x')) transform.push({ translateX: pct.has('x') ? asPct(values.x) : values.x });
  if (used.has('y')) transform.push({ translateY: pct.has('y') ? asPct(values.y) : values.y });
  if (used.has('scale')) transform.push({ scale: values.scale });
  if (used.has('rotate')) transform.push({ rotate: values.rotate.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] }) });
  const out: Record<string, any> = { ...(used.has('opacity') ? { opacity: values.opacity } : null), ...(transform.length ? { transform } : null) };
  for (const k of sizes) {
    out[k] = sizeOf(to![k])!.pct ? values[k].interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) : values[k];
  }
  return out;
}

function make(Comp: React.ComponentType<any>, direct = false) {
  return function MotionComponent({ initial, animate, exit: _e, transition, whileTap: _t, whileHover: _h, layout: _l, layoutId: _li, variants: _v, style, className, children, ...rest }: MotionProps) {
    const animated = useMotion(initial, animate, transition);
    // Div: lo stile animato va sull'elemento stesso (posizione assoluta, h-full, flex-1 restano suoi)
    if (direct) return <Comp className={className} style={style} animatedStyle={animated} {...rest}>{children}</Comp>;
    return (
      <Animated.View style={animated}>
        <Comp className={className} style={style} {...rest}>{children}</Comp>
      </Animated.View>
    );
  };
}

export const motion = {
  div: make(Div, true), section: make(Div, true), li: make(Div, true), ul: make(Div, true), header: make(Div, true),
  span: make(Span), p: make(Span), button: make(Btn),
};

export function AnimatePresence({ children }: { children?: ReactNode; mode?: string; initial?: boolean }) {
  return <>{useMemo(() => Children.toArray(children), [children])}</>;
}
// nel DOM non crea elementi: per griglie e space-y i figli sono figli del contenitore (cssChildren)
(AnimatePresence as { cssTransparent?: boolean }).cssTransparent = true;
