// Port di src/lib/attendanceQueries.js (convertito da scripts/port/codemod.mjs).
import { base44 } from '@/lib/base44';
import { fetchAll } from '@/web/lib/safeData';
import { STALE_FULL_TABLE, GC_FULL_TABLE } from '@/web/lib/query-client';

/**
 * Opzioni UNICHE per la tabella presenze completa (tutti i promoter).
 * Prima la stessa tabella (~5400 righe) viveva in due cache diverse:
 *   ['attendances']      -> Serate, Report, VibraGPT, Ricerca AI
 *   ['attendances-all']  -> Dashboard, Locali, Promoter, Achievement, Vibra VS...
 * e passando da una pagina all'altra veniva scaricata due volte. Ora tutti usano
 * ['attendances-all'] con lo stesso fetcher e gli stessi tempi di cache.
 * (['attendances', promoterId] resta la cache per-promoter, più leggera.)
 */
export const attendancesAllOptions = () => ({
  queryKey: ['attendances-all'],
  staleTime: STALE_FULL_TABLE,
  gcTime: GC_FULL_TABLE,
  queryFn: () => fetchAll(base44.entities.EventAttendance, {}, { sort: '-created_date' }),
});