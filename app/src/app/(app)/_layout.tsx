// Shell dell'app (AppLayout.jsx): sidebar globale + stack delle pagine. Ogni pagina disegna la
// propria intestazione in linea (Page → AppHeader), come nell'originale.
import { Stack, useSegments } from 'expo-router';
import MobileNavBar from '../../web/components/layout/MobileNavBar';
import Sidebar from '../../web/components/layout/Sidebar';
import VibraSearch from '../../web/components/shared/VibraSearch';
import Calcolatrice from '../../web/components/ilmiovibra/Calcolatrice';
import { CalcolatriceProvider, useCalcolatrice } from '../../web/lib/calcolatriceContext';
import { LayoutUIProvider } from '../../web/lib/layoutUI';
import { THEME } from '../../ui/palette.generated';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeBlur, usePageBlurTarget } from '../../ui/pageLayers';
import { Div } from '../../ui/html';
import { LocationPublisher } from '../../web/router';

/**
 * Fascia dell'orario (telefono): l'app disegna fino al bordo dello schermo e la pagina scorreva sotto
 * l'orario nitida. Stesso vetro della nav bar: blur della pagina in primo piano + bg-background/30.
 */
function StatusBarGlass() {
  const top = useSafeAreaInsets().top;
  const target = usePageBlurTarget();
  if (Platform.OS === 'web' || !top) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: top }}>
      <NativeBlur intensity={24} target={target} style={StyleSheet.absoluteFill} />
      <Div pointerEvents="none" className="absolute inset-0 bg-background/30" />
    </View>
  );
}

// Calcolatrice globale: resta attiva su tutte le rotte finché non la chiudi (come AppLayout.jsx).
function GlobalCalcolatrice() {
  const { open, close } = useCalcolatrice();
  if (!open) return null;
  return <Calcolatrice onClose={close} />;
}

export default function AppLayout() {
  // le 5 tab hanno la barra come tab bar; le altre pagine la ricevono qui (nell'originale è in AppLayout)
  const inTabs = (useSegments() as string[]).includes('(tabs)');
  return (
    <LayoutUIProvider>
      <CalcolatriceProvider>
      <LocationPublisher />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.background }, animation: 'none' }} />
      {!inTabs && <MobileNavBar />}
      <StatusBarGlass />
      <Sidebar />
      {/* Vibra Search: ricerca globale (pulsante Cerca della nav, come AppLayout.jsx) */}
      <VibraSearch />
      {/* Calcolatrice globale — persiste su tutte le rotte */}
      <GlobalCalcolatrice />
      </CalcolatriceProvider>
    </LayoutUIProvider>
  );
}
