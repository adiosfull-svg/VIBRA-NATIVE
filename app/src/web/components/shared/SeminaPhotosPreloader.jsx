// Port di src/components/shared/SeminaPhotosPreloader.jsx (convertito da scripts/port/codemod.mjs).
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useViewAsPromoter } from '@/lib/viewAs';
import ImagePreloader from './ImagePreloader';

/**
 * Precarica le foto profilo delle semine del promoter corrente.
 * Stessa base logica di ClientPhotosPreloader e VenueLogosPreloader.
 */
export default function SeminaPhotosPreloader() {
  const { effectivePromoterId } = useViewAsPromoter();

  const { data: semine = [] } = useQuery({
    queryKey: ['semine', effectivePromoterId],
    queryFn: () => base44.entities.Semina.filter({ promoter_id: effectivePromoterId }),
    enabled: !!effectivePromoterId,
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const urls = useMemo(() => semine.map(s => s.photo_url).filter(Boolean), [semine]);
  return <ImagePreloader urls={urls} />;
}