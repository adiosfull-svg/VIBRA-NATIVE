// Port di src/lib/igMessages.js (convertito da scripts/port/codemod.mjs).
import { base44 } from '@/lib/base44';

/**
 * Carica TUTTI i DM Instagram (nessun tetto di 5000 righe) e scarta le copie duplicate.
 *
 * Perché: una versione difettosa del sync ha reinserito più volte gli stessi messaggi.
 * Con il vecchio limite fisso di 5000 righe le copie riempivano il limite e le chat più
 * vecchie sparivano dalla sezione Messaggi. Qui:
 *  - si pagina fino in fondo (pagine da 5000, il massimo per richiesta);
 *  - si tiene UNA sola copia per messaggio (stessa conversazione, orario, direzione e testo),
 *    sempre la più vecchia, così le azioni (letto, fissato) agiscono su un record stabile.
 * Nessun record viene cancellato dal database.
 */
const PAGE = 5000;
// Tetto di sicurezza: il DB dovrebbe contenere poche migliaia di messaggi (Instagram
// restituisce al massimo 20 messaggi per chat). Il tetto evita che una tabella gonfiata
// da record anomali faccia esaurire il limite di lettura dell'app o blocchi la pagina.
const MAX_ROWS = 20000;

const msgKey = (m) => `${m.conversation_id}|${m.message_timestamp}|${m.is_outgoing ? 1 : 0}|${m.message_text || ''}`;

export function dedupeIgMessages(rows) {
  const sorted = [...rows].sort((a, b) => new Date(a.created_date || 0) - new Date(b.created_date || 0));
  const seen = new Set();
  const unique = [];
  for (const m of sorted) {
    const k = msgKey(m);
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(m);
  }
  // Ordine atteso dall'app: più recenti prima
  return unique.sort((a, b) => new Date(b.message_timestamp) - new Date(a.message_timestamp));
}

export async function fetchIgMessages({ isAdmin, promoterId }) {
  const query = (isAdmin && !promoterId) ? {} : { promoter_id: promoterId };
  const rows = [];
  let cursor = null;
  // Paginazione a cursore: stabile anche quando molte righe condividono lo stesso
  // created_date (con lo skip qualche messaggio veniva saltato ad ogni pagina).
  // Le pagine arrivano dal più recente: le chat attive ci sono sempre.
  while (rows.length < MAX_ROWS) {
    const opts = { sort: '-created_date', limit: PAGE };
    if (cursor) opts.cursor = cursor;
    const page = await base44.entities.InstagramMessage.filter(query, opts);
    const items = page?.items || [];
    rows.push(...items);
    if (!page?.has_more || !page?.next_cursor) break;
    cursor = page.next_cursor;
  }
  return dedupeIgMessages(rows);
}