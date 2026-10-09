// Testo con le regole del web: le classi di testo del contenitore (colore, dimensione, peso...)
// si ereditano come in CSS, e il peso sceglie il file del font Inter corrispondente
// (in React Native ogni peso di un font personalizzato è una famiglia separata).
import { createContext, useContext, type ReactNode } from 'react';
import { Platform, StyleSheet, Text as RNText, type TextProps } from 'react-native';
import { cn } from './cn';
import { webStyle } from './webStyle';

/** Classi di testo ereditate dal contenitore più vicino (come la cascata CSS). */
export const TextClassContext = createContext<string>('');

const TEXT_CLASS = /^(?:[a-z0-9]+:)*(?:-?text-|font-|leading-|tracking-|uppercase$|lowercase$|capitalize$|normal-case$|italic$|not-italic$|underline$|line-through$|no-underline$|tabular-nums$|whitespace-|break-|truncate$|antialiased$|line-clamp-)/;

/** Separa le classi che in CSS si ereditano (testo) da quelle del box. */
export function splitTextClasses(className?: string): [text: string, box: string] {
  if (!className) return ['', ''];
  const text: string[] = [];
  const box: string[] = [];
  for (const c of className.split(/\s+/)) {
    if (!c) continue;
    // truncate va su entrambi: overflow sul box, ellissi sul testo
    if (c === 'truncate') { text.push(c); box.push('overflow-hidden'); continue; }
    (TEXT_CLASS.test(c) ? text : box).push(c);
  }
  return [text.join(' '), box.join(' ')];
}

// Inter: un file per peso (caricati in app/_layout.tsx)
const WEIGHT_FAMILY: Record<string, string> = {
  'font-thin': 'Inter_100Thin',
  'font-extralight': 'Inter_200ExtraLight',
  'font-light': 'Inter_300Light',
  'font-normal': 'Inter_400Regular',
  'font-medium': 'Inter_500Medium',
  'font-semibold': 'Inter_600SemiBold',
  'font-bold': 'Inter_700Bold',
  'font-extrabold': 'Inter_800ExtraBold',
  'font-black': 'Inter_900Black',
};
const DISPLAY_FAMILY: Record<string, string> = {
  'font-normal': 'PlayfairDisplay_400Regular',
  'font-medium': 'PlayfairDisplay_500Medium',
  'font-semibold': 'PlayfairDisplay_600SemiBold',
  'font-bold': 'PlayfairDisplay_700Bold',
};

export function fontFamilyFor(classes: string): string | undefined {
  const list = classes.split(/\s+/);
  if (list.includes('font-mono')) return Platform.select({ ios: 'Menlo', default: 'monospace' });
  let weight = 'font-normal';
  for (const c of list) if (WEIGHT_FAMILY[c]) weight = c; // vince l'ultima, come in CSS
  if (list.includes('font-display')) return DISPLAY_FAMILY[weight] ?? DISPLAY_FAMILY['font-normal'];
  return WEIGHT_FAMILY[weight];
}

export type AppTextProps = TextProps & { className?: string; children?: ReactNode };

// Le classi di dimensione con nome (text-xs, text-sm...) hanno già la loro interlinea in Tailwind
const NAMED_SIZE = /(^|\s)text-(xs|sm|base|lg|xl|[2-9]xl)(\s|$)/;
const LEADING = /(^|\s)leading-/;
const SHRINK = /(^|\s)(shrink-0|flex-shrink-0|flex-none|shrink|flex-1|flex-auto)(\s|$)/;

/**
 * Regole CSS che il web applica di default e RN no:
 *  - line-height 1.5 (preflight di Tailwind) quando la dimensione è arbitraria (text-[10px] o style)
 *  - flex-shrink: 1 sugli elementi in un contenitore flex
 */
function cssDefaults(merged: string, style: any) {
  const out: Record<string, number> = {};
  if (!LEADING.test(merged) && style?.lineHeight == null) {
    const arb = merged.match(/(?:^|\s)text-\[(\d+(?:\.\d+)?)px\]/);
    const size = typeof style?.fontSize === 'number' ? style.fontSize : arb && !NAMED_SIZE.test(merged) ? Number(arb[1]) : null;
    if (size != null) out.lineHeight = Math.round(size * 1.5 * 100) / 100;
  }
  if (!SHRINK.test(merged) && style?.flexShrink == null) out.flexShrink = 1;
  return out;
}

export function Text({ className, style, numberOfLines, children, ...props }: AppTextProps) {
  const inherited = useContext(TextClassContext);
  const merged = cn('text-base text-foreground', inherited, className);
  const fontFamily = fontFamilyFor(merged);
  const converted = webStyle(StyleSheet.flatten(style)).style;
  const truncate = /(^|\s)truncate(\s|$)/.test(merged);
  const clamp = Number(merged.match(/(?:^|\s)line-clamp-(\d+)/)?.[1] ?? 0);
  return (
    <RNText
      {...props}
      numberOfLines={numberOfLines ?? (truncate ? 1 : clamp || undefined)}
      className={merged}
      // il peso è già nel file del font: fontWeight lo raddoppierebbe su Android
      style={[cssDefaults(merged, converted), converted, fontFamily ? { fontFamily, fontWeight: 'normal' } : null]}
    >
      {/* i figli (testo annidato, icone) ereditano colore e stile come in CSS */}
      <TextClassContext.Provider value={merged}>{children}</TextClassContext.Provider>
    </RNText>
  );
}
