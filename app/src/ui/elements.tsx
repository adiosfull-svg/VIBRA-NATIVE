// Altri elementi HTML dell'app web resi in React Native, con le stesse prop del web:
//   <img> → Img   <a> → A   <table>/<tr>/<td>/<th> → Table/Tr/Td/Th
//   <input>/<textarea>/<select><option> → HtmlInput/HtmlTextarea/HtmlSelect/HtmlOption
//   <svg>/<path>/... → react-native-svg (via Svg* re-export)   <hr> → Hr
import { Image, type ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Children, createContext, forwardRef, isValidElement, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Linking, Pressable, TextInput, type LayoutChangeEvent, type TextInputProps } from 'react-native';
import { cn } from './cn';
import { DateField } from './dateField';
import { isDateInputType } from './dateValue';
import { FileField } from './fileField';
import { useTextFormField } from './formContext';
import { keyDownProps, type WebKeyEvent } from './keyEvents';
import { Btn, Div } from './html';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './menu';
import { THEME } from './palette.generated';
import { fontFamilyFor, inputFontSize, TextClassContext, useTextareaBaselineGap } from './text';
import { TEXT_COLOR } from './icon';
import RNSvg, { type SvgProps } from 'react-native-svg';

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

export function Img({ src, alt, className, loading: _l, decoding: _d, crossOrigin: _c, draggable: _dr, onError, onLoad, ...props }: ImgProps) {
  if (!src) return null;
  return (
    <Image
      source={{ uri: src }}
      accessibilityLabel={alt}
      className={className}
      contentFit={fitFrom(className)}
      cachePolicy="disk"
      onError={onError ? () => onError() : undefined}
      onLoad={onLoad ? () => onLoad() : undefined}
      {...props}
    />
  );
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

type TableLayout = { widths: number[] | null; report: (col: number, width: number) => void };
const TableContext = createContext<TableLayout | null>(null);
const ColumnContext = createContext<{ col: number; span: number } | null>(null);

/** Larghezze delle colonne: massimo per colonna, più lo spazio che avanza in proporzione. */
export function tableColumnWidths(natural: number[], tableWidth: number): number[] {
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

export function Table({ className, children, style }: { className?: string; children?: ReactNode; style?: object }) {
  const signature = contentSignature(children);
  const [state, setState] = useState<{ sig: string; widths: number[] | null }>({ sig: signature, widths: null });
  const natural = useRef<number[]>([]);
  const tableWidth = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  if (state.sig !== signature) { natural.current = []; setState({ sig: signature, widths: null }); }
  const measuring = state.sig !== signature || state.widths == null;
  const finish = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const widths = tableColumnWidths(Array.from(natural.current, (w) => w ?? 0), tableWidth.current);
      setState((s) => ({ ...s, widths }));
    }, 16);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const ctx = useMemo<TableLayout>(() => ({
    widths: measuring ? null : state.widths,
    report: (col, width) => { natural.current[col] = Math.max(natural.current[col] ?? 0, width); finish(); },
  }), [measuring, state.widths, finish]);
  return (
    <TableContext.Provider value={ctx}>
      <Div className={cn('flex flex-col w-full', className)} style={style}
        onLayout={(e) => { tableWidth.current = e.nativeEvent.layout.width; if (!measuring) finish(); }}>
        {children}
      </Div>
    </TableContext.Provider>
  );
}
export const Thead = ({ className, children }: { className?: string; children?: ReactNode; ref?: unknown }) => <Div className={cn('flex flex-col', className)}>{children}</Div>;
export const Tbody = Thead;
export const Tfoot = Thead;

export function Tr({ className, children, onClick, style }: CellProps) {
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
    ? <Btn className={cn('flex flex-row items-stretch', className)} onClick={onClick} style={style}>{cells}</Btn>
    : <Div className={cn('flex flex-row items-stretch', className)} style={style}>{cells}</Div>;
}

