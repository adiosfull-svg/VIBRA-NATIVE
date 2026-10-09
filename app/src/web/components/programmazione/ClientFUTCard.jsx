// Port di src/components/programmazione/ClientFUTCard.jsx (convertito da scripts/port/codemod.mjs).
import React from 'react';
import { Star, Gem, MessageCircle, Instagram, CheckCircle2, Phone, TrendingDown, TrendingUp, Minus } from '@/ui/icons.generated';
import { rankingColor } from '@/legacy/utils/clientRanking';
import { BADGE_META } from '@/legacy/utils/clientBadges';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import SelectCheckbox from '@/web/components/client/SelectCheckbox';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';

import { Btn, Div, P, Span } from '@/ui/html';
import { A } from '@/ui/elements';

const DAY_META = {
  fri: { label: 'Ven', color: '#60a5fa' },
  sat: { label: 'Sab', color: '#a78bfa' },
  sun: { label: 'Dom', color: '#f59e0b' },
  extra: { label: 'Extra', color: '#34d399' },
};

function dominantDay(stats) {
  const days = [
    { key: 'fri', v: stats.fri || 0 },
    { key: 'sat', v: stats.sat || 0 },
    { key: 'sun', v: stats.sun || 0 },
    { key: 'extra', v: stats.extra || 0 },
  ];
  days.sort((a, b) => b.v - a.v);
  if (days[0].v === 0) return null;
  return DAY_META[days[0].key];
}

function formatDaysAgo(days) {
  if (days === null) return 'Mai';
  if (days <= 7) return 'Ultimo we';
  if (days >= 60) return `${Math.round(days / 30)} mesi`;
  if (days >= 14) return `${Math.round(days / 7)} sett.`;
  return `${days}gg`;
}

function TrendPill({ pctChange, status }) {
  if (pctChange === null) return null;
  const isUp = status === 'up';
  const isDown = status === 'down';
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const color = isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-muted-foreground';
  const sign = pctChange > 0 ? '+' : '';
  return (
    <Span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${color}`}>
      <Icon className="w-2.5 h-2.5" />{sign}{pctChange}%
          </Span>
  );
}

/**
 * Card verticale stile FUT per un singolo cliente.
 * Banner colorato + avatar + nome + rating + mini stats + giorno dominante + badge + azioni rapide.
 */
export default function ClientFUTCard({ client, stats, ranking, trendFull, badges = [], accentColor = '#a78bfa', onContact, onDetail, contactLabel, contactStale }) {
  const initials = client.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const day = dominantDay(stats);
  const phoneClean = client.phone?.replace(/\s/g, '');
  const igHandle = client.instagram?.replace('@', '');
  const bulk = useBulkSelection();
  const selectMode = bulk?.selectMode;
  const selectedIds = bulk?.selectedIds;
  const toggleSelect = bulk?.toggleSelect;
  const isSel = !!selectedIds?.has(client.id);

  const handleClick = (e) => {
    if (selectMode) { toggleSelect?.(client); return; }
    if (e?.ctrlKey || e?.metaKey) { e.preventDefault(); toggleSelect?.(client); return; }
    onDetail?.(client);
  };

  return (
    <Btn
      className={`shrink-0 w-[180px] sm:w-full flex flex-col rounded-xl border bg-card overflow-hidden cursor-pointer hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200 ${isSel ? 'border-violet-500' : 'border-white/[0.06]'}`}
      style={{ boxShadow: `0 4px 18px -6px ${accentColor}22`, ...(isSel ? { backgroundColor: 'rgba(139, 92, 246, 0.12)' } : {}) }}
      onClick={handleClick}>
      {/* Banner */}
      <Div className="relative h-14 shrink-0" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}66)` }}>
        <Div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 20%, white, transparent 60%)' }} />
        {selectMode && (
          <Div className="absolute top-1.5 left-1.5 z-20">
            <SelectCheckbox selected={isSel} />
          </Div>
        )}
        {client.is_leader && !selectMode && (
          <Span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/30 text-yellow-300 backdrop-blur-sm">
            <Star className="w-2.5 h-2.5 fill-yellow-300 text-yellow-300" />Leader
          </Span>
        )}
        {day && (
          <Span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/35 text-white backdrop-blur-sm">
            {day.label}
          </Span>
        )}
      </Div>

      {/* Avatar sovrapposto */}
      <Div className="relative -mt-6 z-10 flex justify-center">
        <ClientAvatar client={client} initials={initials} size="lg" className="ring-2 ring-card" />
      </Div>

      {/* Nome + rating */}
      <Div className="px-2.5 pt-1.5 pb-1 text-center">
        <P className="text-sm font-semibold truncate leading-tight">{client.name}</P>
        <Div className="flex items-center justify-center gap-1 mt-0.5">
          {ranking !== null && (
            <Span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${rankingColor(ranking)}`}>
              <Gem className="w-2.5 h-2.5" />{ranking.toFixed(1)}
            </Span>
          )}
          {trendFull && <TrendPill pctChange={trendFull.pctChange} status={trendFull.status} />}
        </Div>
      </Div>

      {/* Mini stats */}
      <Div className="grid grid-cols-3 gap-0.5 px-1.5 py-1 mx-1.5 rounded-lg bg-secondary/30">
        <Div className="text-center">
          <P className="text-[8px] text-muted-foreground uppercase leading-none">Pres.</P>
          <P className="text-xs font-bold leading-tight">{stats.visits}</P>
        </Div>
        <Div className="text-center">
          <P className="text-[8px] text-muted-foreground uppercase leading-none">Spesa</P>
          <P className="text-xs font-bold text-primary leading-tight">€{(stats.totalSpent || 0).toLocaleString('it-IT')}</P>
        </Div>
        <Div className="text-center">
          <P className="text-[8px] text-muted-foreground uppercase leading-none">Ultima</P>
          <P className="text-xs font-bold leading-tight">{formatDaysAgo(trendFull?.daysAgo ?? null)}</P>
        </Div>
      </Div>

      {/* Badge */}
      {badges.length > 0 && (
        <Div className="flex flex-wrap justify-center gap-0.5 px-2 pt-1">
          {badges.slice(0, 4).map((b, i) => (
            <Span key={i} className="text-[11px] leading-none">{b}</Span>
          ))}
        </Div>
      )}

      {/* Azioni rapide */}
      <Btn className="flex items-center justify-center gap-1 px-2 pt-1.5 pb-2 mt-auto" onClick={e => e.stopPropagation()}>
        {phoneClean && (
          <A href={`https://wa.me/${phoneClean}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-colors" accessibilityLabel="WhatsApp">
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-400/20" />
          </A>
        )}
        {phoneClean && (
          <A href={`tel:${phoneClean}`} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors" accessibilityLabel="Chiama">
            <Phone className="w-3.5 h-3.5" />
          </A>
        )}
        {igHandle && (
          <A href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-pink-400 hover:bg-pink-400/10 transition-colors" accessibilityLabel="Instagram">
            <Instagram className="w-3.5 h-3.5" />
          </A>
        )}
        <Btn
          button
          onClick={() => onContact?.(client.id)}
          className={`text-[10px] font-medium px-2 py-1 rounded-lg border flex items-center gap-0.5 transition-all ${
            contactStale
              ? 'text-red-400 bg-red-400/5 border-red-400/25'
              : contactLabel
              ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/25'
              : 'text-muted-foreground bg-transparent border-border hover:border-emerald-400/40 hover:text-emerald-400'
          }`}>
          {contactLabel ? <CheckCircle2 className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
          {contactLabel || 'Sentito'}
        </Btn>
      </Btn>
    </Btn>
  );
}