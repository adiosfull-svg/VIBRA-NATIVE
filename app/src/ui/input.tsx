// Port di src/components/ui/input.jsx e textarea.jsx.
import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from './cn';
import { DateField } from './dateField';
import { isDateInputType } from './dateValue';
import { FileField } from './fileField';
import { useTextFormField } from './formContext';
import { keyDownProps, type WebKeyEvent } from './keyEvents';
import { THEME } from './palette.generated';
import { fontFamilyFor, inputFontSize } from './text';
import { useFocusStyle } from './useFocusStyle';

type InputProps = TextInputProps & {
  className?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'url' | 'date' | 'time' | 'datetime-local' | 'file';
  onChange?: (e: any) => void;
  value?: string;
  onKeyDown?: (e: WebKeyEvent) => void;
  required?: boolean; disabled?: boolean; min?: string | number; max?: string | number; accept?: string; multiple?: boolean;
};

// type HTML → tastiera/opzioni native equivalenti
function typeProps(type?: InputProps['type']): TextInputProps {
  switch (type) {
    case 'email': return { keyboardType: 'email-address', autoCapitalize: 'none', autoComplete: 'email' };
    case 'password': return { secureTextEntry: true, autoCapitalize: 'none' };
    case 'number': return { keyboardType: 'decimal-pad' };
    case 'tel': return { keyboardType: 'phone-pad', autoComplete: 'tel' };
    case 'url': return { keyboardType: 'url', autoCapitalize: 'none' };
    default: return {};
  }
}

function webInputProps({ className, type, onChange, onChangeText, onKeyDown, value, style, required: _r, disabled, min: _min, max: _max, accept: _a, multiple: _m, ...props }: InputProps, base: string, submitForm: (() => void) | undefined, multiline = false, focus?: ReturnType<typeof useFocusStyle>) {
  const merged = cn(base, className);
  return {
    ...typeProps(type),
    ...props,
    ...(disabled ? { editable: false } : null),
    ...keyDownProps(onKeyDown, value == null ? '' : String(value), multiline, submitForm),
    value: value == null ? value : String(value),
    // onChange del web riceve un evento con target.value: lo ricreiamo
    onChangeText: (t: string) => { onChangeText?.(t); onChange?.({ target: { value: t } }); },
    placeholderTextColor: THEME['muted-foreground'],
    className: merged,
    ...(focus ? { onFocus: focus.onFocus, onBlur: focus.onBlur } : null),
    style: [{ fontFamily: fontFamilyFor(merged) }, style, inputFontSize(merged), focus?.focusStyle],
  };
}

// classi di fuoco di input.jsx/textarea.jsx (solo per useFocusStyle, NativeWind non le conosce)
const FOCUS_BASE = 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
const INPUT_BASE = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base text-foreground shadow-sm';

export const Input = forwardRef<any, InputProps>((props, ref) => {
  const textual = !isDateInputType(props.type) && props.type !== 'file';
  const { ref: inputRef, submit } = useTextFormField(ref, textual && props.required, props.value);
  const focus = useFocusStyle(cn(FOCUS_BASE, props.className), props.onFocus, props.onBlur);
  const { type, className, value, onChange, min, max, disabled, required, accept, multiple, style } = props;
  // date/ora e file: stesso riquadro di Input, controllo nativo (DateField / FileField)
  if (isDateInputType(type)) {
    return <DateField ref={ref} type={type} value={value} onChange={onChange} onBlur={props.onBlur as () => void} min={min} max={max}
      disabled={disabled} required={required} style={style as object} className={cn(INPUT_BASE, 'items-center', className)} />;
  }
  if (type === 'file') return <FileField ref={ref} accept={accept} multiple={multiple} disabled={disabled} className={className} onChange={onChange} />;
  return <TextInput ref={inputRef} {...webInputProps(props, INPUT_BASE, submit, false, focus)} />;
});
Input.displayName = 'Input';

export const Textarea = forwardRef<TextInput, InputProps>((props, ref) => {
  const { ref: inputRef, submit } = useTextFormField(ref, props.required, props.value);
  const focus = useFocusStyle(cn(FOCUS_BASE, props.className), props.onFocus, props.onBlur);
  return (
    <TextInput
      ref={inputRef}
      multiline
      textAlignVertical="top"
      {...webInputProps(
        props,
        'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground shadow-sm',
        submit,
        true,
        focus,
      )}
    />
  );
});
Textarea.displayName = 'Textarea';
