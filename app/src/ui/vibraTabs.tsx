// Navigatore delle 5 tab principali (al posto del Tabs di expo-router, stesso router e stessi eventi).
//
// PRESTAZIONI (docs/REGOLE-PRESTAZIONI.md §5): con il Tabs di expo-router la pagina cambiava solo dopo
// il lavoro del JS (navigazione, render del navigatore e propagazione dei contesti di navigazione in
// tutte le tab precaricate: 50-450 ms sull'emulatore, profilo in tools/profilo) e poi react-native-screens
// riattaccava la pagina. Qui le tab montate restano SEMPRE attaccate: quella visibile è a posto, le altre
// spostate fuori dallo schermo (translateX, tagliate dal contenitore: niente disegno e niente tocchi).
// Quale si vede lo decide una shared value (`shownTab`): la barra in basso la cambia sul thread UI al
// rilascio del dito, nello stesso frame, e il JS naviga dopo; ogni cambio di tab del JS (sidebar, link,
// Indietro) la riallinea. Mai `display: none` (in Fabric distrugge le viste native, vedi §5).
import { withLayoutContext } from 'expo-router';
import {
  SafeAreaProviderCompat, Screen, TabRouter, createNavigatorFactory, useNavigationBuilder,
} from 'expo-router/react-navigation';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { memo, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { makeMutable, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { runOnUISync } from 'react-native-worklets';

/** Indice (nell'ordine delle route del navigatore) della tab a schermo: lo scrive anche il thread UI. */
export const shownTab = makeMutable(-1);
/** Tab chiesta dal thread UI e non ancora col focus nel JS (-1 = nessuna): i focus intermedi del JS
 *  (tocchi rapidi su più voci) non la riportano indietro. */
export const pendingTab = makeMutable(-1);
/** Tab montate (bit = indice): la barra cambia tab sul thread UI solo se la pagina è già pronta. */
export const mountedTabs = makeMutable(0);
// ultima tab col focus nel JS: per riallineare se una navigazione partita dal thread UI non avviene
let focusedTab = -1;
/** Rimette a schermo la tab che ha il focus (es. navigazione rifiutata dopo il cambio sul thread UI). */
export function resyncShownTab() {
  pendingTab.value = -1;
  if (focusedTab >= 0 && shownTab.value !== focusedTab) shownTab.value = focusedTab;
}

// lontano dallo schermo: il contenitore (overflow hidden) la taglia, Android non la disegna
const OFFSCREEN = 100000;

const TabScene = memo(function TabScene({ index, focused, children }: { index: number; focused: boolean; children: ReactNode }) {
  // una tab che si monta col focus (avvio, o prima visita a una tab non precaricata) va a schermo
  // PRIMA di calcolare lo stile iniziale: scritta in modo sincrono sul thread UI, perché la scrittura
  // normale dal JS arriva dopo e l'aggiornamento della vista non ancora montata andrebbe perso
  // (con ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS il transform non passa dallo ShadowTree): pagina vuota.
  useState(() => {
    if (!focused) return;
    focusedTab = index;
    runOnUISync((i: number) => {
      'worklet';
      if (pendingTab.value >= 0 && pendingTab.value !== i) return;
      pendingTab.value = -1;
      shownTab.value = i;
    }, index);
  });
  // solo quando cambia il focus nel JS: un ridisegno qualsiasi mentre il thread UI ha già cambiato tab
  // non deve riportare indietro quella vecchia
  useLayoutEffect(() => {
    if (!focused) return;
    focusedTab = index;
    const pending = pendingTab.value;
    if (pending >= 0 && pending !== index) return; // il dito ha già chiesto un'altra tab
    pendingTab.value = -1;
    shownTab.value = index;
  }, [focused, index]);
  useEffect(() => {
    mountedTabs.value |= 1 << index;
    return () => { mountedTabs.value &= ~(1 << index); };
  }, [index]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: shownTab.value === index ? 0 : OFFSCREEN }] }));
  return <Animated.View style={[StyleSheet.absoluteFill, style]} collapsable={false}>{children}</Animated.View>;
});

type Props = {
  id?: string;
  initialRouteName?: string;
  backBehavior?: any;
  children: ReactNode;
  screenListeners?: any;
  screenOptions?: any;
  tabBar: (props: BottomTabBarProps) => ReactNode;
};

function VibraTabNavigator({ id, initialRouteName, backBehavior, children, screenListeners, screenOptions, tabBar }: Props) {
  const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder(TabRouter, {
    id, initialRouteName, backBehavior, children, screenListeners, screenOptions,
  } as any);
  const insets = useSafeAreaInsets();
  const focusedKey = state.routes[state.index].key;
  // come il Tabs di expo-router: una tab si monta la prima volta che ha il focus o se precaricata
  const [loaded, setLoaded] = useState([focusedKey]);
  if (!loaded.includes(focusedKey)) setLoaded([...loaded, focusedKey]);
  const preloaded: string[] = (state as any).preloadedRouteKeys ?? [];
  return (
    <NavigationContent>
      <SafeAreaProviderCompat>
        <View style={styles.screens}>
          {state.routes.map((route, index) => {
            const isFocused = index === state.index;
            if (!loaded.includes(route.key) && !isFocused && !preloaded.includes(route.key)) return null;
            const d = descriptors[route.key];
            return (
              <TabScene key={route.key} index={index} focused={isFocused}>
                <Screen focused={isFocused} route={d.route} navigation={d.navigation} header={null} headerShown={false} style={(d.options as { sceneStyle?: object }).sceneStyle}>
                  {d.render()}
                </Screen>
              </TabScene>
            );
          })}
        </View>
        {tabBar({ state, descriptors, navigation, insets } as unknown as BottomTabBarProps)}
      </SafeAreaProviderCompat>
    </NavigationContent>
  );
}

const styles = StyleSheet.create({
  screens: { flex: 1, overflow: 'hidden' },
});

const createVibraTabNavigator = createNavigatorFactory(VibraTabNavigator as any);
export const VibraTabs = withLayoutContext(createVibraTabNavigator().Navigator);
