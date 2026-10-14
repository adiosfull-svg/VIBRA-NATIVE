// Port di src/components/promoter/PromoterGoalsDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/menu';
import { Plus, Trash2, Target, Euro, Table2 } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/ui/use-toast';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Btn, Div, Span } from '@/ui/html';

// Giorni della settimana: 0=Dom, 5=Ven, 6=Sab
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

function emptyGoal() {
  return {
    id: crypto.randomUUID(),
    type: 'fatturato',
    target: '',
    date_from: '',
    date_to: '',
    label: '',
    giorni: 'tutti', // filtro giorno
  };
}

export default function PromoterGoalsDialog({ open, onOpenChange, promoter }) {
  useOverlay(open, () => onOpenChange?.(false));
  const [goals, setGoals] = useState([]);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && promoter) {
      setGoals(promoter.goals?.length ? promoter.goals.map(g => ({ ...g, giorni: g.giorni || 'tutti' })) : []);
    }
  }, [open, promoter]);

  const addGoal = () => setGoals(g => [...g, emptyGoal()]);

  const updateGoal = (id, field, value) =>
    setGoals(g => g.map(goal => goal.id === id ? { ...goal, [field]: value } : goal));

  const removeGoal = (id) => setGoals(g => g.filter(goal => goal.id !== id));

  const handleSave = async () => {
    const valid = goals.every(g => g.target && g.date_from && g.date_to);
    if (!valid) { toast({ title: 'Compila tutti i campi degli obiettivi', variant: 'destructive' }); return; }
    setSaving(true);
    const cleaned = goals.map(g => ({ ...g, target: Number(g.target) }));
    await base44.entities.Promoter.update(promoter.id, { goals: cleaned });
    queryClient.invalidateQueries({ queryKey: ['promoters'] });
    toast({ title: 'Obiettivi salvati' });
    setSaving(false);
    onOpenChange(false);
  };

  if (!promoter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Obiettivi — {promoter.name}
          </DialogTitle>
        </DialogHeader>

        <Div className="space-y-4">
          {goals.length === 0 && (
            <Div className="text-center py-8 text-sm text-muted-foreground">
              Nessun obiettivo impostato. Aggiungine uno!
            </Div>
          )}

          {goals.map((goal, i) => (
            <Div key={goal.id} className="rounded-xl border border-border bg-secondary/10 p-4 space-y-3">
              <Div className="flex items-center justify-between">
                <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Obiettivo {i + 1}
                </Span>
                <Btn
                  button
                  onClick={() => removeGoal(goal.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </Btn>
              </Div>

              {/* Tipo */}
              <Div className="grid grid-cols-2 gap-3">
                <Div>
                  <Label className="text-xs">Tipo di obiettivo</Label>
                  <Select value={goal.type} onValueChange={v => updateGoal(goal.id, 'type', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fatturato">
                        <Div className="flex items-center gap-2"><Euro className="w-3.5 h-3.5" /> Fatturato (€)</Div>
                      </SelectItem>
                      <SelectItem value="tavoli">
                        <Div className="flex items-center gap-2"><Table2 className="w-3.5 h-3.5" /> Tavoli da chiudere</Div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Div>

                {/* Filtro giorni/tipo serata */}
                <Div>
                  <Label className="text-xs">Serate da contare</Label>
                  <Select value={goal.giorni || 'tutti'} onValueChange={v => updateGoal(goal.id, 'giorni', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GIORNO_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Div>
              </Div>

              {/* Target */}
              <Div>
                <Label className="text-xs">
                  {goal.type === 'fatturato' ? 'Target fatturato (€)' : 'Target tavoli da chiudere'}
                  {goal.giorni && goal.giorni !== 'tutti' && (
                    <Span className="ml-1 text-primary/70">
                      · {GIORNO_OPTIONS.find(o => o.value === goal.giorni)?.label}
                    </Span>
                  )}
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={goal.target}
                  onChange={e => updateGoal(goal.id, 'target', e.target.value)}
                  placeholder={goal.type === 'fatturato' ? 'es. 3000' : 'es. 10'}
                  className="mt-1"
                />
              </Div>

              {/* Periodo */}
              <Div className="grid grid-cols-2 gap-3">
                <Div>
                  <Label className="text-xs">Dal</Label>
                  <Input
                    type="date"
                    value={goal.date_from}
                    onChange={e => updateGoal(goal.id, 'date_from', e.target.value)}
                    className="mt-1"
                    style={{ colorScheme: 'dark' }}
                  />
                </Div>
                <Div>
                  <Label className="text-xs">Al</Label>
                  <Input
                    type="date"
                    value={goal.date_to}
                    onChange={e => updateGoal(goal.id, 'date_to', e.target.value)}
                    className="mt-1"
                    style={{ colorScheme: 'dark' }}
                  />
                </Div>
              </Div>

              {/* Etichetta opzionale */}
              <Div>
                <Label className="text-xs">Etichetta (opzionale)</Label>
                <Input
                  value={goal.label}
                  onChange={e => updateGoal(goal.id, 'label', e.target.value)}
                  placeholder="es. Obiettivo Sabati di Maggio"
                  className="mt-1"
                />
              </Div>
            </Div>
          ))}

          <Btn
            button
            onClick={addGoal}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
            <Plus className="w-4 h-4" /> Aggiungi obiettivo
          </Btn>
        </Div>

        <Div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvataggio...' : 'Salva obiettivi'}
          </Button>
        </Div>
      </DialogContent>
    </Dialog>
  );
}