// Equivalente nativo di src/utils/imageCache.js: sul web decodificava le immagini in anticipo
// (new Image().decode()). In RN lo fa expo-image con la cache in memoria + disco di ui/imageCache
// (docs/REGOLE-PRESTAZIONI.md §6): l'immagine precaricata compare senza flash.
import { prefetchImages } from '@/ui/imageCache';

export function preloadImages(urls) {
  return prefetchImages(urls || []).then(() => undefined);
}
export function preloadImage(url) { return preloadImages([url]); }
export function warmStartImages() {}
