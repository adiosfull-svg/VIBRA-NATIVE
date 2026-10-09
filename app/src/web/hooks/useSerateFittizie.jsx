// Port di src/hooks/useSerateFittizie.jsx (convertito da scripts/port/codemod.mjs).
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';

/**
 * Serate fittizie condivise tra tutti i promoter.
 * Non sono Event reali: esistono solo nel prospetto inviti per pianificare
 * serate extra (es. Capodanno). Quando un promoter ne crea una, diventa
 * disponibile per tutti i promoter nel menu contestuale "Aggiungi a serata".
 */
export function useSerateFittizie() {
  const { data = [] } = useQuery({
    queryKey: ['serate-fittizie'],
    queryFn: () => base44.entities.SerataFittizia.list(),
    staleTime: 2 * 60000,
    gcTime: 10 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  return data;
}