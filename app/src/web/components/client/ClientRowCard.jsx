// Port di src/components/client/ClientRowCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { memo } from 'react';
import { Button } from '@/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/menu';
import { Star, UserPlus, BarChart2, Pencil, Trash2, MoreVertical, Gem, Bell, Check } from '@/ui/icons.generated';
import { BADGE_META } from '@/legacy/utils/clientBadges';
import { rankingColor } from '@/legacy/utils/clientRanking';
import TrendBadge from '@/web/components/client/TrendBadge';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import AddToGroupSubmenu from '@/web/components/client/AddToGroupSubmenu';
import ClientTipologiaBadge from '@/web/components/client/ClientTipologiaBadge';

import { Btn, Div, P, Span } from '@/ui/html';

// Colore rank (come TargetLocaleTab): oro/argento/bronzo per il podio, blu per il resto.
const RANK_COLOR = (i) => i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#fb923c' : '#60a5fa';

const ClientRowCard = memo(function ClientRowCard({ client, stats, badges = [], events = [], attendances = [], onDetail, onAddPresence, onEditAttendance, onEdit, onDelete, onSetReminder, position, selectMode, selected, onToggleSelect, highlighted }) {
  const initials = client.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  // Rating live dal clientStatsMap (ricalcolato dalle presenze reali) con fallback cum_rating
  const ranking = stats.rating !== undefined ? stats.rating : (stats.visits > 0 ? (client.cum_rating || 0) : null);
  const trend = client.cum_trend_status || null;

  return (
    /* MOBILE: card verticale */
    <Btn
      className={`sm:hidden clienti-card-row relative h-full flex flex-col gap-2 px-3 py-3 border-b border-border/50 hover:bg-secondary/10 active:bg-secondary/20 cursor-pointer transition-colors ${highlighted ? 'client-highlight-flash' : ''}`}
      style={selected ? { backgroundColor: 'rgba(139, 92, 246, 0.18)' } : undefined}
      onClick={() => selectMode ? onToggleSelect?.(client) : onDetail(client)}>
      {selectMode && (
        <Span className={`absolute top-2 right-2 z-20 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${selected ? 'bg-violet-500 border-violet-500' : 'border-muted-foreground/40 bg-background/60'}`}>
          {selected && <Check className="w-3 h-3 text-white" />}
        </Span>
      )}
      {/* Bollino posizione classifica — angolo in alto a sinistra, forma geometrica
          incastrata nell'angolo (sharp TL, rounded BR). Sempre nella stessa posizione. */}
      {position != null && (
        <Span
          className="absolute top-0 left-0 flex items-center justify-center text-[10px] font-bold tabular-nums leading-none select-none z-10"
          style={{
            width: 19,
            height: 19,
            color: RANK_COLOR(position - 1),
            background: 'hsl(var(--card))',
            borderRadius: '0 0 7px 0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
            borderRight: '1px solid hsl(var(--border))',
            borderBottom: '1px solid hsl(var(--border))',
          }}
        >
          {position}
        </Span>
      )}
      <Div className="flex items-center justify-between gap-2 pl-2">
        {/* Avatar + Nome */}
        <Div className="flex items-center gap-2 min-w-0">
          <ClientAvatar client={client} initials={initials} size="sm" />
          <Div className="min-w-0">
            <Div className="flex items-center gap-1 flex-wrap">
              <P className="font-semibold text-sm truncate">{client.name}</P>
              {client.is_leader && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
              {ranking !== null && (
                <Span className={`inline-flex items-center gap-0.5 text-xs font-bold shrink-0 ${rankingColor(ranking)}`}>
                  <Gem className="w-3 h-3" />{ranking.toFixed(1)}
                </Span>
              )}
              <TrendBadge trend={trend} />
            </Div>
            <Div className="flex items-center gap-1 flex-nowrap overflow-hidden mt-0.5">
              {client.tipologia_cliente && <ClientTipologiaBadge tipologia={client.tipologia_cliente} />}
              {badges.map((badge, i) => {
                const meta = BADGE_META[badge];
                return (
                  <Span key={i} className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1 py-0.5 rounded border ${meta?.color}`}>
                    <Span className="text-[10px]">{badge}</Span>
                    <Span>{meta?.label}</Span>
                  </Span>
                );
              })}
            </Div>
          </Div>
        </Div>

        {/* Azioni — nascoste in modalità selezione multipla per evitare tap
            accidentali sui bottoni per-riga (Aggiungi presenza, menu) */}
        {!selectMode && (
        <Btn className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-green-400 text-xs gap-1" onClick={() => onAddPresence(client, stats.attendances)}>
            <UserPlus className="w-3.5 h-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-sm">
              <DropdownMenuItem onClick={() => onEditAttendance(client, stats.attendances)}>
                <BarChart2 className="w-3.5 h-3.5 mr-2" />Gestisci presenze
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(client)}>
                <Pencil className="w-3.5 h-3.5 mr-2" />Modifica cliente
              </DropdownMenuItem>
              <AddToGroupSubmenu client={client} />
              {onSetReminder && (
                <DropdownMenuItem onClick={() => onSetReminder(client)}>
                  <Bell className="w-3.5 h-3.5 mr-2" />Ricordami di ricontattarlo
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(client.id)}>
                <Trash2 className="w-3.5 h-3.5 mr-2" />Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Btn>
        )}
      </Div>

      {/* Stats row */}
      <Div className="grid grid-cols-4 gap-1 pl-12">
        <Div className="text-center">
          <P className="text-[10px] text-muted-foreground">Pres.</P>
          <P className="font-bold text-sm">{stats.visits}</P>
        </Div>
        <Div className="text-center">
          <P className="text-[10px] text-muted-foreground">Spesa tot.</P>
          <P className="font-bold text-sm text-primary">€{stats.totalSpent.toLocaleString('it-IT')}</P>
        </Div>
        <Div className="text-center">
          <P className="text-[10px] text-muted-foreground">Media</P>
          <P className="font-semibold text-sm">€{stats.avgSpent.toLocaleString('it-IT')}</P>
        </Div>
        <Div className="text-center">
          <P className="text-[10px] text-muted-foreground">Nuove</P>
          <P className={`font-semibold text-sm ${(client.new_people_brought || 0) > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>
            {client.new_people_brought || 0}
          </P>
        </Div>
      </Div>
    </Btn>
  );
});

export default ClientRowCard;