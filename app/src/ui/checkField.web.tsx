// <input type="checkbox|radio"> sul web: l'input vero del browser (identico all'originale).
import { createElement } from 'react';
import { useLabelControl } from './labelControl';

export type CheckFieldProps = { type: 'checkbox' | 'radio'; checked?: boolean; value?: unknown; name?: string; disabled?: boolean; className?: string;
  onChange?: (e: { target: { checked: boolean; value: unknown; type: string; name?: string } }) => void };

export function CheckField({ type, checked, value, name, disabled, className, onChange }: CheckFieldProps) {
  const fire = (next: boolean) => onChange?.({ target: { checked: next, value, type, name } });
  useLabelControl(() => { if (!disabled && !(type === 'radio' && checked)) fire(type === 'radio' ? true : !checked); });
  return createElement('input', {
    type, checked: !!checked, name, disabled, className,
    value: value == null ? undefined : String(value),
    onChange: (e: { target: { checked: boolean } }) => fire(e.target.checked),
  });
}
