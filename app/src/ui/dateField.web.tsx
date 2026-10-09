// Campo data/ora sul web: sopra il riquadro c'è un <input type="date|time|datetime-local"> vero
// e trasparente, così il calendario è quello del browser (aperto con showPicker() al clic).
import { createElement, forwardRef, useImperativeHandle, useRef } from 'react';
import { useFormField } from './formContext';
import { DateBox, type DateFieldProps } from './dateBox';

export type DateFieldHandle = { focus: () => void; blur: () => void; click: () => void; showPicker: () => void };

const OVERLAY = { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', border: 0, padding: 0, margin: 0 };

export const DateField = forwardRef<DateFieldHandle, DateFieldProps>((props, ref) => {
  const { type, value, onChange, onBlur, min, max, disabled, required } = props;
  const input = useRef<HTMLInputElement | null>(null);
  const open = () => {
    try { input.current?.showPicker(); } catch { input.current?.focus(); }
  };
  useImperativeHandle(ref, () => ({
    focus: () => input.current?.focus(), blur: () => input.current?.blur(), click: open, showPicker: open,
  }));
  useFormField({ required: !!required, isEmpty: () => !value, focus: open });
  return (
    <DateBox {...props}>
      {createElement('input', {
        ref: input,
        type,
        value: value == null ? '' : String(value),
        min, max, disabled,
        style: OVERLAY,
        onClick: (e: { preventDefault: () => void }) => { e.preventDefault(); open(); },
        onChange: (e: { target: { value: string } }) => onChange?.({ target: { value: e.target.value } }),
        onBlur,
      })}
    </DateBox>
  );
});
DateField.displayName = 'DateField';