/** text-align della cella: allinea anche i blocchi in linea (inline-flex...) come in CSS. */
function cellAlign(className = ''): 'flex-start' | 'center' | 'flex-end' | undefined {
  const m = className.match(/(?:^|\s)text-(left|center|right)(?:\s|$)/);
  return m ? ({ left: 'flex-start', center: 'center', right: 'flex-end' } as const)[m[1] as 'left'] : undefined;
}

export function Td({ className, children, colSpan = 1, style, onClick }: CellProps) {
  const table = useContext(TableContext);
  const column = useContext(ColumnContext);
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
    if (column.span === 1) onLayout = (e) => table.report(column.col, e.nativeEvent.layout.width);
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

const RawTextInput = forwardRef<TextInput, RawInputProps & { multiline?: boolean }>(({ multiline = false, ...p }, ref) => {
  const { ref: inputRef, submit } = useTextFormField(ref, p.required, p.value);
  const gap = useTextareaBaselineGap(multiline ? p.className : 'block');
  return multiline
    ? <TextInput ref={inputRef} multiline textAlignVertical="top" {...rawInput({ ...p, style: [p.style, gap ? { marginBottom: gap } : null] }, submit, true)} />
    : <TextInput ref={inputRef} {...rawInput(p, submit)} />;
});
RawTextInput.displayName = 'RawTextInput';

/** <input>: testo, ma anche date/ora (DateField) e file (FileField) come nel browser. */
export const HtmlInput = forwardRef<any, RawInputProps>((p, ref) => {
  const { type, className, value, onChange, min, max, disabled, required, accept, multiple, capture, style } = p;
  if (isDateInputType(type)) {
    return <DateField ref={ref} type={type} value={value} onChange={onChange} onBlur={p.onBlur as () => void} min={min} max={max}
      disabled={disabled} required={required} style={style as object} className={cn('text-foreground text-base', className)} />;
  }
  if (type === 'file') return <FileField ref={ref} accept={accept} multiple={multiple} capture={capture} disabled={disabled} className={className} onChange={onChange} />;
  return <RawTextInput ref={ref} {...p} />;
});
HtmlInput.displayName = 'HtmlInput';
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
      <SelectTrigger className={className}>
        <SelectValue placeholder={current?.label ?? ''} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

// ── varie ────────────────────────────────────────────────────────────────────
export const Hr = ({ className }: { className?: string }) => <Div className={cn('h-px w-full bg-border', className)} />;

/** <label onClick> o <label htmlFor> → area premibile senza semantica HTML */
export function Label({ children, className, onClick }: { children?: ReactNode; className?: string; onClick?: () => void; htmlFor?: string }) {
  return onClick ? <Btn className={className} onClick={onClick}>{children}</Btn> : <Div className={className}>{children}</Div>;
}

export { Pressable };
// ── <svg> ────────────────────────────────────────────────────────────────────
// Come le icone (icon.tsx): className → dimensioni e colore anche sul telefono, e senza un colore
// proprio prende quello del testo che la contiene (fill/stroke="currentColor").
function SvgBox({ color, ...p }: SvgProps & { color?: string }) {
  return <RNSvg color={color} {...p} />;
}
cssInterop(SvgBox, { className: { target: 'style', nativeStyleToProp: { width: true, height: true, color: true } } });

export function Svg({ className, color, ...p }: SvgProps & { className?: string; color?: string }) {
  const inheritedText = useContext(TextClassContext);
  const inheritedColor = inheritedText.split(/\s+/).filter((c) => TEXT_COLOR.test(c)).join(' ');
  return <SvgBox {...p} {...(color ? { color } : null)} className={cn(color ? '' : cn('text-foreground', inheritedColor), className)} />;
}

export { Circle, Defs, ForeignObject, G, Line, LinearGradient as SvgLinearGradient, Path, Polygon, Polyline, Rect, Stop, Text as SvgText } from 'react-native-svg';
