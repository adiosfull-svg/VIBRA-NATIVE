import { useCallback, useEffect, useRef, useState } from 'react';

// PORT: la voce scelta si evidenzia subito, il lavoro pesante (cambio tab, riordino, ridisegno della
// pagina) parte due frame dopo (docs/REGOLE-PRESTAZIONI.md §4). Prima evidenziazione e contenuto
// arrivavano insieme a lavoro finito: il tocco sembrava ignorato per 100-500 ms. Come MobileNavBar:
// la scelta resta "in attesa" finché il valore vero non cambia (rete di sicurezza 1,5 s).
export function usePendingSelection(value, onChange) {
  const [pending, setPending] = useState(null);
  useEffect(() => { setPending(null); }, [value]);
  useEffect(() => {
    if (pending == null) return undefined;
    const t = setTimeout(() => setPending(null), 1500);
    return () => clearTimeout(t);
  }, [pending]);
  const latest = useRef(onChange);
  latest.current = onChange;
  const select = useCallback((next) => {
    setPending(next);
    requestAnimationFrame(() => requestAnimationFrame(() => latest.current?.(next)));
  }, []);
  return [pending ?? value, select];
}
