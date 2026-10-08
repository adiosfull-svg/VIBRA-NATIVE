/**
 * Aggregazione condivisa di TUTTI i numeri derivati di un promoter
 * (fatturato totale, tavoli, presenze, mese corrente, stagioni, giorno settimana,
 * top serate, performance per locale) a partire da presenze + eventi già in memoria.
 *
 * Un'unica funzione pura usata da: classifica Dashboard (LiveRankingWidget),
 * card Promoter (desktop e mobile) e Il Mio Vibra → Miei Progressi.
 * Stesso filtro anti-orfane (event_id deve esistere in events) e stessa deduplica
 * per event_id (tiene il record con revenue più alto) ovunque → il fatturato
 * totale è identico in ogni vista e si aggiorna live, come "I Miei Guadagni".
 *
 * Lo snapshot cum_total_revenue resta sul promoter per uso interno del backend
 * (workflow, achievement, report) ma la UI non lo legge più.
 */
import { calcTables, computeAvgThreshold } from './tables';
import { getDow, validDayKey } from './dateUtils';

// Stagioni: stesse date esatte usate in PromoterSeasonStats (10 ottobre – 9 ottobre)
export const SEASONS = [
  { key: '2022/2023', label: '2022/2023', dateFrom: '2022-10-10', dateTo: '2023-10-09' },
  { key: '2023/2024', label: '2023/2024', dateFrom: '2023-10-10', dateTo: '2024-10-09' },
  { key: '2024/2025', label: '2024/2025', dateFrom: '2024-10-10', dateTo: '2025-10-09' },
  { key: '2025/2026', label: '2025/2026', dateFrom: '2025-10-10', dateTo: '2026-10-09' },
];

// Tabella chiusura tavoli per locale (come PromoterCard → ClosedTablesCard / MieiProgressi)
export const VENUE_ROWS = [
  { label: 'Frontemare',                sublabel: 'Ven. Estate',  venueKey: 'Ammare Frontemare',         isExtra: false },
  { label: 'Paprika Scilla',            sublabel: 'Ven. Estate',  venueKey: 'Paprika Scilla',            isExtra: false },
  { label: 'Estasi Scilla',             sublabel: 'Ven. Estate',  venueKey: 'Estasi Scilla',             isExtra: false },
  { label: 'Nemesi Club Type',          sublabel: 'Ven. Inverno', venueKey: 'Nemesi Club Type',          isExtra: false },
  { label: 'Fantasya Living',           sublabel: 'Ven. Inverno', venueKey: 'Fantasya Living',           isExtra: false },
  { label: 'Mantra',                    sublabel: 'Sab. Estate',  venueKey: 'Mantra',                    isExtra: false },
  { label: 'Loonatic Maison del Mare',  sublabel: 'Sab. Estate',  venueKey: 'Loonatic Maison del Mare', isExtra: false },
  { label: 'Hi.Club Brass',             sublabel: 'Sab. Inverno', venueKey: 'Hi.Club Brass',             isExtra: false },
  { label: 'Kolossal Brass',            sublabel: 'Sab. Inverno', venueKey: 'Kolossal Brass',            isExtra: false },
  { label: 'Toma',                      sublabel: 'Dom. Estate',  venueKey: 'Toma',                      isExtra: false },
  { label: 'Superstar Pineta',          sublabel: 'Dom. Inverno', venueKey: 'Superstar Pineta',          isExtra: false },
  { label: 'Chapeau Club Type',         sublabel: 'Dom. Inverno', venueKey: 'Chapeau Club Type',         isExtra: false },
  { label: 'Extra/Festivi',             sublabel: 'Speciali',     venueKey: null,                        isExtra: true  },
];

const ZERO_VENUE = Object.freeze({ presenti: 0, myRev: 0, myTav: 0 });

