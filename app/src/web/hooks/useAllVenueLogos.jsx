// Port di src/hooks/useAllVenueLogos.jsx (convertito da scripts/port/codemod.mjs).
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useMemo } from 'react';

// Chiave evento nel DB → chiave canonica salvata in AppSettings
const VENUE_ALIASES = {
  'Ammare Frontemare': 'Frontemare',
  'Extra / Festivi': '__festivo__',
  'Extra - Festivi': '__festivo__',
};

export function useAllVenueLogos() {
  const { data: settings = [] } = useQuery({
    queryKey: ['all-app-settings'],
    queryFn: () => base44.entities.AppSettings.list(),
    // Mai stale: una volta caricati, i loghi non vengono mai rifetchati in sessione
    // → niente flash quando le card/serate si rimontano.
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const logoMap = useMemo(() => {
    const map = {};
    settings.forEach(s => {
      if (s.key?.startsWith('venue_logo_') && !s.key?.startsWith('venue_logo_zoom_')) {
        const venueKey = s.key.replace('venue_logo_', '');
        map[venueKey] = s.value || '';
      }
    });
    return map;
  }, [settings]);

  const getVenueLogo = (venueKey) => {
    const resolvedKey = VENUE_ALIASES[venueKey] || venueKey;
    return { logoUrl: logoMap[resolvedKey] || '', zoom: 1 };
  };

  return { logoMap, getVenueLogo };
}