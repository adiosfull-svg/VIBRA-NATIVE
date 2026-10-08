/**
 * Calcolo dei record di un promoter per la "Promoter Record Card" (Il Mio Vibra →
 * I Miei Progressi, sotto la Bacheca Riconoscimenti).
 *
 * Usa lo snapshot pre-calcolato dal backend (cum_*) come fonte autorevole quando
 * presente, con fallback al calcolo da myAtts/events per i promoter senza snapshot.
 * Le streak (tavoli e fatturato) sono sempre calcolate qui: record = run più lungo
 * di serate consecutive; current = run in corso dall'ultima serata.
 */
import { calcTables } from './tables';
import { getDow } from './dateUtils';
import { computePromoterStats, computeAutoUnlocked } from './achievementLogic';
import { computePRPoints, getRankInfo, getDynamicRankTiers, PR_POINTS_BY_RARITY } from './rankSystem';

/** "Da quanto tempo fa il promoter" → "3 anni e 2 mesi" / "8 mesi" / "meno di un mese" */
export function formatPromoterSince(promoterFromISO, now = new Date()) {
  if (!promoterFromISO) return null;
  const from = new Date(promoterFromISO);
  if (isNaN(from.getTime())) return null;
  let years = now.getFullYear() - from.getFullYear();
  let months = now.getMonth() - from.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years < 0) return null;
  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'anno' : 'anni'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mese' : 'mesi'}`);
  return parts.length ? parts.join(' e ') : 'meno di un mese';
}

/**
 * Tutti i record del promoter per la card.
 * @param {object} promoter - entità Promoter (con snapshot cum_*)
 * @param {Array} myAtts - presenze del promoter (promoter_id && !client_id)
 * @param {Array} events - tutti gli eventi
 * @param {Array} [allClients] - tutti i clienti (fallback conteggio senza snapshot)
 */
export function computePromoterRecords(promoter, myAtts, events, allClients = []) {
  const eventsById = new Map(events.map(e => [e.id, e]));
  const snap = promoter || {};

  // ── Top serata per fatturato ──
  let topAtt = null;
  for (const a of myAtts) {
    if (!topAtt || (a.revenue || 0) > (topAtt.revenue || 0)) topAtt = a;
  }
  const topEvent = topAtt && (topAtt.revenue || 0) > 0
    ? { revenue: topAtt.revenue || 0, name: eventsById.get(topAtt.event_id)?.name || '', date: eventsById.get(topAtt.event_id)?.date || '' }
    : null;

  // ── Streak (tavoli e fatturato) ──
  // Itera TUTTI gli eventi in ordine cronologico dal promoter_from: la streak si
  // interrompe quando il promoter non fattura (o non c'è) in una serata.
  const promoterFrom = snap.promoter_from;
  const evList = events
    .filter(e => e.date && (!promoterFrom || e.date >= promoterFrom))
    .sort((a, b) => a.date.localeCompare(b.date));

  const revByEvent = {};
  for (const a of myAtts) revByEvent[a.event_id] = (revByEvent[a.event_id] || 0) + (a.revenue || 0);
  const tablesByEvent = {};
  for (const ev of evList) {
    tablesByEvent[ev.id] = calcTables(revByEvent[ev.id] || 0, getDow(ev.date), ev.table_threshold || 300);
  }

  let revBest = 0, tabBest = 0, revRun = 0, tabRun = 0;
  for (const ev of evList) {
    const rev = revByEvent[ev.id] || 0;
    const tab = tablesByEvent[ev.id];
    revRun = rev > 0 ? revRun + 1 : 0;
    tabRun = tab >= 1.0 ? tabRun + 1 : 0;
    if (revRun > revBest) revBest = revRun;
    if (tabRun > tabBest) tabBest = tabRun;
  }
  // current = run che termina all'ultima serata
  let revCurrent = 0, tabCurrent = 0;
  for (let i = evList.length - 1; i >= 0; i--) {
    if ((revByEvent[evList[i].id] || 0) > 0) revCurrent++; else break;
  }
  for (let i = evList.length - 1; i >= 0; i--) {
    if (tablesByEvent[evList[i].id] >= 1.0) tabCurrent++; else break;
  }

  // Totali live (stesso calcolo di card/classifica/Miei Progressi): anti-orfane + dedup
  // già applicati a myAtts dal chiamante. Lo snapshot cum_* resta solo per Vibra VS e
  // achievement (non in scope di unificazione).
  const computedRevenue = myAtts.reduce((s, a) => s + (a.revenue || 0), 0);
  let computedTables = 0;
  let computedPresences = 0;
  for (const a of myAtts) {
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) continue;
    computedTables += calcTables(a.revenue || 0, getDow(ev.date), ev.table_threshold);
    if (a.present) computedPresences++;
  }
  const computedClients = allClients.filter(c => c.promoter_id === snap.id).length;

  return {
    topEvent,
    totalRevenue: computedRevenue,
    totalClients: snap.cum_total_clients ?? computedClients,
    totalTables: computedTables,
    totalPresences: computedPresences,
    vibraVsWins: snap.cum_vibra_vs_weekly_wins ?? 0,
    vibraVsStreakCurrent: snap.cum_vibra_vs_current_streak ?? 0,
    vibraVsStreakRecord: snap.cum_vibra_vs_weekly_streak ?? 0,
    tablesStreakRecord: tabBest,
    tablesStreakCurrent: tabCurrent,
    revenueStreakRecord: revBest,
    revenueStreakCurrent: revCurrent,
    achievementsUnlocked: snap.cum_ach_unlocked ?? 0,
    achievementsTotal: snap.cum_ach_total ?? 0,
    promoterSinceLabel: formatPromoterSince(snap.promoter_from),
    promoterSinceISO: snap.promoter_from || '',
  };
}

/**
 * Rank del promoter per la card.
 * Usa lo snapshot cum_ach_by_rarity (conteggi sbloccati per rarità) per calcolare i
 * PR points della porzione sbloccata — esatto e senza caricare tutti i clienti.
 * Fallback: calcolo completo via computePromoterStats quando lo snapshot manca.
 *
 * @returns {{ label, emoji, color, key, prPoints } | null}
 */
export function computePromoterRank(promoter, achievements, allClients, attendances, events, promoters = []) {
  if (!achievements || achievements.length === 0 || !promoter) return null;
  const snap = promoter;
  const hasSnapshot = !!snap.cum_ach_by_rarity && snap.cum_ach_total != null;
  const dynamicTiers = getDynamicRankTiers(achievements);

  let prPoints, isGoat;
  if (hasSnapshot) {
    const byRarity = snap.cum_ach_by_rarity || {};
    prPoints = Object.entries(byRarity).reduce(
      (s, [rarity, v]) => s + ((v && v.unlocked) || 0) * (PR_POINTS_BY_RARITY[rarity] || 0),
      0
    );
    isGoat = snap.cum_ach_total > 0 && (snap.cum_ach_unlocked || 0) >= snap.cum_ach_total;
  } else {
    const stats = computePromoterStats(promoter, allClients, attendances, events, promoters);
    const autoUnlocked = computeAutoUnlocked(achievements, stats);
    prPoints = computePRPoints(achievements, autoUnlocked, stats);
    isGoat = autoUnlocked.size === achievements.length;
  }

  const { current } = getRankInfo(prPoints, isGoat, dynamicTiers);
  return { label: current.label, emoji: current.emoji, color: current.color, key: current.key, prPoints: Math.round(prPoints) };
}