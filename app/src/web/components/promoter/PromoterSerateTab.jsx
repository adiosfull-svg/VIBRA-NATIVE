// Port di src/components/promoter/PromoterSerateTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarDays, Search, X } from '@/ui/icons.generated';
import { calcTables } from '@/legacy/utils/tables';
import { getDow } from '@/legacy/utils/dateUtils';



import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';



export default function PromoterSerateTab({ attendances, events }) {
  const [search, setSearch] = useState('');

  // Solo presenze col fatturato, ordinate per data decrescente
  const enriched = attendances
    .filter(a => !a.client_id && (a.revenue || 0) > 0)
    .map(a => {
      const ev = events.find(e => e.id === a.event_id);
      if (!ev) return null;
      return { a, ev };
    })
    .filter(Boolean)
    .sort((x, y) => (y.ev.date || '').localeCompare(x.ev.date || ''));

  const q = search.trim().toLowerCase();
  const filtered = q
    ? enriched.filter(({ ev }) => {
        const dateStr = ev.date ? format(parseISO(ev.date), 'd MMM yyyy', { locale: it }).toLowerCase() : '';
        const monthStr = ev.date ? format(parseISO(ev.date), 'MMMM yyyy', { locale: it }).toLowerCase() : '';
        const nameStr = (ev.name || '').toLowerCase();
        const venueStr = (ev.venue || '').toLowerCase();
        return dateStr.includes(q) || monthStr.includes(q) || nameStr.includes(q) || venueStr.includes(q);
      })
    : enriched;

  const totalRevenue = filtered.reduce((s, { a }) => s + (a.revenue || 0), 0);
  const totalTables = filtered.reduce((s, { a, ev }) => {
    const dow = getDow(ev.date);
    return s + calcTables(a.revenue || 0, dow);
  }, 0);

  if (enriched.length === 0) {
    return (
      <Div className="rounded-xl bg-card border border-border p-8 text-center">
        <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <P className="text-sm text-muted-foreground">Nessuna serata con fatturato registrata.</P>
      </Div>
    );
  }

  return (
    <Div className="space-y-4">
      {/* Search */}
      <Div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <HtmlInput
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca per nome, locale, mese..."
          className="w-full bg-secondary/40 border border-border rounded-lg pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {search && (
          <Btn
            button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </Btn>
        )}
      </Div>

      {/* Totali */}
      <Div className="grid grid-cols-3 gap-3">
        <Div className="rounded-xl bg-card border border-border p-3">
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Serate</P>
          <P className="text-lg font-bold text-primary">{filtered.length}</P>
        </Div>
        <Div className="rounded-xl bg-card border border-border p-3">
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Fatturato</P>
          <P className="text-lg font-bold text-primary">€{totalRevenue.toLocaleString('it-IT')}</P>
        </Div>
        <Div className="rounded-xl bg-card border border-border p-3">
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Tavoli</P>
          <P className="text-lg font-bold">{totalTables.toFixed(1).replace('.', ',')}</P>
        </Div>
      </Div>

      {/* Header colonne */}
      <Div className="grid text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3"
        style={{ gridTemplateColumns: '1fr 80px 60px 60px' }}>
        <Span>Serata</Span>
        <Span className="text-right">Fatturato</Span>
        <Span className="text-right">Tavoli</Span>
        <Span className="text-right">Locale</Span>
      </Div>

      {/* Lista serate */}
      <Div className="space-y-1.5">
        {filtered.length === 0 && (
          <Div className="rounded-xl bg-card border border-border p-6 text-center">
            <P className="text-sm text-muted-foreground">Nessuna serata trovata per "{search}".</P>
          </Div>
        )}
        {filtered.map(({ a, ev }) => {
          const dow = getDow(ev.date);
          const tables = calcTables(a.revenue || 0, dow);
          return (
            <Div
              key={a.id}
              className="rounded-xl bg-card border border-border px-3 py-2.5 grid items-center gap-2"
              style={{ gridTemplateColumns: '1fr 80px 60px 60px' }}
            >
              <Div className="min-w-0">
                <P className="font-semibold text-xs truncate leading-tight">{ev.name}</P>
                <P className="text-[10px] text-muted-foreground leading-tight">
                  {ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : ''}
                </P>
              </Div>
              <Div className="text-right">
                <P className="text-xs font-bold text-primary">€{(a.revenue || 0).toLocaleString('it-IT')}</P>
              </Div>
              <Div className="text-right">
                <P className="text-xs font-semibold">{tables.toFixed(1).replace('.', ',')}</P>
              </Div>
              <Div className="text-right">
                <P className="text-[10px] text-muted-foreground truncate">{ev.venue || '—'}</P>
              </Div>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}