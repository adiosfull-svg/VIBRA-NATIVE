// Tab principali con la barra di navigazione dell'app web (MobileNavBar).
import { diagMark, garaPreloadEnd, garaPreloadStart } from '../../../lib/testDiag';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { Tabs, router, useNavigation } from 'expo-router';
import MobileNavBar from '../../../web/components/layout/MobileNavBar';
import { THEME } from '../../../ui/palette.generated';
import { useRoleAccess } from '../../../lib/useRoleAccess';
import { PRELOAD_FIRST_DELAY_MS, PRELOAD_GAP_MS, PRELOAD_STACK, PRELOAD_TABS } from '../../../lib/preloadRoutes';
import { pageDataPreloaded, preloadPageData } from '../../../lib/preloadData';

// Prima apertura di una tab: caricare il modulo della pagina e montarla bloccava il JS per ~1-2 s
// sul telefono (Weekend "ci mette due secondi ad aprirsi"). Dopo l'avvio, a app ferma, le tab si
// precaricano una alla volta (montate in background): il tocco mostra subito la pagina pronta.
// Elenco e tempi in lib/preloadRoutes.ts (docs/REGOLE-PRESTAZIONI.md §1).

// Pagine già precaricate in questa sessione (il layout delle tab può essere montato più volte).
const preloaded = new Set<string>();

function usePreloadTabs() {
  // la Dashboard ('/') per chi non può vederla è un Redirect: precaricarla farebbe cambiare pagina
  const { canAccessRoute, user } = useRoleAccess();
  const withHome = canAccessRoute('dashboard');
  const role = user?.role;
  const navigation = useNavigation();
  useEffect(() => {
    const routes = [...PRELOAD_TABS, ...(withHome ? ['/'] : []), ...PRELOAD_STACK];
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const step = () => {
      const next = routes.find((r) => !preloaded.has(r));
      // fine (per la gara) quando sono pronti anche i dati precaricati: arrivando durante la prima misura
      // facevano ridisegnare le pagine montate e il loro lavoro finiva nei tempi della pagina aperta
      if (!next && !cancelled) { pageDataPreloaded().then(garaPreloadEnd); return; }
      if (cancelled || !next) return;
      InteractionManager.runAfterInteractions(() => {
        if (cancelled) return;
        // solo con le tab a schermo: da una pagina dello stack (es. aperta da un link) il prefetch di
        // una tab montava un altro layout delle tab, che ripartiva da capo (un giro ogni 2,6 s) e il
        // link successivo (vibra://notifiche) non cambiava più pagina
        if (navigation.isFocused()) {
          if (!preloaded.size) {
            garaPreloadStart();
            // dati delle pagine dello stack (lib/preloadData): in rete mentre si montano le tab
            preloadPageData(role);
          }
          preloaded.add(next);
          try { router.prefetch(next as never); } catch { /* route non pronta: si salta */ }
        }
        timer = setTimeout(step, PRELOAD_GAP_MS);
      });
    };
    timer = setTimeout(step, PRELOAD_FIRST_DELAY_MS);
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [withHome, navigation, role]);
}

export default function TabsLayout() {
  diagMark('layout tab');
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
