// Port di src/components/programmazione/RecontactList.jsx (convertito da scripts/port/codemod.mjs).
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { differenceInDays, parseISO, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Search, MessageCircle, CheckCircle2, Clock, Star, Instagram, Gem, ArrowDown01, ArrowDownAZ, ArrowDownWideNarrow, X } from '@/ui/icons.generated';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { rankingColor } from '@/legacy/utils/clientRanking';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import WhatsAppIcon from '@/web/components/shared/WhatsAppIcon';
import SelectCheckbox from '@/web/components/client/SelectCheckbox';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';
import { formatContactTime, formatDaysAgo, urgencyColor } from '@/legacy/utils/relativeTime';

import { doc as webDocument, win as webWindow } from '@/web/shims/dom';
import { usePageWindow } from '@/web/hooks/usePageWindow';
import { Btn, Div, P, Span } from '@/ui/html';
import { A, HtmlInput, Img } from '@/ui/elements';

const THRESHOLDS = [
  { key: 'last_weekend', label: 'Ultimo weekend', days: 7 },
  { key: '2w', label: '2 settimane', days: 14 },
  { key: '1m', label: '1 mese', days: 30 },
  { key: '2m', label: '2 mesi', days: 60 },
  { key: '3m', label: '3 mesi', days: 90 },
];

// Virtualizzazione: altezza riga fissa + overscan. Renderizza solo le righe
// nel viewport (window-scroll based, come VirtualizedClientList) per 60fps
// anche con centinaia di clienti da ricontattare.
const OVERSCAN = 6;
const DESKTOP_ROW_HEIGHT = 64;
const MOBILE_ROW_HEIGHT = 140;

/** Frase sintetica sull'andamento del cliente, per la tabella da ricontattare. */
function buildTrendPhrase(client) {
  const fri = client.cum_fri || 0;
  const sat = client.cum_sat || 0;
  const sun = client.cum_sun || 0;
  const visits = client.cum_visits || 0;
  const rate = client.cum_attendance_rate || 0;
  const trend = client.cum_trend_status;
  const npb = client.new_people_brought || 0;

  if (rate >= 55 && visits >= 12) return "uno dei pilastri, c'è sempre";
  if (trend === 'up' && visits <= 6) return 'è ritornato dopo tanto tempo';
  const maxDay = Math.max(fri, sat, sun);
  if (maxDay >= 3) {
    const dayName = sat === maxDay ? 'sabato' : fri === maxDay ? 'venerdì' : 'domenica';
    return `sta venendo con costanza il ${dayName}`;
  }
  if (trend === 'down') return 'sta venendo meno del solito';
  if (npb >= 3 && trend === 'up') return 'sta portando più gente del previsto';
  if (npb >= 3) return 'porta spesso amici con sé';
  if (visits <= 2) return 'cliente nuovo, da coltivare';
  return 'cliente abituale';
}


