// Port di src/hooks/useVibraLogo.jsx: come l'originale il logo è un file dell'app ('/vibra-logo.png',
// copia di public/vibra-logo.png in assets/), risolto da imageSource() di ui/imageCache.
export const LOGO_URL = '/vibra-logo.png';

export function useVibraLogo() {
  return { logoDataUrl: LOGO_URL, loading: false };
}
