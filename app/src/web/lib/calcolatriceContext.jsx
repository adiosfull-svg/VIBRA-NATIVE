// Port di src/lib/calcolatriceContext.jsx (convertito da scripts/port/codemod.mjs).
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CalcolatriceContext = createContext(null);

export function CalcolatriceProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(o => !o), []);
  const close = useCallback(() => setOpen(false), []);
  // PORT: valore stabile. Il provider sta nel layout, che si ridisegna a ogni cambio di percorso:
  // con un oggetto nuovo ogni volta, ogni pagina che usa la calcolatrice si ridisegnava a ogni cambio tab.
  const value = useMemo(() => ({ open, toggle, close }), [open, toggle, close]);

  return (
    <CalcolatriceContext.Provider value={value}>
      {children}
    </CalcolatriceContext.Provider>
  );
}

export function useCalcolatrice() {
  const ctx = useContext(CalcolatriceContext);
  if (!ctx) return { open: false, toggle: () => {}, close: () => {} };
  return ctx;
}