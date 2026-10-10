// Port di src/components/programmazione/SeminaAgenda.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from '@/ui/motion';
import { Instagram, Plus, Sparkles, Search, X, Layers, Split } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import EmptyState from '@/web/components/shared/EmptyState';
import SeminaCard from '@/web/components/programmazione/SeminaCard';
import SeminaSidebar from '@/web/components/programmazione/SeminaSidebar';
import SeminaExtractionStatus from '@/web/components/programmazione/SeminaExtractionStatus';
import SeminaInfoTile from '@/web/components/programmazione/SeminaInfoTile';
import { useStickySentinel } from '@/web/hooks/useStickySentinel';
import { useSetStickyHeader } from '@/web/lib/stickyHeaderContext';

import { sessionStore as webSessionStorage } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const SORT_STORAGE_KEY = 'semina_sort_v2';
const VIEW_STORAGE_KEY = 'semina_view_mode';

function sortSemine(semine, sortBy) {
  const arr = [...semine];

  if (sortBy === 'smart') {
    // Ibrido: mette in cima le semine appena estratte (ai_extracted_at) e quelle
    // appena create (created_date). Il "bump timestamp" è il più recente tra i due,
    // così ogni nuovo evento (estrazione AI o creazione manuale) spinge la semina
    // in cima alla lista.
    arr.sort((a, b) => {
      const aBump = Math.max(
        a.ai_extracted_at ? new Date(a.ai_extracted_at).getTime() : 0,
        a.created_date ? new Date(a.created_date).getTime() : 0
      );
      const bBump = Math.max(
        b.ai_extracted_at ? new Date(b.ai_extracted_at).getTime() : 0,
        b.created_date ? new Date(b.created_date).getTime() : 0
      );
      return bBump - aBump;
    });
  } else if (sortBy === 'recent') {
    arr.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  } else if (sortBy === 'az') {
    arr.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' }));
  } else if (sortBy === 'za') {
    arr.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'it', { sensitivity: 'base' }));
  }

  return arr;
}

