// Port di src/components/programmazione/ClientGrowthLeague.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { ArrowUp, ArrowDown, Gem, Star, Instagram, ArrowUpDown, Search, Trophy, TrendingUp, TrendingDown } from '@/ui/icons.generated';
import { rankingColor } from '@/legacy/utils/clientRanking';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import WhatsAppIcon from '@/web/components/shared/WhatsAppIcon';
import SelectCheckbox from '@/web/components/client/SelectCheckbox';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';

import { Btn, Div, H, P, Span } from '@/ui/html';
import { usePageWindow } from '@/web/hooks/usePageWindow';
import { A, HtmlInput, Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

import { win as webWindow } from '@/web/shims/dom';

const COLS = [
  { key: 'name', label: 'Cliente', align: 'left', sticky: true, color: 'muted' },
  { key: 'ranking', label: 'Rating', align: 'right', color: 'muted' },
  { key: 'visits', label: 'Presenze', align: 'right', color: 'muted' },
  { key: 'totalSpent', label: 'Spesa tot.', align: 'right', color: 'primary' },
  { key: 'avgSpent', label: 'Media', align: 'right', color: 'muted' },
  { key: 'newPeople', label: 'Nuove', align: 'right', color: 'yellow' },
  { key: 'attendanceRate', label: 'Pres. %', align: 'right', color: 'emerald' },
  { key: 'cicloMedio', label: 'Ciclo', align: 'right', color: 'muted' },
  { key: 'trend', label: 'Trend', align: 'center', color: 'muted', badge: 'trend' },
  { key: 'daysAgo', label: 'Ultima', align: 'right', color: 'muted' },
];

const HEADER_COLOR = {
  muted: 'text-muted-foreground',
  primary: 'text-primary/80',
  yellow: 'text-yellow-400/80',
  emerald: 'text-emerald-400/80',
};

// Virtualizzazione tabella: renderizza solo le righe nel viewport (window-scroll based).
const ROW_HEIGHT = 45;
const OVERSCAN = 8;

function formatDays(days) {
  if (days === null || days === undefined) return 'Mai';
  if (days <= 7) return 'Ultimo we';
  if (days >= 60) return `${Math.round(days / 30)} mesi`;
  if (days >= 14) return `${Math.round(days / 7)} sett.`;
  return `${days}gg`;
}

function TrendBadge({ trend }) {
  if (trend == null) return <Span className="text-xs text-muted-foreground/50">—</Span>;
  const up = trend >= 0;
  return (
    <Span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(trend).toFixed(0)}%
          </Span>
  );
}

/**
 * Growth League dei clienti: tabella ordinabile, identica su mobile e desktop
 * (scroll orizzontale su mobile). Stile/colori allineati al Growth League del
 * Promoter: header Trophy in box primary, barra superiore viola, colonne colorate,
 * badge Trend/Cost. e leggenda in fondo.
 */
