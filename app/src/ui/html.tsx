// Equivalenti nativi degli elementi HTML usati nel JSX dell'app web, così i componenti si
// portano riga per riga mantenendo className e struttura:
//   <div> → Div   <span>/<p>/<h*> → Span/P/H   <button> → Btn (onClick come sul web)
// Le classi passano da normalizeClasses (flex in riga, space-*, griglie, gradienti, ring...).
import { cssInterop } from 'nativewind';
import { collapseFirstMargin, stripSpacedMargins } from './spaceMargins';
import { Children, cloneElement, createContext, Fragment, Suspense, isValidElement, useCallback, useContext, useRef, useState, type ReactElement, type ReactNode, type Ref } from 'react';
import { Animated, Dimensions, Platform, Pressable, ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent, type LayoutChangeEvent, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from './cn';
import { InPortalContext, PortalToRoot } from './fixedPortal';
import { useForm } from './formContext';
import { splitGestureProps, useWebGestures, type WebGestureProps } from './gestures';
import { FlexParentContext, splitTextClasses, WrapProbeContext, type WrapProbe, type ParentLayout, Text, TextClassContext, TextStyleContext, textClassesFor, useInlineBox, type AppTextProps } from './text';
import { nextTextStyle } from './textStyleInherit';
import { expandGridTemplate, normalizeClasses, parseGridTemplate, spacingPx, type Gradient, type Grid, type GridTrack } from './webClasses';
import { cssViewport, webStyle, type WebStyleResult } from './webStyle';

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
Dimensions.addEventListener('change', ({ window }) => Object.assign(cssViewport, { width: window.width, height: window.height }));

/**
 * Avvolge in <Text> le stringhe/numeri figli diretti (in RN il testo nudo in una View è un errore).
 * Come in CSS, testo contiguo (es. `Tutti ({n})`) forma un solo elemento: niente gap in mezzo, e il
 * testo vuoto o fatto solo di spazi non occupa posto.
 */
function wrapText(children: ReactNode): ReactNode {
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
export function GradientFill({ gradient }: { gradient: AnyGradient }) {
  const [start, end] = gradient.angle != null ? anglePoints(gradient.angle) : GRADIENT_POINTS[gradient.dir] ?? GRADIENT_POINTS.b;
  const colors = gradient.colors as [string, string, ...string[]];
  const locations = gradient.locations as [number, number, ...number[]] | undefined;
  return <LinearGradient pointerEvents="none" colors={colors} locations={locations} start={start} end={end} style={StyleSheet.absoluteFill} />;
}

/** Converte lo style (anche in sintassi CSS del web) e ne estrae l'eventuale gradiente. */
function useWebStyle(style: unknown): WebStyleResult {
  if (Array.isArray(style)) return webStyle(StyleSheet.flatten(style as StyleProp<ViewStyle>));
  return webStyle(style);
}

/**
 * Cella di una griglia che si allunga all'altezza della riga (align-items: stretch): il primo Div/Btn
 * sotto la cella la riceve anche se è dentro un componente (es. <KpiFlashCard/> che rende un Btn).
 */
const GridCellContext = createContext(false);

// Figli che in CSS non si allungano all'altezza della riga della griglia
const NO_STRETCH = /(^|\s)(h-|size-|aspect-|self-(start|center|end|baseline))/;

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
  return Children.map(wrapText(children), (child) => {
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
    return (
      <View style={{ width: `${(100 * span) / n}%`, ...pad }}>
        {stretch ? <GridCellContext.Provider value>{child}</GridCellContext.Provider> : child}
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
  for (const child of Children.toArray(wrapText(children))) {
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
  for (const child of Children.toArray(wrapText(children))) {
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
  return grid ? gridChildren(children, grid, className) : wrapText(spaceOverrides(children, className));
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
function spaceOverrides(children: ReactNode, className?: string): ReactNode {
  if (!className || !className.includes('space-')) return children;
  const gaps: { x?: number; y?: number } = {};
  for (const m of className.matchAll(SPACE)) gaps[m[1] as 'x' | 'y'] = spacingPx(m[2]);
  if (gaps.x == null && gaps.y == null) return children;
  let seen = false;
  let seenInFlow = false;
  const visit = (nodes: ReactNode): ReactNode => Children.map(nodes, (child) => {
    if (!isValidElement(child)) return child;
    // i figli di un Fragment (e di <Suspense>, che non crea elementi) in CSS sono fratelli diretti
    if (child.type === Fragment) {
      return <Fragment key={child.key}>{visit((child.props as { children?: ReactNode }).children)}</Fragment>;
    }
    if (child.type === Suspense) {
      const sp = child.props as { children?: ReactNode; fallback?: ReactNode };
      return <Suspense key={child.key} fallback={sp.fallback}>{visit(sp.children)}</Suspense>;
    }
    const props = child.props as { className?: string; style?: unknown };
    const hadPrev = seen;
    const hadInFlow = seenInFlow;
    const drawn = typeof child.type === 'string' || props.className != null || props.style != null;
    const outOfFlow = OUT_OF_FLOW.test(props.className ?? '');
    if (drawn) { seen = true; if (!outOfFlow) seenInFlow = true; }
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

function boxStyle(layout: ParentLayout, inherited: string, rawClass: string | undefined, grid?: Grid, className?: string, style?: Record<string, any>, gridCell = false) {
  const base: Record<string, any> = grid ? { rowGap: grid.gapY } : {};
  if (layout === 'flex' && !SHRINK_CLASS.test(className ?? '') && style?.flexShrink == null && style?.flex == null) base.flexShrink = 1;
  if (gridCell && !NO_STRETCH.test(rawClass ?? '') && style?.flexGrow == null && style?.flex == null) base.flexGrow = 1;
  if (layout === 'block' && INLINE_LEVEL.test(rawClass ?? '') && !SELF.test(rawClass ?? '') && style?.alignSelf == null) {
    base.alignSelf = inlineAlign(inherited);
  }
  return base;
}

/** Classi e style di testo del contenitore per i figli (cascata CSS). */
function TextInherit({ inherited, text, style, children }: { inherited: string; text: string; style: Record<string, any>; children: ReactNode }) {
  const inheritedStyle = useContext(TextStyleContext);
  const nextStyle = nextTextStyle(inheritedStyle, text, style);
  const withStyle = nextStyle === inheritedStyle ? children : <TextStyleContext.Provider value={nextStyle}>{children}</TextStyleContext.Provider>;
  return text ? <TextClassContext.Provider value={textClassesFor(inherited, text)}>{withStyle}</TextClassContext.Provider> : <>{withStyle}</>;
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

function useMinContentWidth(className: string | undefined, style: Record<string, any> | undefined, children: ReactNode, onLayout?: (e: LayoutChangeEvent) => void) {
  const enabled = NOWRAP.test(className ?? '') && !NO_MIN_CONTENT.test(className ?? '')
    && style?.width == null && style?.minWidth == null && style?.flexShrink !== 0;
  const signature = enabled ? textSignature(children) : '';
  const [measured, setMeasured] = useState<{ sig: string; width: number } | null>(null);
  const measuring = enabled && measured?.sig !== signature;
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    onLayout?.(e);
    if (measuring) setMeasured({ sig: signature, width: Math.ceil(e.nativeEvent.layout.width) });
  }, [onLayout, measuring, signature]);
  if (!enabled) return { minStyle: null, onLayout, enabled };
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

function useRigidMinWidth(enabled: boolean, children: ReactNode, onLayout?: (e: LayoutChangeEvent) => void) {
  const parent = useContext(WrapProbeContext);
  const probe = useRef<WrapProbe | null>(null);
  if (enabled && !probe.current) {
    const p: WrapProbe = { flexible: false, mark: () => { p.flexible = true; parent?.mark(); } };
    probe.current = p;
  }
  const signature = enabled ? textSignature(children) : '';
  const [measured, setMeasured] = useState<{ sig: string; width: number; rigid: boolean } | null>(null);
  const measuring = enabled && measured?.sig !== signature;
  if (measuring && probe.current) probe.current.flexible = false;
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    onLayout?.(e);
    if (measuring) setMeasured({ sig: signature, width: Math.ceil(e.nativeEvent.layout.width), rigid: !probe.current?.flexible });
  }, [onLayout, measuring, signature]);
  if (!enabled) return { minStyle: null, onLayout, probe: null };
  const minStyle = measuring
    ? { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' as const }
    : measured!.rigid ? { minWidth: measured!.width } : null;
  return { minStyle, onLayout: handleLayout, probe: probe.current };
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

function ScrollBox({ axis, box, style, children, onScroll, ref, ...props }: Omit<ViewProps, 'style'> & {
  axis: 'x' | 'y'; box: string; style: Record<string, any>; children: ReactNode; onScroll?: (e: any) => void; ref?: Ref<unknown>;
}) {
  const offset = useRef({ x: 0, y: 0 }).current;
  const setRef = useCallback((view: ScrollView | null) => {
    const value = view ? domScrollRef(view, offset) : null;
    if (typeof ref === 'function') ref(value);
    else if (ref) (ref as { current: unknown }).current = value;
  }, [ref, offset]);
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    offset.x = e.nativeEvent.contentOffset.x;
    offset.y = e.nativeEvent.contentOffset.y;
    webScrollHandler(onScroll)?.(e);
  }, [onScroll, offset]);
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

function BlurFill({ px }: { px: number }) {
  if (!px) return null;
  return <BlurView pointerEvents="none" intensity={Math.min(100, px * 4)} tint="dark" style={StyleSheet.absoluteFill} />;
}

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

export function Div({ className, children, style, onLayout, animatedStyle, ...all }: DivProps) {
  const [handlers, props] = splitGestureProps(all);
  const gestures = useWebGestures(handlers);
  const inherited = useContext(TextClassContext);
  const layout = useContext(FlexParentContext);
  const [text, classRest] = splitTextClasses(className);
  const rest = withStyleGrid(classRest, style);
  const { box, grid: classGrid, gradient: classGradient } = normalizeClasses(rest);
  const grid = withStyleRows(classGrid, style);
  const { style: rnStyle, gradient: styleGradient } = useWebStyle(style);
  const gradient = styleGradient ?? classGradient;
  const gridCell = useContext(GridCellContext);
  const min0 = useMinContentWidth(className, rnStyle, children, onLayout);
  const rowParent = useContext(FlexRowContext);
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
  const min = rigid.probe ? { minStyle: rigid.minStyle, onLayout: rigid.onLayout } : min0;
  const lead = useLeadMargin(rnStyle);
  let inner = (
    <FlexParentContext.Provider value={CSS_FLEX.test(rest) ? 'flex' : 'block'}>
      <FlexRowContext.Provider value={!grid && isFlexRow(rest)}>{boxContent(children, grid, rest)}</FlexRowContext.Provider>
    </FlexParentContext.Provider>
  );
  if (rigid.probe) inner = <WrapProbeContext.Provider value={rigid.probe}>{inner}</WrapProbeContext.Provider>;
  if (lead) inner = <LeadMarginContext.Provider value={null}>{inner}</LeadMarginContext.Provider>;
  // la cella della griglia la "consuma" questo elemento, non i suoi discendenti
  const content = gridCell ? <GridCellContext.Provider value={false}>{inner}</GridCellContext.Provider> : inner;
  const inPortal = useContext(InPortalContext);
  // Sul telefono un ramo nascosto per la larghezza (versione desktop) non si costruisce nemmeno:
  // sul web lo nasconde il CSS, qui costerebbe come se fosse visibile.
  if (Platform.OS !== 'web' && hiddenAtWidth(rest, cssViewport.width)) return <View style={{ display: 'none' }} />;
  // position: fixed (relativo allo schermo): portale alla radice (le View di RN-web creano contesti
  // di sovrapposizione, z-50 non uscirebbe dalla pagina) e sul web anche position: fixed vero
  const fixed = FIXED.test(rest);
  if (fixed && !inPortal) {
    return <PortalToRoot><Div className={className} style={style} onLayout={onLayout} animatedStyle={animatedStyle} {...all}>{children}</Div></PortalToRoot>;
  }
  const fixedStyle = fixed && Platform.OS === 'web' ? WEB_FIXED : null;
  const blur = backdropBlur(rest, style);
  // sul web lo stile backdropFilter passa così com'è (le classi le gestisce già il CSS)
  const blurStyle = blur?.css && Platform.OS === 'web' ? ({ backdropFilter: blur.css, WebkitBackdropFilter: blur.css } as unknown as ViewStyle) : null;
  const nativeBlur = blur && Platform.OS !== 'web' ? <BlurFill px={blur.px} /> : null;
  const axis = scrollAxis(rest);
  if (axis) {
    const flat = StyleSheet.flatten([boxStyle(layout, inherited, className, grid, box, rnStyle, gridCell), fixedStyle, rnStyle, lead, blurStyle, min.minStyle]) as Record<string, any>;
    const scroll = (
      <ScrollBox {...props} {...gestures} axis={axis} box={box} style={flat} onLayout={min.onLayout}>
        {nativeBlur}
        <TextInherit inherited={inherited} text={text} style={rnStyle}>{content}</TextInherit>
      </ScrollBox>
    );
    return animatedStyle ? <Animated.View style={animatedStyle}>{scroll}</Animated.View> : scroll;
  }
  // motion.div (ui/motion.tsx): opacity/transform/width animati sull'elemento stesso
  const Box = animatedStyle ? AnimatedBox : View;
  return (
    <Box {...props} {...gestures} onLayout={min.onLayout} className={cn(box, (gradient || nativeBlur) && 'overflow-hidden')} style={[boxStyle(layout, inherited, className, grid, box, rnStyle, gridCell), fixedStyle, rnStyle, lead, blurStyle, min.minStyle, animatedStyle]}>
      {nativeBlur}
      {gradient ? <GradientFill gradient={gradient} /> : null}
      <TextInherit inherited={inherited} text={text} style={rnStyle}>{content}</TextInherit>
    </Box>
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
    if (typeof cls === 'string' && BOXY.test(cls)) found = true;
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
export function Btn({ className, children, onClick, onPress, disabled, style, onLayout, type, button, ...all }: BtnProps) {
  const [handlers, props] = splitGestureProps(all);
  const gestures = useWebGestures(handlers);
  const form = useForm();
  const gridCell = useContext(GridCellContext);
  const press = onPress ?? onClick;
  const handlePress: PressableProps['onPress'] = type === 'submit' && form
    ? (e) => { press?.(e); form.submit(); }
    : press;
  const inherited = useContext(TextClassContext);
  const layout = useContext(FlexParentContext);
  const [ownText, classRest] = splitTextClasses(className);
  const rest = withStyleGrid(classRest, style);
  // il browser centra il contenuto di <button> (le classi text-left/right della pagina vincono)
  const text = button ? cn('text-center', ownText) : ownText;
  const { box, grid, gradient: classGradient } = normalizeClasses(rest);
  const { style: rnStyle, gradient: styleGradient } = useWebStyle(style);
  const gradient = styleGradient ?? classGradient;
  const min = useMinContentWidth(className, rnStyle, children, onLayout ?? undefined);
  const lead = useLeadMargin(rnStyle);
  const inlineButton = button && layout === 'block' && !BUTTON_BLOCKY.test(rest) && rnStyle?.alignSelf == null && rnStyle?.width == null
    ? { alignSelf: inlineAlign(inherited) } : null;
  // il <button> del browser centra in verticale il contenuto quando è più alto (salvo flex/grid)
  const buttonCenter = button && !CSS_FLEX.test(rest) && rnStyle?.justifyContent == null ? BUTTON_CENTER : null;
  // Stato "premuto" a mano: con className, NativeWind sul web ignora uno style passato come funzione.
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onLayout={min.onLayout}
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      {...props}
      {...gestures}
      disabled={disabled}
      onPress={handlePress}
      className={cn(box, gradient && 'overflow-hidden', disabled && 'opacity-50')}
      onPressIn={(e) => { setPressed(true); props.onPressIn?.(e); }}
      onPressOut={(e) => { setPressed(false); props.onPressOut?.(e); }}
      style={[boxStyle(layout, inherited, className, grid, box, rnStyle, gridCell), inlineButton, buttonCenter, rnStyle, lead, min.minStyle, pressed ? { opacity: 0.85 } : null]}
    >
      {gradient ? <GradientFill gradient={gradient} /> : null}
      <LeadMarginContext.Provider value={null}>
      <GridCellContext.Provider value={false}>
        <FlexParentContext.Provider value={CSS_FLEX.test(rest) ? 'flex' : 'block'}>
          <FlexRowContext.Provider value={!grid && isFlexRow(rest)}>
            <TextInherit inherited={inherited} text={text} style={rnStyle}>{boxContent(children, grid, rest)}</TextInherit>
          </FlexRowContext.Provider>
        </FlexParentContext.Provider>
      </GridCellContext.Provider>
      </LeadMarginContext.Provider>
    </Pressable>
  );
}
