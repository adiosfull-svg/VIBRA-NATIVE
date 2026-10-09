// Port di src/components/client/ClientCostanzaChart.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { motion, AnimatePresence } from '@/ui/motion';
import { parseISO, format, eachMonthOfInterval, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import { Activity } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import ChartFullscreen from '@/web/components/charts/ChartFullscreen';

import { Btn, Div, P, Span } from '@/ui/html';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';

const CELL_SIZE = 28; // px per cella
const MONTH_LABEL_W = 140;

// 5 livelli di intensità colore
function cellColor(count, max) {
  if (!count || max === 0) return null;
  const ratio = count / max;
  if (ratio <= 0.20) return { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.35)' };
  if (ratio <= 0.40) return { bg: 'rgba(139,92,246,0.32)', border: 'rgba(139,92,246,0.55)' };
  if (ratio <= 0.60) return { bg: 'rgba(139,92,246,0.52)', border: 'rgba(139,92,246,0.75)' };
  if (ratio <= 0.80) return { bg: 'rgba(139,92,246,0.75)', border: 'rgba(139,92,246,0.95)' };
  return { bg: 'rgba(139,92,246,1)', border: 'rgba(167,139,250,1)' };
}

const INTENSITY_LEVELS = [
  { label: 'Molto bassa', bg: 'rgba(139,92,246,0.15)' },
  { label: 'Bassa',       bg: 'rgba(139,92,246,0.32)' },
  { label: 'Media',       bg: 'rgba(139,92,246,0.52)' },
  { label: 'Alta',        bg: 'rgba(139,92,246,0.75)' },
  { label: 'Massima',     bg: 'rgba(139,92,246,1)'    },
];

function getIntensityLevel(count, max) {
  if (!count || max === 0) return null;
  const ratio = count / max;
  if (ratio <= 0.20) return INTENSITY_LEVELS[0];
  if (ratio <= 0.40) return INTENSITY_LEVELS[1];
  if (ratio <= 0.60) return INTENSITY_LEVELS[2];
  if (ratio <= 0.80) return INTENSITY_LEVELS[3];
  return INTENSITY_LEVELS[4];
}

function CustomTooltip({ data, x, y, maxCount }) {
  if (!data) return null;
  const level = getIntensityLevel(data.count, maxCount);
  // Clamp orizzontale: evita che il popup venga tagliato dal bordo destro/sinistro
  // del viewport. Il popup ha min-width 160px e translate(-50%), quindi metà
  // larghezza ~80px + margine di sicurezza 12px.
  const vw = typeof window !== 'undefined' ? webWindow.innerWidth : 999;
  const halfW = 92;
  const clampedX = Math.max(halfW, Math.min(x, vw - halfW));
  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="fixed z-[10001] pointer-events-none rounded-xl border border-white/10 bg-[hsl(240_6%_8%)] shadow-2xl px-3 py-2.5 text-xs min-w-[160px]"
      style={{ left: clampedX, top: y, transform: 'translate(-50%, -110%)' }}
    >
      <P className="font-bold text-foreground">{data.clientName}</P>
      <P className="text-muted-foreground">{data.monthLabel}</P>
      <P className="text-primary font-semibold mt-1">{data.count} {data.count === 1 ? 'presenza' : 'presenze'}</P>
      {data.revenue > 0 && <P className="text-green-400 font-semibold">€{data.revenue.toLocaleString('it-IT')}</P>}

      {/* Legenda intensità */}
      {level && (
        <Div className="mt-2 pt-2 border-t border-white/[0.08] space-y-1">
          <P className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Intensità</P>
          <Div className="flex flex-col gap-0.5">
            {INTENSITY_LEVELS.map((lvl) => (
              <Div key={lvl.label} className="flex items-center gap-1.5">
                <Span
                  className="w-2.5 h-2.5 rounded-sm shrink-0 border border-white/10"
                  style={{ background: lvl.bg }}
                />
                <Span
                  className="text-[10px]"
                  style={{
                    color: lvl.label === level.label ? '#fff' : 'hsl(240,5%,50%)',
                    fontWeight: lvl.label === level.label ? 700 : 400,
                  }}
                >
                  {lvl.label}
                  {lvl.label === level.label && ' ◀'}
                </Span>
              </Div>
            ))}
          </Div>
        </Div>
      )}
    </motion.div>,
    webDocument.body
  );
}

