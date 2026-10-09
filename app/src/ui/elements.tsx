// Altri elementi HTML dell'app web resi in React Native, con le stesse prop del web:
//   <img> → Img   <a> → A   <table>/<tr>/<td>/<th> → Table/Tr/Td/Th
//   <input>/<textarea>/<select><option> → HtmlInput/HtmlTextarea/HtmlSelect/HtmlOption
//   <svg>/<path>/... → react-native-svg (via Svg* re-export)   <hr> → Hr
import { Image, type ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Children, forwardRef, isValidElement, type ReactNode } from 'react';
import { Linking, Pressable, TextInput, type TextInputProps } from 'react-native';
import { cn } from './cn';
import { DateField } from './dateField';
import { isDateInputType } from './dateValue';
import { FileField } from './fileField';
import { useTextFormField } from './formContext';
import { keyDownProps, type WebKeyEvent } from './keyEvents';
import { Btn, Div } from './html';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './menu';
import { THEME } from './palette.generated';
import { fontFamilyFor } from './text';

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
type CellProps = { className?: string; children?: ReactNode; colSpan?: number; rowSpan?: number; style?: object; onClick?: () => void };

export const Table = ({ className, children }: { className?: string; children?: ReactNode }) => <Div className={cn('flex flex-col w-full', className)}>{children}</Div>;
export const Thead = ({ className, children }: { className?: string; children?: ReactNode }) => <Div className={cn('flex flex-col', className)}>{children}</Div>;
export const Tbody = Thead;
export const Tfoot = Thead;
export function Tr({ className, children, onClick, style }: CellProps) {
  return onClick
    ? <Btn className={cn('flex flex-row items-center', className)} onClick={onClick} style={style}>{children}</Btn>
    : <Div className={cn('flex flex-row items-center', className)} style={style}>{children}</Div>;
}
/** Cella: larghezza proporzionale (flex) come la distribuzione automatica delle colonne HTML. */
export function Td({ className, children, colSpan = 1, style, onClick }: CellProps) {
  const hasWidth = /(^|\s)(w-|min-w-|basis-|flex-)/.test(className ?? '');
  const st = [hasWidth ? null : { flex: colSpan }, style];
  return onClick
    ? <Btn className={className} style={st} onClick={onClick}>{children}</Btn>
    : <Div className={className} style={st}>{children}</Div>;
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
    style: [{ fontFamily: fontFamilyFor(cls) }, style],
  };
}

const RawTextInput = forwardRef<TextInput, RawInputProps & { multiline?: boolean }>(({ multiline = false, ...p }, ref) => {
  const { ref: inputRef, submit } = useTextFormField(ref, p.required, p.value);
  return multiline
    ? <TextInput ref={inputRef} multiline textAlignVertical="top" {...rawInput(p, submit, true)} />
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
export { default as Svg, Circle, Defs, ForeignObject, G, Line, LinearGradient as SvgLinearGradient, Path, Polygon, Polyline, Rect, Stop, Text as SvgText } from 'react-native-svg';
