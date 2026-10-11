// API di react-router-dom usate dall'app web, sopra expo-router. Le route native hanno gli
// stessi percorsi dell'originale (/clienti, /il-mio-vibra?tab=..., /promoter/:id).
import { router, useGlobalSearchParams, useLocalSearchParams, useNavigation, usePathname, useRoutePath, type Href } from 'expo-router';
import { useCallback, useLayoutEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { Btn } from '../ui/html';

type NavigateOpts = { replace?: boolean; state?: unknown };

export function useNavigate() {
  return (to: string | number, opts?: NavigateOpts) => {
    if (typeof to === 'number') {
      if (to < 0 && router.canGoBack()) router.back();
      return;
    }
    if (opts?.replace) router.replace(to as Href);
    else router.push(to as Href);
  };
}

// Percorso corrente: lo pubblica <LocationPublisher/> (layout dell'app). usePathname/useGlobalSearchParams
// in ogni pagina la ridisegnavano a ogni cambio di percorso anche da nascosta: con le tab montate, toccare
// "Weekend" ridisegnava anche Clienti e Il Mio Vibra (~2 s sul telefono). Qui una pagina segue solo il
// SUO percorso (quello che aveva la prima volta che ha avuto il focus); i componenti del layout (Sidebar)
// usano useCurrentLocation, che li segue tutti.
type Loc = { pathname: string; params: Record<string, string | string[] | undefined> };
let currentLoc: Loc = { pathname: '/', params: {} };
const locListeners = new Set<() => void>();

export function LocationPublisher() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  // durante il render (prima delle pagine, che stanno sotto nel layout): leggono già il valore nuovo
  if (currentLoc.pathname !== pathname || currentLoc.params !== params) currentLoc = { pathname, params };
  useLayoutEffect(() => { locListeners.forEach((fn) => fn()); }, [pathname, params]);
  return null;
}

type Nav = { isFocused?: () => boolean; addListener?: (e: 'focus', fn: () => void) => () => void } | undefined;

function useNavigationSafe(): Nav {
  try { return useNavigation() as Nav; } catch { return undefined; }
}

function toLocation({ pathname, params }: Loc) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (typeof v === 'string') sp.set(k, v);
  const s = sp.toString();
  return { pathname, search: s ? `?${s}` : '', hash: '', state: null as unknown };
}

/** Stesso percorso e stessi parametri: tornando su una pagina non la si ridisegna per un oggetto nuovo. */
function sameLoc(a: Loc | null, b: Loc): boolean {
  if (!a || a.pathname !== b.pathname) return false;
  const ka = Object.keys(a.params), kb = Object.keys(b.params);
  return ka.length === kb.length && ka.every((k) => String(a.params[k]) === String(b.params[k]));
}

const subscribeAll = (fn: () => void) => { locListeners.add(fn); return () => { locListeners.delete(fn); }; };
const getCurrent = () => currentLoc;

/** Percorso corrente, sempre aggiornato (componenti del layout, fuori dalle pagine). */
export function useCurrentLocation() {
  const loc = useSyncExternalStore(subscribeAll, getCurrent, getCurrent);
  return useMemo(() => toLocation(loc), [loc]);
}

/** Percorso proprio dello schermo che contiene il componente (anche se precaricato e mai visto). */
function useOwnPathname(): string | null {
  try {
    const p = useRoutePath();
    return p ? (p.split('?')[0] || '/') : null;
  } catch { return null; /* fuori da uno schermo */ }
}

export function useLocation() {
  const navigation = useNavigationSafe();
  const ownPath = useOwnPathname();
  const own = useRef<string | null>(ownPath);
  if (ownPath) own.current = ownPath;
  const seen = useRef<Loc | null>(null);
  const getSnapshot = () => {
    if (own.current == null) {
      // senza schermo noto: il percorso che c'è la prima volta che ha il focus
      let focused = true;
      try { focused = navigation?.isFocused?.() ?? true; } catch { /* fuori da un navigatore */ }
      if (focused) own.current = currentLoc.pathname;
    }
    if (own.current != null && currentLoc.pathname === own.current) {
      if (!sameLoc(seen.current, currentLoc)) seen.current = currentLoc;
    } else {
      // pagina non in primo piano (o precaricata): il suo percorso, senza i parametri di un'altra pagina
      seen.current ??= { pathname: own.current ?? currentLoc.pathname, params: {} };
    }
    return seen.current!;
  };
  const subscribe = useCallback((fn: () => void) => {
    locListeners.add(fn);
    const off = navigation?.addListener?.('focus', fn);
    return () => { locListeners.delete(fn); off?.(); };
  }, [navigation]);
  const loc = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return useMemo(() => toLocation(loc), [loc]);
}

export function useSearchParams(): [URLSearchParams, (next: Record<string, string> | URLSearchParams) => void] {
  const { search, pathname } = useLocation();
  const sp = useMemo(() => new URLSearchParams(search), [search]);
  const set = (next: Record<string, string> | URLSearchParams) => {
    const q = new URLSearchParams(next as Record<string, string>).toString();
    router.setParams(Object.fromEntries(new URLSearchParams(q)) as never);
    void pathname;
  };
  return [sp, set];
}

export function useParams<T extends Record<string, string>>() {
  return useLocalSearchParams() as unknown as T;
}

export function Link({ to, replace, children, className, onClick }: {
  to: string; replace?: boolean; children?: ReactNode; className?: string; onClick?: () => void;
}) {
  const navigate = useNavigate();
  return (
    // Btn come per <a>: classi del web (flex in riga, testo ereditato) e testo nudo avvolto
    <Btn className={className} accessibilityRole="link" onClick={() => { onClick?.(); navigate(to, { replace }); }}>
      {children}
    </Btn>
  );
}