function monthKeyOf(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Deduplica le presenze di un promoter per event_id (tiene il record con revenue
 * più alto, a parità il più recente), scartando le presenze orfane (event_id non
 * in eventsById) e le presenze cliente. Restituisce l'array di presenze "pulite".
 */
export function dedupPromoterAttendances(promoterId, attendances, eventsById) {
  const byEvent = new Map();
  for (const a of attendances) {
    if (a.promoter_id !== promoterId || a.client_id) continue;
    if (!eventsById.has(a.event_id)) continue;
    const prev = byEvent.get(a.event_id);
    if (!prev || (a.revenue || 0) > (prev.revenue || 0) ||
        ((a.revenue || 0) === (prev.revenue || 0) && (a.created_date || '') > (prev.created_date || ''))) {
      byEvent.set(a.event_id, a);
    }
  }
  return [...byEvent.values()];
}

/**
 * Funzione pura: calcola TUTTI i numeri derivati di un promoter da presenze +
 * eventi già in memoria. Stesso filtro anti-orfane e stessa deduplica ovunque.
 *
 * @param {string} promoterId
 * @param {Array}  attendances - tutte le presenze (vengono filtrate per promoter)
 * @param {Array|Map} events - tutti gli eventi (Array o Map già costruita)
 * @param {Date}   [now] - "ora" per il mese corrente (default new Date())
 * @returns {object} tutti gli aggregati pronti per la UI
 */
export function computePromoterAggregates(promoterId, attendances, events, now = new Date()) {
  const eventsById = events instanceof Map ? events : new Map(events.map(e => [e.id, e]));
  const myAtts = dedupPromoterAttendances(promoterId, attendances, eventsById);

  // Media delle soglie di tutti gli eventi: usata come fallback per gli eventi
  // senza table_threshold (invece del fisso 300) così il totale tavoli riflette
  // la distribuzione reale delle soglie (240, 300, 360, 120...).
  const avgThreshold = computeAvgThreshold(eventsById.values());

  // Build rows: un solo passaggio, ogni presenza "agganciata" al suo evento
  const rows = [];
  for (const a of myAtts) {
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) continue;
    const revenue = a.revenue || 0;
    const dow = getDow(ev.date);
    const day = validDayKey(ev.date) || ev.date;
    rows.push({ a, ev, date: ev.date, day, revenue, dow, tables: calcTables(revenue, dow, ev.table_threshold, avgThreshold) });
  }

  // Totals
  let totalRevenue = 0, totalPresences = 0, totalTables = 0, serateFatturate = 0;
  for (const r of rows) {
    totalRevenue += r.revenue;
    if (r.a.present) totalPresences++;
    totalTables += r.tables;
    if (r.revenue > 0) serateFatturate++;
  }

  // Aggregato per mese ('YYYY-MM')
  const monthAgg = new Map();
  for (const r of rows) {
    if (!r.day) continue;
    const k = r.day.slice(0, 7);
    let b = monthAgg.get(k);
    if (!b) { b = { revenue: 0, presences: 0, tables: 0 }; monthAgg.set(k, b); }
    b.revenue += r.revenue;
    if (r.a.present) b.presences++;
    b.tables += r.tables;
  }

  // Mese corrente + split tavoli per giorno settimana
  const mk = monthKeyOf(now);
  const thisMonthBucket = monthAgg.get(mk) || { revenue: 0, presences: 0, tables: 0 };
  let monthlyFri = 0, monthlySat = 0, monthlySun = 0;
  for (const r of rows) {
    if (!r.day || r.day.slice(0, 7) !== mk) continue;
    if (r.dow === 5) monthlyFri += r.tables;
    else if (r.dow === 6) monthlySat += r.tables;
    else if (r.dow === 0) monthlySun += r.tables;
  }

  // Performance per locale (chiusura tavoli)
  const evCountByVenue = new Map();
  let evExtra = 0;
  for (const ev of eventsById.values()) {
    evCountByVenue.set(ev.venue, (evCountByVenue.get(ev.venue) || 0) + 1);
    if (ev.is_extra) evExtra++;
  }
  const byVenue = new Map();
  const extra = { presenti: 0, myRev: 0, myTav: 0 };
  for (const r of rows) {
    if (r.revenue <= 0) continue;
    let b = byVenue.get(r.ev.venue);
    if (!b) { b = { presenti: 0, myRev: 0, myTav: 0 }; byVenue.set(r.ev.venue, b); }
    b.presenti++; b.myRev += r.revenue; b.myTav += r.tables;
    if (r.ev.is_extra) { extra.presenti++; extra.myRev += r.revenue; extra.myTav += r.tables; }
  }
  const venueStats = VENUE_ROWS.map(({ label, sublabel, venueKey, isExtra }) => {
    const totalVenueEvents = isExtra ? evExtra : (evCountByVenue.get(venueKey) || 0);
    const b = isExtra ? extra : (byVenue.get(venueKey) || ZERO_VENUE);
    return { label, sublabel, venueKey, isExtra, totalVenueEvents, presenti: b.presenti, myRev: b.myRev, myTav: b.myTav };
  }).filter(r => r.totalVenueEvents > 0);

  // Confronto stagioni (confronto di stringhe 'YYYY-MM-DD')
  const seasonsAcc = SEASONS.map(() => ({ rev: 0, tables: 0, presenze: 0 }));
  for (const r of rows) {
    if (!r.day || r.revenue === 0) continue;
    for (let i = 0; i < SEASONS.length; i++) {
      const se = SEASONS[i];
      if (r.day >= se.dateFrom && r.day <= se.dateTo) {
        const b = seasonsAcc[i];
        b.rev += r.revenue; b.tables += r.tables; b.presenze++;
      }
    }
  }
  const seasons = SEASONS.map((se, i) => [se.label, seasonsAcc[i]]).filter(([, data]) => data.presenze > 0);

  // Performance per giorno settimana
  const dowAcc = { 5: { t: 0, f: 0 }, 6: { t: 0, f: 0 }, 0: { t: 0, f: 0 }, extra: { t: 0, f: 0 } };
  for (const r of rows) {
    const b = r.ev.is_extra ? dowAcc.extra : dowAcc[r.dow];
    if (!b) continue;
    b.t += r.tables; b.f += r.revenue;
  }
  const dowData = [
    { day: 'Venerdì', b: dowAcc[5] }, { day: 'Sabato', b: dowAcc[6] },
    { day: 'Domenica', b: dowAcc[0] }, { day: 'Extra', b: dowAcc.extra },
  ].map(({ day, b }) => ({ day, tavoli: Math.round(b.t * 10) / 10, fatturato: b.f }));

  // Top serate (ordinate per fatturato desc)
  const topEventsAll = [];
  for (const a of myAtts) {
    const ev = eventsById.get(a.event_id);
    if (!ev) continue;
    topEventsAll.push({ att: a, ev });
  }
  topEventsAll.sort((a, b) => (b.att.revenue || 0) - (a.att.revenue || 0));

  return {
    myAtts, rows, monthAgg,
    totalRevenue, totalTables, totalPresences, serateFatturate,
    monthlyRevenue: thisMonthBucket.revenue,
    monthlyTables: thisMonthBucket.tables,
    monthlyPresences: thisMonthBucket.presences,
    monthlyFri, monthlySat, monthlySun,
    venueStats, seasons, dowData, topEventsAll,
  };
}

