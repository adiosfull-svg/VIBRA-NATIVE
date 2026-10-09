// Port di src/components/dashboard/LiveRankingWidget.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { Trophy, Star, Crown } from '@/ui/icons.generated';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subWeeks, parseISO, isWithinInterval } from 'date-fns';
import { useNavigate } from '@/web/router';
import MonthPicker from './MonthPicker';
import { isVisibleInStats } from '@/legacy/utils/promoterVisibility';
import { computeAllPromoterTotals } from '@/legacy/utils/promoterAggregates';

import { Btn, Div, P, Span } from '@/ui/html';
import { Img } from '@/ui/elements';

const medals = ['🥇', '🥈', '🥉'];
const TABS = [
  { id: 'month', label: 'Mese' },
  { id: 'alltime', label: 'Di sempre' },
  { id: 'week', label: 'Settimana' },
];

export default function LiveRankingWidget({ promoters, attendances = [], events = [], delay = 0 }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('alltime');
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));

  const activePromoters = promoters.filter(p => p.ruolo !== 'ragazza_immagine' && isVisibleInStats(p));

  // Mappa event_id → data, per filtrare le presenze per periodo
  const eventsById = useMemo(() => Object.fromEntries(events.map(e => [e.id, e])), [events]);

  // Totali live per tutti i promoter in un solo passaggio (memoizzato: non
  // ricalcola se le presenze non sono cambiate). Stesso filtro anti-orfane e
  // stessa deduplica di card/Miei Progressi → fatturato identico ovunque.
  const allTotals = useMemo(() => computeAllPromoterTotals(attendances, events), [attendances, events]);

  const ranking = useMemo(() => {
    // Tab "Di sempre": totali live (un solo reduce su tutte le presenze).
    if (tab === 'alltime') {
      return activePromoters
        .map(p => ({ ...p, revenue: allTotals.get(p.id) || 0 }))
        .filter(p => p.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue);
    }

    // Tab Mese/Settimana: filtra le presenze per periodo (anti-orfane), poi
    // usa la stessa funzione batch con deduplica per event_id.
    let range = null;
    if (tab === 'month') {
      range = { start: startOfMonth(selectedMonth), end: endOfMonth(selectedMonth) };
    } else if (tab === 'week') {
      const prevWeek = subWeeks(new Date(), 1);
      range = { start: startOfWeek(prevWeek, { weekStartsOn: 1 }), end: endOfWeek(prevWeek, { weekStartsOn: 1 }) };
    }

    const periodAttendances = [];
    for (const a of attendances) {
      if (!a.promoter_id || a.client_id) continue;
      const ev = eventsById[a.event_id];
      if (!ev?.date) continue;
      try {
        if (!isWithinInterval(parseISO(ev.date), range)) continue;
      } catch { continue; }
      periodAttendances.push(a);
    }
    const periodTotals = computeAllPromoterTotals(periodAttendances, events);

    return activePromoters
      .map(p => ({ ...p, revenue: periodTotals.get(p.id) || 0 }))
      .filter(p => p.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue);
  }, [activePromoters, attendances, eventsById, events, tab, selectedMonth, allTotals]);

  const maxRev = ranking[0]?.revenue || 1;

  return (
    <Div
      className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 h-full"
      style={{ animationDelay: `${delay}s` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)', opacity: 0.6 }} />

      <Div className="flex items-center justify-between mb-4">
        <Div className="flex items-center gap-2">
          <Div className="p-1.5 rounded-lg bg-yellow-500/15">
            <Crown className="w-4 h-4 text-yellow-400" />
          </Div>
          <P className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">Classifica</P>
        </Div>
        {tab === 'month' && (
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        )}
      </Div>

      {/* Tabs */}
      <Div className="flex gap-1 mb-4 p-1 rounded-xl bg-secondary/30">
        {TABS.map(t => (
          <Btn
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all duration-200 ${
              tab === t.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </Btn>
        ))}
      </Div>

      {ranking.length === 0 ? (
        <P className="text-xs text-muted-foreground text-center py-6">Nessun dato nel periodo</P>
      ) : (
        <Div className="space-y-2.5">
          <Div key={`${tab}-${selectedMonth.getTime()}`}>
            {ranking.map((p, i) => (
              <Btn
                key={`${tab}-${p.id}`}
                className="flex items-center gap-3 cursor-pointer group mb-2.5"
                onClick={() => navigate(`/promoter/${p.id}`)}>
                <Span className="text-base w-6 text-center shrink-0">{medals[i] || `#${i + 1}`}</Span>
                <Div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary overflow-hidden shrink-0 border border-white/[0.08]">
                  {p.photo_url
                    ? <Img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                    : p.name?.charAt(0)?.toUpperCase()
                  }
                </Div>
                <Div className="flex-1 min-w-0">
                  <P className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{p.name}</P>
                  <Div className="mt-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                    <Div
                      className="h-1 rounded-full bar-grow"
                      style={{
                        '--bar-width': `${(p.revenue / maxRev) * 100}%`,
                        background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#fb923c' : '#a78bfa'
                      }}
                    />
                  </Div>
                </Div>
                <P className="text-xs font-bold text-primary shrink-0">
                  €{p.revenue.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </P>
              </Btn>
            ))}
          </Div>
        </Div>
      )}
    </Div>
  );
}
