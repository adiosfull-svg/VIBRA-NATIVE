// Stesse query della pagina Clienti web (chiavi react-query comprese), così le
// schermate che le condividono riusano la cache.
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { entities } from '../../lib/entities';
import { useViewAsPromoter } from '../../lib/viewAs';
import { buildClientBadgesMap } from '../../legacy/utils/clientPrecomputed';
import { computeClientStatsMap, EMPTY_STATS } from './clientStats';

export function useClientsData() {
  const { effectivePromoterId: promoterId } = useViewAsPromoter();

  const clientsQ = useQuery({
    queryKey: ['clients', promoterId],
    queryFn: () => entities.Client.filter({ promoter_id: promoterId }),
    enabled: !!promoterId,
  });
  const attendancesQ = useQuery({
    queryKey: ['attendances', promoterId],
    queryFn: () => entities.EventAttendance.filter({ promoter_id: promoterId }, '-created_date', 5000),
    enabled: !!promoterId,
  });
  const eventsQ = useQuery({
    queryKey: ['events'],
    queryFn: () => entities.Event.list('-date', 5000),
  });

  const clients = clientsQ.data ?? [];
  const attendances = attendancesQ.data ?? [];
  const events = eventsQ.data ?? [];

  const statsMap = useMemo(
    () => computeClientStatsMap(clients, attendances, events),
    [clients, attendances, events],
  );
  const badgesMap = useMemo(() => buildClientBadgesMap(clients) as Record<string, string[]>, [clients]);
  const getStats = (id: string) => statsMap[id] ?? EMPTY_STATS;

  return {
    promoterId,
    clients,
    events,
    attendances,
    statsMap,
    badgesMap,
    getStats,
    isLoading: clientsQ.isLoading || attendancesQ.isLoading || eventsQ.isLoading,
    error: clientsQ.error || attendancesQ.error || eventsQ.error,
    refetch: () => Promise.all([clientsQ.refetch(), attendancesQ.refetch(), eventsQ.refetch()]),
    isRefetching: clientsQ.isRefetching,
  };
}
