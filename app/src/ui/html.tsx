// Equivalenti nativi degli elementi HTML usati nel JSX dell'app web, così i componenti si
// portano riga per riga mantenendo className e struttura:
//   <div> → Div   <span>/<p>/<h*> → Span/P/H   <button> → Btn (onClick come sul web)
// Le classi passano da normalizeClasses (flex in riga, space-*, griglie, gradienti, ring...).
import { cssInterop } from 'nativewind';
import { collapseFirstMargin, stripSpacedMargins } from './spaceMargins';
import { FlipContext, flipInner, useFlipFace } from './flip';
import { fontSizeOf, inheritedLineHeight, inlineBlockMargins } from './textLeading';
import { Children, cloneElement, createContext, Fragment, startTransition, Suspense, isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode, type Ref } from 'react';
import { Animated, Dimensions, Platform, Pressable, ScrollView, StyleSheet, View, type GestureResponderEvent, type NativeScrollEvent, type NativeSyntheticEvent, type LayoutChangeEvent, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from './cn';
import { CapturePressable, CaptureView, classStyle } from './classStyleCache';
import { InPortalContext, PortalToRoot } from './fixedPortal';
import { themeColor } from './colors';
import { cssAnimationOf, useCssAnimation, withoutCssAnimation, type CssAnimationKind } from './cssAnimation';
import { isNativeSticky, NativeBlur, StickyBlurTargetContext, StickyBlurTooTallContext, StickySplit, usePageBlurTarget, useStickyPin } from './pageLayers';
import { useForm } from './formContext';
import { splitGestureProps, useWebGestures, type WebGestureProps } from './gestures';
import { FlexParentContext, hasBreakableText, MinContentProbeContext, type MinContentProbe, NarrowCellContext, splitTextClasses, WrapProbeContext, type WrapProbe, type ParentLayout, Text, TextClassContext, TextStyleContext, textClassesFor, useInlineBox, type AppTextProps } from './text';
import { nextTextStyle } from './textStyleInherit';
import { diagCount, diagTime, TEST_DIAG } from '../lib/testDiag';
import { expandGridTemplate, normalizeClasses, nativeClasses, parseGridTemplate, radiusFromClasses, spacingPx, type Gradient, type Grid, type GridTrack } from './webClasses';
import { cssViewport, viewportSizeStyle, webStyle, type WebStyleResult } from './webStyle';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { classOpacity, transitionSpec, useCssTransition } from './cssTransition';
import { useDomStyleRef } from './domStyle';

// Controllo all'avvio: la patch di react-native-css-interop (app/patches, applicata da npm install)
// serve sul telefono; se manca, Clienti va in errore ("cannot add a new property", "exactly one
// property per transform object"). Lo diciamo subito invece di lasciar indovinare.
if (__DEV__ && Platform.OS !== 'web') {
  try {
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const { assignToTarget } = require('react-native-css-interop/dist/shared');
    const probe: Record<string, unknown> = { transform: Object.freeze([{ translateY: 4 }]) };
    assignToTarget(probe, [{ translateY: 0 }], ['transform']);
    if ((probe.transform as unknown[]).length !== 1) throw new Error('transform annidato');
  } catch (e) {
    console.error(`[VIBRA] Patch di react-native-css-interop NON applicata (${(e as Error).message}): esegui "npm install" nella cartella app e poi "npx expo start -c".`);
  }
}

// vh/vw negli style del web: dimensioni della finestra
Object.assign(cssViewport, Dimensions.get('window'));
if (Platform.OS === 'web') nativeClasses.enabled = false;
// env(safe-area-inset-*) nei calc() delle classi
if (initialWindowMetrics) {
  const { top, bottom, left, right } = initialWindowMetrics.insets;
  Object.assign(cssViewport, { insetTop: top, insetBottom: bottom, insetLeft: left, insetRight: right });
}
Dimensions.addEventListener('change', ({ window }) => Object.assign(cssViewport, { width: window.width, height: window.height }));

/**
 * Avvolge in <Text> le stringhe/numeri figli diretti (in RN il testo nudo in una View è un errore).
 * Come in CSS, testo contiguo (es. `Tutti ({n})`) forma un solo elemento: niente gap in mezzo, e il
 * testo vuoto o fatto solo di spazi non occupa posto.
 */
const NO_CHILDREN: ReactNode[] = [];
function wrapText(children: ReactNode): ReactNode {
  // uscite rapide (stesso risultato di Children.toArray): niente figli, o un solo testo/numero. Non per un
  // elemento singolo: toArray gli dà la chiave ".0" e senza si rimonterebbe passando da 1 a 2 figli.
  if (children == null || typeof children === 'boolean') return NO_CHILDREN;
  if (typeof children === 'string' || typeof children === 'number') {
    const run = '' + children;
    return run.trim() !== '' ? [<Text key="text-0">{run}</Text>] : NO_CHILDREN;
  }
  const out: ReactNode[] = [];
  let run: string | null = null;
  const flush = () => {
    // testo vuoto o solo spazi tra blocchi: in CSS non genera nessun box (es. {cond && ...} con cond = '')
    if (run != null && run.trim() !== '') out.push(<Text key={`text-${out.length}`}>{run}</Text>);
    run = null;
  };
  for (const child of Children.toArray(children)) {
    if (typeof child === 'string' || typeof child === 'number') { run = (run ?? '') + child; continue; }
    flush();
    out.push(isValidElement(child) && child.type === Fragment
      ? <Fragment key={child.key}>{wrapText((child.props as { children?: ReactNode }).children)}</Fragment>
      : child);
  }
  flush();
  return out;
}

const GRADIENT_POINTS: Record<string, [{ x: number; y: number }, { x: number; y: number }]> = {
  r: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }],
  l: [{ x: 1, y: 0.5 }, { x: 0, y: 0.5 }],
  b: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }],
  t: [{ x: 0.5, y: 1 }, { x: 0.5, y: 0 }],
  br: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
  bl: [{ x: 1, y: 0 }, { x: 0, y: 1 }],
  tr: [{ x: 0, y: 1 }, { x: 1, y: 0 }],
  tl: [{ x: 1, y: 1 }, { x: 0, y: 0 }],
};

type AnyGradient = Gradient & { angle?: number; locations?: number[] };

/** Angolo CSS (0deg = verso l'alto, 90deg = verso destra) → punti start/end di LinearGradient. */
function anglePoints(angle: number): [{ x: number; y: number }, { x: number; y: number }] {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) / 2;
  const dy = -Math.cos(rad) / 2;
  return [{ x: 0.5 - dx, y: 0.5 - dy }, { x: 0.5 + dx, y: 0.5 + dy }];
}

/** Sfondo a gradiente (classi bg-gradient-to-* o style linear-gradient) dietro ai figli. */
const RADIUS_KEYS = ['borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'];

/** Raggi dell'elemento (classi rounded-* e style): il gradiente si arrotonda da sé, senza overflow-hidden
 *  sull'elemento (che taglierebbe i figli che sporgono, es. un avatar -bottom-7). */
function fillRadius(box: string, style?: Record<string, any>): ViewStyle {
  const out: Record<string, number> = radiusFromClasses(box);
  for (const k of RADIUS_KEYS) if (typeof style?.[k] === 'number') out[k] = style[k];
  if (typeof style?.borderRadius === 'number') for (const k of RADIUS_KEYS.slice(1)) if (typeof style?.[k] !== 'number') out[k] = style.borderRadius;
  return out;
}

export function GradientFill({ gradient, radius }: { gradient: AnyGradient; radius?: ViewStyle }) {
  const [start, end] = gradient.angle != null ? anglePoints(gradient.angle) : GRADIENT_POINTS[gradient.dir] ?? GRADIENT_POINTS.b;
  const colors = gradient.colors as [string, string, ...string[]];
  const locations = gradient.locations as [number, number, ...number[]] | undefined;
  return <LinearGradient pointerEvents="none" colors={colors} locations={locations} start={start} end={end} style={[StyleSheet.absoluteFill, radius]} />;
}

/** Converte lo style (anche in sintassi CSS del web) e ne estrae l'eventuale gradiente. */
function useWebStyle(style: unknown): WebStyleResult {
  if (Array.isArray(style)) return webStyle(StyleSheet.flatten(style as StyleProp<ViewStyle>), Platform.OS === 'web');
  return webStyle(style, Platform.OS === 'web');
}

/**
 * Cella di una griglia che si allunga all'altezza della riga (align-items: stretch): il primo Div/Btn
 * sotto la cella la riceve anche se è dentro un componente (es. <KpiFlashCard/> che rende un Btn).
 */
const GridCellContext = createContext(false);

/**
 * true da quando `need` è stato vero almeno una volta. I Provider di contesto si inseriscono solo se il
 * valore cambia rispetto al genitore (prima: sempre, 2-5 livelli in più per ogni Div e pulsante); una
 * volta inseriti restano, così la struttura cambia al più una volta (un solo rimontaggio dei figli).
 */
function useSticky(need: boolean): boolean {
  const r = useRef(false);
  if (need) r.current = true;
  return r.current;
}

// Figli che in CSS non si allungano all'altezza della riga della griglia
const NO_STRETCH = /(^|\s)(h-|size-|aspect-|self-(start|center|end|baseline))/;
// h-full in una cella: in CSS è l'altezza della riga della griglia (definita dopo il calcolo delle
// tracce). In Yoga la cella non ha altezza definita e il 100% esplode (Dashboard: card alte 25.000 px,
// pagina "vuota" sotto la Classifica). Nella cella h-full diventa quindi "allungati alla riga".
const H_FULL = /(^|\s)h-full(?=\s|$)/g;
const withoutHFull = (cls: string) => cls.replace(H_FULL, ' ');

/**
 * Figli "CSS" di un contenitore: Fragment, <Suspense> e i componenti che non creano elementi nel DOM
 * dell'originale (es. AnimatePresence di framer-motion, segnato con cssTransparent) si aprono, così i
 * loro figli sono celle della griglia come in CSS.
 */
export function cssChildren(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  for (const c of Children.toArray(children)) {
    const t = isValidElement(c) ? (c.type as { cssTransparent?: boolean }) : null;
    const el = c as ReactElement;
    if (t && (el.type === Fragment || el.type === Suspense || t.cssTransparent)) {
      out.push(...cssChildren(((c as ReactElement).props as { children?: ReactNode }).children));
    } else out.push(c);
  }
  return out;
}

