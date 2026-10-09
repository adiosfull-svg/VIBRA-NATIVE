// Port di src/components/client/ClientTabelleTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { Sparkles, Trophy, Star, TrendingDown } from '@/ui/icons.generated';
import { buildEnrichedClients, buildNuoviClientiBoard } from '@/legacy/utils/clientPrecomputed';
import ClientBoardSection from '@/web/components/programmazione/ClientBoardSection';

import { Div } from '@/ui/html';

const FALLBACK = { visits: 0, fri: 0, sat: 0, sun: 0, extra: 0, totalSpent: 0, avgSpent: 0, attendances: [] };

// Replica del tab "Tabelle" del Weekend, ma a colonna singola (ogni bacheca sul
// suo rigo, full-width). La bacheca "Nuovi Clienti" qui include solo i clienti la
// cui PRIMA presenza registrata ricade nelle ultime 3 settimane (21 giorni).
export default function ClientTabelleTab({ clients, clientStatsMap, events, clientBadges, onContact, onDetail }) {
  // ── Statistiche pre-calcolate dal backend (campi cum_* sui record Client) ──
  const enriched = useMemo(() => buildEnrichedClients(clients), [clients]);

  const boards = useMemo(() => {
    // Nuovi: ultimi 30 clienti registrati (created_date desc). Logica unificata
    // con la bacheca "Nuovi Clienti" del Weekend (stesso helper).
    const nuovi = buildNuoviClientiBoard(enriched, 30);
    const isNuovo = (e) => e.firstAttDaysAgo !== null && e.firstAttDaysAgo <= 21;

    const topPaganti = [...enriched]
      .filter(e => e.ranking !== null)
      .sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0))
      .slice(0, 30);

    const leaders = enriched
      .filter(e => e.client.is_leader)
      .sort((a, b) => (b.daysAgo ?? -1) - (a.daysAgo ?? -1))
      .slice(0, 30);

    const inCalo = enriched
      .filter(e => e.trendFull.status === 'down' && e.visits >= 3 && !isNuovo(e))
      .sort((a, b) => (a.pctChange ?? 0) - (b.pctChange ?? 0))
      .slice(0, 30);

    return { nuovi, topPaganti, leaders, inCalo };
  }, [enriched]);

  return (
    <Div className="space-y-4">
      <ClientBoardSection
        title="Nuovi Clienti"
        icon={Sparkles}
        accentColor="#a78bfa"
        items={boards.nuovi}
        onContact={onContact}
        onDetail={onDetail}
        emptyText="Nessun cliente registrato"
      />
      <ClientBoardSection
        title="Top Paganti"
        icon={Trophy}
        accentColor="#facc15"
        items={boards.topPaganti}
        onContact={onContact}
        onDetail={onDetail}
        emptyText="Nessun dato sufficiente"
      />
      <ClientBoardSection
        title="Leader Inattivi"
        icon={Star}
        accentColor="#f59e0b"
        items={boards.leaders}
        onContact={onContact}
        onDetail={onDetail}
        emptyText="Nessun leader registrato"
      />
      <ClientBoardSection
        title="Clienti in Calo"
        icon={TrendingDown}
        accentColor="#ef4444"
        items={boards.inCalo}
        onContact={onContact}
        onDetail={onDetail}
        emptyText="Nessun cliente in calo rilevato"
      />
    </Div>
  );
}