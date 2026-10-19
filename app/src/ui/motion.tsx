// Sottoinsieme di framer-motion usato dall'app web, sopra Animated:
//   <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
// Proprietà animate: opacity, x, y, scale, rotate (numeri), anche a keyframe ([0, 1, 0]) e con
// repeat: Infinity; width/height in px o %. height/width 'auto' non sono animabili in RN: l'elemento compare alla sua
// misura naturale. AnimatePresence tiene montati i figli motion che escono finché non finisce la loro
// animazione `exit` (opacity/x/y/scale/rotate; height/width di uscita non si animano).
import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { Animated, Dimensions, Easing, type LayoutChangeEvent } from 'react-native';
import { Btn, Div, Span } from './html';
import { Img } from './elements';

type Target = Record<string, any> | boolean | undefined | string;
type Transition = { duration?: number; delay?: number; ease?: string | number[]; repeat?: number; repeatType?: string; repeatDelay?: number };
type MotionProps = {
  initial?: Target; animate?: Target; exit?: Target; transition?: Transition; whileTap?: Target; whileHover?: Target;
  layout?: unknown; layoutId?: string; variants?: unknown; children?: ReactNode; className?: string; style?: any;
  onClick?: () => void; [key: string]: any;
};

// prova (build di test): EXPO_PUBLIC_TEST_NO_LOOP=motion|pulse|all toglie le animazioni infinite
const NO_LOOP_MOTION = /motion|all/.test(process.env.EXPO_PUBLIC_TEST_NO_LOOP ?? '');

// Keyframe con repeat: Infinity (badge e scritte di RankCard, ecc.). PORT: prima erano
// Animated.loop(Animated.sequence(...)): la sequenza non gira sul driver nativo come un tutt'uno, quindi a
// ogni tratto (2-3 al secondo per elemento) il thread JS riceveva la fine, ripartiva col tratto dopo e
// sincronizzava il valore con Fabric. Lo schermo non era mai fermo (sull'emulatore UiAutomator "Could not
// detect idle state": swipe di Achievement da ~480 s l'uno, apertura ~315 s; senza questi loop 4-11 s e 5 s).
// Ora un solo Animated.timing 0 → 1 lineare in Animated.loop (loop nativo: nessun passaggio dal JS) e i
// keyframe come interpolazione, con la curva di ogni tratto campionata e la pausa `repeatDelay` di
// framer-motion in coda (valore fermo sull'ultimo keyframe).
const LOOP_SAMPLES = 12;
type LoopSpec = { input: number[]; output: number[]; ms: number };
function loopSpec(frames: number[], transition: Transition | undefined): LoopSpec {
  const duration = (transition?.duration ?? 0.3) * 1000;
  const pause = Math.max(0, (transition?.repeatDelay ?? 0) * 1000);
  const ms = duration + pause;
  const ease = easing(transition?.ease);
  const segs = Math.max(1, frames.length - 1);
  const segMs = duration / segs;
  const input: number[] = [0];
  const output: number[] = [frames[0]];
  for (let i = 0; i < segs; i++) {
    const a = frames[i], b = frames[i + 1] ?? frames[i];
    for (let j = 1; j <= LOOP_SAMPLES; j++) {
      const t = j / LOOP_SAMPLES;
      input.push((i * segMs + t * segMs) / ms);
      output.push(a + (b - a) * ease(t));
    }
  }
  if (pause > 0) { input.push(1); output.push(output[output.length - 1]); }
  input[input.length - 1] = 1;
  return { input, output, ms };
}

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

