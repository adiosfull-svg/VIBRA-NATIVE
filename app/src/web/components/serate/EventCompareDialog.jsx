// Port di src/components/serate/EventCompareDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState } from 'react';
import { Input } from '@/ui/input';
import { Search, BarChart3, Grid3X3, Users, Hash } from '@/ui/icons.generated';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Button } from '@/ui/button';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from '@/ui/recharts';
import { calcTables } from '@/legacy/utils/tables';
import { getEventDow } from '@/legacy/utils/dateUtils';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, P, Span } from '@/ui/html';
import { WindowedListVariable } from '@/ui/windowedList';

const COLORS = [
  'hsl(275 72% 52%)', 'hsl(200 70% 50%)', 'hsl(150 60% 45%)',
  'hsl(40 80% 55%)', 'hsl(340 65% 55%)', 'hsl(20 80% 55%)',
];

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '8px',
  fontSize: 12,
  color: 'hsl(0 0% 95%)',
};



// Cerca una serata per nome, venue o data (supporta formato italiano gg/mm, gg/mm/aaaa, gg mm aaaa, ecc.)
const keyOfEvent = (ev) => ev.id;

function matchesSearch(ev, q) {
  if (!q.trim()) return true;
  const s = q.toLowerCase().trim();
  if (ev.name?.toLowerCase().includes(s)) return true;
  if (ev.venue?.toLowerCase().includes(s)) return true;
  if (!ev.date) return false;
  // Cerca nel formato originale ISO
  if (ev.date.includes(s)) return true;
  // Converti in formato italiano leggibile e cerca lì
  try {
    const dateFormatted = format(parseISO(ev.date), 'dd/MM/yyyy');
    const dateFormattedShort = format(parseISO(ev.date), 'dd/MM/yy');
    const dateIT = format(parseISO(ev.date), "d MMMM yyyy", { locale: it });
    if (dateFormatted.includes(s) || dateFormattedShort.includes(s) || dateIT.toLowerCase().includes(s)) return true;
  } catch { /* ignore */ }
  return false;
}

