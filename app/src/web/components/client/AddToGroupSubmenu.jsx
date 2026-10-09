// Port di src/components/client/AddToGroupSubmenu.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/ui/use-toast';
import { DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/ui/menu';
import { Users, Search, Check, UserPlus, Plus, X } from '@/ui/icons.generated';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

/**
 * Sottomenu "Aggiungi a gruppo" per il menu contestuale di un cliente.
 * Autonomo: recupera i gruppi del promoter (e i nomi dei clienti per la
 * ricerca per membro) alla prima apertura, sfruttando la cache React Query.
 * La ricerca filtra per nome gruppo e per nome dei membri contenuti.
 */
export default function AddToGroupSubmenu({ client }) {
  const { user } = useAuth();
  const promoterId = user?.promoter_id;
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const { data: groups = [] } = useQuery({
    queryKey: ['client-groups', promoterId],
    queryFn: () => base44.entities.ClientGroup.filter({ promoter_id: promoterId }),
    enabled: !!promoterId && open,
    staleTime: 60 * 1000,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients', promoterId],
    queryFn: () => base44.entities.Client.filter({ promoter_id: promoterId }),
    enabled: !!promoterId && open,
    staleTime: 10 * 60000,
  });

  const clientNameMap = useMemo(() => {
    const m = {};
    clients.forEach(c => { m[c.id] = c.name; });
    return m;
  }, [clients]);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter(g => {
      if (g.name?.toLowerCase().includes(q)) return true;
      const members = (g.client_ids || []).map(id => clientNameMap[id] || '').filter(Boolean);
      return members.some(name => name.toLowerCase().includes(q));
    });
  }, [groups, search, clientNameMap]);

  const handleAdd = async (group) => {
    const ids = group.client_ids || [];
    if (ids.includes(client.id)) {
      toast({ title: `${client.name} è già in "${group.name}"` });
      return;
    }
    try {
      await base44.entities.ClientGroup.update(group.id, { client_ids: [...ids, client.id] });
      qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
      toast({ title: `${client.name} aggiunto a "${group.name}"` });
    } catch (e) {
      toast({ title: 'Errore', description: e?.message || 'Impossibile aggiungere', variant: 'destructive' });
    }
  };

  const handleCreate = async () => {
    if (!newGroupName.trim() || !promoterId) return;
    try {
      await base44.entities.ClientGroup.create({ promoter_id: promoterId, name: newGroupName.trim(), client_ids: [client.id] });
      qc.invalidateQueries({ queryKey: ['client-groups', promoterId] });
      toast({ title: `Gruppo "${newGroupName.trim()}" creato`, description: `${client.name} aggiunto` });
      setCreateMode(false);
      setNewGroupName('');
      setOpen(false);
    } catch (e) {
      toast({ title: 'Errore', description: e?.message || 'Impossibile creare', variant: 'destructive' });
    }
  };

  return (
    <DropdownMenuSub onOpenChange={setOpen}>
      <DropdownMenuSubTrigger>
        <Users className="w-3.5 h-3.5 mr-2" />Aggiungi a gruppo
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-64 p-2">
        <Div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <HtmlInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca gruppo o membro..."
            className="w-full pl-7 pr-2 py-1.5 rounded-md bg-secondary/40 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
            onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); setCreateMode(true); setSearch(''); } }} />
        </Div>
        {createMode ? (
          <Div className="space-y-2 py-1">
            <Div className="relative">
              <HtmlInput
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                placeholder="Nome nuovo gruppo..."
                className="w-full pl-2 pr-7 py-1.5 rounded-md bg-secondary/40 border border-violet-500/40 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400"
                autoFocus
                onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); handleCreate(); } }} />
              <Btn
                onClick={() => { setCreateMode(false); setNewGroupName(''); }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </Btn>
            </Div>
            <Btn
              onClick={handleCreate}
              disabled={!newGroupName.trim()}
              className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold bg-violet-500/90 text-white disabled:opacity-40 hover:bg-violet-500">
              <Plus className="w-3 h-3" />Crea e aggiungi
            </Btn>
          </Div>
        ) : (
          <>
            <Btn
              onClick={() => { setCreateMode(true); setSearch(''); }}
              className="w-full flex items-center gap-2 px-2 py-1.5 mb-1 rounded-md bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 transition-colors text-xs font-medium">
              <Plus className="w-3.5 h-3.5" />Crea nuovo gruppo
            </Btn>
            <Div className="max-h-56 overflow-y-auto space-y-0.5">
              {groups.length === 0 ? (
                <P className="text-xs text-muted-foreground text-center py-4 px-2">
                  Nessun gruppo. Creane uno qui sopra.
                </P>
              ) : filteredGroups.length === 0 ? (
                <P className="text-xs text-muted-foreground text-center py-4 px-2">Nessun risultato</P>
              ) : filteredGroups.map(g => {
                const isMember = (g.client_ids || []).includes(client.id);
                const memberCount = (g.client_ids || []).length;
                return (
                  <Btn
                    key={g.id}
                    onClick={() => handleAdd(g)}
                    className="w-full flex items-center justify-between gap-2 text-left px-2 py-1.5 rounded-md hover:bg-secondary/60 text-xs transition-colors">
                    <Div className="min-w-0">
                      <P className="font-medium truncate">{g.name}</P>
                      <P className="text-[10px] text-muted-foreground">{memberCount} membri</P>
                    </Div>
                    {isMember ? (
                      <Span className="flex items-center gap-1 text-[10px] text-green-400 shrink-0">
                        <Check className="w-3 h-3" />Nel gruppo
                      </Span>
                    ) : (
                      <UserPlus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                  </Btn>
                );
              })}
            </Div>
          </>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}