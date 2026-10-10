// Port di dropdown-menu.jsx, select.jsx, popover.jsx, tooltip.jsx, tabs.jsx, switch.jsx, slider.jsx
// con @rn-primitives. Le differenze di API con Radix sono assorbite qui:
// - gli item accettano onClick/onSelect come sul web (in RN è onPress)
// - Select lavora con value stringa come Radix: le etichette sono lette dai <SelectItem> figli
import * as DropdownPrimitive from '@rn-primitives/dropdown-menu';
import * as PopoverPrimitive from '@rn-primitives/popover';
import * as SelectPrimitive from '@rn-primitives/select';
import * as SwitchPrimitive from '@rn-primitives/switch';
import * as TabsPrimitive from '@rn-primitives/tabs';
import { Children, createContext, isValidElement, useContext, useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { cn } from './cn';
import { ROOT_CONTENTS } from './dialog';
import { Div } from './html';
import { IconClassContext } from './icon';
import { Check, ChevronDown, ChevronRight } from './icons.generated';
import { Text, TextClassContext } from './text';

type WithChildren = { className?: string; children?: ReactNode };
type Handler = { onClick?: () => void; onSelect?: (e?: unknown) => void };

// ── DropdownMenu ─────────────────────────────────────────────────────────────
export const DropdownMenu = (props: DropdownPrimitive.RootProps) => <DropdownPrimitive.Root style={ROOT_CONTENTS} {...props} />;
export function DropdownMenuTrigger({ children, asChild = true }: { children?: ReactNode; asChild?: boolean }) {
  return <DropdownPrimitive.Trigger asChild={asChild}>{children as ReactElement}</DropdownPrimitive.Trigger>;
}
export const DropdownMenuGroup = DropdownPrimitive.Group;
export const DropdownMenuSub = DropdownPrimitive.Sub;

export function DropdownMenuContent({ className, children, align = 'center', sideOffset = 4, side }: WithChildren & { align?: 'start' | 'center' | 'end'; sideOffset?: number; side?: 'top' | 'bottom' }) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <DropdownPrimitive.Content align={align} side={side} sideOffset={sideOffset}
          className={cn('z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md', className)}>
          <TextClassContext.Provider value="text-popover-foreground">
            <IconClassContext.Provider value="size-4 shrink-0">{children}</IconClassContext.Provider>
          </TextClassContext.Provider>
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Overlay>
    </DropdownPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, children, onClick, onSelect, disabled, inset }: WithChildren & Handler & { disabled?: boolean; inset?: boolean }) {
  return (
    <DropdownPrimitive.Item disabled={disabled} onPress={() => { onSelect?.(); onClick?.(); }}
      className={cn('relative flex flex-row items-center gap-2 rounded-sm px-2 py-1.5 active:bg-accent', inset && 'pl-8', disabled && 'opacity-50', className)}>
      <TextClassContext.Provider value={cn('text-sm text-popover-foreground', textOf(className))}>
        {wrap(children)}
      </TextClassContext.Provider>
    </DropdownPrimitive.Item>
  );
}

export function DropdownMenuSubTrigger({ className, children, inset }: WithChildren & { inset?: boolean }) {
  return (
    <DropdownPrimitive.SubTrigger className={cn('flex flex-row items-center gap-2 rounded-sm px-2 py-1.5 active:bg-accent', inset && 'pl-8', className)}>
      <TextClassContext.Provider value="text-sm text-popover-foreground">
        {wrap(children)}
        <View style={{ marginLeft: 'auto' }}><ChevronRight className="size-4" /></View>
      </TextClassContext.Provider>
    </DropdownPrimitive.SubTrigger>
  );
}
export function DropdownMenuSubContent({ className, children }: WithChildren) {
  return (
    <DropdownPrimitive.SubContent className={cn('z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-lg', className)}>
      {children}
    </DropdownPrimitive.SubContent>
  );
}
export const DropdownMenuLabel = ({ className, children, inset }: WithChildren & { inset?: boolean }) => (
  <Div className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}>{children}</Div>
);
export const DropdownMenuSeparator = ({ className }: { className?: string }) => <View className={cn('-mx-1 my-1 h-px bg-muted', className)} />;

