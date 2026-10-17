// Port di src/hooks/useNotifications.jsx (stessa API).
// PORT: nell'originale l'header (con la campanella) è montato una volta sola in AppLayout; qui ogni
// pagina ha il suo header, e ogni pagina montata (5 tab precaricate + stack) aveva il suo osservatore con
// refetch e subscription realtime: a ogni apertura di pagina la campanella nuova rifaceva le due richieste
// (dati "stale" dopo 60 s) e la pagina non era "pronta" finché non tornavano. Ora refetch al
// focus e subscription stanno in UN solo punto (useNotificationsPolling, layout dell'app); le campanelle
// leggono la cache senza richieste proprie (docs/REGOLE-PRESTAZIONI.md §2).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { base44 } from '../../lib/base44';
import { useAuth } from '../../lib/auth';

// Cooldown dopo "Cancella tutte": gli eventi realtime dei record eliminati
// arrivano poco dopo la fine della mutazione e triggererebbero un refetch
// che, per lag di read-after-write, restituirebbe le notifiche appena cancellate
// facendole riapparire. Ignoriamo gli eventi per 2s dal click.
let deleteAllCooldownUntil = 0;

function notificationsQueryOptions(user) {
  const promoterId = user?.promoter_id;
  return {
    queryKey: ['notifications', promoterId],
    queryFn: async () => {
      // Carica notifiche personali + broadcast (recipient_promoter_id = null)
      const [personal, broadcast] = await Promise.all([
        promoterId
          ? base44.entities.Notification.filter({ recipient_promoter_id: promoterId }, '-created_date', 30)
          : Promise.resolve([]),
        base44.entities.Notification.filter({ recipient_promoter_id: null }, '-created_date', 20),
      ]);
      // Merge e deduplication per id, ordine cronologico decrescente
      const all = [...personal, ...broadcast];
      const seen = new Set();
      return all
        .filter(n => { if (seen.has(n.id)) return false; seen.add(n.id); return true; })
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 30);
    },
    enabled: !!user,
    staleTime: 60 * 1000,        // ricarica ogni minuto
  };
}

/** Un solo osservatore per tutta l'app (layout): refetch al focus e subscription realtime. */
export function useNotificationsPolling() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  // Subscription realtime: invalida la query quando arriva una nuova notifica
  useEffect(() => {
    if (!user) return;
    const unsubscribe = base44.entities.Notification.subscribe(() => {
      // Durante una cancellazione/lettura in corso ogni record modificato genera un
      // evento: rifare la query a metà operazione farebbe riapparire le notifiche.
      if (queryClient.isMutating({ mutationKey: ['notifications'] })) return;
      if (Date.now() < deleteAllCooldownUntil) return;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
    return unsubscribe;
  }, [user, queryClient]);
  useQuery({
    ...notificationsQueryOptions(user),
    // Solo realtime: niente polling periodico (come l'originale dal 16/10). Gli
    // aggiornamenti arrivano dalla subscription. Resta un solo controllo quando si
    // torna nell'app (focus, collegato ad AppState in lib/queryClient.ts): con il
    // telefono bloccato o l'app in background la connessione realtime si chiude e le
    // notifiche arrivate nel frattempo non generano eventi.
    refetchOnWindowFocus: true,
  });
}

export function useNotifications() {
  const { user } = useAuth();
  const promoterId = user?.promoter_id;
  const queryClient = useQueryClient();

  // solo lettura della cache: niente richiesta al montaggio di ogni campanella (vedi sopra)
  const { data: notifications = [] } = useQuery({
    ...notificationsQueryOptions(user),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const queryKey = ['notifications', promoterId];

  const updateCache = (updater) => queryClient.setQueryData(queryKey, updater);

  const markAsRead = useMutation({
    mutationFn: (notificationId) =>
      base44.entities.Notification.update(notificationId, { is_read: true }),
    onMutate: (notificationId) => {
      updateCache(prev => (prev || []).map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'], exact: false }),
  });

  const markAllAsRead = useMutation({
    mutationKey: ['notifications'],
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => base44.entities.Notification.update(n.id, { is_read: true })));
    },
    onMutate: () => {
      updateCache(prev => (prev || []).map(n => ({ ...n, is_read: true })));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'], exact: false }),
  });

  const deleteNotification = useMutation({
    mutationFn: (notificationId) => base44.entities.Notification.delete(notificationId),
    onMutate: (notificationId) => {
      updateCache(prev => (prev || []).filter(n => n.id !== notificationId));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'], exact: false }),
  });

  const deleteAllRead = useMutation({
    mutationKey: ['notifications'],
    mutationFn: async () => {
      const read = notifications.filter(n => n.is_read);
      await Promise.all(read.map(n => base44.entities.Notification.delete(n.id)));
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      updateCache(prev => (prev || []).filter(n => !n.is_read));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'], exact: false }),
  });

  const deleteAll = useMutation({
    mutationKey: ['notifications'],
    // "Cancella tutte" svuota il pannello: elimina le notifiche personali del
    // promoter e quelle broadcast (condivise) visibili in questo momento.
    mutationFn: async () => {
      await base44.entities.Notification.deleteMany({ recipient_promoter_id: promoterId });
      await base44.entities.Notification.deleteMany({ recipient_promoter_id: null });
    },
    onMutate: async () => {
      deleteAllCooldownUntil = Date.now() + 2000;
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      updateCache(() => []);
    },
    // Non invalidare: un refetch immediato dopo il deleteMany può incappare nel
    // lag di read-after-write del DB e restituire le notifiche appena cancellate
    // (effetto "flash e riappaiono"). La cache resta [] (ottimistica); gli
    // eventi realtime futuri e il ritorno nell'app riconciliano naturalmente.
    onSettled: () => updateCache(() => []),
  });

  return {
    notifications,
    unreadCount,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate,
    deleteAllRead: deleteAllRead.mutate,
    deleteAll: deleteAll.mutate,
  };
}