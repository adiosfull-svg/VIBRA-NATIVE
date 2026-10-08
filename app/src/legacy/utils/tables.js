/**
 * Deduplica le presenze per (event_id, promoter_id, client_id) mantenendo
 * il record con il fatturato più alto. Risolve la discrepanza tra il conteggio
 * serate (basato su Event.length) e il conteggio presenze promoter (che include
 * duplicati). I dati erano stati corretti nel DB il 20/05/2026, ma duplicati
 * residui continuano a causare mismatch nei conteggi.
 */
export function filterCleanAttendances(attendances) {
  const map = new Map();
  for (const a of attendances) {
    const key = `${a.event_id}|${a.promoter_id || ''}|${a.client_id || ''}`;
    const prev = map.get(key);
    if (!prev || (a.revenue || 0) > (prev.revenue || 0)) {
      map.set(key, a);
    }
  }
  return [...map.values()];
}

/**
 * Calcola la media ponderata delle soglie tavolo di tutti gli eventi che hanno
 * una soglia impostata. Usata come fallback per gli eventi senza table_threshold
 * (invece di un fisso 300) così il totale cumulativo dei tavoli riflette la
 * distribuzione reale delle soglie (240, 300, 360, 120...).
 */
export function computeAvgThreshold(events) {
  let sum = 0, count = 0;
  for (const ev of events) {
    if (ev.table_threshold != null && ev.table_threshold > 0) {
      sum += ev.table_threshold;
      count++;
    }
  }
  return count > 0 ? sum / count : 300;
}

/**
 * Calcola i tavoli prodotti in base al fatturato e alla soglia dell'evento.
 * La soglia è SEMPRE quella salvata sull'evento (table_threshold).
 * Se l'evento non ha soglia (null), usa fallbackThreshold (default: media di
 * tutte le soglie, passata dal chiamante; 300 come ultimo ripiego).
 */
export function calcTables(revenue, dow, customThreshold, fallbackThreshold = 300) {
  if (!revenue || revenue <= 0) return 0;
  const threshold = customThreshold ?? fallbackThreshold;
  return Math.round((revenue / threshold) * 10) / 10;
}

/**
 * Calcola i tavoli da una lista di attendance + events per un promoter
 */
export function calcPromoterTables(attendances, events, fallbackThreshold) {
  const avg = fallbackThreshold ?? computeAvgThreshold(events);
  return attendances.reduce((sum, a) => {
    const ev = events.find(e => e.id === a.event_id);
    if (!ev?.date) return sum;
    return sum + calcTables(a.revenue || 0, null, ev.table_threshold, avg);
  }, 0);
}