// Equivalente nativo di src/utils/publicImageCache.js: sul web teneva in memoria blob URL delle
// immagini pubbliche per mostrarle senza flash. In RN se ne occupa la cache di expo-image:
// le funzioni restituiscono direttamente l'URL originale.
export function canCacheImage(src) { return !!src; }
export function acquireImage(src) { return { promise: Promise.resolve(src), release() {} }; }
export function peekImage(src) { return src || ''; }
export function pickDisplaySrc(src) { return src || ''; }
export function rememberShown() {}
export function isShown() { return true; }
export function markDecoded() {}
export function forgetWarm() {}
export function getWarmUrls() { return []; }
export function pinImage() {}
export function isPinned() { return false; }
export function clearWarmImages() {}
