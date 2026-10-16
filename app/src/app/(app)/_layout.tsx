// Shell dell'app (AppLayout.jsx): sidebar globale + stack delle pagine. Ogni pagina disegna la
// propria intestazione in linea (Page → AppHeader), come nell'originale.
import { diagMark } from '../../lib/testDiag';
import { Stack, useSegments } from 'expo-router';
import MobileNavBar from '../../web/components/layout/MobileNavBar';
import Sidebar from '../../web/components/layout/Sidebar';
import { AccountMenuPanel } from '../../web/components/layout/AccountMenu';
import VibraSearch from '../../web/components/shared/VibraSearch';
import Calcolatrice from '../../web/components/ilmiovibra/Calcolatrice';
import { CalcolatriceProvider, useCalcolatrice } from '../../web/lib/calcolatriceContext';
import { LayoutUIProvider } from '../../web/lib/layoutUI';
import { THEME } from '../../ui/palette.generated';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FixedHost } from '../../ui/fixedPortal';
import { LocationPublisher } from '../../web/router';
import { useEffect } from 'react';
import { prefetchImages } from '../../ui/imageCache';
import { LOGO_URL } from '../../web/hooks/useVibraLogo';
import { useNotificationsPolling } from '../../web/hooks/useNotifications';
import { useAuth } from '../../lib/auth';
import { prefetchCriticalData } from '../../web/lib/prefetchCoreData';

// Immagini del guscio (header, nav bar, sidebar): in memoria prima del primo disegno, mai un flash
// (docs/REGOLE-PRESTAZIONI.md §6). Le immagini delle pagine le precarica ogni pagina.
function useShellImages() {
  useEffect(() => { prefetchImages([LOGO_URL]); }, []);
}

/**
 * Barra di stato (orario) e barra di navigazione di Android: l'app disegna fino ai bordi dello schermo e
 * lì si vedeva la pagina che scorreva sotto (vetro sfocato). Ora colore pieno del body, come la cornice
 * del browser per l'originale. Per ultime: sopra pagine, nav bar, pannelli e veli.
 */
function SystemBarsFill() {
  const { top, bottom } = useSafeAreaInsets();
  if (Platform.OS === 'web') return null;
  return (
    <>
      {top > 0 && <View pointerEvents="none" style={[styles.bar, { top: 0, height: top }]} />}
      {bottom > 0 && <View pointerEvents="none" style={[styles.bar, { bottom: 0, height: bottom }]} />}
    </>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', left: 0, right: 0, backgroundColor: THEME.background },
});

// Notifiche: un solo osservatore con polling e subscription per tutta l'app (come l'header unico
// dell'originale); le campanelle delle pagine leggono la cache (web/hooks/useNotifications).
function NotificationsPoller() {
  useNotificationsPolling();
  return null;
}

// Calcolatrice globale: resta attiva su tutte le rotte finché non la chiudi (come AppLayout.jsx).
function GlobalCalcolatrice() {
  const { open, close } = useCalcolatrice();
  if (!open) return null;
  return <Calcolatrice onClose={close} />;
}

// le 5 tab hanno la barra come tab bar; le altre pagine la ricevono qui (nell'originale è in AppLayout).
// In un componente a sé: useSegments cambia a ogni navigazione e, letto in AppLayout, ridisegnava
// tutto il guscio (sidebar, ricerca, calcolatrice, pannelli) a ogni cambio di pagina.
function StackNavBar() {
  const inTabs = (useSegments() as string[]).includes('(tabs)');
  return inTabs ? null : <MobileNavBar />;
}

// Dati della prima schermata (Dashboard / Il Mio Vibra) chiesti appena l'utente è noto, come
// prefetchCriticalData in AppLayout dell'originale: prima partivano solo dagli effect della pagina, dopo il
// suo primo disegno (~1,5 s di rete in più sull'avvio). Stesse queryKey e queryFn delle pagine: le query
// della pagina si agganciano alle richieste già in volo. Nel render (una volta per sessione) e non in un
// effect, che partirebbe dopo il montaggio di tutta la prima pagina.
let criticalPrefetched = false;
function useCriticalDataPrefetch() {
  const { user } = useAuth();
  if (user && !criticalPrefetched) {
    criticalPrefetched = true;
    prefetchCriticalData(user, user.promoter_id, '/');
  }
}

export default function AppLayout() {
  diagMark('layout app');
  useShellImages();
  useCriticalDataPrefetch();
  return (
    <LayoutUIProvider>
      <CalcolatriceProvider>
      <FixedHost>
      <LocationPublisher />
      <NotificationsPoller />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.background }, animation: 'none' }} />
      <StackNavBar />
      {/* Vibra Search: ricerca globale (pulsante Cerca della nav, come AppLayout.jsx) */}
      <VibraSearch />
      {/* Calcolatrice globale — persiste su tutte le rotte */}
      <GlobalCalcolatrice />
      </FixedHost>
      {/* pannelli laterali: uno solo per tutta l'app, montati in anticipo (ui/sideDrawer); per ultimi,
          così il velo copre tutto (anche il pulsante Cerca flottante e la calcolatrice) */}
      <Sidebar />
      <AccountMenuPanel />
      <SystemBarsFill />
      </CalcolatriceProvider>
    </LayoutUIProvider>
  );
}
