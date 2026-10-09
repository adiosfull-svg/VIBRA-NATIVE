// Port di src/lib/safeData.js (convertito da scripts/port/codemod.mjs).
/**
 * Modulo condiviso per il data-fetching sicuro: previene il troncamento dei dati
 * in tutta l'app. Tre strategie:
 *
 * 1. fetchByPromoter — filtra lato server per promoter_id. Usata da tutti i popup
 *    e le viste del singolo promoter. Scarica solo i record del promoter corrente.
 *
 * 2. fetchAll — paginazione automatica via cursor fino a has_more=false. Usata
 *    quando serve il dataset completo record-by-record (audit log, report, search).
 *
 * 3. fetchAggregate — calcoli lato server (somme, classifiche, raggruppamenti).
 *    Usata per ranking cross-promoter (VibraVS, Dashboard): il server calcola,
 *    invia solo i risultati finali, nessun limite di record.
 *
 * checkTruncation — utility che logga un warning in console quando rileva una
 * query troncata (has_more=true con limite fisso). Rileva il problema subito,
 * non mesi dopo.
 */
import { base44 } from '@/lib/base44';

/**
 * Logga un warning se il risultato di una query è troncato (has_more=true).
 * Da chiamare su ogni pagina restituita da filter/list quando si usa un limite fisso.
 * @param {object} page - risultato {items, next_cursor, has_more}
 * @param {string} entityName - nome dell'entità per il log
 * @param {object} [query] - query filtrante (per debug)
 */
export function checkTruncation(page, entityName, query) {
  if (page?.has_more) {
    console.warn(
      `[safeData] TRUNCATION DETECTED — ${entityName} has_more=true. ` +
      `Dati incompleti: la query ha restituito più record del limite. ` +
      `Usa fetchAll() o fetchByPromoter() per il dataset completo. ` +
      `Query:`, query || {}
    );
  }
  return page;
}

/**
 * Scarica TUTTI i record di un'entità che corrispondono a una query,
 * paginando automaticamente via cursor fino a has_more=false.
 *
 * @param {object} entity - base44.entities.<EntityName>
 * @param {object} [query={}] - filtro MongoDB (es. {status: 'active'})
 * @param {object} [options] - {sort, limit, fields}
 * @returns {Promise<Array>} - array piatto di tutti i record
 */
// Quante righe ha dato l'ultima scansione completa di ciascuna entità (per scegliere quante
// pagine lanciare in parallelo la volta dopo).
const _lastFullCount = new WeakMap();

export async function fetchAll(entity, query = {}, options = {}) {
  const { sort, fields } = options;
  const limit = options.limit === undefined ? 1000 : options.limit;

  // ── Fast path: TABELLA INTERA senza filtri ──
  // La paginazione a cursore da 1000 è SEQUENZIALE (ogni pagina aspetta la precedente): 5400
  // presenze = 6 richieste in fila (≈6 round-trip), 3000 clienti = 3. Con list(sort, 5000, skip)
  // (API documentata, max 5000/richiesta) le prime pagine partono in PARALLELO: tabella ≤5000 righe
  // = 1 round-trip, ≤10000 = 1 round-trip (2 pagine insieme). Se qualcosa non va (API diversa,
  // errore di rete) si ripiega sul percorso a cursore qui sotto, invariato.
  if (options.limit === undefined && !fields && sort && typeof entity?.list === 'function'
      && (!query || Object.keys(query).length === 0)) {
    try {
      const last = _lastFullCount.get(entity);
      const rows = await listAllCapped(entity, sort, { parallelPages: last !== undefined && last <= 5000 ? 1 : 2 });
      // Se list() non restituisce record veri (es. oggetti-pagina), non fidarsi: usa il cursore.
      if (!rows.every(r => r && typeof r === 'object' && r.id !== undefined)) throw new Error('forma inattesa');
      _lastFullCount.set(entity, rows.length);
      return rows;
    } catch {
      /* fallback al cursore */
    }
  }

  let allItems = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const pageOpts = { sort, limit };
    if (cursor) pageOpts.cursor = cursor;
    if (fields) pageOpts.fields = fields;

    const page = await entity.filter(query, pageOpts);
    allItems = allItems.concat(page.items || []);
    hasMore = page.has_more;
    cursor = page.next_cursor;
    if (!cursor) break;
  }

  return allItems;
}

