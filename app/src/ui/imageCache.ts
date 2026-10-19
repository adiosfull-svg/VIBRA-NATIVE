// Cache delle immagini (docs/REGOLE-PRESTAZIONI.md §6).
//
// expo-image di default usa solo la cache su DISCO: ogni volta che un'immagine si rimonta (cambio tab,
// riga di una lista virtualizzata che rientra, pannello che si apre) va riletta e decodificata dal
// disco e per un frame resta vuota = il "flash". Con 'memory-disk' la bitmap già decodificata resta in
// memoria e ricompare nello stesso frame. TUTTE le <Image> dell'app passano da qui.
import { Image } from 'expo-image';

export const IMAGE_CACHE = 'memory-disk' as const;

/** Props comuni a ogni <Image> di expo-image dell'app: cache in memoria, niente dissolvenza. */
export const IMAGE_DEFAULTS = { cachePolicy: IMAGE_CACHE, transition: 0 } as const;

const requested = new Set<string>();
/** URL già caricate in questa sessione (quindi decodificate nella cache in memoria). */
const warm = new Set<string>();

/** L'immagine è già stata caricata in questa sessione: si può mostrare senza dissolvenza. */
export function isImageWarm(url?: string | null): boolean {
  return !!url && warm.has(url);
}
export function markImageWarm(url?: string | null) {
  if (url) warm.add(url);
}

/**
 * Scarica e decodifica in anticipo (memoria + disco) le immagini che verranno mostrate a breve:
 * loghi all'avvio, foto della pagina che si sta per aprire, prime righe di una lista.
 * Le stesse URL non vengono richieste due volte.
 */
export function prefetchImages(urls: (string | null | undefined)[]): Promise<boolean> {
  const todo = urls.filter((u): u is string => !!u && /^https?:/.test(u) && !requested.has(u));
  if (!todo.length) return Promise.resolve(true);
  todo.forEach((u) => requested.add(u));
  return Image.prefetch(todo, IMAGE_CACHE).then((ok) => {
    if (ok) todo.forEach((u) => warm.add(u));
    return ok;
  }).catch(() => {
    todo.forEach((u) => requested.delete(u));
    return false;
  });
}

// ── precaricamento in coda (foto di clienti, semine, promoter, loghi: centinaia di URL) ─────────────
// Come preloadImages dell'originale (utils/imageCache.js): concorrenza limitata (4) per non competere con
// i dati e le immagini a schermo, priorità per le foto "calde", e un tetto alla cache in memoria (150
// immagini, poi solo disco): oltre, ogni nuova foto spingerebbe fuori dalla memoria quelle già mostrate.
const QUEUE_CONCURRENCY = 4;
const MEMORY_BUDGET = 150;
let memoryPrefetched = 0;
let active = 0;
const queue: string[] = [];

function pump() {
  while (active < QUEUE_CONCURRENCY && queue.length) {
    const url = queue.shift()!;
    const policy = memoryPrefetched < MEMORY_BUDGET ? IMAGE_CACHE : 'disk';
    if (policy === IMAGE_CACHE) memoryPrefetched++;
    active++;
    Image.prefetch([url], policy)
      .then((ok) => { if (ok && policy === IMAGE_CACHE) warm.add(url); if (!ok) requested.delete(url); })
      .catch(() => { requested.delete(url); })
      .finally(() => { active--; pump(); });
  }
}

/** Mette in coda il precaricamento (non blocca: ritorna subito). `priority`: davanti alla coda. */
export function queueImagePrefetch(urls: (string | null | undefined)[], { priority = false } = {}) {
  const todo = urls.filter((u): u is string => !!u && /^https?:/.test(u) && !requested.has(u));
  if (!todo.length) return;
  todo.forEach((u) => requested.add(u));
  if (priority) queue.unshift(...todo); else queue.push(...todo);
  pump();
}
