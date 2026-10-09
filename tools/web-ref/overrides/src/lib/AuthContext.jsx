// Sostituto di AuthContext per l'app di riferimento: stesso contesto esposto dall'originale,
// ma login automatico sullo stack locale. Utente scelto con ?as=admin|pr|super4 (o email).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44, supabase } from '@/api/base44Client';

const AuthContext = createContext();
const PASSWORD = 'vibra';

function wantedEmail() {
  const as = new URLSearchParams(window.location.search).get('as');
  if (as) localStorage.setItem('webref_as', as);
  const v = as || localStorage.getItem('webref_as') || 'admin';
  return v.includes('@') ? v : `${v}@vibra.local`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const checkAppState = async () => {
    setIsLoadingAuth(true);
    try {
      const email = wantedEmail();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== email) {
        await supabase.auth.signOut();
        const { error } = await supabase.auth.signInWithPassword({ email, password: PASSWORD });
        if (error) throw error;
      }
      setUser(await base44.auth.me());
    } catch (e) {
      console.error('[web-ref] login fallito', e);
      setAuthError({ type: 'unknown', message: e.message });
    }
    setIsLoadingAuth(false);
  };

  useEffect(() => { checkAppState(); }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      appPublicSettings: { id: 'local', public_settings: {} },
      logout: () => base44.auth.logout(),
      navigateToLogin: () => base44.auth.redirectToLogin(),
      checkAppState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
