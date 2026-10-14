// Port di src/components/report/ReportPreview.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState } from 'react';
import { Printer, Download, Loader2, TrendingUp, TrendingDown, Minus, Users, Calendar, DollarSign, Table2, Gauge, BarChart3 } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from '@/ui/recharts';
import DeferredChart from '@/web/components/shared/DeferredChart';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  buildPromoterRows, buildEventRows, buildMonthlyRows,
  computeGroupKpis, computePromoterStats, computePeriodComparison,
  computePromoterDualPeriod, monthRangeToDates, monthRangeLabel,
  filterEventsByPeriod, periodLabel, computeGroupDayTypeMedie, DAY_TYPES,
} from '@/legacy/utils/reportData';
import { exportReportPDF } from '@/legacy/utils/reportPDF';
import EventCompareReport from '@/web/components/report/EventCompareReport';
import DualPeriodWaveChart from '@/web/components/report/DualPeriodWaveChart';
import DayTypeBreakdown from '@/web/components/report/DayTypeBreakdown';

import { Btn, Div, H, P, Span } from '@/ui/html';
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

function DeltaBadge({ value, suffix = '' }) {
  if (value === 0) return <Span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground"><Minus className="w-3 h-3" />Invariato</Span>;
  const positive = value > 0;
  return (
    <Span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? '+' : ''}{value}{suffix}
    </Span>
  );
}

function SectionTitle({ children, icon: Icon = BarChart3, color = '#a78bfa' }) {
  return (
    <Div className="border-b border-border pb-2 mb-3">
      <SectionHeader icon={Icon} title={children} color={color} />
    </Div>
  );
}

