// Port di src/hooks/useVenueLogo.jsx (convertito da scripts/port/codemod.mjs).
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';

// Unica logica di risoluzione logo locale, condivisa da ogni sezione/tab.
// Delega interamente a useAllVenueLogos (che ha la mappa alias completa).
export function useVenueLogo(venueKey) {
  const { getVenueLogo } = useAllVenueLogos();
  return getVenueLogo(venueKey);
}