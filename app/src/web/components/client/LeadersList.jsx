// Port di src/components/client/LeadersList.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Star, Instagram, MessageCircle, CheckCircle2, Clock, GitBranch } from '@/ui/icons.generated';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/menu';
import { differenceInDays, parseISO, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import TrendBadge from '@/web/components/client/TrendBadge';
import SelectCheckbox from '@/web/components/client/SelectCheckbox';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import WhatsAppIcon from '@/web/components/shared/WhatsAppIcon';

import { Btn, Div, P, Span } from '@/ui/html';
import { A, Img } from '@/ui/elements';

import { doc as webDocument } from '@/web/shims/dom';

const TIER_META = {
  gold:   { label: 'Oro', starClass: 'text-yellow-400 fill-yellow-400' },
  silver: { label: 'Argento', starClass: 'text-slate-300 fill-slate-300' },
  bronze: { label: 'Bronzo', starClass: 'text-amber-600 fill-amber-600' },
};

function formatAbsenceBadge(days) {
  if (days === null) return null;
  if (days >= 60) {
    const m = Math.round(days / 30);
    return { label: `${m} mes${m === 1 ? 'e' : 'i'}`, color: 'text-red-400 bg-red-400/10 border-red-400/30' };
  }
  if (days >= 14) {
    const w = Math.round(days / 7);
    return { label: `${w} sett.`, color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' };
  }
  return { label: `${days}gg`, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' };
}

function formatContactTime(last_contacted_at) {
  if (!last_contacted_at) return null;
  const days = differenceInDays(new Date(), new Date(last_contacted_at));
  if (days === 0) return 'Oggi';
  if (days === 1) return 'Ieri';
  if (days < 7) return `${days}gg fa`;
  const weeks = Math.floor(days / 7);
  return `${weeks}sett. fa`;
}

function SwipeableLeaderRow({ children, onSwipeRight, onSwipeLeft, hasPhone, disabled }) {
  const [offset, setOffset] = useState(0);
  const [swiped, setSwiped] = useState(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);
  const offsetRef = useRef(0);
  const threshold = 60;

  const onTouchStart = useCallback((e) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    swiping.current = false;
  }, [disabled]);

  const onTouchMove = useCallback((e) => {
    if (disabled) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!swiping.current) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        swiping.current = true;
      }
      return;
    }
    const clamped = Math.max(-120, Math.min(120, dx));
    offsetRef.current = clamped;
    setOffset(clamped);
  }, [disabled]);

  const onTouchEnd = useCallback(() => {
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
  }, [hasPhone]);

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
          <Span className="text-[11px] font-semibold">Sentito</Span>
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
        onTouchEnd={onTouchEnd}>
        {children}
      </Div>
    </Div>
  );
}

/**
 * Lista leader condivisa tra il box Leader di Clienti (ordinata per impatto)
 * e il tab Leader del Weekend (ordinata per ultimo aggiunto).
 * Schema riga identico: stella tier, nome + trend, presenze/spesa/nuovi,
 * Instagram, bottone Sentito (swipe), badge assenza con popup ultima presenza, rete.
 *
 * @param {Array}  leaders       - client raw (devono avere cum_* e is_leader)
 * @param {Array}  events        - eventi (per totalEvents / consistenza)
 * @param {string} sortBy        - 'impact' (default) | 'recent' (leader_since desc)
 * @param {Function} onClientClick
 * @param {Function} onViewNetwork
 */
