// Sottoinsieme di framer-motion usato dall'app web, sopra Animated:
//   <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
// Proprietà animate: opacity, x, y, scale, rotate (numeri), anche a keyframe ([0, 1, 0]) e con
// repeat: Infinity; width/height in px o %. height/width 'auto' non sono animabili in RN: l'elemento compare alla sua
// misura naturale. AnimatePresence rende i figli (le animazioni di uscita non sono replicate).
import { Children, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Dimensions, Easing, type LayoutChangeEvent } from 'react-native';
import { Btn, Div, Span } from './html';
import { Img } from './elements';

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

// Entrata "sale di qualche px e compare" (initial y: 6-14 → y: 0) all'apertura di ogni sezione: richiesto
// che i componenti restino fermi al loro posto, quindi resta solo la dissolvenza. I pannelli che scorrono
// davvero (y in % o oltre 24 px, keyframe) restano animati.
function withoutEntryLift(from: Record<string, any> | undefined, to: Record<string, any> | undefined) {
  if (!from || typeof from.y !== 'number' || from.y === 0 || Math.abs(from.y) > 24) return [from, to];
  if (to && to.y !== undefined && to.y !== 0) return [from, to];
  const { y: _f, ...f } = from;
  const t = to && 'y' in to ? (({ y: _t, ...rest }) => rest)(to) : to;
  return [f, t];
}

function useMotion(initial: Target, animate: Target, transition?: Transition, width = 0) {
  const [rawFrom, rawTo] = withoutEntryLift(typeof initial === 'object' ? initial : undefined, typeof animate === 'object' ? animate : undefined);
  const pct = new Set(PCT_KEYS.filter((k) => isPct(rawFrom?.[k]) || isPct(rawTo?.[k])));
  const from = numeric(rawFrom);
  const to = numeric(rawTo);
  const values = useRef<Record<string, Animated.Value>>({}).current;
  // ultimo valore di arrivo per chiave (all'inizio, quello di partenza): verso lo stesso valore niente
  // animazione (es. la barra di Formazione con width già uguale faceva 300 ms di animazione sul JS)
  const lastTarget = useRef<Record<string, number>>({}).current;
  for (const k of KEYS) {
    if (!values[k]) {
      const start = initial === false ? (Array.isArray(to?.[k]) ? to![k].at(-1) : to?.[k]) : from?.[k];
      const first = Array.isArray(to?.[k]) ? to![k][0] : undefined;
      const v0 = typeof start === 'number' ? start : typeof first === 'number' ? first : DEFAULTS[k];
      values[k] = new Animated.Value(v0);
      lastTarget[k] = v0;
    }
  }
  // dimensioni: l'unità la decide il valore di arrivo (0 → '45%' parte da 0%)
  const sizes = SIZE_KEYS.filter((k) => sizeOf(to?.[k]) != null);
  for (const k of sizes) {
    if (!values[k]) {
      const start = initial === false ? null : sizeOf(from?.[k]);
      values[k] = new Animated.Value(start ? start.n : sizeOf(to![k])!.n);
      lastTarget[k] = start ? start.n : sizeOf(to![k])!.n;
    }
  }
  // width/height non vanno col driver nativo: allora niente driver nativo per tutto l'elemento.
  // PORT: x/y in % (es. lo scintillio infinito di RankCard) restano sul driver nativo: il valore resta in
  // % e diventa px con la larghezza dell'elemento (onLayout); prima giravano sul thread JS per sempre.
  const nativeDriver = sizes.length === 0;
  const waitWidth = pct.size > 0 && !(width > 0);
  const targetKey = JSON.stringify(to ?? {}) + (pct.size ? `|${width > 0 ? 1 : 0}` : '');
  useEffect(() => {
    if (!to || waitWidth) return;
    const duration = (transition?.duration ?? 0.3) * 1000;
    const delay = (transition?.delay ?? 0) * 1000;
    // valori non numerici (es. 'auto') non si animano: l'elemento resta com'è
    const ok = (v: unknown) => (Array.isArray(v) ? v.every((n) => typeof n === 'number') : Number.isFinite(Number(v)));
    // keyframe sempre; le altre chiavi solo se l'arrivo cambia
    const anims = KEYS.filter((k) => to[k] !== undefined && ok(to[k]) && (Array.isArray(to[k]) || Number(to[k]) !== lastTarget[k])).map((k) => {
      const v = to[k];
      if (Array.isArray(v)) {
        const step = duration / Math.max(1, v.length - 1);
        const seq = Animated.sequence(v.slice(1).map((n: number) => Animated.timing(values[k], { toValue: n, duration: step, easing: easing(transition?.ease), useNativeDriver: nativeDriver })));
        return transition?.repeat === Infinity ? Animated.loop(seq) : seq;
      }
      lastTarget[k] = Number(v);
      return Animated.timing(values[k], { toValue: Number(v), duration, delay, easing: easing(transition?.ease), useNativeDriver: nativeDriver });
    });
    for (const k of sizes) {
      const n = sizeOf(to[k])!.n;
      if (n === lastTarget[k]) continue;
      lastTarget[k] = n;
      anims.push(Animated.timing(values[k], { toValue: n, duration, delay, easing: easing(transition?.ease), useNativeDriver: false }));
    }
    if (!anims.length) return;
    const all = Animated.parallel(anims);
    all.start();
    return () => all.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey]);
  const used = new Set([...Object.keys(from ?? {}), ...Object.keys(to ?? {})]);
  const transform: any[] = [];
  // % → px sulla larghezza dell'elemento (come translate in % del CSS); prima della misura la larghezza
  // dello schermo come stima (una barra che entra da -100% non deve comparire piena per un frame)
  const pctBase = width > 0 ? width : Dimensions.get('window').width;
  const asPct = (v: Animated.Value) => v.interpolate({ inputRange: [0, 100], outputRange: [0, pctBase] });
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
    // x/y in %: serve la larghezza dell'elemento (misurata una volta, poi solo se cambia)
    const usesPct = PCT_KEYS.some((k) => isPct((typeof initial === 'object' ? initial : undefined)?.[k]) || isPct((typeof animate === 'object' ? animate : undefined)?.[k]));
    const [width, setWidth] = useState(0);
    const animated = useMotion(initial, animate, transition, width);
    const ownLayout = (rest as { onLayout?: (e: LayoutChangeEvent) => void }).onLayout;
    const onLayout = usesPct
      ? (e: LayoutChangeEvent) => { const nw = e.nativeEvent.layout.width; setWidth((w) => (Math.abs(w - nw) < 0.5 ? w : nw)); ownLayout?.(e); }
      : ownLayout;
    // Div: lo stile animato va sull'elemento stesso (posizione assoluta, h-full, flex-1 restano suoi)
    if (direct) return <Comp className={className} style={style} animatedStyle={animated} {...rest} onLayout={onLayout}>{children}</Comp>;
    return (
      <Animated.View style={animated} onLayout={usesPct ? onLayout : undefined}>
        <Comp className={className} style={style} {...rest}>{children}</Comp>
      </Animated.View>
    );
  };
}

export const motion = {
  div: make(Div, true), section: make(Div, true), li: make(Div, true), ul: make(Div, true), header: make(Div, true),
  span: make(Span), p: make(Span), button: make(Btn), img: make(Img),
};

export function AnimatePresence({ children }: { children?: ReactNode; mode?: string; initial?: boolean }) {
  return <>{useMemo(() => Children.toArray(children), [children])}</>;
}
// nel DOM non crea elementi: per griglie e space-y i figli sono figli del contenitore (cssChildren)
(AnimatePresence as { cssTransparent?: boolean }).cssTransparent = true;
