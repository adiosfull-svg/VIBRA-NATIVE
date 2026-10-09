// Port di src/components/client/ClientGroupsView.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { UsersRound, Plus, Search, Link2 } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import GroupDetailPanel from '@/web/components/client/GroupDetailPanel';
import ClientAvatar from '@/web/components/client/ClientAvatar';

import { Btn, Div, P, Span } from '@/ui/html';

// Cluster di avatar sovrapposti (stile "amici di Facebook"): mostra le foto
// profilo dei primi membri del gruppo + un badge "+N" per i restanti.
function MemberAvatarStack({ members, max = 5 }) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <Div className="flex items-center -space-x-1.5 shrink-0">
      {shown.map(c => (
        <ClientAvatar key={c.id} client={c} initials={(c.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()} size="xs" className="ring-1 ring-background" />
      ))}
      {extra > 0 && (
        <Span className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[8px] font-bold text-muted-foreground ring-1 ring-background">+{extra}</Span>
      )}
    </Div>
  );
}

export default function ClientGroupsView() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [search, setSearch] = useState('');
  const [creatingName, setCreatingName] = useState('');
  const [creatingMode, setCreatingMode] = useState(false);

  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['client-groups', user?.promoter_id],
    queryFn: () => base44.entities.ClientGroup.filter({ promoter_id: user.promoter_id }),
    enabled: !!user?.promoter_id,
    staleTime: 5 * 60000,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients', user?.promoter_id],
    queryFn: () => base44.entities.Client.filter({ promoter_id: user.promoter_id }),
    enabled: !!user?.promoter_id,
    staleTime: 10 * 60000,
  });

  const clientMap = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c])), [clients]);

  const searchTerm = search.toLowerCase().trim();
  const filtered = groups.filter(g => {
    if (!searchTerm) return true;
    // Match nome gruppo
    if (g.name?.toLowerCase().includes(searchTerm)) return true;
    // Match nomi membri
    const memberNames = (g.client_ids || []).map(id => clientMap[id]?.name).filter(Boolean);
    return memberNames.some(name => name.toLowerCase().includes(searchTerm));
  });

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || null;

  const handleCreate = async () => {
    if (!creatingName.trim()) return;
    const created = await base44.entities.ClientGroup.create({
      promoter_id: user.promoter_id,
      name: creatingName.trim(),
      client_ids: [],
    });
    qc.invalidateQueries({ queryKey: ['client-groups', user?.promoter_id] });
    setCreatingName('');
    setCreatingMode(false);
    setSelectedGroupId(created.id);
  };

  const handleDelete = async (id) => {
    await base44.entities.ClientGroup.delete(id);
    qc.invalidateQueries({ queryKey: ['client-groups', user?.promoter_id] });
    if (selectedGroupId === id) setSelectedGroupId(null);
  };

  const handleUpdateGroup = async (id, data) => {
    await base44.entities.ClientGroup.update(id, data);
    qc.invalidateQueries({ queryKey: ['client-groups', user?.promoter_id] });
  };

  if (groupsLoading || !user) {
    return <Div className="flex items-center justify-center h-64"><Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></Div>;
  }

  return (
    <Div className="space-y-3">
      {/* Header */}
      <Div className="flex items-center justify-between gap-3">
        <SectionHeader icon={Link2} title="Gruppi" color="#60a5fa" />
        <Div className="flex items-center gap-2">
          <Span className="text-[11px] text-muted-foreground">{groups.length} gruppi</Span>
          <Button size="sm" onClick={() => setCreatingMode(true)} className="h-7 text-[11px] px-2.5">
            <Plus className="w-3 h-3 mr-1" />Nuovo Gruppo
          </Button>
        </Div>
      </Div>

      {/* DESKTOP: layout a due pannelli */}
      <Div className="hidden lg:flex gap-4 min-h-[60vh]">
        <Div className="w-72 shrink-0 space-y-3">
          <Div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Cerca gruppo o cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </Div>
          {creatingMode && (
            <Div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
              <Input
                value={creatingName}
                onChange={e => setCreatingName(e.target.value)}
                placeholder="Nome gruppo (es. Amici del Vomero)"
                className="h-8 text-xs"
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                autoFocus
              />
              <Div className="flex gap-2">
                <Button size="sm" disabled={!creatingName.trim()} onClick={handleCreate} className="h-7 text-[10px]">Crea</Button>
                <Button size="sm" variant="outline" onClick={() => { setCreatingMode(false); setCreatingName(''); }} className="h-7 text-[10px]">Annulla</Button>
              </Div>
            </Div>
          )}
          <Div className="space-y-1">
            {filtered.length === 0 ? (
              <P className="text-xs text-muted-foreground text-center py-8">
                {groups.length === 0 ? 'Nessun gruppo ancora creato.' : 'Nessun gruppo corrisponde alla ricerca.'}
              </P>
            ) : (
              filtered.map(g => {
                const memberCount = (g.client_ids || []).length;
                const isActive = selectedGroupId === g.id;
                const members = (g.client_ids || []).map(id => clientMap[id]).filter(Boolean);
                const memberNames = members.slice(0, 4).map(c => c.name);
                const extraCount = memberCount - memberNames.length;
                return (
                  <Btn
                    key={g.id}
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all ${
                      isActive ? 'border-primary/40 bg-primary/10 shadow-sm shadow-primary/10' : 'border-white/10 bg-gradient-to-br from-card to-secondary/10 hover:from-secondary/20'
                    }`}
                  >
                    <Div className="flex items-center justify-between gap-2">
                      <P className="text-sm font-semibold truncate">{g.name}</P>
                      <Span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 px-1.5 py-0.5 rounded-full shrink-0">{memberCount}</Span>
                    </Div>
                    {members.length > 0 && (
                      <Div className="mt-2 flex items-center gap-2">
                        <MemberAvatarStack members={members} />
                        <Span className="text-[9px] text-muted-foreground truncate">{memberNames.join(', ')}{extraCount > 0 && <Span> +{extraCount}</Span>}</Span>
                      </Div>
                    )}
                  </Btn>
                );
              })
            )}
          </Div>
        </Div>
        <Div className="flex-1 min-w-0">
          {selectedGroup ? (
            <GroupDetailPanel group={selectedGroup} clients={clients} clientMap={clientMap} onUpdate={handleUpdateGroup} onDelete={handleDelete} />
          ) : (
            <Div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
              <Div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3"><UsersRound className="w-5 h-5" /></Div>
              <P className="text-sm">Seleziona un gruppo dalla lista</P>
              <P className="text-xs mt-1">oppure creane uno nuovo per iniziare</P>
            </Div>
          )}
        </Div>
      </Div>

      {/* MOBILE: lista con dettaglio espandibile inline */}
      <Div className="lg:hidden space-y-3">
        <Div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cerca gruppo o cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </Div>
        {creatingMode && (
          <Div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
            <Input
              value={creatingName}
              onChange={e => setCreatingName(e.target.value)}
              placeholder="Nome gruppo (es. Amici del Vomero)"
              className="h-8 text-xs"
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
              autoFocus
            />
            <Div className="flex gap-2">
              <Button size="sm" disabled={!creatingName.trim()} onClick={handleCreate} className="h-7 text-[10px]">Crea</Button>
              <Button size="sm" variant="outline" onClick={() => { setCreatingMode(false); setCreatingName(''); }} className="h-7 text-[10px]">Annulla</Button>
            </Div>
          </Div>
        )}
        <Div className="space-y-2">
          {filtered.length === 0 ? (
            <P className="text-xs text-muted-foreground text-center py-8">
              {groups.length === 0 ? 'Nessun gruppo ancora creato.' : 'Nessun gruppo corrisponde alla ricerca.'}
            </P>
          ) : (
            filtered.map(g => {
              const memberCount = (g.client_ids || []).length;
              const isExpanded = selectedGroupId === g.id;
              const members = (g.client_ids || []).map(id => clientMap[id]).filter(Boolean);
              const memberNames = members.slice(0, 4).map(c => c.name);
              const extraCount = memberCount - memberNames.length;
              return (
                <Div key={g.id}>
                  <Btn
                    onClick={() => setSelectedGroupId(isExpanded ? null : g.id)}
                    className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all ${
                      isExpanded ? 'border-primary/40 bg-primary/10 rounded-b-none shadow-sm shadow-primary/10' : 'border-white/10 bg-gradient-to-br from-card to-secondary/10 hover:from-secondary/20'
                    }`}
                  >
                    <Div className="flex items-center justify-between gap-2">
                      <P className="text-sm font-semibold truncate">{g.name}</P>
                      <Span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 px-1.5 py-0.5 rounded-full shrink-0">{memberCount}</Span>
                    </Div>
                    {members.length > 0 && !isExpanded && (
                      <Div className="mt-2 flex items-center gap-2">
                        <MemberAvatarStack members={members} />
                        <Span className="text-[9px] text-muted-foreground truncate">{memberNames.join(', ')}{extraCount > 0 && <Span> +{extraCount}</Span>}</Span>
                      </Div>
                    )}
                  </Btn>
                  {isExpanded && (
                    <Div className="rounded-b-xl border border-t-0 border-primary/40 bg-card px-3 pb-3">
                      <GroupDetailPanel
                        inline
                        group={g}
                        clients={clients}
                        clientMap={clientMap}
                        onUpdate={handleUpdateGroup}
                        onDelete={handleDelete}
                      />
                    </Div>
                  )}
                </Div>
              );
            })
          )}
        </Div>
      </Div>
    </Div>
  );
}