// Port di src/components/client/ContactReminderDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Bell, Loader2, Check } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Div, P, Span } from '@/ui/html';
import { Label } from '@/ui/elements';

/**
 * Dialog per impostare un promemoria di ricontatto per un cliente.
 * Il promoter sceglie data e ora, e il sistema invierà una notifica push
 * tramite l'automazione checkContactReminders.
 */
export default function ContactReminderDialog({ client, promoterId, open, onOpenChange }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const qc = useQueryClient();
  useOverlay(open, () => onOpenChange?.(false));

  useEffect(() => {
    if (open) {
      // Default: domani alle 18:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTime('18:00');
      setSaved(false);
    }
  }, [open]);

  const handleSave = async () => {
    if (!date || !time || !client || !promoterId) return;
    setSaving(true);
    try {
      const reminderDatetime = new Date(`${date}T${time}`).toISOString();
      await base44.entities.ContactReminder.create({
        promoter_id: promoterId,
        client_id: client.id,
        client_name: client.name,
        reminder_datetime: reminderDatetime,
        status: 'pending',
      });
      qc.invalidateQueries({ queryKey: ['contact-reminders', promoterId] });
      setSaved(true);
      setTimeout(() => onOpenChange(false), 900);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <Div className="p-1.5 rounded-lg bg-amber-500/15">
              <Bell className="w-4 h-4 text-amber-400" />
            </Div>
            Promemoria contatto
          </DialogTitle>
        </DialogHeader>
        <Div className="space-y-4">
          <P className="text-sm text-muted-foreground">
            Riceverai una notifica push per ricordarti di contattare{' '}
            <Span className="font-semibold text-foreground">{client?.name}</Span>
          </P>
          <Div className="grid grid-cols-2 gap-3">
            <Div>
              <Label className="text-xs font-medium text-muted-foreground mb-1 block">Data</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </Div>
            <Div>
              <Label className="text-xs font-medium text-muted-foreground mb-1 block">Ora</Label>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </Div>
          </Div>
          <Button
            onClick={handleSave}
            disabled={!date || !time || saving || saved}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white border-0"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvo...</>
            ) : saved ? (
              <><Check className="w-4 h-4 mr-2" />Promemoria impostato!</>
            ) : (
              <><Bell className="w-4 h-4 mr-2" />Imposta promemoria</>
            )}
          </Button>
        </Div>
      </DialogContent>
    </Dialog>
  );
}