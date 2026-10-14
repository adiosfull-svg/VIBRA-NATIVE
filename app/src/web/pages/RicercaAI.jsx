// Port di src/pages/RicercaAI.jsx (convertito da scripts/port/codemod.mjs).
import { useAIAttendances } from '@/web/hooks/useAIAttendances';
import React, { useState, useRef } from 'react';
import { makeTapHandlers } from '@/web/lib/tapHandlers';
import { useQuery } from '@tanstack/react-query';
import PageTitle from '@/web/components/shared/PageTitle';
import { base44 } from '@/lib/base44';
import { Sparkles, Send, Search, RotateCcw, TrendingUp, Users, CalendarDays, Euro, Mic, MicOff, Brain, BarChart2, MessageSquare, ChevronDown, Lock } from '@/ui/icons.generated';
import AIResultRenderer from '@/web/components/ai/AIResultRenderer';
import ChatStrategica from '@/web/components/ai/ChatStrategica';
import { calcTables } from '@/legacy/utils/tables';
import { useRoleAccess } from '@/lib/useRoleAccess';
import { getDow } from '@/legacy/utils/dateUtils';
import { logCreditUsage } from '@/legacy/utils/creditEstimate';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlTextarea } from '@/ui/elements';

const SUGGESTED = [
  { icon: TrendingUp, label: 'Top promoter per fatturato', q: 'Classifica tutti i promoter per fatturato totale di sempre' },
  { icon: CalendarDays, label: 'Serate con più di €1000', q: 'Quali serate hanno generato più di €1000 di fatturato?' },
  { icon: Users, label: 'Confronto promoter 2025', q: 'Confronta il fatturato di tutti i promoter nel 2025' },
  { icon: Euro, label: 'Media fatturato per locale', q: 'Qual è la media fatturato per serata divisa per locale?' },
  { icon: TrendingUp, label: 'Chi chiude più tavoli', q: 'Chi ha chiuso più tavoli in totale di sempre?' },
  { icon: CalendarDays, label: 'Andamento mensile 2025', q: "Mostrami l'andamento del fatturato mese per mese nel 2025" },
];

const MODELS = [
  { id: 'automatic', label: 'Standard', desc: 'Veloce · ottimo per la maggior parte delle domande' },
  { id: 'claude_sonnet_4_6', label: 'Avanzato', desc: 'Più preciso · consigliato per analisi complesse' },
];

const MESI_IT = {
  gennaio: '01', febbraio: '02', marzo: '03', aprile: '04',
  maggio: '05', giugno: '06', luglio: '07', agosto: '08',
  settembre: '09', ottobre: '10', novembre: '11', dicembre: '12',
};

function parseFilters(q) {
  const lower = q.toLowerCase();
  const filters = {};
  const annoMatch = lower.match(/\b(202[0-9])\b/);
  if (annoMatch) filters.anno = annoMatch[1];
  for (const [nome, num] of Object.entries(MESI_IT)) {
    if (lower.includes(nome)) { filters.mese = num; break; }
  }
  const sogliaMatch = lower.match(/(?:più di|maggiore di|superiore a|oltre|>)\s*[€]?\s*([\d.]+)/);
  if (sogliaMatch) filters.soglia = parseInt(sogliaMatch[1].replace(/\./g, ''));
  return filters;
}



