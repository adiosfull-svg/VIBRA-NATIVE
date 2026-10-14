// Port di src/components/impostazioni/SettingsAchievements.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Trophy, Plus, Pencil, Trash2, Check, X } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/ui/dialog';
import { RARITY_COLORS, RARITY_LABELS, CATEGORY_LABELS, CONDITION_LABELS } from '@/legacy/utils/achievementLogic';

import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput, HtmlLabel, HtmlOption, HtmlSelect, Img } from '@/ui/elements';

const RARITIES = ['bronzo', 'argento', 'oro', 'platino', 'master', 'leggenda'];
const RARITY_SORT = { bronzo: 0, argento: 1, oro: 2, platino: 3, master: 4, leggenda: 5 };
const CATEGORIES = ['clienti', 'fatturato', 'presenze', 'leadership', 'speciale'];
const CONDITIONS = [
  'total_clients', 'total_revenue', 'total_presences', 'total_tables',
  'leaders_count', 'referrals_count', 'clients_with_instagram',
  'monthly_revenue', 'single_event_revenue', 'multi_zone_clients',
  'monthly_tables', 'single_event_tables', 'team_size',
  'vibra_vs_weekly_wins', 'vibra_vs_weekly_streak', 'vibra_vs_monthly_win',
  'consecutive_event_tables', 'max_referral_chain_depth',
];

const EMPTY_FORM = {
  key: '', title: '', description: '', category: 'clienti', rarity: 'bronzo',
  icon_emoji: '🏆', icon_url: '', condition_type: 'total_clients',
  condition_value: 10, sort_order: 0, is_active: true,
};

function AchievementForm({ initial, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Div className="rounded-xl border border-border bg-secondary/10 p-4 space-y-3">
      <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Chiave univoca *</HtmlLabel>
          <Input value={form.key} onChange={e => set('key', e.target.value)} placeholder="es. first_client" className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Titolo *</HtmlLabel>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="es. Primo Passo" className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1 sm:col-span-2">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Descrizione</HtmlLabel>
          <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descrizione breve dell'obiettivo" className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Emoji icona</HtmlLabel>
          <Input value={form.icon_emoji} onChange={e => set('icon_emoji', e.target.value)} placeholder="🏆" className="h-8 text-xs w-24" />
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">URL Immagine badge (opz.)</HtmlLabel>
          <Input value={form.icon_url} onChange={e => set('icon_url', e.target.value)} placeholder="https://..." className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Categoria</HtmlLabel>
          <HtmlSelect value={form.category} onChange={e => set('category', e.target.value)} className="w-full h-8 text-xs rounded-md border border-border bg-background px-2">
            {CATEGORIES.map(c => <HtmlOption key={c} value={c}>{CATEGORY_LABELS[c] || c}</HtmlOption>)}
          </HtmlSelect>
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Rarità</HtmlLabel>
          <HtmlSelect value={form.rarity} onChange={e => set('rarity', e.target.value)} className="w-full h-8 text-xs rounded-md border border-border bg-background px-2">
            {RARITIES.map(r => <HtmlOption key={r} value={r}>{RARITY_LABELS[r]}</HtmlOption>)}
          </HtmlSelect>
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Tipo condizione *</HtmlLabel>
          <HtmlSelect value={form.condition_type} onChange={e => set('condition_type', e.target.value)} className="w-full h-8 text-xs rounded-md border border-border bg-background px-2">
            {CONDITIONS.map(c => <HtmlOption key={c} value={c}>{CONDITION_LABELS[c] || c}</HtmlOption>)}
          </HtmlSelect>
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Valore soglia *</HtmlLabel>
          <Input type="number" value={form.condition_value} onChange={e => set('condition_value', Number(e.target.value))} className="h-8 text-xs" />
        </Div>
        <Div className="space-y-1">
          <HtmlLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">Ordine visualizzazione</HtmlLabel>
          <Input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} className="h-8 text-xs w-24" />
        </Div>
        <Div className="flex items-end gap-2 pb-1">
          <HtmlLabel className="text-xs text-muted-foreground">Attivo</HtmlLabel>
          <HtmlInput type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4" />
        </Div>
      </Div>
      <Div className="flex gap-2 pt-1">
        <Button size="sm" onClick={() => onSave(form)} disabled={isSaving || !form.key || !form.title} className="h-7 text-xs gap-1.5">
          <Check className="w-3.5 h-3.5" /> Salva
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-7 text-xs gap-1.5">
          <X className="w-3.5 h-3.5" /> Annulla
        </Button>
      </Div>
    </Div>
  );
}

