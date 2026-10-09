// Port di src/components/client/ClientGroupsBox.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { FolderOpen, ChevronDown, ChevronRight, Users, Star } from '@/ui/icons.generated';
import ClientAvatar from '@/web/components/client/ClientAvatar';

import { Btn, Div, P, Span } from '@/ui/html';

/**
 * Box "Gruppi" nel dettaglio cliente: mostra i gruppi a cui appartiene il
 * cliente. Ogni gruppo è espandibile per vedere i membri.
 */
export default function ClientGroupsBox({ client, groups = [], allClients = [], onClientDetail }) {
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Trova i gruppi che contengono questo cliente
  const myGroups = (groups || []).filter(g => (g.client_ids || []).includes(client?.id));

  if (myGroups.length === 0) return null;

  const toggleExpand = (gid) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(gid) ? next.delete(gid) : next.add(gid);
      return next;
    });
  };

  return (
    <Div className="rounded-xl border border-border bg-secondary/20 px-3 py-2.5 space-y-1.5">
      <Div className="flex items-center gap-1.5">
        <FolderOpen className="w-3.5 h-3.5 text-violet-400 shrink-0" />
        <Span className="text-[11px] font-semibold text-foreground">
          Gruppi ({myGroups.length})
        </Span>
      </Div>
      <Div className="space-y-1.5">
        {myGroups.map(g => {
          const members = (g.client_ids || [])
            .map(id => allClients.find(c => c.id === id))
            .filter(Boolean);
          const expanded = expandedIds.has(g.id);
          return (
            <Div key={g.id} className="rounded-lg border border-border/40 bg-background/30 overflow-hidden">
              <Btn
                button
                onClick={() => toggleExpand(g.id)}
                className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-secondary/40 transition-colors">
                {expanded
                  ? <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                  : <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />}
                <FolderOpen className="w-3 h-3 text-violet-400/70 shrink-0" />
                <Span className="flex-1 text-left text-xs font-medium text-foreground truncate">{g.name}</Span>
                <Span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
                  <Users className="w-2.5 h-2.5" />{members.length}
                </Span>
              </Btn>
              {expanded && (
                <Div className="px-2 pb-2 pt-0.5 space-y-0.5 border-t border-border/30">
                  {members.length === 0 && (
                    <P className="text-[10px] text-muted-foreground pl-6 py-1">Nessun membro</P>
                  )}
                  {members.map(m => (
                    <Div
                      key={m.id}
                      className={`flex items-center gap-1.5 text-[11px] pl-6 py-1 rounded-md ${m.id === client.id ? 'bg-violet-500/10' : ''}`}
                    >
                      {m.is_leader && <Star className="w-2.5 h-2.5 text-yellow-400 shrink-0" fill="currentColor" />}
                      <ClientAvatar client={m} size="xs" initials={m.name?.charAt(0)?.toUpperCase() || '?'} />
                      <Btn
                        button
                        onClick={() => onClientDetail?.(m)}
                        className={`flex-1 text-left truncate hover:text-primary hover:underline transition-colors ${m.id === client.id ? 'text-violet-300 font-medium' : 'text-muted-foreground'}`}
                        accessibilityLabel="Apri dettaglio cliente">
                        {m.name}
                      </Btn>
                    </Div>
                  ))}
                </Div>
              )}
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}