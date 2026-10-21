// Vibrazione al tocco (expo-haptics) per i gesti dell'app: menu col tasto lungo, swipe per eliminare,
// aggiorna tirando giù, interruttori. Sul telefono come un'app nativa; sul web niente (il browser del
// computer non vibra). Tutte senza attesa: l'effetto parte dal thread nativo e gli errori si ignorano.
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const ON = Platform.OS !== 'web';
const ignore = () => {};

export const haptic = {
  /** cambio di scelta (interruttore, voce evidenziata) */
  select() { if (ON) Haptics.selectionAsync().catch(ignore); },
  /** gesto riconosciuto: menu aperto col tasto lungo, soglia dello swipe superata, aggiorna */
  light() { if (ON) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(ignore); },
  /** azione decisa: selezione multipla, elemento eliminato */
  medium() { if (ON) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(ignore); },
};

/** navigator.vibrate(ms) dell'originale (Chrome su Android vibra): impulsi brevi → tocco leggero, lunghi → medio. */
export function vibrate(pattern?: number | number[]) {
  const ms = Array.isArray(pattern) ? pattern[0] ?? 0 : pattern ?? 0;
  if (ms <= 0) return false;
  if (ms < 10) haptic.select();
  else if (ms <= 20) haptic.light();
  else haptic.medium();
  return true;
}
