// Port di src/components/promoter/ReportisticaMensile.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, parseISO, isWithinInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Minus, Euro, CalendarDays, Table2, ChevronLeft, ChevronRight } from '@/ui/icons.generated';
import { calcTables, filterCleanAttendances } from '@/legacy/utils/tables';
import { isVisibleInStats } from '@/legacy/utils/promoterVisibility';
import ExportReportMensile from './ExportReportMensile';

import { Btn, Div, H, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

function getDeltaBadge(current, prev) {
  if (prev === 0 && current === 0) return null;
  if (prev === 0) return { pct: null, label: 'Nuovo', color: 'text-green-400 bg-green-400/10' };
  const pct = ((current - prev) / prev) * 100;
  if (Math.abs(pct) < 0.5) return { pct: 0, label: '0%', color: 'text-muted-foreground bg-secondary/40', icon: Minus };
  if (pct > 0) return { pct, label: `+${pct.toFixed(1)}%`, color: 'text-green-400 bg-green-400/10', icon: TrendingUp };
  return { pct, label: `${pct.toFixed(1)}%`, color: 'text-red-400 bg-red-400/10', icon: TrendingDown };
}

function DeltaBadge({ delta }) {
  if (!delta) return null;
  const Icon = delta.icon;
  return (
    <Span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${delta.color}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {delta.label}
    </Span>
  );
}

function StatBlock({ label, value, prevValue, format: fmt = (v) => v, icon: Icon }) {
  const delta = getDeltaBadge(value, prevValue);
  return (
    <Div className="flex flex-col gap-1 bg-secondary/20 rounded-xl p-4">
      <Div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </Div>
      <P className="text-xl font-bold text-foreground">{fmt(value)}</P>
      <Div className="flex items-center gap-1.5">
        <Span className="text-[10px] text-muted-foreground">Mese prec.: {fmt(prevValue)}</Span>
        <DeltaBadge delta={delta} />
      </Div>
    </Div>
  );
}

function getPromoterMonthStats(promoterId, monthStart, monthEnd, attendances, events) {
  const inRange = filterCleanAttendances(attendances).filter(a => {
    if (a.promoter_id !== promoterId) return false;
    if (a.client_id) return false;
    const ev = events.find(e => e.id === a.event_id);
    if (!ev?.date) return false;
    return isWithinInterval(parseISO(ev.date), { start: monthStart, end: monthEnd });
  });

  const revenue = inRange.reduce((s, a) => s + (a.revenue || 0), 0);
  // Conta eventi unici, non record duplicati
  const uniqueEventIds = new Set(inRange.map(a => a.event_id));
  const serate = uniqueEventIds.size;
  const avgPerSerata = serate > 0 ? Math.round(revenue / serate) : 0;

  // Tavoli chiusi
  let tavoli = 0;
  inRange.forEach(a => {
    const ev = events.find(e => e.id === a.event_id);
    if (!ev) return;
    const t = calcTables(a.revenue || 0, ev.table_threshold || (ev.is_extra ? 300 : null));
    tavoli += t;
  });
  tavoli = Math.round(tavoli * 100) / 100; // max 2 decimali

  return { revenue, serate, avgPerSerata, tavoli };
}

export default function ReportisticaMensile({ promoters, attendances, events }) {
  const today = new Date();
  // Di default mostra il mese passato (report "chiuso")
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(subMonths(today, 1)));

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const prevMonthStart = startOfMonth(subMonths(selectedMonth, 1));
  const prevMonthEnd = endOfMonth(subMonths(selectedMonth, 1));

  const monthLabel = format(monthStart, 'MMMM yyyy', { locale: it });

  const promoterReports = useMemo(() => {
    return promoters
      .filter(p => isVisibleInStats(p))
      .map(p => {
        const curr = getPromoterMonthStats(p.id, monthStart, monthEnd, attendances, events);
        const prev = getPromoterMonthStats(p.id, prevMonthStart, prevMonthEnd, attendances, events);
        return { promoter: p, curr, prev };
      })
      .sort((a, b) => b.curr.revenue - a.curr.revenue);
  }, [promoters, attendances, events, selectedMonth]);

  const goMonth = (dir) => setSelectedMonth(m => startOfMonth(dir === -1 ? subMonths(m, 1) : subMonths(m, -1)));

  const fmtEuro = (v) => `€${Math.round(v || 0).toLocaleString('it-IT')}`;
  const fmtN = (v) => Math.round(v || 0).toString();

  return (
    <Div className="space-y-6">
      {/* Selettore mese + export */}
      <Div className="flex items-center justify-between flex-wrap gap-3">
        <Div>
          <H className="text-base font-bold capitalize">{monthLabel}</H>
          <P className="text-xs text-muted-foreground mt-0.5">Report mensile · confronto con {format(prevMonthStart, 'MMMM yyyy', { locale: it })}</P>
        </Div>
        <Div className="flex items-center gap-2">
          <Div className="flex items-center gap-1">
            <Btn
              button
              onClick={() => goMonth(-1)}
              className="p-2 rounded-lg border border-border hover:bg-secondary/40 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </Btn>
            <Span className="px-3 py-1.5 text-xs font-medium bg-card border border-border rounded-lg capitalize min-w-[120px] text-center">
              {monthLabel}
            </Span>
            <Btn
              button
              onClick={() => goMonth(1)}
              disabled={selectedMonth >= startOfMonth(subMonths(today, 1))}
              className="p-2 rounded-lg border border-border hover:bg-secondary/40 transition-all disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </Btn>
          </Div>
          <ExportReportMensile
            promoterReports={promoterReports}
            monthLabel={monthLabel}
            prevMonthLabel={format(prevMonthStart, 'MMMM yyyy', { locale: it })}
          />
        </Div>
      </Div>

      {/* Cards promoter */}
      {promoterReports.length === 0 ? (
        <P className="text-sm text-muted-foreground text-center py-12">Nessun promoter attivo o nessun dato per questo periodo.</P>
      ) : (
        <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {promoterReports.map(({ promoter, curr, prev }, idx) => {
            const overallDelta = getDeltaBadge(curr.revenue, prev.revenue);
            return (
              <Div key={promoter.id} className="rounded-2xl bg-card border border-border p-5 space-y-4">
                {/* Header promoter */}
                <Div className="flex items-center gap-3">
                  <Div className="relative">
                    <Span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </Span>
                    <Div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-lg overflow-hidden">
                      {promoter.photo_url
                        ? <Img src={promoter.photo_url} alt={promoter.name} className="w-full h-full object-cover" />
                        : promoter.name?.charAt(0)?.toUpperCase()
                      }
                    </Div>
                  </Div>
                  <Div className="flex-1">
                    <Div className="flex items-center gap-2 flex-wrap">
                      <P className="font-bold text-base">{promoter.name}</P>
                      {overallDelta && <DeltaBadge delta={overallDelta} />}
                    </Div>
                    {promoter.neighborhood && (
                      <P className="text-xs text-muted-foreground">{promoter.neighborhood}{promoter.city ? `, ${promoter.city}` : ''}</P>
                    )}
                  </Div>
                  <Div className="text-right">
                    <P className="text-2xl font-bold text-primary">{fmtEuro(curr.revenue)}</P>
                    <P className="text-[10px] text-muted-foreground">fatturato {format(monthStart, 'MMM', { locale: it })}</P>
                  </Div>
                </Div>

                {/* Stats grid */}
                <Div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <StatBlock
                    label="Serate"
                    value={curr.serate}
                    prevValue={prev.serate}
                    format={fmtN}
                    icon={CalendarDays}
                  />
                  <StatBlock
                    label="Media/Serata"
                    value={curr.avgPerSerata}
                    prevValue={prev.avgPerSerata}
                    format={fmtEuro}
                    icon={Euro}
                  />
                  <StatBlock
                    label="Tavoli Chiusi"
                    value={curr.tavoli}
                    prevValue={prev.tavoli}
                    format={fmtN}
                    icon={Table2}
                  />
                </Div>

                {/* Note / status */}
                {promoter.notes && (
                  <P className="text-xs text-muted-foreground italic border-t border-border pt-3">📝 {promoter.notes}</P>
                )}
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}