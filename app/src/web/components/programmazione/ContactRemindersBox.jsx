// Port di src/components/programmazione/ContactRemindersBox.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Bell, Trash2, Pencil, X, Check } from '@/ui/icons.generated';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';

import { Btn, Div, P, Span } from '@/ui/html';

/**
 * Box che mostra tutti i promemoria contatto pendenti del promoter.
 * Permette di modificare data/ora o eliminare ogni promemoria.
 * Posizionato nella sezione Weekend (Programmazione).
 */
export default function ContactRemindersBox({ promoterId }) {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const { data: reminders = [] } = useQuery({
    queryKey: ['contact-reminders', promoterId],
    queryFn: () => base44.entities.ContactReminder.filter({ promoter_id: promoterId, status: 'pending' }),
    enabled: !!promoterId,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const sortedReminders = [...reminders].sort(
    (a, b) => new Date(a.reminder_datetime) - new Date(b.reminder_datetime)
  );

  const handleDelete = async (id) => {
    try {
      await base44.entities.ContactReminder.delete(id);
    } catch (e) {
      // Il promemoria potrebbe essere già stato eliminato o inviato dal
      // workflow background (checkContactReminders). Ignora silenziosamente
      // "not found" e aggiorna comunque la lista.
      if (!String(e?.message || '').includes('not found')) throw e;
    }
    qc.invalidateQueries({ queryKey: ['contact-reminders', promoterId] });
  };

  const startEdit = (r) => {
    const dt = new Date(r.reminder_datetime);
    setEditingId(r.id);
    setEditDate(dt.toISOString().split('T')[0]);
    setEditTime(format(dt, 'HH:mm'));
  };

  const handleSaveEdit = async (id) => {
    if (!editDate || !editTime) return;
    const newDatetime = new Date(`${editDate}T${editTime}`).toISOString();
    await base44.entities.ContactReminder.update(id, { reminder_datetime: newDatetime });
    setEditingId(null);
    qc.invalidateQueries({ queryKey: ['contact-reminders', promoterId] });
  };

  if (sortedReminders.length === 0) return null;

  return (
    <Div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
      <Div className="flex items-center gap-2">
        <Div className="p-1.5 rounded-lg bg-amber-500/15">
          <Bell className="w-4 h-4 text-amber-400" />
        </Div>
        <Div>
          <P className="text-sm font-semibold text-amber-300">Promemoria contatti</P>
          <P className="text-[10px] text-muted-foreground">
            {sortedReminders.length} client{sortedReminders.length === 1 ? 'e' : 'i'} da ricontattare con notifica
          </P>
        </Div>
      </Div>
      <Div className="space-y-2">
        {sortedReminders.map(r => {
          const dt = new Date(r.reminder_datetime);
          const isPast = dt < new Date();
          return (
            <Div
              key={r.id}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                isPast ? 'border-amber-500/40 bg-amber-500/10' : 'border-border bg-secondary/20'
              }`}
            >
              {editingId === r.id ? (
                <Div className="flex items-center gap-2 flex-1">
                  <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="h-7 text-xs" />
                  <Input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className="h-7 text-xs w-20" />
                  <Button size="icon" className="h-7 w-7 shrink-0" onClick={() => handleSaveEdit(r.id)}>
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => setEditingId(null)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </Div>
              ) : (
                <>
                  <Div className="flex-1 min-w-0">
                    <P className="text-xs font-medium truncate">{r.client_name}</P>
                    <P className="text-[10px] text-muted-foreground">
                      {format(dt, 'dd MMM yyyy · HH:mm', { locale: it })}
                      {isPast && <Span className="text-amber-400 ml-1 font-medium">· in ritardo</Span>}
                    </P>
                  </Div>
                  <Btn
                    button
                    onClick={() => startEdit(r)}
                    className="text-muted-foreground hover:text-foreground p-1 shrink-0">
                    <Pencil className="w-3 h-3" />
                  </Btn>
                  <Btn
                    button
                    onClick={() => handleDelete(r.id)}
                    className="text-muted-foreground hover:text-destructive p-1 shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </Btn>
                </>
              )}
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}