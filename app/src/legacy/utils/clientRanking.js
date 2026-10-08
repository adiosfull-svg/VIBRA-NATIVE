/**
 * Ranking cliente 1–10
 *
 * COMPONENTI (media pesata):
 *  40% — Frequenza: calcolo originale con cap a 1.0 (50% presenze = pieno)
 *  30% — Spesa media: 30€ = 1.0, oltre 30€: +0.2 ogni 30€ aggiuntivi. Nessun cap.
 *  30% — Nuove persone portate: ogni persona vale 0.075. Nessun cap.
 */

const FALLBACK_START = new Date('2025-10-11');

// Soglie decadimento "big spender" inattivi — devono matchare il backend
// (base44/functions/recomputeCumulativeStats/entry.ts)
const DECAY_HIGH_SPENDER_THRESHOLD = 80;   // € spesa media
const DECAY_LOW_VISITS_THRESHOLD = 5;       // poche presenze
const DECAY_GRACE_DAYS = 60;                 // inattività tollerata (big spender)
const DECAY_MONTHLY_FACTOR = 0.85;           // -15%/mese oltre il grace (big spender)

// Decadimento sottrattivo "single-visit high spender": clienti con una sola
// presenza e spesa media alta hanno il rating iniziale satura a 10 per via
// della spesa. Il decadimento moltiplicativo non riesce a scalfirlo (il raw
// è troppo alto). Qui applichiamo un decadimento SOTTRATTIVO sul rating
// finale: dopo 30 giorni di inattività, -0.5 punti per ogni mese.
const DECAY_SINGLE_VISIT_GRACE_DAYS = 30;
const DECAY_SINGLE_VISIT_MONTHLY_PENALTY = 0.5;

// Decadimento "clienti normali" (settimanale, ripristinato)
// Grace 7 giorni, poi ~0.1 rating perso per settimana di inattività
const DECAY_NORMAL_GRACE_DAYS = 7;
const DECAY_NORMAL_WEEKLY_FACTOR = 0.985;

/** Trova la data della prima presenza del cliente (lookup O(1) tramite mappa) */
function getFirstAttendanceDate(attendances, eventsById) {
  if (!attendances || attendances.length === 0) return FALLBACK_START;
  let earliest = null;
  attendances.forEach(a => {
    const ev = eventsById[a.event_id];
    if (ev?.date) {
      const d = new Date(ev.date);
      if (!earliest || d < earliest) earliest = d;
    }
  });
  return earliest || FALLBACK_START;
}

/** Trova la data dell'ultima presenza del cliente */
function getLastAttendanceDate(attendances, eventsById) {
  if (!attendances || attendances.length === 0) return null;
  let latest = null;
  attendances.forEach(a => {
    const ev = eventsById[a.event_id];
    if (ev?.date) {
      const d = new Date(ev.date);
      if (!latest || d > latest) latest = d;
    }
  });
  return latest;
}

/**
 * @param {Object} client
 * @param {Object} stats  { visits, avgSpent, attendances: [...] }
 * @param {Array}  events  array completo degli eventi
 * @param {Object} [eventsById]  mappa opzionale id->evento pre-calcolata dal chiamante
 *                               (evita di ricostruirla per ogni cliente quando si processano liste grandi)
 */
export function computeClientRanking(client, stats, events = [], eventsById, asOf = Date.now()) {
  const { visits = 0, avgSpent = 0, attendances = [] } = stats;
  const newPeople = client.new_people_brought || 0;

  if (visits === 0) return null;

  const byId = eventsById || Object.fromEntries(events.map(e => [e.id, e]));

  // Tracking parte dalla prima presenza del cliente
  const trackingStart = getFirstAttendanceDate(attendances, byId);

  // Serate disponibili dalla prima presenza del cliente
  const relevantEvents = events.filter(e => e.date && new Date(e.date) >= trackingStart);
  const denominator = Math.max(relevantEvents.length, 1);

  // --- Componente 1: Frequenza (cap a 1.0) ---
  // Media tra % relativa (costanza) e volume assoluto (quante volte è venuto)
  // freqRelative: 50% serate = 1.0
  // freqVolume: 20 presenze = 1.0 (scala logaritmica, chi ne ha di più è avvantaggiato)
  const freqRatio = visits / denominator;
  const freqRelative = Math.min(freqRatio / 0.5, 1.0);
  const freqVolume = Math.min(Math.log(visits + 1) / Math.log(21), 1.0); // log: 1→0.15, 5→0.5, 10→0.7, 20→1.0
  const freqScore = freqRelative * 0.5 + freqVolume * 0.5;

  // --- Componente 2: Spesa media (senza cap) ---
  // Fino a 30€: curva di potenza (15€ → ~0.5, 20€ → ~0.65, 25€ → ~0.8, 30€ → 1.0)
  // Oltre 30€: ogni 30€ aggiuntivi +0.2 (60€ → 1.2, 90€ → 1.4, 150€ → 1.8)
  const spendScore = avgSpent <= 30
    ? Math.pow(avgSpent / 30, 0.75)
    : 1.0 + ((avgSpent - 30) / 30) * 0.2;

  // --- Componente 3: Nuove persone portate (senza cap) ---
  // Ogni persona vale 0.04 (13-14 persone → ~1.0)
  const peopleScore = newPeople * 0.04;

  // --- Media pesata ---
  const raw = freqScore * 0.45 + spendScore * 0.30 + peopleScore * 0.25;

  // Curva di potenza per portare in scala 1–10
  // raw=0.5 → score ≈ 5.5, raw=0.7 → score ≈ 7, raw=1.0 → score ≈ 8.5
  const curved = Math.pow(raw, 0.55);
  let score = 1 + curved * 9;

  // Decadimento selettivo "big spender" inattivi: solo spesa media > 80€
  // con poche presenze (< 5) e inattivi oltre 60 giorni. Il rating scende
  // del 15% per ogni mese di inattività oltre il grace period. Quando il
  // cliente torna e spende normalmente, la media scende sotto soglia.
  //
  // Eccezione: single-visit high spender (visits === 1 && avgSpent > 80).
  // Per questi il decadimento moltiplicativo non basta: il raw score è così
  // alto che anche dopo decadimento il rating resta capped a 10. Applichiamo
  // invece un decadimento SOTTRATTIVO sul rating finale (dopo il cap a 10):
  // 30 giorni di grace, poi -0.5 punti per mese di inattività.
  const isSingleVisitHighSpender = visits === 1 && avgSpent > DECAY_HIGH_SPENDER_THRESHOLD;
  const lastDate = getLastAttendanceDate(attendances, byId);
  if (lastDate) {
    const daysSinceLast = (asOf - lastDate.getTime()) / (1000 * 60 * 60 * 24);
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
  if (isSingleVisitHighSpender && lastDate) {
    const daysSinceLast = (asOf - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > DECAY_SINGLE_VISIT_GRACE_DAYS) {
      const monthsInactive = (daysSinceLast - DECAY_SINGLE_VISIT_GRACE_DAYS) / 30;
      finalScore = Math.max(finalScore - DECAY_SINGLE_VISIT_MONTHLY_PENALTY * monthsInactive, 1);
    }
  }

  return Math.round(finalScore * 10) / 10;
}

/** Colore badge in base al punteggio */
export function rankingColor(score) {
  if (score === null) return 'text-muted-foreground';
  if (score >= 8.5) return 'text-cyan-300';
  if (score >= 7)   return 'text-blue-400';
  if (score >= 5)   return 'text-violet-400';
  return 'text-slate-400';
}