export default function ClientCostanzaChart({ clients, attendances, events, promoterId }) {
  const [hovered, setHovered] = useState(null); // { clientIdx, monthIdx, x, y, data }
  const [tapped, setTapped] = useState(null); // per mobile tap
  const [topN, setTopN] = useState(15);
  const [showAll, setShowAll] = useState(false);

  // Chiudi il tooltip mobile allo scroll (qualsiasi direzione) per non bloccare la navigazione
  useEffect(() => {
    if (!tapped) return;
    const handleClose = () => setTapped(null);
    webWindow.addEventListener('scroll', handleClose, { passive: true, capture: true });
    return () => webWindow.removeEventListener('scroll', handleClose, { capture: true });
  }, [tapped]);

  // Costruisce la matrice: per ogni client × mese → { count, revenue }
  const { matrix, months, topClients } = useMemo(() => {
    if (!clients.length || !events.length) return { matrix: [], months: [], topClients: [] };

    // Filtra attendance: solo clienti (con client_id) del promoter corrente
    const myClientIds = new Set(clients.map(c => c.id));
    const clientAtts = attendances.filter(a => a.client_id && myClientIds.has(a.client_id));

    // Trova range date
    const datesWithAtts = clientAtts
      .map(a => events.find(e => e.id === a.event_id)?.date)
      .filter(Boolean)
      .sort();

    if (!datesWithAtts.length) return { matrix: [], months: [], topClients: [] };

    const minDate = startOfMonth(parseISO(datesWithAtts[0]));
    const maxDate = endOfMonth(parseISO(datesWithAtts[datesWithAtts.length - 1]));
    const months = eachMonthOfInterval({ start: minDate, end: maxDate });

    // Per ogni cliente: totale presenze (per ordinamento)
    const clientTotals = clients.map(c => {
      const ca = clientAtts.filter(a => a.client_id === c.id);
      return { client: c, total: ca.length };
    }).filter(ct => ct.total > 0).sort((a, b) => b.total - a.total);

    const topClients = showAll ? clientTotals.map(ct => ct.client) : clientTotals.slice(0, topN).map(ct => ct.client);

    // Matrice: topClients × months → { count, revenue }
    const matrix = topClients.map(c => {
      return months.map(monthStart => {
        const interval = { start: monthStart, end: endOfMonth(monthStart) };
        const monthAtts = clientAtts.filter(a => {
          if (a.client_id !== c.id) return false;
          const ev = events.find(e => e.id === a.event_id);
          if (!ev?.date) return false;
          return isWithinInterval(parseISO(ev.date), interval);
        });
        return {
          count: monthAtts.length,
          revenue: monthAtts.reduce((s, a) => s + (a.revenue || 0), 0),
        };
      });
    });

    return { matrix, months, topClients };
  }, [clients, attendances, events, topN, showAll]);

  const maxCount = useMemo(() => {
    let m = 0;
    matrix.forEach(row => row.forEach(cell => { if (cell.count > m) m = cell.count; }));
    return m;
  }, [matrix]);

  if (!topClients.length) {
    return (
      <Div className="rounded-2xl bg-card border border-border p-8 text-center">
        <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <P className="text-sm text-muted-foreground">Nessun dato di presenza disponibile</P>
      </Div>
    );
  }

  // Larghezza totale griglia
  const gridW = months.length * CELL_SIZE;

  return (
    <ChartFullscreen title="Costanza Clienti" rotateOnMobile={false}>
      <Div
        className="rounded-2xl bg-card border border-border overflow-hidden dash-fade-up"
      >
        {/* Header */}
        <Div className="px-4 py-3 border-b border-border bg-secondary/20 flex items-center justify-between flex-wrap gap-2">
          <Div className="flex items-center gap-2">
            <SectionHeader icon={Activity} title="Costanza Clienti" color="#a78bfa" />
            <Span className="text-[10px] text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">presenze mese per mese</Span>
          </Div>
          {/* Selettore quanti clienti */}
          <Div className="flex items-center gap-1 flex-wrap">
            {[10, 15, 25].map(n => (
              <Btn
                button
                key={n}
                onClick={() => { setTopN(n); setShowAll(false); }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all ${!showAll && topN === n ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                Top {n}
              </Btn>
            ))}
            <Btn
              button
              onClick={() => setShowAll(true)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all ${showAll ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              Tutti
            </Btn>
          </Div>
        </Div>

        {/* Legenda */}
        <Div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap">
          <Span className="text-[10px] text-muted-foreground">Intensità:</Span>
          {[
            { bg: 'rgba(139,92,246,0.15)', label: 'Molto bassa' },
            { bg: 'rgba(139,92,246,0.32)', label: 'Bassa' },
            { bg: 'rgba(139,92,246,0.52)', label: 'Media' },
            { bg: 'rgba(139,92,246,0.75)', label: 'Alta' },
            { bg: 'rgba(139,92,246,1)',    label: 'Massima' },
          ].map(({ bg, label }) => (
            <Span key={label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Span className="w-3 h-3 rounded-sm" style={{ background: bg }} />
              {label}
            </Span>
          ))}
          <Span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Span className="w-3 h-3 rounded-sm bg-secondary/40 border border-border" />
            Assente
          </Span>
        </Div>

        {/* Scroll container */}
        <Div className="overflow-x-auto pb-4 px-4 pt-1">
          <Div style={{ minWidth: MONTH_LABEL_W + gridW + 8 }}>
            {/* Header mesi */}
            <Div className="flex mb-1" style={{ paddingLeft: MONTH_LABEL_W }}>
              {months.map((m, mIdx) => (
                <Div key={mIdx} style={{ width: CELL_SIZE, minWidth: CELL_SIZE }}
                  className="text-center text-[9px] text-muted-foreground font-medium truncate px-0.5">
                  {format(m, 'MMM', { locale: it })}
                </Div>
              ))}
            </Div>

            {/* Righe clienti */}
            {topClients.map((client, cIdx) => (
              <Div
                key={client.id}
                className="flex items-center mb-1 heatmap-row-in"
                style={{ animationDelay: `${cIdx * 25}ms` }}
              >
                {/* Nome cliente */}
                <Div
                  style={{ width: MONTH_LABEL_W, minWidth: MONTH_LABEL_W }}
                  className="text-[10px] font-medium text-foreground pr-2 text-right leading-tight"
                  accessibilityLabel={client.name}
                >
                  {client.name}
                </Div>

                {/* Celle mesi */}
                {matrix[cIdx]?.map((cell, mIdx) => {
                  const colors = cellColor(cell.count, maxCount);
                  const isHov = hovered?.clientIdx === cIdx && hovered?.monthIdx === mIdx;
                  return (
                    <Btn
                      key={mIdx}
                      style={{
                        width: CELL_SIZE - 2,
                        height: CELL_SIZE - 2,
                        minWidth: CELL_SIZE - 2,
                        marginRight: 2,
                        background: colors ? colors.bg : 'rgba(255,255,255,0.04)',
                        borderRadius: 5,
                        border: `1px solid ${colors ? colors.border : 'rgba(255,255,255,0.06)'}`,
                        cursor: cell.count > 0 ? 'pointer' : 'default',
                        boxShadow: isHov && colors ? `0 0 10px ${colors.bg}` : undefined,
                        transform: isHov ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        if (!cell.count) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const tooltipData = {
                          clientIdx: cIdx, monthIdx: mIdx,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          data: { clientName: client.name, monthLabel: format(months[mIdx], 'MMMM yyyy', { locale: it }), count: cell.count, revenue: cell.revenue }
                        };
                        setHovered(tooltipData);
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onClick={e => {
                        if (!cell.count) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const tooltipData = {
                          clientIdx: cIdx, monthIdx: mIdx,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          data: { clientName: client.name, monthLabel: format(months[mIdx], 'MMMM yyyy', { locale: it }), count: cell.count, revenue: cell.revenue }
                        };
                        setTapped(prev => (prev?.clientIdx === cIdx && prev?.monthIdx === mIdx) ? null : tooltipData);
                      }} />
                  );
                })}
              </Div>
            ))}
          </Div>
        </Div>

        <AnimatePresence>
          {(hovered || tapped) && <CustomTooltip data={(hovered || tapped).data} x={(hovered || tapped).x} y={(hovered || tapped).y} maxCount={maxCount} />}
        </AnimatePresence>
      </Div>
    </ChartFullscreen>
  );
}