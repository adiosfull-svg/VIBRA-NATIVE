import { calcTables } from './tables';

// ─────────────────────────────────────────────────────────────────────────────
// CACHE degli aggregati "cross-promoter" (identità dell'array sorgente)
//
// Vibra VS calcola le statistiche di OGNI promoter (40+) sugli stessi array di presenze/clienti/
// eventi. Prima, per ciascun promoter si rifacevano: new Map(events), filter di tutti i clienti e
// di tutte le presenze, e per le 3 metriche Vibra VS (vittorie settimanali, streak, vittorie
// mensili) tre scansioni complete delle presenze con new Date()/padStart per riga: ~930ms su
// desktop per 40 promoter (≈3-4s su telefono) nel main thread, all'apertura del tab.
// Ora gli aggregati si calcolano UNA volta per (array presenze, array eventi, array promoter) e
// ogni promoter paga solo il proprio piccolo pezzo. I risultati sono identici (verificato su dati
// casuali, vedi test). Le cache sono WeakMap: si liberano da sole quando l'array sorgente (dati di
// React Query, immutabili per convenzione) non è più referenziato.
// ─────────────────────────────────────────────────────────────────────────────
const _eventsIdx = new WeakMap();   // events[] -> { byId: Map }
const _datedSorted = new WeakMap(); // eventsById Map -> eventi con data ordinati per data (stabile)
const _groupIdx = new WeakMap();    // array -> Map(promoter_id -> righe nell'ordine originale)
const _periodIdx = new WeakMap();   // attendances[] -> WeakMap(eventsById -> aggregati settimana/mese)

function getEventsById(events) {
  let idx = _eventsIdx.get(events);
  if (!idx) { idx = new Map(events.map(e => [e.id, e])); _eventsIdx.set(events, idx); }
  return idx;
}

function getDatedSortedEvents(eventsById) {
  let list = _datedSorted.get(eventsById);
  if (!list) {
    list = Array.from(eventsById.values()).filter(e => e.date).sort((a, b) => a.date.localeCompare(b.date));
    _datedSorted.set(eventsById, list);
  }
  return list;
}

function groupByPromoter(arr) {
  let m = _groupIdx.get(arr);
  if (!m) {
    m = new Map();
    for (const row of arr) {
      const g = m.get(row.promoter_id);
      if (g) g.push(row); else m.set(row.promoter_id, [row]);
    }
    _groupIdx.set(arr, m);
  }
  return m;
}

/**
 * Calcola le statistiche correnti di un promoter per la verifica degli achievement.
 */
