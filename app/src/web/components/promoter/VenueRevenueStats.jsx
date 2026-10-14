// Port di src/components/promoter/VenueRevenueStats.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { parseISO, isWithinInterval, startOfDay, endOfDay, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { calcTables } from '@/legacy/utils/tables';
import { Plus, X, Check, ChevronDown, ChevronRight } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';

import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlInput, Img, Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@/ui/elements';

const PERIOD_COLORS = ['#a78bfa', '#60a5fa', '#34d399'];

// Un locale è "Extra" se lo è nella sezione Locali (Venue.is_extra) oppure per flag evento
function getVenueKey(event, extraVenueNames) {
  const name = (event.venue || '').trim();
  if (event.is_extra) return '__extra__';
  if (extraVenueNames && extraVenueNames.has(name)) return '__extra__';
  if (/extra|festiv/i.test(name)) return '__extra__';
  return name || '__unknown__';
}

// Lista ricavata solo dai dati reali (serate con presenze) — niente locali fantasma
function buildVenueList(attendances, events, extraVenueNames) {
  const keys = new Set();
  attendances.forEach(a => {
    const ev = events.find(e => e.id === a.event_id);
    if (!ev) return;
    keys.add(getVenueKey(ev, extraVenueNames));
  });
  return [...keys];
}

function computeStats(attendances, events, from, to, extraVenueNames) {
  const allVenueKeys = buildVenueList(attendances, events, extraVenueNames);
  const result = {};
  allVenueKeys.forEach(k => { result[k] = { revenue: 0, tables: 0, count: 0, serate: [] }; });

  attendances.forEach(a => {
    if (a.client_id) return;
    const ev = events.find(e => e.id === a.event_id);
    if (!ev?.date) return;

    if (from && to) {
      const d = parseISO(ev.date);
      if (!isWithinInterval(d, { start: startOfDay(from), end: endOfDay(to) })) return;
    }

    const vk = getVenueKey(ev, extraVenueNames);
    if (!result[vk]) result[vk] = { revenue: 0, tables: 0, count: 0, serate: [] };

    const [y, m, d] = ev.date.split('-').map(Number);
    const dow = new Date(y, m - 1, d).getDay();
    const threshold = ev.table_threshold || null;
    const t = calcTables(a.revenue || 0, dow, threshold);

    result[vk].revenue += a.revenue || 0;
    result[vk].tables += t;
    result[vk].count += 1;
    result[vk].serate.push({ date: ev.date, revenue: a.revenue || 0, name: ev.name || '' });
  });

  // Ordina le serate per data decrescente (più recenti prime)
  Object.values(result).forEach(v => {
    v.serate.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  });

  return result;
}

function DateRangePicker({ label, color, onConfirm, onRemove, confirmed, from, to, onChange }) {
  const [localFrom, setLocalFrom] = useState(from ? from.toISOString().slice(0, 10) : '');
  const [localTo, setLocalTo] = useState(to ? to.toISOString().slice(0, 10) : '');

  const handleConfirm = () => {
    if (!localFrom || !localTo) return;
    onChange(new Date(localFrom), new Date(localTo));
    onConfirm();
  };

  return (
    <Div className="rounded-lg border p-3 space-y-2" style={{ borderColor: color + '50', background: color + '08' }}>
      <Div className="flex items-center justify-between">
        <Span className="text-xs font-semibold" style={{ color }}>{label}</Span>
        <Btn
          button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive transition-colors">
          <X className="w-3.5 h-3.5" />
        </Btn>
      </Div>
      <Div className="flex items-center gap-2 flex-wrap">
        <Div className="flex items-center gap-1.5">
          <Span className="text-[10px] text-muted-foreground">Dal</Span>
          <HtmlInput
            type="date"
            min="2022-01-01"
            max="2030-12-31"
            value={localFrom}
            onChange={e => { setLocalFrom(e.target.value); if (confirmed) onConfirm(); }}
            className="text-xs bg-card border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </Div>
        <Div className="flex items-center gap-1.5">
          <Span className="text-[10px] text-muted-foreground">Al</Span>
          <HtmlInput
            type="date"
            min="2022-01-01"
            max="2030-12-31"
            value={localTo}
            onChange={e => { setLocalTo(e.target.value); if (confirmed) onConfirm(); }}
            className="text-xs bg-card border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </Div>
        {!confirmed ? (
          <Btn
            button
            onClick={handleConfirm}
            disabled={!localFrom || !localTo}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors">
            <Check className="w-3 h-3" /> Conferma
          </Btn>
        ) : (
          <Span className="text-[10px] text-green-400 flex items-center gap-0.5"><Check className="w-3 h-3" /> Attivo</Span>
        )}
      </Div>
    </Div>
  );
}

