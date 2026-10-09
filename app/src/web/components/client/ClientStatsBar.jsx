// Port di src/components/client/ClientStatsBar.jsx (convertito da scripts/port/codemod.mjs).
// PORT-TODO (da sistemare a mano):
//  - createPortal: usare Modal/Portal nativi
//  - <div> gesture/eventi web rimossi: onTouchMove, onTouchStart
//  - <div> gesture/eventi web rimossi: onTouchStart, onTouchMove
//  - document.body
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Users, Star, UsersRound, X } from '@/ui/icons.generated';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import TrendBadge from '@/web/components/client/TrendBadge';
import ClientStatMiniCard from '@/web/components/client/ClientStatMiniCard';
import LeadersList from '@/web/components/client/LeadersList';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { lockScroll } from '@/web/lib/scrollLock';


import { Btn, Div, H, P, Span } from '@/ui/html';


function getLastVisitDays(client, attendances) {
  const clientAtts = attendances.filter(a => a.client_id === client.id);
  if (clientAtts.length === 0) return null;
  // We need event dates — stored in attendances as event_id; we use updated_date as fallback
  // Actually we'll pass events in props
  return null;
}

// Dialog modale semplice senza Radix (per controllo totale del touch su mobile)
function MobileModal({ open, onClose, title, children, scrollClass, skipOwnHistory }) {
  // Scroll lock ref-counted: blocca body+html quando il modale è aperto
  useEffect(() => { if (!open) return; return lockScroll(); }, [open]);
  const scrollRef = useRef(null);

  // Back button gestito dallo stack centralizzato (OverlayStackContext).
  // Se skipOwnHistory è true, la gestione è delegata a uno stack esterno.
  useOverlay(open, () => onClose(), skipOwnHistory);

  if (!open) return null;

  const handleOverlayTouch = (e) => {
    // Blocca il touch sull'overlay (non sul contenuto)
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  const handleContentTouch = (e) => {
    e.stopPropagation();
  };

  // Renderizzato via portal in document.body: altrimenti resterebbe intrappolato
  // dentro il contenitore con transform delle transizioni di pagina (AnimatedOutlet),
  // che spezza il "position: fixed" e lo terrebbe sotto ai dialog Radix (es. dettaglio cliente).
  return createPortal(
    <Btn
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ touchAction: 'none' }}>
      <Div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-card to-background/95 flex flex-col"
        style={{ maxHeight: '80vh', touchAction: 'auto', boxShadow: '0 0 40px -8px rgba(167,139,250,0.28), 0 12px 40px -12px rgba(0,0,0,0.6)' }}>
        {/* Accent gradient superiore */}
        <Div className="h-[2px] w-full shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        {/* Header */}
        <Div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10 shrink-0 bg-gradient-to-r from-violet-500/10 to-transparent">
          <H className="text-base font-semibold flex items-center gap-2 min-w-0">{title}</H>
          <Btn onClick={onClose} className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </Btn>
        </Div>
        {/* Scroll area */}
        <Div
          ref={scrollRef}
          className={`overflow-y-auto flex-1 min-h-0 px-4 py-3 ${scrollClass || ''}`}
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </Div>
      </Div>
    </Btn>,
    document.body
  );
}

function GroupsDialog({ open, onClose, groups, clients }) {
  const clientMap = {};
  clients.forEach(c => { clientMap[c.id] = c; });

  return (
    <MobileModal open={open} onClose={onClose} title={<><Span className="w-6 h-6 rounded-lg bg-violet-500/15 flex items-center justify-center"><UsersRound className="w-3.5 h-3.5 text-violet-400" /></Span><Span className="uppercase tracking-wider text-violet-400">Gruppi</Span></>} scrollClass="leader-scrollbar">
      {groups.length === 0 ? (
        <P className="text-sm text-muted-foreground text-center py-6">Nessun gruppo registrato</P>
      ) : (
        <Div className="space-y-2.5 pb-2">
          {groups.map(g => {
            const members = (g.client_ids || []).map(id => clientMap[id]).filter(Boolean);
            return (
              <Div key={g.id} className="rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/[0.08] to-transparent px-3 py-2.5">
                <Div className="flex items-center justify-between mb-2">
                  <P className="text-sm font-semibold truncate">{g.name}</P>
                  <Span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 px-1.5 py-0.5 rounded-full shrink-0 ml-2">{members.length}</Span>
                </Div>
                <Div className="flex flex-wrap gap-1.5">
                  {members.length === 0
                    ? <Span className="text-[10px] text-muted-foreground italic">Nessun membro</Span>
                    : members.map(c => (
                      <Span key={c.id} className="inline-flex items-center gap-1 text-[10px] pl-1 pr-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <ClientAvatar client={c} initials={(c.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()} size="xs" />
                        <Span className="truncate max-w-[90px]">{c.name}</Span>
                      </Span>
                    ))}
                </Div>
              </Div>
            );
          })}
        </Div>
      )}
    </MobileModal>
  );
}

function LeadersDialog({ open, onClose, leaders, attendances, events, onViewNetwork, onClientClick }) {
  return (
    <MobileModal open={open} onClose={onClose} title={<Span className="flex items-center gap-2"><Span className="w-6 h-6 rounded-lg bg-yellow-400/15 flex items-center justify-center"><Star className="w-3.5 h-3.5 text-yellow-400" /></Span><Span className="uppercase tracking-wider text-yellow-400">Leader</Span></Span>} scrollClass="leader-scrollbar" skipOwnHistory>
      <Div className="flex-1 overflow-y-auto leader-scrollbar px-0 py-0">
        <LeadersList
          leaders={leaders}
          events={events}
          sortBy="impact"
          onClientClick={onClientClick}
          onViewNetwork={onViewNetwork ? (id) => { onClose(); onViewNetwork(id); } : undefined}
        />
      </Div>
    </MobileModal>
  );
}

export default function ClientStatsBar({ clients, attendances, events = [], onNavigateToAlbero, onClientClick, leadersOpen, onLeadersOpenChange }) {
  const { user } = useAuth();
  const [groupsOpen, setGroupsOpen] = useState(false);

  const { data: groups = [] } = useQuery({
    queryKey: ['client-groups', user?.promoter_id],
    queryFn: () => base44.entities.ClientGroup.filter({ promoter_id: user.promoter_id }),
    enabled: !!user?.promoter_id,
    staleTime: 5 * 60000,
  });

  const totalClients = clients.length;
  const leadersList = clients.filter(c => c.is_leader);

  return (
    <>
      <Div className="grid grid-cols-3 gap-2">
        <ClientStatMiniCard icon={Users} label="Clienti" value={totalClients} color="#fb923c" delay={0} />
        <ClientStatMiniCard icon={Star} label="Leader" value={leadersList.length} color="#facc15" delay={0.05} onClick={() => onLeadersOpenChange?.(true)} />
        <ClientStatMiniCard icon={UsersRound} label="Gruppi" value={groups.length} color="#e85b5bff" delay={0.1} onClick={() => setGroupsOpen(true)} />
      </Div>

      <GroupsDialog open={groupsOpen} onClose={() => setGroupsOpen(false)} groups={groups} clients={clients} />
      <LeadersDialog open={!!leadersOpen} onClose={() => onLeadersOpenChange?.(false)} leaders={leadersList} attendances={attendances} events={events} onViewNetwork={onNavigateToAlbero} onClientClick={onClientClick} />
    </>
  );
}