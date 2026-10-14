// Port di src/components/promoter/PromoterSeasonStats.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import { calcTables, filterCleanAttendances } from '@/legacy/utils/tables';

import { Div, H, P, Span } from '@/ui/html';

const SEASONS = [
  {
    key: '2022-2023',
    label: '2022/2023',
    dateFrom: '2022-10-10',
    dateTo:   '2023-10-09',
  },
  {
    key: '2023-2024',
    label: '2023/2024',
    dateFrom: '2023-10-10',
    dateTo:   '2024-10-09',
  },
  {
    key: '2024-2025',
    label: '2024/2025',
    dateFrom: '2024-10-10',
    dateTo:   '2025-10-09',
  },
  {
    key: '2025-2026',
    label: '2025/2026',
    dateFrom: '2025-10-10',
    dateTo:   '2026-10-09',
  },
];

function calcSeasonStats(attendances, events, season) {
  const from = parseISO(season.dateFrom);
  const to = parseISO(season.dateTo);
  let revenue = 0, tables = 0, serate = 0;

  attendances.forEach(a => {

    const ev = events.find(e => e.id === a.event_id);
    if (!ev?.date) return;
    try {
      if (!isWithinInterval(parseISO(ev.date), { start: from, end: to })) return;
    } catch { return; }
    const rev = a.revenue || 0;
    if (rev === 0) return;
    const [y, m, d] = ev.date.split('-').map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    revenue += rev;
    tables += calcTables(rev, dow, ev.table_threshold || null);
    serate += 1;
  });

  return { revenue, tables: Math.round(tables), serate, avg: serate > 0 ? Math.round(revenue / serate) : 0 };
}

// Versione compatta per PromoterCard
export function PromoterSeasonStatsCompact({ attendances, events }) {
  const seasons = SEASONS.map(s => ({
    ...s,
    ...calcSeasonStats(attendances, events, s),
  })).filter(s => s.serate > 0);

  if (seasons.length === 0) return null;

  return (
    <Div className="space-y-1.5">
      {seasons.map(s => {
        const maxRev = Math.max(...seasons.map(x => x.revenue));
        const pct = maxRev > 0 ? Math.round((s.revenue / maxRev) * 100) : 0;
        return (
          <Div key={s.key} className="flex items-center gap-2 text-[11px]">
            <Span className="text-muted-foreground w-16 shrink-0">{s.label}</Span>
            <Div className="flex-1 h-1.5 bg-secondary rounded-full">
              <Div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </Div>
            <Span className="font-semibold text-primary w-20 text-right">€{s.revenue.toLocaleString('it-IT')}</Span>
            <Span className="text-muted-foreground w-8 text-right">{s.tables}t</Span>
          </Div>
        );
      })}
    </Div>
  );
}

// Versione tabella per PromoterCompareCharts (per tutti i promoter).
// L'aggregazione pesante (calcSeasonStats con events.find) è memoizzata sui dati
// grezzi per TUTTI i promoter: toggolare le chip non fa ricalcolare, filtra solo
// le stats già pronte per i promoter selezionati (operazione cheap).
export function PromoterSeasonStatsTable({ promoters, allAttendances, events, selectedIds }) {
  const seasonsAll = useMemo(() => {
    const cleanAll = filterCleanAttendances(allAttendances);
    const mainPromoters = promoters.filter(p => p.ruolo !== 'ragazza_immagine');
    return SEASONS.map(season => {
      const statsByPromoter = {};
      mainPromoters.forEach(p => {
        const pa = cleanAll.filter(a => a.promoter_id === p.id && !a.client_id);
        const st = calcSeasonStats(pa, events, season);
        if (st.serate > 0) statsByPromoter[p.id] = { promoter: p, ...st };
      });
      return { ...season, statsByPromoter };
    });
  }, [promoters, allAttendances, events]);

  const seasons = seasonsAll
    .map(s => {
      const promoterStats = Object.values(s.statsByPromoter)
        .filter(st => selectedIds == null || selectedIds.includes(st.promoter.id));
      const total = promoterStats.reduce((sum, x) => sum + x.revenue, 0);
      return { ...s, promoterStats, total };
    })
    .filter(s => s.promoterStats.length > 0);

  if (seasons.length === 0) return null;

  return (
    <Div className="space-y-4">
      {seasons.map(season => (
        <Div key={season.key} className="rounded-xl bg-card border border-border overflow-hidden">
          <Div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <Div>
              <H className="text-sm font-semibold">Stagione {season.label}</H>
              <P className="text-[10px] text-muted-foreground mt-0.5">
                {season.dateFrom.split('-').reverse().join('/')} → {season.dateTo.split('-').reverse().join('/')}
              </P>
            </Div>
            <Span className="text-sm font-bold text-primary">€{season.total.toLocaleString('it-IT')}</Span>
          </Div>
          <Div className="divide-y divide-border">
            {[...season.promoterStats].sort((a, b) => b.revenue - a.revenue).map((ps, i) => {
              const pct = season.total > 0 ? Math.round((ps.revenue / season.total) * 100) : 0;
              return (
                <Div key={ps.promoter.id} className="flex items-start gap-3 px-5 py-2.5">
                  <Span className="text-xs text-muted-foreground w-5 text-right shrink-0 mt-0.5">{i + 1}</Span>
                  <Div className="flex-1 min-w-0">
                    <Span className="text-xs font-medium block mb-1">{ps.promoter.name}</Span>
                    <Div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <Div className="flex items-center gap-2 flex-wrap">
                        <Span className="text-[10px] text-muted-foreground">{ps.serate} ser.</Span>
                        <Span className="text-[10px] text-muted-foreground">{ps.tables}t</Span>
                        <Span className="text-xs font-bold text-primary">€{ps.revenue.toLocaleString('it-IT')}</Span>
                      </Div>
                      <Span className="text-[10px] text-muted-foreground">{pct}%</Span>
                    </Div>
                    <Div className="w-full h-1 bg-secondary rounded-full">
                      <Div className="bg-primary h-1 rounded-full" style={{ width: `${pct}%` }} />
                    </Div>
                  </Div>
                </Div>
              );
            })}
          </Div>
        </Div>
      ))}
    </Div>
  );
}