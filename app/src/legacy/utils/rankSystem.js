/**
 * Sistema di Rank basato su Punti PR (Prestige Ranking)
 * Ogni achievement vale un certo numero di PR points in base alla rarità.
 * I PR points determinano il rank del promoter.
 * Il progresso verso il rank include anche la quota parziale degli achievement in corso.
 */

// Punti PR per rarità achievement
export const PR_POINTS_BY_RARITY = {
  bronzo:   50,
  argento:  150,
  oro:      400,
  platino:  1000,
  master:   2500,
  leggenda: 5000,
};

// Icone distinte per livello 1, 2, 3 (progressivamente più elaborate)
// tier → [lvl1, lvl2, lvl3]
const TIER_EMOJIS = {
  bronzo:   ['🪙', '🥉', '🏅'],
  argento:  ['🌫️', '🥈', '⚔️'],
  oro:      ['✨', '🥇', '👑'],
  platino:  ['💠', '💎', '🔮'],
  master:   ['⭐', '🌟', '🌠'],
  leggenda: ['🔥', '💥', '⚡'],
};

// Definizione dei rank in ordine crescente
// Ogni tier ha 3 livelli. GOAT è il finale (tutti gli achievement sbloccati)
// Soglie calibrate sui dati reali (146 ach totali: 22B+24A+29O+28P+26M+17L = 194.300pt max):
// Bronzo I: 0 | Bronzo II: 300 (~6 bronzo) | Bronzo III: 700 (~14 bronzo)
// Argento I: 1100 (tutti bronzo) | Argento II: 2500 | Argento III: 4700 (tutti argento)
// Oro I: 7000 | Oro II: 11000 | Oro III: 16300 (tutti oro)
// Platino I: 22000 | Platino II: 32000 | Platino III: 44300 (tutti platino)
// Master I: 57000 | Master II: 77000 | Master III: 96000 (~95% master)
// Leggenda I: 114000 | Leggenda II: 150000 | Leggenda III: 180000
export const RANK_TIERS = [
  // Bronzo
  { key: 'bronzo_1',   tier: 'bronzo',   level: 1, label: 'Bronzo I',    minPR: 0,      emoji: TIER_EMOJIS.bronzo[0],   color: '#cd7f32', gradient: 'from-amber-900 to-amber-700', glow: 'rgba(205,127,50,0.3)'  },
  { key: 'bronzo_2',   tier: 'bronzo',   level: 2, label: 'Bronzo II',   minPR: 300,    emoji: TIER_EMOJIS.bronzo[1],   color: '#cd7f32', gradient: 'from-amber-900 to-amber-700', glow: 'rgba(205,127,50,0.3)'  },
  { key: 'bronzo_3',   tier: 'bronzo',   level: 3, label: 'Bronzo III',  minPR: 700,    emoji: TIER_EMOJIS.bronzo[2],   color: '#cd7f32', gradient: 'from-amber-900 to-amber-700', glow: 'rgba(205,127,50,0.3)'  },
  // Argento
  { key: 'argento_1',  tier: 'argento',  level: 1, label: 'Argento I',   minPR: 1100,   emoji: TIER_EMOJIS.argento[0],  color: '#c0c0c0', gradient: 'from-slate-600 to-slate-400', glow: 'rgba(192,192,192,0.3)' },
  { key: 'argento_2',  tier: 'argento',  level: 2, label: 'Argento II',  minPR: 2500,   emoji: TIER_EMOJIS.argento[1],  color: '#c0c0c0', gradient: 'from-slate-600 to-slate-400', glow: 'rgba(192,192,192,0.3)' },
  { key: 'argento_3',  tier: 'argento',  level: 3, label: 'Argento III', minPR: 4700,   emoji: TIER_EMOJIS.argento[2],  color: '#c0c0c0', gradient: 'from-slate-600 to-slate-400', glow: 'rgba(192,192,192,0.3)' },
  // Oro
  { key: 'oro_1',      tier: 'oro',      level: 1, label: 'Oro I',       minPR: 7000,   emoji: TIER_EMOJIS.oro[0],      color: '#ffd700', gradient: 'from-yellow-700 to-yellow-500', glow: 'rgba(255,215,0,0.35)'  },
  { key: 'oro_2',      tier: 'oro',      level: 2, label: 'Oro II',      minPR: 11000,  emoji: TIER_EMOJIS.oro[1],      color: '#ffd700', gradient: 'from-yellow-700 to-yellow-500', glow: 'rgba(255,215,0,0.35)'  },
  { key: 'oro_3',      tier: 'oro',      level: 3, label: 'Oro III',     minPR: 16300,  emoji: TIER_EMOJIS.oro[2],      color: '#ffd700', gradient: 'from-yellow-700 to-yellow-500', glow: 'rgba(255,215,0,0.35)'  },
  // Platino
  { key: 'platino_1',  tier: 'platino',  level: 1, label: 'Platino I',   minPR: 22000,  emoji: TIER_EMOJIS.platino[0],  color: '#a78bfa', gradient: 'from-violet-800 to-violet-500', glow: 'rgba(167,139,250,0.4)' },
  { key: 'platino_2',  tier: 'platino',  level: 2, label: 'Platino II',  minPR: 32000,  emoji: TIER_EMOJIS.platino[1],  color: '#a78bfa', gradient: 'from-violet-800 to-violet-500', glow: 'rgba(167,139,250,0.4)' },
  { key: 'platino_3',  tier: 'platino',  level: 3, label: 'Platino III', minPR: 44300,  emoji: TIER_EMOJIS.platino[2],  color: '#a78bfa', gradient: 'from-violet-800 to-violet-500', glow: 'rgba(167,139,250,0.4)' },
  // Master
  { key: 'master_1',   tier: 'master',   level: 1, label: 'Master I',    minPR: 57000,  emoji: TIER_EMOJIS.master[0],   color: '#67e8f9', gradient: 'from-cyan-800 to-cyan-500', glow: 'rgba(103,232,249,0.4)'   },
  { key: 'master_2',   tier: 'master',   level: 2, label: 'Master II',   minPR: 77000,  emoji: TIER_EMOJIS.master[1],   color: '#67e8f9', gradient: 'from-cyan-800 to-cyan-500', glow: 'rgba(103,232,249,0.4)'   },
  { key: 'master_3',   tier: 'master',   level: 3, label: 'Master III',  minPR: 96000,  emoji: TIER_EMOJIS.master[2],   color: '#67e8f9', gradient: 'from-cyan-800 to-cyan-500', glow: 'rgba(103,232,249,0.4)'   },
  // Leggenda
  { key: 'leggenda_1', tier: 'leggenda', level: 1, label: 'Leggenda I',  minPR: 114000, emoji: TIER_EMOJIS.leggenda[0], color: '#fb923c', gradient: 'from-rose-800 to-orange-500', glow: 'rgba(251,146,60,0.45)'  },
  { key: 'leggenda_2', tier: 'leggenda', level: 2, label: 'Leggenda II', minPR: 150000, emoji: TIER_EMOJIS.leggenda[1], color: '#fb923c', gradient: 'from-rose-800 to-orange-500', glow: 'rgba(251,146,60,0.45)'  },
  { key: 'leggenda_3', tier: 'leggenda', level: 3, label: 'Leggenda III',minPR: 180000, emoji: TIER_EMOJIS.leggenda[2], color: '#fb923c', gradient: 'from-rose-800 to-orange-500', glow: 'rgba(251,146,60,0.45)'  },
  // GOAT — rank finale: SOLO quando tutti gli achievement sono sbloccati
  { key: 'goat', tier: 'goat', level: 0, label: 'G.O.A.T.', minPR: 999999, emoji: '👑', color: '#f9e44c', gradient: 'from-yellow-400 via-orange-400 to-rose-500', glow: 'rgba(249,228,76,0.6)' },
];

