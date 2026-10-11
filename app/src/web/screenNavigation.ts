// Navigazione dello SCHERMO che contiene il componente (undefined fuori da uno schermo), dal contesto di
// react-navigation: stabile per tutta la vita dello schermo.
// NON usare useNavigation/useFocusEffect/useRoutePath di expo-router dentro le pagine: leggono un contesto
// che cambia a OGNI navigazione e ridisegnano tutte le pagine montate (docs/REGOLE-PRESTAZIONI.md §4).
import { useContext } from 'react';
import { NavigationContext } from 'expo-router/react-navigation';

export type ScreenNav = {
  isFocused?: () => boolean;
  addListener?: (e: 'focus' | 'blur', fn: () => void) => () => void;
} | undefined;

export function useScreenNavigation(): ScreenNav {
  return useContext(NavigationContext) as ScreenNav;
}
