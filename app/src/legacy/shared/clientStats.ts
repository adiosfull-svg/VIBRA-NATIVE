/**
 * Modulo shared backend per il calcolo delle statistiche cumulative dei clienti.
 * Usato da recomputeCumulativeStats per pre-calcolare tutti i campi cum_* sul
 * record Client, eliminando il need del frontend di scaricare tutte le presenze
 * e ricalcolare tutto localmente ad ogni apertura di pagina.
 *
 * Logica portata dal frontend:
 * - clientTrendExt.js (computeClientFullTrend)
 * - clientBadges.js (computeClientBadges)
 * - Programmazione.jsx enriched (monthTrend, cicloMedio, attendanceRate)
 */

const FALLBACK_START = new Date('2025-10-11');

// Soglie decadimento "big spender" inattivi
const DECAY_HIGH_SPENDER_THRESHOLD = 80;
const DECAY_LOW_VISITS_THRESHOLD = 5;
const DECAY_GRACE_DAYS = 60;
const DECAY_MONTHLY_FACTOR = 0.85;

// Decadimento sottrattivo "single-visit high spender": clienti con una sola
// presenza e spesa media alta saturano il rating a 10 per via della spesa.
// Il decadimento moltiplicativo non lo scalfisce (raw troppo alto), quindi
// applichiamo un decadimento SOTTRATTIVO sul rating finale: 30 giorni di
// grace, poi -0.5 punti per ogni mese di inattivita'.
const DECAY_SINGLE_VISIT_GRACE_DAYS = 30;
const DECAY_SINGLE_VISIT_MONTHLY_PENALTY = 0.5;

// Soglie decadimento "clienti normali" inattivi (decadimento settimanale)
// Grace 7 giorni, poi ~0.1 rating perso per ogni settimana di inattivita'
// (su rating tipici 6-7: 0.985^1 ≈ -0.1, 0.985^2 ≈ -0.2, ecc.)
const DECAY_NORMAL_GRACE_DAYS = 7;
const DECAY_NORMAL_WEEKLY_FACTOR = 0.985;

function getLastAttendanceDate(dates: string[]): Date | null {
  if (!dates || dates.length === 0) return null;
  let latest: Date | null = null;
  for (const d of dates) {
    const dt = new Date(d);
    if (!latest || dt > latest) latest = dt;
  }
  return latest;
}

/**
 * Calcola il rating 1-10 del cliente (stessa logica del frontend clientRanking.js
 * e del vecchio computeClientRating inline in recomputeCumulativeStats).
 */
export function computeClientRating(
  client: any,
  visits: number,
  avgSpent: number,
  firstAttendanceDate: Date,
  relevantEventsCount: number,
  lastAttendanceDate: Date | null,
): number {
  if (visits === 0) return 0;
  const newPeople = client.new_people_brought || 0;
  const denominator = Math.max(relevantEventsCount, 1);

  const freqRatio = visits / denominator;
  const freqRelative = Math.min(freqRatio / 0.5, 1.0);
  const freqVolume = Math.min(Math.log(visits + 1) / Math.log(21), 1.0);
  const freqScore = freqRelative * 0.5 + freqVolume * 0.5;

  const spendScore = avgSpent <= 30
    ? Math.pow(avgSpent / 30, 0.75)
    : 1.0 + ((avgSpent - 30) / 30) * 0.2;

  const peopleScore = newPeople * 0.04;

  const raw = freqScore * 0.45 + spendScore * 0.30 + peopleScore * 0.25;
  const curved = Math.pow(raw, 0.55);
  let score = 1 + curved * 9;

  // Single-visit high spender: decadimento sottrattivo (gestito dopo il cap).
  const isSingleVisitHighSpender = visits === 1 && avgSpent > DECAY_HIGH_SPENDER_THRESHOLD;
  if (lastAttendanceDate) {
    const daysSinceLast = (Date.now() - lastAttendanceDate.getTime()) / (1000 * 60 * 60 * 24);
    if (isSingleVisitHighSpender) {
      // Single-visit high spender: decadimento sottrattivo gestito dopo il cap.
    } else if (avgSpent > DECAY_HIGH_SPENDER_THRESHOLD && visits < DECAY_LOW_VISITS_THRESHOLD) {
      // Big spender multi-visita: decadimento mensile conservativo (inalterato)
      if (daysSinceLast > DECAY_GRACE_DAYS) {
        const monthsInactive = (daysSinceLast - DECAY_GRACE_DAYS) / 30;
        score = score * Math.pow(DECAY_MONTHLY_FACTOR, monthsInactive);
      }
    } else {
      // Clienti normali: decadimento settimanale ripristinato
      if (daysSinceLast > DECAY_NORMAL_GRACE_DAYS) {
        const weeksInactive = (daysSinceLast - DECAY_NORMAL_GRACE_DAYS) / 7;
        score = score * Math.pow(DECAY_NORMAL_WEEKLY_FACTOR, weeksInactive);
      }
    }
  }

  let finalScore = Math.min(Math.round(score * 10) / 10, 10);

  // Decadimento sottrattivo single-visit high spender: applicato DOPO il cap
  // a 10, così la spesa elevata non può mantenere il rating al massimo.
  if (isSingleVisitHighSpender && lastAttendanceDate) {
    const daysSinceLast = (Date.now() - lastAttendanceDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > DECAY_SINGLE_VISIT_GRACE_DAYS) {
      const monthsInactive = (daysSinceLast - DECAY_SINGLE_VISIT_GRACE_DAYS) / 30;
      finalScore = Math.max(finalScore - DECAY_SINGLE_VISIT_MONTHLY_PENALTY * monthsInactive, 1);
    }
  }

  return Math.round(finalScore * 10) / 10;
}

