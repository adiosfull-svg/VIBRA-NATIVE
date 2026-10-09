// Utente connesso, come AuthContext dell'app web: user = base44.auth.me() (con role e promoter_id).
// Backend vero: login con Google su Base44 (authRemote). Stack di prova: email/password (authLocal).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BACKEND } from './backend';

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

  const loadUser = useCallback(async () => {
    try {
      setUser((await remote.remoteBase44.auth.me()) as unknown as AppUser);
    } catch (e) {
      const status = (e as { status?: number; response?: { status?: number } })?.status ?? (e as any)?.response?.status;
      // token scaduto o non valido: si torna al login
      if (status === 401 || status === 403) await remote.signOut();
      setUser(null);
    }
  }, [remote]);

  useEffect(() => {
    (async () => {
      if (await remote.restoreSession()) await loadUser();
      setLoading(false);
    })();
    return remote.onSignedOut(() => setUser(null));
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
    refreshUser: loadUser,
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
