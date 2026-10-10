// Port di src/components/promoter/TablesStreakHeatmap.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from '@/ui/icons.generated';
import { calcTables } from '@/legacy/utils/tables';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';
import { getDow } from '@/legacy/utils/dateUtils';



import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';



// Colore: <1.0 rosso; da 1.0 in poi giallo→verde (hue 48→140 su 1→5 tavoli).
function tablesColor(tables) {
  if (tables < 1.0) {
    return { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.45)', text: 'rgba(248,113,113,0.85)', dot: 'rgb(239,68,68)' };
  }
  const t = Math.min(1, (tables - 1) / 4);
  const hue = 48 + t * 92;
  return {
    bg: `hsla(${hue}, 85%, 50%, 0.18)`,
    border: `hsla(${hue}, 85%, 50%, 0.55)`,
    text: `hsl(${hue}, 85%, 68%)`,
    dot: `hsl(${hue}, 85%, 50%)`,
  };
}

function fmtDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(2)}`;
}

export default function TablesStreakHeatmap({ attendances, events, promoterFrom }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(null);

  // Tavoli per evento (somma revenue del promoter, soglia table_threshold dell'evento)
  const tablesByEvent = {};
  const revenueByEvent = {};
  attendances.forEach(a => {
    revenueByEvent[a.event_id] = (revenueByEvent[a.event_id] || 0) + (a.revenue || 0);
  });
  events.forEach(ev => {
    const rev = revenueByEvent[ev.id] || 0;
    tablesByEvent[ev.id] = calcTables(rev, getDow(ev.date), ev.table_threshold || 300);
  });

  const sorted = [...events]
    .filter(e => e.date)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) return null;

  const displayed = expanded ? sorted : sorted.slice(0, 30);
  const sortedAsc = [...sorted].sort((a, b) => a.date.localeCompare(b.date));

  // Streak: serie di serate consecutive con tavoli chiusi (>= 1.0)
  const runs = [];
  let run = [];
  for (const ev of sortedAsc) {
    if (tablesByEvent[ev.id] >= 1.0) run.push(ev);
    else { if (run.length) runs.push(run); run = []; }
  }
  if (run.length) runs.push(run);

  const lastEvent = sortedAsc[sortedAsc.length - 1];
  const currentStreak = tablesByEvent[lastEvent.id] >= 1.0 && runs.length
    ? runs[runs.length - 1].length
    : 0;

  const top5 = [...runs].sort((a, b) => b.length - a.length).slice(0, 5);

  const sortedSincePromoter = promoterFrom ? sorted.filter(e => e.date >= promoterFrom) : sorted;
  const notYetCount = sorted.length - sortedSincePromoter.length;
  const withTables = sortedSincePromoter.filter(e => tablesByEvent[e.id] >= 1.0).length;

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
  const formatDate = (dateStr) => new Date(dateStr).getDate().toString().padStart(2, '0');
  const getDayLabel = (dateStr) => {
    const d = new Date(dateStr);
    return ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'][d.getDay()];
  };

  return (
    <ChartFullscreen title="Heatmap Tavoli" rotateOnMobile={false}>
      <Div className="rounded-xl bg-card border border-border overflow-hidden">
        <Btn
          button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between px-4 py-3 pr-10 hover:bg-secondary/20 transition-colors">
          <Div className="flex items-center gap-2">
            <Span className="text-sm font-semibold">Heatmap Tavoli</Span>
            <Span className="text-xs text-muted-foreground">
              Streak attiva: <Span className="text-green-400 font-semibold">{currentStreak}</Span>
              {' · '}{withTables}/{sortedSincePromoter.length} con tavoli chiusi
              {notYetCount > 0 && ` · ${notYetCount} prima di essere promoter`} · {sorted.length} totali
            </Span>
          </Div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </Btn>

        {/* Legenda sfumatura */}
        <Div className="px-4 pb-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
          <Span className="flex items-center gap-1"><Span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(239,68,68,0.4)', border: '1px solid rgba(239,68,68,0.6)' }} />&lt;1</Span>
          <Span className="flex items-center gap-1"><Span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsla(48,85%,50%,0.5)' }} />1</Span>
          <Span className="flex items-center gap-1"><Span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsla(94,85%,50%,0.5)' }} />3</Span>
          <Span className="flex items-center gap-1"><Span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'hsla(140,85%,50%,0.5)' }} />5+</Span>
        </Div>

        <Div className="px-4 pb-4 space-y-4">
          {monthKeys.map(mk => (
            <Div key={mk}>
              <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {formatMonth(mk)}
              </P>
              <Div className="flex flex-wrap gap-1.5">
                {byMonth[mk].map(ev => {
                  const tables = tablesByEvent[ev.id] || 0;
                  const c = tablesColor(tables);
                  const notYetPromoter = promoterFrom && ev.date < promoterFrom;
                  return (
                    <Div
                      key={ev.id}
                      onMouseEnter={(e) => setHovered({ id: ev.id, rect: e.currentTarget.getBoundingClientRect() })}
                      onMouseLeave={() => setHovered(h => (h?.id === ev.id ? null : h))}
                      className="relative flex flex-col items-center justify-center w-9 h-9 rounded-md border text-[9px] font-bold transition-all cursor-default"
                      style={notYetPromoter
                        ? { background: 'rgba(23,23,23,0.6)', borderColor: 'rgba(64,64,64,0.4)', color: 'rgba(115,115,115,0.8)' }
                        : { background: c.bg, borderColor: c.border, color: c.text }}
                    >
                      <Span className="leading-none">{formatDate(ev.date)}</Span>
                      <Span className="leading-none mt-0.5 opacity-70">{getDayLabel(ev.date)}</Span>
                      {!notYetPromoter && (
                        <Span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-1 rounded-full flex items-center justify-center text-[7px] text-white font-bold"
                          style={{ background: c.dot }}>
                          {tables < 1.0 ? '✕' : tables.toFixed(1).replace('.', ',')}
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
                    {r.length === currentStreak && tablesByEvent[lastEvent.id] >= 1.0 && (
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
          const tables = tablesByEvent[ev.id] || 0;
          const rev = revenueByEvent[ev.id] || 0;
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
              <P className={`text-[11px] font-bold ${notYetPromoter ? 'text-neutral-500' : tables >= 1.0 ? 'text-green-400' : 'text-red-400'}`}>
                {notYetPromoter ? 'Non ancora promoter' : tables >= 1.0 ? `${tables.toFixed(1).replace('.', ',')} tavoli · €${rev.toLocaleString('it-IT')}` : `${tables.toFixed(1).replace('.', ',')} tavoli (non chiuso) · €${rev.toLocaleString('it-IT')}`}
              </P>
            </Div>
          );
        })()}
      </Div>
    </ChartFullscreen>
  );
}