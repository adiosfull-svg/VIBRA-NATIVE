// Port di src/components/client/ClientTableRow.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Star, Gem, MoreVertical, CalendarPlus, BarChart2, Pencil, Trash2, Check } from '@/ui/icons.generated';
import { Button } from '@/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/menu';
import TrendBadge from '@/web/components/client/TrendBadge';
import { BADGE_META } from '@/legacy/utils/clientBadges';
import { rankingColor } from '@/legacy/utils/clientRanking';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import ClientRowHoverPanel from '@/web/components/client/ClientRowHoverPanel';
import AddToGroupSubmenu from '@/web/components/client/AddToGroupSubmenu';

import { Btn, Div, P, Span } from '@/ui/html';

/**
 * Riga tabella desktop (div-based per compatibilità con react-window) — memoizzata
 * per evitare re-render costosi durante lo scroll virtualizzato.
 */
const ClientTableRow = React.memo(function ClientTableRow({
  client,
  rowData,
  position,
  style,
  referredName,
  onDetail,
  onAddPresence,
  onEditAttendance,
  onEdit,
  onDelete,
  selectMode,
  selected,
  onToggleSelect,
  highlighted,
}) {
  const { stats, badges, ranking, trend, initials } = rowData;
  // Il panel hover è visibile subito (CSS), ma rimane "passante" ai click finché
  // l'utente non muove il mouse sopra la riga: così il primo click dopo l'apertura
  // dell'hover apre sempre il dettaglio cliente. Solo muovendo il mouse si
  // "sblocca" il panel e i suoi link diventano cliccabili.
  const [interactive, setInteractive] = useState(false);

  return (
    <Btn
      style={{ ...style, ...(selected ? { backgroundColor: 'rgba(139, 92, 246, 0.18)' } : {}) }}
      className={`clienti-table-row group relative flex items-center border-b border-border/40 hover:bg-secondary/20 transition-colors cursor-pointer h-full ${highlighted ? 'client-highlight-flash' : ''}`}
      onClick={(e) => {
        if (selectMode) { onToggleSelect?.(client); }
        else if (e.ctrlKey || e.metaKey) { e.preventDefault(); onToggleSelect?.(client); }
        else onDetail(client);
      }}
      onMouseMove={() => setInteractive(true)}
      onMouseLeave={() => setInteractive(false)}>
      <Div className="px-0.5 py-2 w-5 text-center shrink-0">
      {selectMode ? (
        <Span className={`inline-flex w-4 h-4 rounded-full items-center justify-center border-2 ${selected ? 'bg-violet-500 border-violet-500' : 'border-muted-foreground/40'}`}>
          {selected && <Check className="w-2.5 h-2.5 text-white" />}
        </Span>
      ) : <Span className="text-[8px] font-mono text-muted-foreground/60">{position ?? ''}</Span>}
      </Div>
      <Div className="pl-1 pr-3 py-2 flex-1 min-w-[200px] relative flex items-center">
        <Div className="flex items-center gap-2 shrink-0 min-w-0">
          <ClientAvatar client={client} initials={initials} size="md" />
          <Div className="min-w-0">
            <Div className="flex items-center gap-1">
              <P className="font-medium text-xs truncate">{client.name}</P>
              {client.is_leader && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
              {ranking !== null && (
                <Span className={`inline-flex items-center gap-0.5 text-xs font-bold shrink-0 ${rankingColor(ranking)}`}>
                  <Gem className="w-3 h-3" />{ranking.toFixed(1)}
                </Span>
              )}
              <TrendBadge trend={trend} />
            </Div>
            {badges.length > 0 && (
              <Div className="flex items-center gap-1 flex-nowrap overflow-hidden mt-0.5">
                {badges.slice(0, 2).map((badge, i) => {
                  const meta = BADGE_META[badge];
                  return (
                    <Span key={i} className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1 py-0.5 rounded border shrink-0 ${meta?.color}`}>
                      <Span className="text-[10px]">{badge}</Span>
                      <Span>{meta?.label}</Span>
                    </Span>
                  );
                })}
              </Div>
            )}
          </Div>
        </Div>
      </Div>
      <Div className="px-3 py-2 w-20 text-center shrink-0">
        <Span className="font-semibold text-xs">{stats.visits}</Span>
        <Div className="flex gap-1 text-[9px] text-muted-foreground justify-center mt-0.5">
          <Span>V:<Span className='font-bold text-foreground'>{stats.fri}</Span></Span>
          <Span>S:<Span className='font-bold text-foreground'>{stats.sat}</Span></Span>
          <Span>D:<Span className='font-bold text-foreground'>{stats.sun}</Span></Span>
          {stats.extra > 0 && <Span>E:<Span className='font-bold text-foreground'>{stats.extra}</Span></Span>}
        </Div>
      </Div>
      <Div className="px-3 py-2 w-28 text-right font-bold text-primary text-xs shrink-0">€{stats.totalSpent.toLocaleString('it-IT')}</Div>
      <Div className="px-3 py-2 w-24 text-right text-muted-foreground text-xs shrink-0">€{stats.avgSpent.toLocaleString('it-IT')}</Div>
      <Div className="px-3 py-2 w-24 text-center shrink-0">
        <Span className={`font-semibold text-xs ${(client.new_people_brought || 0) > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>
          {client.new_people_brought || 0}
        </Span>
      </Div>
      <Btn className="px-3 py-2 w-36 text-right shrink-0" onClick={e => e.stopPropagation()}>
        <Div className="flex justify-end items-center gap-0.5">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-green-400 text-xs gap-1" onClick={() => onAddPresence(client, stats)}>
            <CalendarPlus className="w-3 h-3" />
            <Span className="text-[10px]">Aggiungi</Span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-sm">
              <DropdownMenuItem onClick={() => onEditAttendance(client, stats)}>
                <BarChart2 className="w-3.5 h-3.5 mr-2" />Gestisci presenze
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(client)}>
                <Pencil className="w-3.5 h-3.5 mr-2" />Modifica cliente
              </DropdownMenuItem>
              <AddToGroupSubmenu client={client} />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(client.id)}>
                <Trash2 className="w-3.5 h-3.5 mr-2" />Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Div>
      </Btn>
      <ClientRowHoverPanel client={client} referredName={referredName} interactive={interactive} />
    </Btn>
  );
}, (prevProps, nextProps) => {
  // Ri-renderizza solo se cambiano client o rowData, ignora handler identity
  return prevProps.client.id === nextProps.client.id
    && prevProps.rowData === nextProps.rowData
    && prevProps.position === nextProps.position
    && prevProps.selectMode === nextProps.selectMode
    && prevProps.selected === nextProps.selected
    && prevProps.highlighted === nextProps.highlighted;
});

export default ClientTableRow;