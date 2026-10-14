// Port di src/lib/pagePreload.js: sul web scaricava in anticipo il chunk JS della pagina (import dinamico)
// al pointerDown. Nell'app nativa il codice è già tutto nel bundle: non serve (il precaricamento delle
// pagine montate è in lib/preloadRoutes.ts). Tenuto per non cambiare il codice delle pagine.
export function preloadPage(_path: string): void {}