/**
 * Calcola il trend presenze: confronta la frequenza nelle ultime 2 settimane
 * vs le 2 settimane precedenti. Portato da clientTrendExt.js.
 *
 * Ritorna: { status: 'up'|'down'|'stable'|null, pctChange: number|null }
 */
export function computeClientTrend(
  clientAttendances: any[],
  events: any[],
  eventsById: Record<string, any>,
): { status: string | null; pctChange: number | null } {
  if (!clientAttendances?.length || !events?.length) {
    return { status: null, pctChange: null };
  }

  const now = new Date();
  const msPerDay = 86400000;
  const recentStart = new Date(now.getTime() - 2 * 7 * msPerDay);
  const prevStart = new Date(now.getTime() - 4 * 7 * msPerDay);

  let totalEventsRecent = 0;
  let totalEventsPrev = 0;
  for (const ev of events) {
    if (!ev.date) continue;
    const d = new Date(ev.date);
    if (d >= recentStart && d <= now) totalEventsRecent++;
    else if (d >= prevStart && d < recentStart) totalEventsPrev++;
  }

  let clientPresencesRecent = 0;
  let clientPresencesPrev = 0;
  for (const a of clientAttendances) {
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    const d = new Date(ev.date);
    if (d >= recentStart && d <= now) clientPresencesRecent++;
    else if (d >= prevStart && d < recentStart) clientPresencesPrev++;
  }

  if (totalEventsRecent === 0 && totalEventsPrev === 0) {
    return { status: null, pctChange: null };
  }
  if (clientPresencesRecent === 0 && clientPresencesPrev === 0) {
    return { status: null, pctChange: null };
  }

  const freqRecent = totalEventsRecent > 0 ? clientPresencesRecent / totalEventsRecent : 0;
  const freqPrev = totalEventsPrev > 0 ? clientPresencesPrev / totalEventsPrev : 0;

  let pctChange: number | null = null;
  if (freqPrev > 0) {
    pctChange = Math.round(((freqRecent - freqPrev) / freqPrev) * 100);
  } else if (freqRecent > 0) {
    pctChange = 100;
  }

  const diff = freqRecent - freqPrev;
  const threshold = 0.1;
  let status: string | null = 'stable';
  if (diff > threshold) status = 'up';
  else if (diff < -threshold) status = 'down';

  return { status, pctChange };
}

/**
 * Calcola la variazione % delle presenze negli ultimi 31 giorni vs 31 giorni precedenti.
 * Portato da Programmazione.jsx enriched.monthTrend.
 */
