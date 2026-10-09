// API di react-router-dom usate dall'app web, sopra expo-router. Le route native hanno gli
// stessi percorsi dell'originale (/clienti, /il-mio-vibra?tab=..., /promoter/:id).
import { router, useGlobalSearchParams, useLocalSearchParams, usePathname, type Href } from 'expo-router';
import { useMemo, type ReactNode } from 'react';
import { Pressable } from 'react-native';

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

export function useLocation() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
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
    <Pressable className={className} accessibilityRole="link" onPress={() => { onClick?.(); navigate(to, { replace }); }}>
      {children}
    </Pressable>
  );
}