export default function LeadersList({ leaders, events = [], sortBy = 'impact', onClientClick, onViewNetwork }) {
  const today = new Date();
  const qc = useQueryClient();
  const { getVenueLogo } = useAllVenueLogos();
  const bulk = useBulkSelection();
  const selectMode = bulk?.selectMode;
  const selectedIds = bulk?.selectedIds;
  const toggleSelect = bulk?.toggleSelect;
  const isSel = (id) => !!selectedIds?.has(id);

  const markAsContacted = async (clientId) => {
    await base44.entities.Client.update(clientId, { last_contacted_at: new Date().toISOString() });
    qc.invalidateQueries({ queryKey: ['clients'] });
  };

  const totalEvents = events.filter(e => e.date).length;

  const withMetrics = leaders.map(c => {
    const visits = c.cum_visits || 0;
    const totalSpent = c.cum_total_spent || 0;
    const newPeople = c.new_people_brought || 0;
    const consistency = totalEvents > 0 ? (visits / totalEvents) * 100 : 0;
    const impactScore = totalSpent + (visits * 50) + (newPeople * 150) + (consistency * 200);

    const lastDate = c.cum_last_attendance_date || null;
    const daysAgo = lastDate ? differenceInDays(today, parseISO(lastDate)) : null;
    const trend = c.cum_trend_status || null;
    const lastEvent = c.cum_last_event_venue ? { venue: c.cum_last_event_venue, date: lastDate } : null;

    return { client: c, visits, totalSpent, newPeople, consistency, impactScore, daysAgo, lastEvent, lastRevenue: c.cum_last_revenue || 0, trend };
  });

  // Tier basati su impatto (percentili) — indipendenti dall'ordinamento
  const totalL = withMetrics.length;
  const byImpact = [...withMetrics].sort((a, b) => b.impactScore - a.impactScore);
  byImpact.forEach((item, i) => {
    const pct = totalL > 0 ? (i + 1) / totalL : 1;
    if (pct <= 0.2) item.tier = 'gold';
    else if (pct <= 0.5) item.tier = 'silver';
    else item.tier = 'bronze';
  });

  // Ordinamento finale
  const sorted = sortBy === 'recent'
    ? [...withMetrics].sort((a, b) => {
        const aDate = a.client.leader_since || a.client.created_date || '';
        const bDate = b.client.leader_since || b.client.created_date || '';
        return bDate.localeCompare(aDate);
      })
    : sortBy === 'recency'
      ? [...withMetrics].sort((a, b) => {
          const aDate = a.client.cum_last_attendance_date || '';
          const bDate = b.client.cum_last_attendance_date || '';
          return bDate.localeCompare(aDate);
        })
      : byImpact;

  if (sorted.length === 0) {
    return <P className="text-sm text-muted-foreground text-center py-6">Nessun leader registrato</P>;
  }

  return (
    <Div className="space-y-2 pb-2">
      {sorted.map(({ client: c, daysAgo, lastEvent, lastRevenue, tier, visits, totalSpent, newPeople, trend }) => {
        const badge = daysAgo !== null ? formatAbsenceBadge(daysAgo) : null;
        const { logoUrl: logo } = getVenueLogo(lastEvent?.venue);
        const tm = TIER_META[tier];
        const contactedLabel = formatContactTime(c.last_contacted_at);
        const daysSinceContacted = c.last_contacted_at ? differenceInDays(today, new Date(c.last_contacted_at)) : null;
        const contactStale = daysSinceContacted !== null && daysSinceContacted > 8;
        return (
          <SwipeableLeaderRow key={c.id} onSwipeRight={() => markAsContacted(c.id)} onSwipeLeft={() => { const p = c.phone?.replace(/[^0-9]/g, ''); if (p) { const a = webDocument.createElement('a'); a.href = `https://wa.me/${p}`; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.click(); } }} hasPhone={!!c.phone} disabled={selectMode}>
            <Btn
              onClick={(e) => {
                if (selectMode) { toggleSelect?.(c); return; }
                if (e?.ctrlKey || e?.metaKey) { e.preventDefault(); toggleSelect?.(c); return; }
                onClientClick?.(c);
              }}
              className={`flex items-center gap-2 rounded-xl bg-gradient-to-br from-secondary/40 to-secondary/10 border border-white/10 px-3 py-2 ${(onClientClick || selectMode) ? 'cursor-pointer hover:from-secondary/50 hover:to-secondary/20 transition-colors' : ''} ${isSel(c.id) ? 'border-violet-500 ring-1 ring-violet-500/30' : ''}`}
              style={isSel(c.id) ? { backgroundColor: 'rgba(139, 92, 246, 0.18)' } : undefined}>
              {selectMode && <SelectCheckbox selected={isSel(c.id)} />}
              <Star className={`w-3 h-3 shrink-0 ${tm.starClass}`} />
              <Div className="flex-1 min-w-0">
                <Div className="flex items-center gap-1.5">
                  <Span className="text-[11px] font-medium leading-tight">{c.name}</Span>
                  <TrendBadge trend={trend} />
                </Div>
                <Div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <Span className="text-[9px] text-muted-foreground">
                    <Span className="text-foreground font-medium">{visits}</Span> pres.
                  </Span>
                  <Span className="text-[9px] text-muted-foreground">·</Span>
                  <Span className="text-[9px] text-muted-foreground">
                    €<Span className="text-foreground font-medium">{totalSpent.toLocaleString('it-IT')}</Span>
                  </Span>
                  {newPeople > 0 && (
                    <Span className="text-[9px] text-amber-400 font-medium">+{newPeople} nuovi</Span>
                  )}
                </Div>
              </Div>
              {c.instagram && (
                <A
                  href={`https://instagram.com/${c.instagram.replace('@', '')}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-pink-400 hover:bg-pink-400/10 transition-colors shrink-0"
                  accessibilityLabel={`@${c.instagram.replace('@', '')}`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                </A>
              )}
              {c.phone && (
                <A
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={(e) => { e.stopPropagation(); markAsContacted(c.id); }}
                  className="p-1.5 rounded-lg text-[#25D366] hover:bg-[#25D366]/10 transition-colors shrink-0"
                  accessibilityLabel="Contatta su WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </A>
              )}
              <Btn
                button
                onClick={(e) => { e.stopPropagation(); markAsContacted(c.id); }}
                className={`text-[9px] font-medium border rounded flex items-center gap-0.5 px-1.5 py-0.5 shrink-0 transition-all ${
                  contactStale
                    ? 'text-red-400 bg-red-400/5 border-red-400/25'
                    : contactedLabel
                    ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/25'
                    : 'text-muted-foreground border-border'
                }`}>
                {contactedLabel ? (
                  <><CheckCircle2 className="w-2.5 h-2.5" />{contactedLabel}</>
                ) : (
                  <><MessageCircle className="w-2.5 h-2.5" />Sentito?</>
                )}
              </Btn>
              {badge && lastEvent ? (
                <Div className="shrink-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Btn
                        button
                        onClick={(e) => e.stopPropagation()}
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all ${badge.color}`}>
                        <Clock className="w-2.5 h-2.5" />
                        {badge.label}
                      </Btn>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-52 p-3 space-y-2"
                      align="end"
                      side="bottom"
                      onClick={e => e.stopPropagation()}
                    >
                      <P className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ultima presenza</P>
                      <Div className="flex items-center gap-2">
                        {logo
                          ? <Img
                          src={logo}
                          alt={lastEvent.venue}
                          className="w-5 h-5 rounded object-contain shrink-0" />
                          : <Div className="w-5 h-5 rounded bg-secondary shrink-0" />}
                        <Span className="text-xs font-medium truncate">{lastEvent.venue || lastEvent.name}</Span>
                      </Div>
                      <P className="text-[10px] text-muted-foreground">{format(parseISO(lastEvent.date), 'dd MMMM yyyy', { locale: it })}</P>
                      <P className="text-xs font-semibold text-primary">€{(lastRevenue || 0).toLocaleString('it-IT')}</P>
                    </PopoverContent>
                  </Popover>
                </Div>
              ) : badge ? (
                <Span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${badge.color} shrink-0`}>
                  <Clock className="w-2.5 h-2.5" />
                  {badge.label}
                </Span>
              ) : null}
              {daysAgo === null && (
                <Span className="text-[10px] text-muted-foreground shrink-0">Mai venuto</Span>
              )}
              {onViewNetwork && (
                <Btn
                  button
                  onClick={(e) => { e.stopPropagation(); onViewNetwork(c.id); }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                  accessibilityLabel="Vedi rete">
                  <GitBranch className="w-3.5 h-3.5" />
                </Btn>
              )}
            </Btn>
          </SwipeableLeaderRow>
        );
      })}
    </Div>
  );
}