function AchievementRow({ achievement, onEdit, onDelete }) {
  const colors = RARITY_COLORS[achievement.rarity || 'bronzo'];
  return (
    <Div className={`rounded-xl border p-3 flex items-center gap-3 ${colors.bg} ${colors.border} ${!achievement.is_active ? 'opacity-40' : ''}`}>
      <Div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${colors.border}`}>
        {achievement.icon_url
          ? <Img src={achievement.icon_url} alt={achievement.title} className="w-8 h-8 object-contain" />
          : achievement.icon_emoji || '🏆'}
      </Div>
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <P className={`text-sm font-bold ${colors.text}`}>{achievement.title}</P>
          <Span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${colors.bg} ${colors.border} ${colors.text}`}>
            {RARITY_LABELS[achievement.rarity || 'bronzo']}
          </Span>
          {!achievement.is_active && <Span className="text-[9px] text-muted-foreground border border-border px-1.5 py-0.5 rounded">Disattivo</Span>}
        </Div>
        <P className="text-[11px] text-muted-foreground truncate">{achievement.description}</P>
        <P className="text-[10px] text-muted-foreground mt-0.5">
          {CONDITION_LABELS[achievement.condition_type] || achievement.condition_type}:{' '}
          <Span className='font-bold'>{achievement.condition_value?.toLocaleString('it-IT')}</Span>
        </P>
      </Div>
      <Div className="flex gap-1 shrink-0">
        <Btn
          button
          onClick={() => onEdit(achievement)}
          className="p-1.5 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </Btn>
        <Btn
          button
          onClick={() => onDelete(achievement.id)}
          className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </Btn>
      </Div>
    </Div>
  );
}

export default function SettingsAchievements() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements-admin'],
    queryFn: () => base44.entities.Achievement.list(),
    staleTime: 5 * 60000,
  });

  const createMut = useMutation({
    mutationFn: d => base44.entities.Achievement.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['achievements-admin'] }); qc.invalidateQueries({ queryKey: ['achievements'] }); setAdding(false); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Achievement.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['achievements-admin'] }); qc.invalidateQueries({ queryKey: ['achievements'] }); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: id => base44.entities.Achievement.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['achievements-admin'] }); qc.invalidateQueries({ queryKey: ['achievements'] }); setDeleteId(null); },
  });

  const sorted = [...achievements].sort((a, b) => {
    const rDiff = (RARITY_SORT[a.rarity] ?? 0) - (RARITY_SORT[b.rarity] ?? 0);
    return rDiff !== 0 ? rDiff : (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  const byRarity = RARITIES.reduce((acc, r) => { acc[r] = []; return acc; }, {});
  sorted.forEach(a => { if (byRarity[a.rarity]) byRarity[a.rarity].push(a); });

  return (
    <Div className="rounded-xl border border-border bg-card overflow-hidden">
      <Div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
        <Div className="flex items-center gap-2">
          <SectionHeader icon={Trophy} title="Achievement" color="#fbbf24" />
          <Span className="text-[11px] text-muted-foreground">{achievements.length} obiettivi</Span>
        </Div>
        <Button size="sm" onClick={() => { setAdding(true); setEditing(null); }} className="h-7 text-xs gap-1.5" disabled={adding}>
          <Plus className="w-3.5 h-3.5" /> Nuovo
        </Button>
      </Div>

      <Div className="p-4 space-y-5">
        {adding && (
          <AchievementForm
            onSave={form => createMut.mutate(form)}
            onCancel={() => setAdding(false)}
            isSaving={createMut.isPending}
          />
        )}
        {isLoading ? (
          <Div className="flex items-center justify-center py-8">
            <Div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </Div>
        ) : sorted.length === 0 && !adding ? (
          <Div className="text-center py-8 text-muted-foreground text-sm">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Nessun achievement. Clicca "Nuovo" per crearne uno.
          </Div>
        ) : (
          RARITIES.map(rarity => {
            const items = byRarity[rarity];
            if (!items || items.length === 0) return null;
            const colors = RARITY_COLORS[rarity];
            return (
              <Div key={rarity}>
                <Div className="flex items-center gap-2 mb-2 px-1">
                  <Span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>{RARITY_LABELS[rarity]}</Span>
                  <Span className="text-[10px] text-muted-foreground">({items.length})</Span>
                </Div>
                <Div className="space-y-2">
                  {items.map(a => editing?.id === a.id ? (
                    <AchievementForm
                      key={a.id}
                      initial={editing}
                      onSave={form => updateMut.mutate({ id: a.id, data: form })}
                      onCancel={() => setEditing(null)}
                      isSaving={updateMut.isPending}
                    />
                  ) : (
                    <AchievementRow key={a.id} achievement={a} onEdit={setEditing} onDelete={setDeleteId} />
                  ))}
                </Div>
              </Div>
            );
          })
        )}
      </Div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questo achievement?</AlertDialogTitle>
            <AlertDialogDescription>Questa operazione non è reversibile.</AlertDialogDescription>
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