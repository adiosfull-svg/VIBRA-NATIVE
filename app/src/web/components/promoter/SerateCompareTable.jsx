// Port di src/components/promoter/SerateCompareTable.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { calcTables } from '@/legacy/utils/tables';
import { isVisibleInStats } from '@/legacy/utils/promoterVisibility';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { CalendarRange, MapPin } from '@/ui/icons.generated';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlOption, HtmlSelect, Img, Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@/ui/elements';

const COLORS = [
  'hsl(275 72% 52%)', 'hsl(200 70% 50%)', 'hsl(150 60% 45%)',
  'hsl(40 80% 55%)', 'hsl(340 65% 55%)', 'hsl(20 80% 55%)', 'hsl(180 60% 45%)'
];

const fmtEuro = (v) => `€${Number(v || 0).toLocaleString('it-IT')}`;

// Genera l'elenco dei mesi selezionabili (da gen 2023 al mese corrente).
// Usiamo una <select> nativa (non il componente Select di Radix) perché quest'ultimo
// applica uno scroll-lock modale che, in questa posizione della pagina, faceva
// sparire la tab bar sticky in alto quando il menu veniva aperto.
function buildMonthOptions() {
  const opts = [];
  const now = new Date();
  for (let y = 2023; y <= now.getFullYear(); y++) {
    const maxM = y === now.getFullYear() ? now.getMonth() : 11;
    for (let m = 0; m <= maxM; m++) {
      opts.push({ year: y, month: m, label: format(new Date(y, m, 1), 'MMMM yyyy', { locale: it }) });
    }
  }
  return opts;
}

/**
 * Confronto per Serate: chip dei locali (sopra, multi-selezione) per scegliere uno o
 * più locali, una tabella con una riga per ogni serata di quei locali nel mese
 * selezionato (con totale per serata) e chip dei promoter (sotto) per scegliere chi
 * mostrare, con totale singolo (nel filtro corrente) e cumulativo (storico) accanto
 * al nome.
 */
