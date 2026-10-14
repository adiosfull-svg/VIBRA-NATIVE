// <label> HTML (non il Label di shadcn): nessuna classe aggiunta; con classi da blocco (flex, block...)
// è un riquadro, altrimenti testo in linea (Span). Toccarlo attiva il controllo che contiene.
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { Span } from './html';
import { LabelControlContext } from './labelControl';

export function HtmlLabel({ className, children, htmlFor: _f, nativeID }: { className?: string; children?: ReactNode; htmlFor?: string; nativeID?: string }) {
  const action = useRef<(() => void) | null>(null);
  const [hasControl, setHasControl] = useState(false);
  const register = useCallback((fn: (() => void) | null) => { action.current = fn; setHasControl(!!fn); }, []);
  const press = (e?: { nativeEvent?: { target?: { tagName?: string } } }) => {
    // sul web il clic sul controllo vero (input) lo cambia già da sé
    if (Platform.OS === 'web' && e?.nativeEvent?.target?.tagName === 'INPUT') return;
    action.current?.();
  };
  return (
    <LabelControlContext.Provider value={register}>
      <Span className={className} nativeID={nativeID} onPress={hasControl ? (press as () => void) : undefined}>{children}</Span>
    </LabelControlContext.Provider>
  );
}