/**
 * Calcola i PR points "effettivi" = achievement sbloccati + quota proporzionale di quelli in corso.
 * Esempio: achievement da 400pt (oro) con progresso 78% → contribuisce 0.78 × 400 = 312pt.
 * Questo rende il rank continuo e riflessivo del vero stato del promoter.
 *
 * @param {Achievement[]} achievements - tutti gli achievement disponibili
 * @param {Set<string>} unlockedIds - ID degli achievement completamente sbloccati
 * @param {object} stats - stats del promoter (da computePromoterStats)
 * @returns {number}
 */
export function computePRPoints(achievements, unlockedIds, stats = null) {
  return achievements.reduce((total, ach) => {
    const points = PR_POINTS_BY_RARITY[ach.rarity || 'bronzo'] || PR_POINTS_BY_RARITY.bronzo;
    if (unlockedIds.has(ach.id)) {
      return total + points;
    }
    // Contributo parziale: massimo 2% dei punti dell'achievement (solo "segnale" di progresso)
    if (stats && ach.condition_value > 0) {
      const current = stats[ach.condition_type] ?? 0;
      const ratio = Math.min(1, Math.max(0, current / ach.condition_value));
      return total + ratio * points * 0.02;
    }
    return total;
  }, 0);
}

/**
 * Calcola il PR massimo teorico dato un set di achievement.
 * Usato per scalare dinamicamente le soglie rank in base al numero di achievement presenti.
 */
