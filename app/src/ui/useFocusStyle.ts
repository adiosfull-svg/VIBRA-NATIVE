// Stile delle classi focus:/focus-visible: mentre il campo ha il fuoco (vedi focusStyle.ts).
import { useMemo, useState } from 'react';
import { Platform, type TextStyle } from 'react-native';
import { focusStyle } from './focusStyle';

export function useFocusStyle(classes: string | undefined, onFocus?: (e: any) => void, onBlur?: (e: any) => void) {
  const [focused, setFocused] = useState(false);
  const style = useMemo(() => {
    const s = focusStyle(classes);
    if (!s) return null;
    // outlineStyle e boxShadow: sul telefono non c'è il contorno del browser, resta solo l'anello
    if (Platform.OS !== 'web') delete s.outlineStyle;
    return s;
  }, [classes]);
  return {
    // outlineStyle 'none' è solo del web (RN-web lo passa al CSS)
    focusStyle: (focused ? style : null) as TextStyle | null,
    onFocus: (e: any) => { setFocused(true); onFocus?.(e); },
    onBlur: (e: any) => { setFocused(false); onBlur?.(e); },
  };
}
