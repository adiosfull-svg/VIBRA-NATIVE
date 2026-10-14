// Port di src/components/instagram/InstagramConnectionAdmin.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Link2, Trash2, Loader2 } from '@/ui/icons.generated';
import { format, formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

import { Btn, Div, H, P, Span } from '@/ui/html';

/**
 * Pannello admin: lista di tutti i promoter con Instagram collegato,
 * con data di collegamento e bottone disconnessione.
 */
export default function InstagramConnectionAdmin() {
  const qc = useQueryClient();

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['ig-tokens-admin'],
    queryFn: () => base44.entities.PromoterIGToken.list(),
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters-list-all'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 120000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const promoterName = (id) => promoters.find(p => p.id === id)?.name || 'Sconosciuto';
  const promoterIgHandle = (id) => promoters.find(p => p.id === id)?.ig_username_synced || '';

  const handleDisconnect = async (token) => {
    const name = promoterName(token.promoter_id);
    if (!confirm(`Disconnettere Instagram di ${name}? I DM non saranno più sincronizzati.`)) return;
    try {
      await base44.entities.PromoterIGToken.delete(token.id);
      qc.invalidateQueries({ queryKey: ['ig-tokens-admin'] });
    } catch (err) {
      console.error('Disconnect failed:', err);
    }
  };

  return (
    <Div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <Div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-pink-400" />
        <H className="text-sm font-medium">Account collegati ({tokens.length})</H>
      </Div>
      <P className="text-xs text-muted-foreground">
        Promoter con Instagram Business collegato. Puoi disconnettere un account in qualsiasi momento.
      </P>

      {isLoading ? (
        <Div className="flex items-center justify-center h-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </Div>
      ) : tokens.length === 0 ? (
        <P className="text-xs text-muted-foreground text-center py-6">Nessun account collegato</P>
      ) : (
        <Div className="space-y-2">
          {tokens.map(token => {
            const name = promoterName(token.promoter_id);
            const handle = promoterIgHandle(token.promoter_id);
            return (
              <Div key={token.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-2.5">
                <Div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500/30 to-violet-500/30 flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4 text-pink-400" />
                </Div>
                <Div className="flex-1 min-w-0">
                  <P className="text-sm font-medium truncate">{name}</P>
                  <Div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    {handle && <Span className="truncate">@{handle}</Span>}
                    {token.ig_connected_at && (
                      <Span className="shrink-0">
                        {format(new Date(token.ig_connected_at), 'd MMM yyyy', { locale: it })}
                        {' · '}
                        {formatDistanceToNow(new Date(token.ig_connected_at), { addSuffix: true, locale: it })}
                      </Span>
                    )}
                  </Div>
                </Div>
                <Btn
                  button
                  onClick={() => handleDisconnect(token)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  accessibilityLabel="Disconnetti">
                  <Trash2 className="w-3.5 h-3.5" />
                </Btn>
              </Div>
            );
          })}
        </Div>
      )}
    </Div>
  );
}