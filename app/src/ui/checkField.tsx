// <input type="checkbox|radio"> sul telefono: riquadro 16px (quadrato o tondo) con la spunta, come la
// casella del browser; il <label> che lo contiene lo attiva (labelControl).
import { Pressable, View } from 'react-native';
import { Check } from './icons.generated';
import { THEME } from './palette.generated';
import { useLabelControl } from './labelControl';

export type CheckFieldProps = { type: 'checkbox' | 'radio'; checked?: boolean; value?: unknown; name?: string; disabled?: boolean; className?: string;
  onChange?: (e: { target: { checked: boolean; value: unknown; type: string; name?: string } }) => void };

export function CheckField({ type, checked, value, name, disabled, onChange }: CheckFieldProps) {
  const toggle = () => {
    if (disabled || (type === 'radio' && checked)) return;
    onChange?.({ target: { checked: type === 'radio' ? true : !checked, value, type, name } });
  };
  useLabelControl(toggle);
  const on = !!checked;
  return (
    <Pressable onPress={toggle} disabled={disabled} hitSlop={8} accessibilityRole={type === 'radio' ? 'radio' : 'checkbox'} accessibilityState={{ checked: on, disabled }}
      style={{ width: 16, height: 16, borderRadius: type === 'radio' ? 8 : 3, borderWidth: on && type === 'checkbox' ? 0 : 1.5,
        borderColor: on ? THEME.primary : THEME['muted-foreground'], backgroundColor: on && type === 'checkbox' ? THEME.primary : 'transparent',
        alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : 1 }}>
      {on && type === 'checkbox' ? <Check className="w-3 h-3 text-white" strokeWidth={3} /> : null}
      {on && type === 'radio' ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.primary }} /> : null}
    </Pressable>
  );
}