/**
 * Come entity.list(sort, 5000) ma SENZA troncamento: il massimo accettato da
 * Base44 è 5.000 record per richiesta (limit più alti vengono ignorati in
 * silenzio), quindi oltre quella soglia i dati risultavano incompleti.
 *
 * Velocità: le prime `parallelPages` pagine partono IN PARALLELO (skip 0, 5000,
 * ...), quindi con una tabella fino a parallelPages×5000 righe la latenza è quella
 * di una sola richiesta, come prima. Se l'ultima pagina è piena si prosegue in
 * sequenza finché non arriva una pagina incompleta. Dedup per id (le pagine
 * basate su skip possono sovrapporsi se si scrive durante il caricamento).
 *
 * @param {object} entity - base44.entities.<EntityName>
 * @param {string} sort - es. '-created_date'
 * @param {object} [opts] - { parallelPages = 2 }
 * @returns {Promise<Array>}
 */
export async function listAllCapped(entity, sort, { parallelPages = 2 } = {}) {
  const CAP = 5000;
  const pages = await Promise.all(
    Array.from({ length: parallelPages }, (_, i) => entity.list(sort, CAP, i * CAP))
  );
  let all = pages.flat();
  let last = pages[pages.length - 1];
  let skip = parallelPages * CAP;
  while (Array.isArray(last) && last.length === CAP) {
    last = await entity.list(sort, CAP, skip);
    all = all.concat(last);
    skip += CAP;
  }
  const seen = new Set();
  return all.filter(r => {
    if (!r || r.id == null) return true;
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

/**
 * Scarica TUTTI i record di un'entità per uno specifico promoter.
 * Filtra lato server per promoter_id, poi pagina via cursor.
 *
 * @param {object} entity - base44.entities.<EntityName>
 * @param {string} promoterId - ID del promoter
 * @param {object} [options] - {sort, limit, fields, extraQuery}
 * @returns {Promise<Array>} - array piatto dei record del promoter
 */
export async function fetchByPromoter(entity, promoterId, options = {}) {
  const { sort, limit = 1000, fields, extraQuery = {} } = options;
  const query = { promoter_id: promoterId, ...extraQuery };

  let allItems = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const pageOpts = { sort, limit };
    if (cursor) pageOpts.cursor = cursor;
    if (fields) pageOpts.fields = fields;

    const page = await entity.filter(query, pageOpts);
    allItems = allItems.concat(page.items || []);
    hasMore = page.has_more;
    cursor = page.next_cursor;
    if (!cursor) break;
  }

  return allItems;
}

/**
 * Esegue un'aggregazione lato server (somme, classifiche, raggruppamenti).
 * Il server calcola e invia solo i risultati finali — nessun limite di record,
 * nessun troncamento possibile.
 *
 * @param {object} entity - base44.entities.<EntityName>
 * @param {object} [query={}] - filtro MongoDB
 * @param {object} aggConfig - {groupBy, sum, avg, min, max, dateBucket, countDistinct, sort, limit}
 * @returns {Promise<object>} - {rows: [...], truncated}
 */
export async function fetchAggregate(entity, query = {}, aggConfig = {}) {
  const opts = { query, ...aggConfig };
  return await entity.aggregate(opts);
}

/**
 * Presenze di un TEAM di promoter: una richiesta per membro, tutte IN PARALLELO, ciascuna
 * riutilizzando/alimentando la cache ['attendances', id] (stessa chiave e stesso fetcher di
 * "I miei progressi"/"Guadagni dettagliati": le presenze del promoter sono già precaricate).
 * Sostituisce la scansione dell'INTERA tabella presenze (5000+ righe a pagine da 1000 in fila)
 * quando servono solo i membri del team. Restituisce un array piatto.
 */
export const teamAttendancesKey = (ids) => ['team-attendances', [...ids].sort().join(',')];

export async function fetchTeamAttendances(queryClient, entity, ids) {
  const lists = await Promise.all(ids.map(id =>
    queryClient.ensureQueryData({
      queryKey: ['attendances', id],
      queryFn: () => fetchByPromoter(entity, id, { sort: '-created_date' }),
      staleTime: 15 * 60000,
    })
  ));
  return lists.flat();
}