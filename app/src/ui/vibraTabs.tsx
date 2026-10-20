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
// Le tab fuori schermo lo sono per layout (`left`, non transform) in un contenitore con
// `removeClippedSubviews`: Android le STACCA dall'albero delle viste (restano in memoria, niente da
// ricreare) e chi percorre l'albero dell'accessibilità non le visita. Robo di Test Lab conta anche le viste
// non importanti e ignora `no-hide-descendants`: con 3 tab precaricate attaccate ~3000 nodi e 10-25 s per
// schermata (Test Lab 39332948258, 39352849892), contro ~1000 del 17/10.
import { withLayoutContext } from 'expo-router';
import {
  SafeAreaProviderCompat, Screen, TabRouter, createNavigatorFactory, useNavigationBuilder,
} from 'expo-router/react-navigation';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { memo, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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

// lontano dallo schermo: il contenitore (overflow hidden, removeClippedSubviews) la stacca
const OFFSCREEN = 100000;

const TabScene = memo(function TabScene({ index, focused, children }: { index: number; focused: boolean; children: ReactNode }) {
  // una tab che si monta col focus (avvio, o prima visita a una tab non precaricata) va a schermo
  // PRIMA di calcolare lo stile iniziale: scritta in modo sincrono sul thread UI, perché la scrittura
  // normale dal JS arriva dopo e l'aggiornamento della vista non ancora montata andrebbe perso
  // (con ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS il transform non passa dallo ShadowTree): pagina vuota.
  useState(() => {
    if (!focused) return;
    focusedTab = index;
    const show = (i: number) => {
      'worklet';
      if (pendingTab.value >= 0 && pendingTab.value !== i) return;
      pendingTab.value = -1;
      shownTab.value = i;
    };
    // sul web (confronti con tools/compare) runOnUISync non esiste: non c'è un thread UI separato
    if (Platform.OS === 'web') show(index);
    else runOnUISync(show, index);
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
  // left/right (layout) e non translateX: lo stacco di removeClippedSubviews guarda la posizione di layout.
  // Reanimated li applica dal thread UI con un commit dello ShadowTree (niente attesa del JS).
  const style = useAnimatedStyle(() => {
    const x = shownTab.value === index ? 0 : OFFSCREEN;
    return { left: x, right: -x };
  });
  // la tab non a fuoco è anche nascosta all'accessibilità, come il menu laterale chiuso (ui/sideDrawer):
  // TalkBack non la legge anche nell'istante in cui è ancora attaccata (lo stacco è nel commit successivo)
  return (
    <Animated.View
      style={[styles.scene, style]}
      collapsable={false}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      accessibilityElementsHidden={!focused}
    >
      {children}
    </Animated.View>
  );
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
        <View style={styles.screens} removeClippedSubviews>
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
  scene: { position: 'absolute', top: 0, bottom: 0 },
});

const createVibraTabNavigator = createNavigatorFactory(VibraTabNavigator as any);
export const VibraTabs = withLayoutContext(createVibraTabNavigator().Navigator);
