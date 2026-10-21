// Utente connesso, come AuthContext dell'app web: user = base44.auth.me() (con role e promoter_id).
// Backend vero: login con Google su Base44 (authRemote). Stack di prova: email/password (authLocal).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BACKEND } from './backend';
import { clearPersistedCache } from './queryCachePersist';
import { readCachedUser, writeCachedUser } from './userCache';

export type Role = 'admin' | 'super4' | 'capogruppo' | 'pr';

/** Utente restituito da base44.auth.me() (qui i campi usati dall'app; l'oggetto ha anche gli altri). */
export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  promoter_id: string | null;
  [key: string]: unknown;
};

export type AuthState = {
  user: AppUser | null;
  isLoadingAuth: boolean;
  /** Accesso con Google (backend Base44). */
  signInWithGoogle: () => Promise<boolean>;
  /** Accesso email/password (solo stack di prova locale). */
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Alias dell'app web (AuthContext.logout) */
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function useRemoteAuth(): AuthState {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const remote = require('./base44Remote') as typeof import('./base44Remote');
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoadingAuth, setLoading] = useState(true);

  const loadUser = useCallback(async (keepOnError = false) => {
    try {
      const me = (await remote.remoteBase44.auth.me()) as unknown as AppUser;
      // stesso utente di quello salvato: niente nuovo oggetto (ridisegnerebbe tutta l'app appena partita)
      setUser((prev) => (prev && JSON.stringify(prev) === JSON.stringify(me) ? prev : me));
      writeCachedUser(me);
    } catch (e) {
      const status = (e as { status?: number; response?: { status?: number } })?.status ?? (e as any)?.response?.status;
      // token scaduto o non valido: si torna al login
      if (status === 401 || status === 403) { await remote.signOut(); setUser(null); return; }
      // senza rete all'avvio si resta con l'utente salvato
      if (!keepOnError) setUser(null);
    }
  }, [remote]);

  useEffect(() => {
    (async () => {
      if (await remote.restoreSession()) {
        const cached = readCachedUser();
        if (cached) {
          // l'app parte subito con l'ultimo utente; me() lo aggiorna dietro
          setUser(cached);
          setLoading(false);
          await loadUser(true);
          return;
        }
        await loadUser();
      }
      setLoading(false);
    })();
    return remote.onSignedOut(() => { setUser(null); writeCachedUser(null); clearPersistedCache(); });
  }, [remote, loadUser]);

  return useMemo<AuthState>(() => ({
    user,
    isLoadingAuth,
    async signInWithGoogle() {
      const ok = await remote.signInWithGoogle();
      if (ok) await loadUser();
      return ok;
    },
    async signIn() {
      throw new Error('Con Base44 si accede con Google');
    },
    signOut: remote.signOut,
    logout: remote.signOut,
    refreshUser: () => loadUser(),
  }), [user, isLoadingAuth, remote, loadUser]);
}

const useAuthState: () => AuthState = BACKEND === 'local'
  ? (require('./authLocal') as typeof import('./authLocal')).useLocalAuth
  : useRemoteAuth;

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth va usato dentro <AuthProvider>');
  return ctx;
}
