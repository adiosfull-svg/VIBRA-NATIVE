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
export function useStickyHeaderState() {
  return useContext(StickyHeaderContext) || { stuck: false, setStuck: () => {}, topRightHover: false, setTopRightHover: () => {} };
}
export function useSetStickyHeader() {
  const ctx = useContext(StickyHeaderContext);
  return ctx ? ctx.setStuck : () => {};
}
export function usePageTitleValue() {
  return useContext(StickyHeaderContext)?.title ?? '';
}
export function useSetPageTitle() {
  return useContext(StickyHeaderContext)?.setTitle ?? (() => {});
}
