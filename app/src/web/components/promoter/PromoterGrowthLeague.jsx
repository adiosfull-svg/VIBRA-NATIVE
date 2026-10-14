// Port di src/components/promoter/PromoterGrowthLeague.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo } from 'react';
import { parseISO, addDays, subDays, subMonths, format, isWithinInterval } from 'date-fns';
import { it } from 'date-fns/locale';
import { Crown, TrendingUp, TrendingDown, Minus, Rocket, CalendarDays, Trophy, Activity } from '@/ui/icons.generated';
import { isVisibleInStats } from '@/legacy/utils/promoterVisibility';

import { Div, H, P, Span } from '@/ui/html';
import { Img, Table, Tbody, Td, Th, Thead, Tr } from '@/ui/elements';

const medals = ['🥇', '🥈', '🥉'];

const fmtEUR = (v) => v ? `€${Number(v).toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—';
const fmtEUR2 = (v) => v ? `€${Number(v).toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : '—';

function buildGrowthData(promoters, allAttendances, events) {
  const eventsById = new Map(events.map(e => [e.id, e]));
  const byPromoter = {};
  for (const a of allAttendances) {
    if (!a.promoter_id || a.client_id) continue;
    const ev = eventsById.get(a.event_id);
    if (!ev?.date) continue;
    let d;
    try { d = parseISO(ev.date); } catch { continue; }
    if (!byPromoter[a.promoter_id]) byPromoter[a.promoter_id] = [];
    byPromoter[a.promoter_id].push({ date: d, dateStr: ev.date, revenue: a.revenue || 0, threshold: ev.table_threshold || 300 });
  }
  Object.values(byPromoter).forEach(arr => arr.sort((a, b) => a.date - b.date));

  const now = new Date();
  // Attuale = ultimi 90 giorni effettivi a partire da oggi (rolling window)
  const currentStart = subDays(now, 90);
  const currentEnd = now;
  const lastMonthKey = format(subMonths(now, 1), 'yyyy-MM');
  const prevKeys = [2, 3, 4].map(i => format(subMonths(now, i), 'yyyy-MM'));

  // Serate organizzate totali e dell'ultimo trimestre: sono il denominatore di
  // affidabilità e costanza. Contano TUTTE le serate, incluse quelle in cui il
  // promoter non ha fatturato (0€ o assente) — così chi "salta" le serate viene
  // penalizzato, non solo chi fattura poco.
  const allEvents = events.filter(e => e.date);
  const recentEvents = allEvents.filter(e => {
    try { return isWithinInterval(parseISO(e.date), { start: currentStart, end: currentEnd }); } catch { return false; }
  });

  return promoters.map(p => {
    const atts = byPromoter[p.id] || [];
    const start = p.promoter_from ? parseISO(p.promoter_from) : null;

    const first3 = atts.slice(0, 3);
    const prime3 = first3.reduce((s, x) => s + x.revenue, 0);

    const monthly = {};
    for (const x of atts) {
      const key = x.dateStr.slice(0, 7);
      monthly[key] = (monthly[key] || 0) + x.revenue;
    }

    let primoMese = null, primoTrimestre = null, medioPeriodo = null;
    if (start) {
      const d30 = addDays(start, 30);
      const d90 = addDays(start, 90);
      const d180 = addDays(start, 180);
      primoMese = 0; primoTrimestre = 0; medioPeriodo = 0;
      for (const x of atts) {
        if (x.date < start) continue;
        if (x.date <= d30) primoMese += x.revenue;
        if (x.date <= d90) primoTrimestre += x.revenue;
        if (x.date > d90 && x.date <= d180) medioPeriodo += x.revenue;
      }
    }

    let attuale = 0;
    for (const x of atts) {
      if (isWithinInterval(x.date, { start: currentStart, end: currentEnd })) attuale += x.revenue;
    }

    const lastMonthRev = monthly[lastMonthKey] || 0;
    const prevRev = prevKeys.map(k => monthly[k] || 0);
    const prevAvg = prevRev.reduce((s, v) => s + v, 0) / 3;
    const trend = prevAvg > 0 ? ((lastMonthRev - prevAvg) / prevAvg) * 100 : null;

    // Affidabilità (ultimo trimestre) = % di TUTTE le serate organizzate negli
    // ultimi 90gg in cui il promoter ha centrato almeno un tavolo (revenue >=
    // soglia, default 300€). Le serate in cui non ha fatturato (0€ o assente)
    // contano come mancate a fronte del totale serate del trimestre.
    const attsRecent = atts.filter(x => isWithinInterval(x.date, { start: currentStart, end: currentEnd }));
    const serateRecentTavolo = attsRecent.filter(x => x.revenue >= (x.threshold || 300)).length;
    const reliability = recentEvents.length > 0 ? Math.round((serateRecentTavolo / recentEvents.length) * 100) : null;

    // Costanza (da sempre) = % delle serate organizzate DA quando il promoter è
    // attivo (suo inizio o prima presenza) in cui ha fatturato qualcosa (revenue > 0).
    // Il complemento (100 - costanza) = serate in cui non ha fatturato (0€ o assente).
    // Così i promoter entrati più tardi non vengono penalizzati sulle serate precedenti.
    const serateConFatturato = atts.filter(x => x.revenue > 0).length;
    const costanzaStart = start || atts[0]?.date || null;
    const eventsSinceStart = costanzaStart
      ? allEvents.filter(e => { try { return parseISO(e.date) >= costanzaStart; } catch { return false; } })
      : allEvents;
    const costanza = eventsSinceStart.length > 0 ? Math.round((serateConFatturato / eventsSinceStart.length) * 100) : null;

    // Incisività = fatturato medio per serata in cui ha fatturato (revenue > 0).
    // Misura quanto incide quando c'è: chi fattura poche volte ma con grandi numeri
    // avrà incisività alta, chi fattura spesso ma poco avrà incisività più bassa.
    const fatturatoTot = atts.reduce((s, x) => s + x.revenue, 0);
    const incisivita = serateConFatturato > 0 ? fatturatoTot / serateConFatturato : null;

    return {
      ...p,
      start,
      prime3,
      primoMese,
      primoTrimestre,
      medioPeriodo,
      attuale,
      trend,
      reliability,
      costanza,
      incisivita,
      totalEvents: atts.length,
      firstEventDate: atts[0]?.date || null,
    };
  });
}

function PodiumCard({ title, icon: Icon, data, valueKey, delay = 0, accent = '#a78bfa' }) {
  const ranked = [...data].filter(p => p[valueKey] != null && p[valueKey] > 0).sort((a, b) => b[valueKey] - a[valueKey]);
  const top3 = ranked.slice(0, 3);

  return (
    <Div
      className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4"
      style={{ animationDelay: `${delay}s`, boxShadow: `0 4px 24px -6px ${accent}18` }}
    >
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <Div className="flex items-center gap-2 mb-3">
        <Div className="p-1.5 rounded-lg" style={{ background: `${accent}1a` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </Div>
        <H className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>{title}</H>
      </Div>
      {top3.length === 0 ? (
        <P className="text-xs text-muted-foreground text-center py-4">Nessun dato</P>
      ) : (
        <Div className="space-y-2">
          {top3.map((p, i) => (
            <Div key={p.id} className="flex items-center gap-2.5">
              <Span className="text-lg w-6 text-center shrink-0">{medals[i]}</Span>
              <Div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden shrink-0 border border-white/[0.08]">
                {p.photo_url
                  ? <Img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                  : p.name?.charAt(0)?.toUpperCase()}
              </Div>
              <Span className="text-sm font-medium truncate flex-1">{p.name}</Span>
              <Span className="text-sm font-bold" style={{ color: accent }}>{fmtEUR2(p[valueKey])}</Span>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}

function TrendBadge({ trend }) {
  if (trend == null) return <Span className="text-xs text-muted-foreground/50">—</Span>;
  const up = trend >= 0;
  return (
    <Span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(trend).toFixed(0)}%
          </Span>
  );
}

function ReliabilityBadge({ reliability }) {
  if (reliability == null) return <Span className="text-xs text-muted-foreground/50">—</Span>;
  // più alto = più affidabile; verde ≥80%, giallo ≥50%, rosso <50%
  const lvl = reliability >= 80 ? 'text-emerald-400' : reliability >= 50 ? 'text-yellow-400' : 'text-red-400';
  return (
    <Span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${lvl}`}>
      <Activity className="w-3 h-3" />
      {reliability}%
          </Span>
  );
}

function CostanzaBadge({ costanza }) {
  if (costanza == null) return <Span className="text-xs text-muted-foreground/50">—</Span>;
  // Mostra % serate in cui ha fatturato (colorata) e % in cui non ha fatturato (muted)
  const nonFatturato = 100 - costanza;
  const lvl = costanza >= 80 ? 'text-emerald-400' : costanza >= 50 ? 'text-yellow-400' : 'text-red-400';
  return (
    <Span className="inline-flex items-center gap-1 text-xs whitespace-nowrap">
      <Span className={`font-semibold ${lvl}`}>{costanza}%</Span>
      <Span className="text-muted-foreground/40">·</Span>
      <Span className="text-muted-foreground/50">{nonFatturato}%</Span>
    </Span>
  );
}

export default function PromoterGrowthLeague({ promoters, attendances, events }) {
  const main = promoters.filter(p => p.ruolo !== 'ragazza_immagine' && isVisibleInStats(p));

  const data = useMemo(() => buildGrowthData(main, attendances, events), [main, attendances, events]);

  const withStart = data.filter(p => p.start);
  const tableRows = [...data].sort((a, b) => (b.primoTrimestre || 0) - (a.primoTrimestre || 0));

  if (main.length === 0) {
    return (
      <Div className="rounded-2xl border border-white/[0.06] bg-card p-8 text-center">
        <P className="text-sm text-muted-foreground">Nessun promoter attivo da confrontare</P>
      </Div>
    );
  }

  return (
    <Div className="space-y-4">
      {/* Header */}
      <Div className="flex items-center gap-2.5">
        <Div className="p-2 rounded-xl bg-primary/15">
          <Trophy className="w-5 h-5 text-primary" />
        </Div>
        <Div>
          <H className="text-sm font-semibold">Growth League — Confronto Inizi</H>
          <P className="text-xs text-muted-foreground">Chi ha avuto l'inizio più forte, chi è costante nel medio periodo, chi domina ora</P>
        </Div>
      </Div>

      {/* Podiums */}
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <PodiumCard title="Prime 3 Serate" icon={Rocket} data={data} valueKey="prime3" delay={0.05} accent="#fbbf24" />
        <PodiumCard title="Primo Mese" icon={CalendarDays} data={withStart} valueKey="primoMese" delay={0.1} accent="#a78bfa" />
        <PodiumCard title="Primo Trimestre" icon={Crown} data={withStart} valueKey="primoTrimestre" delay={0.15} accent="#60a5fa" />
      </Div>

      {/* Full comparison table */}
      <Div className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card" style={{ animationDelay: '0.2s' }}>
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <Div className="overflow-x-auto client-table-scrollbar">
          <Table className="w-full text-sm min-w-[880px]">
            <Thead>
              <Tr className="border-b border-white/[0.06] text-left">
                <Th className="sticky left-0 bg-card px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground z-10">Promoter</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Inizio</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-yellow-400/80 text-right">3 Serate</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-primary/80 text-right">1° Mese</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-blue-400/80 text-right">1° Trimestre</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Medio (4-6m)</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400/80 text-right">Attuale (90gg)</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Trend</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400/80 text-center">Affid.</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Cost.</Th>
                <Th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-orange-400/80 text-right">Incis.</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableRows.map(p => (
                <Tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <Td className="sticky left-0 bg-card px-3 py-2.5 z-10">
                    <Div className="flex items-center gap-2">
                      <Div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary overflow-hidden shrink-0">
                        {p.photo_url
                          ? <Img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                          : p.name?.charAt(0)?.toUpperCase()}
                      </Div>
                      <Span className="text-xs font-medium truncate max-w-[120px]">{p.name}</Span>
                    </Div>
                  </Td>
                  <Td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {p.start ? format(p.start, 'dd/MM/yy') : <Span className="text-muted-foreground/40">—</Span>}
                  </Td>
                  <Td className="px-3 py-2.5 text-xs font-semibold text-right text-yellow-400/90">{fmtEUR2(p.prime3)}</Td>
                  <Td className="px-3 py-2.5 text-xs font-semibold text-right text-primary/90">{p.primoMese != null ? fmtEUR2(p.primoMese) : <Span className="text-muted-foreground/40">—</Span>}</Td>
                  <Td className="px-3 py-2.5 text-xs font-bold text-right text-blue-400/90">{p.primoTrimestre != null ? fmtEUR2(p.primoTrimestre) : <Span className="text-muted-foreground/40">—</Span>}</Td>
                  <Td className="px-3 py-2.5 text-xs text-right text-muted-foreground">{p.medioPeriodo != null ? fmtEUR2(p.medioPeriodo) : <Span className="text-muted-foreground/40">—</Span>}</Td>
                  <Td className="px-3 py-2.5 text-xs font-semibold text-right text-emerald-400/90">{fmtEUR2(p.attuale)}</Td>
                  <Td className="px-3 py-2.5 text-center"><TrendBadge trend={p.trend} /></Td>
                  <Td className="px-3 py-2.5 text-center"><ReliabilityBadge reliability={p.reliability} /></Td>
                  <Td className="px-3 py-2.5 text-center"><CostanzaBadge costanza={p.costanza} /></Td>
                  <Td className="px-3 py-2.5 text-xs font-bold text-right text-orange-400/90">{p.incisivita != null ? fmtEUR2(p.incisivita) : <Span className="text-muted-foreground/40">—</Span>}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Div>
        <Div className="text-[10px] text-muted-foreground/70 px-4 py-2.5 border-t border-white/[0.04] space-y-0.5">
          <P><Span className="font-semibold text-foreground/80">Prime 3 Serate</Span> = fatturato delle prime 3 serate dal debutto</P>
          <P><Span className="font-semibold text-foreground/80">1° Mese</Span> = fatturato dei primi 30 giorni</P>
          <P><Span className="font-semibold text-foreground/80">1° Trimestre</Span> = fatturato dei primi 90 giorni</P>
          <P><Span className="font-semibold text-foreground/80">Medio (4-6m)</Span> = fatturato dei giorni 91-180</P>
          <P><Span className="font-semibold text-foreground/80">Attuale (90gg)</Span> = fatturato degli ultimi 90 giorni effettivi</P>
          <P><Span className="font-semibold text-foreground/80">Trend</Span> = ultimo mese vs media dei 3 mesi precedenti</P>
          <P><Span className="font-semibold text-foreground/80">Affid.</Span> = % delle serate organizzate nell'ultimo trimestre in cui ha centrato almeno un tavolo (soglia 300€) — le serate a 0€ o saltate contano come mancate</P>
          <P><Span className="font-semibold text-foreground/80">Cost.</Span> = % delle serate organizzate dall'inizio del promoter in cui ha fatturato (primo valore) vs % in cui non ha fatturato (secondo valore)</P>
          <P><Span className="font-semibold text-foreground/80">Incis.</Span> = fatturato medio per serata in cui ha fatturato (revenue &gt; 0) — quanto incide quando c'è: alta = grandi numeri anche se poche volte, bassa = fattura spesso ma cifre più piccole</P>
        </Div>
      </Div>
    </Div>
  );
}