// ── Popover ──────────────────────────────────────────────────────────────────
export const Popover = (props: PopoverPrimitive.RootProps) => <PopoverPrimitive.Root style={ROOT_CONTENTS} {...props} />;
export function PopoverTrigger({ children, asChild = true }: { children?: ReactNode; asChild?: boolean }) {
  return <PopoverPrimitive.Trigger asChild={asChild}>{children as ReactElement}</PopoverPrimitive.Trigger>;
}
export function PopoverContent({ className, children, align = 'center', sideOffset = 4, side }: WithChildren & { align?: 'start' | 'center' | 'end'; sideOffset?: number; side?: 'top' | 'bottom' }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <PopoverPrimitive.Content align={align} side={side} sideOffset={sideOffset}
          className={cn('z-50 w-72 rounded-md border border-border bg-popover p-4 shadow-md', className)}>
          <TextClassContext.Provider value="text-popover-foreground">{children}</TextClassContext.Provider>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Overlay>
    </PopoverPrimitive.Portal>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
type ItemProps = WithChildren & { value: string; disabled?: boolean };

/** Raccoglie value → etichetta dai <SelectItem> annidati (come fa Radix per SelectValue). */
function collectLabels(children: ReactNode, out: Record<string, string> = {}) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as ItemProps;
    if (child.type === SelectItem) out[props.value] = textContent(props.children);
    else if (props.children) collectLabels(props.children, out);
  });
  return out;
}
function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (isValidElement(node)) return textContent((node.props as { children?: ReactNode }).children);
  return '';
}

export function Select({ value, defaultValue, onValueChange, children, disabled }: {
  value?: string; defaultValue?: string; onValueChange?: (v: string) => void; children?: ReactNode; disabled?: boolean;
}) {
  const labels = collectLabels(children);
  const opt = (v?: string) => (v == null ? undefined : { value: v, label: labels[v] ?? v });
  const [open, setOpen] = useState(false);
  const [triggerText, setTriggerText] = useState('text-sm');
  const look = useMemo(() => ({ open, triggerText, setTriggerText }), [open, triggerText]);
  return (
    <SelectLookContext.Provider value={look}>
      <SelectPrimitive.Root style={ROOT_CONTENTS} value={opt(value)} defaultValue={opt(defaultValue)} disabled={disabled}
        onOpenChange={setOpen} onValueChange={(o) => o && onValueChange?.(o.value)}>
        {children}
      </SelectPrimitive.Root>
    </SelectLookContext.Provider>
  );
}

/**
 * Sul web (Radix) il valore nel trigger è l'ItemText della voce scelta, portato lì con un portale:
 * nell'originale eredita il testo del trigger (es. text-xs), qui servono le classi giuste. A menu
 * chiuso l'ItemText usa le classi di testo del trigger, aperto quelle della voce.
 */
const SelectLookContext = createContext<{ open: boolean; triggerText: string; setTriggerText: (t: string) => void } | null>(null);

export function SelectTrigger({ className, children }: WithChildren) {
  const look = useContext(SelectLookContext);
  const text = cn('text-sm', textOf(className));
  const setTriggerText = look?.setTriggerText;
  useEffect(() => { setTriggerText?.(text); }, [setTriggerText, text]);
  return (
    <SelectPrimitive.Trigger className={cn('flex h-9 w-full flex-row items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 shadow-sm', className)}>
      <TextClassContext.Provider value={text}>{children}</TextClassContext.Provider>
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
    </SelectPrimitive.Trigger>
  );
}

/**
 * Trigger di un <select> del browser (HtmlSelect): solo le classi della pagina (niente stile shadcn),
 * largo quanto il contenuto, testo a 16px come in index.css (`select { font-size: 16px }`) e la freccia
 * di Chrome a destra. Con py-1 è alto 32px come nel browser.
 */
export function BrowserSelectTrigger({ className, label }: { className?: string; label: string }) {
  return (
    <SelectPrimitive.Trigger className={cn('flex-row items-center self-start', className)}>
      <Text className={textOf(className)} style={{ fontSize: 16, lineHeight: 22 }} numberOfLines={1}>{label}</Text>
      <ChevronDown className="ml-1 h-4 w-4" />
    </SelectPrimitive.Trigger>
  );
}

