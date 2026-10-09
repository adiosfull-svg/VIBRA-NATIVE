// Equivalente nativo di src/components/client/VirtualizedClientList.jsx.
// Sul web virtualizzava le righe in base allo scroll della finestra (DOM); qui la pagina è uno
// ScrollView nativo e le righe sono rese in sequenza, ognuna nello stesso contenitore
// dell'originale: alto itemHeight con overflow nascosto (la card ha h-full). Sul web la misura del
// primo item legge l'altezza di quel contenitore, quindi itemHeight resta sempre 110.
import React from 'react';
import ClientRowCard from './ClientRowCard';
import { Div } from '@/ui/html';

const DEFAULT_ITEM_HEIGHT = 110;

export default function VirtualizedClientList({ clients, getClientStats, clientBadges, events, attendances, handlers, selectMode, selectedIds, onToggleSelect, highlightClientId }) {
  return (
    <Div className="sm:hidden">
      {clients.map((c, idx) => (
        <Div key={c.id} style={{ height: DEFAULT_ITEM_HEIGHT, overflow: 'hidden' }}>
          <ClientRowCard
            client={c}
            stats={getClientStats(c.id)}
            badges={clientBadges[c.id] || []}
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
            selected={!!selectedIds?.has(c.id)}
            onToggleSelect={onToggleSelect}
            highlighted={highlightClientId === c.id}
          />
        </Div>
      ))}
    </Div>
  );
}