/**
 * Figli di una griglia CSS: larghezza 1/cols (o col-span) e gap orizzontale come padding.
 * Come in CSS (align-items: stretch) un Div/Btn figlio diretto si allunga all'altezza della riga.
 */
function gridChildren(children: ReactNode, grid: Grid, className?: string): ReactNode {
  if (grid.rows || hasRowSpan(children)) return <ExplicitGrid grid={grid} className={className}>{children}</ExplicitGrid>;
  if (grid.template) return templateGridRows(children, grid, className);
  const stretch = !/(^|\s)items-(start|center|end|baseline)(\s|$)/.test(className ?? '');
  const n = grid.cols, g = grid.gapX;
  let col = 0;
  return Children.map(wrapText(cssChildren(children)), (child) => {
    if (child == null || typeof child === 'boolean') return child;
    const cls = isValidElement(child) ? String((child as ReactElement<{ className?: string }>).props.className ?? '') : '';
    const span = Math.min(Number(cls.match(/(?:^|\s)col-span-(\d+)/)?.[1] ?? 1), n);
    // in CSS gli elementi assoluti non sono elementi della griglia (niente cella, niente gap)
    if (/(?:^|\s)(hidden|absolute|fixed)(?:\s|$)/.test(cls)) return child;
    if (col + span > n) col = 0;
    // larghezza span/n e padding secondo la colonna: contenuto largo come la traccia CSS
    // ((W − (n−1)·gap)/n) e nessun gap ai bordi, anche se il contenitore ha padding o bordo
    const pad = { paddingLeft: (col * g) / n, paddingRight: ((n - col - span) * g) / n };
    col = (col + span) % n;
    const cell = stretch ? <GridCellContext.Provider value>{child}</GridCellContext.Provider> : child;
    return (
      <View style={{ width: `${(100 * span) / n}%`, ...pad }}>
        {/* colonne strette: il testo controlla le parole spezzate (text.tsx, solo telefono) */}
        {n >= 3 ? <NarrowCellContext.Provider value>{cell}</NarrowCellContext.Provider> : cell}
      </View>
    );
  });
}

const ROW_SPAN = /(?:^|\s)row-span-(\d+)(?=\s|$)/;
const COL_SPAN = /(?:^|\s)col-span-(\d+)(?=\s|$)/;
const classOf = (child: ReactNode) => (isValidElement(child) ? String((child as ReactElement<{ className?: string }>).props.className ?? '') : '');
function hasRowSpan(children: ReactNode): boolean {
  return Children.toArray(children).some((c) => ROW_SPAN.test(classOf(c)));
}

/** Larghezze/altezze delle tracce: px fissi, il resto diviso fra le fr (auto conta come 1fr). */
function trackSizes(tracks: GridTrack[], total: number, gap: number): number[] {
  const fixed = tracks.reduce((s, t) => s + ('px' in t ? t.px : 0), 0);
  const fr = tracks.reduce((s, t) => s + ('fr' in t ? t.fr : 'px' in t ? 0 : 1), 0);
  const free = Math.max(0, total - fixed - gap * (tracks.length - 1));
  return tracks.map((t) => ('px' in t ? t.px : (free * ('fr' in t ? t.fr : 1)) / (fr || 1)));
}

/**
 * Griglia con righe esplicite (gridTemplateRows) o celle row-span-N: posizionamento automatico
 * come in CSS (riga per riga, primo posto libero) e celle assolute dalle misure del contenitore
 * (le righe fr dividono la sua altezza, quindi serve un'altezza definita: es. h-full).
 */
function ExplicitGrid({ grid, className, children }: { grid: Grid; className?: string; children: ReactNode }) {
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const stretch = !/(^|\s)items-(start|center|end|baseline)(\s|$)/.test(className ?? '');
  const outOfFlow: ReactNode[] = [];
  const items: { child: ReactNode; r: number; c: number; rs: number; cs: number }[] = [];
  const cols = grid.template ?? Array.from({ length: grid.cols }, () => ({ fr: 1 } as GridTrack));
  const n = cols.length;
  const taken: boolean[][] = [];
  const free = (r: number, c: number, rs: number, cs: number) => {
    for (let i = r; i < r + rs; i++) for (let j = c; j < c + cs; j++) if (taken[i]?.[j]) return false;
    return true;
  };
  let cr = 0, cc = 0;
  for (const child of Children.toArray(wrapText(cssChildren(children)))) {
    const cls = classOf(child);
    if (/(?:^|\s)(hidden|absolute|fixed)(?:\s|$)/.test(cls)) { outOfFlow.push(child); continue; }
    const cs = Math.min(Number(cls.match(COL_SPAN)?.[1] ?? 1), n);
    const rs = Number(cls.match(ROW_SPAN)?.[1] ?? 1);
    while (cc + cs > n || !free(cr, cc, rs, cs)) { cc++; if (cc + cs > n) { cc = 0; cr++; } }
    for (let i = cr; i < cr + rs; i++) for (let j = cc; j < cc + cs; j++) (taken[i] ??= [])[j] = true;
    items.push({ child, r: cr, c: cc, rs, cs });
    cc += cs;
  }
  const rowCount = Math.max(grid.rows?.length ?? 0, taken.length);
  const rows = Array.from({ length: rowCount }, (_, i) => grid.rows?.[i] ?? ({ fr: 1 } as GridTrack));
  const colW = box ? trackSizes(cols, box.w, grid.gapX) : [];
  const rowH = box ? trackSizes(rows, box.h, grid.gapY) : [];
  const at = (sizes: number[], gap: number, i: number) => sizes.slice(0, i).reduce((s, v) => s + v + gap, 0);
  const span = (sizes: number[], gap: number, i: number, k: number) => sizes.slice(i, i + k).reduce((s, v) => s + v, 0) + gap * (k - 1);
  return (
    <View style={{ width: '100%', height: '100%' }} onLayout={(e) => {
      const { width: w, height: h } = e.nativeEvent.layout;
      if (!box || Math.abs(box.w - w) > 0.5 || Math.abs(box.h - h) > 0.5) setBox({ w, h });
    }}>
      {outOfFlow}
      {box ? items.map(({ child, r, c, rs, cs }, i) => (
        <View key={i} style={{ position: 'absolute', left: at(colW, grid.gapX, c), top: at(rowH, grid.gapY, r), width: span(colW, grid.gapX, c, cs), height: span(rowH, grid.gapY, r, rs) }}>
          {stretch ? <GridCellContext.Provider value>{child}</GridCellContext.Provider> : child}
        </View>
      )) : null}
    </View>
  );
}

const ITEMS_ALIGN: Record<string, ViewStyle['alignItems']> = { start: 'flex-start', center: 'center', end: 'flex-end', baseline: 'baseline', stretch: 'stretch' };

/**
 * Griglia a colonne miste (grid-cols-[1fr_auto]): una riga (View in riga) per ogni gruppo di celle;
 * fr → si allarga in proporzione, auto → larga quanto il contenuto, px → fissa.
 * Le celle assolute/nascoste non occupano posto (come in CSS).
 */
function templateGridRows(children: ReactNode, grid: Grid, className?: string): ReactNode {
  const tracks = grid.template!;
  const align = ITEMS_ALIGN[(className ?? '').match(/(?:^|\s)items-(start|center|end|baseline|stretch)(?=\s|$)/)?.[1] ?? 'stretch'];
  const outOfFlow: ReactNode[] = [];
  const cells: ReactNode[] = [];
  for (const child of Children.toArray(wrapText(cssChildren(children)))) {
    const cls = isValidElement(child) ? String((child as ReactElement<{ className?: string }>).props.className ?? '') : '';
    (/(?:^|\s)(hidden|absolute|fixed)(?:\s|$)/.test(cls) ? outOfFlow : cells).push(child);
  }
  const rows: ReactNode[] = [];
  for (let r = 0; r * tracks.length < cells.length; r++) {
    const row = cells.slice(r * tracks.length, (r + 1) * tracks.length).map((cell, i) => {
      const t = tracks[i];
      const style: ViewStyle = 'fr' in t ? { flexGrow: t.fr, flexShrink: 1, flexBasis: 0, minWidth: 0 } : 'px' in t ? { width: t.px, flexShrink: 0 } : { flexShrink: 0 };
      return <View key={i} style={[style, { justifyContent: 'center' }]}>{cell}</View>;
    });
    rows.push(<View key={`r${r}`} style={{ flexDirection: 'row', columnGap: grid.gapX, alignItems: align, width: '100%' }}>{row}</View>);
  }
  return [...outOfFlow, ...rows];
}

function boxContent(children: ReactNode, grid?: Grid, className?: string) {
  return grid ? gridChildren(children, grid, className) : stickySplit(wrapText(spaceOverrides(children, className)), className);
}

/** Figlio `sticky` (telefono): i fratelli che lo seguono diventano il bersaglio del suo blur (pageLayers). */
function stickySplit(nodes: ReactNode, className?: string): ReactNode {
  if (Platform.OS === 'web' || (className && isFlexRow(className))) return nodes;
  const list = Children.toArray(nodes);
  const i = list.findIndex((c) => isValidElement(c) && isNativeSticky(String((c.props as { className?: unknown }).className ?? '')));
  if (i < 0) return nodes;
  const gap = className?.match(/(?:^|\s)(?:space-y|gap-y|gap(?!-x))-(\S+)/)?.[1];
  return <StickySplit before={list.slice(0, i)} sticky={list[i]} after={list.slice(i + 1)} gap={gap ? spacingPx(gap) : 0} />;
}

const SPACE = /(?:^|\s)space-([xy])-(\S+)/g;
// fuori dal flusso: niente gap col gap di RN, ma in CSS contano come fratello precedente per space-*
const OUT_OF_FLOW = /(?:^|\s)(absolute|fixed)(?:\s|$)/;

/** Margine inline in px (numero o "12px"), altrimenti null. */
function inlinePx(v: unknown): number | null {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && /^-?\d+(\.\d+)?(px)?$/.test(v.trim())) return parseFloat(v);
  return null;
}

/** Margine di space-* destinato alla radice di un componente (vedi spaceOverrides). */
const LeadMarginContext = createContext<{ marginTop?: number; marginLeft?: number } | null>(null);

