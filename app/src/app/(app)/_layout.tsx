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
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.background }, animation: 'none' }} />
      {!inTabs && <MobileNavBar />}
      <Sidebar />
      {/* Vibra Search: ricerca globale (pulsante Cerca della nav, come AppLayout.jsx) */}
      <VibraSearch />
      {/* Calcolatrice globale — persiste su tutte le rotte */}
      <GlobalCalcolatrice />
      </CalcolatriceProvider>
    </LayoutUIProvider>
  );
}
