// Port di src/components/client/ImportaClientiDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/input';
import { CheckCircle2, Loader2, AlertCircle, Sparkles } from '@/ui/icons.generated';
import { base44 } from '@/lib/base44';
import { useAuth } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { Div, P } from '@/ui/html';

export default function ImportaClientiDialog({ open, onOpenChange }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [importing, setImporting] = useState(false);
  const qc = useQueryClient();
  useOverlay(open, () => onOpenChange?.(false));

  const handleImport = async () => {
    const names = text
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (!names.length) return;

    setImporting(true);
    setResults(null);

    const created = [];
    const errors = [];
    const createdRecords = [];

    for (const name of names) {
      try {
        const result = await base44.entities.Client.create({
          name,
          promoter_id: user.promoter_id,
        });
        createdRecords.push(result);
        created.push(name);
      } catch (err) {
        errors.push(name);
      }
    }

    // Optimistic: aggiungi subito i clienti creati alla cache
    if (createdRecords.length > 0) {
      qc.setQueryData(['clients', user.promoter_id], (old = []) => [...(old || []), ...createdRecords]);
    }
    setImporting(false);
    setResults({ created, errors });
  };

  const handleClose = () => {
    setText('');
    setResults(null);
    onOpenChange(false);
  };

  const names = text.split('\n').map(n => n.trim()).filter(n => n.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent popup className="sm:max-w-lg w-full overflow-y-auto overscroll-contain">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Importa Clienti
          </DialogTitle>
        </DialogHeader>

        <Div className="relative">
        {!results ? (
          <Div className="space-y-4">
            <P className="text-sm text-muted-foreground">
              Inserisci un nome per riga. Ogni riga creerà una scheda cliente associata al tuo profilo.
            </P>
            <Textarea
              placeholder={"Mario Rossi\nGiuseppe Verdi\nSara Bianchi"}
              value={text}
              onChange={e => setText(e.target.value)}
              className="min-h-[180px] font-mono text-sm"
              autoFocus
            />
            {names.length > 0 && (
              <P className="text-xs text-muted-foreground">{names.length} clienti da importare</P>
            )}
            <Div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Annulla</Button>
              <Button onClick={handleImport} disabled={names.length === 0 || importing}>
                {importing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importando...</> : `Importa ${names.length > 0 ? names.length : ''} clienti`}
              </Button>
            </Div>
          </Div>
        ) : (
          <Div className="space-y-4">
            {results.created.length > 0 && (
              <Div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 space-y-2">
                <Div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  {results.created.length} clienti importati con successo
                </Div>
                <Div className="text-xs text-muted-foreground space-y-0.5 pl-6">
                  {results.created.map(n => <Div key={n}>{n}</Div>)}
                </Div>
              </Div>
            )}
            {results.errors.length > 0 && (
              <Div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 space-y-2">
                <Div className="flex items-center gap-2 text-destructive text-sm font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  {results.errors.length} errori
                </Div>
                <Div className="text-xs text-muted-foreground space-y-0.5 pl-6">
                  {results.errors.map(n => <Div key={n}>{n}</Div>)}
                </Div>
              </Div>
            )}
            <Div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setText(''); setResults(null); }}>Importa altri</Button>
              <Button onClick={handleClose}>Chiudi</Button>
            </Div>
          </Div>
        )}
        </Div>
      </DialogContent>
    </Dialog>
  );
}