export function computePromoterStats(promoter, clients, attendances, events, promoters = []) {
  // Righe del promoter da indici per promoter (stesso ordine e stessi elementi del filter originale)
  const myClients = groupByPromoter(clients).get(promoter.id) || [];
  const myAtts = (groupByPromoter(attendances).get(promoter.id) || []).filter(a => !a.client_id);
  const myAttsWithRevenue = myAtts.filter(a => a.present && (a.revenue || 0) > 0);

  // Lookup O(1) eventi (condiviso fra tutti i promoter, vedi cache sopra)
  const eventsById = getEventsById(events);

  const totalRevenue = myAtts.reduce((s, a) => s + (a.revenue || 0), 0);
  const totalPresences = myAttsWithRevenue.length;

  // Tavoli totali (stessa logica fatturato/soglia usata ovunque nell'app: tables.js calcTables)
  const totalTables = myAtts.reduce((s, a) => {
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) return s;
    return s + calcTables(a.revenue || 0, null, ev.table_threshold || 300);
  }, 0);

  const leadersCount = myClients.filter(c => c.is_leader).length;
  const referralsCount = myClients.filter(c => c.source_type === 'referred').length;
  const clientsWithInstagram = myClients.filter(c => c.instagram && c.instagram.trim() !== '').length;
  const clientsFromInstagram = myClients.filter(c => c.source_type === 'instagram').length;
  const clientsFromTiktok = myClients.filter(c => c.source_type === 'tiktok').length;

  // Profondità massima catena "amici di amici" nell'albero dei clienti del promoter
  const maxChainDepth = computeMaxReferralChainDepth(myClients);

  // Fatturato massimo in un singolo mese
  const monthlyMap = {};
  myAtts.forEach(a => {
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) return;
    const key = ev.date.slice(0, 7);
    monthlyMap[key] = (monthlyMap[key] || 0) + (a.revenue || 0);
  });
  const monthlyRevenue = Object.values(monthlyMap).length > 0 ? Math.max(...Object.values(monthlyMap)) : 0;

  // Fatturato massimo in una singola serata
  const singleEventRevenue = myAtts.length > 0 ? Math.max(...myAtts.map(a => a.revenue || 0)) : 0;

  // Zone geografiche coperte
  const zones = new Set(myClients.filter(c => c.residenza_key).map(c => c.residenza_key));

  // Tavoli massimi in un singolo mese
  const monthlyTablesMap = {};
  myAtts.forEach(a => {
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) return;
    const tables = calcTables(a.revenue || 0, null, ev.table_threshold || 300);
    const key = ev.date.slice(0, 7);
    monthlyTablesMap[key] = (monthlyTablesMap[key] || 0) + tables;
  });
  const monthlyTables = Object.values(monthlyTablesMap).length > 0 ? Math.round(Math.max(...Object.values(monthlyTablesMap)) * 10) / 10 : 0;

  // Tavoli in una singola serata
  const singleEventTables = myAtts.reduce((max, a) => {
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) return max;
    return Math.max(max, calcTables(a.revenue || 0, null, ev.table_threshold || 300));
  }, 0);

  // Dimensione team (promoter che hanno questo promoter come referente)
  const teamSize = promoters.filter(p => p.referente_id === promoter.id && p.status === 'attivo').length;

  // ── Vibra VS settimanale wins ──
  // Conta quante settimane (lun-dom) il promoter è risultato primo per fatturato
  const weeklyWins = computeVibraVSWeeklyWins(promoter, promoters, attendances, eventsById);
  const weeklyStreak = computeVibraVSWeeklyStreak(promoter, promoters, attendances, eventsById);
  const monthlyWin = computeVibraVSMonthlyWin(promoter, promoters, attendances, eventsById);

  // ── Tavoli in eventi consecutivi ──
  // Massimo numero di eventi consecutivi in cui hai fatto almeno 1 tavolo (≥300€)
  const consecutiveEventTables = computeConsecutiveEventTables(promoter, myAtts, eventsById);

  // ── Serate consecutive con almeno 1€ di fatturato ──
  // Considera TUTTE le serate in ordine cronologico: la streak si interrompe
  // appena il promoter non fattura (o non è presente) in una serata.
  const consecutivePresenceStreak = computeConsecutivePresenceStreak(myAtts, eventsById);

  // Guadagno totale: guadagno_pct (già in euro) + fuori_mano per ogni serata
  const totalEarnings = myAtts.reduce((s, a) => {
    return s + (a.guadagno_pct || 0) + (a.guadagno_fuori_mano || 0);
  }, 0);

  // Guadagno massimo in un singolo mese
  const monthlyEarningsMap = {};
  myAtts.forEach(a => {
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) return;
    const key = ev.date.slice(0, 7);
    const earning = (a.guadagno_pct || 0) + (a.guadagno_fuori_mano || 0);
    monthlyEarningsMap[key] = (monthlyEarningsMap[key] || 0) + earning;
  });
  const monthlyEarnings = Object.values(monthlyEarningsMap).length > 0 ? Math.max(...Object.values(monthlyEarningsMap)) : 0;

  // Fatturato massimo in un singolo weekend (ven+sab+dom consecutivi)
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
    vibra_vs_monthly_win: monthlyWin,
    consecutive_event_tables: consecutiveEventTables,
    max_referral_chain_depth: maxChainDepth,
    total_earnings: totalEarnings,
    monthly_earnings: monthlyEarnings,
    consecutive_weekend_revenue: consecutiveWeekendRevenue,
  };
}