function useMotion(initial: Target, animate: Target, transition?: Transition, width = 0, onDone?: () => void) {
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
  const infinite = transition?.repeat === Infinity && !NO_LOOP_MOTION;
  const loopKeys = infinite ? KEYS.filter((k) => Array.isArray(to?.[k]) && to![k].length > 1 && to![k].every((n: unknown) => typeof n === 'number')) : [];
  const loopClock = useRef<Animated.Value | null>(null);
  if (loopKeys.length && !loopClock.current) loopClock.current = new Animated.Value(0);
  const loopKey = loopKeys.map((k) => `${k}:${to![k].join(',')}`).join('|') + `|${transition?.duration}|${transition?.repeatDelay}|${JSON.stringify(transition?.ease ?? '')}`;
  const loops = useMemo(() => {
    const out: Partial<Record<string, { spec: LoopSpec; node: Animated.AnimatedInterpolation<number> }>> = {};
    for (const k of loopKeys) {
      const spec = loopSpec(to![k], transition);
      out[k] = { spec, node: loopClock.current!.interpolate({ inputRange: spec.input, outputRange: spec.output }) };
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopKey]);
  const loopMs = loopKeys.length ? loops[loopKeys[0]]?.spec.ms ?? 0 : 0;
  useEffect(() => {
    const clock = loopClock.current;
    if (!clock || !loopMs) return undefined;
    clock.setValue(0);
    const a = Animated.loop(Animated.timing(clock, { toValue: 1, duration: loopMs, easing: Easing.linear, useNativeDriver: nativeDriver }));
    a.start();
    return () => a.stop();
  }, [loopMs, loopKey, nativeDriver]);
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
        // infiniti: orologio nativo qui sopra; senza loop (prova NO_LOOP) fermi sul primo keyframe
        if (transition?.repeat === Infinity) return null;
        const step = duration / Math.max(1, v.length - 1);
        return Animated.sequence(v.slice(1).map((n: number) => Animated.timing(values[k], { toValue: n, duration: step, easing: easing(transition?.ease), useNativeDriver: nativeDriver })));
      }
      lastTarget[k] = Number(v);
      return Animated.timing(values[k], { toValue: Number(v), duration, delay, easing: easing(transition?.ease), useNativeDriver: nativeDriver });
    }).filter((a): a is Animated.CompositeAnimation => a != null);
    for (const k of sizes) {
      const n = sizeOf(to[k])!.n;
      if (n === lastTarget[k]) continue;
      lastTarget[k] = n;
      anims.push(Animated.timing(values[k], { toValue: n, duration, delay, easing: easing(transition?.ease), useNativeDriver: false }));
    }
    if (!anims.length) { onDone?.(); return; }
    const all = Animated.parallel(anims);
    all.start(({ finished }) => { if (finished) onDone?.(); });
    return () => all.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey]);
  const used = new Set([...Object.keys(from ?? {}), ...Object.keys(to ?? {})]);
  const transform: any[] = [];
  // % → px sulla larghezza dell'elemento (come translate in % del CSS); prima della misura la larghezza
  // dello schermo come stima (una barra che entra da -100% non deve comparire piena per un frame)
  const pctBase = width > 0 ? width : Dimensions.get('window').width;
  const asPct = (v: Animated.Value | Animated.AnimatedInterpolation<number>) => v.interpolate({ inputRange: [0, 100], outputRange: [0, pctBase] });
  const val = (k: string) => loops[k]?.node ?? values[k];
  if (used.has('x')) transform.push({ translateX: pct.has('x') ? asPct(val('x')) : val('x') });
  if (used.has('y')) transform.push({ translateY: pct.has('y') ? asPct(val('y')) : val('y') });
  if (used.has('scale')) transform.push({ scale: val('scale') });
  if (used.has('rotate')) transform.push({ rotate: val('rotate').interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] }) });
  const out: Record<string, any> = { ...(used.has('opacity') ? { opacity: val('opacity') } : null), ...(transform.length ? { transform } : null) };
  for (const k of sizes) {
    out[k] = sizeOf(to![k])!.pct ? values[k].interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) : values[k];
  }
  return out;
}