function buildPromoterStats(promoters, attendances, events) {
  return promoters.map(p => {
    const pa = attendances.filter(a =>
      a.promoter_id === p.id &&
      a.present !== false &&
      events.find(e => e.id === a.event_id)?.date
    );
    const perMese = {};
    const perLocale = {};
    let fatturato_totale = 0;
    let tavoli_totali = 0;
    pa.forEach(a => {
      const ev = events.find(e => e.id === a.event_id);
      const rev = a.revenue || 0;
      const dow = getDow(ev.date);
      const threshold = ev.table_threshold || (dow === 6 ? 360 : 300);
      const tav = calcTables(rev, dow, threshold);
      const mese = ev.date.substring(0, 7);
      const locale = ev.venue || 'Extra';
      fatturato_totale += rev;
      tavoli_totali += tav;
      if (!perMese[mese]) perMese[mese] = { fatturato: 0, tavoli: 0, serate: 0 };
      perMese[mese].fatturato += rev;
      perMese[mese].tavoli += tav;
      perMese[mese].serate += 1;
      if (!perLocale[locale]) perLocale[locale] = { fatturato: 0, tavoli: 0, serate: 0 };
      perLocale[locale].fatturato += rev;
      perLocale[locale].tavoli += tav;
      perLocale[locale].serate += 1;
    });
    Object.keys(perMese).forEach(m => {
      perMese[m].tavoli = Math.round(perMese[m].tavoli * 10) / 10;
      perMese[m].fatturato = Math.round(perMese[m].fatturato);
    });
    Object.keys(perLocale).forEach(l => {
      perLocale[l].tavoli = Math.round(perLocale[l].tavoli * 10) / 10;
      perLocale[l].fatturato = Math.round(perLocale[l].fatturato);
    });
    return {
      nome: p.name, stato: p.status,
      fatturato_totale: Math.round(fatturato_totale),
      tavoli_totali: Math.round(tavoli_totali * 10) / 10,
      serate_totali: pa.length, per_mese: perMese, per_locale: perLocale,
    };
  });
}

function buildSerateStats(events, attendances, promoters) {
  return events.map(ev => {
    const evAtt = attendances.filter(a => a.event_id === ev.id && a.promoter_id && !a.client_id);
    const exPrAtt = attendances.filter(a => a.event_id === ev.id && !a.promoter_id && a.notes && a.notes.startsWith('__ex_pr__'));
    const dow = getDow(ev.date);
    const threshold = ev.table_threshold || (dow === 6 ? 360 : 300);
    const promoterDetail = evAtt.map(a => {
      const p = promoters.find(pr => pr.id === a.promoter_id);
      const tav = calcTables(a.revenue || 0, dow, threshold);
      return { nome: p?.name || '?', fatturato: Math.round(a.revenue || 0), tavoli: Math.round(tav * 10) / 10, presente: a.present !== false };
    });
    const fatturatoDaPromoter = evAtt.reduce((s, a) => s + (a.revenue || 0), 0);
    const fatturatoDaExPr = exPrAtt.reduce((s, a) => s + (a.revenue || 0), 0);
    const fatturatoReale = Math.round(fatturatoDaPromoter + fatturatoDaExPr);
    const tavoliTotali = Math.round(evAtt.reduce((s, a) => s + calcTables(a.revenue || 0, dow, threshold), 0) * 10) / 10;
    return {
      nome: ev.name || `${ev.venue || 'Serata'} ${ev.date || ''}`,
      data: ev.date, mese: ev.date ? ev.date.substring(0, 7) : null,
      anno: ev.date ? ev.date.substring(0, 4) : null,
      locale: ev.venue || 'Extra', fatturato_totale: fatturatoReale,
      tavoli_totali: tavoliTotali, is_extra: ev.is_extra || false, promoter: promoterDetail,
    };
  }).sort((a, b) => (b.data || '').localeCompare(a.data || ''));
}

