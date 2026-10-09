// Port di src/components/client/QuickNoteEdit.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect, useCallback } from 'react';
import { StickyNote, Check, X, Pencil } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlTextarea } from '@/ui/elements';

// Nota rapida sul cliente: campo `notes` modificabile inline, sempre visibile
// (stato vuoto = "Aggiungi una nota…"). Salva su blur/Enter(Cmd/Ctrl)/check.
export default function QuickNoteEdit({ client, onSaved }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [localNote, setLocalNote] = useState(null);

  useEffect(() => { setLocalNote(null); }, [client?.id, client?.notes]);

  const display = localNote ?? client?.notes ?? '';

  const startEdit = () => { setValue(display); setEditing(true); };
  const cancel = () => { setEditing(false); setValue(''); };

  const save = useCallback(async () => {
    const clean = value.trim();
    if (clean === display) { setEditing(false); return; }
    setSaving(true);
    setEditing(false);
    try {
      await base44.entities.Client.update(client.id, { notes: clean });
      setLocalNote(clean);
      onSaved?.({ notes: clean });
      qc.setQueriesData({ queryKey: ['clients'] }, (old) =>
        Array.isArray(old) ? old.map(c => c.id === client.id ? { ...c, notes: clean } : c) : old
      );
    } finally {
      setSaving(false);
    }
  }, [value, display, client?.id, onSaved, qc]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
    if (e.key === 'Escape') cancel();
  };

  return (
    <Btn className="rounded-xl border border-border bg-secondary/20 px-3 py-2.5" onClick={e => e.stopPropagation()}>
      {editing ? (
        <Div className="flex flex-col gap-2">
          <HtmlTextarea
            autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={2}
            placeholder="Es. ama il tavolo in prima fila, allergico al lime, viene sempre con la sorella…"
            className="w-full text-xs bg-transparent border border-border rounded-lg px-2 py-1.5 text-foreground outline-none focus:border-primary resize-none"
            onKeyDown={handleKeyDown} />
          <Div className="flex justify-end gap-1">
            <Btn onClick={cancel} className="p-1 rounded text-muted-foreground hover:text-foreground" accessibilityLabel="Annulla">
              <X className="w-3.5 h-3.5" />
            </Btn>
            <Btn onClick={save} disabled={saving} className="p-1 rounded text-emerald-400 hover:bg-emerald-400/10 disabled:opacity-40" accessibilityLabel="Salva nota">
              <Check className="w-3.5 h-3.5" />
            </Btn>
          </Div>
        </Div>
      ) : (
        <Btn onClick={startEdit} className="w-full flex items-start gap-2 text-left group">
          <StickyNote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          {display ? (
            <P className="text-xs text-muted-foreground italic leading-relaxed flex-1 group-hover:text-foreground transition-colors">{display}</P>
          ) : (
            <Span className="text-xs text-muted-foreground/50 group-hover:text-muted-foreground flex-1">Aggiungi una nota…</Span>
          )}
          <Pencil className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
        </Btn>
      )}
    </Btn>
  );
}