// Port di src/components/report/EventCompareReport.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from '@/ui/recharts';
import DeferredChart from '@/web/components/shared/DeferredChart';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar, DollarSign, Users, Table2, TrendingUp, BarChart3 } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { calcTables } from '@/legacy/utils/tables';
import { useProgressiveList } from '@/web/hooks/useProgressiveList';

import { Div, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@/ui/elements';

const COLORS = ['#a78bfa', '#60a5fa', '#4ade80', '#fbbf24', '#f472b6', '#fb923c', '#22d3ee', '#c084fc'];
const fmt = (v) => `€${Number(v).toLocaleString('it-IT')}`;
const tooltipStyle = {
  background: 'hsl(240 6% 8%)', border: '1px solid hsl(240 5% 18%)',
  borderRadius: '8px', fontSize: 12, color: '#fff',
};

function KpiCard({ icon: Icon, label, value, color }) {
  return (
    <Div className="rounded-xl border border-white/[0.06] bg-card p-3 flex items-center gap-2.5">
      <Div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </Div>
      <Div className="min-w-0">
        <P className="text-[10px] text-muted-foreground truncate">{label}</P>
        <P className="text-sm font-bold truncate">{value}</P>
      </Div>
    </Div>
  );
}

function SectionTitle({ children, icon: Icon = BarChart3, color = '#a78bfa' }) {
  return (
    <Div className="border-b border-border pb-2 mb-3">
      <SectionHeader icon={Icon} title={children} color={color} />
    </Div>
  );
}

export default function EventCompareReport({ promoters, events, attendances, config }) {
  const selectedEvents = useMemo(() =>
    events.filter(e => config.selectedEventIds.includes(e.id))
      .sort((a, b) => (a.date || '').localeCompare(b.date || '')),
    [events, config.selectedEventIds]
  );

  // Per-event data with full promoter breakdown
  const eventData = useMemo(() => selectedEvents.map(ev => {
    const evAtt = attendances.filter(a => a.event_id === ev.id && a.present !== false && !a.client_id);
    const promoterMap = new Map();
    evAtt.forEach(a => {
      const pid = a.promoter_id;
      if (!promoterMap.has(pid)) {
        promoterMap.set(pid, { promoter_id: pid, revenue: 0, tables: 0, new_people: 0, guadagno: 0 });
      }
      const r = promoterMap.get(pid);
      r.revenue += a.revenue || 0;
      r.tables += calcTables(a.revenue || 0, null, ev?.table_threshold || 300);
      r.new_people += a.new_people_brought || 0;
      r.guadagno += a.guadagno_fuori_mano || 0;
    });
    const promoterRows = [...promoterMap.values()]
      .map(r => ({
        ...r,
        promoter: promoters.find(p => p.id === r.promoter_id),
        revenue: Math.round(r.revenue),
        tables: Math.round(r.tables * 10) / 10,
        guadagno: Math.round(r.guadagno),
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const totProm = promoterRows.reduce((s, r) => s + r.revenue, 0);
    const totTav = Math.round(promoterRows.reduce((s, r) => s + r.tables, 0) * 10) / 10;
    const totNew = promoterRows.reduce((s, r) => s + r.new_people, 0);
    const totGuad = promoterRows.reduce((s, r) => s + r.guadagno, 0);

    return {
      ev,
      data: ev.date ? format(parseISO(ev.date), 'd MMM yy', { locale: it }) : '-',
      nome: ev.name || '-',
      locale: ev.venue || '-',
      fatturato: ev.total_revenue || 0,
      fat_promoter: totProm,
      totTav,
      totNew,
      totGuad,
      promoterRows,
      promoter_attivi: promoterRows.length,
      media_promoter: promoterRows.length > 0 ? Math.round(totProm / promoterRows.length) : 0,
    };
  }), [selectedEvents, attendances, promoters]);

  // Cross-comparison matrix: promoter × event
  const matrix = useMemo(() => {
    const allPids = new Set();
    eventData.forEach(ed => ed.promoterRows.forEach(r => allPids.add(r.promoter_id)));
    const promoterList = [...allPids].map(id => promoters.find(p => p.id === id)).filter(Boolean);
    return promoterList.map(p => {
      const cells = eventData.map(ed => {
        const r = ed.promoterRows.find(x => x.promoter_id === p.id);
        return r ? { revenue: r.revenue, tables: r.tables } : null;
      });
      return {
        promoter: p,
        cells,
        totalRev: cells.reduce((s, c) => s + (c?.revenue || 0), 0),
        totalTav: Math.round(cells.reduce((s, c) => s + (c?.tables || 0), 0) * 10) / 10,
        presenze: cells.filter(c => c).length,
      };
    }).sort((a, b) => b.totalRev - a.totalRev);
  }, [eventData, promoters]);

  // PORT: senza limite alle serate scelte ("Seleziona tutte" = centinaia): una tabella di dettaglio per
  // serata, montate a blocchi avvicinandosi alla fine (hooks/useProgressiveList, scroll della pagina)
  const { count: shownDetails, sentinelRef: detailsSentinelRef } = useProgressiveList(eventData.length, { initial: 4, step: 4 });
  const chartData = eventData.map((ed, i) => ({ ...ed, fill: COLORS[i % COLORS.length] }));
  const totalFat = eventData.reduce((s, ed) => s + ed.fatturato, 0);
  const totalProm = eventData.reduce((s, ed) => s + ed.fat_promoter, 0);
  const totalTav = Math.round(eventData.reduce((s, ed) => s + ed.totTav, 0) * 10) / 10;

  return (
    <Div className="space-y-5">
      {/* KPI */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard icon={Calendar} label="Serate Confrontate" value={eventData.length} color="#a78bfa" />
        <KpiCard icon={DollarSign} label="Fatturato Totale" value={fmt(totalFat)} color="#4ade80" />
        <KpiCard icon={Users} label="Promoter Unici" value={matrix.length} color="#60a5fa" />
        <KpiCard icon={Table2} label="Tavoli Totali" value={totalTav} color="#fbbf24" />
      </Div>
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard icon={DollarSign} label="Media/Serata" value={fmt(eventData.length > 0 ? Math.round(totalFat / eventData.length) : 0)} color="#c084fc" />
        <KpiCard icon={TrendingUp} label="Media/Promoter" value={fmt(eventData.length > 0 ? Math.round(totalProm / Math.max(1, eventData.reduce((s, ed) => s + ed.promoter_attivi, 0))) : 0)} color="#f472b6" />
      </Div>

      {/* Summary table */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Riepilogo Serate</SectionTitle>
        <Div className="overflow-x-auto">
          <Table className="w-full text-xs">
            <Thead>
              <Tr className="text-left text-muted-foreground border-b border-border">
                <Th className="py-2 pr-3">Data</Th>
                <Th className="py-2 pr-3">Serata</Th>
                <Th className="py-2 pr-3">Locale</Th>
                <Th className="py-2 pr-3 text-right">Fatt. Tot</Th>
                <Th className="py-2 pr-3 text-right">Fat. Prom</Th>
                <Th className="py-2 pr-3 text-right">Promoter</Th>
                <Th className="py-2 pr-3 text-right">Tavoli</Th>
                <Th className="py-2 pr-3 text-right">Media/Prom</Th>
              </Tr>
            </Thead>
            <Tbody>
              {eventData.map((ed, i) => (
                <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                  <Td className="py-2 pr-3 whitespace-nowrap">{ed.data}</Td>
                  <Td className="py-2 pr-3 font-medium">{ed.nome}</Td>
                  <Td className="py-2 pr-3 text-muted-foreground">{ed.locale}</Td>
                  <Td className="py-2 pr-3 text-right font-semibold">{fmt(ed.fatturato)}</Td>
                  <Td className="py-2 pr-3 text-right">{fmt(ed.fat_promoter)}</Td>
                  <Td className="py-2 pr-3 text-right">{ed.promoter_attivi}</Td>
                  <Td className="py-2 pr-3 text-right">{ed.totTav}</Td>
                  <Td className="py-2 pr-3 text-right text-muted-foreground">{fmt(ed.media_promoter)}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr className="border-t-2 border-border font-semibold">
                <Td className="py-2 pr-3" colSpan={3}>Totale</Td>
                <Td className="py-2 pr-3 text-right">{fmt(totalFat)}</Td>
                <Td className="py-2 pr-3 text-right">{fmt(totalProm)}</Td>
                <Td className="py-2 pr-3 text-right">{eventData.reduce((s, ed) => s + ed.promoter_attivi, 0)}</Td>
                <Td className="py-2 pr-3 text-right">{totalTav}</Td>
                <Td className="py-2 pr-3 text-right">—</Td>
              </Tr>
            </Tfoot>
          </Table>
        </Div>
      </Div>

      {/* Cross-comparison matrix: promoter × event revenue */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Matrice Fatturato — Promoter × Serata</SectionTitle>
        <Div className="overflow-x-auto">
          <Table className="w-full text-xs">
            <Thead>
              <Tr className="text-left text-muted-foreground border-b border-border">
                <Th className="py-2 pr-3 sticky left-0 bg-card">Promoter</Th>
                {eventData.map((ed, i) => (
                  <Th key={i} className="py-2 px-2 text-right whitespace-nowrap min-w-[80px]">
                    <Div className="font-medium text-foreground truncate max-w-[100px]">{ed.nome}</Div>
                    <Div className="text-[9px] text-muted-foreground">{ed.data}</Div>
                  </Th>
                ))}
                <Th className="py-2 px-2 text-right border-l border-border">Totale</Th>
                <Th className="py-2 px-2 text-right">Serate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {matrix.map((m, i) => (
                <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                  <Td className="py-2 pr-3 font-medium whitespace-nowrap sticky left-0 bg-card">
                    <Span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ background: COLORS[i % COLORS.length] }} />
                    {m.promoter?.name || '—'}
                  </Td>
                  {m.cells.map((c, j) => (
                    <Td key={j} className={`py-2 px-2 text-right ${c ? 'font-semibold' : 'text-muted-foreground/30'}`}>
                      {c ? fmt(c.revenue) : '—'}
                    </Td>
                  ))}
                  <Td className="py-2 px-2 text-right border-l border-border font-bold text-primary">{fmt(m.totalRev)}</Td>
                  <Td className="py-2 px-2 text-right text-muted-foreground">{m.presenze}/{eventData.length}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr className="border-t-2 border-border font-semibold">
                <Td className="py-2 pr-3 sticky left-0 bg-card">Totale Serata</Td>
                {eventData.map((ed, i) => (
                  <Td key={i} className="py-2 px-2 text-right">{fmt(ed.fat_promoter)}</Td>
                ))}
                <Td className="py-2 px-2 text-right border-l border-border text-primary">{fmt(totalProm)}</Td>
                <Td className="py-2 px-2 text-right">—</Td>
              </Tr>
            </Tfoot>
          </Table>
        </Div>
      </Div>

      {/* Matrix tavoli */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Matrice Tavoli — Promoter × Serata</SectionTitle>
        <Div className="overflow-x-auto">
          <Table className="w-full text-xs">
            <Thead>
              <Tr className="text-left text-muted-foreground border-b border-border">
                <Th className="py-2 pr-3 sticky left-0 bg-card">Promoter</Th>
                {eventData.map((ed, i) => (
                  <Th key={i} className="py-2 px-2 text-right whitespace-nowrap min-w-[70px]">
                    <Div className="font-medium text-foreground truncate max-w-[100px]">{ed.nome}</Div>
                  </Th>
                ))}
                <Th className="py-2 px-2 text-right border-l border-border">Totale</Th>
              </Tr>
            </Thead>
            <Tbody>
              {matrix.map((m, i) => (
                <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                  <Td className="py-2 pr-3 font-medium whitespace-nowrap sticky left-0 bg-card">{m.promoter?.name || '—'}</Td>
                  {m.cells.map((c, j) => (
                    <Td key={j} className={`py-2 px-2 text-right ${c ? '' : 'text-muted-foreground/30'}`}>
                      {c ? c.tables : '—'}
                    </Td>
                  ))}
                  <Td className="py-2 px-2 text-right border-l border-border font-bold text-primary">{m.totalTav}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Div>
      </Div>

      {/* Per-event detailed breakdown */}
      {eventData.slice(0, shownDetails).map((ed, i) => (
        <Div key={i} className="rounded-xl border border-white/[0.06] bg-card p-4">
          <SectionTitle>{ed.nome} — {ed.data} ({ed.locale})</SectionTitle>
          <Div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <Thead>
                <Tr className="text-left text-muted-foreground border-b border-border">
                  <Th className="py-2 pr-3">#</Th>
                  <Th className="py-2 pr-3">Promoter</Th>
                  <Th className="py-2 pr-3 text-right">Fatturato</Th>
                  <Th className="py-2 pr-3 text-right">% Serata</Th>
                  <Th className="py-2 text-right">Tavoli</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ed.promoterRows.map((r, j) => {
                  const pct = ed.fat_promoter > 0 ? Math.round((r.revenue / ed.fat_promoter) * 100) : 0;
                  return (
                    <Tr key={j} className="border-b border-border/40 hover:bg-secondary/20">
                      <Td className="py-2 pr-3 text-muted-foreground">{j + 1}</Td>
                      <Td className="py-2 pr-3 font-medium flex items-center gap-1.5">
                        <Span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[j % COLORS.length] }} />
                        {r.promoter?.name || '—'}
                      </Td>
                      <Td className="py-2 pr-3 text-right font-semibold">{fmt(r.revenue)}</Td>
                      <Td className="py-2 pr-3 text-right text-muted-foreground">{pct}%</Td>
                      <Td className="py-2 text-right">{r.tables}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr className="border-t-2 border-border font-semibold">
                  <Td className="py-2 pr-3" colSpan={2}>Totale Serata</Td>
                  <Td className="py-2 pr-3 text-right">{fmt(ed.fat_promoter)}</Td>
                  <Td className="py-2 pr-3 text-right">100%</Td>
                  <Td className="py-2 text-right">{ed.totTav}</Td>
                </Tr>
              </Tfoot>
            </Table>
          </Div>
        </Div>
      ))}
      {shownDetails < eventData.length && <Div ref={detailsSentinelRef} />}

      {/* Chart fatturato per serata */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Fatturato per Serata</SectionTitle>
        <DeferredChart style={{ height: Math.max(200, chartData.length * 50) }}><ResponsiveContainer width="100%" height="100%">
          <BarChart pageWindow data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickFormatter={fmt} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: 'hsl(0 0% 70%)', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v), 'Fatturato']} />
            <Bar dataKey="fatturato" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer></DeferredChart>
      </Div>
    </Div>
  );
}