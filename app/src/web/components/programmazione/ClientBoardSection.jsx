// Port di src/components/programmazione/ClientBoardSection.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import SectionHeader from '@/web/components/shared/SectionHeader';
import ClientFUTCard from './ClientFUTCard';

import { Div, P, Span } from '@/ui/html';

/**
 * Bacheca di card FUT: header (icon + titolo + count) + scroll orizzontale su mobile,
 * griglia responsiva su desktop con scrolling interno verticale (nessun "Mostra tutti":
 * tutte le card sono sempre presenti, la bacheca scorre internamente se supera l'altezza).
 */
export default function ClientBoardSection({ title, icon, accentColor = '#a78bfa', items = [], onContact, onDetail, emptyText = 'Nessun cliente', action = null }) {
  return (
    <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4" style={{ boxShadow: `0 4px 24px -6px ${accentColor}14` }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      <Div className="flex items-center justify-between mb-3">
        <SectionHeader icon={icon} title={title} color={accentColor} />
        <Div className="flex items-center gap-2">
          <Span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/40">{items.length}</Span>
          {action}
        </Div>
      </Div>

      {items.length === 0 ? (
        <P className="text-xs text-muted-foreground text-center py-6">{emptyText}</P>
      ) : (
        <Div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(176px,1fr))] sm:overflow-visible no-scrollbar touch-pan-x touch-pan-y">
          {items.map(({ client, stats, ranking, trendFull, badges, contactLabel, contactStale }) => (
            <ClientFUTCard
              key={client.id}
              client={client}
              stats={stats}
              ranking={ranking}
              trendFull={trendFull}
              badges={badges}
              accentColor={accentColor}
              onContact={onContact}
              onDetail={onDetail}
              contactLabel={contactLabel}
              contactStale={contactStale}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}