/** Consuma il margine di LeadMarginContext: lo style inline vince, come in CSS. */
function useLeadMargin(rnStyle: Record<string, any> | undefined): ViewStyle | null {
  const lead = useContext(LeadMarginContext);
  if (!lead) return null;
  const out: ViewStyle = {};
  if (lead.marginTop != null && rnStyle?.marginTop == null && rnStyle?.marginVertical == null && rnStyle?.margin == null) out.marginTop = lead.marginTop;
  if (lead.marginLeft != null && rnStyle?.marginLeft == null && rnStyle?.marginHorizontal == null && rnStyle?.margin == null) out.marginLeft = lead.marginLeft;
  return out;
}

/**
 * space-y-N/space-x-N diventano gap (normalizeClasses), ma in CSS sono margini sui figli: un
 * figlio con marginTop/marginLeft inline (es. style={{ marginTop: 0 }}) li sostituisce.
 * Col gap non si può, quindi al figlio diamo margine − gap. Conta come "figlio precedente" solo
 * un elemento che disegna qualcosa (tag o con className/style): i componenti come PageTitle,
 * che rendono null, non hanno spazio prima del successivo né in CSS né col gap.
 */
/** C'è almeno un elemento dopo la posizione `index` tra i figli `nodes` (null e false non contano)? */
function elementAfter(nodes: ReactNode, index: number): boolean {
  let found = false;
  Children.forEach(nodes, (c, i) => { if (i > index && isValidElement(c)) found = true; });
  return found;
}

function spaceOverrides(children: ReactNode, className?: string): ReactNode {
  if (!className || !className.includes('space-')) return children;
  const gaps: { x?: number; y?: number } = {};
  for (const m of className.matchAll(SPACE)) gaps[m[1] as 'x' | 'y'] = spacingPx(m[2]);
  if (gaps.x == null && gaps.y == null) return children;
  let seen = false;
  let seenInFlow = false;
  const visit = (nodes: ReactNode): ReactNode => Children.map(nodes, (child, index) => {
    if (!isValidElement(child)) return child;
    // i figli di un Fragment (e di <Suspense>, che non crea elementi) in CSS sono fratelli diretti
    if (child.type === Fragment) {
      return <Fragment key={child.key}>{visit((child.props as { children?: ReactNode }).children)}</Fragment>;
    }
    if ((child.type as { cssTransparent?: boolean }).cssTransparent) {
      return cloneElement(child as ReactElement<{ children?: ReactNode }>, undefined, visit((child.props as { children?: ReactNode }).children));
    }
    if (child.type === Suspense) {
      const sp = child.props as { children?: ReactNode; fallback?: ReactNode };
      return <Suspense key={child.key} fallback={sp.fallback}>{visit(sp.children)}</Suspense>;
    }
    const props = child.props as { className?: string; style?: unknown };
    const hadPrev = seen;
    const hadInFlow = seenInFlow;
    const styleTag = !!(child.type as { cssStyleTag?: boolean }).cssStyleTag;
    const drawn = styleTag || typeof child.type === 'string' || props.className != null || props.style != null;
    const outOfFlow = styleTag || OUT_OF_FLOW.test(props.className ?? '');
    if (drawn) { seen = true; if (!outOfFlow) seenInFlow = true; }
    if (!hadPrev && !drawn && child.type === Div && gaps.y != null && !CSS_FLEX.test(className) && elementAfter(nodes, index)) {
      // primo figlio = <div> senza classi: in CSS il margin-bottom del suo ultimo figlio lo attraversa
      // (niente padding/bordo) e collassa col margine di space-y del fratello successivo
      let lastIdx = -1;
      let last: ReactElement<{ className?: string }> | null = null;
      Children.forEach((props as { children?: ReactNode }).children, (k, i) => { if (isValidElement(k)) { lastIdx = i; last = k as ReactElement<{ className?: string }>; } });
      const lastEl = last as ReactElement<{ className?: string }> | null;
      const c = lastEl && typeof lastEl.props.className === 'string' ? collapseFirstMargin(lastEl.props.className, gaps.y) : null;
      seen = true; seenInFlow = true;
      if (!c || !lastEl) return child;
      const kids = Children.map((props as { children?: ReactNode }).children, (k, i) => (i === lastIdx ? cloneElement(lastEl, { className: c.className }) : k));
      return cloneElement(child as ReactElement<{ children?: ReactNode; style?: unknown }>, { style: c.marginBottom != null ? { marginBottom: c.marginBottom } : undefined }, kids);
    }
    if (!drawn && hadPrev && !hadInFlow) {
      // componente senza className/style (es. <SectionHeader/>) primo nel flusso dopo elementi
      // assoluti: il margine lo prende il primo Div/Btn che disegna (se rende null, nessuno)
      seenInFlow = true;
      const lead = { marginTop: gaps.y, marginLeft: gaps.x };
      return <LeadMarginContext.Provider key={child.key} value={lead}>{child}</LeadMarginContext.Provider>;
    }
    if (!hadPrev && drawn && !outOfFlow && gaps.y != null && typeof props.className === 'string' && !CSS_FLEX.test(className)) {
      // primo figlio di un blocco: il suo mb collassa col margine di space-y del successivo
      const c = collapseFirstMargin(props.className, gaps.y);
      if (!c) return child;
      const flat0 = (Array.isArray(props.style) ? StyleSheet.flatten(props.style as StyleProp<ViewStyle>) : (props.style ?? {})) as Record<string, unknown>;
      const style = c.marginBottom != null && inlinePx(flat0.marginBottom) == null ? { ...flat0, marginBottom: c.marginBottom } : props.style;
      return cloneElement(child as ReactElement<{ className?: string; style?: unknown }>, { className: c.className, style });
    }
    if (!hadPrev || !drawn || outOfFlow) return child;
    // in CSS il selettore di space-* è più specifico di mt-*/mb-*: sui figli dopo il primo li annulla
    const cls = typeof props.className === 'string' ? stripSpacedMargins(props.className, gaps) : props.className;
    if (cls !== props.className) child = cloneElement(child as ReactElement<{ className?: string }>, { className: cls });
    const flat = (Array.isArray(props.style) ? StyleSheet.flatten(props.style as StyleProp<ViewStyle>) : (props.style ?? {})) as Record<string, unknown>;
    const fix: Record<string, number> = {};
    const mt = inlinePx(flat.marginTop);
    const ml = inlinePx(flat.marginLeft);
    if (!hadInFlow) {
      // primo figlio nel flusso dopo soli elementi assoluti (es. la riga decorativa in cima a una
      // scheda): il gap non c'è, ma in CSS il margine sì (lo style inline lo sostituisce)
      if (gaps.y != null && mt == null) fix.marginTop = gaps.y;
      if (gaps.x != null && ml == null) fix.marginLeft = gaps.x;
    } else if (gaps.y != null && !CSS_FLEX.test(className) && child.type === Span && !BOXY.test(String(cls ?? '')) && !hasBoxyChild((props as { children?: ReactNode }).children)) {
      // <span> in linea in un blocco space-y: in CSS il margin-top non vale sugli elementi in linea
      // (la riga parte subito sotto al fratello); col gap di RN ci sarebbe
      fix.marginTop = -gaps.y;
      if (gaps.x != null && ml != null) fix.marginLeft = ml - gaps.x;
    } else {
      if (gaps.y != null && mt != null) fix.marginTop = mt - gaps.y;
      if (gaps.x != null && ml != null) fix.marginLeft = ml - gaps.x;
    }
    return Object.keys(fix).length ? cloneElement(child as ReactElement<{ style?: unknown }>, { style: { ...flat, ...fix } }) : child;
  });
  return visit(children);
}

// In CSS gli elementi flex hanno flex-shrink: 1 di default, in RN 0: lo ripristiniamo
// (salvo classi che lo decidono esplicitamente), ma solo se il genitore è flex in CSS:
// i figli di un blocco non si restringono (FlexParentContext).
// (anche la griglia: i suoi figli sono "bloccati" come gli elementi flex, niente righe in linea)
const CSS_FLEX = /(^|\s)(?:max-sm:)?(flex|inline-flex|grid)(\s|$)/;
const SHRINK_CLASS = /(^|\s)(shrink-0|flex-shrink-0|flex-none|shrink|flex-shrink|flex-1|flex-auto|flex-initial|grow|flex-grow)(\s|$)/;

// Elementi "in linea a blocco" (inline-flex, inline-block): in un blocco sono larghi quanto il
// contenuto e li posiziona il text-align del contenitore (in RN si allungherebbero a tutta riga).
const INLINE_LEVEL = /(^|\s)(inline-flex|inline-block|inline-grid)(\s|$)/;
const OWN_MARGIN_Y = /(^|\s)-?m[tyb]?-\S+/;

/** Padding + bordo inferiori dalle classi (p-, py-, pb-, border, border-b): la linea di base sta sopra. */
function bottomInset(cls: string): number {
  let pad = 0, border = 0;
  for (const c of cls.split(/\s+/)) {
    let m: RegExpMatchArray | null;
    if ((m = c.match(/^p[yb]?-(.+)$/))) pad = spacingPx(m[1]);
    else if (c === 'border' || c === 'border-b') border = 1;
    else if ((m = c.match(/^border(?:-b)?-(\d)$/))) border = Number(m[1]);
  }
  return pad + border;
}

/**
 * inline-flex / inline-block / <button> in linea dentro un blocco: in CSS stanno in una riga alta
 * almeno quanto lo strut del contenitore, allineati sulla linea di base (inlineBlockMargins).
 * Misura l'altezza del box e restituisce i margini che lo mettono a posto nella riga.
 */
function useInlineBlockStrut(enabled: boolean, inherited: string, text: string, cls: string, onLayout?: (e: LayoutChangeEvent) => void) {
  const [h, setH] = useState<number | null>(null);
  const handle = useCallback((e: LayoutChangeEvent) => {
    onLayout?.(e);
    const nh = Math.round(e.nativeEvent.layout.height * 100) / 100;
    if (enabled && nh !== h) setH(nh);
  }, [onLayout, enabled, h]);
  if (!enabled) return { style: null, onLayout };
  if (h == null) return { style: null, onLayout: handle };
  const parentSize = fontSizeOf(inherited), parentLh = inheritedLineHeight(inherited, parentSize);
  const own = cn(inherited, text);
  const size = fontSizeOf(own), lh = inheritedLineHeight(own, size);
  return { style: inlineBlockMargins(parentSize, parentLh, size, lh, h, bottomInset(cls)) as ViewStyle, onLayout: handle };
}
const SELF = /(^|\s)self-/;