/**
 * Calcola la profondità massima della catena "amici di amici" nell'albero dei clienti.
 * Ogni cliente con source_type='referred' punta a referred_by_client_id.
 * Troviamo la catena discendente più lunga a partire da qualsiasi radice.
 */
function computeMaxReferralChainDepth(myClients) {
  if (myClients.length === 0) return 0;
  // Mappa id → children ids
  const children = {};
  myClients.forEach(c => {
    if (c.source_type === 'referred' && c.referred_by_client_id) {
      if (!children[c.referred_by_client_id]) children[c.referred_by_client_id] = [];
      children[c.referred_by_client_id].push(c.id);
    }
  });
  // BFS/DFS da ogni nodo radice (clienti non referred o il cui referente non è nel nostro portafoglio)
  const clientIds = new Set(myClients.map(c => c.id));
  const roots = myClients.filter(c => !c.referred_by_client_id || !clientIds.has(c.referred_by_client_id));
  let maxDepth = 0;
  function dfs(id, depth) {
    if (depth > maxDepth) maxDepth = depth;
    (children[id] || []).forEach(childId => dfs(childId, depth + 1));
  }
  roots.forEach(r => dfs(r.id, 1));
  return maxDepth;
}

// ── Helpers Vibra VS ──

function getWeekKey(dateStr) {
  // Ritorna "YYYY-Www" (anno-settimana ISO) in modo semplice
  const d = new Date(dateStr);
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1; // 0=lun
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

function buildWeeklyRevenue(promoters, attendances, eventsById) {
  // { weekKey: { promoterId: revenue } }
  const map = {};
  attendances.forEach(a => {
    if (!a.promoter_id || a.client_id) return;
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) return;
    const wk = getWeekKey(ev.date);
    if (!map[wk]) map[wk] = {};
    map[wk][a.promoter_id] = (map[wk][a.promoter_id] || 0) + (a.revenue || 0);
  });
  return map;
}

function buildMonthlyRevenue(attendances, eventsById) {
  // { monthKey: { promoterId: revenue } }
  const monthMap = {};
  attendances.forEach(a => {
    if (!a.promoter_id || a.client_id) return;
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) return;
    const mk = ev.date.slice(0, 7);
    if (!monthMap[mk]) monthMap[mk] = {};
    monthMap[mk][a.promoter_id] = (monthMap[mk][a.promoter_id] || 0) + (a.revenue || 0);
  });
  return monthMap;
}

function getActivePromoterIds(promoters) {
  return new Set(
    promoters
      .filter(p => p.status !== 'inattivo' && p.ruolo !== 'ragazza_immagine')
      .map(p => p.id)
  );
}

// Per ogni periodo: quanti promoter ATTIVI hanno dati e il fatturato massimo fra loro.
function summarizePeriods(periodMap, activeIds) {
  const out = [];
  for (const key of Object.keys(periodMap).sort()) {
    const revs = periodMap[key];
    let activeCount = 0;
    let best = -Infinity;
    for (const id of Object.keys(revs)) {
      if (!activeIds.has(id)) continue;
      activeCount++;
      if (revs[id] > best) best = revs[id];
    }
    out.push({ revs, activeCount, best });
  }
  return out;
}

// Aggregati settimana/mese + riepiloghi dei vincitori, calcolati UNA volta per
// (presenze, eventi, promoter). Ogni promoter poi conta le proprie vittorie in O(periodi).
function getVibraVSAggregates(promoters, attendances, eventsById) {
  let inner = _periodIdx.get(attendances);
  if (!inner) { inner = new WeakMap(); _periodIdx.set(attendances, inner); }
  let agg = inner.get(eventsById);
  if (!agg) {
    agg = { weekly: buildWeeklyRevenue(promoters, attendances, eventsById), monthly: buildMonthlyRevenue(attendances, eventsById), byPromoters: new WeakMap() };
    inner.set(eventsById, agg);
  }
  let summary = agg.byPromoters.get(promoters);
  if (!summary) {
    const activeIds = getActivePromoterIds(promoters);
    summary = { weeks: summarizePeriods(agg.weekly, activeIds), months: summarizePeriods(agg.monthly, activeIds) };
    agg.byPromoters.set(promoters, summary);
  }
  return summary;
}

