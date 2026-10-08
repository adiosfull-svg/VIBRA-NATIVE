/**
 * Helper frontend che costruisce le strutture dati usate dai componenti UI
 * (clientStatsMap, enriched, clientBadges) direttamente dai campi pre-calcolati
 * cum_* sul record Client, SENZA dover scaricare e processare tutte le presenze.
 *
 * Sostituisce la logica pesante che prima faceva il browser:
 * - clientStatsMap (raggruppamento presenze per cliente)
 * - enriched (ranking, trend, giorni da ultima presenza, etc.)
 * - clientBadges (medaglie classifica)
 *
 * Tutti i calcoli qui sono O(1) per cliente: leggono campi già pronti.
 */

import { differenceInDays, parseISO } from 'date-fns';
import { formatContactTime } from './relativeTime';
import { rankingColor } from './clientRanking';

const FALLBACK_STATS = { visits: 0, fri: 0, sat: 0, sun: 0, extra: 0, totalSpent: 0, avgSpent: 0, attendances: [] };

/**
 * Costruisce la mappa { [clientId]: stats } dai campi pre-calcolati.
 * Compatibile con la vecchia clientStatsMap calcolata dalle presenze.
 * `attendances` è vuoto (non più necessario per le liste; il detail dialog
 * carica le presenze separatamente se serve).
 */
export function buildClientStatsMap(clients) {
  const map = {};
  for (const c of clients) {
    map[c.id] = {
      visits: c.cum_visits || 0,
      fri: c.cum_fri || 0,
      sat: c.cum_sat || 0,
      sun: c.cum_sun || 0,
      extra: c.cum_extra || 0,
      totalSpent: c.cum_total_spent || 0,
      avgSpent: c.cum_avg_spent || 0,
      lastRevenue: c.cum_last_revenue || 0,
      lastEventVenue: c.cum_last_event_venue || null,
      lastDateStr: c.cum_last_attendance_date || '',
      attendances: [],
    };
  }
  return map;
}

export function getClientStatsFromMap(map, id) {
  return map[id] ?? FALLBACK_STATS;
}

/**
 * Costruisce l'array "enriched" usato da Programmazione (boards, growth league)
 * direttamente dai campi pre-calcolati. Zero calcoli pesanti, tutto O(1) per cliente.
 */
export function buildEnrichedClients(clients) {
  const today = new Date();
  return clients.map(c => {
    const visits = c.cum_visits || 0;
    const totalSpent = c.cum_total_spent || 0;
    const avgSpent = c.cum_avg_spent || 0;
    const ranking = visits > 0 ? (c.cum_rating || 0) : null;

    const lastDateStr = c.cum_last_attendance_date || '';
    const daysAgo = lastDateStr ? differenceInDays(today, parseISO(lastDateStr)) : null;
    const firstAttDateStr = c.cum_first_attendance_date || '';
    const firstAttDaysAgo = firstAttDateStr ? differenceInDays(today, parseISO(firstAttDateStr)) : null;

    const trendStatus = c.cum_trend_status || null;
    const pctChange = c.cum_trend_pct ?? null;

    const initials = c.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const contactLabel = c.last_contacted_at ? formatContactTime(c.last_contacted_at) : null;
    const daysSinceContacted = c.last_contacted_at ? differenceInDays(today, new Date(c.last_contacted_at)) : null;
    const contactStale = daysSinceContacted !== null && daysSinceContacted > 8;

    return {
      client: c,
      stats: {
        visits,
        fri: c.cum_fri || 0,
        sat: c.cum_sat || 0,
        sun: c.cum_sun || 0,
        extra: c.cum_extra || 0,
        totalSpent,
        avgSpent,
        attendances: [],
      },
      ranking,
      firstAttDateStr,
      firstAttDaysAgo,
      initials,
      daysAgo,
      trendFull: { status: trendStatus, pctChange, daysAgo },
      pctChange,
      newPeople: c.new_people_brought || 0,
      visits,
      totalSpent,
      avgSpent,
      attendanceRate: c.cum_attendance_rate || null,
      monthTrend: c.cum_month_trend ?? null,
      cicloMedio: c.cum_ciclo_medio || null,
      badges: c.cum_badges || [],
      contactLabel,
      contactStale,
    };
  });
}

/**
 * Costruisce la mappa badges { [clientId]: string[] } dai campi pre-calcolati.
 */
export function buildClientBadgesMap(clients) {
  const map = {};
  for (const c of clients) {
    if (c.cum_badges && c.cum_badges.length > 0) {
      map[c.id] = c.cum_badges;
    }
  }
  return map;
}

/**
 * Costruisce i dati per i grafici di ClientiAnalytics dai campi pre-calcolati.
 * venueCounts, visits, totalSpent, avgSpent sono già pronti sul record Client.
 *
 * @param {Array} clients - clienti del promoter
 * @param {string} metric - 'totalSpent' | 'avgSpent' | 'visits'
 * @returns array ordinato per metric decrescente
 */
export function buildAnalyticsClientStats(clients, metric = 'totalSpent') {
  return clients.map(c => ({
    name: c.name,
    photo_url: c.photo_url,
    visits: c.cum_visits || 0,
    venueCounts: c.cum_venue_counts || {},
    totalSpent: c.cum_total_spent || 0,
    avgSpent: c.cum_avg_spent || 0,
  })).sort((a, b) => b[metric] - a[metric]);
}

/**
 * Bacheca unificata "Nuovi Clienti": gli ultimi `limit` clienti registrati
 * (ordinati per created_date decrescente). Usata sia in Clienti (tab Tabelle)
 * sia in Weekend (tab Tabelle) così le due viste mostrano gli stessi record.
 */
export function buildNuoviClientiBoard(enriched, limit = 30) {
  return [...enriched]
    .filter(e => e.client?.created_date)
    .sort((a, b) => new Date(b.client.created_date) - new Date(a.client.created_date))
    .slice(0, limit);
}

export { rankingColor };