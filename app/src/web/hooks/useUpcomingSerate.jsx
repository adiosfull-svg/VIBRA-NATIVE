// Port di src/hooks/useUpcomingSerate.js (convertito da scripts/port/codemod.mjs).
import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';

const DAY_LABELS = { 5: 'Venerdì', 6: 'Sabato', 0: 'Domenica' };
const VENUE_ALIASES = {
  'Ammare Frontemare': 'Frontemare',
  'Extra / Festivi': '__festivo__',
  'Extra - Festivi': '__festivo__',
};

/**
 * Prossime serate: ogni Ven/Sab/Dom per i prossimi 2 mesi, etichettate con
 * il locale attivo per giorno della settimana e relative al logo.
 */
export function useUpcomingSerate() {
  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => base44.entities.Venue.list(),
    staleTime: 30 * 60000,
    gcTime: 60 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { logoMap } = useAllVenueLogos();

  const venueByDow = useMemo(() => {
    const map = {};
    venues
      .filter(v => v.is_active && !v.is_extra && v.day_of_week != null && v.show_in_prospetto !== false)
      .forEach(v => { if (map[v.day_of_week] == null) map[v.day_of_week] = v.name; });
    return map;
  }, [venues]);

  const upcomingDates = useMemo(() => {
    const out = [];
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 60);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      if (dow === 5 || dow === 6 || dow === 0) {
        const dateStr = format(d, 'yyyy-MM-dd');
        const venueName = venueByDow[dow] || null;
        const logoUrl = venueName ? (logoMap[VENUE_ALIASES[venueName] || venueName] || '') : '';
        out.push({ dateStr, dow, dayLabel: DAY_LABELS[dow], venueName, logoUrl, dateObj: new Date(d) });
      }
    }
    return out;
  }, [venueByDow, logoMap]);

  const metaForDate = useCallback((dateStr) => {
    const d = upcomingDates.find(x => x.dateStr === dateStr);
    if (!d) return null;
    return {
      title: `${d.dayLabel}${d.venueName ? ' · ' + d.venueName : ''}`,
      subtitle: format(d.dateObj, 'd MMM yyyy', { locale: it }),
    };
  }, [upcomingDates]);

  return { upcomingDates, metaForDate };
}