function computeVibraVSWeeklyWins(promoter, promoters, attendances, eventsById) {
  const { weeks } = getVibraVSAggregates(promoters, attendances, eventsById);
  let wins = 0;
  for (const { revs, activeCount, best } of weeks) {
    // Solo settimane con almeno 2 promoter attivi con dati
    if (activeCount < 2) continue;
    if (best > 0 && (revs[promoter.id] || 0) === best) wins++;
  }
  return wins;
}

function computeVibraVSWeeklyStreak(promoter, promoters, attendances, eventsById) {
  const { weeks } = getVibraVSAggregates(promoters, attendances, eventsById);
  // Le settimane sono già in ordine cronologico
  let maxStreak = 0;
  let cur = 0;
  for (const { revs, activeCount, best } of weeks) {
    if (activeCount < 2) { cur = 0; continue; }
    if (best > 0 && (revs[promoter.id] || 0) === best) {
      cur++;
      if (cur > maxStreak) maxStreak = cur;
    } else {
      cur = 0;
    }
  }
  return maxStreak;
}

function computeVibraVSMonthlyWin(promoter, promoters, attendances, eventsById) {
  const { months } = getVibraVSAggregates(promoters, attendances, eventsById);
  let wins = 0;
  for (const { revs, activeCount, best } of months) {
    if (activeCount < 2) continue;
    if (best > 0 && (revs[promoter.id] || 0) === best) wins++;
  }
  return wins;
}

function computeConsecutivePresenceStreak(myAtts, eventsById) {
  // Fatturato per evento (somma nel caso di più righe sullo stesso evento)
  const revenueByEvent = {};
  myAtts.forEach(a => {
    revenueByEvent[a.event_id] = (revenueByEvent[a.event_id] || 0) + (a.revenue || 0);
  });

  // Trova la prima serata in cui il promoter ha una presenza registrata (inizio del conteggio)
  const myEventDates = myAtts
    .map(a => eventsById.get(a.event_id)?.date)
    .filter(Boolean);
  if (myEventDates.length === 0) return 0;
  const minDate = myEventDates.reduce((min, d) => (d < min ? d : min));

  // Considera TUTTE le serate (di ogni locale) da quel momento in poi, in ordine cronologico:
  // una serata senza fatturato registrato (anche se manca la riga di presenza) conta come 0
  // e interrompe la streak, esattamente come una serata fatturata 0.
  // (lista datata e ordinata calcolata una volta per tutti i promoter; qui si salta ciò che precede minDate)
  const allEventsSorted = getDatedSortedEvents(eventsById);

  let maxStreak = 0;
  let cur = 0;
  for (const ev of allEventsSorted) {
    if (ev.date < minDate) continue;
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

function computeConsecutiveEventTables(promoter, myAtts, eventsById) {
  // Ordina le presenze del promoter per data evento
  const attsByDate = myAtts
    .map(a => {
      const ev = eventsById.get(a.event_id);
      if (!ev?.date) return null;
      const tables = calcTables(a.revenue || 0, null, ev.table_threshold || 300);
      return { date: ev.date, tables };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));

  let maxStreak = 0;
  let cur = 0;
  attsByDate.forEach(({ tables }) => {
    if (tables >= 1) {
      cur++;
      if (cur > maxStreak) maxStreak = cur;
    } else {
      cur = 0;
    }
  });
  return maxStreak;
}

/**
 * Fatturato massimo ottenuto in un singolo weekend consecutivo (ven+sab+dom).
 * Un weekend è valido solo se esistono presenze su tutti e 3 i giorni (ven, sab, dom)
 * che appartengono alla stessa settimana del venerdì.
 */
function computeConsecutiveWeekendRevenue(myAtts, eventsById) {
  // Mappa data → revenue promoter in quella serata
  const dateRevMap = {};
  myAtts.forEach(a => {
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) return;
    dateRevMap[ev.date] = (dateRevMap[ev.date] || 0) + (a.revenue || 0);
  });

  // Formatta una Date in "YYYY-MM-DD" usando il tempo LOCALE.
  // NON usare toISOString(): converte in UTC e nei fusi con offset (es. Europe/Rome
  // UTC+2) la mezzanotte locale slitta al giorno precedente, facendo coincidere
  // sabato/domenica con venerdì/sabato e gonfiando il totale del weekend.
  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Raggruppa le serate per weekend (ancorato sul venerdì).
  // Considera TUTTE le serate di ven/sab/dom, incluse le serate extra che
  // cadono in quei giorni (es. Ferragosto di venerdì/sabato). Non richiede
  // più tutti e 3 i giorni: basta che ci siano almeno 2 giorni del weekend
  // con presenze, così un weekend extra di soli ven+sab conta comunque.
  const weekendData = {}; // friStr -> { total, days: Set }
  Object.keys(dateRevMap).forEach(dateStr => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    if (dow !== 5 && dow !== 6 && dow !== 0) return; // solo ven/sab/dom
    const fri = new Date(y, m - 1, d);
    if (dow === 6) fri.setDate(fri.getDate() - 1);
    else if (dow === 0) fri.setDate(fri.getDate() - 2);
    const friStr = toLocalDateStr(fri);
    if (!weekendData[friStr]) weekendData[friStr] = { total: 0, days: new Set() };
    weekendData[friStr].total += dateRevMap[dateStr];
    weekendData[friStr].days.add(dateStr);
  });

  let maxWeekend = 0;
  Object.values(weekendData).forEach(w => {
    if (w.days.size >= 2 && w.total > maxWeekend) maxWeekend = w.total;
  });

  return maxWeekend;
}

