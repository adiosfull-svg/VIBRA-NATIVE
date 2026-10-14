// Port di src/components/admin/CreditUsageDashboard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Button } from '@/ui/button';
import { RefreshCw, Trash2, Zap, TrendingDown, Info } from '@/ui/icons.generated';
import { format, parseISO, subDays } from 'date-fns';
import { it } from 'date-fns/locale';

import { Btn, Div, H, P, Span } from '@/ui/html';

const FEATURE_LABELS = {
  sync_ig_ai: 'AI DM Instagram',
  ai_suggestions: 'Analisi Intelligente',
  ai_summary: 'Sintesi AI / Import Batch',
  vibra_gpt: 'VibraGPT (Consulente Strategico)',
  vibra_gpt_title: 'VibraGPT (Titolo Chat)',
};

// Base44 memorizza created_date in UTC ma senza l'indicatore di fuso (nessuna
// 'Z' finale). parseISO lo interpreterebbe come ora locale, causando uno sfasamento
// di 1-2 ore (offset CEST/CET). Aggiungiamo 'Z' quando manca per forzare la
// conversione UTC → ora locale corretta al display.
const parseUTC = (dateStr) => {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(dateStr)) {
    return parseISO(dateStr + 'Z');
  }
  return parseISO(dateStr);
};

// Estrae il numero di conversazioni dal campo detail (es. "3 conversazioni analizzate")
const parseConvCount = (detail) => {
  if (!detail) return 0;
  const m = String(detail).match(/(\d+)\s+conversazioni/i);
  return m ? parseInt(m[1], 10) : 0;
};

const FEATURE_COLORS = {
  sync_ig_ai: '#ec4899',
  ai_suggestions: '#a78bfa',
  ai_summary: '#60a5fa',
  vibra_gpt: '#fbbf24',
  vibra_gpt_title: '#f59e0b',
};

const RANGES = [
  { days: 7, label: '7g' },
  { days: 30, label: '30g' },
  { days: 90, label: '90g' },
];