/**
 * Batch: calcola il fatturato totale per TUTTI i promoter in un solo passaggio
 * sulle presenze. Usato dalla classifica "Di sempre" (LiveRankingWidget) per
 * evitare 20 reduce separati. Stesso filtro anti-orfane e stessa deduplica di
 * computePromoterAggregates.
 *
 * @returns {Map<string, number>} promoterId → totalRevenue
 */
export function computeAllPromoterTotals(attendances, events) {
  const eventsById = events instanceof Map ? events : new Map(events.map(e => [e.id, e]));
  // promoterId -> Map(eventId, bestAtt)
  const byPromoter = new Map();
  for (const a of attendances) {
    if (!a.promoter_id || a.client_id) continue;
    if (!eventsById.has(a.event_id)) continue;
    let m = byPromoter.get(a.promoter_id);
    if (!m) { m = new Map(); byPromoter.set(a.promoter_id, m); }
    const prev = m.get(a.event_id);
    if (!prev || (a.revenue || 0) > (prev.revenue || 0) ||
        ((a.revenue || 0) === (prev.revenue || 0) && (a.created_date || '') > (prev.created_date || ''))) {
      m.set(a.event_id, a);
    }
  }
  const totals = new Map();
  for (const [pid, m] of byPromoter) {
    let totalRevenue = 0;
    for (const a of m.values()) totalRevenue += (a.revenue || 0);
    totals.set(pid, totalRevenue);
  }
  return totals;
}