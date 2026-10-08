// Portato da src/lib/viewAsPromoterContext.jsx: l'admin può vedere l'app "come" un promoter.
// effectivePromoterId = (admin && viewAsPromoterId) ? viewAsPromoterId : user.promoter_id
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './auth';

const STORAGE_KEY = 'vibra_view_as_promoter';

type ViewAsState = {
  viewAsPromoterId: string | null;
  effectivePromoterId: string | null;
  isViewingAs: boolean;
  isAdmin: boolean;
  setViewAs: (id: string | null) => void;
  clearViewAs: () => void;
};

const Ctx = createContext<ViewAsState | null>(null);

export function ViewAsPromoterProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [viewAsPromoterId, setId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => v && setId(v)).catch(() => {});
  }, []);

  const setViewAs = useCallback((id: string | null) => {
    setId(id || null);
    (id ? AsyncStorage.setItem(STORAGE_KEY, id) : AsyncStorage.removeItem(STORAGE_KEY)).catch(() => {});
  }, []);

  // Reset se l'utente non è (più) admin
  useEffect(() => {
    if (user && !isAdmin && viewAsPromoterId) setViewAs(null);
  }, [user, isAdmin, viewAsPromoterId, setViewAs]);

  const value = useMemo<ViewAsState>(() => {
    const effectivePromoterId = isAdmin && viewAsPromoterId ? viewAsPromoterId : user?.promoter_id ?? null;
    return {
      viewAsPromoterId,
      effectivePromoterId,
      isViewingAs: isAdmin && !!viewAsPromoterId && viewAsPromoterId !== user?.promoter_id,
      isAdmin,
      setViewAs,
      clearViewAs: () => setViewAs(null),
    };
  }, [isAdmin, viewAsPromoterId, user?.promoter_id, setViewAs]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useViewAsPromoter() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useViewAsPromoter va usato dentro <ViewAsPromoterProvider>');
  return ctx;
}
