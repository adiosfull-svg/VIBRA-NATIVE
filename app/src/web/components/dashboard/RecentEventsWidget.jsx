// Port di src/components/dashboard/RecentEventsWidget.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';

import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Flame, ChevronDown, ChevronRight } from '@/ui/icons.generated';
import { Link } from '@/web/router';

import { Btn, Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

export default function RecentEventsWidget({ events, attendances, promoters, delay = 0 }) {
  const [expanded, setExpanded] = useState(null);

  const recent = [...events]
    .filter(e => e.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const maxRev = Math.max(...recent.map(e => e.total_revenue || 0), 1);

  return (
    <Div
      className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5"
      style={{ animationDelay: `${delay}s` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)', opacity: 0.6 }} />

      <Div className="flex items-center justify-between mb-5">
        <Div className="flex items-center gap-2">
          <Div className="p-1.5 rounded-lg bg-blue-500/15">
            <Flame className="w-4 h-4 text-blue-400" />
          </Div>
          <P className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Ultime Serate</P>
        </Div>
        <Link to="/serate" className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-primary transition-colors">
          Vedi tutte <ChevronRight className="w-3 h-3" />
        </Link>
      </Div>

      <Div className="space-y-2">
        {recent.map((event, i) => {
          const isOpen = expanded === event.id;
          const pct = Math.round(((event.total_revenue || 0) / maxRev) * 100);
          const eventAtts = attendances
            .filter(a => a.event_id === event.id && a.promoter_id && !a.client_id && (a.revenue || 0) > 0)
            .sort((a, b) => (b.revenue || 0) - (a.revenue || 0));

          return (
            <Div
              key={event.id}
              className="rounded-xl border border-white/[0.05] bg-secondary/20 overflow-hidden hover:border-white/[0.10] transition-all duration-200"
            >
              <Btn
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(isOpen ? null : event.id)}
              >
                {/* Pct bar side accent */}
                <Div className="w-1 h-8 rounded-full bg-secondary/50 overflow-hidden shrink-0 flex flex-col justify-end">
                  <Div
                    className="w-full rounded-full transition-all duration-700"
                    style={{ height: `${pct}%`, background: pct > 70 ? '#4ade80' : pct > 40 ? '#fbbf24' : '#f87171' }}
                  />
                </Div>
                <Div className="flex-1 min-w-0">
                  <P className="text-sm font-semibold truncate">{event.name}</P>
                  <P className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {format(parseISO(event.date), 'EEEE d MMM yyyy', { locale: it })}
                    {event.venue && ` · ${event.venue}`}
                  </P>
                </Div>
                <Div className="flex items-center gap-2 shrink-0">
                  <P className="text-sm font-bold text-primary">€{(event.total_revenue || 0).toLocaleString('it-IT')}</P>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </Div>
              </Btn>

              {isOpen && (
                  <Div className="border-t border-white/[0.05] px-3 py-2 space-y-1.5 overflow-hidden">
                    {eventAtts.length === 0 ? (
                      <P className="text-xs text-muted-foreground py-1 text-center">Nessun fatturato registrato</P>
                    ) : eventAtts.map(a => {
                      const promoter = promoters.find(p => p.id === a.promoter_id);
                      return (
                        <Div key={a.id} className="flex items-center justify-between py-0.5 gap-2">
                          <Div className="flex items-center gap-2 min-w-0">
                            <Div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary overflow-hidden shrink-0">
                              {promoter?.photo_url
                                ? <Img src={promoter.photo_url} alt={promoter.name} className="w-full h-full object-cover" />
                                : promoter?.name?.charAt(0)?.toUpperCase() || '?'
                              }
                            </Div>
                            <Span className="text-[11px] text-foreground truncate">{promoter?.name || '—'}</Span>
                          </Div>
                          <Span className="text-[11px] font-semibold text-primary shrink-0">€{(a.revenue || 0).toLocaleString('it-IT')}</Span>
                        </Div>
                      );
                    })}
                  </Div>
              )}
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}
