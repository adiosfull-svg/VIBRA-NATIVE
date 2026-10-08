/**
 * Helper data/ora condivisi tra sezioni (Locali, Promoter, Il Mio Vibra,
 * RicercaAI, Notifiche, Impostazioni). Riduce duplicazione e garantisce
 * comportamento coerente (es. parse UTC null-safe).
 */

/** Giorno della settimana (0=Dom..6=Sab) da stringa 'YYYY-MM-DD'. -1 se assente. */
export function getDow(dateStr) {
  if (!dateStr) return -1;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

/** getDow applicato a un evento/serata (oggetto con .date). Null-safe. */
export function getEventDow(ev) {
  return getDow(ev?.date);
}

/**
 * Parse di timestamp UTC salvato senza 'Z' -> Date.
 * Null-safe (short-circuit `d &&`): non crasha su valori null/undefined,
 * a differenza della vecchia copia in Notifiche.jsx che faceva d.endsWith('Z').
 */
export const parseUTC = (d) => new Date(d && !d.endsWith('Z') ? d + 'Z' : d);

/** Converte una data UTC in ora di Roma per la visualizzazione formattata. */
export const toRome = (d) => {
  const date = parseUTC(d);
  const romeStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Rome',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(date);
  return new Date(romeStr.replace(' ', 'T'));
};

// ─────────────────────────────────────────────────────────────────────────────
// Confronti di date SENZA parseISO/isWithinInterval (usati dove si scorrono migliaia di
// presenze/eventi per mese: prima si facevano mesi × righe parse di date per ogni render).
// Per date-giorno 'YYYY-MM-DD' reali il confronto fra stringhe dà lo stesso risultato di
// isWithinInterval(parseISO(d), {start: inizioMese, end: fineMese}); per qualsiasi altro formato
// (o data inesistente come 2024-02-31) validDayKey restituisce null e il chiamante usa il percorso
// lento originale.
// ─────────────────────────────────────────────────────────────────────────────
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 'YYYY-MM-DD' se è un giorno di calendario reale, altrimenti null. */
export function validDayKey(dateStr) {
  if (typeof dateStr !== 'string' || dateStr.length !== 10 || !DAY_RE.test(dateStr)) return null;
  const y = +dateStr.slice(0, 4), m = +dateStr.slice(5, 7), d = +dateStr.slice(8, 10);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? dateStr : null;
}

/** Data (ora locale) → 'YYYY-MM-DD'. */
export function localDayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Restituisce una funzione (dayKey 'YYYY-MM-DD') → boolean equivalente a
 * isWithinInterval(<giorno a mezzanotte locale>, { start: fromDate, end: toDate }) di date-fns v3,
 * INCLUSO il caso a intervallo invertito (da > a): date-fns allora normalizza i due estremi, e poiché
 * `toDate` è a fine giornata il suo giorno resta fuori mentre il giorno di `fromDate` (00:00) è dentro.
 */
export function makeDayRangeCheck(fromDate, toDate) {
  const fromKey = localDayKey(fromDate);
  const toKey = localDayKey(toDate);
  if (+fromDate <= +toDate) return (k) => k >= fromKey && k <= toKey;
  return (k) => k > toKey && k <= fromKey;
}