// Route /il-mio-vibra → pagina portata da src/pages/IlMioVibra.jsx dentro la cornice di AppLayout.
import { memo } from 'react';
import IlMioVibraPage from '../../../web/pages/IlMioVibra';
import Page from '../../../web/components/layout/Page';

// memo: al focus della tab (anche precaricata) react-navigation ridisegna lo schermo; la pagina, senza
// props, non va ridisegnata per questo (era l'intera pagina a ogni cambio tab)
const IlMioVibra = memo(IlMioVibraPage);

export default function IlMioVibraRoute() {
  return (
    <Page>
      <IlMioVibra />
    </Page>
  );
}
