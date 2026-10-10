// Port di src/components/report/ReportBuilder.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, Search, Users, Calendar, GitCompare, PartyPopper } from '@/ui/icons.generated';
import { REPORT_TYPES, REPORT_SECTIONS, filterEventsByPeriod } from '@/legacy/utils/reportData';
import { MonthSelect, YearSelect } from '@/web/components/shared/MonthYearPicker';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, HtmlOption, HtmlSelect } from '@/ui/elements';

const TYPE_ICONS = {
  vibra_group: Users,
  promoter_compare: GitCompare,
  same_promoter_periods: Calendar,
  event_compare: PartyPopper,
};

function DateInput({ label, value, onChange }) {
  return (
    <Div className="flex items-center gap-1.5">
      <Span className="text-[10px] text-muted-foreground shrink-0">{label}</Span>
      <HtmlInput
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 min-w-0 h-8 px-2 rounded-lg border border-input bg-secondary/30 text-xs text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
        style={{ colorScheme: 'dark' }}
      />
    </Div>
  );
}

function PromoterMultiSelect({ promoters, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const active = promoters.filter(p => p.status === 'attivo');
  const filtered = active.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  return (
    <Div className="relative">
      <Btn
        button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-input bg-secondary/30 text-xs hover:border-primary/40 transition-colors">
        <Span className={selected.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
          {selected.length > 0 ? `${selected.length} promoter selezionati` : 'Seleziona promoter...'}
        </Span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </Btn>
      {open && (
        <>
          <Btn className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <Div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl">
            <Div className="sticky top-0 p-2 bg-popover border-b border-border">
              <Div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <HtmlInput
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cerca..."
                  className="w-full pl-7 pr-2 py-1.5 rounded bg-secondary/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </Div>
            </Div>
            <Div className="p-1">
              <Btn
                button
                onClick={() => onChange(active.map(p => p.id))}
                className="w-full text-left px-2 py-1.5 rounded text-[11px] text-primary hover:bg-primary/10 transition-colors">
                Seleziona tutti ({active.length})
              </Btn>
              <Btn
                button
                onClick={() => onChange([])}
                className="w-full text-left px-2 py-1.5 rounded text-[11px] text-muted-foreground hover:bg-secondary/50 transition-colors">
                Deseleziona tutti
              </Btn>
              <Div className="h-px bg-border my-1" />
              {filtered.map(p => (
                <Btn
                  button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-secondary/50 transition-colors text-left">
                  <Div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                    selected.includes(p.id) ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {selected.includes(p.id) && <Check className="w-2.5 h-2.5 text-white" />}
                  </Div>
                  <Span className="truncate">{p.name}</Span>
                </Btn>
              ))}
            </Div>
          </Div>
        </>
      )}
    </Div>
  );
}

function EventMultiSelect({ events, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const sorted = [...events].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const filtered = sorted.filter(e => !search ||
    (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.venue || '').toLowerCase().includes(search.toLowerCase()));

  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  return (
    <Div className="relative">
      <Btn
        button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-input bg-secondary/30 text-xs hover:border-primary/40 transition-colors">
        <Span className={selected.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
          {selected.length > 0 ? `${selected.length} serate selezionate` : 'Seleziona serate...'}
        </Span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </Btn>
      {open && (
        <>
          <Btn className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <Div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border border-border bg-popover shadow-xl">
            <Div className="sticky top-0 p-2 bg-popover border-b border-border">
              <Div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <HtmlInput
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cerca serata o locale..."
                  className="w-full pl-7 pr-2 py-1.5 rounded bg-secondary/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </Div>
            </Div>
            <Div className="p-1">
              <Btn
                button
                onClick={() => onChange(sorted.map(e => e.id))}
                className="w-full text-left px-2 py-1.5 rounded text-[11px] text-primary hover:bg-primary/10 transition-colors">
                Seleziona tutte ({sorted.length})
              </Btn>
              <Btn
                button
                onClick={() => onChange([])}
                className="w-full text-left px-2 py-1.5 rounded text-[11px] text-muted-foreground hover:bg-secondary/50 transition-colors">
                Deseleziona tutte
              </Btn>
              <Div className="h-px bg-border my-1" />
              {filtered.map(e => (
                <Btn
                  button
                  key={e.id}
                  onClick={() => toggle(e.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-secondary/50 transition-colors text-left">
                  <Div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                    selected.includes(e.id) ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {selected.includes(e.id) && <Check className="w-2.5 h-2.5 text-white" />}
                  </Div>
                  <Span className="truncate flex-1">{e.name || '-'}</Span>
                  <Span className="text-[10px] text-muted-foreground shrink-0">
                    {e.date ? format(parseISO(e.date), 'd MMM yy', { locale: it }) : '-'}
                  </Span>
                </Btn>
              ))}
            </Div>
          </Div>
        </>
      )}
    </Div>
  );
}

export default function ReportBuilder({ promoters, events, config, onChange, onGenerate }) {
  const update = (patch) => onChange({ ...config, ...patch });

  const filteredCount = useMemo(() => filterEventsByPeriod(events, config.from, config.to).length, [events, config.from, config.to]);

  const canGenerate = (() => {
    if (config.reportType === 'vibra_group') return true;
    if (config.reportType === 'promoter_compare') return config.selectedPromoterIds.length >= 2;
    if (config.reportType === 'same_promoter_periods') return !!config.promoterId;
    if (config.reportType === 'event_compare') return config.selectedEventIds.length >= 2;
    return false;
  })();

  const toggleSection = (key) => update({
    sections: { ...config.sections, [key]: !config.sections[key] }
  });

  return (
    <Div className="report-builder relative rounded-2xl border border-white/[0.06] bg-card p-4 sm:p-5 space-y-4">
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
        style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />

      {/* Header */}
      <Div className="flex items-center gap-2">
        <Div className="p-1.5 rounded-lg bg-purple-500/15">
          <GitCompare className="w-4 h-4 text-purple-400" />
        </Div>
        <Div>
          <P className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Costruttore Report</P>
          <P className="text-[10px] text-muted-foreground mt-0.5">Configura cosa confrontare, genera e stampa</P>
        </Div>
      </Div>

      {/* Tipo report */}
      <Div className="space-y-2">
        <Span className="text-[11px] font-medium text-muted-foreground">Tipo di confronto:</Span>
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REPORT_TYPES.map(({ key, label, desc }) => {
            const Icon = TYPE_ICONS[key] || Users;
            const isActive = config.reportType === key;
            return (
              <Btn
                button
                key={key}
                onClick={() => update({ reportType: key })}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                  isActive ? 'border-primary/50 bg-primary/10' : 'border-border hover:border-primary/25'
                }`}>
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <Div>
                  <P className={`text-xs font-semibold ${isActive ? 'text-primary' : ''}`}>{label}</P>
                  <P className="text-[10px] text-muted-foreground mt-0.5">{desc}</P>
                </Div>
              </Btn>
            );
          })}
        </Div>
      </Div>

      {/* Configurazione dinamica per tipo */}
      {config.reportType === 'vibra_group' && (
        <Div className="p-3 rounded-xl bg-secondary/20 border border-border space-y-2">
          <Span className="text-[11px] font-medium text-muted-foreground">Periodo:</Span>
          <Div className="flex flex-wrap items-center gap-2">
            <DateInput label="Da" value={config.from} onChange={v => update({ from: v })} />
            <DateInput label="A" value={config.to} onChange={v => update({ to: v })} />
            {(config.from || config.to) && (
              <Btn
                button
                onClick={() => update({ from: '', to: '' })}
                className="text-[10px] text-destructive hover:bg-destructive/10 px-1.5 py-1 rounded shrink-0">✕ Reset</Btn>
            )}
          </Div>
          <Span className="text-[10px] text-muted-foreground">
            {(config.from || config.to) ? `${filteredCount} serate nel periodo` : `${events.length} serate totali`}
          </Span>
        </Div>
      )}

      {config.reportType === 'promoter_compare' && (
        <Div className="p-3 rounded-xl bg-secondary/20 border border-border space-y-2.5">
          <Div className="space-y-2">
            <Span className="text-[11px] font-medium text-muted-foreground">Promoter da confrontare:</Span>
            <PromoterMultiSelect promoters={promoters} selected={config.selectedPromoterIds} onChange={ids => update({ selectedPromoterIds: ids })} />
          </Div>

          {/* Toggle: singolo periodo vs due periodi */}
          <Div className="flex items-center gap-2">
            <Btn
              button
              onClick={() => update({ promoterCompareDual: false })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${!config.promoterCompareDual ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              Singolo periodo
            </Btn>
            <Btn
              button
              onClick={() => update({ promoterCompareDual: true })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${config.promoterCompareDual ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              Confronta due periodi
            </Btn>
          </Div>

          {!config.promoterCompareDual ? (
            <Div className="space-y-2">
              <Span className="text-[11px] font-medium text-muted-foreground">Periodo:</Span>
              <Div className="flex flex-wrap items-center gap-2">
                <DateInput label="Da" value={config.from} onChange={v => update({ from: v })} />
                <DateInput label="A" value={config.to} onChange={v => update({ to: v })} />
                {(config.from || config.to) && (
                  <Btn
                    button
                    onClick={() => update({ from: '', to: '' })}
                    className="text-[10px] text-destructive hover:bg-destructive/10 px-1.5 py-1 rounded shrink-0">✕ Reset</Btn>
                )}
              </Div>
              <Span className="text-[10px] text-muted-foreground">
                {(config.from || config.to) ? `${filteredCount} serate nel periodo` : `${events.length} serate totali`}
              </Span>
            </Div>
          ) : (() => {
            const p1 = config.period1Months || { fromMonth: 0, fromYear: 2024, toMonth: 5, toYear: 2024 };
            const p2 = config.period2Months || { fromMonth: 6, fromYear: 2024, toMonth: 11, toYear: 2024 };
            return (
              <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Div className="space-y-1.5 p-2.5 rounded-lg bg-secondary/30 border border-border">
                  <Span className="text-[10px] font-semibold text-blue-400">Periodo 1</Span>
                  <Div className="flex items-center gap-1 flex-wrap">
                    <Span className="text-[10px] text-muted-foreground">Da</Span>
                    <MonthSelect value={p1.fromMonth} onChange={v => update({ period1Months: { ...p1, fromMonth: v } })} />
                    <YearSelect value={p1.fromYear} onChange={v => update({ period1Months: { ...p1, fromYear: v } })} />
                  </Div>
                  <Div className="flex items-center gap-1 flex-wrap">
                    <Span className="text-[10px] text-muted-foreground">A</Span>
                    <MonthSelect value={p1.toMonth} onChange={v => update({ period1Months: { ...p1, toMonth: v } })} />
                    <YearSelect value={p1.toYear} onChange={v => update({ period1Months: { ...p1, toYear: v } })} />
                  </Div>
                </Div>
                <Div className="space-y-1.5 p-2.5 rounded-lg bg-secondary/30 border border-border">
                  <Span className="text-[10px] font-semibold text-emerald-400">Periodo 2</Span>
                  <Div className="flex items-center gap-1 flex-wrap">
                    <Span className="text-[10px] text-muted-foreground">Da</Span>
                    <MonthSelect value={p2.fromMonth} onChange={v => update({ period2Months: { ...p2, fromMonth: v } })} />
                    <YearSelect value={p2.fromYear} onChange={v => update({ period2Months: { ...p2, fromYear: v } })} />
                  </Div>
                  <Div className="flex items-center gap-1 flex-wrap">
                    <Span className="text-[10px] text-muted-foreground">A</Span>
                    <MonthSelect value={p2.toMonth} onChange={v => update({ period2Months: { ...p2, toMonth: v } })} />
                    <YearSelect value={p2.toYear} onChange={v => update({ period2Months: { ...p2, toYear: v } })} />
                  </Div>
                </Div>
              </Div>
            );
          })()}
        </Div>
      )}

      {config.reportType === 'same_promoter_periods' && (
        <Div className="p-3 rounded-xl bg-secondary/20 border border-border space-y-3">
          <Div className="space-y-2">
            <Span className="text-[11px] font-medium text-muted-foreground">Promoter:</Span>
            <HtmlSelect
              value={config.promoterId}
              onChange={e => update({ promoterId: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-input bg-secondary/30 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <HtmlOption value="">Seleziona promoter...</HtmlOption>
              {promoters.filter(p => p.status === 'attivo').map(p => (
                <HtmlOption key={p.id} value={p.id}>{p.name}</HtmlOption>
              ))}
            </HtmlSelect>
          </Div>
          <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Div className="space-y-1.5 p-2.5 rounded-lg bg-secondary/30 border border-border">
              <Span className="text-[10px] font-semibold text-blue-400">Periodo 1</Span>
              <DateInput label="Da" value={config.period1.from} onChange={v => update({ period1: { ...config.period1, from: v } })} />
              <DateInput label="A" value={config.period1.to} onChange={v => update({ period1: { ...config.period1, to: v } })} />
            </Div>
            <Div className="space-y-1.5 p-2.5 rounded-lg bg-secondary/30 border border-border">
              <Span className="text-[10px] font-semibold text-emerald-400">Periodo 2</Span>
              <DateInput label="Da" value={config.period2.from} onChange={v => update({ period2: { ...config.period2, from: v } })} />
              <DateInput label="A" value={config.period2.to} onChange={v => update({ period2: { ...config.period2, to: v } })} />
            </Div>
          </Div>
        </Div>
      )}

      {config.reportType === 'event_compare' && (
        <Div className="p-3 rounded-xl bg-secondary/20 border border-border space-y-2">
          <Span className="text-[11px] font-medium text-muted-foreground">Serate da confrontare:</Span>
          <EventMultiSelect events={events} selected={config.selectedEventIds} onChange={ids => update({ selectedEventIds: ids })} />
        </Div>
      )}

      {/* Sezioni (solo per vibra_group) */}
      {config.reportType === 'vibra_group' && (
        <Div className="space-y-2">
          <Span className="text-[11px] font-medium text-muted-foreground">Sezioni da includere:</Span>
          <Div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {REPORT_SECTIONS.map(({ key, label, desc }) => (
              <Btn
                button
                key={key}
                onClick={() => toggleSection(key)}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                  config.sections[key] ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/20'
                }`}>
                <Div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  config.sections[key] ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`}>
                  {config.sections[key] && <Check className="w-2.5 h-2.5 text-white" />}
                </Div>
                <Div>
                  <P className="text-xs font-semibold">{label}</P>
                  <P className="text-[10px] text-muted-foreground mt-0.5">{desc}</P>
                </Div>
              </Btn>
            ))}
          </Div>
        </Div>
      )}

      {/* Bottone genera */}
      <Btn
        button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        <GitCompare className="w-4 h-4" />
        Genera Report
      </Btn>
      {!canGenerate && (
        <P className="text-[10px] text-muted-foreground text-center -mt-2">
          {config.reportType === 'promoter_compare' && 'Seleziona almeno 2 promoter'}
          {config.reportType === 'same_promoter_periods' && 'Seleziona un promoter'}
          {config.reportType === 'event_compare' && 'Seleziona almeno 2 serate'}
        </P>
      )}
    </Div>
  );
}