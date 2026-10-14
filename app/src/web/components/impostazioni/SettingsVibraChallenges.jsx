// Port di src/components/impostazioni/SettingsVibraChallenges.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Swords, Plus, Trash2, Check, X, Gift, Users, User } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/ui/dialog';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlLabel, HtmlOption, HtmlSelect } from '@/ui/elements';

const METRIC_LABELS = {
  fatturato: 'Fatturato (automatico dalle serate)',
  tavoli: 'Tavoli chiusi (automatico dalle serate)',
  manuale: 'Punteggio manuale',
};

const EMPTY_FORM = {
  title: '', description: '', prize: '', participant_ids: [],
  metric_type: 'fatturato', manual_scores: {},
  start_date: '', end_date: '', is_active: true,
};

function ChallengeForm({ initial, promoters, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  // Modalità partecipanti gestita separatamente da participant_ids, così il pulsante
  // "Tutti i promoter" può essere de-selezionato per scegliere sfidanti specifici.
  const [mode, setMode] = useState(initial?.participant_ids?.length > 0 ? 'specific' : 'all');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const togglePromoter = (id) => {
    set('participant_ids', form.participant_ids.includes(id)
      ? form.participant_ids.filter(x => x !== id)
      : [...form.participant_ids, id]);
  };

  const setMode_ = (m) => {
    setMode(m);
    if (m === 'all') set('participant_ids', []);
  };

  const setManualScore = (promoterId, value) => {
    set('manual_scores', { ...form.manual_scores, [promoterId]: Number(value) || 0 });
  };

  const scoreTargets = mode === 'all' ? promoters : promoters.filter(p => form.participant_ids.includes(p.id));

  return (
    <Div className="rounded-xl border border-border bg-secondary/10 p-4 space-y-3">
      <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Div className="space-y-1 sm:col-span-2">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Titolo sfida *</HtmlLabel>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="es. Chi porta più tavoli questo sabato?" className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1 sm:col-span-2">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Descrizione / regole</HtmlLabel>
          <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Come si vince la sfida" className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1 sm:col-span-2">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Cosa c'è in palio</HtmlLabel>
          <Input value={form.prize} onChange={e => set('prize', e.target.value)} placeholder="es. Cena offerta, 50€ bonus..." className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Data inizio</HtmlLabel>
          <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Data fine</HtmlLabel>
          <Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className="h-8 text-xs" />
        </Div>
      </Div>

      {/* Partecipanti: scelta esplicita tra "Tutti" e "Specifici" */}
      <Div className="space-y-2">
        <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Partecipanti</HtmlLabel>
        <Div className="flex gap-2">
          <Btn
            button
            onClick={() => setMode_('all')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${mode === 'all' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-secondary/40'}`}>
            <Users className="w-3.5 h-3.5" /> Tutti i promoter
          </Btn>
          <Btn
            button
            onClick={() => setMode_('specific')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${mode === 'specific' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-secondary/40'}`}>
            <User className="w-3.5 h-3.5" /> Promoter specifici
          </Btn>
        </Div>
        {mode === 'specific' && (
          <Div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1 pt-1">
            {promoters.map(p => {
              const checked = form.participant_ids.includes(p.id);
              return (
                <Btn
                  button
                  key={p.id}
                  onClick={() => togglePromoter(p.id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] border transition-colors truncate ${checked ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-secondary/40'}`}>
                  {checked ? <Check className="w-3 h-3 shrink-0" /> : <Span className="w-3 h-3 shrink-0" />}
                  <Span className="truncate">{p.name}</Span>
                </Btn>
              );
            })}
          </Div>
        )}
        {mode === 'specific' && form.participant_ids.length === 0 && (
          <P className="text-[10px] text-amber-400">Seleziona almeno un promoter sfidante.</P>
        )}
      </Div>

      {/* Logica di conteggio automatico */}
      <Div className="space-y-2">
        <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Come si conteggia il vincitore</HtmlLabel>
        <HtmlSelect value={form.metric_type} onChange={e => set('metric_type', e.target.value)} className="w-full h-8 text-xs rounded-md border border-border bg-background px-2">
          {Object.entries(METRIC_LABELS).map(([k, l]) => <HtmlOption key={k} value={k}>{l}</HtmlOption>)}
        </HtmlSelect>
        {(form.metric_type === 'fatturato' || form.metric_type === 'tavoli') && (
          <P className="text-[10px] text-muted-foreground">
            La classifica si aggiorna da sola sommando {form.metric_type === 'fatturato' ? 'il fatturato' : 'i tavoli chiusi'} delle serate nel periodo indicato sopra (obbligatorio impostare le date).
          </P>
        )}
        {form.metric_type === 'manuale' && (
          <Div className="space-y-1.5 pt-1">
            {scoreTargets.length === 0 ? (
              <P className="text-[10px] text-muted-foreground">Seleziona prima i partecipanti (o "Tutti i promoter").</P>
            ) : scoreTargets.map(p => (
              <Div key={p.id} className="flex items-center gap-2">
                <Span className="text-xs flex-1 truncate">{p.name}</Span>
                <Input
                  type="number"
                  value={form.manual_scores?.[p.id] ?? ''}
                  onChange={e => setManualScore(p.id, e.target.value)}
                  placeholder="0"
                  className="h-7 text-xs w-24"
                />
              </Div>
            ))}
          </Div>
        )}
      </Div>

      <Div className="flex gap-2 pt-1">
        <Button size="sm" onClick={() => onSave(form)} disabled={isSaving || !form.title || (mode === 'specific' && form.participant_ids.length === 0)} className="h-7 text-xs gap-1.5">
          <Check className="w-3.5 h-3.5" /> Salva e pubblica
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-7 text-xs gap-1.5">
          <X className="w-3.5 h-3.5" /> Annulla
        </Button>
      </Div>
    </Div>
  );
}

function ChallengeRow({ challenge, promoters, onEdit, onToggleActive, onDelete }) {
  const participants = challenge.participant_ids?.length > 0
    ? challenge.participant_ids.map(id => promoters.find(p => p.id === id)?.name).filter(Boolean).join(', ')
    : 'Tutti i promoter';
  return (
    <Div className={`rounded-xl border p-3 flex items-start gap-3 ${challenge.is_active ? 'bg-card border-border' : 'bg-secondary/10 border-border/40 opacity-50'}`}>
      <Div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Swords className="w-4 h-4 text-primary" />
      </Div>
      <Div className="flex-1 min-w-0">
        <P className="text-sm font-bold truncate">{challenge.title}</P>
        {challenge.description && <P className="text-[11px] text-muted-foreground mt-0.5">{challenge.description}</P>}
        {challenge.prize && (
          <P className="text-[11px] text-amber-400 mt-1 flex items-center gap-1"><Gift className="w-3 h-3" /> {challenge.prize}</P>
        )}
        <P className="text-[10px] text-muted-foreground mt-1">👥 {participants}</P>
        <P className="text-[10px] text-muted-foreground">📊 {METRIC_LABELS[challenge.metric_type || 'fatturato']}</P>
        {(challenge.start_date || challenge.end_date) && (
          <P className="text-[10px] text-muted-foreground">
            {challenge.start_date || '...'} → {challenge.end_date || '...'}
          </P>
        )}
      </Div>
      <Div className="flex gap-1 shrink-0">
        <Btn
          button
          onClick={() => onEdit(challenge)}
          className="p-1.5 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors text-[10px]">
          Modifica
        </Btn>
        <Btn
          button
          onClick={() => onToggleActive(challenge)}
          className={`px-2 py-1 rounded-lg text-[10px] border ${challenge.is_active ? 'border-green-500/30 text-green-400' : 'border-border text-muted-foreground'}`}>
          {challenge.is_active ? 'Attiva' : 'Conclusa'}
        </Btn>
        <Btn
          button
          onClick={() => onDelete(challenge.id)}
          className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </Btn>
      </Div>
    </Div>
  );
}

export default function SettingsVibraChallenges() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['vibra-challenges-admin'],
    queryFn: () => base44.entities.VibraChallenge.list('-created_date'),
    staleTime: 60000,
  });

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 5 * 60000,
  });

  const activePromoters = promoters.filter(p => p.status !== 'inattivo');

  const createMut = useMutation({
    mutationFn: async (data) => {
      const challenge = await base44.entities.VibraChallenge.create(data);
      const who = data.participant_ids.length > 0
        ? data.participant_ids.map(id => promoters.find(p => p.id === id)?.name).filter(Boolean).join(' vs ')
        : 'tutti i promoter';
      await base44.entities.Notification.create({
        recipient_promoter_id: null,
        type: 'vibra_vs',
        title: `⚔️ Nuova sfida Vibra VS!`,
        message: `${data.title}${data.prize ? ` — In palio: ${data.prize}` : ''}. Partecipanti: ${who}.`,
        icon: '⚔️',
        action_url: '/il-mio-vibra?tab=vibravs',
        is_read: false,
      }).catch(() => {});
      return challenge;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vibra-challenges-admin'] }); qc.invalidateQueries({ queryKey: ['vibra-challenges'] }); setAdding(false); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.VibraChallenge.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vibra-challenges-admin'] }); qc.invalidateQueries({ queryKey: ['vibra-challenges'] }); setEditing(null); },
  });

  const deleteMut = useMutation({
    mutationFn: id => base44.entities.VibraChallenge.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vibra-challenges-admin'] }); qc.invalidateQueries({ queryKey: ['vibra-challenges'] }); setDeleteId(null); },
  });

  return (
    <Div className="rounded-xl border border-border bg-card overflow-hidden">
      <Div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
        <Div className="flex items-center gap-2">
          <SectionHeader icon={Swords} title="Vibra VS — Sfide" color="#a78bfa" />
          <Span className="text-[11px] text-muted-foreground">{challenges.length} sfide</Span>
        </Div>
        <Button size="sm" onClick={() => { setAdding(true); setEditing(null); }} className="h-7 text-xs gap-1.5" disabled={adding}>
          <Plus className="w-3.5 h-3.5" /> Nuova sfida
        </Button>
      </Div>

      <Div className="p-4 space-y-3">
        {adding && (
          <ChallengeForm
            promoters={activePromoters}
            onSave={form => createMut.mutate(form)}
            onCancel={() => setAdding(false)}
            isSaving={createMut.isPending}
          />
        )}
        {isLoading ? (
          <Div className="flex items-center justify-center py-8">
            <Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </Div>
        ) : challenges.length === 0 && !adding ? (
          <Div className="text-center py-8 text-muted-foreground text-sm">
            <Swords className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Nessuna sfida creata. Clicca "Nuova sfida" per lanciarne una.
          </Div>
        ) : (
          challenges.map(c => editing?.id === c.id ? (
            <ChallengeForm
              key={c.id}
              initial={editing}
              promoters={activePromoters}
              onSave={form => updateMut.mutate({ id: c.id, data: form })}
              onCancel={() => setEditing(null)}
              isSaving={updateMut.isPending}
            />
          ) : (
            <ChallengeRow
              key={c.id}
              challenge={c}
              promoters={promoters}
              onEdit={setEditing}
              onToggleActive={(ch) => updateMut.mutate({ id: ch.id, data: { is_active: !ch.is_active } })}
              onDelete={setDeleteId}
            />
          ))
        )}
      </Div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questa sfida?</AlertDialogTitle>
            <AlertDialogDescription>Questa operazione non è reversibile e la sfida sparirà dalla bacheca.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMut.mutate(deleteId)} disabled={deleteMut.isPending}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Div>
  );
}