function ReportHeader({ title, subtitle, onPrint, onPDF, pdfLoading }) {
  return (
    <Div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border">
      <Div>
        <H className="text-lg font-bold">{title}</H>
        <P className="text-xs text-muted-foreground mt-0.5">{subtitle}</P>
      </Div>
      <Div className="flex items-center gap-2">
        <Btn
          button
          onClick={onPDF}
          disabled={pdfLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
          {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Scarica PDF
        </Btn>
        <Btn
          button
          onClick={onPrint}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:border-white/15 transition-all">
          <Printer className="w-4 h-4" />
          Stampa
        </Btn>
      </Div>
    </Div>
  );
}

// ── Vibra Group ──
function VibraGroupReport({ promoters, attendances, events, config }) {
  const promoterRows = useMemo(() => buildPromoterRows(promoters, attendances, events, config.from, config.to), [promoters, attendances, events, config]);
  const eventRows = useMemo(() => buildEventRows(events, attendances, config.from, config.to), [events, attendances, config]);
  const monthlyRows = useMemo(() => buildMonthlyRows(events, config.from, config.to), [events, config]);
  const kpis = useMemo(() => computeGroupKpis(promoterRows, events, config.from, config.to), [promoterRows, events, config]);

  return (
    <Div className="space-y-5">
      {/* KPI */}
      <Div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <KpiCard icon={Users} label="Promoter Attivi" value={kpis.promoterAttivi} color="#a78bfa" />
        <KpiCard icon={DollarSign} label="Fatturato Totale" value={fmt(kpis.fatturatoTotale)} color="#4ade80" />
        <KpiCard icon={Table2} label="Tavoli Chiusi" value={kpis.tavoliTotali} color="#60a5fa" />
        <KpiCard icon={Calendar} label="Serate nel Periodo" value={kpis.seratePeriodo} color="#fbbf24" />
        <KpiCard icon={DollarSign} label="Media per Promoter" value={fmt(kpis.mediaPromoter)} color="#f472b6" />
      </Div>

      {/* Promoter ranking */}
      {config.sections.promoters && promoterRows.length > 0 && (
        <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
          <SectionTitle>Classifica Promoter</SectionTitle>
          <Div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <Thead>
                <Tr className="text-left text-muted-foreground border-b border-border">
                  <Th className="py-2 pr-3">#</Th>
                  <Th className="py-2 pr-3">Nome</Th>
                  <Th className="py-2 pr-3 text-right">Serate</Th>
                  <Th className="py-2 pr-3 text-right">Fatturato</Th>
                  <Th className="py-2 pr-3 text-right">Media</Th>
                  {DAY_TYPES.map(d => (
                    <Th key={d.key} className="py-2 pr-3 text-right" style={{ color: d.color }}>Med {d.label}</Th>
                  ))}
                  <Th className="py-2 pr-3 text-right">Tavoli</Th>
                  <Th className="py-2">Zona</Th>
                </Tr>
              </Thead>
              <Tbody>
                {promoterRows.map((r, i) => (
                  <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                    <Td className="py-2 pr-3 text-muted-foreground">{i + 1}</Td>
                    <Td className="py-2 pr-3 font-medium">{r.nome}</Td>
                    <Td className="py-2 pr-3 text-right">{r.serate}</Td>
                    <Td className="py-2 pr-3 text-right font-semibold">{fmt(r.fatturato)}</Td>
                    <Td className="py-2 pr-3 text-right text-muted-foreground">{fmt(r.media)}</Td>
                    {DAY_TYPES.map(d => (
                      <Td key={d.key} className="py-2 pr-3 text-right text-muted-foreground">{r['ser' + d.key.charAt(0).toUpperCase() + d.key.slice(1)] > 0 ? fmt(r['med' + d.key.charAt(0).toUpperCase() + d.key.slice(1)]) : '—'}</Td>
                    ))}
                    <Td className="py-2 pr-3 text-right">{r.tavoli}</Td>
                    <Td className="py-2 text-muted-foreground">{r.zona}</Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                {(() => {
                  const grpMed = computeGroupDayTypeMedie(promoterRows);
                  return (
                    <Tr className="border-t-2 border-border font-semibold">
                      <Td className="py-2 pr-3" colSpan={4}>Totale Gruppo</Td>
                      <Td className="py-2 pr-3 text-right">{fmt(promoterRows.reduce((s, r) => s + r.media, 0))}</Td>
                      {DAY_TYPES.map(d => (
                        <Td key={d.key} className="py-2 pr-3 text-right" style={{ color: d.color }}>{grpMed[d.key] > 0 ? fmt(grpMed[d.key]) : '—'}</Td>
                      ))}
                      <Td className="py-2 pr-3 text-right">{Math.round(promoterRows.reduce((s, r) => s + r.tavoli, 0) * 10) / 10}</Td>
                      <Td className="py-2"></Td>
                    </Tr>
                  );
                })()}
              </Tfoot>
            </Table>
          </Div>
          {/* Grafico a barre orizzontale */}
          <Div className="mt-4">
            <DeferredChart style={{ height: Math.max(120, promoterRows.length * 36) }}><ResponsiveContainer width="100%" height="100%">
              <BarChart data={promoterRows.slice(0, 15)} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickFormatter={fmt} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nome" tick={{ fill: 'hsl(0 0% 70%)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v), 'Fatturato']} />
                <Bar dataKey="fatturato" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {promoterRows.slice(0, 15).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer></DeferredChart>
          </Div>
        </Div>
      )}

      {/* Serate */}
      {config.sections.events && eventRows.length > 0 && (
        <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
          <SectionTitle>Serate ({eventRows.length})</SectionTitle>
          <Div className="overflow-x-auto max-h-96 overflow-y-auto">
            <Table className="w-full text-xs">
              <Thead className="sticky top-0 bg-card">
                <Tr className="text-left text-muted-foreground border-b border-border">
                  <Th className="py-2 pr-3">Data</Th>
                  <Th className="py-2 pr-3">Serata</Th>
                  <Th className="py-2 pr-3">Locale</Th>
                  <Th className="py-2 pr-3 text-right">Fatt. Tot</Th>
                  <Th className="py-2 pr-3 text-right">Promoter</Th>
                  <Th className="py-2 text-right">Fat. Prom</Th>
                </Tr>
              </Thead>
              <Tbody>
                {eventRows.map((r, i) => (
                  <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                    <Td className="py-2 pr-3 whitespace-nowrap">{r.data}</Td>
                    <Td className="py-2 pr-3 font-medium">{r.nome}</Td>
                    <Td className="py-2 pr-3 text-muted-foreground">{r.locale}</Td>
                    <Td className="py-2 pr-3 text-right font-semibold">{fmt(r.fatturato)}</Td>
                    <Td className="py-2 pr-3 text-right">{r.promoter_attivi}</Td>
                    <Td className="py-2 text-right text-muted-foreground">{fmt(r.fat_promoter)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Div>
        </Div>
      )}

      {/* Andamento mensile */}
      {config.sections.monthly && monthlyRows.length > 0 && (
        <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
          <SectionTitle>Andamento Mensile</SectionTitle>
          <DeferredChart style={{ height: 250 }}><ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRows} margin={{ left: 0, right: 10, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
              <XAxis dataKey="mese" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickFormatter={fmt} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v), 'Fatturato']} />
              <Bar dataKey="fatturato" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {monthlyRows.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer></DeferredChart>
          <Div className="mt-3 overflow-x-auto">
            <Table className="w-full text-xs">
              <Thead>
                <Tr className="text-left text-muted-foreground border-b border-border">
                  <Th className="py-2 pr-3">Mese</Th>
                  <Th className="py-2 pr-3 text-right">Serate</Th>
                  <Th className="py-2 pr-3 text-right">Fatturato</Th>
                  <Th className="py-2 text-right">Media/Serata</Th>
                </Tr>
              </Thead>
              <Tbody>
                {monthlyRows.map((r, i) => (
                  <Tr key={i} className="border-b border-border/40">
                    <Td className="py-2 pr-3 font-medium capitalize">{r.mese}</Td>
                    <Td className="py-2 pr-3 text-right">{r.serate}</Td>
                    <Td className="py-2 pr-3 text-right font-semibold">{fmt(r.fatturato)}</Td>
                    <Td className="py-2 text-right text-muted-foreground">{fmt(r.media)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Div>
        </Div>
      )}
    </Div>
  );
}

// ── Promoter Compare ──
function PromoterCompareReport({ promoters, attendances, events, config }) {
  const selected = promoters.filter(p => config.selectedPromoterIds.includes(p.id));
  const rows = useMemo(() =>
    selected.map(p => computePromoterStats(p, attendances, events, config.from, config.to)),
    [selected, attendances, events, config]
  );
  const chartData = rows.map((r, i) => ({ ...r, fill: COLORS[i % COLORS.length] }));

  return (
    <Div className="space-y-5">
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard icon={Users} label="Promoter Confrontati" value={rows.length} color="#a78bfa" />
        <KpiCard icon={DollarSign} label="Fatturato Cumulativo" value={fmt(rows.reduce((s, r) => s + r.fatturato, 0))} color="#4ade80" />
        <KpiCard icon={Table2} label="Tavoli Cumulativi" value={Math.round(rows.reduce((s, r) => s + r.tavoli, 0) * 10) / 10} color="#60a5fa" />
        <KpiCard icon={Calendar} label="Serate Totali" value={rows.reduce((s, r) => s + r.serate, 0)} color="#fbbf24" />
      </Div>

      {/* Tabella confronto */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Confronto Promoter — {periodLabel(config)}</SectionTitle>
        <Div className="overflow-x-auto">
          <Table className="w-full text-xs">
            <Thead>
              <Tr className="text-left text-muted-foreground border-b border-border">
                <Th className="py-2 pr-3">Promoter</Th>
                <Th className="py-2 pr-3 text-right">Serate</Th>
                <Th className="py-2 pr-3 text-right">Fatturato</Th>
                <Th className="py-2 pr-3 text-right">Media/Serata</Th>
                {DAY_TYPES.map(d => (
                  <Th key={d.key} className="py-2 pr-3 text-right" style={{ color: d.color }}>Med {d.label}</Th>
                ))}
                <Th className="py-2 pr-3 text-right">Tavoli</Th>
                <Th className="py-2 text-right">% sul Totale</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((r, i) => {
                const totalFat = rows.reduce((s, x) => s + x.fatturato, 0);
                const pct = totalFat > 0 ? Math.round((r.fatturato / totalFat) * 100) : 0;
                return (
                  <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                    <Td className="py-2 pr-3 font-medium flex items-center gap-1.5">
                      <Span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      {r.nome}
                    </Td>
                    <Td className="py-2 pr-3 text-right">{r.serate}</Td>
                    <Td className="py-2 pr-3 text-right font-semibold">{fmt(r.fatturato)}</Td>
                    <Td className="py-2 pr-3 text-right text-muted-foreground">{fmt(r.media)}</Td>
                    {DAY_TYPES.map(d => (
                      <Td key={d.key} className="py-2 pr-3 text-right text-muted-foreground">{r['ser' + d.key.charAt(0).toUpperCase() + d.key.slice(1)] > 0 ? fmt(r['med' + d.key.charAt(0).toUpperCase() + d.key.slice(1)]) : '—'}</Td>
                    ))}
                    <Td className="py-2 pr-3 text-right">{r.tavoli}</Td>
                    <Td className="py-2 text-right">{pct}%</Td>
                  </Tr>
                );
              })}
            </Tbody>
            <Tfoot>
              {(() => {
                const grpMed = computeGroupDayTypeMedie(rows);
                const totalFat = rows.reduce((s, x) => s + x.fatturato, 0);
                return (
                  <Tr className="border-t-2 border-border font-semibold">
                    <Td className="py-2 pr-3">Totale Gruppo</Td>
                    <Td className="py-2 pr-3 text-right">{rows.reduce((s, r) => s + r.serate, 0)}</Td>
                    <Td className="py-2 pr-3 text-right">{fmt(totalFat)}</Td>
                    <Td className="py-2 pr-3 text-right">{fmt(rows.reduce((s, r) => s + r.media, 0))}</Td>
                    {DAY_TYPES.map(d => (
                      <Td key={d.key} className="py-2 pr-3 text-right" style={{ color: d.color }}>{grpMed[d.key] > 0 ? fmt(grpMed[d.key]) : '—'}</Td>
                    ))}
                    <Td className="py-2 pr-3 text-right">{Math.round(rows.reduce((s, r) => s + r.tavoli, 0) * 10) / 10}</Td>
                    <Td className="py-2 text-right">100%</Td>
                  </Tr>
                );
              })()}
            </Tfoot>
          </Table>
        </Div>
      </Div>

      {/* Grafico fatturato */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Fatturato per Promoter</SectionTitle>
        <DeferredChart style={{ height: Math.max(200, rows.length * 50) }}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickFormatter={fmt} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: 'hsl(0 0% 70%)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v), 'Fatturato']} />
            <Bar dataKey="fatturato" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer></DeferredChart>
      </Div>

      {/* Grafico tavoli */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Tavoli per Promoter</SectionTitle>
        <DeferredChart style={{ height: Math.max(200, rows.length * 50) }}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: 'hsl(0 0% 70%)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [Number(v).toFixed(1), 'Tavoli']} />
            <Bar dataKey="tavoli" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer></DeferredChart>
      </Div>
    </Div>
  );
}

// ── Promoter Compare Dual Period ──
function PromoterCompareDualReport({ promoters, attendances, events, config }) {
  const selected = promoters.filter(p => config.selectedPromoterIds.includes(p.id));
  const p1m = config.period1Months || { fromMonth: 0, fromYear: 2024, toMonth: 5, toYear: 2024 };
  const p2m = config.period2Months || { fromMonth: 6, fromYear: 2024, toMonth: 11, toYear: 2024 };
  const period1 = monthRangeToDates(p1m);
  const period2 = monthRangeToDates(p2m);
  const rows = useMemo(() =>
    selected.map(p => computePromoterDualPeriod(p, attendances, events, period1, period2)),
    [selected, attendances, events, period1, period2]
  );

  const p1Total = rows.reduce((s, r) => s + r.p1.fatturato, 0);
  const p2Total = rows.reduce((s, r) => s + r.p2.fatturato, 0);
  const p1Tav = Math.round(rows.reduce((s, r) => s + r.p1.tavoli, 0) * 10) / 10;
  const p2Tav = Math.round(rows.reduce((s, r) => s + r.p2.tavoli, 0) * 10) / 10;
  const p1Ser = rows.reduce((s, r) => s + r.p1.serate, 0);
  const p2Ser = rows.reduce((s, r) => s + r.p2.serate, 0);
  const p1Med = p1Ser > 0 ? Math.round(p1Total / p1Ser) : 0;
  const p2Med = p2Ser > 0 ? Math.round(p2Total / p2Ser) : 0;
  const deltaTot = p2Total - p1Total;
  const deltaTavTot = Math.round((p2Tav - p1Tav) * 10) / 10;

  return (
    <Div className="space-y-5">
      {/* KPI riga 1 */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard icon={Users} label="Promoter Confrontati" value={rows.length} color="#a78bfa" />
        <KpiCard icon={DollarSign} label="Fat. Totale P1" value={fmt(p1Total)} color="#60a5fa" />
        <KpiCard icon={DollarSign} label="Fat. Totale P2" value={fmt(p2Total)} color="#4ade80" />
        <KpiCard icon={TrendingUp} label="Delta Totale" value={`${deltaTot >= 0 ? '+' : ''}${fmt(deltaTot)}`} color={deltaTot >= 0 ? '#4ade80' : '#f87171'} />
      </Div>

      {/* KPI riga 2 */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard icon={Table2} label="Tavoli P1" value={p1Tav} color="#60a5fa" />
        <KpiCard icon={Table2} label="Tavoli P2" value={p2Tav} color="#4ade80" />
        <KpiCard icon={TrendingUp} label="Delta Tavoli" value={`${deltaTavTot >= 0 ? '+' : ''}${deltaTavTot}`} color={deltaTavTot >= 0 ? '#4ade80' : '#f87171'} />
        <KpiCard icon={Gauge} label="Media/Serata P1→P2" value={`${fmt(p1Med)} → ${fmt(p2Med)}`} color="#fbbf24" />
      </Div>

      {/* KPI riga 3 */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiCard icon={Calendar} label="Serate P1" value={p1Ser} color="#60a5fa" />
        <KpiCard icon={Calendar} label="Serate P2" value={p2Ser} color="#4ade80" />
        <KpiCard icon={TrendingUp} label="Delta Serate" value={`${p2Ser - p1Ser >= 0 ? '+' : ''}${p2Ser - p1Ser}`} color={p2Ser - p1Ser >= 0 ? '#4ade80' : '#f87171'} />
        <KpiCard icon={DollarSign} label="Delta Media/Serata" value={`${p2Med - p1Med >= 0 ? '+' : ''}${fmt(p2Med - p1Med)}`} color={p2Med - p1Med >= 0 ? '#4ade80' : '#f87171'} />
      </Div>

      {/* Label periodi */}
      <Div className="flex flex-wrap gap-3 text-xs">
        <Span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium">
          P1: {monthRangeLabel(p1m)}
        </Span>
        <Span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
          P2: {monthRangeLabel(p2m)}
        </Span>
      </Div>

      {/* Grafico a onde P1 vs P2 */}
      <DualPeriodWaveChart
        selectedPromoters={selected}
        attendances={attendances}
        events={events}
        period1={period1}
        period2={period2}
      />

      {/* Tabella confronto */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Confronto per Promoter — Due Periodi</SectionTitle>
        <Div className="overflow-x-auto">
          <Table className="w-full text-xs">
            <Thead>
              <Tr className="text-left text-muted-foreground border-b border-border">
                <Th className="py-2 pr-3" rowSpan={2}>Promoter</Th>
                <Th className="py-1 pr-3 text-center border-l border-border" colSpan={4}>Periodo 1 (blu)</Th>
                <Th className="py-1 pr-3 text-center border-l border-border" colSpan={4}>Periodo 2 (verde)</Th>
                <Th className="py-1 pr-3 text-center border-l border-border" rowSpan={2}>Δ Fat.</Th>
                <Th className="py-1 pr-3 text-center border-l border-border" rowSpan={2}>Δ Tav.</Th>
                <Th className="py-2 text-center border-l border-border" rowSpan={2}>% Fat</Th>
              </Tr>
              <Tr className="text-left text-muted-foreground border-b border-border">
                <Th className="py-1 pr-3 text-right border-l border-border">Ser</Th>
                <Th className="py-1 pr-3 text-right">Fat</Th>
                <Th className="py-1 pr-3 text-right">Med</Th>
                <Th className="py-1 pr-3 text-right">Tav</Th>
                <Th className="py-1 pr-3 text-right border-l border-border">Ser</Th>
                <Th className="py-1 pr-3 text-right">Fat</Th>
                <Th className="py-1 pr-3 text-right">Med</Th>
                <Th className="py-1 pr-3 text-right">Tav</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((r, i) => (
                <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                  <Td className="py-2 pr-3 font-medium whitespace-nowrap">{r.nome}</Td>
                  <Td className="py-2 pr-3 text-right border-l border-border/30">{r.p1.serate}</Td>
                  <Td className="py-2 pr-3 text-right font-semibold text-blue-400">{fmt(r.p1.fatturato)}</Td>
                  <Td className="py-2 pr-3 text-right text-blue-400/70">{fmt(r.p1.media)}</Td>
                  <Td className="py-2 pr-3 text-right">{r.p1.tavoli}</Td>
                  <Td className="py-2 pr-3 text-right border-l border-border/30">{r.p2.serate}</Td>
                  <Td className="py-2 pr-3 text-right font-semibold text-emerald-400">{fmt(r.p2.fatturato)}</Td>
                  <Td className="py-2 pr-3 text-right text-emerald-400/70">{fmt(r.p2.media)}</Td>
                  <Td className="py-2 pr-3 text-right">{r.p2.tavoli}</Td>
                  <Td className={`py-2 pr-3 text-right border-l border-border/30 font-semibold ${r.deltaFat >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.deltaFat >= 0 ? '+' : ''}{fmt(r.deltaFat)}
                  </Td>
                  <Td className={`py-2 pr-3 text-right border-l border-border/30 font-semibold ${r.deltaTav >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.deltaTav >= 0 ? '+' : ''}{r.deltaTav}
                  </Td>
                  <Td className="py-2 text-center border-l border-border/30">
                    <DeltaBadge value={r.pctFat} suffix="%" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Div>
      </Div>

      {/* Tabella dettaglio delta */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Dettaglio Delta — Media, Tavoli, Serate</SectionTitle>
        <Div className="overflow-x-auto">
          <Table className="w-full text-xs">
            <Thead>
              <Tr className="text-left text-muted-foreground border-b border-border">
                <Th className="py-2 pr-3">Promoter</Th>
                <Th className="py-2 pr-3 text-right">Med P1</Th>
                <Th className="py-2 pr-3 text-right">Med P2</Th>
                <Th className="py-2 pr-3 text-right">Δ Media</Th>
                <Th className="py-2 pr-3 text-right">Δ Tavoli</Th>
                <Th className="py-2 pr-3 text-right">% Tavoli</Th>
                <Th className="py-2 pr-3 text-right">Δ Serate</Th>
                <Th className="py-2 text-right">% Fatturato</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((r, i) => (
                <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                  <Td className="py-2 pr-3 font-medium whitespace-nowrap">{r.nome}</Td>
                  <Td className="py-2 pr-3 text-right text-blue-400/70">{fmt(r.p1.media)}</Td>
                  <Td className="py-2 pr-3 text-right text-emerald-400/70">{fmt(r.p2.media)}</Td>
                  <Td className={`py-2 pr-3 text-right font-semibold ${r.deltaMedia >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.deltaMedia >= 0 ? '+' : ''}{fmt(r.deltaMedia)}
                  </Td>
                  <Td className={`py-2 pr-3 text-right font-semibold ${r.deltaTav >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.deltaTav >= 0 ? '+' : ''}{r.deltaTav}
                  </Td>
                  <Td className="py-2 pr-3 text-center">
                    <DeltaBadge value={r.pctTav} suffix="%" />
                  </Td>
                  <Td className={`py-2 pr-3 text-right font-semibold ${r.deltaSerate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.deltaSerate >= 0 ? '+' : ''}{r.deltaSerate}
                  </Td>
                  <Td className="py-2 text-center">
                    <DeltaBadge value={r.pctFat} suffix="%" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Div>
      </Div>

      {/* Breakdown per giorno Ven/Sab/Dom/Extra */}
      <DayTypeBreakdown
        selectedPromoters={selected}
        attendances={attendances}
        events={events}
        period1={period1}
        period2={period2}
      />

      {/* Medie per giorno Ven/Sab/Dom/Extra */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Medie per Giorno — Ven / Sab / Dom / Extra</SectionTitle>
        <P className="text-[10px] text-muted-foreground mb-3">Fatturato medio per serata di quel tipo (ricavi ÷ presenze). Blu = P1, Verde = P2.</P>
        <Div className="overflow-x-auto">
          <Table className="w-full text-xs">
            <Thead>
              <Tr className="text-left text-muted-foreground border-b border-border">
                <Th className="py-2 pr-3" rowSpan={2}>Promoter</Th>
                {DAY_TYPES.map(d => (
                  <Th key={d.key} className="py-1 px-2 text-center border-l border-border" colSpan={2}>
                    <Span style={{ color: d.color }} className="font-semibold">{d.full}</Span>
                  </Th>
                ))}
              </Tr>
              <Tr className="text-left text-muted-foreground border-b border-border">
                {DAY_TYPES.map(d => (
                  <React.Fragment key={d.key}>
                    <Th className="py-1 px-2 text-right border-l border-border text-blue-400 text-[10px]">P1</Th>
                    <Th className="py-1 px-2 text-right text-emerald-400 text-[10px]">P2</Th>
                  </React.Fragment>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((r, i) => (
                <Tr key={i} className="border-b border-border/40 hover:bg-secondary/20">
                  <Td className="py-2 pr-3 font-medium whitespace-nowrap">{r.nome}</Td>
                  {DAY_TYPES.map(d => {
                    const k = d.key.charAt(0).toUpperCase() + d.key.slice(1);
                    return (
                      <React.Fragment key={d.key}>
                        <Td className="py-2 px-2 text-right border-l border-border/30 text-blue-400/90">{r.p1['ser' + k] > 0 ? fmt(r.p1['med' + k]) : '—'}</Td>
                        <Td className="py-2 px-2 text-right text-emerald-400/90">{r.p2['ser' + k] > 0 ? fmt(r.p2['med' + k]) : '—'}</Td>
                      </React.Fragment>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              {(() => {
                const g1 = computeGroupDayTypeMedie(rows.map(r => r.p1));
                const g2 = computeGroupDayTypeMedie(rows.map(r => r.p2));
                return (
                  <Tr className="border-t-2 border-border font-semibold">
                    <Td className="py-2 pr-3">Totale</Td>
                    {DAY_TYPES.map(d => (
                      <React.Fragment key={d.key}>
                        <Td className="py-2 px-2 text-right border-l border-border/30 text-blue-400">{g1[d.key] > 0 ? fmt(g1[d.key]) : '—'}</Td>
                        <Td className="py-2 px-2 text-right text-emerald-400">{g2[d.key] > 0 ? fmt(g2[d.key]) : '—'}</Td>
                      </React.Fragment>
                    ))}
                  </Tr>
                );
              })()}
            </Tfoot>
          </Table>
        </Div>
      </Div>

      {/* Grafico fatturato comparativo */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Fatturato P1 vs P2 per Promoter</SectionTitle>
        <DeferredChart style={{ height: Math.max(200, rows.length * 50) }}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows.map(r => ({ nome: r.nome, 'P1': r.p1.fatturato, 'P2': r.p2.fatturato }))} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickFormatter={fmt} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: 'hsl(0 0% 70%)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [fmt(v), name]} />
            <Bar dataKey="P1" fill="#60a5fa" radius={[0, 4, 4, 0]} maxBarSize={14} />
            <Bar dataKey="P2" fill="#4ade80" radius={[0, 4, 4, 0]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer></DeferredChart>
      </Div>

      {/* Grafico tavoli comparativo */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Tavoli P1 vs P2 per Promoter</SectionTitle>
        <DeferredChart style={{ height: Math.max(200, rows.length * 50) }}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows.map(r => ({ nome: r.nome, 'P1': r.p1.tavoli, 'P2': r.p2.tavoli }))} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: 'hsl(0 0% 70%)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [Number(v).toFixed(1), name]} />
            <Bar dataKey="P1" fill="#60a5fa" radius={[0, 4, 4, 0]} maxBarSize={14} />
            <Bar dataKey="P2" fill="#4ade80" radius={[0, 4, 4, 0]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer></DeferredChart>
      </Div>
    </Div>
  );
}

// ── Same Promoter Periods ──
function SamePromoterPeriodsReport({ promoters, attendances, events, config }) {
  const promoter = promoters.find(p => p.id === config.promoterId);
  const comparison = useMemo(() => {
    if (!promoter) return null;
    return computePeriodComparison(promoter, attendances, events, config.period1, config.period2);
  }, [promoter, attendances, events, config]);

  if (!comparison) return null;
  const { period1, period2, deltaFat, deltaTav, deltaSerate, pctFat, pctTav } = comparison;

  return (
    <Div className="space-y-5">
      {/* KPI confronto */}
      <Div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <P className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1">Periodo 1</P>
          <P className="text-[10px] text-muted-foreground mb-3">{period1.label}</P>
          <Div className="space-y-1.5 text-xs">
            <Div className="flex justify-between"><Span className="text-muted-foreground">Fatturato</Span><Span className="font-semibold">{fmt(period1.fatturato)}</Span></Div>
            <Div className="flex justify-between"><Span className="text-muted-foreground">Tavoli</Span><Span className="font-semibold">{period1.tavoli}</Span></Div>
            <Div className="flex justify-between"><Span className="text-muted-foreground">Serate</Span><Span className="font-semibold">{period1.serate}</Span></Div>
            <Div className="flex justify-between"><Span className="text-muted-foreground">Media</Span><Span className="font-semibold">{fmt(period1.media)}</Span></Div>
            <Div className="pt-1.5 mt-1.5 border-t border-blue-500/15 space-y-1">
              {DAY_TYPES.map(d => (
                <Div key={d.key} className="flex justify-between"><Span className="text-muted-foreground" style={{ color: d.color }}>Med {d.full}</Span><Span className="font-medium">{period1['ser' + d.key.charAt(0).toUpperCase() + d.key.slice(1)] > 0 ? fmt(period1['med' + d.key.charAt(0).toUpperCase() + d.key.slice(1)]) : '—'}</Span></Div>
              ))}
            </Div>
          </Div>
        </Div>
        <Div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <P className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">Periodo 2</P>
          <P className="text-[10px] text-muted-foreground mb-3">{period2.label}</P>
          <Div className="space-y-1.5 text-xs">
            <Div className="flex justify-between"><Span className="text-muted-foreground">Fatturato</Span><Span className="font-semibold">{fmt(period2.fatturato)}</Span></Div>
            <Div className="flex justify-between"><Span className="text-muted-foreground">Tavoli</Span><Span className="font-semibold">{period2.tavoli}</Span></Div>
            <Div className="flex justify-between"><Span className="text-muted-foreground">Serate</Span><Span className="font-semibold">{period2.serate}</Span></Div>
            <Div className="flex justify-between"><Span className="text-muted-foreground">Media</Span><Span className="font-semibold">{fmt(period2.media)}</Span></Div>
            <Div className="pt-1.5 mt-1.5 border-t border-emerald-500/15 space-y-1">
              {DAY_TYPES.map(d => (
                <Div key={d.key} className="flex justify-between"><Span className="text-muted-foreground" style={{ color: d.color }}>Med {d.full}</Span><Span className="font-medium">{period2['ser' + d.key.charAt(0).toUpperCase() + d.key.slice(1)] > 0 ? fmt(period2['med' + d.key.charAt(0).toUpperCase() + d.key.slice(1)]) : '—'}</Span></Div>
              ))}
            </Div>
          </Div>
        </Div>
        <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
          <P className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-1">Delta (P2 vs P1)</P>
          <P className="text-[10px] text-muted-foreground mb-3">Differenza tra periodi</P>
          <Div className="space-y-1.5 text-xs">
            <Div className="flex justify-between items-center"><Span className="text-muted-foreground">Fatturato</Span><Div className="flex items-center gap-2"><Span className="font-semibold">{deltaFat >= 0 ? '+' : ''}{fmt(deltaFat)}</Span><DeltaBadge value={pctFat} suffix="%" /></Div></Div>
            <Div className="flex justify-between items-center"><Span className="text-muted-foreground">Tavoli</Span><Div className="flex items-center gap-2"><Span className="font-semibold">{deltaTav >= 0 ? '+' : ''}{deltaTav}</Span><DeltaBadge value={pctTav} suffix="%" /></Div></Div>
            <Div className="flex justify-between items-center"><Span className="text-muted-foreground">Serate</Span><DeltaBadge value={deltaSerate} /></Div>
            <Div className="pt-1.5 mt-1.5 border-t border-border space-y-1">
              {DAY_TYPES.map(d => { const dm = (period2['med' + d.key.charAt(0).toUpperCase() + d.key.slice(1)] || 0) - (period1['med' + d.key.charAt(0).toUpperCase() + d.key.slice(1)] || 0); return (<Div key={d.key} className="flex justify-between items-center"><Span style={{ color: d.color }}>Δ Med {d.full}</Span><DeltaBadge value={dm} /></Div>); })}
            </Div>
          </Div>
        </Div>
      </Div>

      {/* Andamento mensile comparativo */}
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Andamento Mensile — Periodo 1</SectionTitle>
        {comparison.monthly1.length > 0 ? (
          <DeferredChart style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparison.monthly1} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
              <XAxis dataKey="mese" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickFormatter={fmt} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v), 'Fatturato']} />
              <Bar dataKey="fatturato" fill="#60a5fa" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer></DeferredChart>
        ) : <P className="text-xs text-muted-foreground text-center py-8">Nessun dato per il periodo 1</P>}
      </Div>
      <Div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <SectionTitle>Andamento Mensile — Periodo 2</SectionTitle>
        {comparison.monthly2.length > 0 ? (
          <DeferredChart style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparison.monthly2} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 18%)" />
              <XAxis dataKey="mese" tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(240 5% 45%)', fontSize: 10 }} tickFormatter={fmt} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v), 'Fatturato']} />
              <Bar dataKey="fatturato" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer></DeferredChart>
        ) : <P className="text-xs text-muted-foreground text-center py-8">Nessun dato per il periodo 2</P>}
      </Div>
    </Div>
  );
}

export default function ReportPreview({ promoters, attendances, events, config, onPrint }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const typeLabel = {
    vibra_group: 'Report Gruppo Vibra',
    promoter_compare: 'Confronto Promoter',
    same_promoter_periods: 'Stesso Promoter — Periodi Diversi',
    event_compare: 'Confronto Serate',
  }[config.reportType];

  const subtitle = (() => {
    if (config.reportType === 'vibra_group')
      return periodLabel(config);
    if (config.reportType === 'promoter_compare')
      return config.promoterCompareDual
        ? `${monthRangeLabel(config.period1Months || {})} vs ${monthRangeLabel(config.period2Months || {})}`
        : periodLabel(config);
    if (config.reportType === 'same_promoter_periods')
      return config.promoterId ? promoters.find(p => p.id === config.promoterId)?.name : '';
    if (config.reportType === 'event_compare')
      return `${config.selectedEventIds.length} serate selezionate`;
    return '';
  })();

  const handlePDF = async () => {
    setPdfLoading(true);
    await new Promise(r => setTimeout(r, 100));
    try {
      exportReportPDF(promoters, attendances, events, config);
    } catch (e) {
      console.error('PDF export error:', e);
    }
    setPdfLoading(false);
  };

  return (
    <Div className="report-preview rounded-2xl border border-white/[0.06] bg-background p-4 sm:p-5 space-y-5">
      <ReportHeader title={typeLabel} subtitle={subtitle} onPrint={onPrint} onPDF={handlePDF} pdfLoading={pdfLoading} />
      {config.reportType === 'vibra_group' && <VibraGroupReport promoters={promoters} attendances={attendances} events={events} config={config} />}
      {config.reportType === 'promoter_compare' && !config.promoterCompareDual && <PromoterCompareReport promoters={promoters} attendances={attendances} events={events} config={config} />}
      {config.reportType === 'promoter_compare' && config.promoterCompareDual && <PromoterCompareDualReport promoters={promoters} attendances={attendances} events={events} config={config} />}
      {config.reportType === 'same_promoter_periods' && <SamePromoterPeriodsReport promoters={promoters} attendances={attendances} events={events} config={config} />}
      {config.reportType === 'event_compare' && <EventCompareReport promoters={promoters} events={events} attendances={attendances} config={config} />}
    </Div>
  );
}