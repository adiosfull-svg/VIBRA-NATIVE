// API di react-router-dom usate dall'app web, sopra expo-router. Le route native hanno gli
// stessi percorsi dell'originale (/clienti, /il-mio-vibra?tab=..., /promoter/:id).
import { router, useGlobalSearchParams, useLocalSearchParams, useNavigation, usePathname, type Href } from 'expo-router';
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
// "Weekend" ridisegnava anche Clienti, Il Mio Vibra e Semine (~2 s sul telefono). Qui una pagina senza
// focus tiene l'ultimo percorso visto e si aggiorna solo quando torna in primo piano.
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

export function useLocation() {
  const navigation = useNavigationSafe();
  const seen = useRef<Loc | null>(null);
  const getSnapshot = () => {
    let focused = true;
    try { focused = navigation?.isFocused?.() ?? true; } catch { /* fuori da un navigatore */ }
    if (focused || !seen.current) seen.current = currentLoc;
    return seen.current;
  };
  const subscribe = useCallback((fn: () => void) => {
    locListeners.add(fn);
    const off = navigation?.addListener?.('focus', fn);
    return () => { locListeners.delete(fn); off?.(); };
  }, [navigation]);
  const { pathname, params } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const search = useMemo(() => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (typeof v === 'string') sp.set(k, v);
    const s = sp.toString();
    return s ? `?${s}` : '';
  }, [params]);
  return { pathname, search, hash: '', state: null as unknown };
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
