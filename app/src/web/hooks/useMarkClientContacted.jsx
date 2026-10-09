// Port di src/hooks/useMarkClientContacted.jsx (convertito da scripts/port/codemod.mjs).
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';

/**
 * Hook che restituisce una funzione `markContacted(clientId)` per segnare
 * automaticamente un cliente come "sentito" (last_contacted_at = now).
 * Invalida le query clienti + suggerimenti settimanali così l'UI si aggiorna.
 *
 * Usato da tutte le icone WhatsApp (weekend, leader, clienti) così l'apertura
 * della chat segna in automatico il contatto.
 */
export function useMarkClientContacted() {
  const qc = useQueryClient();
  return async (clientId) => {
    if (!clientId) return;
    try {
      await base44.entities.Client.update(clientId, { last_contacted_at: new Date().toISOString() });
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['weeklySuggestion'] });
    } catch { /* ignore — non bloccare l'apertura di WhatsApp */ }
  };
}