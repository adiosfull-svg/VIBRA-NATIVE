// Equivalente nativo di src/components/client/VirtualizedClientList.jsx.
// Sul web virtualizzava le righe in base allo scroll della finestra (DOM); qui la pagina è uno
// ScrollView nativo e le righe sono rese in sequenza alla loro altezza naturale, con le stesse
// prop di ClientRowCard dell'originale.
import React from 'react';
import ClientRowCard from './ClientRowCard';
import { Div } from '@/ui/html';

export default function VirtualizedClientList({ clients, getClientStats, clientBadges, events, attendances, handlers, selectMode, selectedIds, onToggleSelect, highlightClientId }) {
  return (
    <Div>
      {clients.map((c, idx) => (
        <ClientRowCard
          key={c.id}
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
      ))}
    </Div>
  );
}
