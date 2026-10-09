// Testo con le regole del web: le classi di testo del contenitore (colore, dimensione, peso...)
// si ereditano come in CSS, e il peso sceglie il file del font Inter corrispondente
// (in React Native ogni peso di un font personalizzato è una famiglia separata).
import { createContext, useContext, type ReactNode } from 'react';
import { Platform, StyleSheet, Text as RNText, type TextProps } from 'react-native';
import { cn } from './cn';
import { ARB_SIZE, fontSizeOf, inheritedLineHeight, inlineLineBox, lineHeightOf, strutDescent, textClassesFor } from './textLeading';
import { nextTextStyle, weightClass, withoutClassOverrides, type TextStyle } from './textStyleInherit';
import { webStyle } from './webStyle';

export { textClassesFor };

/**
 * Che cosa è in CSS il contenitore più vicino: 'flex' (solo allora i figli hanno flex-shrink: 1,
 * default degli elementi flex), 'block' (i figli non si restringono mai, ma in RN ogni View è flex:
 * senza questo il corpo scorrevole di un dialog con space-y-3 verrebbe schiacciato; un elemento in
 * linea vi sta in una riga alta almeno quanto l'interlinea del blocco, vedi useInlineBox) o 'text'.
 */
export type ParentLayout = 'flex' | 'block' | 'text';
export const FlexParentContext = createContext<ParentLayout>('flex');

/** Proprietà di testo scritte in `style` dai contenitori (colore, dimensione...), ereditate come in CSS. */
export const TextStyleContext = createContext<TextStyle>({});

/** Classi di testo ereditate dal contenitore più vicino (come la cascata CSS). */
export const TextClassContext = createContext<string>('');

const TEXT_CLASS = /^(?:[a-z0-9]+:)*(?:-?text-|font-|leading-|tracking-|uppercase$|lowercase$|capitalize$|normal-case$|italic$|not-italic$|underline$|line-through$|no-underline$|tabular-nums$|whitespace-|break-|truncate$|antialiased$|line-clamp-)/;

/** Separa le classi che in CSS si ereditano (testo) da quelle del box. */
const splitCache = new Map<string, [string, string]>();

export function splitTextClasses(className?: string): [text: string, box: string] {
  if (!className) return ['', ''];
  let out = splitCache.get(className);
  if (!out) {
    if (splitCache.size > 5000) splitCache.clear();
    out = computeSplit(className);
    splitCache.set(className, out);
  }
  return out;
}

