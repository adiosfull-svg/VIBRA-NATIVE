// Port di src/components/promoter/ClosedTablesCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { parseISO, getDay, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronDown, ChevronRight, CheckCircle2, XCircle } from '@/ui/icons.generated';

import { Btn, Div, H, P, Span } from '@/ui/html';

// Stagioni e anni disponibili
const SEASONS = [
  { key: 'all', label: 'Totale' },
  { key: '2022-2023', label: '2022-2023', from: '2022-09-01', to: '2023-08-31' },
  { key: '2023-2024', label: '2023-2024', from: '2023-09-01', to: '2024-08-31' },
  { key: '2024-2025', label: '2024-2025', from: '2024-09-01', to: '2025-08-31' },
  { key: '2025-2026', label: '2025-2026', from: '2025-09-01', to: '2026-08-31' },
];
const YEARS = [
  { key: 'all', label: 'Totale' },
  { key: '2022', label: '2022', from: '2022-01-01', to: '2022-12-31' },
  { key: '2023', label: '2023', from: '2023-01-01', to: '2023-12-31' },
  { key: '2024', label: '2024', from: '2024-01-01', to: '2024-12-31' },
  { key: '2025', label: '2025', from: '2025-01-01', to: '2025-12-31' },
  { key: '2026', label: '2026', from: '2026-01-01', to: '2026-12-31' },
];

function calculateMetrics(revByEvent, events, filter) {
  let closed = 0, total = 0;
  const rows = [];
  events.forEach(ev => {
    if (!ev?.date) return;
    if (!filter(ev)) return;
    total++;
    const rev = revByEvent[ev.id] || 0;
    let threshold = 300;
    if (ev.table_threshold) threshold = ev.table_threshold;
    else if (!ev.is_extra && getDay(parseISO(ev.date)) === 6) threshold = 360;
    const tablesClosed = rev >= threshold;
    if (tablesClosed) closed++;
    rows.push({ ev, rev, threshold, tablesClosed });
  });
  rows.sort((a, b) => b.ev.date.localeCompare(a.ev.date));
  const pct = total > 0 ? Math.round((closed / total) * 100) : 0;
  return { closed, total, pct, rows };
}

