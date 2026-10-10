// Icona lucide resa con react-native-svg, con il comportamento del web:
// - dimensione e colore dalle classi (w-4 h-4 text-primary fill-yellow-400, size-4...)
// - senza colore esplicito prende quello del testo che la contiene (currentColor)
// - dentro i bottoni le dimensioni di default arrivano da IconClassContext ([&_svg]:size-4)
import { createContext, useContext } from 'react';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';
import { cssInterop } from 'nativewind';
import { Platform, StyleSheet, View } from 'react-native';
import { cn } from './cn';
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

function SvgIcon({ node, width = 24, height = 24, color = 'currentColor', fill = 'none', strokeWidth = 2, style }: {
  className?: string;
  node: IconNode; width?: number; height?: number; color?: string; fill?: string; strokeWidth?: number | string; style?: object;
}) {
  // posizione e trasformazioni (absolute top-1/2 -translate-y-1/2 delle icone dentro i campi):
  // sull'Svg di Android il translate in percentuale non si applica, su una View sì
  const flat = (StyleSheet.flatten(style) ?? {}) as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = {};
  const wrap = Platform.OS !== 'web' && Object.keys(flat).some((k) => POSITIONED_KEYS.test(k));
  for (const [k, v] of Object.entries(flat)) (wrap && WRAP_KEYS.test(k) ? outer : inner)[k] = v;
  const svg = (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" style={wrap ? inner : style}>
      {node.map(([tag, attrs], i) => {
        const El = ELEMENTS[tag];
        if (!El) return null;
        const props = Object.fromEntries(Object.entries(attrs).map(([k, v]) => [camel(k), v]));
        return <El key={i} {...props} />;
      })}
    </Svg>
  );
  return wrap ? <View style={outer}>{svg}</View> : svg;
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

export function makeIcon(name: string, node: IconNode) {
  function Icon({ className, size, color, fill, strokeWidth, style }: IconProps) {
    const inheritedText = useContext(TextClassContext);
    const inheritedStyleColor = useContext(TextStyleContext).color as string | undefined;
    const iconDefaults = useContext(IconClassContext);
    // currentColor = colore del testo: anche quello dato con style dal contenitore (salvo classe propria)
    const ownColor = (className ?? '').split(/\s+/).some((c) => TEXT_COLOR.test(c));
    const effectiveColor = color ?? (!ownColor ? inheritedStyleColor : undefined);
    const inheritedColor = inheritedText.split(/\s+/).filter((c) => TEXT_COLOR.test(c)).join(' ');
    // size esplicito (prop, come in lucide) vince sulle classi di dimensione di default
    const sizeClasses = size != null ? '' : cn('w-6 h-6', iconDefaults);
    return (
      <SvgIcon
        node={node}
        className={cn(sizeClasses, 'text-foreground', inheritedColor, className)}
        {...(size != null ? { width: size, height: size } : null)}
        {...(effectiveColor ? { color: effectiveColor } : null)}
        {...(fill ? { fill } : null)}
        strokeWidth={strokeWidth ?? 2}
        style={style}
      />
    );
  }
  Icon.displayName = name;
  return Icon;
}
