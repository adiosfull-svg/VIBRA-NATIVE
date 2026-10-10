// Port di src/components/ai/AIResultRenderer.jsx (convertito da scripts/port/codemod.mjs).
// Markdown: react-markdown → ui/markdown.tsx (stesso aspetto: preflight + varianti [&>p]:...).
import React from 'react';
import ReactMarkdown from '@/ui/markdown';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from '@/ui/recharts';
import DeferredChart from '@/web/components/shared/DeferredChart';

import { Div, H, P, Span } from '@/ui/html';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const COLORS = ['#8b5cf6', '#ec4899', '#0ea5e9', '#f97316', '#14b8a6', '#ef4444', '#eab308', '#22c55e', '#a855f7', '#6366f1'];

const tooltipStyle = {
  background: 'hsl(240, 6%, 12%)',
  border: '1px solid hsl(240, 5%, 25%)',
  borderRadius: '8px',
  fontSize: 12,
  color: 'hsl(0, 0%, 95%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
};

const tooltipItemStyle = { color: 'hsl(0, 0%, 90%)' };
const tooltipLabelStyle = { color: 'hsl(0, 0%, 100%)', fontWeight: 600, marginBottom: 2 };

function fmtValue(v, unit) {
  if (unit === '€') return `€${Number(v).toLocaleString('it-IT')}`;
  return Number(v).toLocaleString('it-IT');
}

function SummaryBadge({ summary }) {
  if (!summary) return null;
  return (
    <Div className="flex items-start gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
      <Span className="text-primary text-base shrink-0">💡</Span>
      <P className="text-sm text-foreground/90 leading-relaxed">{summary}</P>
    </Div>
  );
}

function BarHorizontalChart({ data, unit, title }) {
  if (!data?.length) return null;
  const sorted = [...data].sort((a, b) => (b.value || 0) - (a.value || 0));
  const top = sorted.slice(0, 15);
  const maxVal = Math.max(...top.map(d => d.value || 0));

  return (
    <Div className="rounded-xl bg-card border border-border p-5">
      {title && <H className="font-semibold text-sm mb-5">{title}</H>}
      <Div className="space-y-3">
        {top.map((item, i) => {
          const pct = maxVal > 0 ? ((item.value || 0) / maxVal) * 100 : 0;
          const color = COLORS[i % COLORS.length];
          return (
            <Div key={i} className="space-y-1">
              <Div className="flex items-center justify-between text-xs">
                <Div className="flex items-center gap-2">
                  <Span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ background: color + '33', color }}>
                    {i + 1}
                  </Span>
                  <Span className="font-medium text-foreground">{item.name}</Span>
                  {item.extra && <Span className="text-muted-foreground">· {item.extra}</Span>}
                </Div>
                <Span className="font-bold ml-3 shrink-0" style={{ color }}>{fmtValue(item.value, unit)}</Span>
              </Div>
              <Div className="h-2 rounded-full bg-secondary/40 overflow-hidden">
                <Div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </Div>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}

function BarVerticalChart({ data, unit, title }) {
  if (!data?.length) return null;
  return (
    <Div className="rounded-xl bg-card border border-border p-5">
      {title && <H className="font-semibold text-sm mb-4">{title}</H>}
      <DeferredChart className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 10, top: 5 }}>
            <XAxis dataKey="name" tick={{ fill: 'hsl(240, 5%, 65%)', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(240, 5%, 65%)', fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => unit === '€' ? (v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`) : v} />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={v => [fmtValue(v, unit), '']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </DeferredChart>
    </Div>
  );
}

function LineChartBlock({ data, lines, unit, title }) {
  if (!data?.length) return null;
  const seriesKeys = lines?.length ? lines : Object.keys(data[0] || {}).filter(k => k !== 'name');
  return (
    <Div className="rounded-xl bg-card border border-border p-5">
      {title && <H className="font-semibold text-sm mb-4">{title}</H>}
      <DeferredChart className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 0, right: 10, top: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 5%, 18%)" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(240, 5%, 65%)', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(240, 5%, 65%)', fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => unit === '€' ? (v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`) : v} />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              labelStyle={tooltipLabelStyle}
              formatter={v => [fmtValue(v, unit), '']}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: 'hsl(240, 5%, 70%)' }} />
            {seriesKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} dot={false} strokeWidth={2.5} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </DeferredChart>
    </Div>
  );
}

function TableBlock({ data, columns, title, summary }) {
  if (!data?.length || !columns?.length) return null;
  return (
    <Div className="rounded-xl bg-card border border-border overflow-hidden">
      {title && (
        <Div className="px-5 py-3 border-b border-border bg-secondary/30">
          <H className="font-semibold text-sm">{title}</H>
        </Div>
      )}
      <Div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <Thead>
            <Tr className="border-b border-border bg-secondary/20">
              {columns.map(col => (
                <Th key={col} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">{col}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, i) => (
              <Tr key={i} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i === 0 ? 'bg-primary/5' : ''}`}>
                {columns.map(col => (
                  <Td key={col} className="px-4 py-3 text-sm">
                    {i === 0
                      ? <Span className="font-bold text-primary">{row[col]}</Span>
                      : <Span className="text-foreground">{row[col]}</Span>
                    }
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Div>
      {summary && <P className="text-xs text-muted-foreground px-5 py-3 border-t border-border">{summary}</P>}
    </Div>
  );
}

function renderSingleChart(chart, i) {
  if (!chart) return null;
  if (chart.type === 'bar_horizontal') return <BarHorizontalChart key={i} data={chart.data} unit={chart.unit} title={chart.title} />;
  if (chart.type === 'bar') return <BarVerticalChart key={i} data={chart.data} unit={chart.unit} title={chart.title} />;
  if (chart.type === 'line') return <LineChartBlock key={i} data={chart.data} lines={chart.lines} unit={chart.unit} title={chart.title} />;
  return null;
}

export default function AIResultRenderer({ result }) {
  if (!result) return null;
  const { type, title, summary, text, data, columns, lines, unit, charts } = result;

  return (
    <Div className="space-y-4">
      <SummaryBadge summary={summary} />

      {type === 'text' && (
        <Div className="rounded-xl bg-secondary/20 border border-border p-5">
          <ReactMarkdown className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed">
            {text}
          </ReactMarkdown>
        </Div>
      )}

      {type === 'bar_horizontal' && <BarHorizontalChart data={data} unit={unit} title={title} />}
      {type === 'bar' && <BarVerticalChart data={data} unit={unit} title={title} />}
      {type === 'line' && <LineChartBlock data={data} lines={lines} unit={unit} title={title} />}
      {type === 'table' && <TableBlock data={data} columns={columns} title={title} summary={summary} />}

      {type === 'multi' && charts?.length > 0 && (
        <Div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {charts.map((chart, i) => renderSingleChart(chart, i))}
        </Div>
      )}

      {text && type !== 'text' && (
        <Div className="rounded-xl bg-secondary/10 border border-border p-4">
          <ReactMarkdown className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed">
            {text}
          </ReactMarkdown>
        </Div>
      )}
    </Div>
  );
}