/** Riga swipeable — identica a ClientsToRecontactDialog */
function SwipeableRow({ children, onSwipeRight, onSwipeLeft, hasPhone, disabled }) {
  const [offset, setOffset] = useState(0);
  const [swiped, setSwiped] = useState(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);
  const offsetRef = useRef(0);
  const threshold = 60;

  const onTouchStart = (e) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    swiping.current = false;
  };

  const onTouchMove = (e) => {
    if (disabled) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!swiping.current) {
      // Engage swipe only when horizontal motion clearly dominates: this lets
      // vertical-dominant touches fall through to native scroll (page/list)
      // instead of hijacking the gesture and freezing the scroll.
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        swiping.current = true;
      }
      return;
    }
    const clamped = Math.max(-120, Math.min(120, dx));
    offsetRef.current = clamped;
    setOffset(clamped);
  };

  const onTouchEnd = () => {
    if (!swiping.current) { setOffset(0); offsetRef.current = 0; return; }
    swiping.current = false;
    if (offsetRef.current > threshold) {
      setOffset(120);
      setSwiped('right');
    } else if (offsetRef.current < -threshold && hasPhone) {
      setOffset(-120);
      setSwiped('left');
    } else {
      setOffset(0);
      offsetRef.current = 0;
    }
  };

  useEffect(() => {
    if (!swiped) return;
    const t = setTimeout(() => {
      if (swiped === 'right') onSwipeRight?.();
      else if (swiped === 'left') onSwipeLeft?.();
      setOffset(0);
      offsetRef.current = 0;
      setSwiped(null);
    }, 300);
    return () => clearTimeout(t);
  }, [swiped, onSwipeRight, onSwipeLeft]);

  const rightBg = offset > 0 ? `rgba(16,185,129,${Math.min(0.2, offset / 300)})` : 'transparent';
  const leftBg = offset < 0 && hasPhone ? `rgba(16,185,129,${Math.min(0.2, Math.abs(offset) / 300)})` : 'transparent';

  return (
    <Div className="relative overflow-hidden">
      <Div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 transition-opacity duration-150"
        style={{ opacity: offset > 20 ? Math.min(1, offset / 80) : 0 }}
      >
        <Div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <Span className="text-[11px] font-semibold">Contattato</Span>
        </Div>
      </Div>
      {hasPhone && (
        <Div
          className="absolute inset-y-0 left-0 flex items-center pl-4 transition-opacity duration-150"
          style={{ opacity: offset < -20 ? Math.min(1, Math.abs(offset) / 80) : 0 }}
        >
          <Div className="flex items-center gap-1.5 text-emerald-400">
            <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
            <Span className="text-[11px] font-semibold">WhatsApp</Span>
          </Div>
        </Div>
      )}
      <Div
        className="relative transition-transform duration-200"
        style={{
          transform: `translateX(${offset}px)`,
          background: offset > 0 ? rightBg : leftBg,
          touchAction: 'pan-y',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </Div>
    </Div>
  );
}

export default function RecontactList({ clients, clientStatsMap, events, onContact, onDetail, search: searchProp, onSearchChange }) {
  const { user } = useAuth();
  const promoterId = user?.promoter_id;
  const [threshold, setThreshold] = useState('last_weekend');
  const [sortMode, setSortMode] = useState('chrono');
  const [internalSearch, setInternalSearch] = useState('');
  const search = searchProp ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;
  const [popupData, setPopupData] = useState(null);
  const popupBadgeRef = useRef(null);
  const qc = useQueryClient();
  const bulk = useBulkSelection();

  // Analisi Intelligente: mappa client_id → raccomandazione AI per frasi dinamiche
  const { data: aiRec } = useQuery({
    queryKey: ['aiSuggestion', promoterId],
    queryFn: () => base44.entities.AISuggestion.filter({ promoter_id: promoterId }, '-computed_at'),
    enabled: !!promoterId,
    staleTime: 30 * 60000,
    gcTime: 60 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const aiRecMap = useMemo(() => {
    const m = {};
    (aiRec?.[0]?.recommendations || []).forEach(r => { if (r.client_id) m[r.client_id] = r; });
    return m;
  }, [aiRec]);

  // Frase intelligente: usa l'analisi AI (perche_ora o descrizione) se disponibile,
  // altrimenti fallback sulle statistiche cumulate del cliente.
  const getPhrase = (client) => {
    const rec = aiRecMap[client.id];
    if (rec?.perche_ora) return rec.perche_ora;
    if (rec?.descrizione) return rec.descrizione;
    return buildTrendPhrase(client);
  };
  const selectMode = bulk?.selectMode;
  const selectedIds = bulk?.selectedIds;
  const toggleSelect = bulk?.toggleSelect;

  // Click outside chiude il popup
  useEffect(() => {
    if (!popupData) return;
    const handler = (e) => {
      if (popupBadgeRef.current?.contains(e.target)) return;
      setPopupData(null);
    };
    webDocument.addEventListener('mousedown', handler);
    webDocument.addEventListener('touchstart', handler);
    return () => {
      webDocument.removeEventListener('mousedown', handler);
      webDocument.removeEventListener('touchstart', handler);
    };
  }, [popupData]);

  // Loghi locali
  const { data: appSettings = [] } = useQuery({
    queryKey: ['all-app-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
    staleTime: 10 * 60000,
    enabled: !!popupData,
  });
  const venueLogoMap = {};
  appSettings.forEach(s => {
    if (s.key?.startsWith('venue_logo_')) venueLogoMap[s.key.replace('venue_logo_', '')] = s.value;
  });

  const markAsContacted = async (clientId) => {
    await base44.entities.Client.update(clientId, { last_contacted_at: new Date().toISOString() });
    qc.invalidateQueries({ queryKey: ['clients'] });
    onContact?.(clientId);
  };

  const handleClientClick = (e, client) => {
    if (selectMode) { toggleSelect?.(client); return; }
    if (e?.ctrlKey || e?.metaKey) { e.preventDefault(); toggleSelect?.(client); return; }
    onDetail?.(client);
  };
  const isSel = (id) => !!selectedIds?.has(id);

  const eventsById = useMemo(() => Object.fromEntries(events.map(e => [e.id, e])), [events]);

  const today = new Date();
  const thresholdDays = THRESHOLDS.find(t => t.key === threshold)?.days ?? 30;

  const toRecontact = useMemo(() => {
    const results = [];
    for (const client of clients) {
      if (!client.cum_visits || client.cum_visits === 0) continue;

      const lastDateStr = client.cum_last_attendance_date || '';
      if (!lastDateStr) continue;

      const daysAgo = differenceInDays(today, parseISO(lastDateStr));
      if (threshold !== 'last_weekend' && daysAgo < thresholdDays) continue;

      // Usa campi pre-calcolati dal backend invece di iterare le presenze
      const lastRevenue = client.cum_last_revenue || 0;
      const lastEvent = client.cum_last_event_venue
        ? { venue: client.cum_last_event_venue, date: lastDateStr, name: client.cum_last_event_venue }
        : null;
      const rating = client.cum_rating > 0 ? client.cum_rating : null;

      results.push({ client, daysAgo, lastRevenue, lastEvent, rating });
    }
    if (sortMode === 'rating') {
      results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortMode === 'leader') {
      results.sort((a, b) => (Number(b.client.is_leader) - Number(a.client.is_leader)) || (a.daysAgo - b.daysAgo));
    } else {
      results.sort((a, b) => a.daysAgo - b.daysAgo);
    }
    return results;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, thresholdDays, threshold, sortMode]);

  const filtered = useMemo(() => toRecontact.filter(({ client }) =>
    !search || client.name?.toLowerCase().includes(search.toLowerCase())
  ), [toRecontact, search]);

  // ── Virtualizzazione (window-scroll based, come VirtualizedClientList) ──
  // PORT: la pagina è lo ScrollView di Page: finestra calcolata da hooks/usePageWindow
  const [itemHeight, setItemHeight] = useState(() =>
    typeof window !== 'undefined' && webWindow.matchMedia('(min-width: 640px)').matches ? DESKTOP_ROW_HEIGHT : MOBILE_ROW_HEIGHT
  );

  useEffect(() => {
    const mq = webWindow.matchMedia('(min-width: 640px)');
    const handler = () => setItemHeight(mq.matches ? DESKTOP_ROW_HEIGHT : MOBILE_ROW_HEIGHT);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { containerRef, start: viewStart, end: viewEnd } = usePageWindow(filtered.length, itemHeight, OVERSCAN);

  return (
    <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card" style={{ boxShadow: '0 4px 32px -8px rgba(251,146,60,0.10)' }}>
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #fb923c, transparent)' }} />

      {/* Header */}
      <Div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <Div className="flex items-center gap-2">
          <Div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5 text-orange-400" /></Div>
          <Div>
            <P className="font-semibold uppercase tracking-wider text-orange-400 text-xs">Clienti da ricontattare</P>
            <P className="text-[11px] text-muted-foreground">{toRecontact.length} client{toRecontact.length !== 1 ? 'i' : 'e'} da sentire</P>
          </Div>
        </Div>
      </Div>

      {/* Filtri + ricerca — header rinnovato */}
      <Div className="px-4 py-3 space-y-2.5 border-b border-border/50 bg-secondary/15">
        {/* Soglia assenza */}
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 shrink-0 w-[62px]">Assenti da</Span>
          <Div className="flex items-center gap-1.5 flex-wrap">
            {THRESHOLDS.map(t => (
              <Btn
                button
                key={t.key}
                onClick={() => setThreshold(t.key)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  threshold === t.key
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                    : 'bg-secondary/50 text-muted-foreground border border-border/40 hover:bg-secondary hover:text-foreground'
                }`}>
                {t.label}
              </Btn>
            ))}
          </Div>
        </Div>
        {/* Ordina + Cerca */}
        <Div className="flex items-center gap-2 flex-wrap">
          <Div className="flex items-center gap-1.5 flex-wrap">
            <Span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Ordina</Span>
            <Btn
              button
              onClick={() => setSortMode('leader')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                sortMode === 'leader'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : 'bg-secondary/50 text-muted-foreground border border-border/40 hover:bg-secondary hover:text-foreground'
              }`}>
              <Star className="w-3 h-3" />Leader
            </Btn>
            <Btn
              button
              onClick={() => setSortMode('rating')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                sortMode === 'rating'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : 'bg-secondary/50 text-muted-foreground border border-border/40 hover:bg-secondary hover:text-foreground'
              }`}>
              <ArrowDown01 className="w-3 h-3" />Rating
            </Btn>
            <Btn
              button
              onClick={() => setSortMode('chrono')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                sortMode === 'chrono'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : 'bg-secondary/50 text-muted-foreground border border-border/40 hover:bg-secondary hover:text-foreground'
              }`}>
              <ArrowDownWideNarrow className="w-3 h-3" />Recenza
            </Btn>
          </Div>
          <Div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <HtmlInput
              type="text"
              placeholder="Cerca cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-secondary/50 border border-border/40 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-colors"
            />
          </Div>
        </Div>
      </Div>

      {/* Lista in flusso pagina (scrolla insieme al resto della pagina) */}
      <Div>
        {filtered.length === 0 ? (
          <Div className="px-4 py-12 text-center text-sm text-muted-foreground">
            {toRecontact.length === 0 ? (
              threshold === 'last_weekend'
                ? <>Nessun cliente con presenze registrate.</>
                : <>Tutti i clienti sono venuti almeno una volta negli ultimi {THRESHOLDS.find(t => t.key === threshold)?.label} 🎉</>
            ) : (
              <>Nessun cliente corrisponde alla ricerca.</>
            )}
          </Div>
        ) : (
          <Div ref={containerRef} style={{ position: 'relative', height: filtered.length * itemHeight }}>
            {filtered.slice(viewStart, viewEnd).map((item, i) => {
              const idx = viewStart + i;
              const { client, daysAgo, lastRevenue, lastEvent, rating } = item;
              const initials = client.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              const phrase = getPhrase(client);
              const contactedLabel = formatContactTime(client.last_contacted_at);
              const daysSinceContacted = client.last_contacted_at ? differenceInDays(today, new Date(client.last_contacted_at)) : null;
              const contactStale = daysSinceContacted !== null && daysSinceContacted > 8;
              const urgencyClass = urgencyColor(daysAgo);
              const phoneClean = client.phone?.replace(/\s/g, '');
              const igHandle = client.instagram?.replace('@', '');
              const isPopupOpen = popupData?.client?.id === client.id;

              return (
                <Div
                  key={client.id}
                  style={{ position: 'absolute', top: idx * itemHeight, left: 0, right: 0, height: itemHeight, overflow: 'hidden' }}
                  className="border-b border-border/40"
                >
                  <SwipeableRow
                    onSwipeRight={() => markAsContacted(client.id)}
                    onSwipeLeft={() => { if (phoneClean) { const a = webDocument.createElement('a'); a.href = `https://wa.me/${phoneClean}`; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.click(); } }}
                    hasPhone={!!phoneClean}
                    disabled={selectMode}
                  >
                    <Div className="group">
                      {/* DESKTOP */}
                      <Btn className={`hidden sm:flex items-center gap-2.5 px-4 py-3 hover:bg-secondary/10 transition-colors cursor-pointer`} style={isSel(client.id) ? { backgroundColor: 'rgba(139, 92, 246, 0.18)' } : undefined} onClick={(e) => handleClientClick(e, client)}>
                        {selectMode && <SelectCheckbox selected={isSel(client.id)} />}
                        <ClientAvatar client={client} initials={initials} size="sm" />
                        <Div className="flex-1 min-w-0">
                          <Div className="flex items-center gap-1.5">
                            <Span className="text-sm font-medium truncate hover:text-primary transition-colors">{client.name}</Span>
                            {client.is_leader && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />}
                            {rating !== null && (
                              <Span className={`inline-flex items-center gap-0.5 text-[10px] font-bold shrink-0 ${rankingColor(rating)}`}>
                                <Gem className="w-3 h-3" />{rating.toFixed(1)}
                              </Span>
                            )}
                            <Span className="text-[11px] text-muted-foreground/60 truncate flex-1 min-w-0 ml-1">{phrase}</Span>
                          </Div>
                          <Div className="flex items-center gap-1.5 mt-0.5">
                            <Span className="text-[11px] text-muted-foreground">
                              €<Span className="text-foreground font-medium">{lastRevenue.toLocaleString('it-IT')}</Span>
                            </Span>
                            <Span className="text-[11px] text-muted-foreground">·</Span>
                            <Span className={`text-[11px] ${daysAgo <= 7 ? 'text-emerald-400 font-medium' : 'text-muted-foreground'}`}>{formatDaysAgo(daysAgo)}</Span>
                          </Div>
                        </Div>
                        <Div className="flex items-center gap-1">
                          {phoneClean && (
                            <A href={`https://wa.me/${phoneClean}`} target="_blank" rel="noopener noreferrer" onClick={e => { e.stopPropagation(); markAsContacted(client.id); }} className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-colors">
                              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                            </A>
                          )}
                          {igHandle && (
                            <A href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-2 rounded-lg text-pink-400 hover:bg-pink-400/10 transition-colors">
                              <Instagram className="w-4 h-4" />
                            </A>
                          )}
                          <Btn
                            button
                            onClick={(e) => { e.stopPropagation(); markAsContacted(client.id); }}
                            className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                              contactStale
                                ? 'text-red-400 bg-red-400/5 border-red-400/25 hover:bg-red-400/10'
                                : contactedLabel
                                ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/25 hover:bg-emerald-400/10'
                                : 'text-muted-foreground bg-transparent border-border hover:border-emerald-400/40 hover:text-emerald-400'
                            }`}>
                            {contactedLabel ? (
                              <><CheckCircle2 className="w-3.5 h-3.5" />{contactedLabel}</>
                            ) : (
                              <><MessageCircle className="w-3.5 h-3.5" />Sentito?</>
                            )}
                          </Btn>
                        </Div>
                        {/* Badge urgenza cliccabile */}
                        <Div className="relative shrink-0">
                          <Btn
                            button
                            ref={isPopupOpen ? popupBadgeRef : null}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isPopupOpen) { setPopupData(null); return; }
                              const rect = e.currentTarget.getBoundingClientRect();
                              setPopupData({ client, daysAgo, lastRevenue, lastEvent, rating, badgeRect: rect });
                            }}
                            className={`text-[10px] font-semibold px-2 py-1 rounded-lg border flex items-center gap-1 shrink-0 transition-all ${urgencyClass} ${isPopupOpen ? 'ring-1 ring-current' : ''}`}>
                            <Clock className="w-3 h-3" />
                            {formatDaysAgo(daysAgo)}
                          </Btn>
                        </Div>
                      </Btn>

                      {/* MOBILE */}
                      <Btn className={`flex sm:hidden items-center gap-2.5 px-3 py-2.5 hover:bg-secondary/10 transition-colors cursor-pointer`} style={isSel(client.id) ? { backgroundColor: 'rgba(139, 92, 246, 0.18)' } : undefined} onClick={(e) => handleClientClick(e, client)}>
                        {selectMode && <SelectCheckbox selected={isSel(client.id)} />}
                        <ClientAvatar client={client} initials={initials} size="sm" />
                        <Div className="flex-1 min-w-0">
                          <Div className="flex items-center gap-1">
                            <Span className="text-[11px] font-medium line-clamp-2 leading-tight">{client.name}</Span>
                            {client.is_leader && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
                            {rating !== null && (
                              <Span className={`inline-flex items-center gap-0.5 text-[9px] font-bold shrink-0 ${rankingColor(rating)}`}>
                                <Gem className="w-2 h-2" />{rating.toFixed(1)}
                              </Span>
                            )}
                          </Div>
                          <P className="text-[10px] text-muted-foreground/70 break-words leading-tight mt-0.5">{phrase}</P>
                          <Div className="flex items-center gap-1.5 mt-0.5">
                            <Span className="text-[10px] text-muted-foreground">
                              €<Span className="text-foreground font-semibold">{lastRevenue.toLocaleString('it-IT')}</Span>
                            </Span>
                            {phoneClean && (
                              <A href={`https://wa.me/${phoneClean}`} target="_blank" rel="noopener noreferrer" onClick={e => { e.stopPropagation(); markAsContacted(client.id); }} className="text-emerald-400 rounded p-0.5">
                                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                              </A>
                            )}
                            {igHandle && (
                              <A href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-pink-400 rounded p-0.5">
                                <Instagram className="w-3.5 h-3.5" />
                              </A>
                            )}
                            <Btn
                              button
                              onClick={(e) => { e.stopPropagation(); markAsContacted(client.id); }}
                              className={`text-[10px] font-medium border rounded flex items-center gap-0.5 transition-all ${
                                contactStale
                                  ? 'text-red-400 bg-red-400/5 border-red-400/25 active:bg-red-400/10 px-1.5 py-0.5'
                                  : contactedLabel
                                  ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/25 px-1.5 py-0.5'
                                  : 'text-muted-foreground bg-transparent border-border active:border-emerald-400/40 active:text-emerald-400 px-1 py-0.5'
                              }`}>
                              {contactedLabel ? (
                                <><CheckCircle2 className="w-2.5 h-2.5" />{contactedLabel}</>
                              ) : (
                                <MessageCircle className="w-2.5 h-2.5" />
                              )}
                            </Btn>
                          </Div>
                        </Div>
                        {/* Badge urgenza cliccabile */}
                        <Div className="relative shrink-0">
                          <Btn
                            button
                            ref={isPopupOpen ? popupBadgeRef : null}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isPopupOpen) { setPopupData(null); return; }
                              const rect = e.currentTarget.getBoundingClientRect();
                              setPopupData({ client, daysAgo, lastRevenue, lastEvent, rating, badgeRect: rect });
                            }}
                            className={`text-[9px] font-semibold px-1.5 py-1 rounded-lg border flex items-center gap-1 shrink-0 transition-all ${urgencyClass} ${isPopupOpen ? 'ring-1 ring-current' : ''}`}>
                            <Clock className="w-2.5 h-2.5" />
                            {formatDaysAgo(daysAgo)}
                          </Btn>
                        </Div>
                      </Btn>
                    </Div>
                  </SwipeableRow>
                </Div>
              );
            })}
          </Div>
        )}
      </Div>

      {/* Popup evento — renderizzato via portal fuori da ogni container */}
      {popupData?.lastEvent && createPortal(
        <Btn
          className="fixed z-[9999] w-52 rounded-xl border border-border shadow-2xl p-3 space-y-2"
          style={{
            backgroundColor: '#13131a',
            top: (popupData.badgeRect?.bottom || 0) + 6,
            right: webWindow.innerWidth - (popupData.badgeRect?.right || 0),
          }}
          onClick={e => e.stopPropagation()}
        >
          <Div className="flex items-center justify-between">
            <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ultima presenza</P>
            <Btn
              button
              onClick={() => setPopupData(null)}
              className="text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </Btn>
          </Div>
          <Div className="flex items-center gap-2">
            {venueLogoMap[popupData.lastEvent.venue]
              ? <Img src={venueLogoMap[popupData.lastEvent.venue]} alt={popupData.lastEvent.venue} className="w-5 h-5 rounded object-contain shrink-0" />
              : <Div className="w-5 h-5 rounded bg-secondary shrink-0" />
            }
            <Span className="text-xs font-medium truncate">{popupData.lastEvent.venue || popupData.lastEvent.name}</Span>
          </Div>
          <P className="text-[10px] text-muted-foreground">{format(parseISO(popupData.lastEvent.date), 'dd MMMM yyyy', { locale: it })}</P>
          <P className="text-xs font-semibold text-primary">€{(popupData.lastRevenue || 0).toLocaleString('it-IT')}</P>
        </Btn>,
        webDocument.body
      )}

      {/* Footer compatto */}
      <Div className="px-4 py-2 border-t border-border text-center">
        <P className="text-[11px] text-muted-foreground">
          Swipe destra: contattato &nbsp;|&nbsp; Swipe sinistra: WhatsApp
        </P>
      </Div>
    </Div>
  );
}