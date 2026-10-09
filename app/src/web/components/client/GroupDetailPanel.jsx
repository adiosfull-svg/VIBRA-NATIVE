// Port di src/components/client/GroupDetailPanel.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchByPromoter } from '@/web/lib/safeData';
import {
  Users, Search, Plus, Check, X, Trash2, Pencil,
  MessageCircle, Instagram, TrendingUp, Activity
} from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import ClientAvatar from '@/web/components/client/ClientAvatar';

import { Btn, Div, H, P, Span } from '@/ui/html';
import { A, HtmlInput } from '@/ui/elements';

function getHealthColor(lastDays) {
  if (lastDays === null) return 'text-muted-foreground';
  if (lastDays <= 14) return 'text-emerald-400';
  if (lastDays <= 30) return 'text-yellow-400';
  return 'text-red-400';
}

function getHealthLabel(lastDays) {
  if (lastDays === null) return 'Nessuna presenza';
  if (lastDays <= 14) return 'Attivo';
  if (lastDays <= 30) return 'In calo';
  return 'Inattivo';
}

export default function GroupDetailPanel({ group, clients, clientMap, onUpdate, onDelete, inline }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [memberSearch, setMemberSearch] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const memberIds = group.client_ids || [];
  const members = memberIds.map(id => clientMap[id]).filter(Boolean);
  const missingIds = memberIds.filter(id => !clientMap[id]);

  // Fetch attendances & events for member stats
  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances-by-promoter', group.promoter_id],
    queryFn: () => fetchByPromoter(base44.entities.EventAttendance, group.promoter_id, { sort: '-created_date' }),
    enabled: !!group.promoter_id,
    staleTime: 5 * 60000,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events-group', group.id],
    queryFn: () => base44.entities.Event.list('-date', 5000),
    staleTime: 5 * 60000,
  });

  const eventsById = useMemo(() => Object.fromEntries(events.map(e => [e.id, e])), [events]);

  // Member stats
  const memberStats = useMemo(() => {
    const today = new Date();
    const result = {};
    members.forEach(c => {
      const atts = attendances.filter(a => a.client_id === c.id);
      const visits = atts.length;
      const totalSpent = atts.reduce((s, a) => s + (a.revenue || 0), 0);
      const avgSpent = visits > 0 ? Math.round(totalSpent / visits) : 0;

      let lastDate = null;
      atts.forEach(a => {
        const ev = eventsById[a.event_id];
        if (ev?.date && (!lastDate || ev.date > lastDate)) lastDate = ev.date;
      });

      const daysSinceLast = lastDate
        ? Math.round((today - new Date(lastDate)) / 86400000)
        : null;

      result[c.id] = { visits, totalSpent, avgSpent, daysSinceLast };
    });
    return result;
  }, [members, attendances, eventsById]);

  // Group aggregate stats
  const groupStats = useMemo(() => {
    const stats = Object.values(memberStats);
    if (stats.length === 0) return { totalSpent: 0, totalVisits: 0, avgPerMember: 0, oldestLastVisit: null };
    const totalSpent = stats.reduce((s, m) => s + m.totalSpent, 0);
    const totalVisits = stats.reduce((s, m) => s + m.visits, 0);
    const maxDays = Math.max(...stats.filter(m => m.daysSinceLast !== null).map(m => m.daysSinceLast), 0);
    return {
      totalSpent,
      totalVisits,
      avgPerMember: Math.round(totalSpent / stats.length),
      oldestLastVisit: stats.some(m => m.daysSinceLast !== null) ? maxDays : null,
    };
  }, [memberStats]);

  const notInGroup = clients.filter(c => !memberIds.includes(c.id) && (!addSearch || c.name?.toLowerCase().includes(addSearch.toLowerCase())));

  const filteredMembers = members.filter(c =>
    !memberSearch || c.name?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    await onUpdate(group.id, { name: editName.trim() });
    setEditing(false);
  };

  const handleAddMember = async (clientId) => {
    const newIds = [...memberIds, clientId];
    await onUpdate(group.id, { client_ids: newIds });
  };

  const handleRemoveMember = async (clientId) => {
    const newIds = memberIds.filter(id => id !== clientId);
    await onUpdate(group.id, { client_ids: newIds });
  };



  const healthColor = getHealthColor(groupStats.oldestLastVisit);
  const healthLabel = getHealthLabel(groupStats.oldestLastVisit);

  return (
    <Div className={`${inline ? '' : 'rounded-xl bg-card border border-border'} p-4 lg:p-5 space-y-5`}>
      {/* Header gruppo */}
      <Div className="flex items-start justify-between gap-3">
        <Div className="flex items-center gap-3 min-w-0">
          <Div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-blue-400" />
          </Div>
          <Div className="min-w-0">
            {editing ? (
              <Div className="flex items-center gap-2">
                <Input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="h-8 text-sm w-48"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') setEditing(false); }}
                />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSaveEdit}><Check className="w-3.5 h-3.5 text-emerald-400" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(false)}><X className="w-3.5 h-3.5 text-muted-foreground" /></Button>
              </Div>
            ) : (
              <Div>
                <H className="text-lg font-bold flex items-center gap-2">
                  {group.name}
                  <Btn onClick={() => { setEditing(true); setEditName(group.name); }} className="text-muted-foreground hover:text-foreground">
                    <Pencil className="w-3.5 h-3.5" />
                  </Btn>
                </H>
                <P className="text-xs text-muted-foreground">{members.length} membri</P>
              </Div>
            )}
          </Div>
        </Div>
        <Div className="flex items-center gap-1 shrink-0">
          <Button size="sm" variant="outline" className="h-7 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => setDeleteConfirm(true)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </Div>
      </Div>

      {/* Conferma eliminazione */}
      {deleteConfirm && (
        <Div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 flex items-center justify-between">
          <Span className="text-xs text-destructive">Eliminare "{group.name}"?</Span>
          <Div className="flex gap-1">
            <Button size="sm" variant="destructive" className="h-6 text-[10px]" onClick={() => { onDelete(group.id); setDeleteConfirm(false); }}>Elimina</Button>
            <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => setDeleteConfirm(false)}>Annulla</Button>
          </Div>
        </Div>
      )}

      {/* Stats cards */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Div className="rounded-lg border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent px-3 py-2">
          <P className="text-[10px] text-muted-foreground">Fatturato tot.</P>
          <P className="text-sm font-bold text-primary">€{groupStats.totalSpent.toLocaleString('it-IT')}</P>
        </Div>
        <Div className="rounded-lg border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent px-3 py-2">
          <P className="text-[10px] text-muted-foreground">Presenze tot.</P>
          <P className="text-sm font-bold text-emerald-400">{groupStats.totalVisits}</P>
        </Div>
        <Div className="rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent px-3 py-2">
          <P className="text-[10px] text-muted-foreground">Media / membro</P>
          <P className="text-sm font-bold text-blue-300">€{groupStats.avgPerMember.toLocaleString('it-IT')}</P>
        </Div>
        <Div className="rounded-lg border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent px-3 py-2">
          <P className="text-[10px] text-muted-foreground flex items-center gap-1"><Activity className="w-2.5 h-2.5" />Stato</P>
          <P className={`text-sm font-bold ${healthColor}`}>{healthLabel}</P>
        </Div>
      </Div>

      {/* Lista membri */}
      <Div>
        <Div className="flex items-center justify-between mb-3">
          <SectionHeader icon={Users} title="Membri" color="#60a5fa" />
          <Div className="flex items-center gap-2">
            <Div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <HtmlInput
                placeholder="Cerca..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                className="w-28 h-7 pl-6 pr-2 rounded-lg bg-secondary/30 border border-border text-[10px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </Div>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => setAddingMember(!addingMember)}>
              <Plus className="w-3 h-3" />Aggiungi
            </Button>
          </Div>
        </Div>

        {/* Aggiungi membro panel */}
        {addingMember && (
          <Div className="rounded-lg border border-primary/30 bg-primary/5 p-3 mb-3 space-y-2">
            <Div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <HtmlInput
                placeholder="Cerca cliente..."
                value={addSearch}
                onChange={e => setAddSearch(e.target.value)}
                className="w-full h-7 pl-6 pr-2 rounded-lg bg-secondary/30 border border-border text-[10px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </Div>
            <Div className="max-h-32 overflow-y-auto space-y-0.5">
              {notInGroup.slice(0, 20).map(c => (
                <Btn
                  key={c.id}
                  onClick={() => handleAddMember(c.id)}
                  className="w-full text-left text-xs px-2 py-1.5 rounded flex items-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  <ClientAvatar client={c} initials={c.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()} size="xs" />
                  <Span className="truncate">{c.name}</Span>
                  <Plus className="w-3 h-3 ml-auto text-muted-foreground" />
                </Btn>
              ))}
            </Div>
          </Div>
        )}

        {/* Member list */}
        <Div className="space-y-1">
          {filteredMembers.length === 0 && missingIds.length === 0 ? (
            <P className="text-xs text-muted-foreground text-center py-6">Nessun membro nel gruppo. Usa "Aggiungi" per inserire clienti.</P>
          ) : (
            <>
              {filteredMembers.map(c => {
                const stats = memberStats[c.id] || { visits: 0, totalSpent: 0, avgSpent: 0, daysSinceLast: null };
                const healthClass = getHealthColor(stats.daysSinceLast);
                return (
                  <Div key={c.id} className="flex items-center gap-2.5 rounded-lg bg-gradient-to-br from-secondary/30 to-secondary/5 border border-white/10 px-3 py-2 group/member hover:from-secondary/40 hover:to-secondary/10 transition-colors">
                    <ClientAvatar client={c} initials={c.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()} size="sm" />
                    <Div className="flex-1 min-w-0">
                      <P className="text-xs font-medium truncate">{c.name}</P>
                      <Div className="flex items-center gap-1.5 mt-0.5">
                        <Span className="text-[9px] text-muted-foreground"><Span className="text-foreground font-semibold">{stats.visits}</Span> presenze</Span>
                        <Span className="text-[9px] text-muted-foreground">·</Span>
                        <Span className="text-[9px] text-muted-foreground">€<Span className="text-foreground font-semibold">{stats.totalSpent.toLocaleString('it-IT')}</Span></Span>
                      </Div>
                    </Div>
                    <Div className="flex items-center gap-1 shrink-0">
                      {c.instagram && (
                        <A href={`https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1 text-pink-400 hover:bg-pink-400/10 rounded transition-colors">
                          <Instagram className="w-3 h-3" />
                        </A>
                      )}
                      {c.phone && (
                        <A href={`https://wa.me/${c.phone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1 text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors">
                          <MessageCircle className="w-3 h-3 fill-emerald-400/20" />
                        </A>
                      )}
                      <Btn onClick={() => handleRemoveMember(c.id)} className="p-1 text-muted-foreground hover:text-destructive rounded opacity-0 group-hover/member:opacity-100 transition-all">
                        <X className="w-3 h-3" />
                      </Btn>
                    </Div>
                  </Div>
                );
              })}
              {missingIds.map(id => (
                <Div key={id} className="flex items-center gap-2.5 rounded-lg bg-secondary/20 border border-border/50 px-3 py-2 opacity-50">
                  <Div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[9px] text-muted-foreground shrink-0">?</Div>
                  <Div className="flex-1"><P className="text-[10px] text-muted-foreground italic">Cliente rimosso</P></Div>
                  <Btn onClick={() => handleRemoveMember(id)} className="p-1 text-muted-foreground hover:text-destructive rounded">
                    <X className="w-3 h-3" />
                  </Btn>
                </Div>
              ))}
            </>
          )}
        </Div>
      </Div>
    </Div>
  );
}