export default function EventCompareDialog({ open, onOpenChange, events, attendances, promoters }) {
  useOverlay(open, () => onOpenChange?.(false));
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');

  const toggle = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const sortedEvents = useMemo(() => [...events].sort((a, b) => new Date(b.date) - new Date(a.date)), [events]);
  const shownEvents = useMemo(() => sortedEvents.filter(ev => matchesSearch(ev, search)), [sortedEvents, search]);

  const selectedEvents = sortedEvents.filter(e => selectedIds.includes(e.id));

  // Dati per grafico fatturato per serata
  const revenueData = selectedEvents.map((ev, i) => {
    const atts = attendances.filter(a => a.event_id === ev.id && a.promoter_id && !a.client_id);
    const revenue = ev.total_revenue || atts.reduce((s, a) => s + (a.revenue || 0), 0);
    const dow = getEventDow(ev);
    const tables = calcTables(revenue, dow);
    const label = ev.date ? format(parseISO(ev.date), 'dd MMM yy', { locale: it }) : ev.name;
    return { label, revenue, tables, fill: COLORS[i % COLORS.length] };
  });

  // Dati per confronto promoter (ogni serata selezionata = colonna per ogni promoter)
  const promoterCompareData = promoters
    .map(p => {
      const entry = { name: p.name };
      selectedEvents.forEach((ev, i) => {
        const att = attendances.find(a => a.event_id === ev.id && a.promoter_id === p.id && !a.client_id);
        const rev = att?.revenue || 0;
        const dow = getEventDow(ev);
        const label = ev.date ? format(parseISO(ev.date), 'dd/MM/yy') : ev.name;
        entry[label] = rev;
        entry[`${label}_tavoli`] = calcTables(rev, dow);
      });
      return entry;
    })
    .filter(p => selectedEvents.some(ev => {
      const label = ev.date ? format(parseISO(ev.date), 'dd/MM/yy') : ev.name;
      return p[label] > 0;
    }));

  const eventLabels = selectedEvents.map(ev =>
    ev.date ? format(parseISO(ev.date), 'dd/MM/yy') : ev.name
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confronto Serate</DialogTitle>
        </DialogHeader>

        <Div className="space-y-5">
          {/* Selettore serate */}
          <Div>
            <P className="text-xs text-muted-foreground mb-2">Seleziona le serate da confrontare:</P>
            <Div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Cerca serata..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </Div>
            {/* PORT: elenco virtualizzato (tutte le serate di tutte le stagioni, centinaia) nel riquadro
                max-h-48 (WindowedListVariable: i nomi lunghi vanno a capo), REGOLE-PRESTAZIONI §3 */}
            <Div className="border border-border rounded-lg">
              <WindowedListVariable items={shownEvents} keyOf={keyOfEvent} estimate={38} gap={4} maxHeight={190} padding={8} renderItem={(ev) => {
                const isSelected = selectedIds.includes(ev.id);
                return (
                  <Btn
                    button
                    key={ev.id}
                    onClick={() => toggle(ev.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all ${
                      isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/30 border border-transparent'
                    }`}>
                    <Span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: isSelected ? COLORS[selectedIds.indexOf(ev.id) % COLORS.length] : 'hsl(240 5% 30%)' }}
                    />
                    <Span className="font-medium">{ev.name}</Span>
                    <Span className="text-muted-foreground text-xs ml-auto">
                      {ev.date ? format(parseISO(ev.date), 'dd MMM yyyy', { locale: it }) : ''}
                    </Span>
                  </Btn>
                );
              }} />
            </Div>
            {selectedIds.length > 0 && (
              <Btn
                button
                onClick={() => setSelectedIds([])}
                className="text-xs text-muted-foreground hover:text-foreground mt-1">
                Deseleziona tutto
              </Btn>
            )}
          </Div>

          {selectedEvents.length < 2 && (
            <P className="text-sm text-muted-foreground text-center py-6">Seleziona almeno 2 serate per il confronto</P>
          )}

          {selectedEvents.length >= 2 && (
            <>
              {/* Grafico fatturato */}
              <Div className="rounded-xl bg-card border border-border p-4">
                <SectionHeader icon={BarChart3} title="Confronto Fatturato" color="#a78bfa" className="mb-3" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
                    <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#ffffff' }} itemStyle={{ color: '#ffffff' }} formatter={v => [`€${Number(v).toLocaleString('it-IT')}`, 'Fatturato']} />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {revenueData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Div>

              {/* Grafico tavoli */}
              <Div className="rounded-xl bg-card border border-border p-4">
                <SectionHeader icon={Grid3X3} title="Confronto Tavoli Prodotti" color="#60a5fa" className="mb-3" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
                    <XAxis dataKey="label" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Tavoli']} />
                    <Bar dataKey="tables" radius={[4, 4, 0, 0]}>
                      {revenueData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Div>

              {/* Confronto per promoter */}
              {promoterCompareData.length > 0 && (
                <>
                  <Div className="rounded-xl bg-card border border-border p-4">
                    <SectionHeader icon={Users} title="Fatturato per Promoter" color="#4ade80" className="mb-3" />
                    <ResponsiveContainer width="100%" height={Math.max(160, promoterCompareData.length * 44)}>
                      <BarChart data={promoterCompareData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                        <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(0 0% 85%)', fontSize: 12 }} tickLine={false} axisLine={false} width={80} />
                        <Tooltip contentStyle={tooltipStyle} formatter={v => [`€${Number(v).toLocaleString('it-IT')}`]} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {eventLabels.map((label, i) => (
                          <Bar key={label} dataKey={label} fill={COLORS[i % COLORS.length]} radius={[0, 4, 4, 0]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </Div>

                  <Div className="rounded-xl bg-card border border-border p-4">
                    <SectionHeader icon={Hash} title="Tavoli per Promoter" color="#fb923c" className="mb-3" />
                    <ResponsiveContainer width="100%" height={Math.max(160, promoterCompareData.length * 44)}>
                      <BarChart data={promoterCompareData.map(p => {
                        const entry = { name: p.name };
                        eventLabels.forEach(label => { entry[label] = p[`${label}_tavoli`] || 0; });
                        return entry;
                      })} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(0 0% 85%)', fontSize: 12 }} tickLine={false} axisLine={false} width={80} />
                        <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Tavoli']} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        {eventLabels.map((label, i) => (
                          <Bar key={label} dataKey={label} fill={COLORS[i % COLORS.length]} radius={[0, 4, 4, 0]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </Div>
                </>
              )}
            </>
          )}

          <Div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Chiudi</Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}