import { calcTables } from './tables';
import { getDow } from './dateUtils';

/**
 * Calcola le "info rapide" di un promoter per il popup di anteprima veloce.
 *
 * "Serate con fatturato" segue la STESSA logica della Heatmap Serate:
 *   - denominatore = tutte le serate con data >= promoter_from (anche quelle
 *     a cui il promoter non ha partecipato → contano come "senza risultato")
 *   - numeratore = serate in cui il promoter ha generato fatturato > 0
 *
 * @param {object} promoter - record promoter (usa promoter.promoter_from)
 * @param {Array}  attendances - EventAttendance del promoter (promoter_id match, senza client_id)
 * @param {Array}  events - tutti gli eventi
 * @returns {{ promoterFrom, currentStreak, longestStreak, serateConFatturato, totalSerate, topEvent, topRevenue }}
 */
export function computePromoterQuickInfo(promoter, attendances, events) {
  const evMap = new Map(events.map(e => [e.id, e]));
  const revenueByEvent = {};
  attendances.forEach(a => {
    revenueByEvent[a.event_id] = (revenueByEvent[a.event_id] || 0) + (a.revenue || 0);
  });

  const promoterFrom = promoter?.promoter_from || null;

  // Tutte le serate con data, filtrate da quando il promoter ha iniziato (logica heatmap)
  const allDated = events.filter(e => e.date);
  const sincePromoter = promoterFrom ? allDated.filter(e => e.date >= promoterFrom) : allDated;

  const totalSerate = sincePromoter.length;
  const serateConFatturato = sincePromoter.filter(e => (revenueByEvent[e.id] || 0) > 0).length;

  // Per streak/tavoli consideriamo solo le serate a cui il promoter ha partecipato
  const promoterEvents = attendances
    .map(a => evMap.get(a.event_id))
    .filter(e => e && e.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  const tablesByEvent = {};
  promoterEvents.forEach(ev => {
    tablesByEvent[ev.id] = calcTables(revenueByEvent[ev.id] || 0, getDow(ev.date), ev.table_threshold || 300);
  });

  // Streak: serie consecutive di serate con tavoli chiusi (>= 1.0)
  const runs = [];
  let run = [];
  for (const ev of promoterEvents) {
    if (tablesByEvent[ev.id] >= 1.0) run.push(ev);
    else { if (run.length) runs.push(run); run = []; }
  }
  if (run.length) runs.push(run);

  const currentStreak = promoterEvents.length
    ? (tablesByEvent[promoterEvents[promoterEvents.length - 1].id] >= 1.0 && runs.length
        ? runs[runs.length - 1].length : 0)
    : 0;
  const longestStreak = runs.reduce((m, r) => Math.max(m, r.length), 0);

  let topEvent = null;
  let topRevenue = 0;
  promoterEvents.forEach(ev => {
    const rev = revenueByEvent[ev.id] || 0;
    if (rev > topRevenue) { topRevenue = rev; topEvent = ev; }
  });

  return {
    promoterFrom,
    currentStreak,
    longestStreak,
    serateConFatturato,
    totalSerate,
    topEvent,
    topRevenue,
  };
}