// position: fixed come nel browser: l'elemento va alla radice dell'app (Portal → PortalHost), così è
// relativo allo schermo e sta sopra alla pagina (sul web le View di RN-web creano contesti di
// sovrapposizione: lo z-index non uscirebbe). Dentro un portale non si ripete.
// Limite: i context propri della pagina (non quelli globali dell'app) non arrivano nel portale;
// le classi di testo ereditate sì (vengono ripassate).
//
// PRESTAZIONI / SOVRAPPOSIZIONI (docs/REGOLE-PRESTAZIONI.md §7): con le tab precaricate più pagine
// sono montate insieme e i loro elementi fixed finivano TUTTI sullo schermo (il pulsante di ricerca
// di Clienti compariva su Semine e Il Mio Vibra). Ora ogni pagina mostra i suoi fixed solo quando è
// in primo piano (display none altrimenti: lo stato resta). Dentro l'app vanno nell'host "fixed"
// del layout, sotto i pannelli laterali (come z-40 sotto lo z-50 della sidebar) e sotto i dialog.
import { Portal, PortalHost } from '@rn-primitives/portal';
import { createContext, useContext, useEffect, useId, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextClassContext } from './text';
import { useScreenNavigation } from '../web/screenNavigation';

export const InPortalContext = createContext(false);

const FIXED_HOST = 'vibra-fixed';
const FixedHostContext = createContext(false);

/** Host degli elementi fixed delle pagine (nel layout dell'app, prima dei pannelli laterali). */
export function FixedHost({ children }: { children?: ReactNode }) {
  return <FixedHostContext.Provider value>{children}<PortalHost name={FIXED_HOST} /></FixedHostContext.Provider>;
}


/** Lo schermo che contiene l'elemento è in primo piano (fuori da un navigatore: sempre). */
export function useScreenFocused(): boolean {
  const nav = useScreenNavigation();
  const read = () => { try { return nav?.isFocused?.() ?? true; } catch { return true; } };
  const [focused, setFocused] = useState(read);
  useEffect(() => {
    if (!nav?.addListener) return;
    const offFocus = nav.addListener('focus', () => setFocused(true));
    const offBlur = nav.addListener('blur', () => setFocused(false));
    setFocused(read());
    return () => { offFocus(); offBlur(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav]);
  return focused;
}

export function PortalToRoot({ children }: { children: ReactNode }) {
  const name = useId();
  const textClasses = useContext(TextClassContext);
  const inApp = useContext(FixedHostContext);
  const focused = useScreenFocused();
  return (
    <Portal name={name} hostName={inApp ? FIXED_HOST : undefined}>
      <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, !focused && styles.hidden]}>
        <InPortalContext.Provider value>
          <TextClassContext.Provider value={textClasses}>{children}</TextClassContext.Provider>
        </InPortalContext.Provider>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({ hidden: { display: 'none' } });