function AnalisiTab({ promoters, events, attendances }) {
  const { user, ricercaAIMode } = useRoleAccess();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState('automatic');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const mode = ricercaAIMode();
  const isLimited = mode === 'limited';
  const userPromoterTeam = isLimited && user?.promoter_id ? [user.promoter_id] : promoters.map(p => p.id);

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Il riconoscimento vocale non è supportato da questo browser. Usa Chrome.');
      return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = webWindow.SpeechRecognition || webWindow.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'it-IT'; rec.continuous = false; rec.interimResults = false;
    rec.onresult = (e) => { setQuery(prev => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript); setIsListening(false); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const handleSearch = async (q) => {
    const searchQuery = q || query;
    if (!searchQuery.trim() || loading) return;
    setLoading(true); setResult(null); setLastQuery(searchQuery);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const filters = parseFilters(searchQuery);
      const promotersToAnalyze = isLimited ? promoters.filter(p => userPromoterTeam.includes(p.id)) : promoters;
      const attendancesFiltered = isLimited ? attendances.filter(a => userPromoterTeam.includes(a.promoter_id)) : attendances;
      const promoterStats = buildPromoterStats(promotersToAnalyze, attendancesFiltered, events);
      const serateStats = buildSerateStats(events, attendancesFiltered, promotersToAnalyze);

      const promoterFiltrati = promoterStats.map(p => {
        let fat = p.fatturato_totale, tav = p.tavoli_totali, ser = p.serate_totali;
        if (filters.anno || filters.mese) {
          const chiaviFiltrate = Object.keys(p.per_mese).filter(k => {
            const [y, m] = k.split('-');
            if (filters.anno && y !== filters.anno) return false;
            if (filters.mese && m !== filters.mese) return false;
            return true;
          });
          fat = chiaviFiltrate.reduce((s, k) => s + p.per_mese[k].fatturato, 0);
          tav = Math.round(chiaviFiltrate.reduce((s, k) => s + p.per_mese[k].tavoli, 0) * 10) / 10;
          ser = chiaviFiltrate.reduce((s, k) => s + p.per_mese[k].serate, 0);
        }
        return { nome: p.nome, fatturato: fat, tavoli: tav, serate: ser };
      }).filter(p => p.serate > 0);

      const serateFiltrate = serateStats.filter(s => {
        if (filters.anno && s.anno !== filters.anno) return false;
        if (filters.mese && (!s.mese || !s.mese.endsWith(`-${filters.mese}`))) return false;
        if (filters.soglia !== undefined && s.fatturato_totale <= filters.soglia) return false;
        return true;
      }).sort((a, b) => b.fatturato_totale - a.fatturato_totale);

      const riepilogoMensile = {};
      serateStats.forEach(s => {
        if (!s.mese) return;
        if (filters.anno && s.anno !== filters.anno) return;
        if (!riepilogoMensile[s.mese]) riepilogoMensile[s.mese] = { fatturato: 0, serate: 0, tavoli: 0 };
        riepilogoMensile[s.mese].fatturato += s.fatturato_totale;
        riepilogoMensile[s.mese].serate += 1;
        s.promoter.forEach(p => { riepilogoMensile[s.mese].tavoli += p.tavoli; });
      });
      Object.keys(riepilogoMensile).forEach(k => {
        riepilogoMensile[k].fatturato = Math.round(riepilogoMensile[k].fatturato);
        riepilogoMensile[k].tavoli = Math.round(riepilogoMensile[k].tavoli * 10) / 10;
        riepilogoMensile[k].media_tavoli_a_serata = riepilogoMensile[k].serate > 0
          ? Math.round((riepilogoMensile[k].tavoli / riepilogoMensile[k].serate) * 10) / 10 : 0;
      });

      const perLocaleRaw = {};
      serateStats.forEach(s => {
        if (filters.anno && s.anno !== filters.anno) return;
        if (filters.mese && s.mese && !s.mese.endsWith(`-${filters.mese}`)) return;
        if (!perLocaleRaw[s.locale]) perLocaleRaw[s.locale] = { fatturato: 0, serate: 0, tavoli: 0 };
        perLocaleRaw[s.locale].fatturato += s.fatturato_totale;
        perLocaleRaw[s.locale].serate += 1;
        s.promoter.forEach(p => { perLocaleRaw[s.locale].tavoli += p.tavoli; });
      });
      const localeStats = Object.entries(perLocaleRaw).map(([nome, v]) => ({
        nome, fatturato: Math.round(v.fatturato), tavoli: Math.round(v.tavoli * 10) / 10,
        media_fatturato: v.serate > 0 ? Math.round(v.fatturato / v.serate) : 0,
        media_tavoli: v.serate > 0 ? Math.round((v.tavoli / v.serate) * 10) / 10 : 0, serate: v.serate,
      }));

      const periodoDesc = [
        filters.mese ? Object.keys(MESI_IT).find(k => MESI_IT[k] === filters.mese) : null,
        filters.anno,
      ].filter(Boolean).join(' ') || 'sempre';

      const promoterPerLocale = promoterStats.map(p => {
        const localeFiltered = {};
        Object.entries(p.per_locale || {}).forEach(([loc, v]) => {
          if (filters.anno || filters.mese) {
            const paFiltered = attendances.filter(a => {
              if (a.promoter_id !== promoters.find(pr => pr.name === p.nome)?.id) return false;
              const ev = events.find(e => e.id === a.event_id);
              if (!ev || ev.venue !== loc) return false;
              if (filters.anno && (!ev.date || !ev.date.startsWith(filters.anno))) return false;
              if (filters.mese && (!ev.date || !ev.date.substring(5, 7) === filters.mese)) return false;
              return true;
            });
            if (paFiltered.length > 0) {
              let fat = 0, tav = 0;
              paFiltered.forEach(a => {
                const ev = events.find(e => e.id === a.event_id);
                const dow = getDow(ev?.date);
                const thr = ev?.table_threshold || (dow === 6 ? 360 : 300);
                fat += a.revenue || 0;
                tav += calcTables(a.revenue || 0, dow, thr);
              });
              localeFiltered[loc] = { fatturato: Math.round(fat), tavoli: Math.round(tav * 10) / 10, serate: paFiltered.length, media_tavoli: Math.round((tav / paFiltered.length) * 10) / 10 };
            }
          } else {
            localeFiltered[loc] = { ...v, media_tavoli: v.serate > 0 ? Math.round((v.tavoli / v.serate) * 10) / 10 : 0 };
          }
        });
        return { nome: p.nome, per_locale: localeFiltered };
      }).filter(p => Object.keys(p.per_locale).length > 0);

      const promoterBestEvent = {};
      promoters.forEach(p => {
        const paP = attendances.filter(a => a.promoter_id === p.id && a.present !== false);
        if (paP.length === 0) return;
        const best = paP.reduce((best, a) => (a.revenue || 0) > (best.revenue || 0) ? a : best, paP[0]);
        const ev = events.find(e => e.id === best.event_id);
        if (!ev) return;
        const dow = getDow(ev.date);
        const thr = ev.table_threshold || (dow === 6 ? 360 : 300);
        promoterBestEvent[p.name] = { fatturato: Math.round(best.revenue || 0), tavoli: Math.round(calcTables(best.revenue || 0, dow, thr) * 10) / 10, serata: ev.name || ev.venue, data: ev.date, locale: ev.venue };
      });

      const prompt = `Sei un assistente italiano che presenta analisi di dati per un team di promoter di serate in discoteca a Napoli.
Oggi: ${todayStr}. Periodo analizzato: ${periodoDesc}.

⚠️ REGOLA ASSOLUTA: Usa ESCLUSIVAMENTE i valori numerici già presenti nei dataset qui sotto. NON calcolare, NON stimare, NON modificare alcun numero.

=== PROMOTER (filtrati per periodo "${periodoDesc}") ===
${JSON.stringify(promoterFiltrati)}

=== PROMOTER BREAKDOWN PER LOCALE ===
${JSON.stringify(promoterPerLocale)}

=== MIGLIOR SERATA PER PROMOTER (di sempre) ===
${JSON.stringify(promoterBestEvent)}

=== SERATE (filtrate per periodo "${periodoDesc}", ordinate per fatturato decrescente) ===
Totale serate trovate: ${serateFiltrate.length}
${JSON.stringify(serateFiltrate.map(s => ({ nome: s.nome, data: s.data, locale: s.locale, fatturato_totale: s.fatturato_totale, tavoli_totali: s.tavoli_totali, promoter: s.promoter })))}

=== RIEPILOGO MENSILE ===
${JSON.stringify(riepilogoMensile)}

=== STATISTICHE PER LOCALE ===
${JSON.stringify(localeStats)}

=== DOMANDA ===
"${searchQuery}"

ISTRUZIONI:
1. Usa SOLO i valori presenti nei dataset sopra.
2. Per TAVOLI o FATTURATO totali → usa PROMOTER.
3. Per MEDIA tavoli in un locale → usa PROMOTER BREAKDOWN PER LOCALE.
4. Per "miglior serata" → usa MIGLIOR SERATA PER PROMOTER.
5. Per serate specifiche → usa SERATE. Presenta come tabella.
6. Per andamenti → usa RIEPILOGO MENSILE.
7. Per confronti locali → usa STATISTICHE PER LOCALE.
8. Scrivi in italiano corretto.
9. Il campo "summary" deve contenere il dato principale con i numeri esatti.

TIPO DI VISUALIZZAZIONE:
- "bar_horizontal": classifica promoter
- "bar": confronto per locale o per mese
- "line": andamento mensile nel tempo
- "table": OBBLIGATORIO per elenchi di serate — columns = ["Serata","Data","Locale","Fatturato","Tavoli"]
- "multi": più grafici affiancati
- "text": risposta narrativa

Per grafici: data = [{"name":"...","value":N,"extra":"..."}]. unit = "€" per fatturato, "n" per tavoli/serate.

FORMATO JSON:
{"type":"...","title":"...","summary":"...","text":"...","data":[{"name":"...","value":N,"extra":"..."}],"columns":["..."],"lines":["..."],"unit":"€"|"n","charts":[{"type":"...","title":"...","data":[...],"unit":"...","lines":["..."]}]}

Solo JSON puro, nessun testo esterno.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: model !== 'automatic' ? model : undefined,
        response_json_schema: {
          type: 'object',
          properties: {
            type: { type: 'string' }, title: { type: 'string' }, summary: { type: 'string' },
            text: { type: 'string' }, data: { type: 'array', items: { type: 'object' } },
            columns: { type: 'array', items: { type: 'string' } }, lines: { type: 'array', items: { type: 'string' } },
            unit: { type: 'string' }, charts: { type: 'array', items: { type: 'object' } },
          },
        },
      });

      setResult(response);
      setHistory(prev => [{ query: searchQuery, result: response }, ...prev.slice(0, 4)]);
      const promoterRecord = promoters.find(p => p.id === user?.promoter_id);
      logCreditUsage({
        base44,
        promoterId: user?.promoter_id || 'unknown',
        promoterName: promoterRecord?.name || user?.full_name || '',
        feature: 'ai_suggestions',
        model,
        detail: `Ricerca AI: "${searchQuery.slice(0, 60)}"`,
      });
    } catch (err) {
      setResult({ type: 'text', text: `**Errore durante la ricerca.** Riprova tra qualche secondo.\n\n_${err?.message || 'errore sconosciuto'}_` });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setQuery(''); setLastQuery(''); };
  const selectedModel = MODELS.find(m => m.id === model);

  return (
    <Div className="space-y-5">
      <Div
        className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-4 sm:p-5"
        style={{ boxShadow: '0 4px 32px -8px rgba(167,139,250,0.10)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <Div className="flex items-center gap-2 mb-3 flex-wrap">
          <Div className="relative">
            <Btn
              button
              onClick={() => setShowModelMenu(m => !m)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/20 text-xs text-muted-foreground hover:text-foreground transition-all">
              <Brain className="w-3.5 h-3.5 text-primary" />
              {selectedModel?.label}
              <ChevronDown className="w-3 h-3" />
            </Btn>
            {showModelMenu && (
              <Div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-xl min-w-[220px] overflow-hidden">
                {MODELS.map(m => (
                  <Btn
                    button
                    key={m.id}
                    onClick={() => { setModel(m.id); setShowModelMenu(false); }}
                    className={`w-full text-left px-4 py-3 text-xs hover:bg-secondary/40 transition-all ${model === m.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}>
                    <Div className="font-semibold">{m.label}</Div>
                    <Div className="text-muted-foreground mt-0.5">{m.desc}</Div>
                  </Btn>
                ))}
              </Div>
            )}
          </Div>
          {result && (
            <Btn
              button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all ml-auto">
              <RotateCcw className="w-3.5 h-3.5" /> Nuova ricerca
            </Btn>
          )}
        </Div>

        <Div className="flex gap-2 items-end">
          <Div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
            <HtmlTextarea
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); } }}
              placeholder="Es: Quanto ho fatturato a marzo 2026?"
              className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-input bg-secondary/20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              rows={2}
            />
            <Btn
              button
              onClick={toggleVoice}
              className={`absolute right-3 top-2.5 p-1.5 rounded-lg transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
              accessibilityLabel={isListening ? 'Ferma' : 'Ricerca vocale'}>
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Btn>
          </Div>
          <Btn
            button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 transition-all shrink-0 h-[52px] -translate-y-[12px]">
            {loading
              ? <><Span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></>
              : <><Send className="w-4 h-4" /></>
            }
          </Btn>
        </Div>

        {!result && !loading && (
          <Div className="mt-4">
            <P className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3 font-medium">Domande rapide</P>
            <Div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SUGGESTED.map(({ icon: Icon, label, q }) => (
                <Btn
                  button
                  key={q}
                  onClick={() => { setQuery(q); handleSearch(q); }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs rounded-xl border border-white/[0.06] bg-secondary/10 hover:bg-secondary/30 hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all group">
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  {label}
                </Btn>
              ))}
            </Div>
          </Div>
        )}
      </Div>

      {loading && (
        <Div
          className="dash-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-12 flex flex-col items-center gap-4"
          style={{ boxShadow: '0 4px 24px -6px rgba(167,139,250,0.08)' }}
        >
          <Div className="relative">
            <Div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </Div>
            <Div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </Div>
          <Div className="text-center">
            <P className="text-sm font-medium">Analizzo i dati...</P>
            <P className="text-xs text-muted-foreground mt-1">Generazione grafici e insight in corso</P>
          </Div>
        </Div>
      )}

      {result && !loading && (
        <Div
          className="dash-fade-up space-y-4"
        >
          <Div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <Span>Risultato per: <Span className="text-foreground font-medium">"{lastQuery}"</Span></Span>
          </Div>
          <AIResultRenderer result={result} />
        </Div>
      )}

      {history.length > 1 && !loading && (
        <Div className="space-y-3">
          <P className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ricerche precedenti</P>
          {history.slice(1).map((h, i) => (
            <Div
              key={i}
              className="dash-fade-up rounded-xl border border-white/[0.06] bg-card overflow-hidden"
            >
              <Btn
                button
                onClick={() => { setQuery(h.query); setResult(h.result); setLastQuery(h.query); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-all text-left">
                <Search className="w-3 h-3 shrink-0" />
                <Span className="flex-1 truncate">{h.query}</Span>
                <Span className="text-[10px] text-primary">Ricarica →</Span>
              </Btn>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}

export default function RicercaAI() {
  const { canAccessRicercaAI, ricercaAIMode } = useRoleAccess();
  const [tab, setTab] = useState('chat');
  const lastTouchRef = useRef(0);

  const { data: promoters = [] } = useQuery({ queryKey: ['promoters'], queryFn: () => base44.entities.Promoter.list(), staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 1 });
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => base44.entities.Event.list('-date', 5000), staleTime: 10 * 60000, gcTime: 15 * 60000, refetchOnWindowFocus: false, retry: 1 });
  const attendances = useAIAttendances();

  if (!canAccessRicercaAI()) {
    return (
      <Div className="min-h-screen flex items-center justify-center p-4">
        <Div className="rounded-xl bg-card border border-border p-8 text-center space-y-4 max-w-md">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
          <H className="text-xl font-bold">Accesso Limitato</H>
          <P className="text-sm text-muted-foreground">Il tuo ruolo non ha accesso a questa sezione.</P>
        </Div>
      </Div>
    );
  }

  const mode = ricercaAIMode();

  // ChatStrategica è un overlay fisso full-screen con suo header e back button.
  // Quando è attivo, non renderizziamo PageTitle/tab: altrimenti si intravedono
  // nello spazio lasciato libero sopra la mobile nav (bug "intravede Ricerca AI").
  if (tab === 'chat') {
    return <ChatStrategica promoters={promoters} events={events} attendances={attendances} onExit={() => setTab('analisi')} />;
  }

  return (
    <Div className="space-y-4 max-w-5xl mx-auto">
      <PageTitle title="Ricerca AI" />

      <Div className="flex gap-2">
        <Btn
          button
          {...makeTapHandlers(lastTouchRef, () => setTab('chat'))}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${tab === 'chat' ? 'bg-primary/10 border-primary text-primary shadow-sm shadow-primary/10' : 'border-border text-muted-foreground hover:text-foreground'}`}>
          <Brain className="w-4 h-4" /> Consulente Strategico
        </Btn>
        <Btn
          button
          {...makeTapHandlers(lastTouchRef, () => setTab('analisi'))}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${tab === 'analisi' ? 'bg-primary/10 border-primary text-primary shadow-sm shadow-primary/10' : 'border-border text-muted-foreground hover:text-foreground'}`}>
          <BarChart2 className="w-4 h-4" /> Analisi Dati{mode === 'limited' && <Span className="text-xs text-amber-400 ml-1">(personale)</Span>}
        </Btn>
      </Div>

      <AnalisiTab promoters={promoters} events={events} attendances={attendances} />
    </Div>
  );
}