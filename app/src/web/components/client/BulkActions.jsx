// Port di src/components/client/BulkActions.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from '@/web/shims/react-dom';
import { X, Bell, CalendarPlus, Link2, Plus, Search, Users, Scale } from '@/ui/icons.generated';
import ClientCompareDialog from '@/web/components/client/ClientCompareDialog';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useBulkSelection } from '@/web/lib/bulkSelectionContext';
import { useOverlay } from '@/web/lib/overlayStackContext';
import { lockScroll } from '@/web/lib/scrollLock';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, Img, Label } from '@/ui/elements';

import { doc as webDocument } from '@/web/shims/dom';

/**
 * Azioni massive sulla selezione multipla clienti.
 * Legge lo stato dal BulkSelectionContext (provider a livello pagina).
 * - Barra fluttuante (count + 3 azioni + seleziona tutti + annulla)
 * - Dialog "Aggiungi a gruppo" / "Promemoria massivo" / "Aggiungi a serata"
 * - Scroll bloccato quando un dialog è aperto.
 */
function Overlay({ title, onClose, children }) {
  useOverlay(true, onClose);
  // Blocca lo scroll della pagina quando il popup è aperto (ref-counted)
  useEffect(() => lockScroll(), []);
  return createPortal(
    <Div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      <Btn className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Div className="relative w-full max-w-sm rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <Div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
          <P className="text-sm font-semibold text-foreground truncate">{title}</P>
          <Btn
            button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-4 h-4" />
          </Btn>
        </Div>
        <Div className="flex-1 min-h-0 overflow-y-auto p-4">{children}</Div>
      </Div>
    </Div>,
    webDocument.body
  );
}

