// Equivalente nativo di src/utils/imageCache.js: sul web decodificava le immagini in anticipo
// (new Image().decode()). In RN il precaricamento con cache su disco lo fa expo-image.
import { Image } from 'expo-image';

const done = new Set();

export function preloadImages(urls) {
  const list = (urls || []).filter((u) => u && !done.has(u));
  if (!list.length) return Promise.resolve();
  list.forEach((u) => done.add(u));
  return Image.prefetch(list, 'disk').catch(() => {});
}
export function preloadImage(url) { return preloadImages([url]); }
export function warmStartImages() {}
