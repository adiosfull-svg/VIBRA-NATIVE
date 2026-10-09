// Port di src/lib/layoutUIContext.jsx (stato condiviso: menu account, sidebar).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CustomEvt, win } from '../shims/dom';

type LayoutUI = {
  accountMenuOpen: boolean;
  setAccountMenuOpen: (v: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
};
const Ctx = createContext<LayoutUI | null>(null);

export function LayoutUIProvider({ children }: { children: ReactNode }) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // La ricerca (VibraSearch) ha il suo stato, come nell'originale: si apre con l'evento
  // 'vibra:search-open' e comunica aperto/chiuso con 'vibra:search-state' (pill della nav).
  const [searchOpen, setSearchState] = useState(false);
  useEffect(() => {
    const onState = (e: { detail?: { open?: boolean } }) => setSearchState(!!e?.detail?.open);
    win.addEventListener('vibra:search-state', onState);
    return () => win.removeEventListener('vibra:search-state', onState);
  }, []);
  const setSearchOpen = useCallback((v: boolean) => {
    if (v) win.dispatchEvent(new CustomEvt('vibra:search-open'));
  }, []);
  const value = useMemo(
    () => ({ accountMenuOpen, setAccountMenuOpen, sidebarOpen, setSidebarOpen, searchOpen, setSearchOpen }),
    [accountMenuOpen, sidebarOpen, searchOpen],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLayoutUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLayoutUI va usato dentro <LayoutUIProvider>');
  return ctx;
}
