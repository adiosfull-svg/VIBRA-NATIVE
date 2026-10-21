// Shell dell'app (AppLayout.jsx): sidebar globale + stack delle pagine. Ogni pagina disegna la
// propria intestazione in linea (Page → AppHeader), come nell'originale.
import { diagMark } from '../../lib/testDiag';
import { Stack, useSegments } from 'expo-router';
import MobileNavBar from '../../web/components/layout/MobileNavBar';
import Sidebar from '../../web/components/layout/Sidebar';
import { AccountMenuPanel } from '../../web/components/layout/AccountMenu';
import VibraSearch from '../../web/components/shared/VibraSearch';
import PromoterContextMenu from '../../web/components/promoter/PromoterContextMenu';
import VenueLogosPreloader from '../../web/components/shared/VenueLogosPreloader';
import ClientPhotosPreloader from '../../web/components/shared/ClientPhotosPreloader';
import SeminaPhotosPreloader from '../../web/components/shared/SeminaPhotosPreloader';
import PromoterPhotosPreloader from '../../web/components/shared/PromoterPhotosPreloader';
import Calcolatrice from '../../web/components/ilmiovibra/Calcolatrice';
import { CalcolatriceProvider, useCalcolatrice } from '../../web/lib/calcolatriceContext';
import { LayoutUIProvider, useLayoutUIActions, useLayoutUIOpen } from '../../web/lib/layoutUI';
import { useSwipeToOpenSidebar } from '../../web/hooks/useSwipeToOpenSidebar';
import { THEME } from '../../ui/palette.generated';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FixedHost } from '../../ui/fixedPortal';
import { LocationPublisher, useNavigate } from '../../web/router';
import { usePushNavigation } from '../../web/hooks/usePushNotifications';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { prefetchImages } from '../../ui/imageCache';
import { LOGO_URL } from '../../web/hooks/useVibraLogo';
import { useNotificationsPolling } from '../../web/hooks/useNotifications';
import { useAuth } from '../../lib/auth';
import { prefetchCriticalData } from '../../web/lib/prefetchCoreData';
import { haptic } from '../../ui/haptics';

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
  fill: { flex: 1 },
});

// Notifiche: un solo osservatore con polling e subscription per tutta l'app (come l'header unico
// dell'originale); le campanelle delle pagine leggono la cache (web/hooks/useNotifications).
function NotificationsPoller() {
  useNotificationsPolling();
  return null;
}

// Tocco su una notifica push → pagina della notifica (evento 'vibra-navigate' di AppLayout.jsx)
function PushNavigation() {
  usePushNavigation(useNavigate());
  return null;
}

// Swipe dal bordo sinistro → menu laterale (useSwipeToOpenSidebar in AppLayout.jsx), gesto RNGH sul thread
// UI attorno alle pagine. I figli sono elementi stabili: aprire/chiudere il menu ridisegna solo questo.
function SwipeToOpenSidebar({ children }: { children: ReactNode }) {
  const { setSidebarOpen } = useLayoutUIActions();
  const sidebarOpen = useLayoutUIOpen('sidebarOpen');
  // menu aperto dal gesto: vibrazione leggera, come un cassetto di sistema
  const open = useCallback(() => { haptic.light(); setSidebarOpen(true); }, [setSidebarOpen]);
  const gesture = useSwipeToOpenSidebar(open, !sidebarOpen);
  if (Platform.OS === 'web') return <>{children}</>;
  return (
    <GestureHandlerRootView style={styles.fill}>
      <GestureDetector gesture={gesture}>
        <View style={styles.fill} collapsable={false}>{children}</View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

// Precaricamento delle foto (loghi dei locali, clienti, semine, promoter) come in AppLayout.jsx, senza pesare
// sull'avvio: montati dopo la prima schermata, a app ferma; le query hanno le stesse chiavi delle pagine
// (se le tab precaricate le hanno già chieste non partono di nuovo) e le immagini vanno in una coda a
// concorrenza limitata (ui/imageCache, queueImagePrefetch).
const PHOTO_PRELOAD_DELAY_MS = 2500;
function PhotosPreloaders() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let task: { cancel: () => void } | null = null;
    const t = setTimeout(() => { task = InteractionManager.runAfterInteractions(() => setReady(true)); }, PHOTO_PRELOAD_DELAY_MS);
    return () => { clearTimeout(t); task?.cancel(); };
  }, []);
  if (!ready) return null;
  return (
    <>
      <VenueLogosPreloader />
      <ClientPhotosPreloader />
      <SeminaPhotosPreloader />
      <PromoterPhotosPreloader />
    </>
  );
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

// Pagine dello stack (Locali, Notifiche, profilo promoter...): sul telefono entrano scorrendo da destra ed
// escono all'indietro come in un'app nativa (animazione di react-native-screens sul thread UI, la pagina
// sotto scorre un poco con lei). Sul web niente transizione, come l'originale. Le tab cambiano senza
// scorrimento (ui/vibraTabs), come le tab di un'app nativa.
const STACK_OPTIONS = {
  headerShown: false,
  contentStyle: { backgroundColor: THEME.background },
  animation: Platform.OS === 'web' ? 'none' : 'ios_from_right',
} as const;

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
      <PushNavigation />
      <PhotosPreloaders />
      <SwipeToOpenSidebar>
      <Stack screenOptions={STACK_OPTIONS} />
      <StackNavBar />
      {/* Vibra Search: ricerca globale (pulsante Cerca della nav, come AppLayout.jsx) */}
      <VibraSearch />
      {/* Menu del promoter (tasto lungo su qualsiasi [data-promoter-id]), attivo in tutta l'app */}
      <PromoterContextMenu />
      {/* Calcolatrice globale — persiste su tutte le rotte */}
      <GlobalCalcolatrice />
      </SwipeToOpenSidebar>
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
