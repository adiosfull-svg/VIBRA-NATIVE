// Port di src/lib/calcolatriceContext.jsx (convertito da scripts/port/codemod.mjs).
import React, { createContext, useContext, useState, useCallback } from 'react';

const CalcolatriceContext = createContext(null);

export function CalcolatriceProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(o => !o), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <CalcolatriceContext.Provider value={{ open, toggle, close }}>
      {children}
    </CalcolatriceContext.Provider>
  );
}

export function useCalcolatrice() {
  const ctx = useContext(CalcolatriceContext);
  if (!ctx) return { open: false, toggle: () => {}, close: () => {} };
  return ctx;
}