function VenueLogo({ venueKey, getVenueLogo }) {
  // __extra__ → logo festivo salvato come 'Extra / Festivi'
  const lookupKey = venueKey === '__extra__' ? 'Extra / Festivi' : venueKey;
  const { logoUrl } = getVenueLogo(lookupKey);
  if (logoUrl) {
    return (
      <Img
        src={logoUrl}
        alt=""
        className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/10"
      />
    );
  }
  return (
    <Span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0 border border-white/10">
      {(venueKey === '__extra__' ? 'E' : venueKey?.charAt(0)?.toUpperCase()) || '?'}
    </Span>
  );
}

function SerateChips({ serate, color }) {
  if (!serate || serate.length === 0) {
    return <P className="text-[11px] text-muted-foreground py-2">Nessuna serata registrata</P>;
  }
  return (
    <Div className="flex flex-wrap gap-1.5 py-2">
      {serate.map((s, i) => {
        let dateLabel = s.date;
        try { dateLabel = format(parseISO(s.date), 'd MMM yy', { locale: it }); } catch { /* keep raw */ }
        return (
          <Div
            key={i}
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
            style={{ borderColor: `${color}40`, background: `${color}0d` }}
          >
            <Span className="text-[10px] text-muted-foreground whitespace-nowrap">{dateLabel}</Span>
            <Span className="text-[11px] font-bold whitespace-nowrap" style={{ color }}>
              {s.revenue > 0 ? `€${s.revenue.toLocaleString('it-IT')}` : '—'}
            </Span>
          </Div>
        );
      })}
    </Div>
  );
}

