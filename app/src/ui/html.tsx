// Equivalenti nativi degli elementi HTML usati nel JSX dell'app web, così i componenti si
// portano riga per riga mantenendo className e struttura:
//   <div> → Div   <span>/<p>/<h*> → Span/P/H   <button> → Btn (onClick come sul web)
// Le classi passano da normalizeClasses (flex in riga, space-*, griglie, gradienti, ring...).
import { Children, cloneElement, Fragment, isValidElement, useContext, type ReactElement, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from './cn';
import { splitTextClasses, Text, TextClassContext, type AppTextProps } from './text';
import { normalizeClasses, spacingPx, type Gradient, type Grid } from './webClasses';
import { webStyle, type WebStyleResult } from './webStyle';

/** Avvolge in <Text> le stringhe/numeri figli diretti (in RN il testo nudo in una View è un errore). */
function wrapText(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') return <Text>{child}</Text>;
    if (isValidElement(child) && child.type === Fragment) {
      return <Fragment key={child.key}>{wrapText((child.props as { children?: ReactNode }).children)}</Fragment>;
    }
    return child;
  });
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

/** Figli di una griglia CSS: larghezza 1/cols (o col-span) e gap orizzontale come padding. */
function gridChildren(children: ReactNode, grid: Grid): ReactNode {
  return Children.map(wrapText(children), (child) => {
    if (child == null || typeof child === 'boolean') return child;
    const cls = isValidElement(child) ? String((child as ReactElement<{ className?: string }>).props.className ?? '') : '';
    const span = Number(cls.match(/(?:^|\s)col-span-(\d+)/)?.[1] ?? 1);
    if (/(?:^|\s)hidden(?:\s|$)/.test(cls)) return child;
    return (
      <View style={{ width: `${(100 * Math.min(span, grid.cols)) / grid.cols}%`, paddingHorizontal: grid.gapX / 2 }}>
        {child}
      </View>
    );
  });
}

function boxContent(children: ReactNode, grid?: Grid, className?: string) {
  return grid ? gridChildren(children, grid) : wrapText(spaceOverrides(children, className));
}

const SPACE = /(?:^|\s)space-([xy])-(\S+)/g;

/** Margine inline in px (numero o "12px"), altrimenti null. */
function inlinePx(v: unknown): number | null {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && /^-?\d+(\.\d+)?(px)?$/.test(v.trim())) return parseFloat(v);
  return null;
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
  const visit = (nodes: ReactNode): ReactNode => Children.map(nodes, (child) => {
    if (!isValidElement(child)) return child;
    // i figli di un Fragment in CSS sono fratelli diretti
    if (child.type === Fragment) {
      return <Fragment key={child.key}>{visit((child.props as { children?: ReactNode }).children)}</Fragment>;
    }
    const props = child.props as { className?: string; style?: unknown };
    const hadPrev = seen;
    if (typeof child.type === 'string' || props.className != null || props.style != null) seen = true;
    if (!hadPrev || props.style == null) return child;
    const flat = (Array.isArray(props.style) ? StyleSheet.flatten(props.style as StyleProp<ViewStyle>) : props.style) as Record<string, unknown>;
    const fix: Record<string, number> = {};
    const mt = inlinePx(flat.marginTop);
    const ml = inlinePx(flat.marginLeft);
    if (gaps.y != null && mt != null) fix.marginTop = mt - gaps.y;
    if (gaps.x != null && ml != null) fix.marginLeft = ml - gaps.x;
    return Object.keys(fix).length ? cloneElement(child as ReactElement<{ style?: unknown }>, { style: { ...flat, ...fix } }) : child;
  });
  return visit(children);
}

// In CSS gli elementi flex hanno flex-shrink: 1 di default, in RN 0: lo ripristiniamo
// (salvo classi che lo decidono esplicitamente).
const SHRINK_CLASS = /(^|\s)(shrink-0|flex-shrink-0|flex-none|shrink|flex-shrink|flex-1|flex-auto|flex-initial|grow|flex-grow)(\s|$)/;

function boxStyle(grid?: Grid, className?: string, style?: Record<string, any>) {
  const base: Record<string, any> = grid ? { rowGap: grid.gapY, marginHorizontal: -grid.gapX / 2 } : {};
  if (!SHRINK_CLASS.test(className ?? '') && style?.flexShrink == null && style?.flex == null) base.flexShrink = 1;
  return base;
}

type DivProps = ViewProps & { className?: string; children?: ReactNode };

export function Div({ className, children, style, ...props }: DivProps) {
  const inherited = useContext(TextClassContext);
  const [text, rest] = splitTextClasses(className);
  const { box, grid, gradient: classGradient } = normalizeClasses(rest);
  const { style: rnStyle, gradient: styleGradient } = useWebStyle(style);
  const gradient = styleGradient ?? classGradient;
  const content = boxContent(children, grid, rest);
  return (
    <View {...props} className={cn(box, gradient && 'overflow-hidden')} style={[boxStyle(grid, box, rnStyle), rnStyle]}>
      {gradient ? <GradientFill gradient={gradient} /> : null}
      {text ? <TextClassContext.Provider value={cn(inherited, text)}>{content}</TextClassContext.Provider> : content}
    </View>
  );
}

// Un <span>/<p> usato come contenitore (flex, dimensioni fisse, gap...) in RN deve essere una View:
// il testo figlio eredita comunque le classi di testo tramite il contesto.
const BOXY = /(^|\s)(?:[a-z]+:)*(flex|inline-flex|grid|items-|justify-|gap-|space-[xy]-|size-|w-\d|h-\d|w-\[|h-\[|aspect-)/;

type TextLikeProps = AppTextProps & { onPress?: () => void; style?: any };

function textLike(defaultProps: Partial<TextLikeProps> = {}) {
  return function TextLike({ className, children, style, onPress, ...props }: TextLikeProps) {
    if (BOXY.test(className ?? '')) {
      return onPress
        ? <Btn className={className} style={style} onClick={onPress} {...(props as object)}>{children}</Btn>
        : <Div className={className} style={style} {...(props as object)}>{children}</Div>;
    }
    return <Text {...defaultProps} {...props} className={className} style={style} onPress={onPress}>{children}</Text>;
  };
}

export const Span = textLike();
export const P = textLike();
export const H = textLike({ accessibilityRole: 'header' });

type BtnProps = Omit<PressableProps, 'children' | 'style'> & {
  className?: string;
  children?: ReactNode;
  onClick?: PressableProps['onPress'];
  style?: ViewProps['style'];
};

/** <button>: cliccabile, eredita/propaga le classi di testo come Div. */
export function Btn({ className, children, onClick, onPress, disabled, style, ...props }: BtnProps) {
  const inherited = useContext(TextClassContext);
  const [text, rest] = splitTextClasses(className);
  const { box, grid, gradient: classGradient } = normalizeClasses(rest);
  const { style: rnStyle, gradient: styleGradient } = useWebStyle(style);
  const gradient = styleGradient ?? classGradient;
  return (
    <Pressable
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      {...props}
      disabled={disabled}
      onPress={onPress ?? onClick}
      className={cn(box, gradient && 'overflow-hidden', disabled && 'opacity-50')}
      style={({ pressed }) => [boxStyle(grid, box, rnStyle), rnStyle, pressed ? { opacity: 0.85 } : null]}
    >
      {gradient ? <GradientFill gradient={gradient} /> : null}
      <TextClassContext.Provider value={cn(inherited, text)}>{boxContent(children, grid, rest)}</TextClassContext.Provider>
    </Pressable>
  );
}
