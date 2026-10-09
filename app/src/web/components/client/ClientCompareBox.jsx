// Port di src/components/client/ClientCompareBox.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
import React, { useState, useMemo } from 'react';
import { Input } from '@/ui/input';
import { X, Users2, Search } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/ui/recharts';
import DeferredChart from '@/web/components/shared/DeferredChart';

import { Btn, Div, P, Span } from '@/ui/html';

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '8px',
  color: 'hsl(0 0% 95%)',
  fontSize: 11,
  padding: '8px 12px',
};

const COLORS = [
  'hsl(270 70% 60%)', 'hsl(200 70% 55%)', 'hsl(150 60% 50%)',
  'hsl(40 80% 55%)',  'hsl(340 65% 55%)', 'hsl(30 80% 55%)',
];

export default function ClientCompareBox({ clients, attendances, events }) {
  const [selected, setSelected] = useState([]); // array of client ids
  const [search, setSearch] = useState('');

  const filteredClients = useMemo(() =>
    clients
      .filter(c => !selected.includes(c.id))
      .filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 8),
    [clients, selected, search]
  );

  const toggleClient = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Statistiche per ogni cliente selezionato
  const compareData = useMemo(() => {
    if (selected.length < 2) return null;
    const eventsById = Object.fromEntries(events.map(e => [e.id, e]));
    return selected.map((cid, idx) => {
      const client = clients.find(c => c.id === cid);
      const ca = attendances.filter(a => a.client_id === cid);
      const totalSpent = ca.reduce((s, a) => s + (a.revenue || 0), 0);
      const visits = ca.length;
      const avgSpent = visits > 0 ? Math.round(totalSpent / visits) : 0;
      const newPeople = client?.new_people_brought || 0;
      // serate presenti (ordinate per data desc)
      const eventsAttended = ca
        .map(a => eventsById[a.event_id])
        .filter(Boolean)
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      return {
        id: cid,
        name: client?.name || '—',
        visits,
        totalSpent,
        avgSpent,
        newPeople,
        color: COLORS[idx % COLORS.length],
        eventsAttended,
      };
    });
  }, [selected, clients, attendances, events]);

  // Dati per i grafici a barre grouped
  const chartDataVisits = compareData ? [
    { metric: 'Presenze', ...Object.fromEntries(compareData.map(c => [c.name, c.visits])) }
  ] : [];
  const chartDataSpend = compareData ? [
    { metric: 'Spesa tot.', ...Object.fromEntries(compareData.map(c => [c.name, c.totalSpent])) },
    { metric: 'Media', ...Object.fromEntries(compareData.map(c => [c.name, c.avgSpent])) },
  ] : [];
  const chartDataPeople = compareData ? [
    { metric: 'Nuove pers.', ...Object.fromEntries(compareData.map(c => [c.name, c.newPeople])) }
  ] : [];

  const clientKeys = compareData?.map(c => c.name) || [];

  return (
    <Div className="rounded-xl bg-card border border-border p-3 sm:p-5 space-y-4">
      {/* Header */}
      <SectionHeader icon={Users2} title="Confronto Clienti" color="#a78bfa" />

      {/* Selezione clienti */}
      <Div className="space-y-2">
        {/* Clienti selezionati */}
        {selected.length > 0 && (
          <Div className="flex flex-wrap gap-1.5">
            {selected.map((cid, idx) => {
              const c = clients.find(x => x.id === cid);
              return (
                <Span
                  key={cid}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: COLORS[idx % COLORS.length] + '22', borderColor: COLORS[idx % COLORS.length] + '66', color: COLORS[idx % COLORS.length] }}
                  onPress={() => toggleClient(cid)}
                >
                  {c?.name}
                  <X className="w-3 h-3" />
                </Span>
              );
            })}
          </Div>
        )}

        {/* Ricerca e aggiunta */}
        <Div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Aggiungi cliente al confronto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </Div>
        {(search || selected.length === 0) && filteredClients.length > 0 && (
          <Div className="flex flex-wrap gap-1">
            {filteredClients.map(c => (
              <Btn
                key={c.id}
                onClick={() => { toggleClient(c.id); setSearch(''); }}
                className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                {c.name}
              </Btn>
            ))}
          </Div>
        )}
      </Div>

      {selected.length < 2 && (
        <P className="text-xs text-muted-foreground text-center py-4">Seleziona almeno 2 clienti per confrontarli</P>
      )}

      {/* Grafici comparativi */}
      {compareData && (
        <Div className="space-y-5">
          {/* KPI cards */}
          <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {compareData.map(c => (
              <Div key={c.id} className="rounded-lg border p-3 space-y-2" style={{ borderColor: c.color + '55' }}>
                <P className="font-semibold text-sm" style={{ color: c.color }}>{c.name}</P>
                <Div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <Div>
                    <P className="text-[10px] text-muted-foreground">Presenze</P>
                    <P className="font-bold text-sm">{c.visits}</P>
                  </Div>
                  <Div>
                    <P className="text-[10px] text-muted-foreground">Spesa tot.</P>
                    <P className="font-bold text-sm text-primary">€{c.totalSpent.toLocaleString('it-IT')}</P>
                  </Div>
                  <Div>
                    <P className="text-[10px] text-muted-foreground">Media</P>
                    <P className="font-semibold text-sm">€{c.avgSpent.toLocaleString('it-IT')}</P>
                  </Div>
                  <Div>
                    <P className="text-[10px] text-muted-foreground">Nuove pers.</P>
                    <P className={`font-semibold text-sm ${c.newPeople > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>{c.newPeople}</P>
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>

          {/* Grafico presenze */}
          <Div>
            <P className="text-xs font-medium text-muted-foreground mb-2">Presenze</P>
            <DeferredChart style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataVisits} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {clientKeys.map((name, i) => (
                    <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} barSize={28} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </DeferredChart>
          </Div>

          {/* Grafico spesa */}
          <Div>
            <P className="text-xs font-medium text-muted-foreground mb-2">Spesa (€)</P>
            <DeferredChart style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataSpend} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }} tickFormatter={v => v >= 1000 ? `${Math.round(v/1000)}k` : v} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => `€${Number(v).toLocaleString('it-IT')}`} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {clientKeys.map((name, i) => (
                    <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} barSize={28} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </DeferredChart>
          </Div>

          {/* Serate presenti */}
          <Div className="space-y-3">
            <P className="text-xs font-semibold text-muted-foreground">Serate frequentate</P>
            <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {compareData.map(c => (
                <Div key={c.id} className="rounded-lg border border-border bg-secondary/20 overflow-hidden">
                  <Div className="px-3 py-2 border-b border-border/50" style={{ borderLeftColor: c.color, borderLeftWidth: 3 }}>
                    <P className="text-xs font-semibold" style={{ color: c.color }}>{c.name}</P>
                    <P className="text-[10px] text-muted-foreground">{c.eventsAttended.length} serate</P>
                  </Div>
                  <Div className="max-h-40 overflow-y-auto divide-y divide-border/30">
                    {c.eventsAttended.length === 0 ? (
                      <P className="text-xs text-muted-foreground px-3 py-2">Nessuna serata</P>
                    ) : c.eventsAttended.map((ev, i) => (
                      <Div key={i} className="flex items-center justify-between px-3 py-1.5 text-[11px]">
                        <Span className="truncate text-foreground/80 mr-2">{ev.name || ev.venue}</Span>
                        <Span className="text-muted-foreground shrink-0">{ev.date}</Span>
                      </Div>
                    ))}
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>

          {/* Grafico nuove persone */}
          <Div>
            <P className="text-xs font-medium text-muted-foreground mb-2">Nuove persone portate</P>
            <DeferredChart style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataPeople} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {clientKeys.map((name, i) => (
                    <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} barSize={28} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </DeferredChart>
          </Div>
        </Div>
      )}
    </Div>
  );
}