function StatsTable({ stats, label, color, getVenueLogo }) {
  const [expanded, setExpanded] = useState(new Set());
  const venueKeys = Object.keys(stats)
    .filter(k => k !== '__unknown__' && k !== '__extra__')
    .filter(k => stats[k].count > 0)
    .sort((a, b) => stats[b].revenue - stats[a].revenue);
  if (stats['__extra__'] && stats['__extra__'].count > 0) venueKeys.push('__extra__');

  const total = Object.values(stats).reduce((s, v) => s + v.revenue, 0);
  const totalTables = Object.values(stats).reduce((s, v) => s + v.tables, 0);
  const totalCount = Object.values(stats).reduce((s, v) => s + v.count, 0);

  const toggle = (vk) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(vk)) next.delete(vk); else next.add(vk);
      return next;
    });
  };

  return (
    <Div>
      {label && (
        <Div className="flex items-center gap-2 mb-2">
          <Div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
          <Span className="text-xs font-semibold" style={{ color }}>{label}</Span>
        </Div>
      )}
      <Div className="overflow-x-auto">
        <Table className="w-full text-xs">
          <Thead>
            <Tr className="border-b border-border">
              <Th className="text-left px-2 py-2 text-muted-foreground font-medium">Locale</Th>
              <Th className="text-center px-2 py-2 text-muted-foreground font-medium">Serate</Th>
              <Th className="text-right px-2 py-2 text-muted-foreground font-medium">Fatturato</Th>
              <Th className="text-right px-2 py-2 text-muted-foreground font-medium">Tavoli</Th>
              <Th className="text-right px-2 py-2 text-muted-foreground font-medium">Media Tav.</Th>
              <Th className="text-right px-2 py-2 text-muted-foreground font-medium">Media/ser.</Th>
            </Tr>
          </Thead>
          <Tbody>
            {venueKeys.map(vk => {
              const s = stats[vk];
              const displayLabel = vk === '__extra__' ? 'Extra / Festivi' : vk;
              const avg = s.count > 0 ? Math.round(s.revenue / s.count) : 0;
              const avgTables = s.count > 0 ? (s.tables / s.count) : 0;
              const isOpen = expanded.has(vk);
              const hasSerate = s.serate && s.serate.length > 0;
              return (
                <React.Fragment key={vk}>
                  <Tr
                    className={`border-b border-border/40 ${s.count === 0 ? 'opacity-30' : 'hover:bg-secondary/20 transition-colors cursor-pointer'}`}
                    onClick={() => hasSerate && toggle(vk)}
                  >
                    <Td className="px-2 py-2 font-medium">
                      <Div className="flex items-center gap-1.5">
                        {hasSerate ? (
                          isOpen
                            ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        ) : <Span className="w-3.5 shrink-0" />}
                        <VenueLogo venueKey={vk} getVenueLogo={getVenueLogo} />
                        <Span className="truncate">{displayLabel}</Span>
                      </Div>
                    </Td>
                    <Td className="px-2 py-2 text-center text-muted-foreground">{s.count}</Td>
                    <Td className="px-2 py-2 text-right font-semibold" style={{ color: s.revenue > 0 ? color : undefined }}>
                      {s.revenue > 0 ? `€${s.revenue.toLocaleString('it-IT')}` : '—'}
                    </Td>
                    <Td className="px-2 py-2 text-right text-muted-foreground">{s.tables > 0 ? s.tables.toFixed(1) : '—'}</Td>
                    <Td className="px-2 py-2 text-right text-muted-foreground">{avgTables > 0 ? avgTables.toFixed(1) : '—'}</Td>
                    <Td className="px-2 py-2 text-right text-muted-foreground">{avg > 0 ? `€${avg.toLocaleString('it-IT')}` : '—'}</Td>
                  </Tr>
                  {isOpen && hasSerate && (
                    <Tr className="border-b border-border/40 bg-secondary/10">
                      <Td colSpan={6} className="px-2 py-1">
                        <SerateChips serate={s.serate} color={color} />
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr className="border-t border-border">
              <Td className="px-2 py-2 font-bold">Totale</Td>
              <Td className="px-2 py-2 text-center text-muted-foreground font-medium">{totalCount}</Td>
              <Td className="px-2 py-2 text-right font-bold text-primary">€{total.toLocaleString('it-IT')}</Td>
              <Td className="px-2 py-2 text-right font-semibold text-muted-foreground">{totalTables.toFixed(1)}</Td>
              <Td className="px-2 py-2 text-right font-semibold text-muted-foreground">{totalCount > 0 ? (totalTables / totalCount).toFixed(1) : '—'}</Td>
              <Td />
            </Tr>
          </Tfoot>
        </Table>
      </Div>
    </Div>
  );
}

export default function VenueRevenueStats({ attendances, events }) {
  const { getVenueLogo } = useAllVenueLogos();
  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list(),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
  });
  const extraVenueNames = new Set(
    venues.filter(v => v.is_extra).map(v => (v.logo_key || v.name || '').trim()).filter(Boolean)
  );
  const [periods, setPeriods] = useState([
    { id: 1, from: null, to: null, confirmed: false },
  ]);

  const addPeriod = () => {
    if (periods.length >= 3) return;
    setPeriods(prev => [...prev, { id: Date.now(), from: null, to: null, confirmed: false }]);
  };

  const removePeriod = (id) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
  };

  const updatePeriod = (id, from, to) => {
    setPeriods(prev => prev.map(p => p.id === id ? { ...p, from, to } : p));
  };

  const confirmPeriod = (id) => {
    setPeriods(prev => prev.map(p => p.id === id ? { ...p, confirmed: true } : p));
  };

  const isFiltered = periods.some(p => p.confirmed && p.from && p.to);
  const allTimeStats = computeStats(attendances, events, null, null, extraVenueNames);

  return (
    <Div className="rounded-xl bg-card border border-border p-5 space-y-5">
      <H className="font-semibold text-sm">Fatturato per Locale</H>

      {/* Period selectors */}
      <Div className="space-y-2">
        {periods.map((p, i) => (
          <DateRangePicker
            key={p.id}
            label={periods.length > 1 ? `Periodo ${i + 1}` : 'Filtro temporale'}
            color={PERIOD_COLORS[i]}
            from={p.from}
            to={p.to}
            confirmed={p.confirmed}
            onChange={(from, to) => updatePeriod(p.id, from, to)}
            onConfirm={() => confirmPeriod(p.id)}
            onRemove={() => removePeriod(p.id)}
          />
        ))}
        {periods.length < 3 && (
          <Btn
            button
            onClick={addPeriod}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1">
            <Plus className="w-3.5 h-3.5" /> Aggiungi periodo da confrontare
          </Btn>
        )}
      </Div>

      {/* Tables */}
      {!isFiltered ? (
        <StatsTable stats={allTimeStats} color="#a78bfa" getVenueLogo={getVenueLogo} />
      ) : (
        <Div className="space-y-6">
          {periods
            .filter(p => p.confirmed && p.from && p.to)
            .map((p, i) => {
              const stats = computeStats(attendances, events, p.from, p.to, extraVenueNames);
              const fromStr = p.from.toLocaleDateString('it-IT');
              const toStr = p.to.toLocaleDateString('it-IT');
              return (
                <StatsTable
                  key={p.id}
                  stats={stats}
                  label={`${fromStr} → ${toStr}`}
                  color={PERIOD_COLORS[i]}
                  getVenueLogo={getVenueLogo}
                />
              );
            })}
        </Div>
      )}
    </Div>
  );
}