export function SelectValue({ placeholder, className }: { placeholder?: string; className?: string }) {
  // come lo <span> dentro il trigger: eredita le classi di testo del trigger (es. text-xs)
  const inherited = useContext(TextClassContext);
  return <SelectPrimitive.Value placeholder={placeholder ?? ''} className={cn('text-sm text-foreground', inherited, className)} />;
}

export function SelectContent({ className, children }: WithChildren) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <SelectPrimitive.Content className={cn('z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover shadow-md', className)}>
          <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, value, disabled }: ItemProps) {
  const look = useContext(SelectLookContext);
  const itemText = look && !look.open && Platform.OS === 'web'
    ? cn('text-foreground', look.triggerText)
    : cn('text-sm text-popover-foreground', textOf(className));
  return (
    <SelectPrimitive.Item value={value} label={textContent(children)} disabled={disabled}
      className={cn('relative flex w-full flex-row items-center rounded-sm py-1.5 pl-2 pr-8 active:bg-accent', disabled && 'opacity-50', className)}>
      <View className="absolute right-2 h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator><Check className="h-4 w-4" /></SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText className={itemText} />
    </SelectPrimitive.Item>
  );
}
export const SelectGroup = SelectPrimitive.Group;
export const SelectLabel = ({ className, children }: WithChildren) => <Div className={cn('px-2 py-1.5 text-sm font-semibold', className)}>{children}</Div>;
export const SelectSeparator = ({ className }: { className?: string }) => <View className={cn('-mx-1 my-1 h-px bg-muted', className)} />;

// ── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ value, onValueChange, defaultValue, className, children }: WithChildren & { value?: string; defaultValue?: string; onValueChange?: (v: string) => void }) {
  return (
    <TabsPrimitive.Root value={value ?? defaultValue ?? ''} onValueChange={(v) => onValueChange?.(v)} className={className}>
      {children}
    </TabsPrimitive.Root>
  );
}
export function TabsList({ className, children }: WithChildren) {
  return (
    <TabsPrimitive.List className={cn('h-9 flex-row items-center justify-center rounded-lg bg-muted p-1', className)}>
      <TextClassContext.Provider value="text-muted-foreground">{children}</TextClassContext.Provider>
    </TabsPrimitive.List>
  );
}
export function TabsTrigger({ className, children, value }: WithChildren & { value: string }) {
  const { value: active } = TabsPrimitive.useRootContext();
  const on = active === value;
  return (
    <TabsPrimitive.Trigger value={value} className={cn('flex-row items-center justify-center rounded-md px-3 py-1', on && 'bg-background shadow', className)}>
      <TextClassContext.Provider value={cn('text-sm font-medium', on ? 'text-foreground' : 'text-muted-foreground', textOf(className))}>
        {wrap(children)}
      </TextClassContext.Provider>
    </TabsPrimitive.Trigger>
  );
}
export function TabsContent({ className, children, value }: WithChildren & { value: string }) {
  return <TabsPrimitive.Content value={value} className={cn('mt-2', className)}>{children}</TabsPrimitive.Content>;
}

// ── Switch ───────────────────────────────────────────────────────────────────
export function Switch({ checked, onCheckedChange, disabled, className }: { checked: boolean; onCheckedChange: (v: boolean) => void; disabled?: boolean; className?: string }) {
  return (
    <SwitchPrimitive.Root checked={checked} onCheckedChange={onCheckedChange} disabled={disabled}
      className={cn('h-5 w-9 shrink-0 flex-row items-center rounded-full border-2 border-transparent shadow-sm', checked ? 'bg-primary' : 'bg-input', disabled && 'opacity-50', className)}>
      <SwitchPrimitive.Thumb className={cn('h-4 w-4 rounded-full bg-background shadow-lg', checked ? 'translate-x-4' : 'translate-x-0')} />
    </SwitchPrimitive.Root>
  );
}

// ── helper ───────────────────────────────────────────────────────────────────
function wrap(children: ReactNode) {
  return Children.map(children, (c) => (typeof c === 'string' || typeof c === 'number' ? <Text>{c}</Text> : c));
}
/** Classi di testo (colore/peso/dimensione) passate ai figli, come in CSS. */
function textOf(className?: string) {
  return (className ?? '').split(/\s+/).filter((c) => /^(text-|font-|tracking-|leading-|uppercase$)/.test(c)).join(' ');
}
