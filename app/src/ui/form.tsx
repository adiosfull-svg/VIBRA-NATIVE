// <form> del web → Form: contenitore come <div> che fornisce l'invio ai pulsanti type="submit"
// e ai campi di testo (vedi formContext.ts).
import { useMemo, useRef, type ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import { FormContext, firstInvalid, submitEvent, type FormApi, type FormField } from './formContext';
import { Div } from './html';

type FormProps = ViewProps & {
  className?: string;
  children?: ReactNode;
  onSubmit?: (e: ReturnType<typeof submitEvent>) => void;
  noValidate?: boolean;
  autoComplete?: string;
};

export function Form({ onSubmit, noValidate, autoComplete: _a, children, ...props }: FormProps) {
  const fields = useRef(new Set<{ current: FormField }>());
  const submitRef = useRef(onSubmit);
  submitRef.current = onSubmit;
  const api = useMemo<FormApi>(() => ({
    submit() {
      const invalid = noValidate ? null : firstInvalid(fields.current);
      if (invalid) { invalid.focus?.(); return; }
      submitRef.current?.(submitEvent());
    },
    register(field) {
      fields.current.add(field);
      return () => { fields.current.delete(field); };
    },
  }), [noValidate]);
  return (
    <FormContext.Provider value={api}>
      <Div {...props}>{children}</Div>
    </FormContext.Provider>
  );
}
