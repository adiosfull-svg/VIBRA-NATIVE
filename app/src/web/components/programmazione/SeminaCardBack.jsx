// Port di src/components/programmazione/SeminaCardBack.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { BrainCircuit, MapPin, CalendarDays, User, Music2, Sparkles, RefreshCw, MessageSquare, HelpCircle, Briefcase, GraduationCap, Car, X, ArrowLeft } from '@/ui/icons.generated';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';

import { Btn, Div, P, Span } from '@/ui/html';

const LEGEND_ITEMS = [
  { icon: CalendarDays, color: '#60a5fa', label: 'Età' },
  { icon: MapPin, color: '#34d399', label: 'Zona / Provenienza' },
  { icon: User, color: '#fbbf24', label: 'Promoter Abituale' },
  { icon: Briefcase, color: '#22d3ee', label: 'Lavoro (Ruolo, Orari, Luogo)' },
  { icon: GraduationCap, color: '#818cf8', label: 'Studio (Scuola/Uni, Luogo)' },
  { icon: Music2, color: '#f472b6', label: 'Locali Frequentati' },
  { icon: Sparkles, color: '#a78bfa', label: 'Eventi A Cui L\'Ho Invitata' },
  { icon: Car, color: '#f97316', label: 'Guidatrice / Guidatore' },
];

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export default function SeminaCardBack({ semina, onClose }) {
  const ai = semina.ai_data || {};
  const extractedAt = semina.ai_extracted_at;
  const [showLegend, setShowLegend] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState(null);
  const qc = useQueryClient();

  const hasData = !!(ai.summary || ai.recent_summary);

  const handleRecalc = async (e) => {
    e.stopPropagation();
    if (recalculating) return;
    setRecalculating(true);
    setRateLimitMsg(null);
    try {
      await base44.functions.invoke('syncInstagramDMs', {
        force_semina_id: semina.id,
        force_promoter_id: semina.promoter_id,
      });
      qc.invalidateQueries({ queryKey: ['semine'] });
    } catch (err) {
      const errData = err?.data || err?.response?.data || err;
      if (errData?.error === 'rate_limited') {
        setRateLimitMsg(errData?.message || 'Estrazione già effettuata. Riprova più tardi.');
      } else {
        console.error('Recalc failed:', err);
      }
    } finally {
      setRecalculating(false);
    }
  };

  // Render summary with **bold** segments as <strong>
  const renderBoldText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <Span key={i} className='font-bold text-foreground font-semibold'>{part.slice(2, -2)}</Span>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <Btn className="flex flex-col h-full p-3 gap-1.5 overflow-y-auto no-scrollbar relative" onClick={e => e.stopPropagation()} style={{ touchAction: 'pan-y' }}>
      {/* Header */}
      <Div className="flex items-center justify-between mb-0.5 shrink-0">
        <Div className="flex items-center gap-1.5">
          <BrainCircuit className="w-3.5 h-3.5 text-violet-400" />
          <Span className="text-[10px] font-semibold text-violet-300 uppercase tracking-wide">Info da Chat</Span>
        </Div>
        <Div className="flex items-center gap-1.5">
          {extractedAt && (
            <Span className="text-[8px] text-muted-foreground/70">
              {format(new Date(extractedAt), 'd MMM HH:mm', { locale: it })}
            </Span>
          )}
          <Btn
            button
            onClick={(e) => { e.stopPropagation(); setShowLegend(v => !v); }}
            className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center hover:bg-violet-500/40 transition-colors"
            accessibilityLabel="Legenda icone">
            <HelpCircle className="w-2.5 h-2.5" />
          </Btn>
          {onClose && (
            <Btn
              button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/40 text-white hover:bg-violet-500/60 transition-colors shrink-0"
              accessibilityLabel="Gira la card">
              <ArrowLeft className="w-3 h-3" />
              <Span className="text-[10px] font-semibold leading-none">Gira</Span>
            </Btn>
          )}
        </Div>
      </Div>

      {/* Legend popover */}
      {showLegend && (
        <Div className="absolute top-9 left-1 right-1 z-30 rounded-lg border border-violet-500/30 bg-popover shadow-xl p-2 space-y-1.5 menu-pop-in">
          <Div className="flex items-center justify-between mb-1 pb-1 border-b border-border/40">
            <Span className="text-[9px] font-semibold text-violet-300 uppercase tracking-wide">Legenda</Span>
            <Btn
              button
              onClick={(e) => { e.stopPropagation(); setShowLegend(false); }}
              className="text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </Btn>
          </Div>
          {LEGEND_ITEMS.map((item, i) => (
            <Div key={i} className="flex items-center gap-1.5">
              <Div className="flex items-center justify-center p-1 rounded shrink-0" style={{ background: `${item.color}1a` }}>
                <item.icon className="w-2.5 h-2.5" style={{ color: item.color }} />
              </Div>
              <Span className="text-[9px] text-foreground/80 leading-tight">{item.label}</Span>
            </Div>
          ))}
        </Div>
      )}

      {/* Summary — quadro completo della persona con info chiave in grassetto */}
      {ai.summary && (
        <Div className="text-[10px] text-foreground/80 mt-0.5 leading-snug shrink-0">
          {renderBoldText(ai.summary)}
        </Div>
      )}

      {/* Divisore + riassunto ultimi messaggi */}
      {ai.recent_summary && (
        <>
          <Div className="flex items-center gap-1.5 mt-1 shrink-0">
            <Div className="h-px flex-1 bg-border/40" />
            <MessageSquare className="w-2.5 h-2.5 text-muted-foreground/40" />
            <Div className="h-px flex-1 bg-border/40" />
          </Div>
          <Div className="text-[10px] text-muted-foreground leading-snug shrink-0">
            <Span className="text-muted-foreground/60 italic">Nell'ultima parte stavo parlando di…</Span>{' '}
            {ai.recent_summary}
          </Div>
        </>
      )}

      {/* Empty state */}
      {!hasData && (
        <Div className="flex flex-col items-center justify-center flex-1 text-center gap-1.5 py-4">
          <MessageSquare className="w-5 h-5 text-muted-foreground/30" />
          <P className="text-[10px] text-muted-foreground/60 font-medium">Nessun dato estratto</P>
          <P className="text-[9px] text-muted-foreground/40 leading-tight px-2">
            I dati vengono estratti automaticamente dai messaggi Instagram durante la sincronizzazione
          </P>
        </Div>
      )}

      {/* Footer con tasto Ricalcolo */}
      <Div className="mt-auto pt-1.5 border-t border-border/40 flex flex-col gap-1 shrink-0">
        {rateLimitMsg && (
          <P className="text-[9px] text-amber-400 leading-tight">{rateLimitMsg}</P>
        )}
        <Div className="flex items-center justify-between gap-1">
        {extractedAt && hasData ? (
          <Div className="flex items-center gap-1 text-[8px] text-muted-foreground/50">
            <RefreshCw className="w-2.5 h-2.5" />
            <Span>Aggiornato dai DM</Span>
          </Div>
        ) : (
          <Span className="text-[8px] text-muted-foreground/40">Forza estrazione AI</Span>
        )}
        <Btn
          button
          onClick={handleRecalc}
          disabled={recalculating}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 hover:bg-violet-500/40 transition-colors disabled:opacity-50"
          accessibilityLabel="Forza ricalcolo AI per questa semina">
          <RefreshCw className={`w-2.5 h-2.5 ${recalculating ? 'animate-spin' : ''}`} />
          <Span className="text-[8px] font-semibold leading-none">{recalculating ? 'Calcolo…' : 'Ricalcolo'}</Span>
        </Btn>
        </Div>
      </Div>
    </Btn>
  );
}