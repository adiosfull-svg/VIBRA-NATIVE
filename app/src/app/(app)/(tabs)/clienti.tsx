// Route /clienti → pagina portata da src/pages/Clienti.jsx dentro la cornice di AppLayout.
import { memo } from 'react';
import ClientiPage from '../../../web/pages/Clienti';
import Page from '../../../web/components/layout/Page';

// memo: al focus della tab (anche precaricata) react-navigation ridisegna lo schermo; la pagina, senza
// props, non va ridisegnata per questo (era l'intera pagina a ogni cambio tab)
const Clienti = memo(ClientiPage);

export default function ClientiRoute() {
  return (
    <Page>
      <Clienti />
    </Page>
  );
}
