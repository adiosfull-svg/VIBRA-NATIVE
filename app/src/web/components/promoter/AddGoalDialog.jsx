// Port di src/components/promoter/AddGoalDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';
import { Target } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/ui/use-toast';
import { GOAL_TYPES } from '@/legacy/utils/goalTypes';
import { RANK_TIERS } from '@/legacy/utils/rankSystem';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Div } from '@/ui/html';

const GIORNO_OPTIONS = [
  { value: 'tutti',  label: 'Tutti i giorni' },
  { value: '5',      label: 'Venerdì' },
  { value: '6',      label: 'Sabato' },
  { value: '0',      label: 'Domenica' },
  { value: '5,6',    label: 'Venerdì + Sabato' },
  { value: '5,0',    label: 'Venerdì + Domenica' },
  { value: '6,0',    label: 'Sabato + Domenica' },
  { value: '5,6,0',  label: 'Ven + Sab + Dom' },
  { value: 'extra',  label: 'Serate Extra' },
];

const RANK_OPTIONS = RANK_TIERS.filter(t => t.key !== 'goat');

function emptyForm() {
  return {
    promoter_id: '', type: 'fatturato', target: '', date_from: '', date_to: '',
    label: '', giorni: 'tutti', achievement_id: '', rank_key: '',
  };
}

export default function AddGoalDialog({ open, onOpenChange, promoters, achievements }) {
  useOverlay(open, () => onOpenChange?.(false));
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const resetAndClose = () => { setForm(emptyForm()); onOpenChange(false); };

  const isSocial = form.type === 'clienti_instagram' || form.type === 'clienti_tiktok';
  const isMetric = form.type === 'fatturato' || form.type === 'tavoli' || isSocial;

  const isValid = () => {
    if (!form.promoter_id) return false;
    if (isMetric) return !!form.target && !!form.date_from && !!form.date_to;
    if (form.type === 'achievement') return !!form.achievement_id;
    if (form.type === 'rank') return !!form.rank_key;
    return false;
  };

  const buildMessage = () => {
    const to = form.date_to ? ` entro il ${new Date(form.date_to).toLocaleDateString('it-IT')}` : '';
    switch (form.type) {
      case 'fatturato': return `Nuovo obiettivo: raggiungere €${Number(form.target).toLocaleString('it-IT')} di fatturato${to}`;
      case 'tavoli': return `Nuovo obiettivo: chiudere ${form.target} tavoli${to}`;
      case 'clienti_instagram': return `Nuovo obiettivo: portare ${form.target} nuovi clienti da Instagram${to}`;
      case 'clienti_tiktok': return `Nuovo obiettivo: portare ${form.target} nuovi clienti da TikTok${to}`;
      case 'achievement': {
        const ach = achievements.find(a => a.id === form.achievement_id);
        return `Nuovo obiettivo: sblocca l'achievement "${ach?.title || ''}"`;
      }
      case 'rank': {
        const tier = RANK_TIERS.find(t => t.key === form.rank_key);
        return `Nuovo obiettivo: raggiungi il rango ${tier?.label || ''}`;
      }
      default: return 'Nuovo obiettivo assegnato';
    }
  };

  const handleSave = async () => {
    if (!isValid()) { toast({ title: 'Compila tutti i campi obbligatori', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const promoter = promoters.find(p => p.id === form.promoter_id);
      const newGoal = {
        id: crypto.randomUUID(),
        type: form.type,
        ...(form.label ? { label: form.label } : {}),
        ...(isMetric ? { target: Number(form.target), date_from: form.date_from, date_to: form.date_to } : {}),
        ...((form.type === 'fatturato' || form.type === 'tavoli') ? { giorni: form.giorni } : {}),
        ...(form.type === 'achievement' ? { achievement_id: form.achievement_id } : {}),
        ...(form.type === 'rank' ? { rank_key: form.rank_key } : {}),
      };

      await base44.entities.Promoter.update(promoter.id, { goals: [...(promoter.goals || []), newGoal] });

      await base44.entities.Notification.create({
        recipient_promoter_id: promoter.id,
        type: 'new_goal',
        title: '🎯 Nuovo obiettivo assegnato',
        message: buildMessage(),
        icon: '🎯',
        related_id: newGoal.id,
        action_url: '/il-mio-vibra',
        is_read: false,
      });

      qc.invalidateQueries({ queryKey: ['promoters'] });
      toast({ title: 'Obiettivo creato e notifica inviata' });
      resetAndClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && resetAndClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Nuovo Obiettivo
          </DialogTitle>
        </DialogHeader>

        <Div className="space-y-4">
          <Div>
            <Label className="text-xs">Promoter</Label>
            <Select value={form.promoter_id} onValueChange={v => update('promoter_id', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Scegli un promoter" /></SelectTrigger>
              <SelectContent>
                {promoters.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Div>

          <Div>
            <Label className="text-xs">Tipo di obiettivo</Label>
            <Select value={form.type} onValueChange={v => update('type', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GOAL_TYPES.map(t => (
                  <SelectItem key={t.key} value={t.key}>
                    <Div className="flex items-center gap-2"><t.icon className="w-3.5 h-3.5" />{t.label}</Div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>

          {(form.type === 'fatturato' || form.type === 'tavoli') && (
            <Div>
              <Label className="text-xs">Serate da contare</Label>
              <Select value={form.giorni} onValueChange={v => update('giorni', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GIORNO_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Div>
          )}

          {isMetric && (
            <>
              <Div>
                <Label className="text-xs">
                  {form.type === 'fatturato' ? 'Target fatturato (€)' : form.type === 'tavoli' ? 'Target tavoli' : 'Target nuovi clienti'}
                </Label>
                <Input type="number" min="0" value={form.target} onChange={e => update('target', e.target.value)} placeholder="es. 10" className="mt-1" />
              </Div>
              <Div className="grid grid-cols-2 gap-3">
                <Div>
                  <Label className="text-xs">Dal</Label>
                  <Input type="date" value={form.date_from} onChange={e => update('date_from', e.target.value)} className="mt-1" style={{ colorScheme: 'dark' }} />
                </Div>
                <Div>
                  <Label className="text-xs">Al</Label>
                  <Input type="date" value={form.date_to} onChange={e => update('date_to', e.target.value)} className="mt-1" style={{ colorScheme: 'dark' }} />
                </Div>
              </Div>
            </>
          )}

          {form.type === 'achievement' && (
            <Div>
              <Label className="text-xs">Achievement da sbloccare</Label>
              <Select value={form.achievement_id} onValueChange={v => update('achievement_id', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Scegli achievement" /></SelectTrigger>
                <SelectContent>
                  {achievements.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.icon_emoji ? `${a.icon_emoji} ` : ''}{a.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Div>
          )}

          {form.type === 'rank' && (
            <Div>
              <Label className="text-xs">Rango da raggiungere</Label>
              <Select value={form.rank_key} onValueChange={v => update('rank_key', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Scegli rango" /></SelectTrigger>
                <SelectContent>
                  {RANK_OPTIONS.map(t => <SelectItem key={t.key} value={t.key}>{t.emoji} {t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Div>
          )}

          <Div>
            <Label className="text-xs">Etichetta (opzionale)</Label>
            <Input value={form.label} onChange={e => update('label', e.target.value)} placeholder="es. Sprint di Luglio" className="mt-1" />
          </Div>
        </Div>

        <Div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={resetAndClose}>Annulla</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvataggio...' : 'Crea obiettivo'}</Button>
        </Div>
      </DialogContent>
    </Dialog>
  );
}