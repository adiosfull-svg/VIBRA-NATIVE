// Port 1:1 di src/hooks/useNotifications.jsx (cambiano solo gli import).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { base44 } from '../../lib/base44';
import { useAuth } from '../../lib/auth';

export function useNotifications() {
  const { user } = useAuth();
  const promoterId = user?.promoter_id;
  const queryClient = useQueryClient();
  // Cooldown dopo "Cancella tutte": gli eventi realtime dei record eliminati
  // arrivano poco dopo la fine della mutazione e triggererebbero un refetch
  // che, per lag di read-after-write, restituirebbe le notifiche appena cancellate
  // facendole riapparire. Ignoriamo gli eventi per 2s dal click.
  const deleteAllCooldownRef = useRef(0);

  // Subscription realtime: invalida la query quando arriva una nuova notifica
  useEffect(() => {
    if (!user) return;
    const unsubscribe = base44.entities.Notification.subscribe(() => {
      // Durante una cancellazione/lettura in corso ogni record modificato genera un
      // evento: rifare la query a metà operazione farebbe riapparire le notifiche.
      if (queryClient.isMutating({ mutationKey: ['notifications'] })) return;
      if (Date.now() < deleteAllCooldownRef.current) return;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });
    return unsubscribe;
  }, [user, queryClient]);

  const { data: notifications = [] } = useQuery({
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
    refetchInterval: 2 * 60 * 1000, // polling ogni 2 minuti
    refetchOnWindowFocus: true,
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
      deleteAllCooldownRef.current = Date.now() + 2000;
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      updateCache(() => []);
    },
    // Non invalidare: un refetch immediato dopo il deleteMany può incappare nel
    // lag di read-after-write del DB e restituire le notifiche appena cancellate
    // (effetto "flash e riappaiono"). La cache resta [] (ottimistica); il
    // polling (2min) e gli eventi realtime future riconciliano naturalmente.
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