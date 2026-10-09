// Shell dell'app (AppLayout.jsx): sidebar globale + stack delle pagine. Ogni pagina disegna la
// propria intestazione in linea (Page → AppHeader), come nell'originale.
import { Stack } from 'expo-router';
import Sidebar from '../../web/components/layout/Sidebar';
import VibraSearch from '../../web/components/shared/VibraSearch';
import { LayoutUIProvider } from '../../web/lib/layoutUI';
import { THEME } from '../../ui/palette.generated';

export default function AppLayout() {
  return (
    <LayoutUIProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: THEME.background }, animation: 'none' }} />
      <Sidebar />
      {/* Vibra Search: ricerca globale (pulsante Cerca della nav, come AppLayout.jsx) */}
      <VibraSearch />
    </LayoutUIProvider>
  );
}
