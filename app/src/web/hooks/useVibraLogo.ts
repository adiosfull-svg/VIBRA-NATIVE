// Port di src/hooks/useVibraLogo.jsx: stesso logo dell'app web (l'immagine è messa in cache da expo-image).
// TODO migrazione: includere il PNG negli asset dell'app prima di dismettere lo storage Base44.
const LOGO_URL = 'https://media.base44.com/images/public/69de4f1f7f53d9f187d01392/d975f42fa_VIBRAPNG.png';

export function useVibraLogo() {
  return { logoDataUrl: LOGO_URL, loading: false };
}
