// Equivalente nativo di src/components/client/VirtualizedClientList.jsx: lista mobile virtualizzata
// sullo scroll della pagina (qui lo ScrollView di Page, vedi hooks/usePageWindow). Rende solo gli
// item nel viewport + overscan, posizionati in assoluto in un contenitore alto quanto la lista.
// PORT: l'originale misurava il primo item; sul web la misura legge l'altezza del contenitore
// (alto itemHeight con overflow nascosto), quindi l'altezza resta sempre 110.
import React, { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import ClientRowCard from './ClientRowCard';
import { Div } from '@/ui/html';
import { usePageWindow } from '@/web/hooks/usePageWindow';
import { pageScroll } from '@/web/shims/pageScroll';

const ITEM_HEIGHT = 110;
const HANDLER_NAMES = ['onDetail', 'onAddPresence', 'onEditAttendance', 'onEdit', 'onDelete', 'onSetReminder'];
const OVERSCAN = 6;

export default function VirtualizedClientList({ clients, getClientStats, clientBadges, events, attendances, handlers, selectMode, selectedIds, onToggleSelect, scrollToClientId, onScrolled, highlightClientId }) {
  const { containerRef, start, end } = usePageWindow(clients.length, ITEM_HEIGHT, OVERSCAN);
  // handlers è un oggetto nuovo a ogni render di Clienti: callback stabili che chiamano le ultime,
  // così le righe memoizzate non si ridisegnano a ogni scroll o render della pagina
  const handlersRef = useRef(handlers);
  useLayoutEffect(() => { handlersRef.current = handlers; });
  const stableHandlers = useMemo(() => Object.fromEntries(HANDLER_NAMES.map(k => [k, (...a) => handlersRef.current[k]?.(...a)])), []);

  // Scrolla la pagina alla riga del cliente richiesto (da ClientScrollSearch)
  useEffect(() => {
    if (!scrollToClientId) return;
    const idx = clients.findIndex(c => c.id === scrollToClientId);
    if (idx < 0) return;
    const containerTop = pageScroll.offsetOf(containerRef.current);
    if (containerTop == null) return;
    // Offset: sticky header (~84px) + un po' di margine per centrare la riga
    pageScroll.scrollTo(containerTop + idx * ITEM_HEIGHT - 110, true);
    onScrolled?.();
  }, [scrollToClientId]);

  const slice = clients.slice(start, end);
  return (
    <Div ref={containerRef} style={{ position: 'relative', height: clients.length * ITEM_HEIGHT }} className="sm:hidden">
      {slice.map((c, i) => {
        const idx = start + i;
        return (
          <Row
            key={c.id}
            idx={idx}
            client={c}
            stats={getClientStats(c.id)}
            badges={clientBadges[c.id]}
            events={events}
            attendances={attendances}
            handlers={stableHandlers}
            selectMode={selectMode}
            selected={!!selectedIds?.has(c.id)}
            onToggleSelect={onToggleSelect}
            highlighted={highlightClientId === c.id}
          />
        );
      })}
    </Div>
  );
}

const NO_BADGES = [];

// Riga memoizzata: scorrendo, le righe già montate non si ridisegnano (cambia solo la finestra).
const Row = memo(function Row({ idx, client, stats, badges, events, attendances, handlers, selectMode, selected, onToggleSelect, highlighted }) {
  return (
    <Div style={{ position: 'absolute', top: idx * ITEM_HEIGHT, left: 0, right: 0, height: ITEM_HEIGHT, overflow: 'hidden' }}>
      <ClientRowCard
        client={client}
        stats={stats}
        badges={badges || NO_BADGES}
        events={events}
        attendances={attendances}
        position={idx + 1}
        onDetail={handlers.onDetail}
        onAddPresence={handlers.onAddPresence}
        onEditAttendance={handlers.onEditAttendance}
        onEdit={handlers.onEdit}
        onDelete={handlers.onDelete}
        onSetReminder={handlers.onSetReminder}
        selectMode={selectMode}
        selected={selected}
        onToggleSelect={onToggleSelect}
        highlighted={highlighted}
      />
    </Div>
  );
});
