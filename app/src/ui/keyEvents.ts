// onKeyDown dei campi di testo web (Invio = conferma, Esc = annulla...) sui TextInput nativi.
// Sul web RNW passa i tasti veri a onKeyPress (Invio ed Esc compresi). Sul telefono la tastiera
// virtuale manda Invio solo come onSubmitEditing nei campi a riga singola: lo traduciamo.
import { Platform, type NativeSyntheticEvent, type TextInputKeyPressEventData, type TextInputProps } from 'react-native';

export type WebKeyEvent = {
  key: string;
  shiftKey: boolean; ctrlKey: boolean; metaKey: boolean; altKey: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
  target: { value: string };
};

function keyEvent(key: string, value: string, native?: Partial<WebKeyEvent>): WebKeyEvent {
  return {
    key,
    shiftKey: !!native?.shiftKey, ctrlKey: !!native?.ctrlKey, metaKey: !!native?.metaKey, altKey: !!native?.altKey,
    preventDefault() {}, stopPropagation() {},
    target: { value },
  };
}

export function keyDownProps(onKeyDown: ((e: WebKeyEvent) => void) | undefined, value: string, multiline: boolean): TextInputProps {
  if (!onKeyDown) return {};
  const isWeb = Platform.OS === 'web';
  return {
    onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = e.nativeEvent.key;
      // sul telefono l'Invio dei campi a riga singola arriva da onSubmitEditing
      if (!isWeb && key === 'Enter' && !multiline) return;
      onKeyDown(keyEvent(key, value, e.nativeEvent as Partial<WebKeyEvent>));
    },
    ...(!isWeb && !multiline ? { onSubmitEditing: () => onKeyDown(keyEvent('Enter', value)), submitBehavior: 'submit' as const } : {}),
  };
}
