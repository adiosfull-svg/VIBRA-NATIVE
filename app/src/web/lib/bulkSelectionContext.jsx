// Port di src/lib/bulkSelectionContext.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - window.addEventListener
//  - window.removeEventListener
import React, { createContext, useContext, useEffect } from 'react';

/**
 * Context per la selezione multipla clienti, condiviso tra tutte le liste
 * di una sezione (Clienti / Weekend). La pagina mantiene lo stato e lo
 * passa come `value`; il provider lo espone ai consumatori + gestisce ESC.
 */
const Ctx = createContext(null);

export function BulkSelectionProvider({ value, children }) {
  const { selectMode, clearSelection } = value || {};
  // ESC (desktop) azzera la selezione
  useEffect(() => {
    if (!selectMode) return;
    const onKey = (e) => { if (e.key === 'Escape') clearSelection?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectMode, clearSelection]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBulkSelection() {
  return useContext(Ctx);
}