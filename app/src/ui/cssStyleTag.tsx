/**
 * Segnaposto di un <style> dell'originale (il CSS è già in customCss.web.ts o non serve): non disegna
 * nulla, ma in CSS il tag è un fratello per `space-*` (`:not([hidden]) ~ :not([hidden])`), quindi il
 * primo elemento dopo di lui prende il margine. spaceOverrides (html.tsx) lo tratta come un elemento
 * fuori dal flusso.
 */
export function CssStyleTag(): null {
  return null;
}
CssStyleTag.cssStyleTag = true;
