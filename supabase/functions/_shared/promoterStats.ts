/**
 * Port TypeScript di computePromoterStats (src/utils/achievementLogic.js).
 * Usato da recomputeCumulativeStats (snapshot bacheca achievement) e
 * checkAchievements (sblocco real-time). Unica fonte di verità lato backend
 * per le statistiche che determinano gli achievement.
 */

export const RARITY_ORDER = ['leggenda', 'master', 'platino', 'oro', 'argento', 'bronzo'];

function calcTables(revenue, dow, customThreshold, fallbackThreshold = 300) {
  if (!revenue || revenue <= 0) return 0;
  const threshold = customThreshold ?? fallbackThreshold;
  return Math.round((revenue / threshold) * 10) / 10;
}

function computeAvgThreshold(events) {
  let sum = 0, count = 0;
  for (const ev of events) {
    if (ev.table_threshold != null && ev.table_threshold > 0) {
      sum += ev.table_threshold;
      count++;
    }
  }
  return count > 0 ? sum / count : 300;
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1;
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

function buildWeeklyRevenue(attendances, eventsById) {
  const map = {};
  for (const a of attendances) {
    if (!a.promoter_id || a.client_id) continue;
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    const wk = getWeekKey(ev.date);
    if (!map[wk]) map[wk] = {};
    map[wk][a.promoter_id] = (map[wk][a.promoter_id] || 0) + (a.revenue || 0);
  }
  return map;
}

function getActivePromoterIds(promoters) {
  const set = new Set();
  for (const p of promoters) {
    if (p.status !== 'inattivo' && p.ruolo !== 'ragazza_immagine') set.add(p.id);
  }
  return set;
}

function computeVibraVSWeeklyWins(promoterId, promoters, attendances, eventsById) {
  const weeklyMap = buildWeeklyRevenue(attendances, eventsById);
  const activeIds = getActivePromoterIds(promoters);
  let wins = 0;
  for (const weekRevs of Object.values(weeklyMap)) {
    const active = [];
    for (const [id, r] of Object.entries(weekRevs)) {
      if (activeIds.has(id)) active.push(r);
    }
    if (active.length < 2) continue;
    const best = Math.max(...active);
    if (best > 0 && (weekRevs[promoterId] || 0) === best) wins++;
  }
  return wins;
}

function computeVibraVSStreaks(promoterId, promoters, attendances, eventsById) {
  const weeklyMap = buildWeeklyRevenue(attendances, eventsById);
  const activeIds = getActivePromoterIds(promoters);
  const weeks = Object.keys(weeklyMap).sort();
  let maxStreak = 0, cur = 0, currentStreak = 0;
  for (const wk of weeks) {
    const weekRevs = weeklyMap[wk];
    const active = [];
    for (const [id, r] of Object.entries(weekRevs)) {
      if (activeIds.has(id)) active.push(r);
    }
    if (active.length < 2) { cur = 0; continue; }
    const best = Math.max(...active);
    if (best > 0 && (weekRevs[promoterId] || 0) === best) {
      cur++;
      if (cur > maxStreak) maxStreak = cur;
      currentStreak = cur;
    } else {
      cur = 0;
      currentStreak = 0;
    }
  }
  return { maxStreak, currentStreak };
}

function computeVibraVSMonthlyWin(promoterId, promoters, attendances, eventsById) {
  const monthMap = {};
  for (const a of attendances) {
    if (!a.promoter_id || a.client_id) continue;
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    const mk = ev.date.slice(0, 7);
    if (!monthMap[mk]) monthMap[mk] = {};
    monthMap[mk][a.promoter_id] = (monthMap[mk][a.promoter_id] || 0) + (a.revenue || 0);
  }
  const activeIds = getActivePromoterIds(promoters);
  let wins = 0;
  for (const monthRevs of Object.values(monthMap)) {
    const active = [];
    for (const [id, r] of Object.entries(monthRevs)) {
      if (activeIds.has(id)) active.push(r);
    }
    if (active.length < 2) continue;
    const best = Math.max(...active);
    if (best > 0 && (monthRevs[promoterId] || 0) === best) wins++;
  }
  return wins;
}

function computeMaxReferralChainDepth(myClients) {
  if (myClients.length === 0) return 0;
  const children = {};
  for (const c of myClients) {
    if (c.source_type === 'referred' && c.referred_by_client_id) {
      if (!children[c.referred_by_client_id]) children[c.referred_by_client_id] = [];
      children[c.referred_by_client_id].push(c.id);
    }
  }
  const clientIds = new Set();
  for (const c of myClients) clientIds.add(c.id);
  const roots = [];
  for (const c of myClients) {
    if (!c.referred_by_client_id || !clientIds.has(c.referred_by_client_id)) roots.push(c);
  }
  let maxDepth = 0;
  function dfs(id, depth) {
    if (depth > maxDepth) maxDepth = depth;
    const ch = children[id] || [];
    for (const childId of ch) dfs(childId, depth + 1);
  }
  for (const r of roots) dfs(r.id, 1);
  return maxDepth;
}

function computeConsecutivePresenceStreak(myAtts, eventsById) {
  const revenueByEvent = {};
  for (const a of myAtts) {
    revenueByEvent[a.event_id] = (revenueByEvent[a.event_id] || 0) + (a.revenue || 0);
  }
  const myEventDates = [];
  for (const a of myAtts) {
    const d = eventsById[a.event_id]?.date;
    if (d) myEventDates.push(d);
  }
  if (myEventDates.length === 0) return 0;
  let minDate = myEventDates[0];
  for (const d of myEventDates) { if (d < minDate) minDate = d; }
  const allEventsSorted = [];
  for (const ev of Object.values(eventsById)) {
    if (ev.date && ev.date >= minDate) allEventsSorted.push(ev);
  }
  allEventsSorted.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  let maxStreak = 0, cur = 0;
  for (const ev of allEventsSorted) {
    const revenue = revenueByEvent[ev.id] || 0;
    if (revenue >= 1) {
      cur++;
      if (cur > maxStreak) maxStreak = cur;
    } else {
      cur = 0;
    }
  }
  return maxStreak;
}

function computeConsecutiveEventTables(myAtts, eventsById, avgThreshold) {
  const attsByDate = [];
  for (const a of myAtts) {
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    const tables = calcTables(a.revenue || 0, null, ev.table_threshold, avgThreshold);
    attsByDate.push({ date: ev.date, tables });
  }
  attsByDate.sort((a, b) => a.date.localeCompare(b.date));
  let maxStreak = 0, cur = 0;
  for (const item of attsByDate) {
    if (item.tables >= 1) {
      cur++;
      if (cur > maxStreak) maxStreak = cur;
    } else {
      cur = 0;
    }
  }
  return maxStreak;
}

function computeConsecutiveWeekendRevenue(myAtts, eventsById) {
  const dateRevMap = {};
  for (const a of myAtts) {
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    dateRevMap[ev.date] = (dateRevMap[ev.date] || 0) + (a.revenue || 0);
  }
  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  // Raggruppa le serate per weekend (ancorato sul venerdì). Considera tutte
  // le serate di ven/sab/dom, incluse le serate extra che cadono in quei giorni.
  // Non richiede tutti e 3 i giorni: basta che ci siano almeno 2 giorni del
  // weekend con presenze (es. weekend extra di soli ven+sab conta comunque).
  const weekendData: Record<string, { total: number; days: Set<string> }> = {};
  for (const dateStr of Object.keys(dateRevMap)) {
    const parts = dateStr.split('-').map(Number);
    const dow = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
    if (dow !== 5 && dow !== 6 && dow !== 0) continue;
    const fri = new Date(parts[0], parts[1] - 1, parts[2]);
    if (dow === 6) fri.setDate(fri.getDate() - 1);
    else if (dow === 0) fri.setDate(fri.getDate() - 2);
    const friStr = toLocalDateStr(fri);
    if (!weekendData[friStr]) weekendData[friStr] = { total: 0, days: new Set() };
    weekendData[friStr].total += dateRevMap[dateStr];
    weekendData[friStr].days.add(dateStr);
  }
  let maxWeekend = 0;
  for (const w of Object.values(weekendData)) {
    if (w.days.size >= 2 && w.total > maxWeekend) maxWeekend = w.total;
  }
  return maxWeekend;
}

export function computePromoterStats(promoter, clients, attendances, events, promoters) {
  const myClients = [];
  for (const c of clients) { if (c.promoter_id === promoter.id) myClients.push(c); }
  const eventsById = {};
  for (const e of events) eventsById[e.id] = e;

  // Media delle soglie: fallback per eventi senza table_threshold (invece di 300)
  const avgThreshold = computeAvgThreshold(events);

  // Solo presenze con serata esistente: le orfane (serata cancellata) non contano.
  const myAtts = [];
  for (const a of attendances) { if (a.promoter_id === promoter.id && !a.client_id && eventsById[a.event_id]) myAtts.push(a); }
  const myAttsWithRevenue = [];
  for (const a of myAtts) { if (a.present && (a.revenue || 0) > 0) myAttsWithRevenue.push(a); }

  let totalRevenue = 0;
  for (const a of myAtts) totalRevenue += (a.revenue || 0);
  const totalPresences = myAttsWithRevenue.length;

  let totalTables = 0;
  for (const a of myAtts) {
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    totalTables += calcTables(a.revenue || 0, null, ev.table_threshold, avgThreshold);
  }

  let leadersCount = 0, referralsCount = 0, clientsWithInstagram = 0, clientsFromInstagram = 0, clientsFromTiktok = 0;
  for (const c of myClients) {
    if (c.is_leader) leadersCount++;
    if (c.source_type === 'referred') referralsCount++;
    if (c.instagram && c.instagram.trim() !== '') clientsWithInstagram++;
    if (c.source_type === 'instagram') clientsFromInstagram++;
    if (c.source_type === 'tiktok') clientsFromTiktok++;
  }

  const maxChainDepth = computeMaxReferralChainDepth(myClients);

  const monthlyMap = {};
  for (const a of myAtts) {
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    const key = ev.date.slice(0, 7);
    monthlyMap[key] = (monthlyMap[key] || 0) + (a.revenue || 0);
  }
  const monthlyValues = Object.values(monthlyMap);
  const monthlyRevenue = monthlyValues.length > 0 ? Math.max(...monthlyValues) : 0;

  let singleEventRevenue = 0;
  for (const a of myAtts) { if ((a.revenue || 0) > singleEventRevenue) singleEventRevenue = (a.revenue || 0); }

  const zones = new Set();
  for (const c of myClients) { if (c.residenza_key) zones.add(c.residenza_key); }

  const monthlyTablesMap = {};
  for (const a of myAtts) {
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    const tables = calcTables(a.revenue || 0, null, ev.table_threshold, avgThreshold);
    const key = ev.date.slice(0, 7);
    monthlyTablesMap[key] = (monthlyTablesMap[key] || 0) + tables;
  }
  const monthlyTablesValues = Object.values(monthlyTablesMap);
  const monthlyTables = monthlyTablesValues.length > 0 ? Math.round(Math.max(...monthlyTablesValues) * 10) / 10 : 0;

  let singleEventTables = 0;
  for (const a of myAtts) {
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    const t = calcTables(a.revenue || 0, null, ev.table_threshold, avgThreshold);
    if (t > singleEventTables) singleEventTables = t;
  }

  let teamSize = 0;
  for (const p of promoters) { if (p.referente_id === promoter.id && p.status === 'attivo') teamSize++; }

  const weeklyWins = computeVibraVSWeeklyWins(promoter.id, promoters, attendances, eventsById);
  const { maxStreak: weeklyStreak, currentStreak: weeklyCurrentStreak } = computeVibraVSStreaks(promoter.id, promoters, attendances, eventsById);
  const monthlyWin = computeVibraVSMonthlyWin(promoter.id, promoters, attendances, eventsById);

  const consecutiveEventTables = computeConsecutiveEventTables(myAtts, eventsById, avgThreshold);
  const consecutivePresenceStreak = computeConsecutivePresenceStreak(myAtts, eventsById);

  let totalEarnings = 0;
  for (const a of myAtts) totalEarnings += (a.guadagno_pct || 0) + (a.guadagno_fuori_mano || 0);

  const monthlyEarningsMap = {};
  for (const a of myAtts) {
    const ev = eventsById[a.event_id];
    if (!ev?.date) continue;
    const key = ev.date.slice(0, 7);
    const earning = (a.guadagno_pct || 0) + (a.guadagno_fuori_mano || 0);
    monthlyEarningsMap[key] = (monthlyEarningsMap[key] || 0) + earning;
  }
  const monthlyEarningsValues = Object.values(monthlyEarningsMap);
  const monthlyEarnings = monthlyEarningsValues.length > 0 ? Math.max(...monthlyEarningsValues) : 0;

  const consecutiveWeekendRevenue = computeConsecutiveWeekendRevenue(myAtts, eventsById);

  return {
    total_clients: myClients.length,
    total_revenue: totalRevenue,
    total_presences: totalPresences,
    total_tables: totalTables,
    leaders_count: leadersCount,
    referrals_count: referralsCount,
    clients_with_instagram: clientsWithInstagram,
    clients_from_instagram: clientsFromInstagram,
    clients_from_tiktok: clientsFromTiktok,
    monthly_revenue: monthlyRevenue,
    consecutive_presences: consecutivePresenceStreak,
    single_event_revenue: singleEventRevenue,
    multi_zone_clients: zones.size,
    monthly_tables: monthlyTables,
    single_event_tables: singleEventTables,
    team_size: teamSize,
    vibra_vs_weekly_wins: weeklyWins,
    vibra_vs_weekly_streak: weeklyStreak,
    vibra_vs_current_streak: weeklyCurrentStreak,
    vibra_vs_monthly_win: monthlyWin,
    consecutive_event_tables: consecutiveEventTables,
    max_referral_chain_depth: maxChainDepth,
    total_earnings: totalEarnings,
    monthly_earnings: monthlyEarnings,
    consecutive_weekend_revenue: consecutiveWeekendRevenue,
  };
}

/**
 * Calcola il riepilogo della Bacheca Riconoscimenti per un promoter:
 * totale achievement attivi, quanti sbloccati, e breakdown per rarità.
 * Rispecchia esattamente computeAutoUnlocked + raggruppamento del frontend.
 */
export function computeAchievementsBacheta(achievements, stats) {
  const byRarity = {};
  for (const r of RARITY_ORDER) byRarity[r] = { total: 0, unlocked: 0 };
  let unlocked = 0;
  for (const ach of achievements) {
    const r = ach.rarity || 'bronzo';
    if (!byRarity[r]) byRarity[r] = { total: 0, unlocked: 0 };
    byRarity[r].total++;
    const cur = stats[ach.condition_type] ?? 0;
    if (cur >= ach.condition_value) {
      byRarity[r].unlocked++;
      unlocked++;
    }
  }
  return { total: achievements.length, unlocked, byRarity };
}