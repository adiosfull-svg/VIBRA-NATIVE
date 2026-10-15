import { useRef } from 'react';

// PORT: vero dalla prima volta che `open` è vero, poi resta. Per dialog e pannelli montati alla prima
// apertura (da chiusi costavano montaggio e ridisegni alla pagina) e poi tenuti montati: chiusura e
// riapertura come prima. Va bene per i dialog che si inizializzano negli effect, che girano anche al
// montaggio con open=true.
export function useMountedOnce(open) {
  const mounted = useRef(false);
  if (open) mounted.current = true;
  return mounted.current;
}
