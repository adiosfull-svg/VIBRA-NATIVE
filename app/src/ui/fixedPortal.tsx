// position: fixed come nel browser: l'elemento va alla radice dell'app (Portal → PortalHost in
// app/_layout.tsx), così è relativo allo schermo e sta sopra alla pagina (sul web le View di RN-web
// creano contesti di sovrapposizione: lo z-index non uscirebbe). Dentro un portale non si ripete.
// Limite: i context propri della pagina (non quelli globali dell'app) non arrivano nel portale;
// le classi di testo ereditate sì (vengono ripassate).
import { Portal } from '@rn-primitives/portal';
import { createContext, useContext, useId, type ReactNode } from 'react';
import { TextClassContext } from './text';

export const InPortalContext = createContext(false);

export function PortalToRoot({ children }: { children: ReactNode }) {
  const name = useId();
  const textClasses = useContext(TextClassContext);
  return (
    <Portal name={name}>
      <InPortalContext.Provider value>
        <TextClassContext.Provider value={textClasses}>{children}</TextClassContext.Provider>
      </InPortalContext.Provider>
    </Portal>
  );
}
