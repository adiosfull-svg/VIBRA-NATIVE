import { parseISO, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

/**
 * Range settimana mostrato = settimana PRECEDENTE (lun→dom), come VibraVS.
 */
export function getDisplayWeekRange() {
  const now = new Date();
  const prev = subWeeks(now, 1);
  return { from: startOfWeek(prev, { weekStartsOn: 1 }), to: endOfWeek(prev, { weekStartsOn: 1 }) };
}

export function getMonthRange() {
  return { from: startOfMonth(new Date()), to: endOfMonth(new Date()) };
}

/**
 * Posizione di un promoter nella classifica fatturato per un dato range.
 * Stessa logica di VibraVS.buildRanking (promoter attivi, senza ragazza_immagine;
 * revenue da EventAttendance senza client_id su eventi nel range).
 */
export function getPromoterPosition(promoters, events, attendances, from, to, promoterId) {
  const eventIds = new Set(
    events.filter(e => {
      if (!e.date) return false;
      try { return isWithinInterval(parseISO(e.date), { start: from, end: to }); }
      catch { return false; }
    }).map(e => e.id)
  );
  const revenueMap = {};
  attendances.forEach(a => {
    if (!a.promoter_id || a.client_id || !eventIds.has(a.event_id)) return;
    revenueMap[a.promoter_id] = (revenueMap[a.promoter_id] || 0) + (a.revenue || 0);
  });
  const ranked = promoters
    .filter(p => p.status !== 'inattivo' && p.ruolo !== 'ragazza_immagine')
    .map(p => ({ id: p.id, revenue: revenueMap[p.id] || 0 }))
    .sort((a, b) => b.revenue - a.revenue);
  const idx = ranked.findIndex(p => p.id === promoterId);
  return {
    position: idx >= 0 ? idx + 1 : null,
    total: ranked.length,
    revenue: idx >= 0 ? ranked[idx].revenue : 0,
    noData: ranked.every(p => p.revenue === 0),
  };
}