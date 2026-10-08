import { parseISO, isWithinInterval, startOfDay, endOfDay, getDay } from 'date-fns';
import { calcTables } from './tables';
import { RANK_TIERS } from './rankSystem';

function matchGiorni(ev, giorni) {
  if (!giorni || giorni === 'tutti') return true;
  if (giorni === 'extra') return ev.is_extra === true;
  const dow = getDay(parseISO(ev.date));
  return giorni.split(',').map(Number).includes(dow);
}

/**
 * Calcola il progresso di un obiettivo promoter, indipendentemente dal tipo.
 * ctx: { attendances, events, clients, promoterAchievements, promoterRanks, promoterId }
 */
export function computeGoalProgress(goal, ctx) {
  const { attendances = [], events = [], clients = [], promoterAchievements = [], promoterRanks = [], promoterId } = ctx;

  if (goal.type === 'fatturato' || goal.type === 'tavoli') {
    const from = startOfDay(parseISO(goal.date_from));
    const to = endOfDay(parseISO(goal.date_to));
    const inRange = attendances.filter(a => {
      if (a.client_id) return false;
      if (a.promoter_id !== promoterId) return false;
      const ev = events.find(e => e.id === a.event_id);
      if (!ev?.date) return false;
      if (!isWithinInterval(parseISO(ev.date), { start: from, end: to })) return false;
      return matchGiorni(ev, goal.giorni);
    });

    if (goal.type === 'fatturato') {
      const current = inRange.reduce((s, a) => s + (a.revenue || 0), 0);
      return { current: Math.round(current), target: goal.target, pct: Math.min(100, (current / goal.target) * 100), done: current >= goal.target };
    }
    const current = inRange.reduce((s, a) => {
      const ev = events.find(e => e.id === a.event_id);
      return s + calcTables(a.revenue || 0, null, ev?.table_threshold || 300);
    }, 0);
    return { current: Math.round(current * 10) / 10, target: goal.target, pct: Math.min(100, (current / goal.target) * 100), done: current >= goal.target };
  }

  if (goal.type === 'clienti_instagram' || goal.type === 'clienti_tiktok') {
    const source = goal.type === 'clienti_instagram' ? 'instagram' : 'tiktok';
    const from = startOfDay(parseISO(goal.date_from));
    const to = endOfDay(parseISO(goal.date_to));
    const current = clients.filter(c =>
      c.promoter_id === promoterId &&
      c.source_type === source &&
      c.created_date && isWithinInterval(parseISO(c.created_date), { start: from, end: to })
    ).length;
    return { current, target: goal.target, pct: Math.min(100, (current / goal.target) * 100), done: current >= goal.target };
  }

  if (goal.type === 'achievement') {
    const unlocked = promoterAchievements.some(pa => pa.promoter_id === promoterId && pa.achievement_id === goal.achievement_id);
    return { current: unlocked ? 1 : 0, target: 1, pct: unlocked ? 100 : 0, done: unlocked };
  }

  if (goal.type === 'rank') {
    const pr = promoterRanks.find(r => r.promoter_id === promoterId);
    const currentKey = pr?.rank_key || 'bronzo_1';
    const currentIdx = RANK_TIERS.findIndex(t => t.key === currentKey);
    const targetIdx = RANK_TIERS.findIndex(t => t.key === goal.rank_key);
    const done = currentIdx !== -1 && targetIdx !== -1 && currentIdx >= targetIdx;
    const pct = done ? 100 : (targetIdx > 0 ? Math.min(100, Math.max(0, (Math.max(currentIdx, 0) / targetIdx) * 100)) : 0);
    return { current: currentIdx, target: targetIdx, pct, done };
  }

  return { current: 0, target: 1, pct: 0, done: false };
}