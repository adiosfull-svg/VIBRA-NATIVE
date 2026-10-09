// Port di src/components/client/BulkCreatedClientsList.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Star, Phone, Instagram, CheckCircle2 } from '@/ui/icons.generated';
import ClientDetailDialog from '@/web/components/client/ClientDetailDialog';

import { Btn, Div, P, Span } from '@/ui/html';

// Mostra i clienti creati in blocco durante la sessione corrente del dialog,
// come card persistenti. Cliccando la card si apre il dettaglio cliente completo
// (come nella lista clienti principale), per modificare tutti i dati senza
// cambiare pagina.
export default function BulkCreatedClientsList({ clients, allClients = [], attendances = [], events = [], onUpdated }) {
  const [detailClient, setDetailClient] = useState(null);

  if (!clients || clients.length === 0) return null;

  return (
    <Div className="space-y-2">
      <Div className="flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <P className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
          Creati in questa sessione ({clients.length})
        </P>
      </Div>
      <Div className="space-y-1.5">
        {clients.map(c => (
          <Btn
            button
            key={c.id}
            onClick={() => setDetailClient(c)}
            className="w-full flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/12 hover:border-emerald-500/50 px-3 py-2 text-left transition-colors">
            <Div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
              {c.name?.charAt(0)?.toUpperCase()}
            </Div>
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-1.5">
                {c.is_leader && <Star className="w-3 h-3 text-yellow-400 shrink-0" />}
                <Span className="text-xs font-semibold text-foreground truncate">{c.name}</Span>
              </Div>
              <Div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                {c.phone && <Span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" />{c.phone}</Span>}
                {c.instagram && <Span className="flex items-center gap-0.5"><Instagram className="w-2.5 h-2.5" />@{c.instagram}</Span>}
                {!c.phone && !c.instagram && <Span className="text-amber-400/70">Tocca per aprire il dettaglio e aggiungere i dati</Span>}
              </Div>
            </Div>
          </Btn>
        ))}
      </Div>

      <ClientDetailDialog
        open={!!detailClient}
        onOpenChange={(o) => { if (!o) setDetailClient(null); }}
        client={detailClient}
        attendances={attendances}
        events={events}
        badges={[]}
        allClients={allClients}
        embeddedInDialog
        onClientUpdated={(updated) => {
          setDetailClient(updated);
          onUpdated?.(updated);
        }}
      />
    </Div>
  );
}