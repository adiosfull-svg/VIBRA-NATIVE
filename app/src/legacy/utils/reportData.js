import { format, parseISO, isWithinInterval, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from './tables';

export function filterEventsByPeriod(events, from, to) {
  if (!from && !to) return events;
  const fromD = from ? parseISO(from) : new Date('1900-01-01');
  const toD = to ? parseISO(to) : new Date('2099-12-31');
  return events.filter(e => {
    if (!e.date) return false;
    try { return isWithinInterval(parseISO(e.date), { start: fromD, end: toD }); } catch { return false; }
  });
}

export function filterAttendancesByPeriod(attendances, events, from, to) {
  const filteredEvIds = new Set(filterEventsByPeriod(events, from, to).map(e => e.id));
  return attendances.filter(a => filteredEvIds.has(a.event_id));
}

export const DAY_TYPES = [
  { key: 'ven', label: 'Ven', full: 'Venerdì', color: '#60a5fa' },
  { key: 'sab', label: 'Sab', full: 'Sabato', color: '#4ade80' },
  { key: 'dom', label: 'Dom', full: 'Domenica', color: '#fbbf24' },
  { key: 'extra', label: 'Extra', full: 'Extra / Festivi', color: '#f472b6' },
];

export function getDayType(ev) {
  if (ev?.is_extra) return 'extra';
  if (!ev?.date) return null;
  const [y, m, d] = ev.date.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  if (dow === 5) return 'ven';
  if (dow === 6) return 'sab';
  if (dow === 0) return 'dom';
  return null;
}

/** Totale di gruppo per giorno = somma delle medie dei singoli promoter
 *  (output combinato del gruppo per una serata di quel tipo) */
export function computeGroupDayTypeMedie(rows) {
  const sum = { ven: 0, sab: 0, dom: 0, extra: 0 };
  rows.forEach(r => {
    DAY_TYPES.forEach(d => {
      const cap = d.key.charAt(0).toUpperCase() + d.key.slice(1);
      if (r['ser' + cap] > 0) sum[d.key] += r['med' + cap] || 0;
    });
  });
  return { ven: sum.ven, sab: sum.sab, dom: sum.dom, extra: sum.extra };
}

/** Stats per un singolo promoter in un periodo */
export function computePromoterStats(promoter, attendances, events, from, to) {
  const eventsById = new Map(events.map(e => [e.id, e]));
  const filteredEvIds = new Set(filterEventsByPeriod(events, from, to).map(e => e.id));
  const pa = attendances.filter(a =>
    a.promoter_id === promoter.id &&
    a.present !== false &&
    !a.client_id &&
    filteredEvIds.has(a.event_id)
  );
  const fatturato = pa.reduce((s, a) => s + (a.revenue || 0), 0);
  const tavoli = pa.reduce((s, a) => {
    const ev = eventsById.get(a.event_id);
    return s + calcTables(a.revenue || 0, null, ev?.table_threshold || 300);
  }, 0);
  // Serate = tutte le serate registrate nel periodo (non solo quelle con presenza del promoter)
  const serate = filteredEvIds.size;
  const seratePresenti = pa.length;
  const media = seratePresenti > 0 ? Math.round(fatturato / seratePresenti) : 0;

  // Fatturato e medie per tipo di giorno (Ven/Sab/Dom/Extra)
  const dayRev = { ven: 0, sab: 0, dom: 0, extra: 0 };
  const dayCnt = { ven: 0, sab: 0, dom: 0, extra: 0 };
  pa.forEach(a => {
    const ev = eventsById.get(a.event_id);
    const dt = getDayType(ev);
    if (dt && dayRev[dt] !== undefined) {
      dayRev[dt] += a.revenue || 0;
      dayCnt[dt] += 1;
    }
  });
  const medDay = (k) => dayCnt[k] > 0 ? Math.round(dayRev[k] / dayCnt[k]) : 0;

  return {
    nome: promoter.name,
    serate,
    seratePresenti,
    fatturato: Math.round(fatturato),
    media,
    tavoli: Math.round(tavoli * 10) / 10,
    zona: [promoter.neighborhood, promoter.city].filter(Boolean).join(', ') || '-',
    ven: Math.round(dayRev.ven), sab: Math.round(dayRev.sab), dom: Math.round(dayRev.dom), extra: Math.round(dayRev.extra),
    serVen: dayCnt.ven, serSab: dayCnt.sab, serDom: dayCnt.dom, serExtra: dayCnt.extra,
    medVen: medDay('ven'), medSab: medDay('sab'), medDom: medDay('dom'), medExtra: medDay('extra'),
  };
}

/** Classifica promoter per periodo */
export function buildPromoterRows(promoters, attendances, events, from, to) {
  return promoters
    .filter(p => p.status === 'attivo')
    .map(p => computePromoterStats(p, attendances, events, from, to))
    .sort((a, b) => b.fatturato - a.fatturato);
}

/** Righe serate nel periodo */
export function buildEventRows(events, attendances, from, to) {
  const filtered = filterEventsByPeriod(events, from, to);
  return [...filtered]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .map(ev => {
      const evAtt = attendances.filter(a => a.event_id === ev.id && a.present !== false && !a.client_id);
      const totProm = evAtt.reduce((s, a) => s + (a.revenue || 0), 0);
      return {
        id: ev.id,
        data: ev.date ? format(parseISO(ev.date), 'd MMM yyyy', { locale: it }) : '-',
        dataRaw: ev.date,
        nome: ev.name || '-',
        locale: ev.venue || '-',
        fatturato: ev.total_revenue || 0,
        promoter_attivi: evAtt.length,
        fat_promoter: Math.round(totProm),
      };
    });
}

/** Andamento mensile */
export function buildMonthlyRows(events, from, to) {
  const filtered = filterEventsByPeriod(events, from, to);
  const byMonth = {};
  filtered.forEach(ev => {
    if (!ev.date) return;
    const m = ev.date.substring(0, 7);
    if (!byMonth[m]) byMonth[m] = { fatturato: 0, serate: 0 };
    byMonth[m].fatturato += ev.total_revenue || 0;
    byMonth[m].serate += 1;
  });
  return Object.entries(byMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([m, v]) => ({
      mese: format(parseISO(m + '-01'), 'MMM yy', { locale: it }),
      serate: v.serate,
      fatturato: Math.round(v.fatturato),
      media: v.serate > 0 ? Math.round(v.fatturato / v.serate) : 0,
    }));
}

/** KPI cumulativi per gruppo promoter */
export function computeGroupKpis(promoterRows, events, from, to) {
  const totalFat = promoterRows.reduce((s, r) => s + r.fatturato, 0);
  const totalTav = promoterRows.reduce((s, r) => s + r.tavoli, 0);
  const totalSerate = filterEventsByPeriod(events, from, to).length;
  return {
    promoterAttivi: promoterRows.length,
    fatturatoTotale: totalFat,
    tavoliTotali: Math.round(totalTav * 10) / 10,
    seratePeriodo: totalSerate,
    mediaPromoter: promoterRows.length > 0 ? Math.round(totalFat / promoterRows.length) : 0,
  };
}

/** Confronto stesso promoter tra due periodi */
export function computePeriodComparison(promoter, attendances, events, period1, period2) {
  const s1 = computePromoterStats(promoter, attendances, events, period1.from, period1.to);
  const s2 = computePromoterStats(promoter, attendances, events, period2.from, period2.to);
  const deltaFat = s2.fatturato - s1.fatturato;
  const deltaTav = Math.round((s2.tavoli - s1.tavoli) * 10) / 10;
  const deltaSerate = s2.serate - s1.serate;
  const pctFat = s1.fatturato > 0 ? Math.round((deltaFat / s1.fatturato) * 100) : 0;
  const pctTav = s1.tavoli > 0 ? Math.round((deltaTav / s1.tavoli) * 100) : 0;
  const monthly1 = buildMonthlyRows(events, period1.from, period1.to);
  const monthly2 = buildMonthlyRows(events, period2.from, period2.to);
  return {
    period1: { ...s1, label: periodLabel(period1) },
    period2: { ...s2, label: periodLabel(period2) },
    deltaFat,
    deltaTav,
    deltaSerate,
    pctFat,
    pctTav,
    monthly1,
    monthly2,
  };
}

export function periodLabel(p) {
  if (!p.from && !p.to) return 'Tutti i periodi';
  const f = p.from ? format(parseISO(p.from), 'd MMM yy', { locale: it }) : '…';
  const t = p.to ? format(parseISO(p.to), 'd MMM yy', { locale: it }) : '…';
  return `${f} → ${t}`;
}

const MONTH_LABELS_FULL = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

/** Converte selettori mese/anno in stringhe data (from = primo giorno, to = ultimo giorno) */
export function monthRangeToDates({ fromMonth = 0, fromYear = 2024, toMonth = 0, toYear = 2024 } = {}) {
  const from = startOfMonth(new Date(fromYear, fromMonth, 1));
  const to = endOfMonth(new Date(toYear, toMonth, 1));
  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
  };
}

