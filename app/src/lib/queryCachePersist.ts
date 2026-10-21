// Port di src/lib/queryCachePersist.js dell'originale: la cache di React Query salvata sul telefono e
// rimessa all'avvio, così al secondo accesso le pagine partono coi dati (e la rete aggiorna dietro,
// stale-while-revalidate). Stesse regole: versione, notifiche mai salvate, scrittura solo quando cambiano
// i dati (debounce 4 s, poi a app ferma) e all'uscita dall'app. Durata 24 ore invece di 30 minuti (scelta
// di Antonio, 21/10): senza rete l'app si apre con gli ultimi dati visti (avviso in ui OfflineBanner).
// Al posto di IndexedDB un file JSON nella cartella dei documenti (AsyncStorage su Android ha un limite di
// ~2 MB per voce: le liste dei clienti lo superano). Sul web (solo confronti) non fa nulla: vedi .web.ts.
import { File, Paths } from 'expo-file-system';
import type { QueryClient, QueryCacheNotifyEvent } from '@tanstack/react-query';
import { AppState, InteractionManager } from 'react-native';

const TTL_MS = 24 * 60 * 60 * 1000;
// stessa versione dell'originale: si alza quando le queryFn cambiano e i dati salvati non vanno più bene
const CACHE_VERSION = 4;
const DEBOUNCE_MS = 4000;

const NON_PERSISTED_KEYS = new Set(['notifications']);
const isPersistable = (queryKey: readonly unknown[]) => !NON_PERSISTED_KEYS.has(queryKey[0] as string);

type Saved = { queryKey: readonly unknown[]; data: unknown; savedAt: number };

// Voci salvate per chiave (JSON della queryKey → voce già serializzata). Una query tolta dalla memoria
// (gcTime 30 min senza pagine che la usano) resta nel file fino alla scadenza delle 24 ore: altrimenti
// senza rete mancherebbero proprio le pagine non aperte di recente.
const saved = new Map<string, { savedAt: number; json: string }>();

let file: File | null = null;
function cacheFile() {
  return (file ??= new File(Paths.document, 'vibra-query-cache.json'));
}

/**
 * IndexedDB salva con lo structured clone (Date, Map, Set restano tali); il JSON no. Una query con dati
 * che non sono JSON puro (Date, Map, Set, istanze di classi) non si salva: ripristinata avrebbe un tipo
 * diverso da quello che la pagina si aspetta.
 */
function toJson(value: unknown): string | null {
  let plain = true;
  const s = JSON.stringify(value, function (this: Record<string, unknown>, key, v) {
    const raw = key === '' ? value : this[key];
    if (raw !== null && typeof raw === 'object') {
      const proto = Object.getPrototypeOf(raw);
      if (proto !== Object.prototype && proto !== Array.prototype && proto !== null) plain = false;
    } else if (typeof raw === 'function' || typeof raw === 'bigint') plain = false;
    return plain ? v : undefined;
  });
  return plain && s !== undefined ? s : null;
}

/** Rimette la cache salvata nel QueryClient. Da chiamare prima del primo render; true se ha trovato dati. */
export async function restoreCache(queryClient: QueryClient): Promise<boolean> {
  try {
    const f = cacheFile();
    if (!f.exists) return false;
    const cached = JSON.parse(await f.text()) as { version?: number; queries?: Saved[] };
    if (cached.version !== CACHE_VERSION || !Array.isArray(cached.queries)) {
      f.delete();
      return false;
    }
    const now = Date.now();
    let restored = 0;
    for (const entry of cached.queries) {
      const { queryKey, data, savedAt } = entry;
      if (now - savedAt > TTL_MS || data === undefined || !isPersistable(queryKey)) continue;
      saved.set(JSON.stringify(queryKey), { savedAt, json: JSON.stringify(entry) });
      queryClient.setQueryData(queryKey, data, { updatedAt: savedAt });
      restored++;
    }
    return restored > 0;
  } catch {
    return false;
  }
}

let unsubscribe: (() => void) | null = null;

/** Salva la cache quando cambiano i dati. Da chiamare dopo il ripristino; restituisce la pulizia. */
export function persistCache(queryClient: QueryClient): () => void {
  if (unsubscribe) return unsubscribe;
  let dirty = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let idle: { cancel: () => void } | null = null;

  const writeNow = () => {
    if (timer) { clearTimeout(timer); timer = null; }
    if (idle) { idle.cancel(); idle = null; }
    if (!dirty) return;
    dirty = false;
    for (const q of queryClient.getQueryCache().getAll()) {
      if (q.state.data === undefined || !isPersistable(q.queryKey)) continue;
      const key = toJson(q.queryKey);
      if (key == null) continue;
      const savedAt = q.state.dataUpdatedAt || Date.now();
      // dati non cambiati dall'ultima scrittura: la voce serializzata resta quella
      if (saved.get(key)?.savedAt === savedAt) continue;
      const data = toJson(q.state.data);
      if (data == null) continue;
      saved.set(key, { savedAt, json: `{"queryKey":${key},"data":${data},"savedAt":${savedAt}}` });
    }
    const now = Date.now();
    const parts: string[] = [];
    for (const [key, v] of saved) {
      if (now - v.savedAt > TTL_MS) saved.delete(key);
      else parts.push(v.json);
    }
    try {
      const f = cacheFile();
      if (!f.exists) f.create();
      f.write(`{"version":${CACHE_VERSION},"savedAt":${Date.now()},"queries":[${parts.join(',')}]}`);
    } catch { /* spazio pieno o file non scrivibile: si riparte dalla rete */ }
  };

  const isDataChange = (event: QueryCacheNotifyEvent) =>
    event.type === 'removed' || (event.type === 'updated' && event.action.type === 'success');

  const off = queryClient.getQueryCache().subscribe((event) => {
    if (!isDataChange(event)) return;
    dirty = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      // a fine animazioni e tocchi in corso (come requestIdleCallback dell'originale)
      idle?.cancel();
      idle = InteractionManager.runAfterInteractions(() => { idle = null; writeNow(); });
    }, DEBOUNCE_MS);
  });
  // uscita dall'app (pagehide/visibilitychange dell'originale): il processo può essere chiuso dopo
  const app = AppState.addEventListener('change', (s) => { if (s === 'background') writeNow(); });

  unsubscribe = () => {
    off();
    app.remove();
    if (timer) clearTimeout(timer);
    idle?.cancel();
    unsubscribe = null;
  };
  return unsubscribe;
}

/** Toglie la cache salvata (uscita dall'account). */
export function clearPersistedCache() {
  saved.clear();
  try { const f = cacheFile(); if (f.exists) f.delete(); } catch { /* niente da togliere */ }
}
