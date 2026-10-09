// Port di src/components/client/ClientRatingHistory.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { parseISO, endOfMonth, startOfMonth, addMonths, isSameMonth, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Gem, TrendingUp, TrendingDown, Minus } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { computeClientRanking, rankingColor } from '@/legacy/utils/clientRanking';
import { useDragScroll } from '@/web/hooks/useDragScroll';

import { Div, Span } from '@/ui/html';

/**
 * Storico del rating del cliente mese per mese (stile icona FIFA, compatto).
 * Il mese corrente usa direttamente il cum_rating pre-calcolato (valore reale);
 * i mesi passati ricalcolano il rating cumulativo "a fine mese" con il
 * decadimento valutato a quella data.
 */
export default function ClientRatingHistory({ client, attendances, events, months = 6 }) {
  // Desktop: la barra di scorrimento è nascosta, quindi si scorre trascinando col mouse (come negli altri box orizzontali).
  const { ref: dragRef, handlers: dragHandlers } = useDragScroll();
  const monthlyRatings = useMemo(() => {
    if (!client || !attendances || !events) return [];
    const now = new Date();

    // Mappa eventi O(1) + pre-parsing date (una sola volta, non per ogni mese)
    const eventsById = Object.fromEntries(events.map(e => [e.id, e]));
    const datedAtt = attendances
      .map(a => ({ a, t: eventsById[a.event_id]?.date ? parseISO(eventsById[a.event_id].date).getTime() : null }))
      .filter(x => x.t != null);
    const datedEvents = events
      .map(e => ({ e, t: e.date ? parseISO(e.date).getTime() : null }))
      .filter(x => x.t != null);

    if (datedAtt.length === 0) return [];
    const firstTs = Math.min(...datedAtt.map(x => x.t));
    const startMonth = startOfMonth(firstTs);

    const result = [];
    let cursor = new Date(startMonth);
    while (cursor <= now) {
      const isCurrent = isSameMonth(cursor, now);
      const asOf = isCurrent ? Date.now() : endOfMonth(cursor).getTime();
      const upTo = datedAtt.filter(x => x.t <= asOf).map(x => x.a);
      const visits = upTo.length;
      const totalSpent = upTo.reduce((s, a) => s + (a.revenue || 0), 0);
      const avgSpent = visits > 0 ? Math.round(totalSpent / visits) : 0;
      const eventsUpTo = datedEvents.filter(x => x.t <= asOf).map(x => x.e);
      let rating;
      if (isCurrent && client.cum_rating) {
        rating = client.cum_rating;
      } else {
        rating = computeClientRanking(client, { visits, avgSpent, attendances: upTo }, eventsUpTo, undefined, asOf);
      }
      result.push({ label: format(cursor, 'MMM yy', { locale: it }), rating });
      cursor = addMonths(cursor, 1);
    }
    return result;
  }, [client, attendances, events, months]);

  if (!monthlyRatings.some(m => m.rating != null)) return null;

  return (
    <Div className="rounded-xl bg-card border border-border p-2.5 space-y-1.5">
      <SectionHeader icon={Gem} title="Evoluzione Rating" color="#a78bfa" />
      <Div ref={dragRef} {...dragHandlers} className="flex gap-1.5 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none">
        {monthlyRatings.map((m, i) => {
          const prev = i > 0 ? monthlyRatings[i - 1].rating : null;
          const trend = m.rating == null || prev == null ? null : m.rating > prev ? 'up' : m.rating < prev ? 'down' : 'stable';
          return (
            <Div key={i} className="flex flex-col items-center justify-center rounded-md border border-white/[0.06] bg-secondary/20 px-2 py-1 min-w-[44px]">
              <Span className="text-[8px] text-muted-foreground uppercase">{m.label}</Span>
              <Span className={`text-sm font-bold leading-tight ${rankingColor(m.rating)}`}>{m.rating != null ? m.rating.toFixed(1) : '—'}</Span>
              <Span className="h-2.5 flex items-center">
                {trend === 'up' && <TrendingUp className="w-2.5 h-2.5 text-green-400" />}
                {trend === 'down' && <TrendingDown className="w-2.5 h-2.5 text-red-400" />}
                {trend === 'stable' && <Minus className="w-2.5 h-2.5 text-muted-foreground" />}
              </Span>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}