function computeSplit(className?: string): [text: string, box: string] {
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

// pila `font-mono` di Tailwind, come l'originale (sul web `monospace` da solo sceglie un altro font)
const MONO_WEB = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export function fontFamilyFor(classes: string): string | undefined {
  const list = classes.split(/\s+/);
  if (list.includes('font-mono')) return Platform.select({ ios: 'Menlo', web: MONO_WEB, default: 'monospace' });
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
 *  - interlinea ereditata quando la dimensione è arbitraria (text-[10px] o style): vedi inheritedLineHeight
 *  - flex-shrink: 1 sugli elementi in un contenitore flex
 */
function cssDefaults(merged: string, inherited: string, own: string, style: any, inFlex: boolean) {
  const out: Record<string, number> = {};
  if (!LEADING.test(own) && style?.lineHeight == null && !NAMED_SIZE.test(own)) {
    // dimensione effettiva arbitraria (propria, da style o ereditata): le classi con nome hanno già l'interlinea
    const arb = (NAMED_SIZE.test(merged) && !ARB_SIZE.test(own) ? null : merged.match(ARB_SIZE));
    const size = typeof style?.fontSize === 'number' ? style.fontSize : arb ? Number(arb[1]) : null;
    // leading-[Npx] del contesto è sintetico (textClassesFor): NativeWind non lo conosce, lo applichiamo qui
    if (size != null) out.lineHeight = inheritedLineHeight(inherited, size);
  }
  if (inFlex && !SHRINK.test(merged) && style?.flexShrink == null) out.flexShrink = 1;
  return out;
}

// In CSS una parola che non ci sta sborda (overflow-wrap: normal); RN-web di default la spezza
// (word-wrap: break-word): es. "€257.818" in una colonna stretta. Sul telefono resta il comportamento di RN.
const WEB_NO_WORD_BREAK = Platform.OS === 'web' ? ({ wordWrap: 'normal', overflowWrap: 'normal' } as object) : null;

export function Text({ className, style, numberOfLines, children, ...props }: AppTextProps) {
  const inherited = useContext(TextClassContext);
  const inheritedStyle = useContext(TextStyleContext);
  const inFlex = useContext(FlexParentContext) === 'flex';
  const merged = cn('text-base text-foreground', inherited, className);
  const converted = webStyle(StyleSheet.flatten(style)).style;
  // style di testo dei contenitori, salvo ciò che le classi proprie ridefiniscono
  const applied = withoutClassOverrides(inheritedStyle, className);
  // peso: style proprio > classe propria > style ereditato > classi ereditate
  const ownWeight = /(^|\s)font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)(\s|$)/.test(className ?? '');
  const styleWeight = weightClass(converted.fontWeight) ?? (ownWeight ? null : weightClass(applied.fontWeight));
  const fontFamily = fontFamilyFor(styleWeight ? `${merged} ${styleWeight}` : merged);
  const childStyle = nextTextStyle(inheritedStyle, className, converted);
  const truncate = /(^|\s)truncate(\s|$)/.test(merged);
  const clamp = Number(merged.match(/(?:^|\s)line-clamp-(\d+)/)?.[1] ?? 0);
  return (
    <RNText
      {...props}
      numberOfLines={numberOfLines ?? (truncate ? 1 : clamp || undefined)}
      className={merged}
      // il peso è già nel file del font: fontWeight lo raddoppierebbe su Android
      style={[cssDefaults(merged, inherited, className ?? '', { ...applied, ...converted }, inFlex), WEB_NO_WORD_BREAK, applied, converted, fontFamily ? { fontFamily, fontWeight: 'normal' } : null]}
    >
      {/* i figli (testo annidato, icone) ereditano colore e stile come in CSS */}
      <FlexParentContext.Provider value="text">
        <TextStyleContext.Provider value={childStyle}>
          <TextClassContext.Provider value={merged}>{children}</TextClassContext.Provider>
        </TextStyleContext.Provider>
      </FlexParentContext.Provider>
    </RNText>
  );
}

/** index.css dell'originale: `input, select, textarea { font-size: 16px !important }` (niente zoom su iOS),
 *  tranne `.semina-note-textarea` (11px). Vince su classi e style inline, quindi va messo per ultimo. */
export function inputFontSize(classes?: string): { fontSize: number } {
  return { fontSize: classes && /(^|\s)semina-note-textarea(\s|$)/.test(classes) ? 11 : 16 };
}

const NOT_INLINE = /(^|\s)(absolute|fixed|block|inline-block|flex|inline-flex|grid|hidden|sr-only)(\s|$)/;

/**
 * <span>/<label> da soli in un blocco: in CSS la riga è alta almeno quanto l'interlinea del blocco
 * (lo "strut"), con il testo allineato sulla linea di base. Restituisce il padding da mettere
 * attorno al Text, o null quando non serve (contenitore flex o testo, stesso font del blocco).
 */
export function useInlineBox(className?: string): { paddingTop: number; paddingBottom: number } | null {
  const layout = useContext(FlexParentContext);
  const inherited = useContext(TextClassContext);
  if (layout !== 'block' || NOT_INLINE.test(className ?? '')) return null;
  const own = textClassesFor(inherited, className ?? '');
  const size = fontSizeOf(own), lh = lineHeightOf(own);
  const parentSize = fontSizeOf(inherited), parentLh = lineHeightOf(inherited);
  if (size === parentSize && lh === parentLh) return null;
  const box = inlineLineBox(parentSize, parentLh, size, lh);
  return { paddingTop: box.top, paddingBottom: Math.max(0, box.height - box.top - lh) };
}

/**
 * <textarea> è in linea: in un blocco sta sulla linea di base, con sotto lo spazio del
 * discendente del contenitore (~6px con text-base). Restituisce il margine da aggiungere sotto.
 */
export function useTextareaBaselineGap(className?: string): number {
  const layout = useContext(FlexParentContext);
  const inherited = useContext(TextClassContext);
  if (layout !== 'block' || NOT_INLINE.test(className ?? '')) return 0;
  return strutDescent(fontSizeOf(inherited), lineHeightOf(inherited));
}