export function monthRangeLabel({ fromMonth = 0, fromYear = '—', toMonth = 0, toYear = '—' } = {}) {
  return `${MONTH_LABELS_FULL[fromMonth]?.slice(0, 3) ?? '—'} ${fromYear} → ${MONTH_LABELS_FULL[toMonth]?.slice(0, 3) ?? '—'} ${toYear}`;
}

/** Stats promoter per due periodi (per confronto multi-promoter) */
export function computePromoterDualPeriod(promoter, attendances, events, period1, period2) {
  const s1 = computePromoterStats(promoter, attendances, events, period1.from, period1.to);
  const s2 = computePromoterStats(promoter, attendances, events, period2.from, period2.to);
  return {
    nome: promoter.name,
    p1: s1,
    p2: s2,
    deltaFat: s2.fatturato - s1.fatturato,
    deltaTav: Math.round((s2.tavoli - s1.tavoli) * 10) / 10,
    deltaSerate: s2.serate - s1.serate,
    deltaMedia: s2.media - s1.media,
    pctFat: s1.fatturato > 0 ? Math.round(((s2.fatturato - s1.fatturato) / s1.fatturato) * 100) : 0,
    pctTav: s1.tavoli > 0 ? Math.round(((s2.tavoli - s1.tavoli) / s1.tavoli) * 100) : 0,
  };
}

export const REPORT_TYPES = [
  { key: 'vibra_group', label: 'Gruppo Vibra', desc: 'Tutti i promoter insieme (cumulativo)', icon: '👥' },
  { key: 'promoter_compare', label: 'Confronto Promoter', desc: 'Seleziona promoter da confrontare', icon: '⚖️' },
  { key: 'same_promoter_periods', label: 'Stesso Promoter, Periodi Diversi', desc: 'Confronta un promoter tra due periodi', icon: '📅' },
  { key: 'event_compare', label: 'Confronto Serate', desc: 'Seleziona serate da confrontare', icon: '🎉' },
];

export const REPORT_SECTIONS = [
  { key: 'promoters', label: 'Performance Promoter', desc: 'Classifica, fatturato, tavoli, zone' },
  { key: 'events', label: 'Tutte le Serate', desc: 'Data, locale, fatturato, promoter' },
  { key: 'monthly', label: 'Andamento Mensile', desc: 'Grafici e tabella mese per mese' },
];