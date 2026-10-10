// Port di src/components/ilmiovibra/ProiezioneMese.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { parseISO, format, endOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';
import { Target, TrendingUp, TrendingDown, Minus, CalendarRange, Sparkles, ChevronDown } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';

import { Btn, Div, P, Span } from '@/ui/html';

const COLOR = '#a78bfa';

function calcGuadagno(att) {
  return Number(att.guadagno_pct || 0) + Number(att.guadagno_fuori_mano || 0);
}

export default function ProiezioneMese({ promoter, events = [], attendances = [] }) {
  const [detailOpen, setDetailOpen] = useState(false);

  const data = useMemo(() => {
    if (!promoter?.id || events.length === 0) return null;

    const eventsById = new Map(events.map(e => [e.id, e]));
    const myAtts = attendances.filter(a => a.promoter_id === promoter.id && !a.client_id);

    const dated = myAtts
      .map(a => {
        const ev = eventsById.get(a.event_id);
        if (!ev?.date) return null;
        return {
          day: parseInt(ev.date.slice(8, 10), 10),
          monthStr: ev.date.slice(0, 7),
          g: calcGuadagno(a),
        };
      })
      .filter(Boolean)
      .filter(x => x.g > 0);

    if (dated.length === 0) return null;

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthStr = format(today, 'yyyy-MM');
    const daysInCurrentMonth = endOfMonth(today).getDate();

    const monthTotals = {};
    const monthCumUpToDay = {};
    const monthRemainAfterDay = {};
    dated.forEach(({ day, monthStr, g }) => {
      monthTotals[monthStr] = (monthTotals[monthStr] || 0) + g;
      if (day <= currentDay) monthCumUpToDay[monthStr] = (monthCumUpToDay[monthStr] || 0) + g;
      else monthRemainAfterDay[monthStr] = (monthRemainAfterDay[monthStr] || 0) + g;
    });

    const currentCum = monthCumUpToDay[currentMonthStr] || 0;
    const prevMonths = Object.keys(monthTotals).filter(ms => ms !== currentMonthStr).sort();
    const prevCumValues = prevMonths.map(ms => monthCumUpToDay[ms] || 0);
    const avgPrevCum = prevCumValues.length
      ? prevCumValues.reduce((s, v) => s + v, 0) / prevCumValues.length
      : 0;
    const prevRemainValues = prevMonths.map(ms => monthRemainAfterDay[ms] || 0);
    const avgRemaining = prevRemainValues.length
      ? prevRemainValues.reduce((s, v) => s + v, 0) / prevRemainValues.length
      : 0;

    const delta = currentCum - avgPrevCum;
    const deltaPct = avgPrevCum > 0 ? (delta / avgPrevCum) * 100 : null;
    let status = 'pari';
    if (deltaPct !== null) {
      if (deltaPct > 1) status = 'sopra';
      else if (deltaPct < -1) status = 'sotto';
    } else if (currentCum > 0 && prevCumValues.length === 0) {
      status = 'sopra';
    }

    // Stima fine mese
    let estimate = currentCum + avgRemaining;
    let estimateMethod = 'history';
    if (prevRemainValues.length === 0) {
      if (currentDay < daysInCurrentMonth && currentCum > 0) {
        estimate = currentCum * (daysInCurrentMonth / currentDay);
        estimateMethod = 'linear';
      } else {
        estimate = currentCum;
        estimateMethod = 'none';
      }
    }

    const monthDetail = prevMonths
      .map(ms => ({
        monthStr: ms,
        cum: monthCumUpToDay[ms] || 0,
        remain: monthRemainAfterDay[ms] || 0,
        total: monthTotals[ms] || 0,
      }))
      .sort((a, b) => b.monthStr.localeCompare(a.monthStr));

    return {
      currentDay,
      currentMonthStr,
      daysInCurrentMonth,
      remainingDays: daysInCurrentMonth - currentDay,
      currentCum,
      avgPrevCum,
      delta,
      deltaPct,
      status,
      estimate,
      estimateMethod,
      avgRemaining,
      prevCount: prevMonths.length,
      monthDetail,
      todayLabel: format(today, 'd MMM', { locale: it }),
      currentMonthLabel: format(today, 'MMMM yyyy', { locale: it }),
    };
  }, [promoter?.id, events, attendances]);

  if (!data) return null;

  const maxBar = Math.max(data.currentCum, data.avgPrevCum, 1);
  const curWidth = (data.currentCum / maxBar) * 100;
  const avgWidth = (data.avgPrevCum / maxBar) * 100;

  const statusConfig = {
    sopra: { label: 'Sopra la media', color: '#22c55e', Icon: TrendingUp },
    sotto: { label: 'Sotto la media', color: '#ef4444', Icon: TrendingDown },
    pari: { label: 'In linea con la media', color: '#eab308', Icon: Minus },
  };
  const st = statusConfig[data.status];
  const StatusIcon = st.Icon;

  const estimateNote =
    data.estimateMethod === 'history'
      ? `Guadagno attuale + media dei guadagni nei giorni rimanenti (${data.prevCount} mesi storici)`
      : data.estimateMethod === 'linear'
      ? 'Proiezione lineare sulla media giornaliera finora (storico insufficiente)'
      : 'Nessuna proiezione disponibile per questo mese';

  return (
    <Div
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-3 sm:p-5 space-y-2.5 sm:space-y-4"
      style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.12)' }}
    >
      <Div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${COLOR}, transparent)` }}
      />

      {/* Header */}
      <Div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <SectionHeader icon={Target} title="Andamento del Mese" color={COLOR} size="lg" />
        <Span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-lg">
          <CalendarRange className="w-3 h-3" />
          Aggiornato al {data.todayLabel} · {format(parseISO(data.currentMonthStr + '-01'), 'MMMM yyyy', { locale: it })}
        </Span>
      </Div>

      {/* Risultato principale */}
      <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {/* Guadagno a oggi */}
        <Div className="rounded-xl bg-secondary/20 border border-white/[0.05] p-3 sm:p-4 space-y-1">
          <P className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider">Guadagno a oggi (giorno {data.currentDay})</P>
          <P className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: COLOR }}>
            €{Math.round(data.currentCum).toLocaleString('it-IT')}
          </P>
          <P className="text-[10px] sm:text-[11px] text-muted-foreground">
            Dal 1° al {data.currentDay} {data.currentMonthLabel}
          </P>
        </Div>

        {/* Media storica + stato */}
        <Div className="rounded-xl bg-secondary/20 border border-white/[0.05] p-3 sm:p-4 space-y-1">
          <P className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider">
            Media riferita allo stesso giorno · {data.prevCount} mesi
          </P>
          <P className="text-xl sm:text-2xl font-bold leading-tight text-muted-foreground">
            €{Math.round(data.avgPrevCum).toLocaleString('it-IT')}
          </P>
          <Span
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md"
            style={{ color: st.color, background: st.color + '1a' }}
          >
            <StatusIcon className="w-3 h-3" />
            {st.label}
            {data.deltaPct !== null && (
              <Span className="ml-0.5">
                {data.deltaPct > 0 ? '+' : ''}
                {data.deltaPct.toFixed(1)}% - 
                €{Math.round(Math.abs(data.delta)).toLocaleString('it-IT')} {data.delta > 0 ? 'in più' : 'in meno'}
              </Span>
            )}
          </Span>
        </Div>
      </Div>

      {/* Stima fine mese */}
      <Div
        className="rounded-xl border p-3 sm:p-4 space-y-1"
        style={{ borderColor: COLOR + '30', background: COLOR + '0a' }}
      >
        <Div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: COLOR }} />
          <P className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: COLOR }}>
            Stima guadagno fine mese
          </P>
        </Div>
        <P className="text-2xl sm:text-3xl font-bold leading-tight" style={{ color: COLOR }}>
          €{Math.round(data.estimate).toLocaleString('it-IT')}
        </P>
        <P className="text-[10px] sm:text-[11px] text-muted-foreground leading-snug">{estimateNote}</P>
        {data.remainingDays > 0 && data.estimateMethod === 'history' && (
          <P className="text-[11px] text-muted-foreground">
            Mancano {data.remainingDays} giorni · media storica residua: €{Math.round(data.avgRemaining).toLocaleString('it-IT')}
          </P>
        )}
      </Div>

      {/* Confronto semplice: mese in corso vs mese precedente */}
      {data.monthDetail.length > 0 && (() => {
        const prevMonth = data.monthDetail[0];
        const delta = data.currentCum - prevMonth.cum;
        const prevLabel = format(parseISO(prevMonth.monthStr + '-01'), 'MMMM', { locale: it });
        const isAhead = delta > 0;
        const isBehind = delta < 0;
        const sign = isAhead ? '+' : '−';
        const accent = isAhead ? '#22c55e' : isBehind ? '#ef4444' : '#eab308';
        const StatusIcon = isAhead ? TrendingUp : isBehind ? TrendingDown : Minus;
        return (
          <Div
            className="rounded-xl border p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3"
            style={{ borderColor: accent + '40', background: accent + '0d' }}
          >
            <Div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent + '1a' }}>
              <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accent }} />
            </Div>
            <Div className="flex-1 min-w-0">
              <P className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider">vs {prevLabel} (al giorno {data.currentDay})</P>
              <P className="text-lg sm:text-xl font-bold leading-tight tabular-nums" style={{ color: accent }}>
                {delta === 0 ? 'In linea' : `${sign}€${Math.round(Math.abs(delta)).toLocaleString('it-IT')}`}
              </P>
            </Div>
            <Div className="text-right shrink-0">
              <P className="text-[9px] sm:text-[10px] text-muted-foreground">Mese attuale €{Math.round(data.currentCum).toLocaleString('it-IT')}</P>
              <P className="text-[9px] sm:text-[10px] text-muted-foreground">{prevLabel} €{Math.round(prevMonth.cum).toLocaleString('it-IT')}</P>
            </Div>
          </Div>
        );
      })()}

      {/* Lista espandibile: tutti i mesi precedenti con delta vs mese precedente */}
      {data.monthDetail.length > 1 && (
        <Div className="rounded-xl bg-secondary/10 border border-white/[0.04] overflow-hidden">
          <Btn
            button
            onClick={() => setDetailOpen(v => !v)}
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary/20 transition-colors">
            <P className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tutti i mesi precedenti
            </P>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${detailOpen ? 'rotate-180' : ''}`} />
          </Btn>
          <AnimatePresence initial={false}>
            {detailOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <Div className="divide-y divide-white/[0.04] border-t border-white/[0.04]">
                  {data.monthDetail.map((m, i) => {
                    const delta = data.currentCum - m.total;
                    const isAhead = delta > 0;
                    const isBehind = delta < 0;
                    const accent = isAhead ? '#22c55e' : isBehind ? '#ef4444' : '#eab308';
                    const StatusIcon = isAhead ? TrendingUp : isBehind ? TrendingDown : Minus;
                    return (
                      <Div key={m.monthStr} className="flex items-center gap-3 px-3 py-2 text-xs">
                        <Span className="w-16 capitalize shrink-0 text-muted-foreground">
                          {format(parseISO(m.monthStr + '-01'), 'MMM yy', { locale: it })}
                        </Span>
                        <Span className="w-20 text-right font-semibold tabular-nums" style={{ color: COLOR }}>
                          €{Math.round(m.cum).toLocaleString('it-IT')}
                        </Span>
                        <Span className="flex-1 text-right font-semibold tabular-nums flex items-center justify-end gap-1" style={{ color: accent }}>
                          <StatusIcon className="w-3 h-3 shrink-0" />
                          {delta === 0 ? 'pari' : `${isAhead ? '+' : '−'}€${Math.round(Math.abs(delta)).toLocaleString('it-IT')}`}
                        </Span>
                      </Div>
                    );
                  })}
                </Div>
              </motion.div>
            )}
          </AnimatePresence>
        </Div>
      )}
    </Div>
  );
}