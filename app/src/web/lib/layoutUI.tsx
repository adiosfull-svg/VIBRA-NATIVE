// Port di src/lib/layoutUIContext.jsx (stato condiviso: menu account, sidebar).
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

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
  const [searchOpen, setSearchOpen] = useState(false);
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
