// Port di src/components/shared/VenueLogosPreloader.jsx (convertito da scripts/port/codemod.mjs).
import { useEffect } from 'react';
import { useAllVenueLogos } from '@/web/hooks/useAllVenueLogos';
import { preloadImages } from '@/legacy/utils/imageCache';

/**
 * Precarica le immagini dei loghi dei locali nel browser cache appena i settings
 * sono disponibili. Così ogni <img> con src={logoUrl} — in qualsiasi sezione, tab
 * o dialog (box presenze, clienti, serate, weekend...) — renderizza istantaneamente
 * senza flash: l'immagine è già nella cache del browser prima di essere usata.
 * Renderizza null (nessun impatto visivo). Montato una sola volta in AppLayout.
 */
export default function VenueLogosPreloader() {
  const { logoMap } = useAllVenueLogos();

  useEffect(() => {
    const urls = Object.values(logoMap).filter(Boolean);
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
  }, [logoMap]);

  return null;
}