export function computeMonthTrend(dates: string[]): number | null {
  if (!dates || dates.length === 0) return null;
  const today = new Date();
  const curStart = new Date(today.getTime() - 30 * 86400000).toISOString().slice(0, 10);
  const prevStart = new Date(today.getTime() - 61 * 86400000).toISOString().slice(0, 10);
  const prevEnd = new Date(today.getTime() - 31 * 86400000).toISOString().slice(0, 10);

  let curCount = 0, prevCount = 0;
  for (const d of dates) {
    if (d >= curStart) curCount++;
    else if (d >= prevStart && d <= prevEnd) prevCount++;
  }

  if (prevCount > 0) return Math.round(((curCount - prevCount) / prevCount) * 100);
  if (curCount > 0) return 100;
  return null;
}

/**
 * Calcola il ciclo medio di frequenza: durata media (in presenze) dei periodi
 * di frequenza continua. Una pausa di 21+ giorni chiude il ciclo.
 * Portato da Programmazione.jsx enriched.cicloMedio.
 */
export function computeCicloMedio(dates: string[]): number | null {
  if (!dates || dates.length === 0) return null;
  const sorted = [...dates].sort();
  const cycles: string[][] = [];
  let cur = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const gap = (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000;
    if (gap > 21) { cycles.push(cur); cur = [sorted[i]]; }
    else cur.push(sorted[i]);
  }
  cycles.push(cur);
  return Math.round(cycles.reduce((s, cy) => s + cy.length, 0) / cycles.length);
}

/**
 * Calcola il tasso di presenza %: presenze / serate disponibili dalla prima presenza.
 * Portato da Programmazione.jsx enriched.attendanceRate.
 */
export function computeAttendanceRate(visits: number, firstDate: Date | null, events: any[]): number | null {
  if (!firstDate || visits === 0) return null;
  const eventsSince = events.filter(e => e.date && new Date(e.date) >= firstDate).length;
  return eventsSince > 0 ? Math.round((visits / eventsSince) * 100) : null;
}

/**
 * Calcola i badge classifica per i clienti di un promoter.
 * Badge: Top presenze (Fedeltà), Top rendita, Top spender, Top aggregatore.
 * Portato da clientBadges.js.
 *
 * @param clients - clienti di UN promoter
 * @param getStats - funzione (clientId) => { visits, totalSpent, avgSpent }
 * @returns mappa { [clientId]: string[] }
 */
export function computeClientBadges(
  clients: any[],
  getStats: (id: string) => { visits: number; totalSpent: number; avgSpent: number },
): Record<string, string[]> {
  if (!clients || clients.length === 0) return {};

  const byVisits = [...clients].sort((a, b) => getStats(b.id).visits - getStats(a.id).visits);
  const bySpent = [...clients].sort((a, b) => getStats(b.id).totalSpent - getStats(a.id).totalSpent);
  const byAvg = [...clients].sort((a, b) => getStats(b.id).avgSpent - getStats(a.id).avgSpent);
  const byPeople = [...clients].sort((a, b) => (b.new_people_brought || 0) - (a.new_people_brought || 0));

  const assignMedals = (sorted: any[], getValue: (c: any) => number, medals: string[]) => {
    const result: Record<string, string> = {};
    let rank = 0;
    let lastVal: number | null = null;
    sorted.forEach((c, i) => {
      const val = getValue(c);
      if (val === 0) return;
      if (val !== lastVal) {
        rank = i + 1;
        lastVal = val;
      }
      if (rank <= medals.length) {
        result[c.id] = medals[rank - 1];
      }
    });
    return result;
  };

  const visitsMedals = assignMedals(byVisits, c => getStats(c.id).visits, ['🏅', '🥈', '🥉']);
  const rentaMedals = assignMedals(bySpent, c => getStats(c.id).totalSpent, ['💰', '💵', '💸']);
  const spenderMedals = assignMedals(byAvg, c => getStats(c.id).visits > 0 ? getStats(c.id).avgSpent : 0, ['💎', '💍', '🪙']);
  const peopleMedals = assignMedals(byPeople, c => c.new_people_brought || 0, ['🤝', '🫂', '👥']);

  const badges: Record<string, string[]> = {};
  for (const c of clients) {
    const list: string[] = [];
    if (visitsMedals[c.id]) list.push(visitsMedals[c.id]);
    if (rentaMedals[c.id]) list.push(rentaMedals[c.id]);
    if (spenderMedals[c.id]) list.push(spenderMedals[c.id]);
    if (peopleMedals[c.id]) list.push(peopleMedals[c.id]);
    if (list.length > 0) badges[c.id] = list;
  }

  return badges;
}

