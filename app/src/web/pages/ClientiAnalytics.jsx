// Port di src/pages/ClientiAnalytics.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { parseISO, subMonths, startOfDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from '@/ui/recharts';
import DeferredChart from '@/web/components/shared/DeferredChart';
import { ArrowLeft, BarChart2, ChevronDown, ChevronUp, Calendar, MapPin, Table } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Link } from '@/web/router';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import ClientCompareBox from '@/web/components/client/ClientCompareBox';
import ClientInsightsBox from '@/web/components/client/ClientInsightsBox';
import ClientCostanzaChart from '@/web/components/client/ClientCostanzaChart';
import { buildAnalyticsClientStats } from '@/legacy/utils/clientPrecomputed';

import { Btn, Div, H, P, Span } from '@/ui/html';
import { ForeignObject, Img, Table as HtmlTable, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const PREVIEW = 10;

// Default stabile per useQuery: `= []` creerebbe un array nuovo a ogni render finché i dati
// non arrivano, facendo ricalcolare tutti i useMemo.
const EMPTY_ARR = [];

const tooltipStyle = {
  background: 'hsl(240 6% 8%)',
  border: '1px solid hsl(240 5% 18%)',
  borderRadius: '8px',
  color: 'hsl(0 0% 95%)',
  fontSize: 11,
  padding: '8px 12px',
};

// Tronca nome a N caratteri
function truncName(name, n = 10) {
  if (!name) return '';
  return name.length > n ? name.slice(0, n) + '…' : name;
}

// Custom YAxis tick con foto profilo + nome troncato
function ClientTick({ x, y, payload, data, fontSize = 9, maxLen = 10, width = 80 }) {
  const client = data?.[payload.index];
  const photoUrl = client?.photo_url;
  return (
    <ForeignObject x={x - width} y={y - 9} width={width - 4} height={18} style={{ overflow: 'visible' }}>
      <Div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', height: '100%', paddingRight: '2px' }}>
        {photoUrl && (
          <Img src={photoUrl} alt="" onError={e => { e.currentTarget.style.display = 'none'; }} style={{ width: 12, height: 12, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        )}
        <Span style={{ fontSize, color: 'hsl(240 5% 65%)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncName(payload.value, maxLen)}</Span>
      </Div>
    </ForeignObject>
  );
}

export default function ClientiAnalytics() {
  const { user } = useAuth();
  const [metric, setMetric] = useState('totalSpent');
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);

  const [period, setPeriod] = useState('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const periodStart = useMemo(() => {
    if (period === 'all') return null;
    if (period === 'custom') return customFrom ? startOfDay(parseISO(customFrom)) : null;
    return subMonths(new Date(), Number(period));
  }, [period, customFrom]);

  const periodEnd = useMemo(() => {
    if (period === 'custom') return customTo ? startOfDay(parseISO(customTo)) : null;
    return null;
  }, [period, customTo]);

  const { data: clients = EMPTY_ARR } = useQuery({
    queryKey: ['clients', user?.promoter_id],
    queryFn: () => base44.entities.Client.filter({ promoter_id: user.promoter_id }),
    enabled: !!user,
    staleTime: 5 * 60000,
    retry: 1,
  });
  // Solo le presenze del promoter loggato: stessa chiave e stesso fetcher della lista Clienti
  // (e del prefetch), quindi di norma già in cache. Prima scaricava l'INTERA tabella presenze
  // di tutti i promoter per usarne solo la parte dei propri clienti.
  const { data: myAttendances = EMPTY_ARR } = useQuery({
    queryKey: ['attendances', user?.promoter_id],
    queryFn: () => base44.entities.EventAttendance.filter({ promoter_id: user.promoter_id }, '-created_date', 5000),
    enabled: !!user?.promoter_id,
    staleTime: 5 * 60000,
    retry: 1,
  });
  // Tutte le sezioni (anche gli Insights) lavorano sulle presenze dei PROPRI clienti.
  // L'ordine relativo delle righe resta quello del server (-created_date).
  const attendances = useMemo(() => {
    if (!myAttendances.length || !clients.length) return EMPTY_ARR;
    const myClientIds = new Set(clients.map(c => c.id));
    return myAttendances.filter(a => a.client_id && myClientIds.has(a.client_id));
  }, [myAttendances, clients]);
  const { data: events = EMPTY_ARR } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    enabled: !!user,
    staleTime: 10 * 60000,
    retry: 1,
  });

  const uniqueVenues = useMemo(() => [...new Set(events.map(e => e.venue).filter(Boolean))].sort(), [events]);

  const eventsById = useMemo(() => Object.fromEntries(events.map(e => [e.id, e])), [events]);

  const filteredAttendances = useMemo(() => {
    if (!periodStart && !periodEnd) return attendances;
    return attendances.filter(a => {
      const ev = eventsById[a.event_id];
      if (!ev?.date) return false;
      const d = parseISO(ev.date);
      if (periodStart && d < periodStart) return false;
      if (periodEnd && d > periodEnd) return false;
      return true;
    });
  }, [attendances, eventsById, periodStart, periodEnd]);

  const clientStats = useMemo(() => {
    // Vista "tutto": usa campi pre-calcolati (cum_*) per render istantaneo
    if (period === 'all' && !periodStart && !periodEnd) {
      return buildAnalyticsClientStats(clients, metric).map(c => {
        const venueCounts = {};
        uniqueVenues.forEach(v => { venueCounts[v] = 0; });
        Object.assign(venueCounts, c.venueCounts);
        return { ...c, venueCounts };
      });
    }
    // Vista filtrata per periodo: calcola dalle presenze filtrate (eventsById memoizzato per O(1) lookup)
    return clients.map(c => {
      const ca = filteredAttendances.filter(a => a.client_id === c.id);
      const venueCounts = {};
      uniqueVenues.forEach(v => { venueCounts[v] = 0; });
      ca.forEach(a => {
        const ev = eventsById[a.event_id];
        if (!ev?.venue) return;
        venueCounts[ev.venue] = (venueCounts[ev.venue] || 0) + 1;
      });
      const totalSpent = ca.reduce((s, a) => s + (a.revenue || 0), 0);
      const visits = ca.length;
      const avgSpent = visits > 0 ? Math.round(totalSpent / visits) : 0;
      return { name: c.name, photo_url: c.photo_url, visits, venueCounts, totalSpent, avgSpent };
    }).sort((a, b) => b[metric] - a[metric]);
  }, [clients, filteredAttendances, eventsById, uniqueVenues, metric, period, periodStart, periodEnd]);

  const metrics = [
    { key: 'totalSpent', label: 'Spesa Totale' },
    { key: 'avgSpent', label: 'Spesa Media' },
    { key: 'visits', label: 'Presenze' },
  ];

  const metricColors = {
    totalSpent: 'hsl(270 60% 55%)',
    avgSpent: 'hsl(200 70% 50%)',
    visits: 'hsl(150 60% 45%)',
  };

  const periods = [
    { key: 'all', label: 'Da sempre' },
    { key: '1', label: 'Ultimo mese' },
    { key: '3', label: 'Ultimi 3 mesi' },
    { key: '6', label: 'Ultimi 6 mesi' },
    { key: '12', label: 'Ultimi 12 mesi' },
    { key: 'custom', label: 'Personalizzato' },
  ];

  // Grafico orizzontale unificato mobile+desktop, nomi troncati su mobile
  const renderMainChart = (data) => {
    const color = metricColors[metric];
    const isEuro = metric !== 'visits';
    return (
      <>
        {/* MOBILE: barre orizzontali, nomi troncati a sinistra */}
        <DeferredChart className="block sm:hidden" style={{ height: Math.max(240, data.length * 28) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, left: 84, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 9 }}
                tickFormatter={v => isEuro ? (v >= 1000 ? `€${Math.round(v/1000)}k` : `€${v}`) : v} />
              <YAxis type="category" dataKey="name" interval={0} tick={(props) => <ClientTick {...props} data={data} fontSize={9} maxLen={10} width={80} />} width={80} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={v => [isEuro ? `€${Number(v).toLocaleString('it-IT')}` : v, metrics.find(m => m.key === metric)?.label]}
              />
              <Bar dataKey={metric} fill={color} radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </DeferredChart>
        {/* DESKTOP: barre orizzontali, nomi completi */}
        <DeferredChart className="hidden sm:block" style={{ height: Math.max(280, data.length * 32) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 55, left: 144, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }}
                tickFormatter={v => isEuro ? (v >= 1000 ? `€${Math.round(v/1000)}k` : `€${v}`) : v} />
              <YAxis type="category" dataKey="name" interval={0} tick={(props) => <ClientTick {...props} data={data} fontSize={11} maxLen={16} width={140} />} width={140} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={v => [isEuro ? `€${Number(v).toLocaleString('it-IT')}` : v, metrics.find(m => m.key === metric)?.label]}
              />
              <Bar dataKey={metric} fill={color} radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </DeferredChart>
      </>
    );
  };

  const renderVenueChart = (data, venueColors) => (
    <>
      {/* MOBILE */}
      <DeferredChart className="block sm:hidden" style={{ height: Math.max(240, data.length * 28) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 10, left: 84, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 9 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" interval={0} tick={(props) => <ClientTick {...props} data={data} fontSize={9} maxLen={10} width={80} />} width={80} />
            <Tooltip
              contentStyle={tooltipStyle}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const total = payload.reduce((s, p) => s + (p.value || 0), 0);
                return (
                  <Div style={tooltipStyle}>
                    <P className="font-semibold mb-1">{label} — {total} pres.</P>
                    {payload.map((p, i) => p.value > 0 && <P key={i} style={{ color: p.fill }}>{p.name}: {p.value}</P>)}
                  </Div>
                );
              }}
            />
            {uniqueVenues.map(venue => (
              <Bar key={venue} dataKey={v => v.venueCounts[venue] || 0} name={venue} stackId="a" fill={venueColors[venue]} barSize={14} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </DeferredChart>
      {/* DESKTOP */}
      <DeferredChart className="hidden sm:block" style={{ height: Math.max(280, data.length * 32) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 10, left: 144, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" interval={0} tick={(props) => <ClientTick {...props} data={data} fontSize={11} maxLen={16} width={140} />} width={140} />
            <Tooltip
              contentStyle={tooltipStyle}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const total = payload.reduce((s, p) => s + (p.value || 0), 0);
                return (
                  <Div style={tooltipStyle}>
                    <P className="font-semibold mb-1">{label} — {total} pres.</P>
                    {payload.map((p, i) => p.value > 0 && <P key={i} style={{ color: p.fill }}>{p.name}: {p.value}</P>)}
                  </Div>
                );
              }}
            />
            {uniqueVenues.map(venue => (
              <Bar key={venue} dataKey={v => v.venueCounts[venue] || 0} name={venue} stackId="a" fill={venueColors[venue]} barSize={18} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </DeferredChart>
    </>
  );

  return (
    <Div className="space-y-4">
      {/* Header */}
      <Div className="flex items-center gap-3">
        <Link to="/clienti">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <Div>
          <H className="text-xl font-bold flex items-center gap-2"><BarChart2 className="w-5 h-5 text-primary" />Analitica Clienti</H>
          <P className="text-xs text-muted-foreground mt-0.5">Confronta le performance dei tuoi clienti</P>
        </Div>
      </Div>

      {/* Period selector */}
      <Div className="rounded-xl bg-card border border-border p-3 space-y-2.5">
        <SectionHeader icon={Calendar} title="Periodo" color="#a78bfa" />
        <Div className="flex flex-wrap gap-1.5">
          {periods.map(p => (
            <Btn
              button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${period === p.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'}`}>
              {p.label}
            </Btn>
          ))}
        </Div>
        {period === 'custom' && (
          <Div className="flex flex-wrap items-center gap-3">
            <Div className="flex items-center gap-2">
              <Span className="text-xs text-muted-foreground">Da:</Span>
              <Input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="h-8 text-xs w-36" />
            </Div>
            <Div className="flex items-center gap-2">
              <Span className="text-xs text-muted-foreground">A:</Span>
              <Input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="h-8 text-xs w-36" />
            </Div>
          </Div>
        )}
      </Div>

      {/* Metric selector */}
      <Div className="flex flex-wrap gap-2">
        {metrics.map(m => (
          <Btn
            button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${metric === m.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}>
            {m.label}
          </Btn>
        ))}
      </Div>

      {/* Main chart */}
      <Div className="rounded-xl bg-card border border-border p-3 sm:p-5">
        <Div className="flex items-center justify-between mb-3">
          <SectionHeader icon={BarChart2} title={`${metrics.find(m => m.key === metric)?.label} per Cliente`} color="#a78bfa" />
          {clientStats.length > PREVIEW && (
            <Btn
              button
              onClick={() => setExpanded1(e => !e)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              {expanded1 ? <><ChevronUp className="w-3.5 h-3.5" />Meno</> : <><ChevronDown className="w-3.5 h-3.5" />Tutti ({clientStats.length})</>}
            </Btn>
          )}
        </Div>
        {clientStats.length === 0 ? (
          <P className="text-sm text-muted-foreground text-center py-8">Nessun dato disponibile</P>
        ) : renderMainChart(expanded1 ? clientStats : clientStats.slice(0, PREVIEW))}
      </Div>

      {/* Presenze per Locale */}
      {uniqueVenues.length > 0 && (
        <Div className="rounded-xl bg-card border border-border p-3 sm:p-5">
          <Div className="flex items-center justify-between mb-3">
            <SectionHeader icon={MapPin} title="Presenze per Locale" color="#60a5fa" />
            {clientStats.length > PREVIEW && (
              <Btn
                button
                onClick={() => setExpanded2(e => !e)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                {expanded2 ? <><ChevronUp className="w-3.5 h-3.5" />Meno</> : <><ChevronDown className="w-3.5 h-3.5" />Tutti ({clientStats.length})</>}
              </Btn>
            )}
          </Div>
          {(() => {
            const sortedByVisits = [...clientStats].sort((a, b) => b.visits - a.visits);
            const data = expanded2 ? sortedByVisits : sortedByVisits.slice(0, PREVIEW);
            const venueColors = uniqueVenues.reduce((acc, venue, i) => {
              acc[venue] = `hsl(${(i * 137.5) % 360} 70% 50%)`;
              return acc;
            }, {});
            return (
              <>
                <Div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
                  {uniqueVenues.map(venue => (
                    <Span key={venue} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Span className="w-2 h-2 rounded-sm shrink-0" style={{ background: venueColors[venue] }} />
                      {venue}
                    </Span>
                  ))}
                </Div>
                {renderVenueChart(data, venueColors)}
              </>
            );
          })()}
        </Div>
      )}

      {/* Grafico costanza clienti */}
      <ClientCostanzaChart
        clients={clients}
        attendances={attendances}
        events={events}
        promoterId={user?.promoter_id}
      />

      {/* Insights */}
      <ClientInsightsBox clients={clients} attendances={attendances} events={events} />

      {/* Confronto clienti */}
      <ClientCompareBox clients={clients} attendances={attendances} events={events} />

      {/* Riepilogo completo — scroll orizzontale su mobile */}
      <Div className="rounded-xl bg-card border border-border overflow-hidden">
        <Div className="px-4 py-3 border-b border-border bg-secondary/30">
          <SectionHeader icon={Table} title="Riepilogo Completo" color="#4ade80" />
        </Div>
        <Div className="overflow-x-auto">
          <HtmlTable className="w-full text-xs">
            <Thead>
              <Tr className="border-b border-border">
                <Th className="text-left px-2.5 py-2 font-medium text-muted-foreground sticky left-0 bg-secondary/30 whitespace-nowrap">Cliente</Th>
                <Th className="text-center px-2.5 py-2 font-medium text-muted-foreground whitespace-nowrap">Pres.</Th>
                {uniqueVenues.filter(venue => clientStats.some(c => (c.venueCounts[venue] || 0) > 0)).map(venue => (
                 <Th key={venue} className="text-center px-1.5 py-2 font-medium text-muted-foreground whitespace-nowrap min-w-[40px] text-[10px]">{venue}</Th>
                ))}
                <Th className="text-right px-2.5 py-2 font-medium text-muted-foreground whitespace-nowrap">Tot.</Th>
                <Th className="text-right px-2.5 py-2 font-medium text-muted-foreground whitespace-nowrap">Media</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clientStats.map((c, i) => (
                <Tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <Td className="px-2.5 py-1.5 font-medium sticky left-0 bg-card whitespace-nowrap">
                    <Div className="flex items-center gap-1.5">
                      {c.photo_url && <Img src={c.photo_url} alt="" onError={e => { e.currentTarget.style.display = 'none'; }} className="w-4 h-4 rounded-full object-cover shrink-0" />}
                      {c.name}
                    </Div>
                  </Td>
                  <Td className="px-2.5 py-1.5 text-center font-semibold">{c.visits}</Td>
                  {uniqueVenues.filter(venue => clientStats.some(cs => (cs.venueCounts[venue] || 0) > 0)).map(venue => (
                    <Td key={venue} className="px-1.5 py-1.5 text-center text-[11px]">{c.venueCounts[venue] || 0}</Td>
                  ))}
                  <Td className="px-2.5 py-1.5 text-right font-bold text-primary whitespace-nowrap">€{c.totalSpent.toLocaleString('it-IT')}</Td>
                  <Td className="px-2.5 py-1.5 text-right text-muted-foreground whitespace-nowrap">€{c.avgSpent.toLocaleString('it-IT')}</Td>
                </Tr>
              ))}
            </Tbody>
          </HtmlTable>
        </Div>
      </Div>
    </Div>
  );
}