// Tab principali con la barra di navigazione dell'app web (MobileNavBar).
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { Tabs, router } from 'expo-router';
import MobileNavBar from '../../../web/components/layout/MobileNavBar';
import { THEME } from '../../../ui/palette.generated';

// Prima apertura di una tab: caricare il modulo della pagina e montarla bloccava il JS per ~1-2 s
// sul telefono (Weekend "ci mette due secondi ad aprirsi"). Dopo l'avvio, a app ferma, le tab si
// precaricano una alla volta (montate in background): il tocco mostra subito la pagina pronta.
const PRELOAD: string[] = ['/programmazione', '/clienti', '/il-mio-vibra', '/semine', '/'];
const FIRST_DELAY_MS = 2500;
const GAP_MS = 1200;

function usePreloadTabs() {
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const step = (i: number) => {
      if (cancelled || i >= PRELOAD.length) return;
      InteractionManager.runAfterInteractions(() => {
        if (cancelled) return;
        try { router.prefetch(PRELOAD[i] as never); } catch { /* route non pronta: si salta */ }
        timer = setTimeout(() => step(i + 1), GAP_MS);
      });
    };
    timer = setTimeout(() => step(0), FIRST_DELAY_MS);
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);
}

export default function TabsLayout() {
  usePreloadTabs();
  return (
    <Tabs
      tabBar={(props) => <MobileNavBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: THEME.background } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="semine" />
      <Tabs.Screen name="programmazione" />
      <Tabs.Screen name="clienti" />
      <Tabs.Screen name="il-mio-vibra" />
    </Tabs>
  );
}
