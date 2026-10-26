// Icona lucide resa con react-native-svg, con il comportamento del web:
// - dimensione e colore dalle classi (w-4 h-4 text-primary fill-yellow-400, size-4...)
// - senza colore esplicito prende quello del testo che la contiene (currentColor)
// - dentro i bottoni le dimensioni di default arrivano da IconClassContext ([&_svg]:size-4)
import { createContext, useContext } from 'react';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';
import { cssInterop } from 'nativewind';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { cssAnimationOf, useCssAnimation, withoutCssAnimation, type CssAnimationKind } from './cssAnimation';
import { combinedD, opaque } from './iconPath';
import { classTransform, transitionSpec, useCssTransition, withoutClassTransform } from './cssTransition';
import { cn } from './cn';
import { cssColor } from './webStyle';
import { TextClassContext, TextStyleContext } from './text';

export type IconNode = [string, Record<string, string>][];
export type IconProps = {
  className?: string;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number | string;
  style?: object;
};

/** Classi di default per le icone figlie (es. i bottoni: "size-4 shrink-0"). */
export const IconClassContext = createContext<string>('');

const ELEMENTS: Record<string, React.ComponentType<any>> = {
  path: Path, circle: Circle, line: Line, rect: Rect, polyline: Polyline, polygon: Polygon, ellipse: Ellipse,
};

// Proprietà SVG in kebab-case → camelCase per react-native-svg
const camel = (k: string) => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function SvgIcon({ node, width = 24, height = 24, color = 'currentColor', fill = 'none', strokeWidth = 2, style, anim }: {
  className?: string;
  node: IconNode; width?: number; height?: number; color?: string; fill?: string; strokeWidth?: number | string; style?: object;
  /** animate-spin / animate-pulse (ui/cssAnimation): stile animato sul contenitore dell'icona */
  anim?: object;
}) {
  // posizione e trasformazioni (absolute top-1/2 -translate-y-1/2 delle icone dentro i campi):
  // sull'Svg di Android il translate in percentuale non si applica, su una View sì
  const flat = (StyleSheet.flatten(style) ?? {}) as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = {};
  const wrap = Platform.OS !== 'web' && (!!anim || Object.keys(flat).some((k) => POSITIONED_KEYS.test(k)));
  for (const [k, v] of Object.entries(flat)) (wrap && WRAP_KEYS.test(k) ? outer : inner)[k] = v;
  // absolute top-1/2 -translate-y-1/2 (icona centrata nel campo): su Android top 50% + translate
  // in percentuale non la centrava (lente sotto il campo di Clienti) → occupo tutta l'altezza del
  // contenitore e centro con flex, senza percentuali
  if (wrap) centerVertically(outer, Number(height));
  // ordine di disegno CSS: un'icona absolute sta sopra ai fratelli non posizionati (la lente della ricerca di
  // Serate finiva sotto al campo con bg-card disegnato dopo), come zIndex 1 dei Div posizionati in html.tsx
  if (wrap && (outer.position === 'absolute' || outer.position === 'relative') && outer.zIndex == null) outer.zIndex = 1;
  const single = Platform.OS !== 'web' && node.length > 1 && fill === 'none' && opaque(color) ? combinedD(node) : null;
  // pointerEvents none: sul web il clic sull'icona arriva al pulsante che la contiene; su Android il
  // tocco che cadeva sull'Svg non arrivava al Pressable genitore (tab della barra con icona: tocco perso)
  const svg = (
    <Svg pointerEvents="none" width={width} height={height} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" style={wrap ? inner : style}>
      {single ? <Path d={single} /> : node.map(([tag, attrs], i) => {
        const El = ELEMENTS[tag];
        if (!El) return null;
        const props = Object.fromEntries(Object.entries(attrs).map(([k, v]) => [camel(k), v]));
        return <El key={i} {...props} />;
      })}
    </Svg>
  );
  if (anim) return <Animated.View pointerEvents="none" style={[outer, anim]}>{svg}</Animated.View>;
  return wrap ? <View pointerEvents="none" style={outer}>{svg}</View> : svg;
}

function centerVertically(o: Record<string, unknown>, h: number) {
  if (o.position !== 'absolute' || o.top !== '50%' || o.bottom != null || !Array.isArray(o.transform)) return;
  const tf = o.transform as Record<string, unknown>[];
  const i = tf.findIndex((t) => 'translateY' in t);
  if (i < 0) return;
  const ty = tf[i].translateY;
  if (ty !== '-50%' && !(typeof ty === 'number' && Math.abs(ty + h / 2) < 1)) return;
  o.top = 0;
  o.bottom = 0;
  o.justifyContent = 'center';
  const rest = tf.filter((_, j) => j !== i);
  if (rest.length) o.transform = rest; else delete o.transform;
}

const POSITIONED_KEYS = /^(position|transform|top|left|right|bottom)$/;
const WRAP_KEYS = /^(position|top|left|right|bottom|transform|margin|zIndex|alignSelf|flexShrink|flexGrow)/;

cssInterop(SvgIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: { width: true, height: true, color: true, fill: true },
  },
});

// Dal contesto di testo ereditato tengo solo il colore (text-<colore>), non dimensione/peso.
export const TEXT_COLOR = /^(?:[a-z0-9]+:)*text-(?!(?:xs|sm|base|lg|xl|[2-9]xl|left|center|right|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)$)[a-z]/;