/**
 * Struttura di dati aggregati per un singolo cliente, calcolata dal backend.
 * Tutti i campi necessari al frontend per renderizzare liste/bacheche senza
 * dover scaricare e processare le presenze.
 */
export interface ClientEnrichedStats {
  visits: number;
  fri: number;
  sat: number;
  sun: number;
  extra: number;
  totalSpent: number;
  avgSpent: number;
  firstAttendanceDate: Date | null;
  lastAttendanceDate: Date | null;
  lastRevenue: number;
  lastEventVenue: string | null;
  rating: number;
  trendStatus: string | null;
  trendPct: number | null;
  monthTrend: number | null;
  attendanceRate: number | null;
  cicloMedio: number | null;
  venueCounts: Record<string, number>;
}

/**
 * Calcola tutte le statistiche arricchite per un cliente a partire dalle sue presenze.
 * Usato da recomputeCumulativeStats per popolare i campi cum_*.
 */
export function computeClientEnrichedStats(
  client: any,
  clientAttendances: any[],
  events: any[],
  eventsById: Record<string, any>,
): ClientEnrichedStats {
  let fri = 0, sat = 0, sun = 0, extra = 0;
  let totalSpent = 0;
  let lastDateStr = '';
  let lastRevenue = 0;
  let lastEventVenue: string | null = null;
  const venueCounts: Record<string, number> = {};
  const dates: string[] = [];

  for (const a of clientAttendances) {
    const ev = eventsById[a.event_id];
    if (!ev) continue;
    totalSpent += a.revenue || 0;
    if (ev.venue) venueCounts[ev.venue] = (venueCounts[ev.venue] || 0) + 1;
    // Traccia l'ultima presenza (cum_last_attendance_date / cum_last_revenue /
    // cum_last_event_venue) su TUTTE le serate, incluse quelle extra: deve sempre
    // riflettere l'ultima serata reale a cui il cliente ha partecipato.
    if (ev.date && ev.date > lastDateStr) {
      lastDateStr = ev.date;
      lastRevenue = a.revenue || 0;
      lastEventVenue = ev.venue || null;
    }
    if (ev.is_extra) { extra++; continue; }
    if (!ev.date) continue;
    dates.push(ev.date);
    const [y, m, d] = ev.date.split('-').map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    if (dow === 5) fri++;
    else if (dow === 6) sat++;
    else if (dow === 0) sun++;
  }

  const visits = clientAttendances.length;
  const avgSpent = visits > 0 ? Math.round(totalSpent / visits) : 0;

  // Date ordinate per trend/ciclo
  dates.sort();

  let firstDate: Date | null = null;
  if (dates.length > 0) {
    firstDate = new Date(dates[0]);
  }
  // lastDate include anche le serate extra (lastDateStr le conta tutte), così
  // cum_last_attendance_date e il decadimento del rating si basano sull'ultima
  // presenza reale, non solo sulle serate regolari Ven/Sab/Dom.
  const lastDate: Date | null = lastDateStr ? new Date(lastDateStr) : null;

  const trackingStart = firstDate || FALLBACK_START;
  const relevantEventsCount = events.filter(e => e.date && new Date(e.date) >= trackingStart).length;
  const rating = computeClientRating(client, visits, avgSpent, trackingStart, relevantEventsCount, lastDate);

  const trend = computeClientTrend(clientAttendances, events, eventsById);
  const monthTrend = computeMonthTrend(dates);
  const cicloMedio = computeCicloMedio(dates);
  const attendanceRate = computeAttendanceRate(visits, firstDate, events);

  return {
    visits, fri, sat, sun, extra,
    totalSpent: Math.round(totalSpent),
    avgSpent,
    firstAttendanceDate: firstDate,
    lastAttendanceDate: lastDate,
    lastRevenue,
    lastEventVenue,
    rating,
    trendStatus: trend.status,
    trendPct: trend.pctChange,
    monthTrend,
    attendanceRate,
    cicloMedio,
    venueCounts,
  };
}