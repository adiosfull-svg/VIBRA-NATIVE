// Portato da src/hooks/useRoleAccess.jsx (Base44): stesse regole di accesso.
import { useAuth, type AppUser } from './auth';

export type RouteName =
  | 'dashboard' | 'promoter' | 'promoter-detail' | 'clienti' | 'clienti-analytics' | 'serate' | 'locali'
  | 'programmazione' | 'semine' | 'messaggi' | 'il-mio-vibra' | 'ricerca-ai' | 'formazione' | 'download'
  | 'notifiche' | 'academy' | 'admin-console';

const BLOCKED_FOR_LIMITED: RouteName[] = ['dashboard', 'promoter', 'serate', 'locali', 'promoter-detail', 'admin-console'];

export function canAccessRoute(user: AppUser | null, routeName: RouteName) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'super4') return true;
  // Capogruppo e PR: niente dashboard, promoter, serate, locali, dettaglio promoter, console admin
  return !BLOCKED_FOR_LIMITED.includes(routeName);
}

export function canModify(user: AppUser | null, section: string) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return ['clienti', 'il-mio-vibra'].includes(section);
}

export function useRoleAccess() {
  const { user } = useAuth();
  const role = user?.role;
  return {
    user,
    hasAccess: (roles: string[]) => !!role && roles.includes(role),
    canAccessRoute: (r: RouteName) => canAccessRoute(user, r),
    canModify: (s: string) => canModify(user, s),
    canAccessRicercaAI: () => !!role,
    ricercaAIMode: () => (!role ? null : role === 'admin' || role === 'super4' ? 'full' : 'limited'),
    canAccessIlMioVibra: () => !!role,
    isAdmin: role === 'admin',
    isSuper4: role === 'super4',
    isCapogruppo: role === 'capogruppo',
    isPR: role === 'pr',
  };
}
