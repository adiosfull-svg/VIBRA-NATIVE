// Equivalenti nativi degli elementi HTML usati nel JSX dell'app web, così i componenti si
// portano riga per riga mantenendo className e struttura:
//   <div> → Div   <span>/<p>/<h*> → Span/P/H   <button> → Btn (onClick come sul web)
// Le classi passano da normalizeClasses (flex in riga, space-*, griglie, gradienti, ring...).
import { Children, Fragment, isValidElement, useContext, type ReactElement, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from './cn';
import { splitTextClasses, Text, TextClassContext, type AppTextProps } from './text';
import { normalizeClasses, type Gradient, type Grid } from './webClasses';

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

/** Sfondo bg-gradient-to-*: dietro ai figli, ritagliato dagli angoli arrotondati del box. */
export function GradientFill({ gradient }: { gradient: Gradient }) {
  const [start, end] = GRADIENT_POINTS[gradient.dir] ?? GRADIENT_POINTS.b;
  const colors = gradient.colors as [string, string, ...string[]];
  return <LinearGradient pointerEvents="none" colors={colors} start={start} end={end} style={StyleSheet.absoluteFill} />;
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

function boxContent(children: ReactNode, grid?: Grid) {
  return grid ? gridChildren(children, grid) : wrapText(children);
}

function boxStyle(grid?: Grid) {
  return grid ? { rowGap: grid.gapY, marginHorizontal: -grid.gapX / 2 } : null;
}

type DivProps = ViewProps & { className?: string; children?: ReactNode };

export function Div({ className, children, style, ...props }: DivProps) {
  const inherited = useContext(TextClassContext);
  const [text, rest] = splitTextClasses(className);
  const { box, grid, gradient } = normalizeClasses(rest);
  const content = boxContent(children, grid);
  return (
    <View {...props} className={cn(box, gradient && 'overflow-hidden')} style={[boxStyle(grid), style]}>
      {gradient ? <GradientFill gradient={gradient} /> : null}
      {text ? <TextClassContext.Provider value={cn(inherited, text)}>{content}</TextClassContext.Provider> : content}
    </View>
  );
}

export const Span = Text;
export const P = Text;
export function H({ className, ...props }: AppTextProps) {
  return <Text accessibilityRole="header" className={className} {...props} />;
}

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
  const { box, grid, gradient } = normalizeClasses(rest);
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={disabled}
      onPress={onPress ?? onClick}
      className={cn(box, gradient && 'overflow-hidden', disabled && 'opacity-50')}
      style={({ pressed }) => [boxStyle(grid), style, pressed ? { opacity: 0.85 } : null]}
    >
      {gradient ? <GradientFill gradient={gradient} /> : null}
      <TextClassContext.Provider value={cn(inherited, text)}>{boxContent(children, grid)}</TextClassContext.Provider>
    </Pressable>
  );
}
