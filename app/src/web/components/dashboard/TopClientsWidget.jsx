// Port di src/components/dashboard/TopClientsWidget.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';

import { Star } from '@/ui/icons.generated';
import { rankingColor } from '@/legacy/utils/clientRanking';
import { useNavigate } from '@/web/router';

import { Btn, Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

export default function TopClientsWidget({ clients, promoters = [], delay = 0 }) {
  const navigate = useNavigate();

  const promoterMap = useMemo(() => {
    const map = {};
    for (const p of promoters) map[p.id] = p;
    return map;
  }, [promoters]);

  // Il rating e' gia' pre-calcolato in background (cum_rating): basta ordinare, niente presenze da scaricare.
  const topClients = useMemo(() => {
    return clients
      .filter(c => (c.cum_rating || 0) > 0)
      .sort((a, b) => (b.cum_rating || 0) - (a.cum_rating || 0))
      .slice(0, 13);
  }, [clients]);

  return (
    <Div
      className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 h-full"
      style={{ animationDelay: `${delay}s` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
        style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />

      <Div className="flex items-center gap-2 mb-4">
        <Div className="p-1.5 rounded-lg bg-blue-500/15">
          <Star className="w-4 h-4 text-blue-400" />
        </Div>
        <P className="text-xs font-semibold text-blue-400 uppercase tracking-widest">I Migliori Clienti di VIBRA</P>
      </Div>

      {topClients.length === 0 ? (
        <P className="text-xs text-muted-foreground text-center py-8">Nessun dato disponibile</P>
      ) : (
        <Div className="space-y-2.5 overflow-y-auto max-h-[520px] pr-1">
          {topClients.map((client, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const rating = client.cum_rating || 0;
            const colorClass = rankingColor(rating);
            return (
              <Btn
                key={client.id}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate('/clienti')}
              >
                <Span className="text-base w-6 text-center shrink-0">{medals[i] || `#${i + 1}`}</Span>
                <Div className="flex-1 min-w-0">
                  <Div className="flex items-center gap-1.5">
                    <P className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{client.name}</P>
                    {client.promoter_id && promoterMap[client.promoter_id] && (
                      <Div
                        className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold text-muted-foreground shrink-0 border border-white/[0.08]"
                        accessibilityLabel={promoterMap[client.promoter_id].name}
                      >
                        {promoterMap[client.promoter_id].photo_url
                          ? <Img src={promoterMap[client.promoter_id].photo_url} alt="" className="w-full h-full object-cover rounded-full" />
                          : promoterMap[client.promoter_id].name?.charAt(0)?.toUpperCase()
                        }
                      </Div>
                    )}
                  </Div>
                  <Div className="mt-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                    <Div
                      className="h-1 rounded-full bg-blue-400 bar-grow"
                      style={{
                        '--bar-width': `${(rating / 10) * 100}%`,
                      }}
                    />
                  </Div>
                </Div>
                <P className={`text-xs font-bold shrink-0 ${colorClass}`}>{rating.toFixed(1)}</P>
              </Btn>
            );
          })}
        </Div>
      )}
    </Div>
  );
}
