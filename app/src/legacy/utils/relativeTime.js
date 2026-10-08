/**
 * Formatter condiviso "tempo fa" per last_contacted_at (ultimo contatto cliente).
 * Variante ricca: minuti / ore / giorni / settimane / mesi.
 *
 * Usato da RecontactList, ClientsToRecontactDialog e Programmazione (enriched).
 * NB: ClientStatsBar usa una variante più grezza (Oggi/Ieri/sett.) volutamente
 * diversa per la sua UI compatta — non usare questa qui.
 *
 * @param {string} isoString - ISO date string
 * @returns {string|null}
 */
export function formatContactTime(isoString) {
  if (!isoString) return null;
  const then = new Date(isoString);
  const now = new Date();
  const diffMs = now - then;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) return diffMin <= 1 ? 'Poco fa' : `${diffMin}min fa`;
  const diffHrs = Math.round(diffMs / 3600000);
  if (diffHrs < 24) return `${diffHrs}h fa`;
  const diffDays = Math.round(diffMs / 86400000);
  if (diffDays === 1) return 'Ieri';
  if (diffDays < 7) return `${diffDays}gg fa`;
  if (diffDays < 30) return `${Math.round(diffDays / 7)} sett. fa`;
  return `${Math.round(diffDays / 30)} mesi fa`;
}

/**
 * Colore urgenza (classi tailwind) in base ai giorni dall'ultima presenza.
 * Usato da RecontactList e ClientsToRecontactDialog.
 */
export function urgencyColor(days) {
  if (days <= 7) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
  if (days >= 90) return 'text-red-400 bg-red-400/10 border-red-400/30';
  if (days >= 60) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
  if (days >= 30) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
  return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
}

/**
 * Etichetta compatta "giorni fa" per l'ultima presenza.
 * Usato da RecontactList e ClientsToRecontactDialog.
 * NB: ClientFUTCard usa una variante piu' compatta (label card) — non usare questa.
 */
export function formatDaysAgo(days) {
  if (days <= 7) return 'Ultimo weekend';
  if (days >= 60) return `${Math.round(days / 30)} mesi fa`;
  if (days >= 14) return `${Math.round(days / 7)} sett. fa`;
  return `${days}gg fa`;
}