export default function SeminaAgenda({
  semine,
  promoterId,
  onOpenCapture,
  onEditSemina,
  onDeleteSemina,
  plan,
  seminaChatMap,
  highlightId,
  enableHeaderFade = false
}) {
  const [sortBy, setSortBy] = useState(() => {
    try {
      return webSessionStorage.getItem(SORT_STORAGE_KEY) || 'smart';
    } catch {
      return 'smart';
    }
  });

  const [viewMode, setViewMode] = useState(() => {
    try {
      return webSessionStorage.getItem(VIEW_STORAGE_KEY) || 'separated';
    } catch {
      return 'separated';
    }
  });

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(highlightId || null);
  const [flashId, setFlashId] = useState(highlightId || null);

  // Header fade: quando il sentinel (posizionato al limite "estratti recenti" /
  // prima card) scorre oltre il top del viewport, imposta stuck nel context
  // globale → i bottoni header (campanella, menu account) si dissolvono con
  // la stessa animazione delle sezioni con sticky bar (weekend, clienti, ecc.).
  const [fadeSentinelRef, fadeStuck] = useStickySentinel();
  const setStuckHeader = useSetStickyHeader();

  useEffect(() => {
    if (enableHeaderFade) setStuckHeader(fadeStuck);
  }, [fadeStuck, setStuckHeader, enableHeaderFade]);

  useEffect(() => () => {
    if (enableHeaderFade) setStuckHeader(false);
  }, [setStuckHeader, enableHeaderFade]);

  // Auto-clear the highlight flash after the animation completes
  useEffect(() => {
    if (!flashId) return;

    const timer = setTimeout(() => setFlashId(null), 3000);

    return () => clearTimeout(timer);
  }, [flashId]);

  // Sync from highlightId prop (arrives after mount via URL param in parent)
  useEffect(() => {
    if (highlightId) {
      setSelectedId(highlightId);
      setFlashId(highlightId);
    }
  }, [highlightId]);

  // Mappa seminaId → { dateStr, title } dal prospetto, per mostrare l'indicatore sulla card
  const planMap = useMemo(() => {
    const map = {};

    if (!plan) return map;

    Object.entries(plan).forEach(([dateStr, entry]) => {
      (entry.clients || []).forEach(c => {
        map[c.id] = {
          dateStr,
          title: entry.title
        };
      });
    });

    return map;
  }, [plan]);

  // Filtro ricerca: nome, età, instagram, tiktok, note
  const filtered = useMemo(() => {
    if (!search.trim()) return semine;

    const q = search.toLowerCase();

    return semine.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.instagram || '').toLowerCase().includes(q) ||
      (s.tiktok || '').toLowerCase().includes(q) ||
      (s.eta != null && String(s.eta).includes(q)) ||
      (s.notes || '').toLowerCase().includes(q)
    );
  }, [semine, search]);

  const sorted = useMemo(
    () => sortSemine(filtered, sortBy),
    [filtered, sortBy]
  );

  const activeSemine = useMemo(
    () => sorted.filter(s => !s.is_off),
    [sorted]
  );

  const inactiveSemine = useMemo(
    () => sorted.filter(s => s.is_off),
    [sorted]
  );

  useEffect(() => {
    try {
      webSessionStorage.setItem(SORT_STORAGE_KEY, sortBy);
    } catch {}
  }, [sortBy]);

  useEffect(() => {
    try {
      webSessionStorage.setItem(VIEW_STORAGE_KEY, viewMode);
    } catch {}
  }, [viewMode]);

  const gridRef = useRef(null);

  useEffect(() => {
    if (!selectedId) return;

    let retries = 0;

    const scrollToCard = () => {
      if (!gridRef.current) return;

      const el = gridRef.current.querySelector(
        `[data-client-id="${selectedId}"]`
      );

      if (el && el.scrollIntoView) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      } else if (retries++ < 10) {
        // Card not in DOM yet (semine still loading) — retry on next frame
        requestAnimationFrame(scrollToCard);
      }
    };

    requestAnimationFrame(scrollToCard);
  }, [selectedId]);

  const emptyDesc =
    'Tieni premuto (mobile) o tasto destro (desktop) su quest’area per incollare un contatto IG/TikTok, oppure usa il pulsante Aggiungi Semina.';

  const renderCard = (s, i) => (
    <motion.div
      key={s.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -14,
        transition: { duration: 0.3 }
      }}
      transition={{
        duration: 0.4,
        delay: Math.min(i * 0.03, 0.3)
      }}
      className={
        selectedId === s.id
          ? 'ring-2 ring-pink-500/40 rounded-xl'
          : ''
      }
    >
      <SeminaCard
        semina={s}
        onDelete={onDeleteSemina}
        onEdit={onEditSemina}
        planInfo={planMap[s.id]}
        chatConvId={seminaChatMap?.[s.id]}
        highlightFlash={flashId === s.id}
      />
    </motion.div>
  );

  const gridClass =
    'grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3';

  return (
    <Div className="min-h-[calc(100dvh-7.5rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-3"
      >
        <Div
          className="relative overflow-hidden rounded-2xl border border-pink-500/15 bg-card p-4"
          style={{
            boxShadow: '0 4px 24px -6px rgba(236,72,153,0.10)'
          }}
        >
          <Div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
            style={{
              background:
                'linear-gradient(90deg, transparent, #ec4899, transparent)'
            }}
          />

          <Div className="flex items-center justify-between">
            <Div className="flex items-center gap-2">
              {/* Toggle vista unificata/separata */}
              <Btn
                button
                onClick={() =>
                  setViewMode(v =>
                    v === 'unified' ? 'separated' : 'unified'
                  )
                }
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1.5 rounded-lg border transition-colors ${
                  viewMode === 'separated'
                    ? 'border-pink-500/30 text-pink-400 bg-pink-500/10'
                    : 'border-border text-muted-foreground bg-secondary/30 hover:text-foreground'
                }`}
                accessibilityLabel={
                  viewMode === 'unified'
                    ? 'Vista unificata'
                    : 'Vista separata: attive sopra, inattive sotto'
                }>
                {viewMode === 'unified' ? (
                  <Layers className="w-3.5 h-3.5" />
                ) : (
                  <Split className="w-3.5 h-3.5" />
                )}

                <Span className="hidden sm:inline">
                  {viewMode === 'unified' ? 'Unificata' : 'Separata'}
                </Span>
              </Btn>

              <SectionHeader
                icon={Instagram}
                title="Semine social"
                color="#ec4899"
                size="lg"
              />
            </Div>

            <Div className="flex items-center gap-2">
              <Span className="text-xs font-semibold text-muted-foreground px-2.5 py-1 rounded-full bg-secondary/40">
                {filtered.length} semine
              </Span>

              <Btn
                button
                onClick={onOpenCapture}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-pink-500/30 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Aggiungi Semina
              </Btn>
            </Div>
          </Div>

          {/* Barra di ricerca */}
          <Div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

            <HtmlInput
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cerca per nome, età, Instagram, note…"
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-secondary/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-pink-400/50"
            />

            {search && (
              <Btn
                button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary shrink-0"
                accessibilityLabel="Pulisci ricerca">
                <X className="w-3.5 h-3.5" />
              </Btn>
            )}
          </Div>

          <Div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 mt-2">
            <P className="text-[11px] text-muted-foreground">
              Tasto destro / long-press su un&rsquo;area vuota per incollare un contatto IG o TikTok dagli appunti.
            </P>

            <SeminaExtractionStatus semine={semine} />
          </Div>
        </Div>
      </motion.div>

      <SeminaInfoTile />

      {/* Sentinel per l'evanescenza dei bottoni header: posizionato al limite
          tra l'header card (con "estratti recenti") e la prima card. Quando
          questo punto scorre oltre il top del viewport, i bottoni header
          si dissolvono (solo in modalità standalone, non dentro Programmazione). */}
      {enableHeaderFade && (
        <Div
          ref={fadeSentinelRef}
          style={{
            height: 1,
            marginTop: 0,
            padding: 0,
            border: 'none'
          }} />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={
            search.trim()
              ? 'Nessuna semina trovata'
              : 'Nessuna semina'
          }
          description={
            search.trim()
              ? 'Prova a modificare la ricerca.'
              : emptyDesc
          }
        />
      ) : (
        <Div className="flex flex-col sm:flex-row gap-4">
          {/* Sidebar desktop */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="sm:w-60 sm:shrink-0"
          >
            <SeminaSidebar
              semine={sorted}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedId={selectedId}
              onSelect={setSelectedId}
              layout="desktop"
            />
          </motion.div>

          {/* Sidebar mobile (chips orizzontali) */}
          <Div className="sm:hidden">
            <SeminaSidebar
              semine={sorted}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedId={selectedId}
              onSelect={setSelectedId}
              layout="mobile"
            />
          </Div>

          {/* Griglia card */}
          <Div ref={gridRef} className="flex-1 min-w-0">
            {viewMode === 'unified' ? (
              <Div className={gridClass}>
                <AnimatePresence>
                  {sorted.map(renderCard)}
                </AnimatePresence>
              </Div>
            ) : (
              <>
                {activeSemine.length > 0 && (
                  <Div className={gridClass}>
                    <AnimatePresence>
                      {activeSemine.map(renderCard)}
                    </AnimatePresence>
                  </Div>
                )}

                {inactiveSemine.length > 0 && (
                  <>
                    <Div className="flex items-center gap-2 my-4">
                      <Div className="flex-1 h-px bg-zinc-500/20" />

                      <Span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20">
                        <Sparkles className="w-3 h-3" />
                        Semine inattive ({inactiveSemine.length})
                      </Span>

                      <Div className="flex-1 h-px bg-zinc-500/20" />
                    </Div>

                    <Div className={gridClass}>
                      <AnimatePresence>
                        {inactiveSemine.map(renderCard)}
                      </AnimatePresence>
                    </Div>
                  </>
                )}
              </>
            )}
          </Div>
        </Div>
      )}
    </Div>
  );
}