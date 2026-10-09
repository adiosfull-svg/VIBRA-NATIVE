// Port di src/components/client/ClientReferralsBox.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { Users, ChevronDown, Star } from '@/ui/icons.generated';
import ClientAvatar from '@/web/components/client/ClientAvatar';

import { Btn, Div, Span } from '@/ui/html';

/**
 * Box espandibile: mostra le persone portate dal cliente (referrals),
 * ovvero i clienti con source_type = "referred" e referred_by_client_id = client.id.
 */
export default function ClientReferralsBox({ client, allClients }) {
  const [expanded, setExpanded] = useState(false);

  const referrals = useMemo(
    () => allClients.filter(c => c.referred_by_client_id === client?.id),
    [allClients, client?.id]
  );

  if (referrals.length === 0) return null;

  return (
    <Div className="rounded-xl bg-card border border-border overflow-hidden">
      <Btn
        button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-secondary/30 transition-colors">
        <Div className="flex items-center gap-1.5">
          <Div className="flex items-center justify-center p-1.5 rounded-lg" style={{ background: '#34d3991a' }}>
            <Users className="w-4 h-4" style={{ color: '#34d399' }} />
          </Div>
          <Span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#34d399' }}>Persone portate</Span>
        </Div>
        <Span className="ml-auto text-xs font-bold text-emerald-400 tabular-nums">{referrals.length}</Span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </Btn>
      {expanded && (
        <Div className="border-t border-border/50 p-2.5 space-y-1.5">
          {referrals.map(c => {
            const initials = c.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <Div key={c.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 bg-secondary/20">
                <ClientAvatar client={c} initials={initials} size="sm" />
                <Span className="text-xs font-medium truncate flex-1">{c.name}</Span>
                {c.is_leader && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
                <Span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">{c.cum_visits || 0} pres.</Span>
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}