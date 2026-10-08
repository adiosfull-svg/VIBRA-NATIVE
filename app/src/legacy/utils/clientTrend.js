/**
 * Calcola il trend presenze di un cliente.
 *
 * Confronta la frequenza relativa (presenze_cliente / serate_totali)
 * delle ultime 2 settimane con le 2 settimane precedenti.
 *
 * Ritorna: 'up' | 'stable' | 'down' | null (se dati insufficienti)
 */

export function computeClientTrend(clientId, attendances, events) {
  if (!clientId || !attendances?.length || !events?.length) return null;

  const eventsById = Object.fromEntries(events.map(e => [e.id, e]));

  const now = new Date();
  const msPerDay = 86400000;
  const msPerWeek = 7 * msPerDay;

  const recentStart = new Date(now - 2 * msPerWeek);  // ultime 2 sett
  const prevStart   = new Date(now - 4 * msPerWeek);  // 2 sett precedenti

  // Conta serate totali in ogni finestra
  let totalEventsRecent = 0;
  let totalEventsPrev = 0;

  events.forEach(ev => {
    if (!ev.date) return;
    const d = new Date(ev.date);
    if (d >= recentStart && d <= now) totalEventsRecent++;
    else if (d >= prevStart && d < recentStart) totalEventsPrev++;
  });

  // Conta presenze del cliente in ogni finestra
  let clientPresencesRecent = 0;
  let clientPresencesPrev = 0;

  attendances.forEach(a => {
    if (a.client_id !== clientId) return;
    const ev = eventsById[a.event_id];
    if (!ev?.date) return;
    const d = new Date(ev.date);
    if (d >= recentStart && d <= now) clientPresencesRecent++;
    else if (d >= prevStart && d < recentStart) clientPresencesPrev++;
  });

  // Dati insufficienti: nessuna serata in entrambe le finestre
  if (totalEventsRecent === 0 && totalEventsPrev === 0) return null;
  // Nessuna presenza in nessuna finestra
  if (clientPresencesRecent === 0 && clientPresencesPrev === 0) return null;

  // Frequenza relativa (0..1), gestisce il caso in cui non ci siano serate
  const freqRecent = totalEventsRecent > 0 ? clientPresencesRecent / totalEventsRecent : 0;
  const freqPrev   = totalEventsPrev   > 0 ? clientPresencesPrev   / totalEventsPrev   : 0;

  const diff = freqRecent - freqPrev;
  const threshold = 0.1; // soglia minima per considerare un cambiamento significativo

  if (diff > threshold)  return 'up';
  if (diff < -threshold) return 'down';
  return 'stable';
}