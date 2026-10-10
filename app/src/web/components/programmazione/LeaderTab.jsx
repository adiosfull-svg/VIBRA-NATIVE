// Port di src/components/programmazione/LeaderTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Star } from '@/ui/icons.generated';
import LeadersList from '@/web/components/client/LeadersList';
import SectionHeader from '@/web/components/shared/SectionHeader';

import { Btn, Div, P, Span } from '@/ui/html';

/**
 * Tab Leader del Weekend: stessa lista del box Leader di Clienti
 * (stelle tier, metriche cum_*, swipe Sentito, badge assenza, Instagram, rete).
 * Ordinamento selezionabile: "Ultimo aggiunto" (leader_since desc, default) o
 * "Recenza presenza" (cum_last_attendance_date desc) così il promoter vede per
 * primi i leader venuti più di recente.
 */
export default function LeaderTab({ clients, events, onClientClick }) {
  const [sortBy, setSortBy] = useState('recent');
  const leaders = (clients || []).filter(c => c.is_leader);

  return (
    <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4" style={{ boxShadow: '0 4px 24px -6px rgba(245,158,11,0.10)' }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }} />
      <Div className="flex items-center justify-between mb-3">
        <SectionHeader icon={Star} title="Leader" color="#f59e0b" />
        <Span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded-full bg-secondary/40">{leaders.length}</Span>
      </Div>
      <Div className="flex items-center gap-1.5 mb-2">
        <Btn
          button
          onClick={() => setSortBy('recent')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
            sortBy === 'recent'
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
              : 'bg-secondary/50 text-muted-foreground border border-border/40 hover:bg-secondary hover:text-foreground'
          }`}>
          Ultimo aggiunto
        </Btn>
        <Btn
          button
          onClick={() => setSortBy('recency')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
            sortBy === 'recency'
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
              : 'bg-secondary/50 text-muted-foreground border border-border/40 hover:bg-secondary hover:text-foreground'
          }`}>
          Recenza presenza
        </Btn>
      </Div>
      <P className="text-[11px] text-muted-foreground mb-3">
        {sortBy === 'recent' ? 'Ordinati dall\'ultimo diventato leader al più storico.' : 'Ordinati per ultima presenza, la più recente prima.'}
      </P>
      <LeadersList
        leaders={leaders}
        events={events}
        sortBy={sortBy}
        onClientClick={onClientClick}
      />
    </Div>
  );
}