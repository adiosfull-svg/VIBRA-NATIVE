// Altri elementi HTML dell'app web resi in React Native, con le stesse prop del web:
//   <img> → Img   <a> → A   <table>/<tr>/<td>/<th> → Table/Tr/Td/Th
//   <input>/<textarea>/<select><option> → HtmlInput/HtmlTextarea/HtmlSelect/HtmlOption
//   <svg>/<path>/... → react-native-svg (via Svg* re-export)   <hr> → Hr
import { Image, type ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Children, createContext, forwardRef, isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { Linking, Platform, Pressable, StyleSheet, TextInput, View, type LayoutChangeEvent, type TextInputProps } from 'react-native';
import { cn } from './cn';
import { DateField } from './dateField';
import { isDateInputType } from './dateValue';
import { FileField } from './fileField';
import { ColorField } from './colorField';
import { CheckField } from './checkField';
import { datalistMatches, useDatalist } from './datalist';
import { useTextFormField } from './formContext';
import { keyDownProps, type WebKeyEvent } from './keyEvents';
import { Btn, Div, Span } from './html';
import { BrowserSelectTrigger, Select, SelectContent, SelectItem } from './menu';
import { THEME } from './palette.generated';
import { fontFamilyFor, inputFontSize, TextClassContext, TextStyleContext, useTextareaBaselineGap } from './text';
import { TEXT_COLOR } from './icon';
import { cssColor, webStyle } from './webStyle';
import { useDomStyleRef } from './domStyle';
import { TEST_DIAG } from '../lib/testDiag';
import { IMAGE_CACHE, imageSource, markImageWarm } from './imageCache';
import { inheritedLineHeight } from './textLeading';
import { useFocusStyle } from './useFocusStyle';
import RNSvg, { Path as SvgPath, type PathProps, type SvgProps } from 'react-native-svg';

// ── <img> ────────────────────────────────────────────────────────────────────
cssInterop(Image, { className: 'style' });

type ImgProps = Omit<ImageProps, 'source'> & {
  src?: string | null; alt?: string; className?: string;
  loading?: string; decoding?: string; crossOrigin?: string; draggable?: boolean;
  onError?: () => void; onLoad?: () => void;
};

/** object-cover/contain/fill delle classi → contentFit */
function fitFrom(className = ''): ImageProps['contentFit'] {
  if (/(^|\s)object-contain(\s|$)/.test(className)) return 'contain';
  if (/(^|\s)object-fill(\s|$)/.test(className)) return 'fill';
  if (/(^|\s)object-none(\s|$)/.test(className)) return 'none';
  return 'cover';
}

// <img class="h-9"> senza larghezza: in CSS la larghezza viene dalle proporzioni dell'immagine; in RN resta 0
// e l'immagine non si vede (logo VIBRA accanto a «Bacheca riconoscimenti»). Proporzioni note dopo il primo
// caricamento (onLoad), tenute per src: alle aperture dopo l'immagine ha subito la sua larghezza.
const ONE_SIDE_H = /(^|\s)(h-(?!auto)\S+)(\s|$)/;
const OWN_W = /(^|\s)(w-(?!auto(?:\s|$))\S+|size-\S+|min-w-\S+|aspect-\S+|inset-0|inset-x-0|absolute)(\s|$)/;
const ONE_SIDE_W = /(^|\s)(w-(?!auto)\S+)(\s|$)/;
const OWN_H = /(^|\s)(h-(?!auto(?:\s|$))\S+|size-\S+|min-h-\S+|aspect-\S+|inset-0|inset-y-0|absolute)(\s|$)/;
const MIN_MAX_H = /(^|\s)(min-h|max-h)-\S+/;
const MIN_MAX_W = /(^|\s)(min-w|max-w)-\S+/;
const imageAspect = new Map<string, number>();
function needsAspect(className: string | undefined, style: Record<string, unknown>): boolean {
  if (Platform.OS === 'web' || !className || style.aspectRatio != null) return false;
  const h = (ONE_SIDE_H.test(className) || style.height != null) && !OWN_W.test(className) && style.width == null
    && style.minWidth == null && style.maxWidth == null && !MIN_MAX_W.test(className);
  // con min/max sull'altra dimensione (slide di Formazione: w-full, minHeight 300) in CSS l'altezza si ferma
  // al minimo e la larghezza resta; in Yoga aspectRatio allargava l'immagine oltre il riquadro (tagliata)
  const w = (ONE_SIDE_W.test(className) || style.width != null) && !OWN_H.test(className) && style.height == null
    && style.minHeight == null && style.maxHeight == null && !MIN_MAX_H.test(className);
  return h || w;
}

export function Img({ src, alt, className, loading: _l, decoding: _d, crossOrigin: _c, draggable: _dr, onError, onLoad, style, ...props }: ImgProps) {
  const [aspect, setAspect] = useState<number | undefined>(() => (src ? imageAspect.get(src) : undefined));
  if (!src) return null;
  // style in forma CSS (es. CachedImage: opacity undefined, transition) → RN
  const rnStyle0 = webStyle(Array.isArray(style) ? StyleSheet.flatten(style) : style).style;
  const wantAspect = needsAspect(className, rnStyle0 as Record<string, unknown>);
  const knownAspect = wantAspect ? (aspect ?? imageAspect.get(src)) : undefined;
  // aspetto ancora ignoto: quadrato provvisorio. Con un lato a 0 Glide non scarica l'immagine e onLoad non
  // arrivava mai (logo accanto alla stellina di VibraGPT, h-14 w-auto)
  const rnStyle = wantAspect ? { ...rnStyle0, aspectRatio: knownAspect ?? 1 } : rnStyle0;
  const image = (imageClass: string | undefined, imageStyle: object | undefined) => (
    <Image
      source={imageSource(src)}
      accessibilityLabel={alt}
      className={imageClass}
      contentFit={fitFrom(className)}
      cachePolicy={IMAGE_CACHE}
      // righe di liste riciclate: senza chiave l'immagine vecchia resta visibile un frame
      recyclingKey={src}
      onError={onError ? () => onError() : undefined}
      onLoad={(e) => {
        markImageWarm(src);
        const { width, height } = (e as { source?: { width?: number; height?: number } }).source ?? {};
        if (wantAspect && width && height) {
          const a = width / height;
          imageAspect.set(src, a);
          if (Math.abs((aspect ?? 0) - a) > 0.001) setAspect(a);
        }
        onLoad?.();
      }}
      {...props}
      style={imageStyle}
    />
  );
  // Sul web expo-image appiattisce lo style (StyleSheet.flatten) e fonderebbe la classe compilata
  // con lo style inline (errore "styleq: opacity typeof 0..."): classi e style vanno su un contenitore
  // che l'immagine riempie, la stessa struttura che expo-image crea da sé.
  if (Platform.OS === 'web' && className && Object.keys(rnStyle).length) {
    return <View className={className} style={[{ overflow: 'hidden' }, rnStyle]}>{image(undefined, StyleSheet.absoluteFill)}</View>;
  }
  return image(className, Object.keys(rnStyle).length ? rnStyle : undefined);
}

// ── <a> ──────────────────────────────────────────────────────────────────────
export function A({ href, children, className, onClick, target: _t, rel: _r, style }: {
  href?: string; children?: ReactNode; className?: string; onClick?: () => void; target?: string; rel?: string; style?: object;
}) {
  const open = () => {
    onClick?.();
    if (!href) return;
    const url = href.startsWith('wa.me') ? `https://${href}` : href;
    Linking.openURL(url).catch(() => {});
  };
  return <Btn accessibilityRole="link" className={className} onClick={open} style={style}>{children}</Btn>;
}

// ── tabelle ──────────────────────────────────────────────────────────────────
// Layout automatico come nel browser: un primo giro con le celle alla larghezza del contenuto
// (misurate con onLayout), poi ogni colonna prende la sua larghezza massima, più una parte dello
// spazio che avanza in proporzione. Se il contenuto è più largo della tabella, la tabella si
// allarga (come in CSS quando le celle non vanno a capo, es. whitespace-nowrap: di solito è
// dentro un overflow-x-auto). Le colonne che in CSS andrebbero a capo qui non si stringono.
type CellProps = { className?: string; children?: ReactNode; colSpan?: number; rowSpan?: number; style?: object; onClick?: (e?: any) => void };
/** data-* di una riga (data-client-id dei menu del tasto lungo): passati a Div/Btn, che li registrano */
type DataProps = { [k: `data-${string}`]: string | number | boolean | null | undefined };
function dataPropsOf(props: object): DataProps | null {
  let out: DataProps | null = null;
  for (const k in props) if (k.startsWith('data-')) (out ??= {})[k as `data-${string}`] = (props as DataProps)[k as `data-${string}`];
  return out;
}

type TableLayout = { widths: number[] | null; report: (col: number, width: number, cell: object) => void; forget: (cell: object) => void };
const TableContext = createContext<TableLayout | null>(null);
const ColumnContext = createContext<{ col: number; span: number } | null>(null);

/** Larghezze delle colonne: massimo per colonna, più lo spazio che avanza in proporzione. */
export function tableColumnWidths(natural0: number[], tableWidth: number): number[] {
  const natural = natural0;
  const sum = natural.reduce((a, b) => a + b, 0);
  if (!sum || sum >= tableWidth) return natural;
  return natural.map((w) => (w * tableWidth) / sum);
}

/** Testo dei figli: se cambia (righe nuove, ordinamento...) le colonne si rimisurano. */
function contentSignature(children: ReactNode): string {
  let out = '';
  Children.forEach(children, (c) => {
    if (typeof c === 'string' || typeof c === 'number') out += `${c}|`;
    else if (isValidElement(c)) out += `<${contentSignature((c.props as { children?: ReactNode }).children)}>`;
  });
  return out;
}

/**
 * `measureKey` (facoltativo): le colonne si rimisurano solo quando cambia questo valore e non a ogni
 * cambio del contenuto. Serve alle tabelle con righe montate a poco a poco (hooks/useProgressiveList):
 * le righe nuove prendono subito le larghezze già calcolate, senza un frame di colonne disallineate.
 * Le larghezze vanno misurate su righe rappresentative montate da subito (es. righe nascoste alte 0
 * con i testi più lunghi, ReportPreview).
 */
export function Table({ className, children, style, measureKey }: { className?: string; children?: ReactNode; style?: object; measureKey?: unknown }) {
  const signature = measureKey !== undefined ? measureKey : contentSignature(children);
  const [state, setState] = useState<{ sig: unknown; widths: number[] | null }>({ sig: signature, widths: null });
  // ultima larghezza naturale di ogni cella montata: a una nuova misura (contenuto cambiato) le celle il cui
  // layout non cambia non danno onLayout, e prima sparivano dal calcolo (intestazione della tabella dei
  // locali del Promoter: la colonna «Serate» scendeva a 28 px, larga quanto i numeri, e il titolo si
  // spezzava in «Se/rat/e»)
  const cells = useRef(new Map<object, { col: number; w: number }>());
  const reports = useRef<number[][]>([]);
  const tableWidth = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  if (state.sig !== signature) setState({ sig: signature, widths: null });
  const measuring = state.sig !== signature || state.widths == null;
  const finish = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const natural: number[] = [];
      cells.current.forEach(({ col, w }) => { natural[col] = Math.max(natural[col] ?? 0, w); });
      const widths = tableColumnWidths(Array.from(natural, (w) => w ?? 0), tableWidth.current);
      if (TEST_DIAG) console.log(`VIBRA tabella t=${Math.round(tableWidth.current)} n=${natural.map((w) => Math.round(w ?? 0))} w=${widths.map(Math.round)} top=${JSON.stringify(reports.current.map((r) => (r ?? []).sort((a, b) => b - a).slice(0, 4).map(Math.round)))}`);
      // stesse larghezze (a meno di arrotondamenti): nessun ridisegno
      setState((s) => (s.widths && s.widths.length === widths.length && s.widths.every((w, i) => Math.abs(w - widths[i]) < 0.5) ? s : { ...s, widths }));
    }, 16);
  }, []);
  const forget = useCallback((cell: object) => { cells.current.delete(cell); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  // nuova misura senza nessun onLayout (nessuna cella cambia): si chiude con le larghezze già note
  useEffect(() => { if (measuring) finish(); }, [measuring, state.sig, finish]);
  const ctx = useMemo<TableLayout>(() => ({
    widths: measuring ? null : state.widths,
    report: (col, width, cell) => { if (TEST_DIAG) (reports.current[col] ??= []).push(width); cells.current.set(cell, { col, w: width }); finish(); },
    forget,
  }), [measuring, state.widths, finish, forget]);
  return (
    <TableContext.Provider value={ctx}>
      <Div className={cn('flex flex-col w-full', className)} style={style}
        // larghezza della tabella letta solo mentre si misura: dopo, la tabella è larga quanto le colonne
        // (dentro overflow-x-auto) e ricalcolarle da lì la allargava di un pixel di arrotondamento a ogni
        // giro, per sempre (Analisi Clienti dell'admin: intestazione ridisegnata 3 volte al secondo)
        onLayout={(e) => {
          if (!measuring && tableWidth.current) return;
          const first = !tableWidth.current;
          tableWidth.current = e.nativeEvent.layout.width;
          // larghezza arrivata dopo la misura delle colonne: un ricalcolo, come prima
          if (!measuring && first) finish();
        }}>
        {children}
      </Div>
    </TableContext.Provider>
  );
}
export const Thead = ({ className, children, ref }: { className?: string; children?: ReactNode; ref?: Ref<View> }) => <Div ref={ref} className={cn('flex flex-col', className)}>{children}</Div>;
export const Tbody = Thead;
export const Tfoot = Thead;

export function Tr({ className, children, onClick, style, ...rest }: CellProps & DataProps) {
  const data = dataPropsOf(rest);
  // indice di colonna di ogni cella (colSpan compreso), anche se la cella è dentro un altro componente
  let col = 0;
  const cells = Children.toArray(children).map((child) => {
    const span = isValidElement(child) ? Number((child.props as { colSpan?: number }).colSpan ?? 1) : 1;
    const value = { col, span };
    col += span;
    return <ColumnContext.Provider key={isValidElement(child) ? child.key ?? col : col} value={value}>{child}</ColumnContext.Provider>;
  });
  // le celle di una riga sono alte uguali (contenuto centrato in verticale nella cella)
  return onClick
    ? <Btn className={cn('flex flex-row items-stretch', className)} onClick={onClick} style={style} {...data}>{cells}</Btn>
    : <Div className={cn('flex flex-row items-stretch', className)} style={style} {...data}>{cells}</Div>;
}

/** text-align della cella: allinea anche i blocchi in linea (inline-flex...) come in CSS. */
function cellAlign(className = ''): 'flex-start' | 'center' | 'flex-end' | undefined {
  const m = className.match(/(?:^|\s)text-(left|center|right)(?:\s|$)/);
  return m ? ({ left: 'flex-start', center: 'center', right: 'flex-end' } as const)[m[1] as 'left'] : undefined;
}

export function Td({ className, children, colSpan = 1, style, onClick }: CellProps) {
  const table = useContext(TableContext);
  const column = useContext(ColumnContext);
  const cellId = useRef({}).current;
  // forget è stabile (useCallback della Table): si toglie la cella solo allo smontaggio
  const forget = table?.forget;
  useEffect(() => () => forget?.(cellId), [forget, cellId]);
  let layout: object;
  let onLayout: ((e: LayoutChangeEvent) => void) | undefined;
  if (!table || !column) {
    // fuori da una Table: larghezza proporzionale (flex)
    const hasWidth = /(^|\s)(w-|min-w-|basis-|flex-)/.test(className ?? '');
    layout = hasWidth ? {} : { flex: colSpan };
  } else if (table.widths) {
    const width = table.widths.slice(column.col, column.col + column.span).reduce((a, b) => a + b, 0);
    layout = { width, flexGrow: 0, flexShrink: 0 };
  } else {
    layout = { flexGrow: 0, flexShrink: 0 };
    if (column.span === 1) onLayout = (e) => table.report(column.col, e.nativeEvent.layout.width, cellId);
  }
  const block = !/(^|\s)(flex|inline-flex|grid)(\s|$)/.test(className ?? '');
  const st = [layout, block ? { justifyContent: 'center' as const, alignItems: cellAlign(className) } : null, style];
  return onClick
    ? <Btn className={className} style={st} onClick={onClick} onLayout={onLayout}>{children}</Btn>
    : <Div className={className} style={st} onLayout={onLayout}>{children}</Div>;
}
export const Th = ({ className, ...p }: CellProps) => <Td className={cn('font-bold', className)} {...p} />;

// ── campi di input "grezzi" (senza le classi di base di ui/input) ─────────────
type RawInputProps = TextInputProps & {
  className?: string;
  type?: string;
  value?: string | number | null;
  onChange?: (e: any) => void;
  required?: boolean; multiple?: boolean; capture?: string; disabled?: boolean;
  min?: number | string; max?: number | string; step?: number | string; rows?: number;
  autoFocus?: boolean; maxLength?: number; list?: string; accept?: string;
  onKeyDown?: (e: WebKeyEvent) => void;
};

function inputTypeProps(type?: string): TextInputProps {
  switch (type) {
    case 'email': return { keyboardType: 'email-address', autoCapitalize: 'none' };
    case 'password': return { secureTextEntry: true, autoCapitalize: 'none' };
    case 'number': return { keyboardType: 'decimal-pad' };
    case 'tel': return { keyboardType: 'phone-pad' };
    case 'url': return { keyboardType: 'url', autoCapitalize: 'none' };
    default: return {};
  }
}

function rawInput({ className, type, value, onChange, onChangeText, onKeyDown, min: _min, max: _max, step: _s, rows, list: _l, accept: _a, required: _r, multiple: _m, capture: _c, disabled, style, ...props }: RawInputProps, submitForm: (() => void) | undefined, multiline = false) {
  const cls = cn('text-foreground text-base', className);
  return {
    ...inputTypeProps(type),
    ...props,
    ...(disabled ? { editable: false } : null),
    ...keyDownProps(onKeyDown, value == null ? '' : String(value), multiline, submitForm),
    value: value == null ? '' : String(value),
    onChangeText: (t: string) => { onChangeText?.(t); onChange?.({ target: { value: t } }); },
    placeholderTextColor: THEME['muted-foreground'],
    className: cls,
    numberOfLines: rows,
    style: [{ fontFamily: fontFamilyFor(cls) }, style, inputFontSize(cls)],
  };
}

/** Preflight: `line-height: inherit` sui campi (16px dall'index.css): l'interlinea del contenitore. */
const inputLineHeight = (inherited: string, className?: string) => inheritedLineHeight(cn(inherited, className), 16);

const RawTextInput = forwardRef<TextInput, RawInputProps & { multiline?: boolean }>(({ multiline = false, ...p }, ref) => {
  const { ref: inputRef, submit } = useTextFormField(ref, p.required, p.value);
  const gap = useTextareaBaselineGap(multiline ? p.className : 'block');
  const inherited = useContext(TextClassContext);
  const focus = useFocusStyle(p.className, p.onFocus as (e: any) => void, p.onBlur as (e: any) => void);
  const withFocus = { onFocus: focus.onFocus, onBlur: focus.onBlur };
  // leading-* del campo sulla SUA dimensione (es. semina-note-textarea a 11px): NativeWind la calcolava
  // sui 16px di text-base (22px di interlinea per un testo da 11: righe alte e testo spinto in basso)
  const ownLeading = multiline && /(^|\s)leading-/.test(p.className ?? '')
    ? { lineHeight: inheritedLineHeight(p.className ?? '', inputFontSize(cn('text-base', p.className)).fontSize) }
    : null;
  return multiline
    // overflow-hidden (textarea ad altezza automatica): in CSS non scorre mai; su Android il campo nativo
    // scorreva al suo interno e mostrava solo l'ultima riga della nota
    ? <TextInput ref={inputRef} multiline textAlignVertical="top" scrollEnabled={!/(^|\s)overflow(-y)?-hidden(\s|$)/.test(p.className ?? '')} {...rawInput({ ...p, ...withFocus, style: [ownLeading, p.style, gap ? { marginBottom: gap } : null, focus.focusStyle] }, submit, true)} />
    // numberOfLines 1: su Android il segnaposto lungo di un campo a una riga andava a capo, tagliato a metà
    // della seconda riga (ricerca di Semine); nel browser resta su una riga e sparisce oltre il bordo
    : <TextInput ref={inputRef} {...rawInput({ ...p, ...withFocus, style: [{ lineHeight: inputLineHeight(inherited, p.className) }, p.style, focus.focusStyle] }, submit)} numberOfLines={Platform.OS === 'android' ? 1 : undefined} />;
});
RawTextInput.displayName = 'RawTextInput';

/** <input>: testo, ma anche date/ora (DateField), file (FileField) e colore (ColorField) come nel browser. */
export const HtmlInput = forwardRef<any, RawInputProps>((p, ref) => {
  const { type, className, value, onChange, min, max, disabled, required, accept, multiple, capture, style } = p;
  if (isDateInputType(type)) {
    return <DateField ref={ref} type={type} value={value} onChange={onChange} onBlur={p.onBlur as () => void} min={min} max={max}
      disabled={disabled} required={required} style={style as object} className={cn('text-foreground text-base', className)} />;
  }
  if (type === 'checkbox' || type === 'radio') {
    const q = p as RawInputProps & { checked?: boolean; name?: string };
    return <CheckField type={type} checked={q.checked} value={value} name={q.name} disabled={disabled} className={className} onChange={onChange as never} />;
  }
  if (p.list) return <DatalistInput ref={ref} {...p} />;
  if (type === 'color') return <ColorField value={value as string} onChange={onChange as never} disabled={disabled} className={className} />;
  if (type === 'file') return <FileFieldWithId id={(p as { id?: string }).id} ref={ref} accept={accept} multiple={multiple} capture={capture} disabled={disabled} className={className} onChange={onChange} />;
  return <RawTextInput ref={ref} {...p} />;
});
HtmlInput.displayName = 'HtmlInput';

/** <input type="file" id="..."> : document.getElementById(id).click() apre la scelta anche sul telefono. */
const FileFieldWithId = forwardRef<any, Parameters<typeof FileField>[0] & { id?: string }>(({ id, ...p }, ref) => {
  const setRef = useDomStyleRef(ref as never, id);
  return <FileField ref={setRef} {...p} />;
});
FileFieldWithId.displayName = 'FileFieldWithId';

/** <input list="id">: sotto il campo i suggerimenti del <datalist> (HtmlDatalist) mentre ha il fuoco. */
const DatalistInput = forwardRef<any, RawInputProps>((p, ref) => {
  const options = useDatalist(p.list as string | undefined);
  const [focused, setFocused] = useState(false);
  const shown = focused ? datalistMatches(options, p.value) : [];
  return (
    <View>
      <RawTextInput ref={ref} {...p}
        onFocus={(e: any) => { setFocused(true); (p.onFocus as any)?.(e); }}
        onBlur={(e: any) => { setTimeout(() => setFocused(false), 150); (p.onBlur as any)?.(e); }} />
      {shown.length ? (
        <Div className="mt-1 rounded-md border border-border bg-popover overflow-hidden">
          {shown.map((o) => (
            <Btn key={o} className="px-3 py-2 active:bg-secondary/50" onClick={() => { (p.onChange as any)?.({ target: { value: o } }); setFocused(false); }}>
              <Span className="text-sm text-foreground">{o}</Span>
            </Btn>
          ))}
        </Div>
      ) : null}
    </View>
  );
});
DatalistInput.displayName = 'DatalistInput';
export { HtmlDatalist } from './datalist';
export const HtmlTextarea = forwardRef<TextInput, RawInputProps>((p, ref) => <RawTextInput ref={ref} multiline {...p} />);
HtmlTextarea.displayName = 'HtmlTextarea';

// ── <select><option> ─────────────────────────────────────────────────────────
export const HtmlOption = (_: { value?: string | number; children?: ReactNode; disabled?: boolean }) => null;

export function HtmlSelect({ value, onChange, children, className, disabled }: {
  value?: string | number; onChange?: (e: { target: { value: string } }) => void; children?: ReactNode; className?: string; disabled?: boolean;
}) {
  const options: { value: string; label: string }[] = [];
  const collect = (nodes: ReactNode) => Children.forEach(nodes, (c) => {
    if (!isValidElement(c)) return;
    const p = c.props as { value?: string | number; children?: ReactNode };
    if (c.type === HtmlOption) options.push({ value: String(p.value ?? ''), label: Children.toArray(p.children).join('') });
    else if (p.children) collect(p.children);
  });
  collect(children);
  const current = options.find((o) => o.value === String(value ?? ''));
  return (
    <Select value={String(value ?? '')} onValueChange={(v) => onChange?.({ target: { value: v } })} disabled={disabled}>
      <BrowserSelectTrigger className={className} label={current?.label ?? options[0]?.label ?? ''} />
      <SelectContent>
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

// ── varie ────────────────────────────────────────────────────────────────────
export const Hr = ({ className }: { className?: string }) => <Div className={cn('h-px w-full bg-border', className)} />;

/** <label>: riquadro o testo in linea, attiva il controllo che contiene (ui/htmlLabel.tsx) */
export { HtmlLabel } from './htmlLabel';
export { CssStyleTag } from './cssStyleTag';

export { Pressable };
// ── <svg> ────────────────────────────────────────────────────────────────────
// Come le icone (icon.tsx): className → dimensioni e colore anche sul telefono, e senza un colore
// proprio prende quello del testo che la contiene (fill/stroke="currentColor").
const CSS_LENGTH = (v: unknown) => typeof v === 'string' && /calc\(|max\(|min\(|vh|vw/.test(v);

function SvgBox({ color, style, width, height, ...p }: SvgProps & { color?: string }) {
  // style in forma CSS (es. width: 'calc(100% + 16px)' nel binario di Academy, che cssInterop
  // sposta anche nella prop width): convertito come per Div. Passato così com'era, react-native-svg
  // chiudeva l'app sul telefono (NumberFormatException: "calc(100% + 16px)").
  const native = Platform.OS !== 'web';
  const cssW = native && CSS_LENGTH(width);
  const cssH = native && CSS_LENGTH(height);
  const rnStyle = useMemo(() => {
    if (!native || (!style && !cssW && !cssH)) return style;
    const flat = { ...(StyleSheet.flatten(style as never) as object), ...(cssW ? { width } : null), ...(cssH ? { height } : null) };
    return webStyle(flat).style;
  }, [native, style, cssW, cssH, width, height]);
  return <RNSvg color={color} style={rnStyle as SvgProps['style']} width={cssW ? undefined : width} height={cssH ? undefined : height} {...p} />;
}
cssInterop(SvgBox, { className: { target: 'style', nativeStyleToProp: { width: true, height: true, color: true } } });

export function Svg({ className, color: ownColor, ...p }: SvgProps & { className?: string; color?: string }) {
  const inheritedText = useContext(TextClassContext);
  const styleColor = useContext(TextStyleContext).color as string | undefined;
  const classColor = (className ?? '').split(/\s+/).some((c) => TEXT_COLOR.test(c));
  const color = ownColor ?? (classColor ? undefined : styleColor);
  const inheritedColor = inheritedText.split(/\s+/).filter((c) => TEXT_COLOR.test(c)).join(' ');
  return <SvgBox {...p} {...(color ? { color } : null)} className={cn(color ? '' : cn('text-foreground', inheritedColor), className)} />;
}

export { Circle, Defs, ForeignObject, G, Line, LinearGradient as SvgLinearGradient, Polygon, Polyline, Rect, Stop, Text as SvgText } from 'react-native-svg';

/** <path>: sul telefono il ref ha anche setAttribute('d', ...) come nel DOM (→ setNativeProps), usato dal
 *  codice portato per ridisegnare un tracciato senza re-render (es. bordo del binario di Academy). */
export const Path = forwardRef<any, PathProps>((props, ref) => {
  const setRef = useCallback((node: any) => {
    if (node && Platform.OS !== 'web' && !node.setAttribute) {
      try {
        node.setAttribute = (name: string, value: unknown) => { try { node.setNativeProps?.({ [name]: value }); } catch { /* non accettato */ } };
      } catch { /* istanza non estendibile */ }
    }
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: unknown }).current = node;
  }, [ref]);
  return <SvgPath ref={setRef} {...(Platform.OS === 'web' ? props : withRnColors(withRnPointerEvents(props)))} />;
});

// pointerEvents degli SVG del web ('stroke', 'visiblePainted', 'fill'...): su Android react-native-svg
// accetta solo i valori di RN e con gli altri l'app CADE (IllegalArgumentException "No enum constant
// ...STROKE": il filo trasparente delle Comitive chiudeva l'app all'apertura di una comitiva con legami).
// stroke/fill con variabili CSS (hsl(var(--border) / 0.4): bordo della rotella di Academy): react-native-svg
// non le conosce e non disegnava il tracciato
const CSS_VAR_COLOR = /var\(--/;
function withRnColors(props: PathProps): PathProps {
  const { stroke, fill } = props as { stroke?: unknown; fill?: unknown };
  const s = typeof stroke === 'string' && CSS_VAR_COLOR.test(stroke) ? cssColor(stroke) : undefined;
  const f = typeof fill === 'string' && CSS_VAR_COLOR.test(fill) ? cssColor(fill) : undefined;
  return s || f ? { ...props, ...(s ? { stroke: s } : null), ...(f ? { fill: f } : null) } : props;
}
const RN_POINTER_EVENTS = new Set(['auto', 'none', 'box-none', 'box-only']);
function withRnPointerEvents(props: PathProps): PathProps {
  const p = props as PathProps & { style?: unknown; pointerEvents?: string };
  const st = p.style as { pointerEvents?: string } | undefined;
  const badStyle = !!st && !Array.isArray(st) && typeof st === 'object' && st.pointerEvents != null && !RN_POINTER_EVENTS.has(st.pointerEvents);
  const badProp = p.pointerEvents != null && !RN_POINTER_EVENTS.has(p.pointerEvents);
  if (!badStyle && !badProp) return props;
  const out = { ...p };
  if (badStyle) out.style = { ...st, pointerEvents: 'auto' };
  if (badProp) out.pointerEvents = 'auto';
  return out as PathProps;
}
Path.displayName = 'Path';
