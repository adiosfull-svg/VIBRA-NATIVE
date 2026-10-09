// Port di src/components/shared/DeleteAccountDialog.jsx.
import { useState } from 'react';
import { base44 } from '../../../lib/base44';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../../ui/dialog';
import { Span } from '../../../ui/html';

export default function DeleteAccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await base44.auth.logout('/');
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminare l'account?</AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione è <Span className="font-bold text-sm text-muted-foreground">irreversibile</Span>. Tutti i tuoi dati personali verranno eliminati entro 30 giorni dalla richiesta.{'\n\n'}
            Se sei un admin, contatta il supporto per completare l'eliminazione definitiva.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleDelete} className="bg-destructive">
            {loading ? 'Disconnessione...' : 'Sì, elimina il mio account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
