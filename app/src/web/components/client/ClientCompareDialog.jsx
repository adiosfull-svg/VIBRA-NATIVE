// Port di src/components/client/ClientCompareDialog.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - createPortal: usare Modal/Portal nativi
//  - document.body
import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, TrendingUp, TrendingDown, Minus, Star, Car, Phone, Instagram, Calendar, Wallet, Award, Users, MapPin, Trophy, UserCircle } from '@/ui/icons.generated';
import CachedImage from '@/web/components/shared/CachedImage';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { lockScroll } from '@/web/lib/scrollLock';

import { Btn, Div, P, Span } from '@/ui/html';

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus };
const TREND_COLOR = { up: 'text-emerald-400', down: 'text-red-400', stable: 'text-muted-foreground' };
const SOURCE_LABELS = {
  instagram: 'Instagram', tiktok: 'TikTok', direct: 'Diretto',
  referred: 'Tramite', paganti_acquisiti: 'Paganti',
};

function getInitials(name) {
  return (name || '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

function StatRow({ icon: Icon, label, value, best, color = 'text-violet-300' }) {
  return (
    <Div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors ${best ? 'bg-amber-500/10 ring-1 ring-amber-500/30' : 'bg-secondary/20'}`}>
      <Icon className={`w-3.5 h-3.5 shrink-0 ${best ? 'text-amber-400' : color}`} />
      <Span className="text-[10px] text-muted-foreground shrink-0">{label}</Span>
      <Span className={`ml-auto text-xs font-bold ${best ? 'text-amber-300' : 'text-foreground'}`}>
        {best && <Trophy className="w-3 h-3 inline mr-1 -mt-0.5 text-amber-400" />}
        {value}
      </Span>
    </Div>
  );
}

function ClientCard({ client, stats, badges, bests, clientNameMap }) {
  const initials = getInitials(client.name);
  const trend = client.cum_trend_status || 'stable';
  const TrendIcon = TREND_ICON[trend] || Minus;
  const trendPct = client.cum_trend_pct || 0;
  const trendLabel = trend === 'stable' ? 'Stabile' : `${trendPct > 0 ? '+' : ''}${trendPct}%`;
  const visits = stats?.visits ?? client.cum_visits ?? 0;
  const totalSpent = stats?.totalSpent ?? client.cum_total_spent ?? 0;
  const avgSpent = stats?.avgSpent ?? client.cum_avg_spent ?? 0;
  const rating = client.cum_rating || 0;
  const newPeople = client.new_people_brought || 0;

  return (
    <Div className="w-[210px] shrink-0 rounded-2xl border border-border/50 bg-card overflow-hidden flex flex-col">
      {/* Avatar + Name */}
      <Div className="relative flex flex-col items-center pt-5 pb-3 px-3"
        style={{ background: 'linear-gradient(180deg, hsl(271 40% 15% / 0.4), transparent)' }}>
        <Div className="relative">
          <Div className="w-16 h-16 rounded-full ring-2 ring-violet-400/40 overflow-hidden bg-gradient-to-br from-violet-500/30 to-fuchsia-500/15 flex items-center justify-center font-bold text-lg text-violet-100">
            {client.photo_url
              ? <CachedImage src={client.photo_url} alt={client.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              : initials}
          </Div>
          {client.is_leader && (
            <Div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500/20 ring-1 ring-amber-400/40 flex items-center justify-center">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            </Div>
          )}
          {client.is_driver && (
            <Div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500/20 ring-1 ring-red-400/40 flex items-center justify-center">
              <Car className="w-3 h-3 text-red-400" />
            </Div>
          )}
        </Div>
        <P className="mt-2 text-sm font-semibold text-center text-foreground truncate w-full">{client.name}</P>
        {client.source_type && (
          <Span className="mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300">
            {client.source_type === 'referred' && client.referred_by_client_id && clientNameMap?.[client.referred_by_client_id]
              ? `Tramite ${clientNameMap[client.referred_by_client_id]}`
              : (SOURCE_LABELS[client.source_type] || client.source_type)}
          </Span>
        )}
      </Div>

      {/* Stats */}
      <Div className="px-2 py-2 space-y-1.5 flex-1">
        <StatRow icon={Calendar} label="Presenze" value={visits} best={bests.visits === client.id && visits > 0} />
        <StatRow icon={Wallet} label="Spesa tot." value={`€${totalSpent}`} best={bests.spent === client.id && totalSpent > 0} color="text-emerald-400" />
        <StatRow icon={Award} label="Media" value={`€${avgSpent}`} best={bests.avg === client.id && avgSpent > 0} color="text-emerald-400" />
        <StatRow icon={Star} label="Rating" value={rating ? rating.toFixed(1) : '—'} best={bests.rating === client.id && rating > 0} color="text-amber-400" />
        <Div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${trend !== 'stable' ? 'bg-secondary/20' : 'bg-secondary/20'}`}>
          <TrendIcon className={`w-3.5 h-3.5 shrink-0 ${TREND_COLOR[trend]}`} />
          <Span className="text-[10px] text-muted-foreground shrink-0">Trend</Span>
          <Span className={`ml-auto text-xs font-bold ${TREND_COLOR[trend]}`}>{trendLabel}</Span>
        </Div>
        <StatRow icon={Users} label="Nuove" value={newPeople} best={bests.newPeople === client.id && newPeople > 0} color="text-blue-400" />
      </Div>

      {/* Day breakdown */}
      <Div className="px-2.5 pb-2">
        <Div className="flex gap-1">
          {[
            { label: 'Ven', val: stats?.fri ?? client.cum_fri ?? 0, color: 'text-violet-300' },
            { label: 'Sab', val: stats?.sat ?? client.cum_sat ?? 0, color: 'text-fuchsia-300' },
            { label: 'Dom', val: stats?.sun ?? client.cum_sun ?? 0, color: 'text-blue-300' },
            { label: 'Extra', val: stats?.extra ?? client.cum_extra ?? 0, color: 'text-amber-300' },
          ].map(d => (
            <Div key={d.label} className="flex-1 flex flex-col items-center py-1.5 rounded-md bg-secondary/20">
              <Span className="text-[9px] text-muted-foreground">{d.label}</Span>
              <Span className={`text-xs font-bold ${d.color}`}>{d.val}</Span>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Contact */}
      <Div className="px-2.5 pb-2 space-y-1 border-t border-border/30 pt-2">
        {client.phone && (
          <Div className="flex items-center gap-1.5 text-[10px]">
            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
            <Span className="truncate text-foreground">{client.phone}</Span>
          </Div>
        )}
        {client.instagram && (
          <Div className="flex items-center gap-1.5 text-[10px]">
            <Instagram className="w-3 h-3 text-pink-400 shrink-0" />
            <Span className="truncate text-foreground">@{client.instagram}</Span>
          </Div>
        )}
        {client.residenza_key && (
          <Div className="flex items-center gap-1.5 text-[10px]">
            <MapPin className="w-3 h-3 text-violet-400 shrink-0" />
            <Span className="truncate text-muted-foreground">{client.residenza_key.replace(/_/g, ' ')}</Span>
          </Div>
        )}
      </Div>

      {/* Notes */}
      {client.notes && (
        <Div className="px-2.5 pb-2.5 border-t border-border/30 pt-2">
          <P className="text-[10px] text-muted-foreground line-clamp-3">{client.notes}</P>
        </Div>
      )}
    </Div>
  );
}

export default function ClientCompareDialog({ clients, statsMap, badgesMap, allClients, onClose }) {
  useOverlay(true, onClose);

  useEffect(() => lockScroll(), []);

  const clientNameMap = useMemo(() => {
    const map = {};
    (allClients || clients || []).forEach(c => { map[c.id] = c.name; });
    return map;
  }, [allClients, clients]);

  const bests = useMemo(() => {
    if (!clients || clients.length < 2) return {};
    let bestVisits = null, bestSpent = null, bestAvg = null, bestRating = null, bestNew = null;
    for (const c of clients) {
      const s = statsMap?.[c.id] || {};
      const v = s.visits ?? c.cum_visits ?? 0;
      const sp = s.totalSpent ?? c.cum_total_spent ?? 0;
      const av = s.avgSpent ?? c.cum_avg_spent ?? 0;
      const r = c.cum_rating || 0;
      const np = c.new_people_brought || 0;
      if (bestVisits === null || v > (bestVisits._v ?? -1)) bestVisits = { id: c.id, _v: v };
      if (bestSpent === null || sp > (bestSpent._v ?? -1)) bestSpent = { id: c.id, _v: sp };
      if (bestAvg === null || av > (bestAvg._v ?? -1)) bestAvg = { id: c.id, _v: av };
      if (bestRating === null || r > (bestRating._v ?? -1)) bestRating = { id: c.id, _v: r };
      if (bestNew === null || np > (bestNew._v ?? -1)) bestNew = { id: c.id, _v: np };
    }
    return {
      visits: bestVisits?.id, spent: bestSpent?.id, avg: bestAvg?.id,
      rating: bestRating?.id, newPeople: bestNew?.id,
    };
  }, [clients, statsMap]);

  if (!clients || clients.length === 0) return null;

  return createPortal(
    <Div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      <Btn className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <Div className="relative w-full max-w-4xl rounded-2xl border border-violet-500/20 bg-popover shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        style={{ boxShadow: '0 12px 48px -8px rgba(167,139,250,0.3)' }}>
        {/* Header */}
        <Div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0"
          style={{ background: 'linear-gradient(90deg, hsl(271 40% 15% / 0.5), transparent)' }}>
          <Div className="flex items-center gap-2">
            <Div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <UserCircle className="w-4 h-4 text-violet-300" />
            </Div>
            <Div>
              <P className="text-sm font-semibold text-foreground">Confronta clienti</P>
              <P className="text-[10px] text-muted-foreground">{clients.length} selezionati · 🏆 = migliore</P>
            </Div>
          </Div>
          <Btn onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
            <X className="w-4 h-4" />
          </Btn>
        </Div>

        {/* Cards */}
        <Div className="overflow-x-auto overflow-y-hidden flex-1">
          <Div className="flex gap-3 p-4" style={{ minWidth: 'min-content' }}>
            {clients.map(c => (
              <ClientCard
                key={c.id}
                client={c}
                stats={statsMap?.[c.id]}
                badges={badgesMap?.[c.id] || []}
                bests={bests}
                clientNameMap={clientNameMap}
              />
            ))}
          </Div>
        </Div>
      </Div>
    </Div>,
    document.body
  );
}