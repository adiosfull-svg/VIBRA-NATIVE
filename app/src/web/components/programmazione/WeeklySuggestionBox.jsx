// Port di src/components/programmazione/WeeklySuggestionBox.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useRef, useState } from 'react';
import { motion } from '@/ui/motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Instagram, Star, RefreshCw, Gem, CheckCircle2 } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import WhatsAppIcon from '@/web/components/shared/WhatsAppIcon';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { formatContactTime } from '@/legacy/utils/relativeTime';
import { rankingColor } from '@/legacy/utils/clientRanking';
import { useMarkClientContacted } from '@/web/hooks/useMarkClientContacted';
import SelectCheckbox from '@/web/components/client/SelectCheckbox';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';

import { Btn, Div, P, Span } from '@/ui/html';
import { A } from '@/ui/elements';

const TYPE_META = {
  recency:   { label: 'Invita',     color: '#a78bfa' },
  top:       { label: 'Top',        color: '#facc15' },
  recontact: { label: 'Ricontatta', color: '#38bdf8' },
  recovery:  { label: 'Recupera',   color: '#ef4444' },
  new:       { label: 'Nuovo',      color: '#34d399' },
};

export default function WeeklySuggestionBox({ onContact, onDetail }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const promoterId = user?.promoter_id;
  const isAdmin = user?.role === 'admin';
  const markContacted = useMarkClientContacted();
  const [justContacted, setJustContacted] = useState({});
  const bulk = useBulkSelection();
  const selectMode = bulk?.selectMode;
  const selectedIds = bulk?.selectedIds;
  const toggleSelect = bulk?.toggleSelect;
  const isSel = (id) => !!selectedIds?.has(id);

  const { data: rec, isLoading } = useQuery({
    queryKey: ['weeklySuggestion', promoterId],
    queryFn: () => base44.entities.WeeklySuggestion.filter({ promoter_id: promoterId }),
    enabled: !!promoterId,
    staleTime: 0,
    gcTime: 60 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const suggestions = useMemo(() => rec?.[0]?.suggestions || [], [rec]);
  const computedAt = rec?.[0]?.computed_at;

  // Clienti live: per mostrare "Sentito <time>" aggiornato in tempo reale sulla
  // card dopo aver aperto WhatsApp. markContacted invalida ['clients'] → la query
  // si rinfresca → la card si aggiorna live (lo snapshot WeeklySuggestion non ha
  // last_contacted_at, quindi senza questo passaggio niente cambia visivamente).
  const { data: liveClients = [] } = useQuery({
    queryKey: ['clients', promoterId],
    queryFn: () => base44.entities.Client.filter({ promoter_id: promoterId }),
    enabled: !!promoterId,
    staleTime: 30 * 60000,
    gcTime: 60 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const contactedMap = useMemo(() => {
    const m = {};
    liveClients.forEach(c => { if (c.last_contacted_at) m[c.id] = c.last_contacted_at; });
    return m;
  }, [liveClients]);

  const handleRefresh = async () => {
    if (!isAdmin) return;
    try {
      await base44.functions.invoke('computeWeeklySuggestions', {});
      qc.invalidateQueries({ queryKey: ['weeklySuggestion', promoterId] });
    } catch (e) { /* ignore */ }
  };

  // ── Drag-to-scroll per desktop (mouse) ──
  const scrollRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const onMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, moved: false };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - (e.pageX - el.offsetLeft - drag.current.startX);
  };
  const endDrag = () => { drag.current.active = false; };

  const onCardClick = (e, s) => {
    // Solo se non è stato un drag: apre il dettaglio cliente.
    if (drag.current.moved) return;
    const clientObj = { id: s.client_id, name: s.name };
    if (selectMode) { toggleSelect?.(clientObj); return; }
    if (e?.ctrlKey || e?.metaKey) { e.preventDefault(); toggleSelect?.(clientObj); return; }
    onDetail?.(clientObj);
  };

  if (isLoading) {
    return (
      <Div className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-card p-4 flex items-center justify-center min-h-[120px]"
        style={{ boxShadow: '0 4px 24px -6px rgba(16,185,129,0.10)' }}>
        <Div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </Div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.03 }}
    >
      <Div
        className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-card p-4"
        style={{ boxShadow: '0 4px 24px -6px rgba(16,185,129,0.10)' }}
      >
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }} />

        <Div className="flex items-center justify-between mb-3">
          <SectionHeader icon={Sparkles} title="Suggerimenti Settimana" color="#10b981" />
          <Div className="flex items-center gap-2">
            {computedAt && (
              <Span className="text-[11px] text-muted-foreground">
                Aggiornato {formatContactTime(computedAt)}
              </Span>
            )}
            {isAdmin && (
              <Btn
                button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                <RefreshCw className="w-3 h-3" />Ricalcola
              </Btn>
            )}
          </Div>
        </Div>

        <P className="text-xs text-muted-foreground mb-3">
          I clienti con piu' probabilita' di rispondere positivamente questo weekend. Tasto destro o pressione prolungata per aggiungerli al prospetto.
        </P>

        <Div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
        >
          {suggestions.map((s) => {
            const meta = TYPE_META[s.type] || TYPE_META.recency;
            return (
              <Btn
                key={s.client_id}
                onClick={(e) => onCardClick(e, s)}
                className={`shrink-0 w-[172px] rounded-xl border p-3 flex flex-col gap-2 cursor-pointer hover:border-white/15 transition-colors ${isSel(s.client_id) ? 'border-violet-500/40 bg-violet-500/10' : 'border-border bg-secondary/20'}`}>
                <Div className="flex items-center gap-2">
                  {selectMode && <SelectCheckbox selected={isSel(s.client_id)} />}
                  <Div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${meta.color}22`, color: meta.color }}
                  >
                    {s.initials}
                  </Div>
                  <Div className="min-w-0 flex-1">
                    <P className="text-sm font-semibold text-foreground leading-tight break-words">{s.name}</P>
                    {/* Tag informativo (non cliccabile): pallino + label */}
                    <Span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.color }} />
                      {meta.label}
                    </Span>
                  </Div>
                </Div>

                <P className="text-[11px] text-muted-foreground leading-snug min-h-[28px]">{s.reason}</P>

                {(() => {
                  const contactedAt = justContacted[s.client_id] || contactedMap[s.client_id];
                  if (!contactedAt) return null;
                  return (
                    <Div className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 -mt-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <Span>Sentito {formatContactTime(contactedAt)}</Span>
                    </Div>
                  );
                })()}

                <Div className="flex items-center justify-between mt-auto">
                  {/* Rating cliente (come altrove: Gem + rankingColor) */}
                  <Div className="flex items-center gap-1">
                    {s.rating > 0 && (
                      <Span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${rankingColor(s.rating)}`}>
                        <Gem className="w-3 h-3" />{s.rating.toFixed(1)}
                      </Span>
                    )}
                    {s.is_leader && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                  </Div>
                  <Div className="flex items-center gap-1">
                    {s.phone && (
                      <A
                        href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => { e.stopPropagation(); setJustContacted(m => ({ ...m, [s.client_id]: new Date().toISOString() })); markContacted(s.client_id); }}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        accessibilityLabel="Contatta su WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                      </A>
                    )}
                    {s.instagram && (
                      <A
                        href={`https://instagram.com/${s.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors"
                        accessibilityLabel="Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </A>
                    )}
                  </Div>
                </Div>
              </Btn>
            );
          })}
        </Div>
      </Div>
    </motion.div>
  );
}