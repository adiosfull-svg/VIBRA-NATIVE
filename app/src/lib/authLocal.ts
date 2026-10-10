// Login sullo stack di PROVA (EXPO_PUBLIC_BACKEND=local): email/password su Supabase-like locale.
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { AppUser, AuthState } from './auth';

async function loadProfile(session: Session | null): Promise<AppUser | null> {
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, promoter_id')
    .eq('id', session.user.id)
    .single();
  if (error) throw new Error(`Profilo non trovato: ${error.message}`);
  return data as AppUser;
}

export function useLocalAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoadingAuth, setLoading] = useState(true);

  const apply = useCallback(async (s: Session | null) => {
    setSession(s);
    try {
      setUser(await loadProfile(s));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      // Build di test sull'emulatore (workflow "Emulatore"): accesso automatico con l'utente di
      // prova, EXPO_PUBLIC_TEST_LOGIN="email:password". Solo stack locale, mai nell'APK pubblicato.
      const test = process.env.EXPO_PUBLIC_TEST_LOGIN;
      if (!data.session && test) {
        const i = test.indexOf(':');
        const { data: signed } = await supabase.auth.signInWithPassword({ email: test.slice(0, i), password: test.slice(i + 1) });
        if (signed.session) return; // apply arriva da onAuthStateChange
      }
      apply(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      // TOKEN_REFRESHED non cambia il profilo: evitiamo una query inutile.
      if (event === 'TOKEN_REFRESHED') setSession(s);
      // La callback non deve attendere altre chiamate Supabase (rischio deadlock del lock auth).
      else setTimeout(() => apply(s), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [apply]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isLoadingAuth,
      signInWithGoogle: async () => false,
      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Email o password errati' : error.message);
      },
      async signOut() {
        await supabase.auth.signOut();
      },
      async logout() {
        await supabase.auth.signOut();
      },
      async refreshUser() {
        setUser(await loadProfile(session));
      },
    }),
    [session, user, isLoadingAuth],
  );

  return value;
}