function inlineAlign(inherited: string): 'flex-start' | 'center' | 'flex-end' {
  let align: 'flex-start' | 'center' | 'flex-end' = 'flex-start';
  for (const c of inherited.split(/\s+/)) {
    if (c === 'text-center') align = 'center';
    else if (c === 'text-right' || c === 'text-end') align = 'flex-end';
    else if (c === 'text-left' || c === 'text-start') align = 'flex-start';
  }
  return align;
}

// ring-* (webClasses): boxShadow, salvo che lo style della pagina ne dia uno (in CSS lo style inline vince)
const ringCache = new Map<string, ViewStyle>();
function ringShadow(ring: string): ViewStyle {
  let v = ringCache.get(ring);
  if (!v) { v = { boxShadow: ring } as ViewStyle; ringCache.set(ring, v); }
  return v;
}

const MX_AUTO = /(^|\s)mx-auto(\s|$)/;
const OWN_WIDTH = /(^|\s)(w-|size-|absolute(\s|$)|fixed(\s|$))/;
const POSITIONED = /(^|\s)(relative|absolute|sticky)(\s|$)/;
const Z_CLASS = /(^|\s)(?:[a-z0-9-]+:)*-?z-/;
// anche transform crea un contesto di sovrapposizione: si disegna con i posizionati, nell'ordine del codice
const TRANSFORMED = /(^|\s)-?(translate-[xy]|scale|rotate|skew)-/;
const hasTransform = (rawClass: string, style?: Record<string, any>) =>
  TRANSFORMED.test(rawClass) || (Array.isArray(style?.transform) ? style.transform.length > 0 : style?.transform != null && style.transform !== 'none');

function boxStyle(layout: ParentLayout, inherited: string, rawClass: string | undefined, grid?: Grid, className?: string, style?: Record<string, any>, gridCell = false) {
  const base: Record<string, any> = grid ? { rowGap: grid.gapY } : {};
  if (layout === 'flex' && !SHRINK_CLASS.test(className ?? '') && style?.flexShrink == null && style?.flex == null) base.flexShrink = 1;
  if (gridCell && !NO_STRETCH.test(withoutHFull(rawClass ?? '')) && style?.flexGrow == null && style?.flex == null) base.flexGrow = 1;
  // ordine di disegno CSS: gli elementi posizionati (o trasformati) stanno sopra ai fratelli non posizionati
  // (in RN-web tutte le View sono relative e conta solo l'ordine nel codice)
  if ((POSITIONED.test(rawClass ?? '') || hasTransform(rawClass ?? '', style)) && !Z_CLASS.test(rawClass ?? '') && style?.zIndex == null) base.zIndex = 1;
  // blocco con mx-auto: in CSS largo quanto il contenitore (fino a max-w) e centrato; in Yoga i margini auto
  // lo stringerebbero al contenuto
  if (layout === 'block' && MX_AUTO.test(rawClass ?? '') && !OWN_WIDTH.test(rawClass ?? '') && !INLINE_LEVEL.test(rawClass ?? '') && style?.width == null) base.width = '100%';
  if (layout === 'block' && INLINE_LEVEL.test(rawClass ?? '') && !SELF.test(rawClass ?? '') && style?.alignSelf == null) {
    base.alignSelf = inlineAlign(inherited);
  }
  return base;
}

/** Classi e style di testo del contenitore per i figli (cascata CSS). */
/** Classi e style di testo per i figli (contesti), chiamata dentro Div/Btn: prima era un componente a
 *  sé in ogni elemento (un livello in più da costruire per ogni Div e pulsante). */
function textInherit(inheritedStyle: Record<string, any>, inherited: string, text: string, style: Record<string, any>, children: ReactNode): ReactNode {
  const nextStyle = nextTextStyle(inheritedStyle, text, style);
  const withStyle = nextStyle === inheritedStyle ? children : <TextStyleContext.Provider value={nextStyle}>{children}</TextStyleContext.Provider>;
  return text ? <TextClassContext.Provider value={textClassesFor(inherited, text)}>{withStyle}</TextClassContext.Provider> : withStyle;
}

/** Testo dei figli (per rimisurare quando cambia il contenuto). */
function textSignature(children: ReactNode): string {
  let out = '';
  Children.forEach(children, (c) => {
    if (typeof c === 'string' || typeof c === 'number') out += c;
    else if (isValidElement(c)) out += textSignature((c.props as { children?: ReactNode }).children);
  });
  return out;
}

// In CSS un flex item ha min-width: auto: non si restringe sotto la larghezza del contenuto
// (con testo su una riga la riga sborda invece di troncare). In RN si restringe e il testo si
// tronca. Per gli elementi whitespace-nowrap (es. tutti i Button): primo layout alla larghezza
// naturale, poi quella larghezza diventa minWidth. Non vale con overflow nascosto/truncate
// (lì anche in CSS min-width: auto = 0) o con larghezza esplicita.
const NOWRAP = /(^|\s)whitespace-nowrap(\s|$)/;
const NO_MIN_CONTENT = /(^|\s)(truncate|overflow-hidden|overflow-x-auto|overflow-auto|min-w-\S+|w-\S+|size-\S+|basis-\S+|flex-none|shrink-0|flex-shrink-0)(\s|$)/;

function useMinContentWidth(className: string | undefined, style: Record<string, any> | undefined, children: ReactNode, onLayout?: (e: LayoutChangeEvent) => void, inRow = false) {
  const enabled = NOWRAP.test(className ?? '') && !NO_MIN_CONTENT.test(className ?? '')
    && style?.width == null && style?.minWidth == null && style?.flexShrink !== 0;
  // in una riga flex minWidth = larghezza naturale equivale a non restringersi: niente misura e
  // niente secondo disegno (fuori dalle righe la misura serve: il genitore può essere più stretto)
  const rowStatic = enabled && inRow;
  const signature = enabled && !rowStatic ? textSignature(children) : '';
  const [measured, setMeasured] = useState<{ sig: string; width: number } | null>(null);
  const measuring = enabled && measured?.sig !== signature;
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    onLayout?.(e);
    if (measuring) setMeasured({ sig: signature, width: Math.ceil(e.nativeEvent.layout.width) });
  }, [onLayout, measuring, signature]);
  if (!enabled) return { minStyle: null, onLayout, enabled };
  if (rowStatic) return { minStyle: RIGID_BTN, onLayout, enabled };
  const minStyle = measuring
    ? { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' as const, alignSelf: 'flex-start' as const }
    : { minWidth: measured!.width };
  return { minStyle, onLayout: handleLayout, enabled };
}

// min-width: auto anche per gli altri flex item di una riga: un Div senza testo che possa andare a capo
// (solo icone, pulsanti di una parola, select, contenitori di questi) non si restringe sotto la sua
// larghezza naturale, come in CSS; quello col testo sì (es. un titolo accanto a dei controlli va a capo
// invece di spingere fuori i controlli). Il testo lo dice con WrapProbeContext (text.tsx).
const FlexRowContext = createContext(false);
const FLEX_COL = /(^|\s)(?:max-sm:)?flex-col(-reverse)?(\s|$)/;
const FLEX_ROW = /(^|\s)(?:max-sm:)?(flex|inline-flex)(\s|$)/;
const FLEX_WRAP = /(^|\s)flex-wrap(\s|$)/;
const OUT_OF_FLOW_CLASS = /(^|\s)(absolute|fixed|hidden)(\s|$)/;
const isFlexRow = (cls: string) => FLEX_ROW.test(cls) && !FLEX_COL.test(cls);

const RIGID_BTN = { flexShrink: 0 };
const WEB_MIN_CONTENT = { minWidth: 'min-content' } as unknown as ViewStyle;

/**
 * min-width: auto (CSS) di un pulsante in una riga flex con testo che va a capo: non si restringe sotto
 * la sua larghezza min-content (parola più lunga). Web: la regola CSS. Telefono: un layout alla larghezza
 * naturale, il testo dice la sua larghezza e quella della parola più lunga (MinContentProbeContext,
 * text.tsx), minWidth = naturale − testo + parola.
 */
