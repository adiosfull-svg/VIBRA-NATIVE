// Port di src/components/shared/PromoterPhotosPreloader.jsx (convertito da scripts/port/codemod.mjs).
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useViewAsPromoter } from '@/lib/viewAs';
import { preloadImages } from '@/legacy/utils/imageCache';
import { pinImage } from '@/legacy/utils/publicImageCache';
import ImagePreloader from './ImagePreloader';

/**
 * Precarica le foto profilo dei promoter.
 * Stessa base logica di ClientPhotosPreloader e VenueLogosPreloader.
 * Condividi la query key ['promoters'] con Dashboard/Promoter/Clienti.
 *
 * La foto del promoter CORRENTE (sempre visibile in Il Mio Vibra e altrove)
 * viene precaricata SUBITO con priorità massima e "pinnata" (mai sfrattata
 * dalla cache in memoria): niente attesa idle, niente flash al primo avvio.
 * Le altre foto dei promoter restano deferred a idle come prima.
 */
export default function PromoterPhotosPreloader() {
  const { effectivePromoterId } = useViewAsPromoter();

  const { data: promoters = [] } = useQuery({
    queryKey: ['promoters'],
    queryFn: () => base44.entities.Promoter.list(),
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // La foto del promoter corrente: preload immediato + pin.
  const myPhotoUrl = useMemo(() => {
    if (!effectivePromoterId) return null;
    const me = promoters.find(p => p.id === effectivePromoterId);
    return me?.photo_url || null;
  }, [promoters, effectivePromoterId]);

  useEffect(() => {
    if (!myPhotoUrl) return;
    pinImage(myPhotoUrl);
    preloadImages([myPhotoUrl], { priority: true });
  }, [myPhotoUrl]);

  // Tutte le altre foto: deferred a idle (come prima).
  const otherUrls = useMemo(
    () => promoters.filter(p => p.photo_url && p.id !== effectivePromoterId).map(p => p.photo_url),
    [promoters, effectivePromoterId]
  );

  return <ImagePreloader urls={otherUrls} />;
}