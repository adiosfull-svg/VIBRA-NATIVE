// Port di src/components/promoter/PromoterLastEventsPopup.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarDays, X } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { fetchByPromoter } from '@/web/lib/safeData';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';

import { Btn, Div, P } from '@/ui/html';
import { Img } from '@/ui/elements';

const Q = { staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 0 };

function VenueLogo({ venue, getVenueLogo }) {
  const { logoUrl } = getVenueLogo(venue || '');
  if (!logoUrl) {
    return (
      <Div className="w-8 h-8 rounded-lg bg-secondary/60 border border-border/40 flex items-center justify-center shrink-0">
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
      </Div>
    );
  }
  return (
    <Div className="w-8 h-8 rounded-lg overflow-hidden bg-secondary/40 border border-border/40 flex items-center justify-center shrink-0">
      <Img src={logoUrl} alt="" className="w-7 h-7 object-contain" />
    </Div>
  );
}

export default function PromoterLastEventsPopup({ open, promoter, onClose }) {
  const { getVenueLogo } = useAllVenueLogos();

  const { data: attendances = [], isLoading: la } = useQuery({
    queryKey: ['attendances-by-promoter', promoter?.id], queryFn: () => fetchByPromoter(base44.entities.EventAttendance, promoter.id, { sort: '-created_date' }),
    enabled: !!open && !!promoter, ...Q,
  });
  const { data: events = [], isLoading: le } = useQuery({
    queryKey: ['events'], queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled: !!open && !!promoter, ...Q,
  });

  if (!open || !promoter) return null;
  const loading = la || le;

  const evMap = new Map(events.map(e => [e.id, e]));
  const revenueByEvent = {};
  attendances.forEach(a => {
    if (a.promoter_id !== promoter.id || a.client_id) return;
    revenueByEvent[a.event_id] = (revenueByEvent[a.event_id] || 0) + (a.revenue || 0);
  });

  const withRev = Object.entries(revenueByEvent)
    .map(([eid, rev]) => ({ ev: evMap.get(eid), rev }))
    .filter(x => x.ev && x.ev.date && x.rev > 0)
    .sort((a, b) => b.ev.date.localeCompare(a.ev.date))
    .slice(0, 10);

  return (
    <Div
      className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 backdrop-fade-in p-4"
      onPointerDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); onClose(); } }}>
      <Div className="menu-pop-in w-full max-w-sm rounded-2xl border border-white/10 bg-popover shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <Div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-secondary/40 shrink-0">
          <Div className="flex items-center gap-2 min-w-0">
            {promoter.photo_url
              ? <Img src={promoter.photo_url} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
              : <Div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {promoter.name?.charAt(0)?.toUpperCase()}
                </Div>}
            <P className="text-xs font-semibold text-foreground truncate">Ultime serate · {promoter.name}</P>
          </Div>
          <Btn
            button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground shrink-0 text-lg leading-none">×</Btn>
        </Div>

        <Div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-2">
          {loading ? (
            <Div className="flex items-center justify-center py-8">
              <Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </Div>
          ) : withRev.length === 0 ? (
            <P className="text-sm text-muted-foreground text-center py-8">Nessuna serata con fatturato.</P>
          ) : (
            withRev.map(({ ev, rev }) => (
              <Div key={ev.id} className="flex items-center gap-3 rounded-lg bg-card/60 border border-border/40 px-3 py-2.5">
                <VenueLogo venue={ev.venue} getVenueLogo={getVenueLogo} />
                <Div className="min-w-0 flex-1">
                  <P className="text-sm font-semibold text-foreground truncate">{ev.name}</P>
                  <P className="text-[11px] text-muted-foreground truncate">
                    {format(new Date(ev.date), 'd MMM yyyy', { locale: it })}
                    {ev.venue ? ` · ${ev.venue}` : ''}
                  </P>
                </Div>
                <P className="text-sm font-bold text-emerald-400 shrink-0">€{rev.toLocaleString('it-IT')}</P>
              </Div>
            ))
          )}
        </Div>
      </Div>
    </Div>
  );
}