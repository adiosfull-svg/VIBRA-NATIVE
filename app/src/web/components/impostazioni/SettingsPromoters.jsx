// Port di src/components/impostazioni/SettingsPromoters.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Trash2, ShieldAlert, Plus, Pencil } from '@/ui/icons.generated';
import PromoterFormDialog from '@/web/components/promoter/PromoterFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/ui/dialog';

import { Btn, Div, H, P, Span } from '@/ui/html';

const RUOLI_LABELS = {
  fondatore: 'Fondatore',
  super4: 'Super 4',
  capogruppo: 'Capogruppo',
  pr: 'PR',
  ragazza_immagine: 'Ragazza Immagine',
};

export default function SettingsPromoters() {
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Sempre sincronizzato: staleTime 0 (default) + refetchOnMount garantiscono
  // che la lista rifletta subito modifiche fatte ovunque nell'app (pagina
  // Promoter, ecc.) grazie alla chiave di cache condivisa ['promoters'].
  const { data: promoters = [], isLoading } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    refetchOnMount: true,
  });

  const deleteMut = useMutation({
    mutationFn: id => base44.entities.Promoter.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promoters'] });
      setDeleteTarget(null);
    },
  });

  const createMut = useMutation({
    mutationFn: d => base44.entities.Promoter.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promoters'] });
      setDialogOpen(false);
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Promoter.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promoters'] });
      setDialogOpen(false);
      setEditing(null);
    },
  });

  const handleSave = (form) => {
    if (editing) updateMut.mutate({ id: editing.id, data: form });
    else createMut.mutate(form);
  };

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (p) => { setEditing(p); setDialogOpen(true); };

  return (
    <Div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-5 space-y-4">
      <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, #f87171, transparent)' }} />

      <Div className="flex items-center justify-between gap-3">
        <H className="text-sm font-semibold">Gestione Promoter</H>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          <Span>Aggiungi promoter</Span>
        </Button>
      </Div>

      <Div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
        <ShieldAlert className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
        <P className="text-xs text-muted-foreground">
          L'eliminazione di un promoter è irreversibile e rimuove il record dal team. Le presenze/serate storiche associate non vengono cancellate.
        </P>
      </Div>

      {isLoading ? (
        <P className="text-sm text-muted-foreground">Caricamento...</P>
      ) : promoters.length === 0 ? (
        <P className="text-sm text-muted-foreground">Nessun promoter presente.</P>
      ) : (
        <Div className="space-y-2">
          {promoters.map(p => (
            <Div key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/30 border border-border px-3 py-2.5">
              <Btn
                button
                onClick={() => openEdit(p)}
                className="min-w-0 text-left flex-1 group"
                accessibilityLabel="Modifica promoter">
                <P className="text-sm font-medium truncate group-hover:text-primary transition-colors">{p.name}</P>
                <P className="text-[10px] text-muted-foreground/60 font-mono truncate mt-0.5 select-all" accessibilityLabel="ID promoter (auto-generato)">{p.id}</P>
                <Div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <Badge variant="outline" className={p.status === 'attivo' ? 'border-green-500/30 text-green-400 text-[10px]' : 'text-[10px]'}>
                    {p.status}
                  </Badge>
                  {p.ruolo && (
                    <Badge variant="secondary" className="text-[10px]">{RUOLI_LABELS[p.ruolo] || p.ruolo}</Badge>
                  )}
                </Div>
              </Btn>
              <Div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(p)} title="Modifica">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(p)} title="Elimina">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Div>
            </Div>
          ))}
        </Div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Questa azione non può essere annullata.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMut.mutate(deleteTarget.id)}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PromoterFormDialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }} promoter={editing} onSave={handleSave} />
    </Div>
  );
}