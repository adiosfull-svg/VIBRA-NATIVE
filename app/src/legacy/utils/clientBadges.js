/**
 * Calcola i badge di classifica per ogni cliente.
 * Restituisce una mappa: { [clientId]: string[] }
 * Premi:
 *   Top presenze    → 🏅🥈🥉   (Fedeltà)
 *   Top rendita     → 💰💵💸   (chi ha speso di più in totale nel tempo)
 *   Top spender     → 💎💍🪙   (chi ha la media di spesa più alta per serata)
 *   Top aggregatore → 🤝🫂👥
 */

export const BADGE_META = {
  // Fedeltà (presenze)
  '🏅': { label: 'Fedeltà #1', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  '🥈': { label: 'Fedeltà #2', color: 'bg-slate-400/15 text-slate-300 border-slate-400/30' },
  '🥉': { label: 'Fedeltà #3', color: 'bg-amber-700/15 text-amber-600 border-amber-700/30' },
  // Rendita (spesa totale nel tempo)
  '💰': { label: 'Rendita #1', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  '💵': { label: 'Rendita #2', color: 'bg-emerald-500/10 text-emerald-500/80 border-emerald-500/20' },
  '💸': { label: 'Rendita #3', color: 'bg-emerald-500/8 text-emerald-600/70 border-emerald-500/15' },
  // Spender (media più alta per serata)
  '💎': { label: 'Spender #1', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  '💍': { label: 'Spender #2', color: 'bg-cyan-500/10 text-cyan-400/80 border-cyan-500/20' },
  '🪙': { label: 'Spender #3', color: 'bg-cyan-500/8 text-cyan-600/70 border-cyan-500/15' },
  // Aggregatore
  '🤝': { label: 'Aggregatore #1', color: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  '🫂': { label: 'Aggregatore #2', color: 'bg-violet-500/10 text-violet-400/80 border-violet-500/20' },
  '👥': { label: 'Aggregatore #3', color: 'bg-violet-500/8 text-violet-400/60 border-violet-500/15' },
};

export function computeClientBadges(clients, getStats) {
  if (!clients || clients.length === 0) return {};

  const byVisits  = [...clients].sort((a, b) => getStats(b.id).visits - getStats(a.id).visits);
  const bySpent   = [...clients].sort((a, b) => getStats(b.id).totalSpent - getStats(a.id).totalSpent);
  const byAvg     = [...clients].sort((a, b) => getStats(b.id).avgSpent - getStats(a.id).avgSpent);
  const byPeople  = [...clients].sort((a, b) => (b.new_people_brought || 0) - (a.new_people_brought || 0));

  // Assegna medaglie considerando i pareggi (stesso valore = stesso posto)
  const assignMedals = (sorted, getValue, medals) => {
    const result = {};
    let rank = 0;
    let lastVal = null;
    sorted.forEach((c, i) => {
      const val = getValue(c);
      if (val === 0) return; // nessun badge se valore è 0
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

  const visitsMedals  = assignMedals(byVisits,  c => getStats(c.id).visits,       ['🏅', '🥈', '🥉']);
  const rentaMedals   = assignMedals(bySpent,   c => getStats(c.id).totalSpent,    ['💰', '💵', '💸']);
  // avgSpent ha senso solo se ha almeno 1 visita
  const spenderMedals = assignMedals(byAvg,     c => getStats(c.id).visits > 0 ? getStats(c.id).avgSpent : 0, ['💎', '💍', '🪙']);
  const peopleMedals  = assignMedals(byPeople,  c => c.new_people_brought || 0,    ['🤝', '🫂', '👥']);

  const badges = {};
  clients.forEach(c => {
    const list = [];
    if (visitsMedals[c.id])  list.push(visitsMedals[c.id]);
    if (rentaMedals[c.id])   list.push(rentaMedals[c.id]);
    if (spenderMedals[c.id]) list.push(spenderMedals[c.id]);
    if (peopleMedals[c.id])  list.push(peopleMedals[c.id]);
    if (list.length > 0) badges[c.id] = list;
  });

  return badges;
}