function useButtonMinContent(enabled: boolean, children: ReactNode, onLayout?: (e: LayoutChangeEvent) => void) {
  const web = Platform.OS === 'web';
  const sig = enabled && !web ? textSignature(children) : '';
  const [done, setDone] = useState<{ sig: string; min: number } | null>(null);
  const measuring = enabled && !web && done?.sig !== sig;
  const acc = useRef<{ w?: number; text?: number; word?: number }>({});
  if (measuring && acc.current.w === undefined && acc.current.text === undefined) acc.current = {};
  const finish = () => {
    const a = acc.current;
    if (a.w != null && a.text != null && a.word != null) setDone({ sig, min: Math.ceil(a.w - a.text + a.word) });
  };
  const probe = useMemo<MinContentProbe | null>(() => (measuring ? { report: (text, word) => { acc.current.text = text; acc.current.word = word; finish(); } } : null), [measuring, sig]); // eslint-disable-line react-hooks/exhaustive-deps
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    onLayout?.(e);
    if (measuring) { acc.current.w = e.nativeEvent.layout.width; finish(); }
  }, [onLayout, measuring, sig]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!enabled) return { style: null, onLayout, probe: null };
  if (web) return { style: WEB_MIN_CONTENT, onLayout, probe: null };
  if (measuring) return { style: MEASURE_NATURAL, onLayout: handleLayout, probe };
  return { style: { minWidth: done!.min }, onLayout, probe: null };
}
const MEASURE_NATURAL = { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' as const };
const SIZED = /(^|\s)(w|h|size)-/;
/** Contenuto che in CSS non va mai a capo: testi di una parola, icone con dimensione, Span/P con questi. */
function unbreakableContent(children: ReactNode): boolean {
  let ok = true;
  Children.forEach(children, (c) => {
    if (!ok || c == null || typeof c === 'boolean') return;
    if (typeof c === 'string' || typeof c === 'number') { if (/\S\s+\S/.test(String(c).trim())) ok = false; return; }
    if (!isValidElement(c)) { ok = false; return; }
    const p = c.props as { children?: ReactNode; className?: string };
    if (c.type === Fragment || c.type === Span || c.type === P) { ok = unbreakableContent(p.children); return; }
    // icona (componente senza figli con dimensioni nelle classi)
    if (p.children == null && SIZED.test(p.className ?? '')) return;
    ok = false;
  });
  return ok;
}

// Elemento di una riga flex senza larghezza propria: in CSS (min-width: auto) non si stringe sotto il
// contenuto, salvo che dentro ci sia testo che può andare a capo (o un flex-wrap): allora si stringe.
// Parte già rigido (flexShrink 0, come il minWidth = larghezza del contenuto che si misurava prima);
// i discendenti flessibili lo segnalano mentre si disegnano (WrapProbeContext) e un effect lo rende
// restringibile subito dopo (come prima, quando arrivava la misura dal layout). Prima: primo disegno,
// misura, onLayout dal nativo e secondo disegno per OGNI elemento di riga (circa metà dei disegni).
const RIGID_STYLE: ViewStyle = { flexShrink: 0 };
function useRigidMinWidth(enabled: boolean, children: ReactNode, onLayout?: (e: LayoutChangeEvent) => void) {
  const parent = useContext(WrapProbeContext);
  const probe = useRef<WrapProbe | null>(null);
  if (enabled && !probe.current) {
    const p: WrapProbe = { flexible: false, mark: () => { p.flexible = true; parent?.mark(); } };
    probe.current = p;
  }
  const signature = enabled ? textSignature(children) : '';
  // testo cambiato: i discendenti si ridisegnano e lo ridicono
  const lastSig = useRef<string | null>(null);
  if (enabled && probe.current && lastSig.current !== signature) probe.current.flexible = false;
  const [flexible, setFlexible] = useState(false);
  // dopo il disegno e in una transition (interrompibile): un aggiornamento sincrono qui (layout
  // effect) costringeva a finire in un colpo solo il montaggio a pezzi delle pagine precaricate
  // (Weekend: un blocco unico di 5,6 s sull'emulatore)
  // PORT: da disattivo gira una volta sola (prima un effect a ogni disegno per ogni Div); da attivo a ogni
  // disegno come prima (un discendente nuovo a testo invariato deve rimarcare la sonda)
  useEffect(() => {
    if (!enabled) return;
    lastSig.current = signature;
    const f = !!probe.current?.flexible;
    if (f !== flexible) startTransition(() => setFlexible(f));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled ? {} : false]);
  if (!enabled) return { minStyle: null, onLayout, probe: null };
  return { minStyle: flexible ? null : RIGID_STYLE, onLayout, probe: probe.current };
}

/** style={{ gridTemplateColumns: '1fr 80px 60px' }} su un `grid`: come la classe grid-cols-[1fr_80px_60px]. */
function withStyleGrid(rest: string, style: unknown): string {
  const t = style && typeof style === 'object' && !Array.isArray(style) ? (style as { gridTemplateColumns?: unknown }).gridTemplateColumns : undefined;
  if (typeof t !== 'string' || !/(^|\s)grid(\s|$)/.test(rest)) return rest;
  const cols = expandGridTemplate(t);
  // repeat(N, 1fr): colonne uguali come grid-cols-N
  const tracks = parseGridTemplate(cols);
  if (tracks && tracks.every((x) => 'fr' in x && x.fr === 1)) return `${rest} grid-cols-${tracks.length}`;
  return tracks ? `${rest} grid-cols-[${cols}]` : rest;
}

/** style={{ gridTemplateRows: 'repeat(5, 1fr)' }}: righe esplicite della griglia (ExplicitGrid). */
function withStyleRows(grid: Grid | undefined, style: unknown): Grid | undefined {
  const t = grid && style && typeof style === 'object' && !Array.isArray(style) ? (style as { gridTemplateRows?: unknown }).gridTemplateRows : undefined;
  const rows = typeof t === 'string' ? parseGridTemplate(expandGridTemplate(t)) : null;
  return rows ? { ...grid!, rows } : grid;
}

// View animata che accetta className (NativeWind registra solo View, non Animated.View)
const AnimatedBox = Animated.createAnimatedComponent(View);
cssInterop(AnimatedBox, { className: 'style' });

type DivProps = Omit<ViewProps, keyof WebGestureProps> & WebGestureProps & {
  className?: string; children?: ReactNode;
  /** Stile Animated (ui/motion.tsx): l'elemento diventa un Animated.View. */
  animatedStyle?: any;
  ref?: Ref<View>;
};

// ── overflow-*-auto sul telefono ─────────────────────────────────────────────
// Sul web una View con overflow auto scorre (CSS); su Android/iOS no: lì diventa una ScrollView.
// Le classi/stili che dispongono i figli (padding, gap, direzione, allineamento) vanno sul
// contenitore del contenuto, il resto (dimensioni, bordi, sfondo, posizione) sulla ScrollView.
const SCROLL_Y = /(^|\s)overflow(-y)?-(auto|scroll)(\s|$)/;
const SCROLL_X = /(^|\s)overflow-x-(auto|scroll)(\s|$)/;
const CONTENT_CLASS = /^(p[xytrblse]?-|gap-|flex-(row|col|wrap|nowrap)|items-|justify-|content-|divide-)/;
const CONTENT_STYLE = /^(padding|gap|rowGap|columnGap|flexDirection|flexWrap|alignItems|justifyContent|alignContent)/;

function scrollAxis(className: string): 'x' | 'y' | null {
  if (Platform.OS === 'web') return null;
  if (SCROLL_Y.test(className)) return 'y';
  if (SCROLL_X.test(className)) return 'x';
  return null;
}

/** onScroll del web (e.target.scrollTop...) a partire dall'evento della ScrollView. */
function webScrollHandler(onScroll: ((e: any) => void) | undefined) {
  if (!onScroll) return undefined;
  return (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const target = {
      scrollTop: contentOffset.y, scrollLeft: contentOffset.x, scrollHeight: contentSize.height, scrollWidth: contentSize.width,
      clientHeight: layoutMeasurement.height, clientWidth: layoutMeasurement.width,
    };
    onScroll({ ...e, target, currentTarget: target });
  };
}

/**
 * Ref della ScrollView con l'API del DOM usata dalle pagine: scrollTo({ left, top, behavior }),
 * scrollBy, scrollLeft/scrollTop (anche in scrittura). Il resto (offsetWidth, offsetLeft... della
 * nuova architettura di RN, scrollTo(x, y) di RN) passa alla ScrollView.
 */
function domScrollRef(view: ScrollView, offset: { x: number; y: number }) {
  const to = (x: number, y: number, animated = false) => view.scrollTo({ x: Math.max(0, x), y: Math.max(0, y), animated });
  return new Proxy(view as any, {
    get(target, prop) {
      if (prop === 'scrollLeft') return offset.x;
      if (prop === 'scrollTop') return offset.y;
      if (prop === 'scrollTo' || prop === 'scrollBy') {
        return (a?: any, b?: any, c?: any) => {
          const by = prop === 'scrollBy';
          if (a && typeof a === 'object' && ('left' in a || 'top' in a)) {
            const x = a.left == null ? (by ? 0 : offset.x) : a.left;
            const y = a.top == null ? (by ? 0 : offset.y) : a.top;
            return to(by ? offset.x + x : x, by ? offset.y + y : y, a.behavior === 'smooth');
          }
          if (typeof a === 'number' && typeof b === 'number' && c === undefined) return to(by ? offset.x + a : a, by ? offset.y + b : b); // scrollTo(x, y) del DOM
          return by ? undefined : target.scrollTo(a, b, c);
        };
      }
      const v = Reflect.get(target, prop);
      return typeof v === 'function' ? v.bind(target) : v;
    },
    set(target, prop, value) {
      if (prop === 'scrollLeft') { to(Number(value), offset.y); return true; }
      if (prop === 'scrollTop') { to(offset.x, Number(value)); return true; }
      return Reflect.set(target, prop, value);
    },
  });
}

// Android, scorrimento orizzontale (barre delle tab, chip): finché lo scroller nativo non ha finito,
// HorizontalScrollView si prende il tocco (lo usa per fermare lo scorrimento) e il pulsante sotto il
// dito non riceve il tap. Lo scroller resta "in corso" ben oltre il movimento visibile: la coda lenta
// del lancio (sub-pixel) e, al bordo sinistro, un rimbalzo invisibile di mezza larghezza (fling di RN
// con overX). Risultato: dopo uno scorrimento il primo tap su una tab andava perso. Qui lo scroller si
// ferma (scrollTo senza animazione = abortAnimation) appena il contenuto arriva a un bordo o rallenta
// sotto FLING_STOP_SPEED; niente effetto di bordo (overScrollMode never: anche sul web un div interno
// non lo mostra). Prova: tests/emulatore/pr/08-sticky-tap.
const FLING_STOP = Platform.OS === 'android' && process.env.EXPO_PUBLIC_TEST_NO_FLINGSTOP !== '1';
const FLING_STOP_SPEED = 0.15; // dp/ms: da qui al termine il contenuto si sposta solo di pochi dp

function ScrollBox({ axis, box, style, children, onScroll, ref, ...props }: Omit<ViewProps, 'style'> & {
  axis: 'x' | 'y'; box: string; style: Record<string, any>; children: ReactNode; onScroll?: (e: any) => void; ref?: Ref<unknown>;
}) {
  const offset = useRef({ x: 0, y: 0 }).current;
  const viewRef = useRef<ScrollView | null>(null);
  const fling = useRef({ on: false, x: 0, t: 0, max: 0, last: 0 }).current;
  const flingStop = FLING_STOP && axis === 'x';
  const setRef = useCallback((view: ScrollView | null) => {
    viewRef.current = view;
    const value = view ? domScrollRef(view, offset) : null;
    if (typeof ref === 'function') ref(value);
    else if (ref) (ref as { current: unknown }).current = value;
  }, [ref, offset]);
  const stopAt = useCallback((x: number) => {
    if (TEST_DIAG) console.log(`VIBRA hscroll ferma x=${Math.round(x)}`);
    fling.on = false;
    viewRef.current?.scrollTo({ x, y: 0, animated: false });
  }, [fling]);
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    offset.x = contentOffset.x;
    offset.y = contentOffset.y;
    if (TEST_DIAG) fling.last = performance.now();
    const max = Math.max(0, contentSize.width - layoutMeasurement.width);
    fling.max = max;
    if (flingStop && fling.on) {
      const t = (e.nativeEvent as { timestamp?: number }).timestamp ?? performance.now();
      const x = contentOffset.x;
      const speed = fling.t && t > fling.t ? Math.abs(x - fling.x) / (t - fling.t) : Infinity;
      const dir = Math.sign(x - fling.x);
      fling.x = x;
      fling.t = t;
      if (x <= 0.5 || x >= max - 0.5 || speed < FLING_STOP_SPEED) {
        // posizione dell'evento più il tratto percorso nel frattempo (qualche dp: niente salto indietro)
        stopAt(x <= 0.5 ? 0 : x >= max - 0.5 ? max : Math.min(max, Math.max(0, x + dir * Math.min(speed * 32, 6))));
      }
    }
    webScrollHandler(onScroll)?.(e);
  }, [onScroll, offset, fling, flingStop, stopAt]);
  // lancio che parte già a un bordo (dito rilasciato con il contenuto fermo al bordo): nessun evento di
  // scroll arriverà, lo scroller va fermato subito. A fine lancio (posizione ferma da qualche frame)
  // si ferma comunque ciò che resta dello scroller.
  const onMomentumScrollBegin = useCallback(() => {
    if (TEST_DIAG) console.log(`VIBRA hscroll lancio x=${Math.round(offset.x)}`);
    fling.on = true;
    fling.t = 0;
    if (offset.x <= 0.5) stopAt(0);
    else if (offset.x >= fling.max - 0.5) stopAt(fling.max);
  }, [fling, offset, stopAt]);
  const onMomentumScrollEnd = useCallback(() => { if (fling.on) stopAt(offset.x); }, [fling, offset, stopAt]);
  const { onTouchStart } = props;
  const diagTouchStart = useCallback((e: GestureResponderEvent) => {
    const n = e.nativeEvent;
    console.log(`VIBRA hscroll tocco dopo=${fling.last ? Math.round(performance.now() - fling.last) : -1}ms lancio=${fling.on ? 1 : 0} x=${Math.round(offset.x)} page=${Math.round(n.pageX)},${Math.round(n.pageY)} loc=${Math.round(n.locationX)},${Math.round(n.locationY)} target=${(n.target as any)?.__nativeTag ?? (n.target as any)?._nativeTag ?? n.target}`);
    onTouchStart?.(e);
  }, [fling, offset, onTouchStart]);
  // build di test: cosa succede al tocco (fine, annullato dal nativo, la ScrollView prende il tocco)
  const diag = useMemo(() => (TEST_DIAG && axis === 'x' ? {
    onTouchEnd: () => console.log('VIBRA hscroll fine-tocco'),
    onTouchCancel: () => console.log('VIBRA hscroll tocco-annullato'),
    onResponderGrant: () => console.log('VIBRA hscroll prende-il-tocco'),
    onResponderTerminate: () => console.log('VIBRA hscroll perde-il-tocco'),
  } : null), [axis]);
  const outer: string[] = [];
  const inner: string[] = [];
  for (const c of box.split(/\s+/)) {
    if (!c || /^overflow/.test(c)) continue;
    (CONTENT_CLASS.test(c) ? inner : outer).push(c);
  }
  const outerStyle: Record<string, any> = {};
  const innerStyle: Record<string, any> = {};
  for (const [k, v] of Object.entries(style)) {
    if (k === 'marginHorizontal' && style.rowGap != null) innerStyle[k] = v; // griglia: margini negativi del contenuto
    else (CONTENT_STYLE.test(k) ? innerStyle : outerStyle)[k] = v;
  }
  return (
    <ScrollView
      {...props}
      ref={setRef}
      horizontal={axis === 'x'}
      className={outer.join(' ')}
      contentContainerClassName={inner.join(' ')}
      style={outerStyle}
      contentContainerStyle={innerStyle}
      onScroll={handleScroll}
      onMomentumScrollBegin={flingStop ? onMomentumScrollBegin : undefined}
      onMomentumScrollEnd={flingStop ? onMomentumScrollEnd : undefined}
      onTouchStart={TEST_DIAG && axis === 'x' ? diagTouchStart : onTouchStart}
      {...diag}
      overScrollMode={flingStop ? 'never' : undefined}
      scrollEventThrottle={16}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

// backdrop-filter: blur(...) (style o classi backdrop-blur-*): sfondo sfocato della pagina dietro.
// Sul web è CSS vero; sul telefono una BlurView di expo-blur dietro ai figli.
const BLUR_CLASS_PX: Record<string, number> = { none: 0, sm: 4, '': 8, md: 12, lg: 16, xl: 24, '2xl': 40, '3xl': 64 };

function backdropBlur(className: string, style: unknown): { css?: string; px: number } | null {
  const raw = (Array.isArray(style) ? StyleSheet.flatten(style as StyleProp<ViewStyle>) : style) as Record<string, unknown> | undefined;
  const css = (raw?.backdropFilter ?? raw?.WebkitBackdropFilter) as string | undefined;
  if (typeof css === 'string') {
    const m = css.match(/blur\((\d+(?:\.\d+)?)px\)/);
    return { css, px: m ? Number(m[1]) : 0 };
  }
  const c = className.match(/(?:^|\s)backdrop-blur(?:-(none|sm|md|lg|xl|2xl|3xl|\[(\d+)px\]))?(?=\s|$)/);
  if (!c) return null;
  return { px: c[2] ? Number(c[2]) : BLUR_CLASS_PX[c[1] ?? ''] };
}

/** Un antenato ha uno sfondo pieno: dietro al vetro c'è solo quello (CSS), non la pagina sotto al portale. */
const OpaqueBehindContext = createContext(false);
const OPAQUE_BG = /(^|\s)bg-(background|card|popover)(\s|$)/;

function BlurFill({ px }: { px: number }) {
  // bersaglio (pageLayers): dentro una barra sticky ciò che le scorre sotto; fuori dalla pagina
  // (portale alla radice) la pagina; dentro la pagina nessuno (velo semitrasparente)
  const sticky = useContext(StickyBlurTargetContext);
  const inPortal = useContext(InPortalContext);
  const opaqueBehind = useContext(OpaqueBehindContext);
  const tooTall = useContext(StickyBlurTooTallContext);
  const page = usePageBlurTarget();
  if (px && tooTall) return <View pointerEvents="none" style={TALL_VEIL} />;
  if (!px || (opaqueBehind && !sticky)) return null;
  return <NativeBlur intensity={Math.min(100, px * 4)} target={sticky ?? (inPortal ? page : null)} />;
}

// barra sticky su un contenuto troppo alto da sfocare (pageLayers): velo quasi pieno col colore della
// pagina, così le righe sotto non si leggono attraverso il vetro
const TALL_VEIL = [StyleSheet.absoluteFill, { backgroundColor: themeColor('background/92') }];

const FIXED = /(^|\s)fixed(\s|$)/;
const WEB_FIXED = { position: 'fixed' } as unknown as ViewStyle;

// Breakpoint di Tailwind (min-width)
const BREAKPOINT_PX: Record<string, number> = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };
const SHOWN_AT = /(?:^|\s)(sm|md|lg|xl|2xl):(block|flex|grid|inline-flex|inline-block|inline|table|contents)(?=\s|$)/g;

