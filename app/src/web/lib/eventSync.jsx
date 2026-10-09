// Port di src/lib/eventSync.js (convertito da scripts/port/codemod.mjs).
import { base44 } from '@/lib/base44';

/**
 * Lancia il ricalcolo delle statistiche cumulative in background (debounce 15s
 * interno alla funzione). Al completamento refetcha i promoter (classifiche,
 * cum_total_*). Fire-and-forget: non blocca la UI, non gate il refetch eventi.
 * Da chiamare dopo ogni operazione che modifica eventi/presenze.
 */
export function triggerStatsRecompute(qc) {
  base44.functions.invoke('recomputeCumulativeStats', {})
    .then(() => {
      qc.refetchQueries({ queryKey: ['promoters'] });
    })
    .catch(() => {});
}

/**
 * Write-through delle presenze in cache DOPO la scrittura riuscita sul server:
 * aggiorna subito ['attendances', promoterId] (Il Mio Vibra: fatturato, guadagni,
 * progressi) e ['attendances-all'], senza aspettare il refetch.
 */
export function writeThroughAttendances(qc, { created = [], updated = [], deletedIds = [] }) {
  const deleted = new Set(deletedIds);
  const updatedById = new Map(updated.map(u => [u.id, u]));
  const patch = (old) => {
    if (!Array.isArray(old)) return old;
    return old
      .filter(a => !deleted.has(a.id))
      .map(a => (updatedById.has(a.id) ? { ...a, ...updatedById.get(a.id) } : a));
  };
  qc.setQueriesData({ queryKey: ['attendances'] }, patch);
  qc.setQueriesData({ queryKey: ['attendances-all'] }, patch);
  for (const rec of created.filter(Boolean)) {
    const add = (old) => (Array.isArray(old) && !old.some(a => a.id === rec.id) ? [rec, ...old] : old);
    if (rec.promoter_id) qc.setQueryData(['attendances', rec.promoter_id], add);
    qc.setQueryData(['attendances-all'], add);
  }
  // Il tab "Il Mio Team" tiene una copia piatta delle presenze del team (['team-attendances', ids]):
  // non è un prefisso di ['attendances'], quindi non viene toccata dalle patch sopra. La si
  // invalida: alla prossima apertura (o subito, se è aperta) si ricostruisce dalle cache per-promoter
  // già aggiornate qui, senza restare indietro fino alla scadenza dello staleTime (15 min).
  qc.invalidateQueries({ queryKey: ['team-attendances'] });
}

/**
 * Refetch immediato di eventi e presenze: riconcilia la cache col DB dopo
 * un'operazione riuscita. Disaccoppiato dal ricalcolo statistiche (che ha 15s
 * di debounce): la lista serate si aggiorna in pochi secondi, niente fantasmi.
 */
export function refetchEventTables(qc) {
  qc.refetchQueries({ queryKey: ['events'] });
  qc.refetchQueries({ queryKey: ['attendances-all'] });
  // Le presenze per-promoter si rifanno dal server: la copia del Team si invalida DOPO, così si
  // ricostruisce dai dati freschi e non da quelli appena scaduti.
  qc.refetchQueries({ queryKey: ['attendances'] })
    .then(() => qc.invalidateQueries({ queryKey: ['team-attendances'] }))
    .catch(() => qc.invalidateQueries({ queryKey: ['team-attendances'] }));
}