/** Icona con animate-spin / animate-pulse: animazione sul driver nativo (non Reanimated di NativeWind). */
function AnimatedSvgIcon({ kind, ...props }: { kind: CssAnimationKind } & Record<string, any>) {
  const anim = useCssAnimation(kind);
  return <SvgIcon {...(props as any)} anim={anim} />;
}

/**
 * Icona con transition-transform e una trasformazione di stato (la freccia `rotate-180` dei pannelli che si
 * aprono): la rotazione si anima sul driver nativo invece di scattare.
 */
function TransitionSvgIcon({ duration, transform, ...props }: { duration: number; transform: NonNullable<ReturnType<typeof classTransform>> } & Record<string, any>) {
  const tr = useCssTransition({ transform: duration }, undefined, undefined, 0, transform);
  return <SvgIcon {...(props as any)} anim={tr.style ?? undefined} />;
}

// Sul telefono transition-*/duration-* e le varianti hover:/focus:/active: non vanno a NativeWind (come per Div
// in webClasses e per il testo in ui/text): con `transition-transform` la sua interop rendeva l'icona senza
// le classi mappate sulle prop, cioè 24 px e senza colore (la freccia nera del mese in Dashboard al posto di
// quella viola da 12 px). La rotazione di stato la anima TransitionSvgIcon.
const ICON_SKIP = /^(?:(?:[\w-]+:)*(?:hover|focus|focus-visible|focus-within|active|group-hover(?:\/[\w-]+)?|peer-hover(?:\/[\w-]+)?):\S+|(?:[\w-]+:)*(?:transition(?:-\S+)?|duration-\S+|ease-\S+|delay-\S+))$/;
const iconClassCache = new Map<string, string>();
function nativeIconClass(className: string | undefined): string | undefined {
  if (Platform.OS === 'web' || !className) return className;
  let v = iconClassCache.get(className);
  if (v === undefined) {
    v = className.split(/\s+/).filter((c) => c && !ICON_SKIP.test(c)).join(' ');
    if (iconClassCache.size > 3000) iconClassCache.clear();
    iconClassCache.set(className, v);
  }
  return v;
}

export function makeIcon(name: string, node: IconNode) {
  function Icon({ className: rawClassName, size, color, fill, strokeWidth, style }: IconProps) {
    const kind = Platform.OS !== 'web' ? cssAnimationOf(rawClassName) : null;
    const trMs = Platform.OS !== 'web' && !kind ? transitionSpec(rawClassName, undefined)?.transform : undefined;
    const trTransform = trMs ? classTransform(rawClassName) : null;
    const className = nativeIconClass(kind ? withoutCssAnimation(rawClassName ?? '') : trTransform ? withoutClassTransform(rawClassName ?? '') : rawClassName);
    const inheritedText = useContext(TextClassContext);
    const inheritedStyleColor = useContext(TextStyleContext).color as string | undefined;
    const iconDefaults = useContext(IconClassContext);
    // currentColor = colore del testo: anche quello dato con style dal contenitore (salvo classe propria)
    const ownColor = (className ?? '').split(/\s+/).some((c) => TEXT_COLOR.test(c));
    // style={{ color }} dell'icona (es. 'hsl(var(--primary))' della rotella di Academy): in CSS lo stile in
    // linea vince sulle classi; la prop color di lucide (attributo stroke) vince su entrambi
    const { color: rawStyleColor, ...styleRest0 } = (style ? StyleSheet.flatten(style) : {}) as Record<string, unknown>;
    // style={{ width, height }} (rotella di Academy: 14 × scala): in CSS vince sulle classi; sull'Svg le prop
    // width/height (24 di default) vincevano sullo style e le icone restavano da 24
    const { width: styleW, height: styleH, ...styleRest1 } = styleRest0;
    const sizeFromStyle = typeof styleW === 'number' || typeof styleH === 'number';
    const styleRest = sizeFromStyle ? styleRest1 : styleRest0;
    const styleColor = rawStyleColor != null ? cssColor(rawStyleColor) : undefined;
    const effectiveColor = color ?? styleColor ?? (!ownColor ? inheritedStyleColor : undefined);
    const inheritedColor = inheritedText.split(/\s+/).filter((c) => TEXT_COLOR.test(c)).join(' ');
    // size esplicito (prop, come in lucide) vince sulle classi di dimensione di default
    const sizeClasses = size != null ? '' : cn('w-6 h-6', iconDefaults);
    // il tipo resta lo stesso per tutta la vita dell'icona finché la classe di transizione c'è
    const Comp: any = kind ? AnimatedSvgIcon : trTransform ? TransitionSvgIcon : SvgIcon;
    return (
      <Comp
        {...(kind ? { kind } : null)}
        {...(trTransform ? { duration: trMs, transform: trTransform } : null)}
        node={node}
        className={cn(sizeClasses, 'text-foreground', inheritedColor, className)}
        {...(size != null ? { width: size, height: size } : null)}
        {...(sizeFromStyle ? { ...(typeof styleW === 'number' ? { width: styleW } : null), ...(typeof styleH === 'number' ? { height: styleH } : null) } : null)}
        {...(effectiveColor ? { color: effectiveColor } : null)}
        {...(fill ? { fill } : null)}
        strokeWidth={strokeWidth ?? 2}
        style={styleColor || sizeFromStyle ? styleRest : style}
      />
    );
  }
  Icon.displayName = name;
  return Icon;
}
