// Port di src/components/client/DesktopClientTable.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import ClientTableRow from '@/web/components/client/ClientTableRow';

import { Div, P } from '@/ui/html';

import { win as webWindow } from '@/web/shims/dom';

/**
 * Tabella desktop virtualizzata (window-based): renderizza solo le righe
 * nel viewport + overscan, posizionandole assolutamente in un contenitore
 * alto quanto l'intera lista. Mantiene lo scroll nativo della pagina e
 * 60fps anche con centinaia di clienti. Stesso approccio di VirtualizedClientList.
 *
 * Altezza riga: avatar md (32px) + py-2 (16px) + py-1 (8px) ≈ 56px.
 */
const ROW_HEIGHT = 56;
const OVERSCAN = 8;

export default function DesktopClientTable({
  clients,
  clientStatsMap,
  clientBadges,
  events,
  attendances,
  onDetail,
  onAddPresence,
  onEditAttendance,
  onEdit,
  onDelete,
  allClients,
  selectMode,
  selectedIds,
  onToggleSelect,
  scrollToClientId,
  onScrolled,
  highlightClientId,
}) {
  const containerRef = useRef(null);
  const [view, setView] = useState({ start: 0, end: Math.min(clients.length, 30) });

  const compute = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top;
    const vh = webWindow.innerHeight;
    if (top > vh || top + rect.height < 0) return;
    const start = Math.max(0, Math.floor(-top / ROW_HEIGHT) - OVERSCAN);
    const end = Math.min(clients.length, Math.ceil((vh - top) / ROW_HEIGHT) + OVERSCAN);
    setView(prev => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, [clients.length]);

  useEffect(() => {
    compute();
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute); };
    webWindow.addEventListener('scroll', onScroll, { passive: true });
    webWindow.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      webWindow.removeEventListener('scroll', onScroll);
      webWindow.removeEventListener('resize', onScroll);
    };
  }, [compute]);

  useEffect(() => { compute(); }, [clients, compute]);

  // Scrolla alla riga del cliente selezionato dalla ricerca flottante.
  // Con virtualizzazione la riga potrebbe non essere renderizzata: calcoliamo
  // la posizione e scrolliamo la finestra, poi la virtualizzazione la renderizza.
  useEffect(() => {
    if (!scrollToClientId) return;
    const idx = clients.findIndex(c => c.id === scrollToClientId);
    if (idx < 0) return;
    const container = containerRef.current;
    if (!container) return;
    // Salta se nascosto via display:none (hidden su mobile): il container
    // virtuale ha rect 0,0 → calcolerebbe una posizione sbagliata e il suo
    // scrollTo sovrascriverebbe quello della lista visibile (bug mobile).
    if (!container.offsetParent) return;
    const containerTop = container.getBoundingClientRect().top + webWindow.scrollY;
    const targetTop = containerTop + idx * ROW_HEIGHT;
    webWindow.scrollTo({ top: targetTop - 120, behavior: 'smooth' });
    onScrolled?.();
  }, [scrollToClientId]);

  // Dati completi (stats, badges, initials, ranking, trend) dai campi pre-calcolati
  const rowsData = useMemo(() => {
    const map = {};
    clients.forEach(c => {
      const stats = clientStatsMap[c.id] || { visits: 0, fri: 0, sat: 0, sun: 0, extra: 0, totalSpent: 0, avgSpent: 0, attendances: [] };
      map[c.id] = {
        stats,
        badges: clientBadges[c.id] || [],
        ranking: stats.rating !== undefined ? stats.rating : (stats.visits > 0 ? (c.cum_rating || 0) : null),
        trend: c.cum_trend_status || null,
        initials: c.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      };
    });
    return map;
  }, [clients, clientStatsMap, clientBadges]);

  const clientNameMap = useMemo(() => {
    const m = {};
    (allClients || clients).forEach(c => { m[c.id] = c.name; });
    return m;
  }, [allClients, clients]);

  const totalHeight = clients.length * ROW_HEIGHT;
  const slice = clients.slice(view.start, view.end);

  return (
    <Div ref={containerRef} className="hidden sm:block">
      {/* Header colonne — sempre visibile, fuori dal contenitore virtualizzato */}
      <Div className="flex items-center border-b border-border/50 bg-secondary/10 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/80">
        <Div className="px-0.5 py-1.5 w-5 text-center shrink-0 text-[8px]">#</Div>
        <Div className="pl-1 pr-3 py-1.5 flex-1 min-w-[200px] text-left">Cliente</Div>
        <Div className="px-3 py-1.5 w-20 text-center shrink-0">Pres.</Div>
        <Div className="px-3 py-1.5 w-28 text-right shrink-0">Spesa tot.</Div>
        <Div className="px-3 py-1.5 w-24 text-right shrink-0">Media</Div>
        <Div className="px-3 py-1.5 w-24 text-center shrink-0">Nuove pers.</Div>
        <Div className="px-3 py-1.5 w-36 shrink-0"></Div>
      </Div>

      {clients.length === 0 ? (
        <P className="text-xs text-muted-foreground text-center py-6">Nessun cliente</P>
      ) : (
        <Div style={{ position: 'relative', height: totalHeight }}>
          {slice.map((c, i) => {
            const idx = view.start + i;
            return (
              <Div
                key={c.id}
                style={{ position: 'absolute', top: idx * ROW_HEIGHT, left: 0, right: 0, height: ROW_HEIGHT, overflow: 'visible' }}
              >
                <ClientTableRow
                  client={c}
                  rowData={rowsData[c.id]}
                  position={idx + 1}
                  referredName={c.referred_by_client_id ? clientNameMap[c.referred_by_client_id] : null}
                  onDetail={onDetail}
                  onAddPresence={onAddPresence}
                  onEditAttendance={onEditAttendance}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  selectMode={selectMode}
                  selected={!!selectedIds?.has(c.id)}
                  onToggleSelect={onToggleSelect}
                  highlighted={highlightClientId === c.id}
                />
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}