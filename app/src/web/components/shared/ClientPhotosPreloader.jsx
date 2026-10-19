// Port di src/components/shared/ClientPhotosPreloader.jsx (convertito da scripts/port/codemod.mjs).
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { useViewAsPromoter } from '@/lib/viewAs';
import { preloadImages } from '@/legacy/utils/imageCache';

/**
 * Precarica le foto profilo dei clienti del promoter corrente nel browser
 * cache appena i dati sono disponibili. Così ogni <CachedImage> con
 * src={client.photo_url} — nella lista clienti, detail dialog, share card,
 * programmazione — renderizza istantaneamente senza flash: l'immagine è già
 * nella cache HTTP del browser (e nelle prime 32 nella cache in memoria)
 * prima di essere usata. Renderizza null (nessun impatto visivo). Montato
 * una sola volta in AppLayout, come VenueLogosPreloader.
 */
export default function ClientPhotosPreloader() {
  const { effectivePromoterId } = useViewAsPromoter();

  const { data: clients = [] } = useQuery({
    queryKey: ['clients', effectivePromoterId],
    queryFn: () => base44.entities.Client.filter({ promoter_id: effectivePromoterId }),
    enabled: !!effectivePromoterId,
    staleTime: 10 * 60000,
    gcTime: 15 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    const urls = clients.map(c => c.photo_url).filter(Boolean);
    if (!urls.length) return;
    let cancelled = false;
    const run = () => { if (!cancelled) preloadImages(urls); };
    // Deferred a idle: vedi ImagePreloader per spiegazione.
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(run, { timeout: 3000 });
      return () => { cancelled = true; cancelIdleCallback(id); };
    }
    const id = setTimeout(run, 800);
    return () => { cancelled = true; clearTimeout(id); };
  }, [clients]);

  return null;
}