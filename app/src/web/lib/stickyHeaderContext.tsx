// Equivalente nativo di src/lib/stickyHeaderContext.jsx (stessa API).
import { createContext, useContext, useState, type ReactNode } from 'react';

type Ctx = { stuck: boolean; setStuck: (v: boolean) => void; topRightHover: boolean; setTopRightHover: (v: boolean) => void; title: string; setTitle: (t: string) => void };
const StickyHeaderContext = createContext<Ctx | null>(null);

export function StickyHeaderProvider({ children }: { children: ReactNode }) {
  const [stuck, setStuck] = useState(false);
  const [topRightHover, setTopRightHover] = useState(false);
  const [title, setTitle] = useState('');
  return <StickyHeaderContext.Provider value={{ stuck, setStuck, topRightHover, setTopRightHover, title, setTitle }}>{children}</StickyHeaderContext.Provider>;
}
// fallback stabili senza Provider (oggi non c'è): una funzione nuova a ogni render faceva ripartire
// gli effect delle pagine che la usano
const NOOP = () => {};
const EMPTY_STATE = { stuck: false, setStuck: NOOP, topRightHover: false, setTopRightHover: NOOP };
export function useStickyHeaderState() {
  return useContext(StickyHeaderContext) || EMPTY_STATE;
}
export function useSetStickyHeader() {
  const ctx = useContext(StickyHeaderContext);
  return ctx ? ctx.setStuck : NOOP;
}
export function usePageTitleValue() {
  return useContext(StickyHeaderContext)?.title ?? '';
}
export function useSetPageTitle() {
  return useContext(StickyHeaderContext)?.setTitle ?? NOOP;
}
