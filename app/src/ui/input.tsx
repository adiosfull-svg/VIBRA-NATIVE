// Port di src/components/ui/input.jsx e textarea.jsx.
import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from './cn';
import { keyDownProps, type WebKeyEvent } from './keyEvents';
import { THEME } from './palette.generated';
import { fontFamilyFor } from './text';

type InputProps = TextInputProps & {
  className?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'url' | 'date' | 'time';
  onChange?: (e: { target: { value: string } }) => void;
  value?: string;
  onKeyDown?: (e: WebKeyEvent) => void;
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

function useWebInput({ className, type, onChange, onChangeText, onKeyDown, value, style, ...props }: InputProps, base: string, multiline = false) {
  const merged = cn(base, className);
  return {
    ...typeProps(type),
    ...props,
    ...keyDownProps(onKeyDown, value == null ? '' : String(value), multiline),
    value: value == null ? value : String(value),
    // onChange del web riceve un evento con target.value: lo ricreiamo
    onChangeText: (t: string) => { onChangeText?.(t); onChange?.({ target: { value: t } }); },
    placeholderTextColor: THEME['muted-foreground'],
    className: merged,
    style: [{ fontFamily: fontFamilyFor(merged) }, style],
  };
}

export const Input = forwardRef<TextInput, InputProps>((props, ref) => (
  <TextInput
    ref={ref}
    {...useWebInput(
      props,
      'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base text-foreground shadow-sm',
    )}
  />
));
Input.displayName = 'Input';

export const Textarea = forwardRef<TextInput, InputProps>((props, ref) => (
  <TextInput
    ref={ref}
    multiline
    textAlignVertical="top"
    {...useWebInput(
      props,
      'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground shadow-sm',
      true,
    )}
  />
));
Textarea.displayName = 'Textarea';
