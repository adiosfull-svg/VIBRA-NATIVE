// onKeyDown dei campi di testo web (Invio = conferma, Esc = annulla...) sui TextInput nativi.
// Sul web RNW passa i tasti veri a onKeyPress (Invio ed Esc compresi). Sul telefono la tastiera
// virtuale manda Invio solo come onSubmitEditing nei campi a riga singola: lo traduciamo.
// Dentro un <form> l'Invio in un campo a riga singola invia il form (come nel browser),
// salvo che onKeyDown chiami e.preventDefault().
import { Platform, type NativeSyntheticEvent, type TextInputKeyPressEventData, type TextInputProps } from 'react-native';

export type WebKeyEvent = {
  key: string;
  shiftKey: boolean; ctrlKey: boolean; metaKey: boolean; altKey: boolean;
  defaultPrevented: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
  target: { value: string };
};

function keyEvent(key: string, value: string, native?: Partial<WebKeyEvent>): WebKeyEvent {
  return {
    key,
    shiftKey: !!native?.shiftKey, ctrlKey: !!native?.ctrlKey, metaKey: !!native?.metaKey, altKey: !!native?.altKey,
    defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; },
    stopPropagation() {},
    target: { value },
  };
}

export function keyDownProps(
  onKeyDown: ((e: WebKeyEvent) => void) | undefined,
  value: string,
  multiline: boolean,
  submitForm?: () => void,
): TextInputProps {
  const formSubmit = multiline ? undefined : submitForm;
  if (!onKeyDown && !formSubmit) return {};
  const isWeb = Platform.OS === 'web';
  const enter = (native?: Partial<WebKeyEvent>) => {
    const e = keyEvent('Enter', value, native);
    onKeyDown?.(e);
    if (!e.defaultPrevented) formSubmit?.();
  };
  return {
    onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = e.nativeEvent.key;
      if (key === 'Enter' && !multiline) {
        // sul telefono l'Invio dei campi a riga singola arriva da onSubmitEditing
        if (isWeb) enter(e.nativeEvent as Partial<WebKeyEvent>);
        return;
      }
      onKeyDown?.(keyEvent(key, value, e.nativeEvent as Partial<WebKeyEvent>));
    },
    ...(!isWeb && !multiline ? { onSubmitEditing: () => enter(), submitBehavior: 'submit' as const } : {}),
  };
}