function make(Comp: React.ComponentType<any>, direct = false) {
  function MotionComponent({ initial: initial0, animate: animate0, exit, transition: transition0, whileTap: _t, whileHover: _h, layout: _l, layoutId: _li, variants: _v, style, className, children, __exitDone, ...rest }: MotionProps) {
    // dentro <AnimatePresence initial={false}>: i figli già presenti al primo disegno non fanno l'entrata
    const presenceInitial = useContext(PresenceInitialContext);
    const mountInitial = useRef(presenceInitial ? initial0 : false).current;
    const initial = mountInitial;
    // in uscita (AnimatePresence): verso `exit`, poi AnimatePresence lo smonta
    const exiting = typeof __exitDone === 'function' && exit && typeof exit === 'object';
    const { transition: exitTransition, ...exitTarget } = exiting ? (exit as Record<string, any>) : ({} as Record<string, any>);
    const animate = exiting ? withoutAutoSize(typeof animate0 === 'object' ? animate0 : undefined, exitTarget) : animate0;
    const transition = exiting ? (exitTransition ?? transition0) : transition0;
    // x/y in %: serve la larghezza dell'elemento (misurata una volta, poi solo se cambia)
    const usesPct = PCT_KEYS.some((k) => isPct((typeof initial === 'object' ? initial : undefined)?.[k]) || isPct((typeof animate === 'object' ? animate : undefined)?.[k]));
    const [width, setWidth] = useState(0);
    const animated = useMotion(initial, animate, transition, width, exiting ? (__exitDone as () => void) : undefined);
    if (exiting) (rest as { pointerEvents?: string }).pointerEvents = 'none';
    const ownLayout = (rest as { onLayout?: (e: LayoutChangeEvent) => void }).onLayout;
    const onLayout = usesPct
      ? (e: LayoutChangeEvent) => { const nw = e.nativeEvent.layout.width; setWidth((w) => (Math.abs(w - nw) < 0.5 ? w : nw)); ownLayout?.(e); }
      : ownLayout;
    // Div: lo stile animato va sull'elemento stesso (posizione assoluta, h-full, flex-1 restano suoi)
    if (direct) return <Comp className={className} style={style} animatedStyle={animated} {...rest} onLayout={onLayout}>{children}</Comp>;
    return (
      <Animated.View style={animated} onLayout={usesPct ? onLayout : undefined} pointerEvents={exiting ? 'none' : undefined}>
        <Comp className={className} style={style} {...rest}>{children}</Comp>
      </Animated.View>
    );
  }
  (MotionComponent as { motionExit?: boolean }).motionExit = true;
  return MotionComponent;
}

/**
 * Arrivo dell'uscita: width/height solo se l'elemento li animava già in px/% ('auto' non è animabile: resta
 * la sua misura finché l'elemento sparisce a fine dissolvenza).
 */
function withoutAutoSize(animate: Record<string, any> | undefined, exit: Record<string, any>) {
  const out: Record<string, any> = { ...animate, ...exit };
  for (const k of SIZE_KEYS) if (out[k] !== undefined && sizeOf(animate?.[k]) == null) delete out[k];
  return out;
}

const PresenceInitialContext = createContext(true);

export const motion = {
  div: make(Div, true), section: make(Div, true), li: make(Div, true), ul: make(Div, true), header: make(Div, true),
  span: make(Span), p: make(Span), button: make(Btn), img: make(Img),
};

type Exiting = { el: ReactElement; index: number };
const canExit = (el: ReactNode): el is ReactElement => isValidElement(el)
  && !!(el.type as { motionExit?: boolean }).motionExit
  && typeof (el.props as { exit?: unknown }).exit === 'object';

export function AnimatePresence({ children, mode, initial = true }: { children?: ReactNode; mode?: string; initial?: boolean }) {
  const current = useMemo(() => Children.toArray(children), [children]);
  const prev = useRef<ReactNode[]>(current);
  const exiting = useRef(new Map<string, Exiting>()).current;
  const [, setTick] = useState(0);
  const firstRender = useRef(true);
  // figli usciti in questo disegno: restano montati in uscita (stesso posto di prima)
  const keys = new Set(current.map((c) => (isValidElement(c) ? String(c.key) : '')));
  prev.current.forEach((c, index) => {
    if (!canExit(c)) return;
    const k = String(c.key);
    if (!keys.has(k) && !exiting.has(k)) exiting.set(k, { el: c, index });
  });
  for (const k of [...exiting.keys()]) if (keys.has(k)) exiting.delete(k); // rientrato
  useLayoutEffect(() => { prev.current = current; firstRender.current = false; });
  const done = (k: string) => { if (exiting.delete(k)) setTick((t) => t + 1); };
  // mode="wait": il nuovo figlio entra dopo l'uscita del vecchio, come framer-motion
  let out: ReactNode[] = mode === 'wait' && exiting.size ? [] : [...current];
  for (const [k, { el, index }] of exiting) {
    const ghost = cloneElement(el as ReactElement<Record<string, unknown>>, { key: k, __exitDone: () => done(k) });
    out.splice(Math.min(index, out.length), 0, ghost);
  }
  // sempre lo stesso albero (Provider): cambiarlo dopo il primo disegno rimonterebbe i figli
  return <PresenceInitialContext.Provider value={!(firstRender.current && !initial)}>{out}</PresenceInitialContext.Provider>;
}
// nel DOM non crea elementi: per griglie e space-y i figli sono figli del contenitore (cssChildren)
(AnimatePresence as { cssTransparent?: boolean }).cssTransparent = true;