/** "hidden sm:block" su uno schermo più stretto di sm: nascosto (es. le versioni desktop delle tabelle). */
export function hiddenAtWidth(className: string, width: number): boolean {
  if (!/(^|\s)hidden(\s|$)/.test(className)) return false;
  let min = Infinity;
  for (const m of className.matchAll(SHOWN_AT)) min = Math.min(min, BREAKPOINT_PX[m[1]]);
  return width < min;
}

const HIDDEN_VIEW_STYLE: ViewStyle = { display: 'none' };

export function Div(props: DivProps) {
  // Sul telefono un ramo nascosto per la larghezza ("hidden", "hidden sm:flex": versioni desktop di
  // tabelle, date, etichette) non si costruisce nemmeno: sul web lo nasconde il CSS, qui costerebbe
  // come se fosse visibile. Prima si eseguivano comunque tutti gli hook di DivBox e poi si restituiva
  // una View vuota; ora si decide qui, prima di qualunque lavoro.
  if (Platform.OS !== 'web' && props.className && hiddenAtWidth(props.className, cssViewport.width)) return <View style={HIDDEN_VIEW_STYLE} />;
  // position: sticky sul telefono (pageLayers): l'elemento segue lo scroll della pagina
  if (Platform.OS !== 'web') {
    const anim = cssAnimationOf(props.className);
    if (anim) return <CssAnimatedDiv kind={anim} {...props} />;
  }
  return isNativeSticky(props.className) ? <StickyDiv {...props} /> : <DivBox {...props} />;
}

/** animate-spin / animate-pulse (ui/cssAnimation): driver nativo, ferme a schermata nascosta, non Reanimated. */
function CssAnimatedDiv({ kind, className, animatedStyle, ...props }: DivProps & { kind: CssAnimationKind }) {
  const anim = useCssAnimation(kind);
  const merged = useMemo(() => (animatedStyle ? [animatedStyle, anim] : anim), [animatedStyle, anim]);
  return <Div {...props} className={withoutCssAnimation(className ?? '')} animatedStyle={merged} />;
}

function StickyDiv({ animatedStyle, onLayout, ref: outerRef, ...props }: DivProps) {
  const pin = useStickyPin(props.className ?? '');
  const setRef = useCallback((node: View | null) => {
    (pin.ref as { current: View | null }).current = node;
    if (typeof outerRef === 'function') outerRef(node);
    else if (outerRef) (outerRef as { current: View | null }).current = node;
  }, [pin.ref, outerRef]);
  const handleLayout = useCallback((e: LayoutChangeEvent) => { pin.onLayout(e); onLayout?.(e); }, [pin, onLayout]);
  return <DivBox {...props} ref={setRef} onLayout={handleLayout} animatedStyle={[animatedStyle, pin.style, STICKY_NO_TOP]} />;
}
// In CSS `top` di uno sticky vale solo da incollato; in RN l'elemento resta relative e `top` lo spostava
// SEMPRE in giù (top-[env(safe-area-inset-top)]: buco sopra la barra e contenuto sotto coperto, da non
// incollata). La distanza da incollato la usa già useStickyPin (stickyTop).
const STICKY_NO_TOP = { top: 0 } as const;

function DivBox(p: DivProps) {
  if (!TEST_DIAG) return DivBoxImpl(p);
  const t = performance.now();
  try { return DivBoxImpl(p); } finally { diagTime('div-corpo', performance.now() - t); }
}