export default function CreditUsageDashboard() {
  const qc = useQueryClient();
  const [range, setRange] = useState(7);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['credit-usage-logs'],
    queryFn: () => base44.entities.CreditUsageLog.list('-created_date', 5000),
    staleTime: 30000,
  });

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 10 * 60000,
  });

  const promoterMap = Object.fromEntries(promoters.map(p => [p.id, p.name]));

  const clearMut = useMutation({
    mutationFn: async () => {
      await base44.entities.CreditUsageLog.deleteMany({});
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['credit-usage-logs'] }),
  });

  const filtered = useMemo(() => {
    const cutoff = subDays(new Date(), range);
    return logs.filter(l => parseUTC(l.created_date) >= cutoff);
  }, [logs, range]);

  const byPromoter = useMemo(() => {
    const map = {};
    filtered.forEach(l => {
      const name = l.promoter_name || promoterMap[l.promoter_id] || 'Sconosciuto';
      const key = l.promoter_id || 'unknown';
      if (!map[key]) map[key] = { name, credits: 0, calls: 0 };
      map[key].credits += l.credits || 1;
      map[key].calls += 1;
    });
    return Object.values(map).sort((a, b) => b.credits - a.credits);
  }, [filtered, promoterMap]);

  const byFeature = useMemo(() => {
    const map = {};
    filtered.forEach(l => {
      const key = l.feature || 'other';
      if (!map[key]) map[key] = { feature: key, credits: 0, calls: 0 };
      map[key].credits += l.credits || 1;
      map[key].calls += 1;
    });
    return Object.values(map).sort((a, b) => b.credits - a.credits);
  }, [filtered]);

  const totalCredits = filtered.reduce((s, l) => s + (l.credits || 1), 0);
  const totalCalls = filtered.length;
  const maxCredits = Math.max(...byPromoter.map(p => p.credits), 1);
  const maxFeatureCredits = Math.max(...byFeature.map(f => f.credits), 1);
  const recentLogs = filtered.slice(0, 20);

  // Riepilogo estrazioni DM Instagram per ora di esecuzione: raggruppa i log
  // sync_ig_ai per bucket orario, sommando le conversazioni estratte in ogni ora.
  const igHourly = useMemo(() => {
    const igLogs = filtered.filter(l => l.feature === 'sync_ig_ai');
    const map = {};
    igLogs.forEach(l => {
      const d = parseUTC(l.created_date);
      const key = format(d, "yyyy-MM-dd'T'HH");
      if (!map[key]) map[key] = { key, date: d, conversations: 0, calls: 0, credits: 0 };
      map[key].conversations += parseConvCount(l.detail);
      map[key].calls += 1;
      map[key].credits += l.credits || 5;
    });
    return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
  }, [filtered]);

  return (
    <Div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header con totali */}
      <Div className="px-5 py-4 border-b border-border bg-gradient-to-br from-primary/10 to-transparent">
        <Div className="flex flex-wrap items-start justify-between gap-4">
          <Div className="flex items-center gap-3">
            <Div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </Div>
            <Div>
              <H className="text-base font-semibold">Consumo Integration Credits</H>
              <Div className="flex items-baseline gap-2 mt-0.5">
                <Span className="text-2xl font-bold tabular-nums">{totalCredits}</Span>
                <Span className="text-sm text-muted-foreground">crediti</Span>
                <Span className="text-muted-foreground/40">·</Span>
                <Span className="text-sm font-semibold tabular-nums">{totalCalls}</Span>
                <Span className="text-sm text-muted-foreground">chiamate</Span>
              </Div>
            </Div>
          </Div>
          <Div className="flex items-center gap-2">
            <Div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/40 border border-border">
              {RANGES.map(r => (
                <Btn
                  button
                  key={r.days}
                  onClick={() => setRange(r.days)}
                  className={`text-xs font-medium px-3 py-1 rounded-md transition-all ${
                    range === r.days
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}>{r.label}</Btn>
              ))}
            </Div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => qc.invalidateQueries({ queryKey: ['credit-usage-logs'] })}>
              <RefreshCw className="w-3.5 h-3.5" /> Aggiorna
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-destructive hover:text-destructive" onClick={() => { if (confirm('Svuotare tutti i log di consumo?')) clearMut.mutate(); }} disabled={logs.length === 0}>
              <Trash2 className="w-3.5 h-3.5" /> Svuota
            </Button>
          </Div>
        </Div>
        <Div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground/70">
          <Info className="w-3 h-3 shrink-0" />
          <Span>Stima basata sui log dell'app (1 credito = automatic, 5 = gemini_3_flash, 15 = claude_sonnet). Il consumo reale della piattaforma può essere superiore per chiamate agent e tool use.</Span>
        </Div>
      </Div>

      {isLoading ? (
        <Div className="flex items-center justify-center py-16">
          <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </Div>
      ) : totalCalls === 0 ? (
        <Div className="text-center py-16 text-muted-foreground text-sm">
          <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <P className="font-medium">Nessun consumo registrato</P>
          <P className="text-xs mt-1">I log vengono creati automaticamente quando le funzioni AI vengono eseguite.</P>
        </Div>
      ) : (
        <Div className="p-5 space-y-6">
          <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Per-promoter breakdown */}
            <Div>
              <H className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5" /> Per Promoter
              </H>
              <Div className="space-y-2.5">
                {byPromoter.map((p, i) => (
                  <Div key={i}>
                    <Div className="flex items-center justify-between mb-1">
                      <Span className="text-sm font-medium truncate">{p.name}</Span>
                      <Span className="text-xs text-muted-foreground tabular-nums shrink-0 ml-2">
                        <Span className="font-semibold text-foreground">{p.credits}</Span> crediti · {p.calls} chiamate
                      </Span>
                    </Div>
                    <Div className="h-2.5 rounded-full bg-secondary/40 overflow-hidden">
                      <Div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(p.credits / maxCredits) * 100}%`,
                          background: 'linear-gradient(90deg, hsl(271 69% 45%), hsl(271 69% 60%))',
                        }}
                      />
                    </Div>
                  </Div>
                ))}
              </Div>
            </Div>

            {/* Per-feature breakdown */}
            <Div>
              <H className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Per Funzione</H>
              <Div className="space-y-2">
                {byFeature.map(f => (
                  <Div key={f.feature} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/20 border border-border/50">
                    <Span className="w-3 h-3 rounded-full shrink-0 ring-2 ring-background" style={{ background: FEATURE_COLORS[f.feature] || '#888' }} />
                    <Span className="text-sm font-medium flex-1 truncate">{FEATURE_LABELS[f.feature] || f.feature}</Span>
                    <Div className="flex items-center gap-2 shrink-0">
                      <Div className="w-20 h-1.5 rounded-full bg-secondary/40 overflow-hidden">
                        <Div className="h-full rounded-full" style={{ width: `${(f.credits / maxFeatureCredits) * 100}%`, background: FEATURE_COLORS[f.feature] || '#888' }} />
                      </Div>
                      <Span className="text-xs tabular-nums w-28 text-right">
                        <Span className="font-semibold text-foreground">{f.credits}</Span> crediti · {f.calls} chiamate
                      </Span>
                    </Div>
                  </Div>
                ))}
              </Div>
            </Div>
          </Div>

          {/* Estrazioni DM Instagram per ora */}
          {igHourly.length > 0 && (
            <Div>
              <H className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Span className="w-2.5 h-2.5 rounded-full" style={{ background: FEATURE_COLORS.sync_ig_ai }} />
                Estrazioni DM Instagram (per ora)
              </H>
              <Div className="rounded-lg border border-border/50 overflow-hidden">
                <Div className="max-h-72 overflow-y-auto client-table-scrollbar">
                  {igHourly.map((h, i) => (
                    <Div key={h.key} className={`flex items-center gap-3 px-3 py-2 text-xs ${i !== igHourly.length - 1 ? 'border-b border-border/30' : ''} hover:bg-secondary/20 transition-colors`}>
                      <Span className="text-muted-foreground shrink-0 tabular-nums w-28">{format(h.date, "dd MMM HH:mm", { locale: it })}</Span>
                      <Span className="font-semibold text-foreground tabular-nums">{h.conversations}</Span>
                      <Span className="text-muted-foreground shrink-0">{h.conversations === 1 ? 'conversazione' : 'conversazioni'}</Span>
                      <Span className="text-muted-foreground/60 shrink-0 tabular-nums ml-auto">{h.calls} chiamate · {h.credits} crediti</Span>
                    </Div>
                  ))}
                </Div>
              </Div>
            </Div>
          )}

          {/* Recent activity */}
          <Div>
            <H className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Attività Recente</H>
            <Div className="rounded-lg border border-border/50 overflow-hidden">
              <Div className="max-h-72 overflow-y-auto client-table-scrollbar">
                {recentLogs.map((log, i) => (
                  <Div key={log.id} className={`flex items-center gap-3 px-3 py-2 text-xs ${i !== recentLogs.length - 1 ? 'border-b border-border/30' : ''} hover:bg-secondary/20 transition-colors`}>
                    <Span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: FEATURE_COLORS[log.feature] || '#888' }} />
                    <Span className="font-medium shrink-0 w-32 truncate">{log.promoter_name || promoterMap[log.promoter_id] || '—'}</Span>
                    <Span className="text-muted-foreground shrink-0">{FEATURE_LABELS[log.feature] || log.feature}</Span>
                    {log.detail && <Span className="text-muted-foreground/60 truncate flex-1">{log.detail}</Span>}
                    <Span className="text-muted-foreground/60 shrink-0 tabular-nums ml-auto">{format(parseUTC(log.created_date), "dd MMM HH:mm", { locale: it })}</Span>
                  </Div>
                ))}
              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}