// Port di src/components/client/comitive/ComitiveTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Plus, Network, UsersRound, MapPin, ChevronRight, Loader2, X, Sparkles } from '@/ui/icons.generated';
import ClientAvatar from '@/web/components/client/ClientAvatar';
import ComitivaEditor from './ComitivaEditor';
import { COMITIVA_COLORS, buildEdges, initialsOf, zoneOf, fmtEuro, nodeFromMeta } from './comitiveUtils';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

export default function ComitiveTab({ clients = [], events = [], promoterId, onClientClick }) {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const { data: comitive = [], isLoading } = useQuery({
    queryKey: ['comitive', promoterId],
    queryFn: () => base44.entities.Comitiva.filter({ promoter_id: promoterId }, '-updated_date', 500),
    enabled: !!promoterId,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
  });
  const { data: links = [] } = useQuery({
    queryKey: ['client-links', promoterId],
    queryFn: () => base44.entities.ClientLink.filter({ promoter_id: promoterId }, '-created_date', 5000),
    enabled: !!promoterId,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
  });
  const { data: groups = [] } = useQuery({
    queryKey: ['client-groups', promoterId],
    queryFn: () => base44.entities.ClientGroup.filter({ promoter_id: promoterId }),
    enabled: !!promoterId,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
  });

  // Paganti degli altri PR (solo nome/zona/promoter) e promoter Vibra: dal backend, campi minimi
  const { data: directory = null, isLoading: directoryLoading } = useQuery({
    queryKey: ['comitive-directory', promoterId],
    queryFn: async () => {
      const res = await base44.functions.invoke('getComitiveDirectory', { promoter_id: promoterId });
      const d = res?.data ?? res;
      return { clients: d?.clients || [], promoters: d?.promoters || [] };
    },
    enabled: !!promoterId,
    staleTime: 10 * 60000,
    refetchOnWindowFocus: false,
  });

  const clientsById = useMemo(() => Object.fromEntries(clients.map((c) => [c.id, c])), [clients]);

  const cards = useMemo(() => comitive.map((cm) => {
    const meta = cm.external_meta || {};
    const members = [
      ...(cm.client_ids || []).map((id) => clientsById[id]).filter(Boolean),
      ...[...(cm.external_client_ids || []), ...(cm.promoter_ids || [])].filter((id) => meta[id]).map((id) => nodeFromMeta(id, meta[id])),
    ];
    const edges = buildEdges(members, links);
    const zoneCount = {};
    members.forEach((m) => { const z = zoneOf(m); if (z) zoneCount[z] = (zoneCount[z] || 0) + 1; });
    const zones = Object.entries(zoneCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([z]) => z);
    const value = members.reduce((s, m) => s + (Number(m.cum_total_spent) || 0), 0);
    const goals = edges.filter((e) => e.type === 'obiettivo').length;
    return { cm, members, edges: edges.length - goals, goals, zones, value };
  }), [comitive, clientsById, links]);

  const openRecord = comitive.find((c) => c.id === openId) || null;

  const create = async () => {
    const name = newName.trim();
    if (!name || busy) return;
    setBusy(true);
    setError('');
    try {
      const created = await base44.entities.Comitiva.create({
        promoter_id: promoterId,
        name,
        color: COMITIVA_COLORS[comitive.length % COMITIVA_COLORS.length],
        client_ids: [],
        group_ids: [],
        positions: {},
      });
      qc.setQueryData(['comitive', promoterId], (old = []) => [created, ...old]);
      setCreating(false);
      setNewName('');
      setOpenId(created.id);
    } catch (e) {
      setError(e?.message || 'Impossibile creare la comitiva');
    } finally {
      setBusy(false);
    }
  };

  const fmtUpd = (s) => {
    if (!s) return '';
    try { return format(new Date(s), "d MMM yyyy", { locale: it }); } catch { return ''; }
  };

  return (
    <Div className="space-y-4">
      {/* Intestazione */}
      <Div className="rounded-2xl border border-white/10 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(85,26,142,0.06) 60%, transparent)' }}>
        <Div className="flex items-start gap-3 flex-1 min-w-0">
          <Div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #7C3AED, #551A8E)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
            <Network className="w-5 h-5 text-white" />
          </Div>
          <Div className="min-w-0">
            <P className="text-base font-semibold text-foreground">Comitive</P>
            <P className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Metti insieme paganti singoli e gruppi, collegali con i loro legami (amici, conosciuti in serata, coppie) e guarda come nascono le comitive.
            </P>
          </Div>
        </Div>
        <Btn
          button
          onClick={() => { setCreating(true); setError(''); }}
          className="h-11 px-5 rounded-xl text-sm font-semibold text-white inline-flex items-center justify-center gap-2 shrink-0 active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #551A8E)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}
        >
          <Plus className="w-4 h-4" />Crea comitiva
        </Btn>
      </Div>

      {/* Creazione */}
      {creating && (
        <Div className="rounded-2xl border border-violet-400/30 bg-violet-500/[0.06] p-4 space-y-3">
          <Div className="flex items-center justify-between">
            <P className="text-sm font-semibold text-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-300" />Nuova comitiva</P>
            <Btn button onClick={() => setCreating(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></Btn>
          </Div>
          <HtmlInput
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') create(); }}
            placeholder="Dai un nome alla comitiva (es. Ragazzi del Vomero)"
            className="w-full h-11 px-3.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {error && <P className="text-xs text-red-400">{error}</P>}
          <Div className="flex gap-2">
            <Btn button onClick={() => setCreating(false)} className="flex-1 h-10 rounded-xl text-sm font-semibold bg-secondary/40 border border-border text-foreground">Annulla</Btn>
            <Btn
              button
              onClick={create}
              disabled={!newName.trim() || busy}
              className="flex-1 h-10 rounded-xl text-sm font-semibold text-white disabled:opacity-40 inline-flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #551A8E)' }}
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}Crea e apri
            </Btn>
          </Div>
        </Div>
      )}

      {/* Elenco */}
      {isLoading ? (
        <Div className="flex items-center justify-center h-40"><Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></Div>
      ) : cards.length === 0 ? (
        !creating && (
          <Div className="rounded-2xl border border-dashed border-white/10 py-12 px-6 text-center space-y-2">
            <UsersRound className="w-8 h-8 text-violet-300/70 mx-auto" />
            <P className="text-sm font-semibold text-foreground">Nessuna comitiva ancora</P>
            <P className="text-xs text-muted-foreground max-w-sm mx-auto">Crea la prima: le dai un nome, aggiungi i paganti o i gruppi e li colleghi tra loro.</P>
          </Div>
        )
      ) : (
        <Div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ cm, members, edges, goals, zones, value }) => {
            const color = cm.color || '#a78bfa';
            return (
              <Btn
                button
                key={cm.id}
                onClick={() => setOpenId(cm.id)}
                className="text-left rounded-2xl border border-white/10 p-4 space-y-3 transition-colors hover:border-white/20 active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg, #141820, #1A1F2E)' }}
              >
                <Div className="flex items-start gap-2.5">
                  <Span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                  <Div className="min-w-0 flex-1">
                    <P className="text-sm font-semibold text-slate-100 leading-tight [overflow-wrap:anywhere]">{cm.name}</P>
                    <P className="text-[11px] text-slate-500 mt-0.5">{members.length} persone · {edges} legami{goals ? ` · ${goals} da far conoscere` : ''}{cm.updated_date ? ` · ${fmtUpd(cm.updated_date)}` : ''}</P>
                  </Div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                </Div>
                {members.length > 0 ? (
                  <Div className="flex items-center -space-x-2">
                    {members.slice(0, 7).map((m) => (
                      <ClientAvatar key={m.id} client={m} initials={initialsOf(m.name)} size="md" className="ring-2 ring-[#161B26]" />
                    ))}
                    {members.length > 7 && (
                      <Span className="w-8 h-8 rounded-full bg-white/10 ring-2 ring-[#161B26] flex items-center justify-center text-[10px] font-bold text-slate-300">+{members.length - 7}</Span>
                    )}
                  </Div>
                ) : (
                  <P className="text-[11px] text-slate-500 italic">Vuota: aprila per aggiungere persone</P>
                )}
                {(zones.length > 0 || value > 0) && (
                  <Div className="flex flex-wrap gap-1.5">
                    {value > 0 && <Span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300">Valore {fmtEuro(value)}</Span>}
                    {zones.map((z) => (
                      <Span key={z} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 inline-flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{z}</Span>
                    ))}
                  </Div>
                )}
              </Btn>
            );
          })}
        </Div>
      )}

      {openRecord && (
        <ComitivaEditor
          key={openRecord.id}
          comitiva={openRecord}
          clients={clients}
          clientsById={clientsById}
          links={links}
          groups={groups}
          events={events}
          promoterId={promoterId}
          directory={directory}
          directoryLoading={directoryLoading}
          onClose={() => setOpenId(null)}
          onDeleted={() => setOpenId(null)}
          onClientClick={onClientClick}
        />
      )}
    </Div>
  );
}