function DivBoxImpl({ className, children, style, onLayout, animatedStyle, ...all }: DivProps) {
  diagCount('div', className);
  // tipo scelto al montaggio (ui/classStyleCache): vedi sotto
  const captureMode = useRef<boolean | null>(null);
  const [handlers, props0] = splitGestureProps(all);
  // el.style.xxx = ... del codice web sul ref: istanza nativa con `style` (ui/domStyle)
  // id: sul web attributo del DOM (getElementById vero), sul telefono registrato (ui/domStyle)
  const elementId = (props0 as { id?: string }).id;
  const domRef = useDomStyleRef((props0 as { ref?: never }).ref, elementId);
  const props = (props0 as { ref?: unknown }).ref || elementId ? { ...props0, ref: domRef } : props0;
  const gestures = useWebGestures(handlers);
  const inherited = useContext(TextClassContext);
  const inheritedStyle = useContext(TextStyleContext);
  const layout = useContext(FlexParentContext);
  const [text, classRest] = splitTextClasses(className);
  const rest = withStyleGrid(classRest, style);
  const { box: box0, grid: classGrid, gradient: classGradient, ring, viewport } = normalizeClasses(rest);
  const ringStyle = ring ? ringShadow(ring) : null;
  const vpStyle = viewportSizeStyle(viewport);
  const grid = withStyleRows(classGrid, style);
  const { style: webRnStyle, gradient: styleGradient } = useWebStyle(style);
  // card che si gira (semina-flip-*, solo telefono): il contenitore passa la rotazione alle facce
  const inner = flipInner(className, webRnStyle, style);
  const rnStyle = inner ? inner.style : webRnStyle;
  const faceStyle = useFlipFace(className);
  const gradient = styleGradient ?? classGradient;
  const gridCell = useContext(GridCellContext);
  const box = gridCell ? withoutHFull(box0) : box0;
  const rowParent = useContext(FlexRowContext);
  const min0 = useMinContentWidth(className, rnStyle, children, onLayout, rowParent && !OUT_OF_FLOW_CLASS.test(rest));
  // flex-wrap: in CSS la sua larghezza minima è quella dell'elemento più largo, non della riga intera:
  // può restringersi (e rende restringibili gli antenati) come il testo che va a capo
  const wraps = FLEX_WRAP.test(rest);
  const wrapProbe = useContext(WrapProbeContext);
  if (wraps && wrapProbe && !wrapProbe.flexible) wrapProbe.mark();
  const rigid = useRigidMinWidth(
    rowParent && !min0.enabled && !NO_MIN_CONTENT.test(className ?? '') && !OUT_OF_FLOW_CLASS.test(rest) && !wraps
      && rnStyle?.width == null && rnStyle?.minWidth == null && rnStyle?.flexShrink !== 0 && rnStyle?.flex == null && rnStyle?.position !== 'absolute',
    children, min0.onLayout,
  );
  const min0b = rigid.probe ? { minStyle: rigid.minStyle, onLayout: rigid.onLayout } : min0;
  const strut = useInlineBlockStrut(
    layout === 'block' && !gridCell && INLINE_LEVEL.test(rest) && !OUT_OF_FLOW_CLASS.test(rest) && !OWN_MARGIN_Y.test(rest)
      && rnStyle?.marginTop == null && rnStyle?.marginBottom == null && rnStyle?.marginVertical == null && rnStyle?.margin == null,
    inherited, text, rest, min0b.onLayout,
  );
  const min = { minStyle: strut.style ? [min0b.minStyle, strut.style] : min0b.minStyle, onLayout: strut.onLayout };
  const lead = useLeadMargin(rnStyle);
  const flowValue: ParentLayout = CSS_FLEX.test(rest) ? 'flex' : 'block';
  const rowValue = !grid && isFlexRow(rest);
  const needFlow = useSticky(flowValue !== layout);
  const needRow = useSticky(rowValue !== rowParent);
  let content0 = boxContent(children, grid, rest);
  if (needRow) content0 = <FlexRowContext.Provider value={rowValue}>{content0}</FlexRowContext.Provider>;
  if (needFlow) content0 = <FlexParentContext.Provider value={flowValue}>{content0}</FlexParentContext.Provider>;
  if (inner) content0 = <FlipContext.Provider value={inner.flip}>{content0}</FlipContext.Provider>;
  if (rigid.probe) content0 = <WrapProbeContext.Provider value={rigid.probe}>{content0}</WrapProbeContext.Provider>;
  if (Platform.OS !== 'web' && OPAQUE_BG.test(rest)) content0 = <OpaqueBehindContext.Provider value>{content0}</OpaqueBehindContext.Provider>;
  if (lead) content0 = <LeadMarginContext.Provider value={null}>{content0}</LeadMarginContext.Provider>;
  // la cella della griglia la "consuma" questo elemento, non i suoi discendenti
  const content = gridCell ? <GridCellContext.Provider value={false}>{content0}</GridCellContext.Provider> : content0;
  const blur = backdropBlur(rest, style);
  // sul web lo stile backdropFilter passa così com'è (le classi le gestisce già il CSS)
  const blurStyle = blur?.css && Platform.OS === 'web' ? ({ backdropFilter: blur.css, WebkitBackdropFilter: blur.css } as unknown as ViewStyle) : null;
  // transizioni CSS (style.transition / classi transition-*) sul telefono: opacità, sfondo, blur
  const trSpec = Platform.OS === 'web' ? null : transitionSpec(className, (style as { transition?: unknown } | undefined)?.transition);
  const tr = useCssTransition(trSpec, rnStyle?.opacity ?? classOpacity(rest), rnStyle?.backgroundColor, blur && Platform.OS !== 'web' ? blur.px : 0);
  const inPortal = useContext(InPortalContext);
  // position: fixed (relativo allo schermo): portale alla radice (le View di RN-web creano contesti
  // di sovrapposizione, z-50 non uscirebbe dalla pagina) e sul web anche position: fixed vero
  const fixed = FIXED.test(rest);
  if (fixed && !inPortal) {
    return <PortalToRoot><Div className={className} style={style} onLayout={onLayout} animatedStyle={animatedStyle} {...all}>{children}</Div></PortalToRoot>;
  }
  const fixedStyle = fixed && Platform.OS === 'web' ? WEB_FIXED : null;
  const nativeBlur = tr.blurPx && Platform.OS !== 'web'
    ? (tr.blurOpacity
      ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: tr.blurOpacity }]}><BlurFill px={tr.blurPx} /></Animated.View>
      : <BlurFill px={tr.blurPx} />)
    : null;
  const axis = scrollAxis(rest);
  if (axis) {
    const flat = StyleSheet.flatten([boxStyle(layout, inherited, className, grid, box, rnStyle, gridCell), ringStyle, vpStyle, fixedStyle, rnStyle, lead, blurStyle, min.minStyle]) as Record<string, any>;
    const scroll = (
      <ScrollBox {...props} {...gestures} axis={axis} box={box} style={flat} onLayout={min.onLayout}>
        {nativeBlur}
        {textInherit(inheritedStyle, inherited, text, rnStyle, content)}
      </ScrollBox>
    );
    return animatedStyle ? <Animated.View style={animatedStyle}>{scroll}</Animated.View> : scroll;
  }
  // motion.div (ui/motion.tsx): opacity/transform/width animati sull'elemento stesso
  const Box = animatedStyle || faceStyle || trSpec ? AnimatedBox : View;
  const boxClasses = cn(box, nativeBlur && 'overflow-hidden');
  const ownStyle = [boxStyle(layout, inherited, className, grid, box, rnStyle, gridCell), ringStyle, vpStyle, fixedStyle, rnStyle, lead, blurStyle, min.minStyle, animatedStyle, faceStyle, tr.style];
  const boxInner = (
    <>
      {nativeBlur}
      {gradient ? <GradientFill gradient={gradient} radius={fillRadius(box, rnStyle)} /> : null}
      {textInherit(inheritedStyle, inherited, text, rnStyle, content)}
    </>
  );
  // telefono: classi statiche già viste → View semplice con lo stile in cache (ui/classStyleCache)
  // Un'istanza nata come CaptureView resta CaptureView: passare a View al disegno successivo (lo stile ormai
  // è in cache) cambiava il tipo dell'elemento e React la smontava e rimontava con tutti i figli.
  if (Platform.OS !== 'web' && Box === View) {
    const cs = boxClasses ? classStyle(boxClasses) : null;
    if (captureMode.current === null) captureMode.current = !!cs && !cs.cached && !!cs.key;
    if (captureMode.current) return <CaptureView {...props} {...gestures} onLayout={min.onLayout} className={boxClasses || undefined} __cacheKey={cs && !cs.cached ? cs.key : null} __extraStyle={ownStyle}>{boxInner}</CaptureView>;
    if (!cs) return <View {...props} {...gestures} onLayout={min.onLayout} style={ownStyle}>{boxInner}</View>;
    if (cs.cached) return <View {...props} {...gestures} onLayout={min.onLayout} style={[cs.style as ViewStyle, ...ownStyle]}>{boxInner}</View>;
    if (cs.key) return <CaptureView {...props} {...gestures} onLayout={min.onLayout} className={boxClasses} __cacheKey={cs.key} __extraStyle={ownStyle}>{boxInner}</CaptureView>;
  }
  return (
    <Box {...props} {...gestures} onLayout={min.onLayout} className={boxClasses} style={ownStyle}>{boxInner}</Box>
  );
}

