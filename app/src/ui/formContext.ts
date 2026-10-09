// <form onSubmit> del web: i pulsanti type="submit" e l'Invio nei campi a riga singola
// inviano il form più vicino (ui/form.tsx). I campi `required` vuoti bloccano l'invio
// come nel browser (il primo viene messo a fuoco).
import { createContext, useCallback, useContext, useEffect, useRef, type ForwardedRef } from 'react';
import type { TextInput } from 'react-native';

export type FormField = { required: boolean; isEmpty: () => boolean; focus?: () => void };

export type FormApi = {
  submit: () => void;
  register: (field: { current: FormField }) => () => void;
};

export const FormContext = createContext<FormApi | null>(null);

export const useForm = () => useContext(FormContext);

/** Registra un campo nel form più vicino (per la validazione di `required`). */
export function useFormField(field: FormField) {
  const form = useForm();
  const ref = useRef(field);
  ref.current = field;
  useEffect(() => (form ? form.register(ref) : undefined), [form]);
  return form;
}

/** Evento finto passato a onSubmit: gli handler del web chiamano e.preventDefault(). */
export function submitEvent() {
  return {
    type: 'submit',
    defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; },
    stopPropagation() {},
    target: {},
    currentTarget: {},
    nativeEvent: {},
  };
}

/** Il primo campo obbligatorio vuoto, se c'è (l'invio va bloccato). */
export function firstInvalid(fields: Iterable<{ current: FormField }>): FormField | null {
  for (const f of fields) if (f.current.required && f.current.isEmpty()) return f.current;
  return null;
}

/**
 * Campo di testo dentro un form: ref interno (unito a quello inoltrato) per il fuoco,
 * registrazione per `required` e funzione di invio per l'Invio (null fuori da un form).
 */
export function useTextFormField(forwarded: ForwardedRef<TextInput>, required?: boolean, value?: unknown) {
  const inner = useRef<TextInput | null>(null);
  const ref = useCallback((node: TextInput | null) => {
    inner.current = node;
    if (typeof forwarded === 'function') forwarded(node);
    else if (forwarded) forwarded.current = node;
  }, [forwarded]);
  const form = useFormField({ required: !!required, isEmpty: () => value == null || String(value) === '', focus: () => inner.current?.focus() });
  return { ref, submit: form?.submit };
}
