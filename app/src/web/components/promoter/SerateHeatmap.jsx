// Port di src/components/promoter/SerateHeatmap.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from '@/ui/icons.generated';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';

function fmtDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(2)}`;
}

export default function SerateHeatmap({ attendances, events, promoterFrom }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(null); // { id, rect }

  // Costruisce la mappa evento → fatturato promoter
  const revenueByEvent = {};
  attendances.forEach(a => {
    revenueByEvent[a.event_id] = (revenueByEvent[a.event_id] || 0) + (a.revenue || 0);
  });

  // Ordina tutte le serate per data discendente
  const sorted = [...events]
    .filter(e => e.date)
    .sort((a, b) => b.date.localeCompare(a.date));

  const displayed = expanded ? sorted : sorted.slice(0, 30);

  if (sorted.length === 0) return null;

  const sortedSincePromoter = promoterFrom ? sorted.filter(e => e.date >= promoterFrom) : sorted;
  const notYetCount = sorted.length - sortedSincePromoter.length;

  // Streak: serie di serate consecutive con risultato (revenue > 0)
  const sortedAsc = [...sorted].sort((a, b) => a.date.localeCompare(b.date));
  const runs = [];
  let run = [];
  for (const ev of sortedAsc) {
    if ((revenueByEvent[ev.id] || 0) > 0) run.push(ev);
    else { if (run.length) runs.push(run); run = []; }
  }
  if (run.length) runs.push(run);

  const lastEvent = sortedAsc[sortedAsc.length - 1];
  const currentStreak = (revenueByEvent[lastEvent.id] || 0) > 0 && runs.length
    ? runs[runs.length - 1].length
    : 0;

  const top5 = [...runs].sort((a, b) => b.length - a.length).slice(0, 5);
  const withResult = sortedSincePromoter.filter(e => (revenueByEvent[e.id] || 0) > 0).length;

  // Raggruppa per mese
  const byMonth = {};
  displayed.forEach(ev => {
    const key = ev.date.slice(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(ev);
  });

  const monthKeys = Object.keys(byMonth).sort((a, b) => b.localeCompare(a));

  const formatMonth = (key) => {
    const [y, m] = key.split('-');
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.getDate().toString().padStart(2, '0');
  };

  const getDayLabel = (dateStr) => {
    const d = new Date(dateStr);
    return ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'][d.getDay()];
  };

  return (
    <ChartFullscreen title="Heatmap Serate" rotateOnMobile={false}>
      <Div className="rounded-xl bg-card border border-border overflow-hidden">
        <Btn
          button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between px-4 py-3 pr-10 hover:bg-secondary/20 transition-colors">
          <Div className="flex items-center gap-2">
            <Span className="text-sm font-semibold">Heatmap Serate</Span>
            <Span className="text-xs text-muted-foreground">
              Streak attiva: <Span className="text-green-400 font-semibold">{currentStreak}</Span>
              {' · '}{withResult}/{sortedSincePromoter.length} con risultato
              {notYetCount > 0 && ` · ${notYetCount} prima di essere promoter`} · {sorted.length} totali
            </Span>
          </Div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </Btn>

        <Div className="px-4 pb-4 space-y-4">
          {monthKeys.map(mk => (
            <Div key={mk}>
              <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {formatMonth(mk)}
              </P>
              <Div className="flex flex-wrap gap-1.5">
                {byMonth[mk].map(ev => {
                  const rev = revenueByEvent[ev.id] || 0;
                  const hasResult = rev > 0;
                  const notYetPromoter = promoterFrom && ev.date < promoterFrom;
                  return (
                    <Div
                      key={ev.id}
                      onMouseEnter={(e) => setHovered({ id: ev.id, rect: e.currentTarget.getBoundingClientRect() })}
                      onMouseLeave={() => setHovered(h => (h?.id === ev.id ? null : h))}
                      className={`relative flex flex-col items-center justify-center w-9 h-9 rounded-md border text-[9px] font-bold transition-all cursor-default
                        ${notYetPromoter
                          ? 'bg-neutral-900/60 border-neutral-700/40 text-neutral-600'
                          : hasResult
                            ? 'bg-green-500/15 border-green-500/40 text-green-400'
                            : 'bg-red-500/15 border-red-500/40 text-red-400/70'
                        }`}
                    >
                      <Span className="leading-none">{formatDate(ev.date)}</Span>
                      <Span className="leading-none mt-0.5 opacity-70">{getDayLabel(ev.date)}</Span>
                      {!notYetPromoter && (
                        <Span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] text-white font-bold
                          ${hasResult ? 'bg-green-500' : 'bg-red-500'}`}>
                          {hasResult ? '✓' : '✕'}
                        </Span>
                      )}
                    </Div>
                  );
                })}
              </Div>
            </Div>
          ))}

          {!expanded && sorted.length > 30 && (
            <Btn
              button
              onClick={() => setExpanded(true)}
              className="text-xs text-primary hover:underline mt-1">
              Mostra tutte le {sorted.length} serate
            </Btn>
          )}

          {/* Top 5 streak più lunghe */}
          {top5.length > 0 && (
            <Div className="mt-2 rounded-lg bg-secondary/30 border border-border p-3">
              <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Top 5 streak più lunghe</P>
              <Div className="space-y-1.5">
                {top5.map((r, i) => (
                  <Div key={i} className="flex items-center gap-3 text-xs">
                    <Span className="w-5 text-center font-bold text-primary">{i + 1}</Span>
                    <Span className="font-semibold">{r.length} serate</Span>
                    <Span className="text-muted-foreground">
                      {fmtDate(r[0].date)} → {fmtDate(r[r.length - 1].date)}
                    </Span>
                    {r.length === currentStreak && (revenueByEvent[lastEvent.id] || 0) > 0 && (
                      <Span className="ml-auto text-[10px] text-green-400 font-semibold">in corso</Span>
                    )}
                  </Div>
                ))}
              </Div>
            </Div>
          )}
        </Div>

        {hovered && (() => {
          const ev = displayed.find(e => e.id === hovered.id);
          if (!ev) return null;
          const rev = revenueByEvent[ev.id] || 0;
          const hasResult = rev > 0;
          const notYetPromoter = promoterFrom && ev.date < promoterFrom;
          const centerX = hovered.rect.left + hovered.rect.width / 2;
          const halfTooltip = 130;
          const clampedX = Math.min(Math.max(centerX, halfTooltip + 4), webWindow.innerWidth - halfTooltip - 4);
          return (
            <Div
              className="fixed z-50 rounded-lg bg-popover border border-border px-2.5 py-1.5 shadow-lg pointer-events-none -translate-x-1/2"
              style={{ left: clampedX, top: hovered.rect.top - 8, width: halfTooltip * 2, transform: 'translate(-50%, -100%)' }}
            >
              <P className="text-[10px] font-semibold text-foreground">{getDayLabel(ev.date)} {ev.date.slice(8, 10)} — {ev.name}{ev.venue ? ` @ ${ev.venue}` : ''}</P>
              <P className={`text-[11px] font-bold ${notYetPromoter ? 'text-neutral-500' : hasResult ? 'text-green-400' : 'text-red-400'}`}>
                {notYetPromoter ? 'Non ancora promoter' : hasResult ? `€${rev.toLocaleString('it-IT')}` : 'Nessun fatturato'}
              </P>
            </Div>
          );
        })()}
      </Div>
    </ChartFullscreen>
  );
}