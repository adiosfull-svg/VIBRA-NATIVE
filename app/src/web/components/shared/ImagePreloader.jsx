// Port di src/components/shared/ImagePreloader.jsx (convertito da scripts/port/codemod.mjs).
import { useEffect } from 'react';
import { preloadImages } from '@/legacy/utils/imageCache';

/**
 * Precarica una lista di URL immagine nel browser cache (HTTP cache + cache
 * in memoria) appena il componente monta. Da usare in AppLayout per ogni set
 * di immagini che deve apparire istantaneamente senza flash alla prima
 * visualizzazione.
 *
 * BASE RIUSABILE: per aggiungere il precaricamento di un nuovo campo immagine
 * in futuro, crea un wrapper che fetcha i dati, estrae gli URL e li passa a
 * questo componente come prop `urls`. Esempio:
 *
 *   const { data } = useQuery({ ... });
 *   const urls = data.map(x => x.photo_url).filter(Boolean);
 *   return <ImagePreloader urls={urls} />;
 *
 * @param {string[]} urls - URL da precaricare (null/undefined/vuoti ignorati)
 */
export default function ImagePreloader({ urls }) {
  useEffect(() => {
    if (!urls?.length) return;
    let cancelled = false;
    const run = () => { if (!cancelled) preloadImages(urls); };
    // Deferred a idle: il downscaling canvas (createImageBitmap + toBlob) è
    // CPU-bound sul main thread. Eseguirlo subito al mount compete con le
    // animazioni di entrata framer-motion (opacity/y) causando stutter.
    // requestIdleCallback lascia che l'animazione termini prima di iniziare
    // il lavoro pesante di pre-decodifica.
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(run, { timeout: 3000 });
      return () => { cancelled = true; cancelIdleCallback(id); };
    }
    const id = setTimeout(run, 800);
    return () => { cancelled = true; clearTimeout(id); };
  }, [urls]);
  return null;
}