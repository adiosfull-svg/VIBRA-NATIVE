/**
 * Esegue un'operazione bulk (bulkUpdate/bulkCreate) suddividendo l'array
 * in chunk da max 400 elementi, per rispettare il limite di 500 item per
 * chiamata del backend Base44. Restituisce tutti i risultati concatenati.
 *
 * Resilienza: se un chunk fallisce (es. "Entity X with ID ... not found"
 * perché un record è stato eliminato tra la lettura e l'update), riprova
 * record per record saltando quelli non più esistenti, così un singolo
 * record mancante non fa fallire l'intero batch.
 *
 * @param {Function} bulkFn - base44.entities.X.bulkUpdate o bulkCreate
 * @param {Array} items - array di oggetti da passare alla funzione bulk
 * @returns {Promise<Array>} - risultati concatenati di tutti i chunk
 */
export async function chunkedBulk(bulkFn, items, chunkSize = 400) {
  if (!items || items.length === 0) return [];
  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    try {
      const res = await bulkFn(chunk);
      if (Array.isArray(res)) results.push(...res);
    } catch (err) {
      // Chunk fallito (spesso "not found" su record eliminati nel frattempo):
      // riprova record per record, saltando quelli che non esistono più.
      for (const item of chunk) {
        try {
          const res = await bulkFn([item]);
          if (Array.isArray(res)) results.push(...res);
        } catch (e) {
          // ignora record non trovati, propaga altri errori
          const msg = e?.message || '';
          if (!/not found/i.test(msg)) throw e;
        }
      }
    }
  }
  return results;
}