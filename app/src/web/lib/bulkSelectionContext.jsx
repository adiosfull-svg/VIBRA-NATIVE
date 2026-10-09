// Port di src/lib/bulkSelectionContext.jsx (convertito da scripts/port/codemod.mjs).
import React, { createContext, useContext, useEffect } from 'react';

import { win as webWindow } from '@/web/shims/dom';

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
    webWindow.addEventListener('keydown', onKey);
    return () => webWindow.removeEventListener('keydown', onKey);
  }, [selectMode, clearSelection]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBulkSelection() {
  return useContext(Ctx);
}