export function getAchievementProgress(achievement, stats) {
  const current = stats[achievement.condition_type] ?? 0;
  const target = achievement.condition_value;
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return { current, target, percent };
}

/**
 * Calcola il progresso di un achievement rispetto a tutta la sua "famiglia"
 * (tutti gli achievement con lo stesso condition_type, es. bronzo→leggenda).
 * La barra è scalata sul target più alto della famiglia (leggenda), con un
 * checkpoint per ogni rango. Se il valore attuale supera il massimo, la barra
 * risulta "maxata" e viene calcolato l'overflow (di quanto si è andati oltre).
 */
export function getFamilyProgress(achievement, allAchievements, stats) {
  const current = stats[achievement.condition_type] ?? 0;
  const family = allAchievements
    .filter(a => a.condition_type === achievement.condition_type)
    .sort((a, b) => a.condition_value - b.condition_value);
  const maxValue = family.length > 0 ? family[family.length - 1].condition_value : achievement.condition_value;
  const percent = maxValue > 0 ? Math.min(100, Math.round((current / maxValue) * 100)) : 0;
  const isMaxed = maxValue > 0 && current >= maxValue;
  const overflow = isMaxed ? Math.max(0, current - maxValue) : 0;
  const checkpoints = family.map(a => ({
    value: a.condition_value,
    rarity: a.rarity,
    isOwn: a.id === achievement.id,
    position: maxValue > 0 ? Math.min(100, (a.condition_value / maxValue) * 100) : 0,
    achieved: current >= a.condition_value,
  }));
  return { current, maxValue, percent, isMaxed, overflow, checkpoints };
}

/**
 * Verifica automaticamente quali achievement sono sbloccati in base alle stats.
 */
export function computeAutoUnlocked(achievements, stats) {
  const unlocked = new Set();
  achievements.forEach(a => {
    const current = stats[a.condition_type] ?? 0;
    if (current >= a.condition_value) {
      unlocked.add(a.id);
    }
  });
  return unlocked;
}

export const RARITY_ORDER = ['leggenda', 'master', 'platino', 'oro', 'argento', 'bronzo'];

