// <label> del browser: toccarlo attiva il controllo che contiene (checkbox, radio, switch).
// HtmlLabel fornisce la registrazione, il controllo dentro registra la sua azione.
import { createContext, useContext, useEffect, useRef } from 'react';

type Register = (action: (() => void) | null) => void;
export const LabelControlContext = createContext<Register | null>(null);

/** Registra `action` presso il <label> che contiene il controllo (se c'è). */
export function useLabelControl(action: () => void) {
  const register = useContext(LabelControlContext);
  const ref = useRef(action);
  ref.current = action;
  useEffect(() => {
    if (!register) return;
    register(() => ref.current());
    return () => register(null);
  }, [register]);
}
