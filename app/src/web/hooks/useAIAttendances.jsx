// Port di src/hooks/useAIAttendances.js (convertito da scripts/port/codemod.mjs).
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useRoleAccess } from '@/lib/useRoleAccess';
import { attendancesAllOptions } from '@/web/lib/attendanceQueries';

const EMPTY = [];

/**
 * Presenze per Ricerca AI / VibraGPT, scaricate in base al ruolo:
 *  - admin / super4  -> tabella completa (cache condivisa ['attendances-all'])
 *  - capogruppo / pr -> solo le proprie (['attendances', promoterId], la stessa cache di Clienti
 *    e del prefetch, quindi di norma già pronta)
 * ChatStrategica filtra già per il solo promoter_id dell'utente in modalità 'limited', quindi
 * il risultato mostrato è identico a prima: cambia solo quanto si scarica.
 * Un capogruppo/pr senza promoter_id continua a ricevere la tabella completa, come prima
 * (ChatStrategica in quel caso non filtra).
 * Se il ruolo non può accedere alla pagina non scarica nulla.
 */
export function useAIAttendances() {
  const { user, canAccessRicercaAI, ricercaAIMode } = useRoleAccess();
  const myPid = user?.promoter_id;
  const allowed = canAccessRicercaAI();
  const limited = allowed && ricercaAIMode() === 'limited' && !!myPid;

  const full = useQuery({
    ...attendancesAllOptions(),
    enabled: allowed && !limited,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const mine = useQuery({
    queryKey: ['attendances', myPid],
    queryFn: () => base44.entities.EventAttendance.filter({ promoter_id: myPid }, '-created_date', 5000),
    enabled: limited,
    staleTime: 5 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (limited ? mine.data : full.data) ?? EMPTY;
}