export default function SerateCompareTable({ promoters, allAttendances, events }) {
  const { getVenueLogo } = useAllVenueLogos();

  const { data: venuesRaw = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list('sort_order'),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const venueOptions = useMemo(() => venuesRaw.map(v => ({
    key: v.is_extra ? 'Extra - Festivi' : v.name,
    label: v.is_extra ? 'Extra / Festivi' : v.name,
    logoKey: v.logo_key || v.name,
    isExtra: !!v.is_extra,
  })), [venuesRaw]);

  const [selectedVenueKeys, setSelectedVenueKeys] = useState([]);
  useEffect(() => {
    if (venueOptions.length > 0 && selectedVenueKeys.length === 0) {
      setSelectedVenueKeys([venueOptions[0].key]);
    }
  }, [venueOptions]);

  const toggleVenue = (key) => {
    setSelectedVenueKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const monthOptions = useMemo(buildMonthOptions, []);
  const [monthIdx, setMonthIdx] = useState(monthOptions.length - 1);
  const { year, month } = monthOptions[monthIdx] || monthOptions[monthOptions.length - 1];
  const monthStart = useMemo(() => startOfMonth(new Date(year, month, 1)), [year, month]);
  const monthEnd = useMemo(() => endOfMonth(monthStart), [monthStart]);

  const activePromoters = useMemo(() => promoters.filter(p => isVisibleInStats(p)), [promoters]);
  const [selectedIds, setSelectedIds] = useState(() => activePromoters.map(p => p.id));

  const togglePromoter = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const eventsInScope = useMemo(() => {
    return events
      .filter(ev => ev.is_extra ? selectedVenueKeys.includes('Extra - Festivi') : selectedVenueKeys.includes(ev.venue))
      .filter(ev => {
        if (!ev.date) return false;
        try { return isWithinInterval(parseISO(ev.date), { start: monthStart, end: monthEnd }); }
        catch { return false; }
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, selectedVenueKeys, monthStart, monthEnd]);

  const selectedPromoters = useMemo(() => promoters.filter(p => selectedIds.includes(p.id)), [promoters, selectedIds]);

  const rows = useMemo(() => {
    return eventsInScope.map(ev => {
      const venueOpt = venueOptions.find(v => v.isExtra ? ev.is_extra : v.key === ev.venue);
      const entry = { event: ev, label: format(parseISO(ev.date), 'dd MMM', { locale: it }), venueLabel: venueOpt?.label || ev.venue, venueLogoKey: venueOpt?.logoKey };
      let dow = 0;
      try { const [y, m, d] = ev.date.split('-').map(Number); dow = new Date(y, m - 1, d).getDay(); } catch { /* skip */ }
      let rowTotal = 0;
      selectedPromoters.forEach(p => {
        const att = allAttendances.find(a => a.event_id === ev.id && a.promoter_id === p.id && !a.client_id);
        const rev = att?.revenue || 0;
        entry[p.id] = { rev, tables: calcTables(rev, ev.is_extra ? 0 : dow) };
        rowTotal += rev;
      });
      entry.rowTotal = rowTotal;
      return entry;
    });
  }, [eventsInScope, selectedPromoters, allAttendances, venueOptions]);

  const totalsByPromoter = useMemo(() => {
    const map = {};
    selectedPromoters.forEach(p => {
      let rev = 0, tables = 0;
      rows.forEach(r => { rev += r[p.id]?.rev || 0; tables += r[p.id]?.tables || 0; });
      map[p.id] = { rev, tables };
    });
    return map;
  }, [rows, selectedPromoters]);

  const grandTotal = rows.reduce((s, r) => s + r.rowTotal, 0);

  if (venueOptions.length === 0) return null;

  return (
    <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 space-y-4"
      style={{ boxShadow: '0 4px 24px -6px rgba(96,165,250,0.10)' }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }} />

      <Div className="flex items-center justify-between flex-wrap gap-3">
        <SectionHeader icon={CalendarRange} title="Confronto per Serate" color="#60a5fa" />
        <HtmlSelect
          value={monthIdx}
          onChange={e => setMonthIdx(Number(e.target.value))}
          className="bg-secondary/60 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary capitalize"
        >
          {monthOptions.map((m, i) => (
            <HtmlOption key={i} value={i}>{m.label}</HtmlOption>
          ))}
        </HtmlSelect>
      </Div>

      {/* Chip locali — multi-selezione */}
      <Div className="flex flex-wrap gap-2">
        {venueOptions.map(v => {
          const { logoUrl } = getVenueLogo(v.logoKey);
          const isSelected = selectedVenueKeys.includes(v.key);
          return (
            <Btn
              button
              key={v.key}
              onClick={() => toggleVenue(v.key)}
              className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                isSelected ? 'bg-blue-500/15 border-blue-400/40 text-foreground shadow-sm' : 'bg-transparent border-white/[0.06] text-muted-foreground/50 opacity-60'
              }`}>
              {logoUrl ? (
                <Img src={logoUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" style={{ opacity: isSelected ? 1 : 0.5 }} />
              ) : (
                <MapPin className="w-4 h-4 shrink-0" style={{ opacity: isSelected ? 1 : 0.5 }} />
              )}
              <Span className="truncate">{v.label}</Span>
            </Btn>
          );
        })}
      </Div>

      {/* Tabella risultati */}
      {rows.length === 0 ? (
        <P className="text-sm text-muted-foreground text-center py-4">Nessuna serata trovata per i locali selezionati nel mese scelto</P>
      ) : (
        <Div className="overflow-x-auto client-table-scrollbar">
          <Table className="text-sm border-collapse w-full" style={{ minWidth: '100%' }}>
            <Thead>
              <Tr className="border-b border-white/[0.06]">
                <Th className="text-left px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Serata</Th>
                {selectedPromoters.map(p => {
                  const idx = promoters.indexOf(p);
                  return (
                    <Th key={p.id} className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: COLORS[idx % COLORS.length] }}>
                      {p.name.split(' ')[0]}
                    </Th>
                  );
                })}
                <Th className="text-center px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Totale serata</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row) => (
                <Tr key={row.event.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <Td className="px-3 py-2.5">
                    <Div className="flex items-center gap-1.5">
                      <Span className="font-medium text-xs capitalize text-muted-foreground">{row.label}</Span>
                      {selectedVenueKeys.length > 1 && (
                        <Span className="text-[9px] text-muted-foreground/60 truncate">{row.venueLabel}</Span>
                      )}
                    </Div>
                  </Td>
                  {selectedPromoters.map(p => {
                    const cell = row[p.id];
                    const idx = promoters.indexOf(p);
                    return (
                      <Td key={p.id} className="px-3 py-2.5 text-center">
                        {cell?.rev > 0 ? (
                          <Span className="font-bold text-xs" style={{ color: COLORS[idx % COLORS.length] }}>{fmtEuro(cell.rev)}</Span>
                        ) : (
                          <Span className="text-muted-foreground/40 text-xs">—</Span>
                        )}
                      </Td>
                    );
                  })}
                  <Td className="px-3 py-2.5 text-center">
                    <Span className="font-bold text-xs text-foreground">{row.rowTotal > 0 ? fmtEuro(row.rowTotal) : '—'}</Span>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr className="border-t-2 border-white/[0.08] bg-secondary/20">
                <Td className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Totale</Td>
                {selectedPromoters.map(p => {
                  const t = totalsByPromoter[p.id] || { rev: 0, tables: 0 };
                  const idx = promoters.indexOf(p);
                  return (
                    <Td key={p.id} className="px-3 py-2.5 text-center">
                      <Span className="font-bold text-sm" style={{ color: COLORS[idx % COLORS.length] }}>{fmtEuro(t.rev)}</Span>
                      <Span className="block text-[10px] text-muted-foreground">{Number(t.tables.toFixed(1))} tav.</Span>
                    </Td>
                  );
                })}
                <Td className="px-3 py-2.5 text-center">
                  <Span className="font-bold text-sm text-primary">{fmtEuro(grandTotal)}</Span>
                </Td>
              </Tr>
            </Tfoot>
          </Table>
        </Div>
      )}

      {/* Chip promoter — totale singolo (nel filtro corrente) e cumulativo (storico) */}
      <Div className="flex flex-wrap gap-2 pt-1">
        {promoters.map((p, idx) => {
          const isSelected = selectedIds.includes(p.id);
          const color = COLORS[idx % COLORS.length];
          const singleTotal = totalsByPromoter[p.id]?.rev ?? 0;
          const cumTotal = p.cum_total_revenue || 0;
          return (
            <Btn
              button
              key={p.id}
              onClick={() => togglePromoter(p.id)}
              className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                isSelected ? 'bg-white/[0.06] border-white/10 text-foreground shadow-sm' : 'bg-transparent border-white/[0.06] text-muted-foreground/50 opacity-60'
              }`}>
              {p.photo_url ? (
                <Img src={p.photo_url} alt="" className="w-5 h-5 rounded-full object-cover shrink-0 border-2" style={{ borderColor: color, opacity: isSelected ? 1 : 0.5 }} />
              ) : (
                <Span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: color, opacity: isSelected ? 1 : 0.5 }}>
                  {p.name.charAt(0).toUpperCase()}
                </Span>
              )}
              <Span className="flex flex-col items-start leading-tight">
                <Span className="truncate">{p.name}</Span>
                <Span className="text-[9px] text-muted-foreground/80">{fmtEuro(singleTotal)} · tot {fmtEuro(cumTotal)}</Span>
              </Span>
            </Btn>
          );
        })}
      </Div>
    </Div>
  );
}