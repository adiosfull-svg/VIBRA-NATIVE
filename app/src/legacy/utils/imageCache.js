// Equivalente nativo di src/utils/imageCache.js: sul web decodificava le immagini in anticipo
// (new Image().decode()) in una coda con concorrenza 4. In RN lo fa expo-image con la cache in memoria +
// disco di ui/imageCache (docs/REGOLE-PRESTAZIONI.md §6): l'immagine precaricata compare senza flash.
import { queueImagePrefetch } from '@/ui/imageCache';

/** Non blocca: mette in coda (priority: davanti, come le foto "calde" dell'originale). */
export function preloadImages(urls, { priority = false } = {}) {
  queueImagePrefetch(urls || [], { priority });
  return Promise.resolve();
}
export function preloadImage(url) { return preloadImages([url]); }
export function warmStartImages() {}
