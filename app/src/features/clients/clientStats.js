// Copiato da src/pages/Clienti.jsx (Base44), useMemo `clientStatsMap`:
// statistiche per cliente dai valori cum_* precalcolati, sovrascritte "live"
// dalle presenze reali e con rating ricalcolato.
import { buildClientStatsMap } from '../../legacy/utils/clientPrecomputed';
import { computeClientRanking } from '../../legacy/utils/clientRanking';

/** @returns {Record<string, any>} */
export function computeClientStatsMap(clients, attendances, events) {
  const map = buildClientStatsMap(clients);
  const eventsById = Object.fromEntries(events.map((e) => [e.id, e]));

  if (attendances.length > 0) {
    const attByClient = {};
    for (const a of attendances) {
      if (!a.client_id) continue;
      (attByClient[a.client_id] ||= []).push(a);
    }
    for (const id of Object.keys(map)) {
      const atts = attByClient[id];
      if (!atts) continue;
      let visits = 0, totalSpent = 0, fri = 0, sat = 0, sun = 0, extra = 0;
      for (const a of atts) {
        visits++;
        const ev = eventsById[a.event_id];
        if (!ev) continue;
        totalSpent += a.revenue || 0;
        if (ev.is_extra) { extra++; continue; }
        if (!ev.date) continue;
        const [y, m, d] = ev.date.split('-').map(Number);
        const dow = new Date(y, m - 1, d).getDay();
        if (dow === 5) fri++;
        else if (dow === 6) sat++;
        else if (dow === 0) sun++;
      }
      map[id] = {
        ...map[id],
        visits,
        totalSpent: Math.round(totalSpent),
        avgSpent: visits > 0 ? Math.round(totalSpent / visits) : 0,
        fri, sat, sun, extra,
        attendances: atts,
      };
    }
  }

  const clientsById = Object.fromEntries(clients.map((c) => [c.id, c]));
  for (const id of Object.keys(map)) {
    const client = clientsById[id];
    if (!client) continue;
    const stats = map[id];
    if (stats.attendances && stats.attendances.length > 0) {
      map[id].rating = computeClientRanking(client, stats, events, eventsById);
    } else {
      map[id].rating = stats.visits > 0 ? (client.cum_rating || 0) : null;
    }
  }
  return map;
}

export const EMPTY_STATS = {
  visits: 0, fri: 0, sat: 0, sun: 0, extra: 0, totalSpent: 0, avgSpent: 0, attendances: [], rating: null,
};

/** Ordinamenti della lista clienti (stessi di Clienti.jsx). */
export const SORTS = {
  visits: (a, b, s) => s(b.id).visits - s(a.id).visits,
  rating: (a, b, s) => (s(b.id).rating || 0) - (s(a.id).rating || 0),
  spent: (a, b, s) => s(b.id).totalSpent - s(a.id).totalSpent,
  newpeople: (a, b) => (b.new_people_brought || 0) - (a.new_people_brought || 0),
  alpha: (a, b) => (a.name || '').localeCompare(b.name || ''),
};
