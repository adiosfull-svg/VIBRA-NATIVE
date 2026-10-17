// Port di src/lib/layoutUIContext.jsx (stato condiviso: menu account, sidebar).
//
// PRESTAZIONI (docs/REGOLE-PRESTAZIONI.md §4): stato e azioni sono due contesti separati. Gli
// header di TUTTE le pagine montate (5 tab precaricate + stack) usano solo le azioni, che non
// cambiano mai: aprire un menu ridisegna solo il pannello, non ogni pagina.
// Le azioni avviano subito l'animazione del pannello (registerDrawerAnimator, thread UI) e solo dopo
// aggiornano lo stato React: anche se il commit è pesante (es. navigazione dalla sidebar)
// l'animazione non aspetta il JS.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CustomEvt, win } from '../shims/dom';

type LayoutUIState = { accountMenuOpen: boolean; sidebarOpen: boolean; searchOpen: boolean };
type LayoutUIActions = {
  setAccountMenuOpen: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
};
type LayoutUI = LayoutUIState & LayoutUIActions;

const StateCtx = createContext<LayoutUIState | null>(null);
const ActionsCtx = createContext<LayoutUIActions | null>(null);
// un contesto per valore: aprire la sidebar non ridisegna la nav bar (ricerca) né il menu account
const OpenCtx = {
  accountMenuOpen: createContext(false),
  sidebarOpen: createContext(false),
  searchOpen: createContext(false),
};

export type DrawerName = 'sidebar' | 'account';
const animators: Partial<Record<DrawerName, (open: boolean) => void>> = {};

/** Il pannello registra chi lo anima: le azioni lo chiamano in modo sincrono, prima del setState. */
export function registerDrawerAnimator(name: DrawerName, fn: (open: boolean) => void) {
  animators[name] = fn;
  return () => { if (animators[name] === fn) delete animators[name]; };
}

export function LayoutUIProvider({ children }: { children: ReactNode }) {
  const [accountMenuOpen, setAccountState] = useState(false);
  const [sidebarOpen, setSidebarState] = useState(false);
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
  const setAccountMenuOpen = useCallback((v: boolean) => { animators.account?.(v); setAccountState(v); }, []);
  const setSidebarOpen = useCallback((v: boolean) => { animators.sidebar?.(v); setSidebarState(v); }, []);
  const actions = useMemo(() => ({ setAccountMenuOpen, setSidebarOpen, setSearchOpen }), [setAccountMenuOpen, setSidebarOpen, setSearchOpen]);
  const state = useMemo(() => ({ accountMenuOpen, sidebarOpen, searchOpen }), [accountMenuOpen, sidebarOpen, searchOpen]);
  return (
    <ActionsCtx.Provider value={actions}>
      <OpenCtx.accountMenuOpen.Provider value={accountMenuOpen}>
        <OpenCtx.sidebarOpen.Provider value={sidebarOpen}>
          <OpenCtx.searchOpen.Provider value={searchOpen}>
            <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
          </OpenCtx.searchOpen.Provider>
        </OpenCtx.sidebarOpen.Provider>
      </OpenCtx.accountMenuOpen.Provider>
    </ActionsCtx.Provider>
  );
}

/** Solo le azioni (valore stabile): da usare in header, pulsanti e ovunque non serva lo stato. */
export function useLayoutUIActions() {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error('useLayoutUIActions va usato dentro <LayoutUIProvider>');
  return ctx;
}

/** Stato + azioni (si ridisegna a ogni apertura/chiusura): solo per i pannelli e la nav bar. */
export function useLayoutUI(): LayoutUI {
  const state = useContext(StateCtx);
  const actions = useContext(ActionsCtx);
  if (!state || !actions) throw new Error('useLayoutUI va usato dentro <LayoutUIProvider>');
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}

/** Un solo valore aperto/chiuso: chi lo usa si ridisegna solo quando cambia quello (pannelli, nav bar). */
export function useLayoutUIOpen(key: keyof LayoutUIState): boolean {
  return useContext(OpenCtx[key]);
}
