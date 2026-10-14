// Port di src/components/report/DualPeriodWaveChart.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import UPlotLineChart from '@/web/components/promoter/UPlotLineChart';
import { eachMonthOfInterval, parseISO, format } from 'date-fns';
import { it } from 'date-fns/locale';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Div, H, P, Span } from '@/ui/html';

/**
 * Grafico a onde (spline) su Canvas che confronta l'andamento mensile
 * aggregato dei promoter selezionati tra due periodi.
 * Le due onde (P1 blu, P2 verde) sono allineate per indice di mese
 * (M1 = primo mese del periodo), così si confronta la "traiettoria".
 */
export default function DualPeriodWaveChart({ selectedPromoters, attendances, events, period1, period2 }) {
  const { data, xLabels } = useMemo(() => {
    const evById = new Map(events.map(e => [e.id, e]));
    const promoterIds = new Set(selectedPromoters.map(p => p.id));

    const computeMonthly = (from, to) => {
      if (!from || !to) return [];
      const fromD = parseISO(from);
      const toD = parseISO(to);
      const months = eachMonthOfInterval({ start: fromD, end: toD });
      return months.map(mStart => {
        const mKey = format(mStart, 'yyyy-MM');
        const mEnd = new Date(mStart.getFullYear(), mStart.getMonth() + 1, 0);
        const rev = attendances.reduce((sum, a) => {
          if (!promoterIds.has(a.promoter_id) || a.present === false || a.client_id) return sum;
          const ev = evById.get(a.event_id);
          if (!ev || !ev.date) return sum;
          if (ev.date.substring(0, 7) !== mKey) return sum;
          return sum + (a.revenue || 0);
        }, 0);
        return { key: mKey, label: format(mStart, 'MMM yy', { locale: it }), revenue: Math.round(rev) };
      });
    };

    const p1Monthly = computeMonthly(period1.from, period1.to);
    const p2Monthly = computeMonthly(period2.from, period2.to);
    const maxLen = Math.max(p1Monthly.length, p2Monthly.length);

    // xLabels: "M1\nGiu24" stile — primo mese del periodo più lungo
    const labels = [];
    for (let i = 0; i < maxLen; i++) {
      const m1 = p1Monthly[i]?.label || '';
      const m2 = p2Monthly[i]?.label || '';
      labels.push(`M${i + 1}`);
    }

    const rows = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({
        p1: p1Monthly[i]?.revenue ?? null,
        p2: p2Monthly[i]?.revenue ?? null,
      });
    }

    // Tooltip labels personalizzati: mostriamo i mesi reali di ciascun periodo
    const tooltipLabels = [];
    for (let i = 0; i < maxLen; i++) {
      const m1 = p1Monthly[i]?.label || '—';
      const m2 = p2Monthly[i]?.label || '—';
      tooltipLabels.push(`${m1} / ${m2}`);
    }

    return { data: rows, xLabels: labels, tooltipLabels, p1Monthly, p2Monthly };
  }, [selectedPromoters, attendances, events, period1, period2]);

  if (!data.length) return null;

  const fmt = (v) => v == null ? '—' : `€${Number(v).toLocaleString('it-IT')}`;

  return (
    <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
      <Div className="flex items-center justify-between mb-1">
        <H className="text-sm font-semibold border-b border-border pb-2 mb-0 flex-1">Andamento Mensile — Onda P1 vs P2</H>
      </Div>
      <P className="text-[10px] text-muted-foreground mb-2">
        Onde allineate per mese del periodo (M1 = primo mese). Blu = P1, Verde = P2.
      </P>
      <ChartFullscreen title="Andamento Mensile — Onda P1 vs P2">
        <UPlotLineChart
          data={data}
          series={[
            { key: 'p1', name: 'P1', color: '#60a5fa' },
            { key: 'p2', name: 'P2', color: '#4ade80' },
          ]}
          xLabels={xLabels}
          valueFormatter={fmt}
          height={260}
        />
        {/* Legenda */}
        <Div className="flex items-center gap-4 mt-2 text-[11px]">
          <Span className="flex items-center gap-1.5">
            <Span className="w-3 h-0.5 rounded bg-blue-400" />
            <Span className="text-blue-400 font-medium">P1</Span>
          </Span>
          <Span className="flex items-center gap-1.5">
            <Span className="w-3 h-0.5 rounded bg-emerald-400" />
            <Span className="text-emerald-400 font-medium">P2</Span>
          </Span>
        </Div>
      </ChartFullscreen>
    </Div>
  );
}