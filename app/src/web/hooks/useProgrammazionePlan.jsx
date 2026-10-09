// Port di src/hooks/useProgrammazionePlan.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - localStorage.getItem
//  - localStorage.removeItem
import { useCallback, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';

/**
 * Carica (o migra da localStorage) il Prospetto Inviti di un promoter.
 * Funzione condivisa tra l'hook e il prefetch all'avvio dell'app, così la
 * cache React Query è già calda quando l'utente apre "Weekend" → niente
 * flash "Prospetto vuoto" → contenuto reale.
 * Shape del record: { id, promoter_id, plan: { [dateStr]: { title, subtitle, clients: [...] } } }
 */
export async function fetchProgrammazionePlan(promoterId) {
  const records = await base44.entities.ProgrammazionePlan.filter({ promoter_id: promoterId });
  if (records && records.length > 0) return records[0];

  // Migrazione one-time del prospetto localStorage esistente
  const lsKey = `vibra_prog_plan_${promoterId}`;
  let migrated = null;
  try { migrated = JSON.parse(localStorage.getItem(lsKey) || 'null'); } catch { migrated = null; }
  if (migrated && Object.keys(migrated).length > 0) {
    const created = await base44.entities.ProgrammazionePlan.create({ promoter_id: promoterId, plan: migrated });
    try { localStorage.removeItem(lsKey); } catch {}
    return created;
  }
  return null;
}

/**
 * Stato del "Prospetto Inviti" (programmazione), sincronizzato LIVE su server
 * (entità ProgrammazionePlan) per promoter. Una riga per promoter.
 *
 * Usa React Query per il caricamento iniziale: così la cache precaricata
 * all'avvio dell'app (prefetchCoreData) viene riusata e il prospetto appare
 * istantaneamente, senza il flash "vuoto → popolato". Una subscription realtime
 * propaga i cambiamenti su ogni dispositivo del promoter.
 */
export function useProgrammazionePlan(promoterId) {
  const qc = useQueryClient();
  const suppressUntilRef = useRef(0);

  const { data: record, isLoading } = useQuery({
    queryKey: ['programmazione-plan', promoterId],
    queryFn: () => fetchProgrammazionePlan(promoterId),
    enabled: !!promoterId,
    staleTime: 5 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const plan = record?.plan || {};

  // Subscription realtime: applica immediatamente ogni cambio remoto del
  // prospetto di questo promoter (salvo eco dei nostri stessi change).
  useEffect(() => {
    if (!promoterId) return;
    const key = ['programmazione-plan', promoterId];
    const unsubscribe = base44.entities.ProgrammazionePlan.subscribe((event) => {
      const data = event?.data || {};
      if (data.promoter_id !== promoterId) return;
      if (Date.now() < suppressUntilRef.current) return;
      if (event.type === 'delete') { qc.setQueryData(key, null); return; }
      qc.setQueryData(key, data);
    });
    return unsubscribe;
  }, [promoterId, qc]);

  // Persiste su server (no debounce) per propagazione live istantanea.
  const persist = useCallback(async (nextPlan) => {
    suppressUntilRef.current = Date.now() + 1500; // ignora l'eco del nostro update
    try {
      const cur = qc.getQueryData(['programmazione-plan', promoterId]);
      const id = cur?.id || null;
      if (id) {
        await base44.entities.ProgrammazionePlan.update(id, { plan: nextPlan });
      } else {
        const created = await base44.entities.ProgrammazionePlan.create({
          promoter_id: promoterId,
          plan: nextPlan,
        });
        if (created?.id) qc.setQueryData(['programmazione-plan', promoterId], created);
      }
    } catch { /* la subscription ripristinerà lo stato reale al prossimo evento */ }
  }, [promoterId, qc]);

  // Aggiornamento ottimistico immediato della cache (UI istantanea)
  const setOptimistic = useCallback((nextPlan) => {
    const key = ['programmazione-plan', promoterId];
    const cur = qc.getQueryData(key);
    qc.setQueryData(key, { ...(cur || {}), plan: nextPlan, ...(cur?.id ? { id: cur.id } : {}) });
  }, [promoterId, qc]);

  const addToPlan = useCallback((dateStr, meta, client) => {
    const key = ['programmazione-plan', promoterId];
    const cur = qc.getQueryData(key);
    const curPlan = cur?.plan || {};
    const entry = curPlan[dateStr] || { title: meta.title, subtitle: meta.subtitle, clients: [] };
    if ((entry.clients || []).some(c => c.id === client.id)) return;
    const nextPlan = {
      ...curPlan,
      [dateStr]: {
        title: meta.title,
        subtitle: meta.subtitle,
        clients: [...(entry.clients || []), {
          id: client.id,
          name: client.name,
          note: '',
          type: client.isSemina ? 'semina' : 'client',
          ig: client.igHandle || '',
        }],
      },
    };
    setOptimistic(nextPlan);
    persist(nextPlan);
  }, [promoterId, qc, setOptimistic, persist]);

  const removeFromPlan = useCallback((dateStr, clientId) => {
    const key = ['programmazione-plan', promoterId];
    const cur = qc.getQueryData(key);
    const curPlan = cur?.plan || {};
    const entry = curPlan[dateStr];
    if (!entry) return;
    const next = (entry.clients || []).filter(c => c.id !== clientId);
    const copy = { ...curPlan };
    if (next.length === 0) delete copy[dateStr];
    else copy[dateStr] = { ...entry, clients: next };
    setOptimistic(copy);
    persist(copy);
  }, [promoterId, qc, setOptimistic, persist]);

  const updateNote = useCallback((dateStr, clientId, note) => {
    const key = ['programmazione-plan', promoterId];
    const cur = qc.getQueryData(key);
    const curPlan = cur?.plan || {};
    const entry = curPlan[dateStr];
    if (!entry) return;
    const clients = (entry.clients || []).map(c => (c.id === clientId ? { ...c, note } : c));
    const nextPlan = { ...curPlan, [dateStr]: { ...entry, clients } };
    setOptimistic(nextPlan);
    persist(nextPlan);
  }, [promoterId, qc, setOptimistic, persist]);

  return { plan, addToPlan, removeFromPlan, updateNote, loading: isLoading };
}