function GroupDialog({ count, groups, onClose, onAdd, onCreate }) {
  const [search, setSearch] = useState('');
  const [createMode, setCreateMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const filtered = useMemo(
    () => groups.filter(g => !search.trim() || g.name?.toLowerCase().includes(search.toLowerCase())),
    [groups, search]
  );
  const pick = async (g) => { setBusy(true); try { await onAdd(g); } finally { setBusy(false); } };
  const create = async () => { if (!newName.trim()) return; setBusy(true); try { await onCreate(newName.trim()); } finally { setBusy(false); } };
  return (
    <Overlay title={`Aggiungi ${count} clienti a gruppo`} onClose={onClose}>
      <Div className="space-y-2">
        <Div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <HtmlInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca gruppo..."
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </Div>
        {!createMode && (
          <Btn
            button
            onClick={() => { setCreateMode(true); setSearch(''); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 text-violet-300 text-sm font-medium hover:bg-violet-500/20 transition-colors">
            <Plus className="w-4 h-4" /> Crea nuovo gruppo
          </Btn>
        )}
        {createMode && (
          <Div className="space-y-2">
            <HtmlInput autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome nuovo gruppo..."
              className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-violet-500/40 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400" />
            <Div className="flex gap-2">
              <Btn
                button
                onClick={() => { setCreateMode(false); setNewName(''); }}
                className="flex-1 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">Annulla</Btn>
              <Btn
                button
                onClick={create}
                disabled={!newName.trim() || busy}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-violet-500/90 text-white disabled:opacity-40 hover:bg-violet-500">Crea e aggiungi</Btn>
            </Div>
          </Div>
        )}
        {!createMode && (
          <Div className="space-y-1 max-h-64 overflow-y-auto">
            {filtered.length === 0
              ? <P className="text-sm text-muted-foreground text-center py-6">Nessun gruppo</P>
              : filtered.map(g => (
                <Btn
                  button
                  key={g.id}
                  disabled={busy}
                  onClick={() => pick(g)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-secondary/60 text-left transition-colors disabled:opacity-50">
                  <Div className="min-w-0">
                    <P className="text-sm font-medium truncate">{g.name}</P>
                    <P className="text-[10px] text-muted-foreground">{(g.client_ids || []).length} membri</P>
                  </Div>
                  <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                </Btn>
              ))}
          </Div>
        )}
      </Div>
    </Overlay>
  );
}

function ReminderDialog({ count, onClose, onConfirm }) {
  const [dt, setDt] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(18, 0, 0, 0);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  });
  const [busy, setBusy] = useState(false);
  const confirm = async () => { setBusy(true); try { await onConfirm(new Date(dt).toISOString()); } finally { setBusy(false); } };
  return (
    <Overlay title={`Promemoria per ${count} clienti`} onClose={onClose}>
      <Div className="space-y-3">
        <P className="text-sm text-muted-foreground">Imposta un promemoria di ricontatto per tutti i clienti selezionati.</P>
        <Div>
          <Label className="block text-xs font-medium text-muted-foreground mb-1">Quando ricordartelo</Label>
          <HtmlInput type="datetime-local" value={dt} onChange={e => setDt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </Div>
        <Div className="flex gap-2 pt-1">
          <Btn
            button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">Annulla</Btn>
          <Btn
            button
            onClick={confirm}
            disabled={busy || !dt}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-amber-500/90 text-black disabled:opacity-40 hover:bg-amber-500">Crea promemaria</Btn>
        </Div>
      </Div>
    </Overlay>
  );
}

function SerataDialog({ count, upcomingDates, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const pick = async (d) => { setBusy(true); try { await onConfirm(d); } finally { setBusy(false); } };
  return (
    <Overlay title={`Aggiungi ${count} clienti a serata`} onClose={onClose}>
      <Div className="space-y-1 max-h-80 overflow-y-auto">
        {upcomingDates.length === 0
          ? <P className="text-sm text-muted-foreground text-center py-6">Nessuna serata disponibile</P>
          : upcomingDates.map(d => (
            <Btn
              button
              key={d.id || d.dateStr}
              disabled={busy}
              onClick={() => pick(d)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-secondary/60 text-left transition-colors disabled:opacity-50">
              {d.logoUrl
                ? <Img src={d.logoUrl} alt="" className="w-4 h-4 rounded object-contain shrink-0 bg-secondary/40" />
                : <CalendarPlus className="w-4 h-4 text-blue-400 shrink-0" />}
              <Div className="min-w-0 flex-1">
                <P className="text-sm font-medium truncate">{d.dayLabel}{d.venueName ? ` · ${d.venueName}` : ''}</P>
                <P className="text-[10px] text-muted-foreground">{format(d.dateObj, 'd MMM yyyy', { locale: it })}</P>
              </Div>
            </Btn>
          ))}
      </Div>
    </Overlay>
  );
}

// Bottone azione della barra multi-selezione: icona + etichetta verticale su
// mobile (l'icona da sola è poco intuitiva), orizzontale su desktop.
// L'etichetta erita lo stesso colore dell'icona.
function BulkBtn({ Icon, label, color, hover, onClick, title }) {
  return (
    <Btn
      button
      onClick={onClick}
      className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2.5 py-1 sm:py-2 rounded-lg ${hover} transition-colors`}
      accessibilityLabel={title}>
      <Icon className={`w-[18px] h-[18px] sm:w-5 sm:h-5 ${color}`} />
      <Span className={`text-[9px] sm:text-sm font-medium leading-none ${color}`}>{label}</Span>
    </Btn>
  );
}

export default function BulkActions() {
  const ctx = useBulkSelection();
  const [action, setAction] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const count = ctx?.selectedClients?.length || 0;
  useEffect(() => { if (count === 0) setAction(null); }, [count]);
  if (!ctx || count === 0) return null;

  const closeAction = () => setAction(null);

  return createPortal(
    <>
      <Div
        className="fixed left-1/2 -translate-x-1/2 bottom-24 sm:bottom-10 z-40 flex items-center gap-0 sm:gap-1.5 rounded-2xl border border-violet-500/30 bg-popover/95 backdrop-blur-md px-2 sm:px-3 py-1.5 sm:py-2"
        style={{ boxShadow: '0 8px 32px -4px rgba(167,139,250,0.4)' }}>
        <Span className="text-sm font-semibold text-violet-300 px-1 sm:px-2 whitespace-nowrap">{count} sel.</Span>
        <BulkBtn Icon={Link2} label="Gruppo" color="text-violet-300" hover="hover:bg-violet-500/20" onClick={() => setAction('group')} title="Aggiungi a gruppo" />
        <BulkBtn Icon={Bell} label="Promem." color="text-amber-300" hover="hover:bg-amber-500/20" onClick={() => setAction('reminder')} title="Promemoria massivo" />
        <BulkBtn Icon={CalendarPlus} label="Serata" color="text-blue-300" hover="hover:bg-blue-500/20" onClick={() => setAction('serata')} title="Aggiungi a serata" />
        <BulkBtn Icon={Scale} label="Confronta" color="text-violet-300" hover="hover:bg-violet-500/20" onClick={() => setCompareOpen(true)} title="Confronta clienti" />
        <Div className="w-px h-8 sm:h-6 bg-border/50 mx-0.5" />
        <BulkBtn Icon={Users} label="Tutti" color="text-muted-foreground" hover="hover:bg-secondary/60" onClick={ctx.selectAll} title="Seleziona tutti" />
        <BulkBtn Icon={X} label="Chiudi" color="text-muted-foreground" hover="hover:bg-secondary/60" onClick={ctx.clearSelection} title="Annulla selezione" />
      </Div>

      {action === 'group' && (
        <GroupDialog count={count} groups={ctx.groups} onClose={closeAction}
          onAdd={async (g) => { await ctx.onBulkAddToGroup?.(g, ctx.selectedClients); closeAction(); }}
          onCreate={async (name) => { await ctx.onBulkCreateGroup?.(name, ctx.selectedClients); closeAction(); }} />
      )}
      {action === 'reminder' && (
        <ReminderDialog count={count} onClose={closeAction}
          onConfirm={async (iso) => { await ctx.onBulkSetReminders?.(ctx.selectedClients, iso); closeAction(); }} />
      )}
      {action === 'serata' && (
        <SerataDialog count={count} upcomingDates={ctx.upcomingDates} onClose={closeAction}
          onConfirm={async (d) => { await ctx.onBulkAddToSerata?.(d, ctx.selectedClients); closeAction(); }} />
      )}
      {compareOpen && (
        <ClientCompareDialog
          clients={ctx.selectedClients}
          statsMap={ctx.clientStatsMap}
          badgesMap={ctx.clientBadges}
          allClients={ctx.allClients}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </>,
    webDocument.body
  );
}