export const RARITY_COLORS = {
  bronzo:   { bg: 'bg-amber-900/30',   border: 'border-amber-700/50',   text: 'text-amber-400'   },
  argento:  { bg: 'bg-slate-700/30',   border: 'border-slate-500/50',   text: 'text-slate-300'   },
  oro:      { bg: 'bg-yellow-900/30',  border: 'border-yellow-500/50',  text: 'text-yellow-400'  },
  platino:  { bg: 'bg-violet-900/30',  border: 'border-violet-500/50',  text: 'text-violet-400'  },
  master:   { bg: 'bg-cyan-900/30',    border: 'border-cyan-400/60',    text: 'text-cyan-300'    },
  leggenda: { bg: 'bg-rose-900/30',    border: 'border-rose-400/60',    text: 'text-rose-300'    },
};

export const RARITY_LABELS = {
  bronzo:   '🥉 Bronzo',
  argento:  '🥈 Argento',
  oro:      '🥇 Oro',
  platino:  '💎 Platino',
  master:   '🔷 Master',
  leggenda: '🔥 Leggenda',
};

// Badge gagliardetto per completamento di tutte le rarità
export const RARITY_BADGE = {
  bronzo:   { emoji: '🛡️',  label: 'VIBRA di Bronzo',    desc: 'Tutti i traguardi Bronzo completati',    gradient: 'from-amber-800 to-amber-600'  },
  argento:  { emoji: '⚔️',  label: 'Su una strada d\Argento',    desc: 'Tutti i traguardi Argento completati',   gradient: 'from-slate-600 to-slate-400'  },
  oro:      { emoji: '👑',  label: 'La Corona d\'Oro di VIBRA',       desc: 'Tutti i traguardi Oro completati',       gradient: 'from-yellow-700 to-yellow-400' },
  platino:  { emoji: '💠',  label: 'Disco di PLATINO',desc: 'Tutti i traguardi Platino completati',   gradient: 'from-violet-800 to-violet-400' },
  master:   { emoji: '🌟',  label: 'Master Promoter',       desc: 'Tutti i traguardi Master completati',    gradient: 'from-cyan-800 to-cyan-400'    },
  leggenda: { emoji: '🔱',  label: 'IO sono Leggenda',   desc: 'Tutti i traguardi Leggenda completati',  gradient: 'from-rose-800 to-rose-400'    },
};

export const CATEGORY_LABELS = {
  clienti:    '👥 Clienti',
  fatturato:  '💰 Fatturato',
  guadagni:   '💵 Guadagni',
  presenze:   '📅 Presenze',
  leadership: '⭐ Leadership',
  speciale:   '✨ Speciale',
};

export const CONDITION_LABELS = {
  consecutive_weekend_revenue: 'Fatturato in un weekend (Ven-Sab-Dom) (€)',
  total_clients:            'Clienti totali',
  total_revenue:            'Fatturato totale (€)',
  total_earnings:           'Guadagno totale (€)',
  monthly_earnings:         'Guadagno in un mese (€)',
  total_presences:          'Serate fatturate',
  total_tables:             'Tavoli totali',
  leaders_count:            'Clienti Leader',
  referrals_count:          'Amici di amici ricevuti',
  clients_with_instagram:   'Clienti con Instagram',
  clients_from_instagram:   'Paganti conosciuti via Instagram',
  clients_from_tiktok:      'Paganti conosciuti via TikTok',
  monthly_revenue:          'Fatturato in un mese (€)',
  consecutive_presences:    'Serate fatturate',
  single_event_revenue:     'Fatturato in una serata (€)',
  multi_zone_clients:       'Zone geografiche coperte',
  monthly_tables:           'Tavoli in un mese',
  single_event_tables:      'Tavoli in una serata',
  team_size:                'Promoter nel team',
  vibra_vs_weekly_wins:     'Vittorie Vibra VS settimanale',
  vibra_vs_weekly_streak:   'Settimane vinte di fila (VS)',
  vibra_vs_monthly_win:     'Vittorie Vibra VS mensile',
  consecutive_event_tables: 'Serate consecutive con ≥1 tavolo',
  max_referral_chain_depth: 'Livelli nell\'albero "amici di amici"',
};