const Row = ({ label, closed, total, pct, rows = [] }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Div className="rounded-lg bg-secondary/20 overflow-hidden">
      <Btn
        button
        className="w-full flex items-center justify-between p-2.5 hover:bg-secondary/40 transition-colors"
        onClick={() => setExpanded(v => !v)}>
        <Div className="flex items-center gap-1.5">
          {expanded ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
          <Span className="text-xs font-medium">{label}</Span>
        </Div>
        <Div className="flex items-center gap-3">
          <Span className="text-xs text-muted-foreground">{closed}/{total}</Span>
          <Div className="w-16 h-1.5 bg-secondary rounded-full">
            <Div className="bg-primary h-1.5 rounded-full" style={{ width: `${pct}%` }} />
          </Div>
          <Span className="text-xs font-semibold text-primary w-8 text-right">{pct}%</Span>
        </Div>
      </Btn>
      {expanded && rows.length > 0 && (
        <Div className="border-t border-border/30 px-2.5 pb-2 pt-1 space-y-1">
          {rows.map((r, i) => (
            <Div key={i} className="flex items-center justify-between py-1 px-1">
              <Div className="flex items-center gap-2">
                {r.tablesClosed
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                }
                <Span className="text-[11px] text-muted-foreground">
                  {format(parseISO(r.ev.date), 'd MMM yyyy', { locale: it })} — {r.ev.name || r.ev.venue}
                </Span>
              </Div>
              <Span className="text-[11px] text-muted-foreground shrink-0">€{r.rev.toLocaleString('it-IT')}</Span>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
};

export default function ClosedTablesCard({ attendances, events, promoterFrom }) {
  const [periodType, setPeriodType] = useState('all'); // 'all' | 'season' | 'year'
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Filtro data in base alla selezione
  const dateFilter = (ev) => {
    if (periodType === 'all') return true;
    const items = periodType === 'season' ? SEASONS : YEARS;
    const sel = items.find(s => s.key === (periodType === 'season' ? selectedSeason : selectedYear));
    if (!sel || sel.key === 'all') return true;
    return ev.date >= sel.from && ev.date <= sel.to;
  };

  // Mappa ricavi per evento (dalle presenze del promoter)
  const revByEvent = {};
  attendances.forEach(a => {
    if (a.client_id) return;
    revByEvent[a.event_id] = a.revenue || 0;
  });

  // Tutte le serate dalla data di inizio del promoter (anche quelle a €0)
  const filteredEvents = events.filter(ev => {
    if (!ev?.date) return false;
    if (promoterFrom && ev.date < promoterFrom) return false;
    return dateFilter(ev);
  });

  const all = calculateMetrics(revByEvent, filteredEvents, () => true);

  // Extra
  const extra = calculateMetrics(revByEvent, filteredEvents, ev => ev.is_extra);

  // Get all unique venues from filtered events (non-extra).
  const venueSet = new Set();
  filteredEvents.forEach(ev => {
    if (ev.venue && !ev.is_extra) venueSet.add(ev.venue);
  });

  // Group venues by day-of-week
  const venuesByDow = { 5: [], 6: [], 0: [], other: [] };
  venueSet.forEach(venue => {
    const dowCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    filteredEvents.forEach(ev => {
      if (ev.venue === venue && !ev.is_extra) {
        dowCounts[getDay(parseISO(ev.date))]++;
      }
    });
    // Find the dominant day
    let maxCount = 0, dominantDow = -1;
    Object.entries(dowCounts).forEach(([dow, count]) => {
      if (count > maxCount) { maxCount = count; dominantDow = Number(dow); }
    });
    if ([5, 6, 0].includes(dominantDow)) {
      venuesByDow[dominantDow].push(venue);
    } else {
      venuesByDow.other.push(venue);
    }
  });

  const dowLabel = { 5: 'Venerdì', 6: 'Sabato', 0: 'Domenica' };

  return (
    <Div className="rounded-xl bg-card border border-border p-5">
      <H className="font-semibold text-sm mb-3">Tavoli Chiusi per Categoria</H>

      {/* Selettore periodo */}
      <Div className="flex flex-wrap gap-2 mb-4">
        {/* Tipo periodo */}
        <Div className="flex items-center gap-1">
          {[
            { key: 'all', label: 'Totale' },
            { key: 'season', label: 'Stagione' },
            { key: 'year', label: 'Anno' },
          ].map(t => (
            <Btn
              button
              key={t.key}
              onClick={() => setPeriodType(t.key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all ${periodType === t.key ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {t.label}
            </Btn>
          ))}
        </Div>

        {/* Selettore stagione */}
        {periodType === 'season' && (
          <Div className="flex items-center gap-1 flex-wrap">
            {SEASONS.filter(s => s.key !== 'all').map(s => (
              <Btn
                button
                key={s.key}
                onClick={() => setSelectedSeason(s.key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all ${selectedSeason === s.key ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                {s.label}
              </Btn>
            ))}
          </Div>
        )}

        {/* Selettore anno */}
        {periodType === 'year' && (
          <Div className="flex items-center gap-1 flex-wrap">
            {YEARS.filter(y => y.key !== 'all').map(y => (
              <Btn
                button
                key={y.key}
                onClick={() => setSelectedYear(y.key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all ${selectedYear === y.key ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                {y.label}
              </Btn>
            ))}
          </Div>
        )}
      </Div>

      <Div className="space-y-3">
        {/* Total — uses all attendances with revenue, matching PromoterCard */}
        <Div>
          <Div className="flex items-baseline gap-2 mb-2 pb-2 border-b border-border">
            <Span className="text-2xl font-bold text-primary">{all.closed}</Span>
            <Span className="text-xs text-muted-foreground">su {all.total} serate totali</Span>
            <Span className="ml-auto text-xs font-semibold text-primary">{all.pct}%</Span>
          </Div>
        </Div>

        {/* Extra */}
        {extra.total > 0 && (
          <Div className="space-y-1.5">
            <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Extra / Festivi</P>
            <Row label="Extra - Festivi" closed={extra.closed} total={extra.total} pct={extra.pct} rows={extra.rows} />
          </Div>
        )}

        {/* Venerdì, Sabato, Domenica */}
        {[5, 6, 0].map(dow => {
          const venues = venuesByDow[dow];
          if (!venues.length) return null;
          return (
            <Div key={dow} className="space-y-1.5">
              <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{dowLabel[dow]}</P>
              {venues.map(venue => {
                const m = calculateMetrics(revByEvent, filteredEvents, ev => ev.venue === venue && !ev.is_extra);
                if (m.total === 0) return null;
                return <Row key={venue} label={venue} closed={m.closed} total={m.total} pct={m.pct} rows={m.rows} />;
              })}
            </Div>
          );
        })}

        {/* Other venues (mixed days) */}
        {venuesByDow.other.length > 0 && (
          <Div className="space-y-1.5">
            <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Altri Locali</P>
            {venuesByDow.other.map(venue => {
              const m = calculateMetrics(revByEvent, filteredEvents, ev => ev.venue === venue && !ev.is_extra);
              if (m.total === 0) return null;
              return <Row key={venue} label={venue} closed={m.closed} total={m.total} pct={m.pct} rows={m.rows} />;
            })}
          </Div>
        )}
      </Div>
    </Div>
  );
}