// Un <span>/<p> usato come contenitore (flex, dimensioni fisse, gap...) in RN deve essere una View:
// il testo figlio eredita comunque le classi di testo tramite il contesto.
const BOXY = /(^|\s)(?:[a-z]+:)*(flex|inline-flex|grid|items-|justify-|gap-|space-[xy]-|size-|w-\d|h-\d|w-\[|h-\[|aspect-|block(?=\s|$)|inline-block(?=\s|$))/;

/** Un <span> che contiene blocchi (span block, div...) in CSS li impila: in RN serve una View, non testo annidato. */
function hasBoxyChild(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (c) => {
    if (found || !isValidElement(c)) return;
    if (c.type === Fragment) { found = hasBoxyChild((c.props as { children?: ReactNode }).children); return; }
    if (c.type === Div || c.type === Btn) { found = true; return; }
    const cls = (c.props as { className?: unknown }).className;
    // `inline` (es. icona `w-3 h-3 inline mr-1`) sta nella riga del testo: non fa diventare il testo un blocco
    if (typeof cls === 'string' && BOXY.test(cls) && !/(^|\s)inline(\s|$)/.test(cls)) found = true;
  });
  return found;
}

type TextLikeProps = AppTextProps & { onPress?: () => void; style?: any };

function textLike(defaultProps: Partial<TextLikeProps> = {}, inline = false) {
  return function TextLike({ className, children, style, onPress, ...props }: TextLikeProps) {
    const boxy = BOXY.test(className ?? '') || hasBoxyChild(children);
    const inlineBox = useInlineBox(inline && !boxy ? className : 'block');
    if (boxy) {
      return onPress
        ? <Btn className={className} style={style} onClick={onPress} {...(props as object)}>{children}</Btn>
        : <Div className={className} style={style} {...(props as object)}>{children}</Div>;
    }
    // testo nascosto per la larghezza ("hidden sm:inline": le etichette dei pulsanti sul desktop):
    // sul telefono non c'è niente da disegnare (come il ramo nascosto di Div)
    if (Platform.OS !== 'web' && className && hiddenAtWidth(className, cssViewport.width)) return null;
    const text = <Text {...defaultProps} {...props} className={className} style={style} onPress={onPress}>{children}</Text>;
    return inlineBox ? <View style={inlineBox}>{text}</View> : text;
  };
}

export const Span = textLike({}, true);
export const P = textLike();
export const H = textLike({ accessibilityRole: 'header' });

type BtnProps = Omit<PressableProps, 'children' | 'style' | keyof WebGestureProps> & WebGestureProps & {
  className?: string;
  children?: ReactNode;
  onClick?: PressableProps['onPress'];
  style?: ViewProps['style'];
  /** type="submit" invia il <form> che lo contiene (ui/form.tsx), come nel browser. */
  type?: string;
  /** Era un <button> (non un div cliccabile): default del browser, testo centrato e in linea (inline-block). */
  button?: boolean;
};

const BUTTON_CENTER: ViewStyle = { justifyContent: 'center' };

// <button> senza classi di visualizzazione/larghezza: inline-block come nel browser
const BUTTON_BLOCKY = /(^|\s)(block|flex|inline-flex|grid|hidden|w-\S+|min-w-\S+|self-\S+|absolute|fixed)(\s|$)/;

/** <button>: cliccabile, eredita/propaga le classi di testo come Div. */
const PRESSED: ViewStyle = { opacity: 0.85 };

/** Pressable del pulsante: sul telefono, con classi statiche già viste, senza NativeWind (ui/classStyleCache). */
function BtnPressable({ classes, ownStyle: baseStyle, children, onPressIn, onPressOut, ...rest }: Omit<PressableProps, 'style'> & { classes: string; ownStyle: StyleProp<ViewStyle>[]; children?: ReactNode }) {
  // Stato "premuto" qui e non in Btn: i figli arrivano già creati e React salta il loro ridisegno (prima ogni
  // tocco ridisegnava due volte tutto il contenuto del pulsante). Con className, NativeWind sul web ignora
  // uno style passato come funzione: per questo è a mano.
  const [pressed, setPressed] = useState(false);
  const p = {
    ...rest,
    onPressIn: (e: GestureResponderEvent) => { setPressed(true); onPressIn?.(e); },
    onPressOut: (e: GestureResponderEvent) => { setPressed(false); onPressOut?.(e); },
  };
  const ownStyle = pressed ? [...baseStyle, PRESSED] : baseStyle;
  // Tipo scelto al montaggio, come in DivBoxImpl: il primo pulsante di ogni stringa di classi nasceva
  // CapturePressable e al disegno successivo (spesso setPressed in onPressIn) diventava Pressable: smontato
  // sotto il dito, il tocco andava perso e "premuto" poteva restare acceso.
  const captureMode = useRef<boolean | null>(null);
  if (Platform.OS !== 'web') {
    const cs = classes ? classStyle(classes) : null;
    if (captureMode.current === null) captureMode.current = !!cs && !cs.cached && !!cs.key;
    if (captureMode.current) return <CapturePressable {...p} className={classes || undefined} __cacheKey={cs && !cs.cached ? cs.key : null} __extraStyle={ownStyle}>{children}</CapturePressable>;
    if (!cs) return <Pressable {...p} style={ownStyle}>{children}</Pressable>;
    if (cs.cached) return <Pressable {...p} style={[cs.style as ViewStyle, ...ownStyle]}>{children}</Pressable>;
    if (cs.key) return <CapturePressable {...p} className={classes} __cacheKey={cs.key} __extraStyle={ownStyle}>{children}</CapturePressable>;
  }
  return <Pressable {...p} className={classes} style={ownStyle}>{children}</Pressable>;
}

export function Btn({ className, children, onClick, onPress, disabled, style, onLayout, type, button, ...all }: BtnProps) {
  diagCount('btn', className);
  const [handlers, props] = splitGestureProps(all);
  const gestures = useWebGestures(handlers);
  const form = useForm();
  const gridCell = useContext(GridCellContext);
  const press = onPress ?? onClick;
  const handlePress: PressableProps['onPress'] = type === 'submit' && form
    ? (e) => { press?.(e); form.submit(); }
    : press;
  const inherited = useContext(TextClassContext);
  const inheritedStyle = useContext(TextStyleContext);
  const layout = useContext(FlexParentContext);
  const [ownText, classRest] = splitTextClasses(className);
  const rest = withStyleGrid(classRest, style);
  // il browser centra il contenuto di <button> (le classi text-left/right della pagina vincono)
  const text = button ? cn('text-center', ownText) : ownText;
  const { box: box0, grid, gradient: classGradient, ring, viewport } = normalizeClasses(rest);
  const box = gridCell ? withoutHFull(box0) : box0;
  const ringStyle = ring ? ringShadow(ring) : null;
  const vpStyle = viewportSizeStyle(viewport);
  const { style: rnStyle, gradient: styleGradient } = useWebStyle(style);
  const gradient = styleGradient ?? classGradient;
  const rowParent = useContext(FlexRowContext);
  const min0 = useMinContentWidth(className, rnStyle, children, onLayout ?? undefined, rowParent && !OUT_OF_FLOW_CLASS.test(rest));
  // min-width: auto (CSS) per un pulsante in una riga flex con contenuto che non va a capo (icone, una
  // parola): non si restringe sotto la sua larghezza; senza misure, basta non farlo restringere
  const rigidBtn = rowParent && !min0.enabled && !NO_MIN_CONTENT.test(className ?? '') && !OUT_OF_FLOW_CLASS.test(rest)
    && rnStyle?.width == null && rnStyle?.minWidth == null && rnStyle?.flexShrink == null && rnStyle?.flex == null && unbreakableContent(children)
    ? RIGID_BTN : null;
  // testo che va a capo (es. pillola "Ordine aggiunta"): non sotto la parola più lunga (min-content)
  const minContent = useButtonMinContent(
    rowParent && !rigidBtn && !min0.enabled && !NO_MIN_CONTENT.test(className ?? '') && !OUT_OF_FLOW_CLASS.test(rest)
      && rnStyle?.width == null && rnStyle?.minWidth == null && rnStyle?.flexShrink == null && rnStyle?.flex == null && hasBreakableText(children),
    children, min0.onLayout,
  );
  const lead = useLeadMargin(rnStyle);
  const inlineButton = button && layout === 'block' && !BUTTON_BLOCKY.test(rest) && rnStyle?.alignSelf == null && rnStyle?.width == null
    ? { alignSelf: inlineAlign(inherited) } : null;
  // <button> in linea / inline-flex dentro un blocco: riga alta quanto lo strut (come in Div)
  const strut = useInlineBlockStrut(
    layout === 'block' && !gridCell && (inlineButton != null || INLINE_LEVEL.test(rest)) && !OUT_OF_FLOW_CLASS.test(rest) && !OWN_MARGIN_Y.test(rest)
      && rnStyle?.marginTop == null && rnStyle?.marginBottom == null && rnStyle?.marginVertical == null && rnStyle?.margin == null,
    inherited, text, rest, minContent.onLayout,
  );
  const min = { minStyle: strut.style ? [min0.minStyle, strut.style] : min0.minStyle, onLayout: strut.onLayout };
  // il <button> del browser centra in verticale il contenuto quando è più alto (salvo flex/grid)
  const buttonCenter = button && !CSS_FLEX.test(rest) && rnStyle?.justifyContent == null ? BUTTON_CENTER : null;
  // contesti per i figli solo se cambiano rispetto al genitore (vedi useSticky)
  const parentLead = useContext(LeadMarginContext);
  const parentProbe = useContext(MinContentProbeContext);
  const flowValue: ParentLayout = CSS_FLEX.test(rest) ? 'flex' : 'block';
  const rowValue = !grid && isFlexRow(rest);
  const needLead = useSticky(parentLead !== null);
  const needGrid = useSticky(gridCell);
  const needFlow = useSticky(flowValue !== layout);
  const needRow = useSticky(rowValue !== rowParent);
  const needProbe = useSticky(minContent.probe !== parentProbe);
  let content: ReactNode = textInherit(inheritedStyle, inherited, text, rnStyle, boxContent(children, grid, rest));
  if (needProbe) content = <MinContentProbeContext.Provider value={minContent.probe}>{content}</MinContentProbeContext.Provider>;
  if (needRow) content = <FlexRowContext.Provider value={rowValue}>{content}</FlexRowContext.Provider>;
  if (needFlow) content = <FlexParentContext.Provider value={flowValue}>{content}</FlexParentContext.Provider>;
  if (needGrid) content = <GridCellContext.Provider value={false}>{content}</GridCellContext.Provider>;
  if (needLead) content = <LeadMarginContext.Provider value={null}>{content}</LeadMarginContext.Provider>;
  return (
    <BtnPressable
      onLayout={min.onLayout}
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      {...props}
      {...gestures}
      disabled={disabled}
      onPress={handlePress}
      classes={cn(box, disabled && 'opacity-50')}
      ownStyle={[boxStyle(layout, inherited, className, grid, box, rnStyle, gridCell), rigidBtn, minContent.style, ringStyle, vpStyle, inlineButton, buttonCenter, rnStyle, lead, min.minStyle]}
    >
      {gradient ? <GradientFill gradient={gradient} radius={fillRadius(box, rnStyle)} /> : null}
      {content}
    </BtnPressable>
  );
}