export default function ClientGrowthLeague({ rows, onContact, onDetail, search = '', onSearchChange, searchOpen = false, onToggleSearch }) {
  const [sortKey, setSortKey] = useState('ranking');
  const [sortDir, setSortDir] = useState('desc');
  const bulk = useBulkSelection();
  const selectMode = bulk?.selectMode;
  const selectedIds = bulk?.selectedIds;
  const toggleSelect = bulk?.toggleSelect;
  const isSel = (id) => !!selectedIds?.has(id);
  const handleRowClick = (e, client) => {
    if (selectMode) { toggleSelect?.(client); return; }
    if (e?.ctrlKey || e?.metaKey) { e.preventDefault(); toggleSelect?.(client); return; }
    onDetail?.(client);
  };

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'name') return sortDir === 'asc' ? String(va || '').localeCompare(String(vb || '')) : String(vb || '').localeCompare(String(va || ''));
      va = va ?? -Infinity; vb = vb ?? -Infinity;
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return arr;
  }, [rows, sortKey, sortDir]);

  const filtered = useMemo(() => {
    if (!search) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(r => r.client?.name?.toLowerCase().includes(q));
  }, [sorted, search]);

  // ── Virtualizzazione (window-scroll based, come RecontactList) ──
  // PORT: la pagina è lo ScrollView di Page: finestra calcolata da hooks/usePageWindow
  const { containerRef: tbodyRef, start: viewStart, end: viewEnd } = usePageWindow(filtered.length, ROW_HEIGHT, OVERSCAN, 30);
  const view = { start: viewStart, end: viewEnd };

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'name' ? 'asc' : 'desc'); }
  };

  const renderCell = (c, r) => {
    if (c.badge === 'trend') return <TrendBadge trend={r.monthTrend} />;
    switch (c.key) {
      case 'name':
        return (
          <Div className="flex items-center gap-1.5">
            <ClientAvatar client={r.client} initials={r.initials} size="sm" />
            <Span className="text-xs font-medium truncate max-w-[140px]">{r.client.name}</Span>
            {r.client.is_leader && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
          </Div>
        );
      case 'ranking':
        return r.ranking !== null && r.ranking !== undefined
          ? <Span className={`inline-flex items-center gap-0.5 text-xs font-bold ${rankingColor(r.ranking)}`}><Gem className="w-3 h-3" />{r.ranking.toFixed(1)}</Span>
          : <Span className="text-muted-foreground/40">—</Span>;
      case 'visits':
        return <Span className="text-xs font-semibold">{r.visits}</Span>;
      case 'totalSpent':
        return <Span className="text-xs font-medium text-primary">€{(r.totalSpent || 0).toLocaleString('it-IT')}</Span>;
      case 'avgSpent':
        return <Span className="text-xs">€{(r.avgSpent || 0).toLocaleString('it-IT')}</Span>;
      case 'newPeople':
        return <Span className="text-xs font-medium text-amber-400">{r.newPeople || 0}</Span>;
      case 'attendanceRate':
        return r.attendanceRate !== null && r.attendanceRate !== undefined
          ? <Span className="text-xs font-bold text-emerald-400">{r.attendanceRate}%</Span>
          : <Span className="text-muted-foreground/40">—</Span>;
      case 'cicloMedio':
        return r.cicloMedio != null
          ? <Span className="text-xs">{r.cicloMedio} sett.</Span>
          : <Span className="text-muted-foreground/40">—</Span>;
      case 'daysAgo':
        return <Span className="text-xs text-muted-foreground">{formatDays(r.daysAgo)}</Span>;
      default:
        return null;
    }
  };

  const alignClass = (a) => a === 'left' ? 'text-left' : a === 'center' ? 'text-center' : 'text-right';

  return (
    <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card" style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.10)' }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
      <Div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <Div className="flex items-center gap-2.5">
          <Div className="p-2 rounded-xl bg-primary/15">
            <Trophy className="w-5 h-5 text-primary" />
          </Div>
          <Div>
            <H className="text-sm font-semibold">Growth League — Clienti</H>
            <P className="text-xs text-muted-foreground">{rows.length} clienti · clicca le colonne per ordinare</P>
          </Div>
        </Div>
        <Btn
          button
          onClick={onToggleSearch}
          className={`p-2 rounded-lg border transition-colors ${searchOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'}`}
          accessibilityLabel="Cerca">
          <Search className="w-4 h-4" />
        </Btn>
      </Div>
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border/40"
          >
            <Div className="px-4 py-2">
              <Div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <HtmlInput
                  value={search}
                  onChange={e => onSearchChange?.(e.target.value)}
                  placeholder="Cerca cliente..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-secondary/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </Div>
            </Div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabella unica (mobile: scroll orizzontale) — identica al Growth League Promoter */}
      <Div className="overflow-x-auto client-table-scrollbar">
        <Table className="w-full text-sm min-w-[940px]">
          <Thead>
            <Tr className="border-b border-white/[0.06]">
              {COLS.map(c => (
                <Th
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  className={`${c.sticky ? 'sticky left-0 bg-card z-10' : ''} px-3 py-2.5 cursor-pointer hover:bg-secondary/40 select-none whitespace-nowrap ${alignClass(c.align)}`}
                >
                  <Span className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${HEADER_COLOR[c.color]}`}>
                    {c.label}
                    {sortKey === c.key ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </Span>
                </Th>
              ))}
              <Th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Azioni</Th>
            </Tr>
          </Thead>
          <Tbody ref={tbodyRef}>
            {filtered.length === 0 ? (
              <Tr><Td colSpan={COLS.length + 1 + (selectMode ? 1 : 0)} className="px-4 py-8 text-center text-sm text-muted-foreground">Nessun cliente trovato</Td></Tr>
            ) : (
              <>
                {view.start > 0 && <Tr style={{ height: view.start * ROW_HEIGHT }}><Td colSpan={COLS.length + 1 + (selectMode ? 1 : 0)} /></Tr>}
                {filtered.slice(view.start, view.end).map((r, i) => {
                  const phoneClean = r.client.phone?.replace(/\s/g, '');
                  const igHandle = r.client.instagram?.replace('@', '');
                  return (
                    <Tr
                      key={r.client.id}
                      className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer`}
                      style={isSel(r.client.id) ? { backgroundColor: 'rgba(139, 92, 246, 0.18)' } : undefined}
                      onClick={(e) => handleRowClick(e, r.client)}>
                      {selectMode && (
                        <Td className="sticky left-0 bg-card z-20 px-3 py-2.5">
                          <SelectCheckbox selected={isSel(r.client.id)} />
                        </Td>
                      )}
                      {COLS.map(c => (
                        <Td key={c.key} className={`${c.sticky ? 'sticky left-0 bg-card z-10' : ''} px-3 py-2.5 ${alignClass(c.align)}`}>
                          {c.key === 'name'
                            ? <Div className="flex items-center gap-2"><Span className="text-[10px] text-muted-foreground w-4 text-center">{view.start + i + 1}</Span>{renderCell(c, r)}</Div>
                            : renderCell(c, r)}
                        </Td>
                      ))}
                      <Td className="px-3 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                        <Div className="flex items-center justify-end gap-1">
                          {phoneClean && <A href={`https://wa.me/${phoneClean}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10"><WhatsAppIcon className="w-3.5 h-3.5" /></A>}
                          {igHandle && <A href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-pink-400 hover:bg-pink-400/10"><Instagram className="w-3.5 h-3.5" /></A>}
                        </Div>
                      </Td>
                    </Tr>
                  );
                })}
                {view.end < filtered.length && <Tr style={{ height: (filtered.length - view.end) * ROW_HEIGHT }}><Td colSpan={COLS.length + 1 + (selectMode ? 1 : 0)} /></Tr>}
              </>
            )}
          </Tbody>
        </Table>
      </Div>

      {/* Leggenda — identica per stile al Growth League Promoter */}
      <Div className="text-[10px] text-muted-foreground/70 px-4 py-2.5 border-t border-white/[0.04] space-y-0.5">
        <P><Span className="font-semibold text-foreground/80">Pres. %</Span> = presenze / serate totali dall'inizio del cliente</P>
        <P><Span className="font-semibold text-foreground/80">Ciclo</Span> = durata media (in settimane) dei periodi di frequenza continua (base 1 serata/sett.); una pausa di 3+ settimane chiude il ciclo</P>
        <P><Span className="font-semibold text-foreground/80">Trend</Span> = variazione % delle presenze negli ultimi 31 giorni vs i 31 giorni precedenti</P>
      </Div>
    </Div>
  );
}