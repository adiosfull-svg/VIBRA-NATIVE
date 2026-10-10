// Identico a src/lib/utils.js dell'app web.
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// twMerge ha una cache di 500 voci: le classi ereditate dal testo (text.tsx) creano molte più
// combinazioni e sul telefono ogni mancanza costa un parse completo. Cache più ampia sul risultato.
const cache = new Map<string, string>();

export function cn(...inputs: ClassValue[]) {
  const key = clsx(inputs);
  let out = cache.get(key);
  if (out === undefined) {
    if (cache.size > 10000) cache.clear();
    out = twMerge(key);
    cache.set(key, out);
  }
  return out;
}