export function computeMaxTheoreticalPR(achievements) {
  return achievements.reduce((sum, ach) => {
    return sum + (PR_POINTS_BY_RARITY[ach.rarity || 'bronzo'] || PR_POINTS_BY_RARITY.bronzo);
  }, 0);
}

/**
 * Dato il max PR teorico, calcola le soglie dei 18 rank tier in modo proporzionale.
 * Le soglie sono espresse come percentuale del max PR totale, distribuite su una curva
 * che richiede ~95% del max per arrivare a Leggenda III (GOAT richiede 100%).
 *
 * Distribuzione percentuale fissa sui 18 rank (calibrata su esperienza di gioco):
 * Bronzo I: 0%, II: 0.15%, III: 0.36%
 * Argento I: 0.57%, II: 1.29%, III: 2.42%
 * Oro I: 3.60%, II: 5.66%, III: 8.39%
 * Platino I: 11.32%, II: 16.47%, III: 22.80%
 * Master I: 29.33%, II: 39.63%, III: 49.41%
 * Leggenda I: 58.67%, II: 77.20%, III: 92.64%
 */
const RANK_PCT = [
  0, 0.0015, 0.0036,
  0.0057, 0.0129, 0.0242,
  0.0360, 0.0566, 0.0839,
  0.1132, 0.1647, 0.2280,
  0.2933, 0.3963, 0.4941,
  0.5867, 0.7720, 0.9264,
];

export function getDynamicRankTiers(achievements) {
  const maxPR = computeMaxTheoreticalPR(achievements);
  if (maxPR === 0) return RANK_TIERS; // fallback ai valori statici

  return RANK_TIERS.map((tier, idx) => {
    if (tier.key === 'goat') return tier;
    return { ...tier, minPR: Math.round(maxPR * RANK_PCT[idx]) };
  });
}

/**
 * Ritorna il rank corrente, quello successivo e il progresso verso il prossimo.
 * GOAT è raggiungibile SOLO se tutti gli achievement sono sbloccati (isGoat=true).
 * @param {number} prPoints
 * @param {boolean} isGoat - true SOLO se TUTTI gli achievement sono sbloccati
 * @param {Array} dynamicTiers - tier con soglie dinamiche (da getDynamicRankTiers), opzionale
 * @returns {{ current, next, progress, prToNext, currentTierMin, nextTierMin }}
 */
export function getRankInfo(prPoints, isGoat = false, dynamicTiers = null) {
  const tiersToUse = dynamicTiers || RANK_TIERS;

  // GOAT solo se esplicitamente sbloccato al 100%
  if (isGoat) {
    const goat = tiersToUse[tiersToUse.length - 1];
    return { current: goat, next: null, progress: 100, prToNext: 0, currentTierMin: goat.minPR, nextTierMin: null };
  }

  // Cerca il rank più alto raggiunto escludendo GOAT
  const tiers = tiersToUse.filter(r => r.key !== 'goat');
  let currentRank = tiers[0];
  let nextRank = tiers[1];

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (prPoints >= tiers[i].minPR) {
      currentRank = tiers[i];
      nextRank = tiers[i + 1] || null;
      break;
    }
  }

  let progress = 100;
  let prToNext = 0;

  if (nextRank) {
    const range = nextRank.minPR - currentRank.minPR;
    const earned = prPoints - currentRank.minPR;
    progress = range > 0 ? Math.min(100, Math.round((earned / range) * 100)) : 100;
    prToNext = Math.max(0, nextRank.minPR - prPoints);
  }

  return { current: currentRank, next: nextRank, progress, prToNext, currentTierMin: currentRank.minPR, nextTierMin: nextRank?.minPR };
}

/**
 * Ritorna il rank di un promoter dato i suoi punti PR.
 */
export function getRankForPR(prPoints, isGoat = false) {
  return getRankInfo(prPoints, isGoat).current;
}