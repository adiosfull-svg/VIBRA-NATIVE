// Route /semine → pagina portata da src/pages/Semine.jsx dentro la cornice di AppLayout.
import { memo } from 'react';
import SeminePage from '../../../web/pages/Semine';
import Page from '../../../web/components/layout/Page';

// memo: al focus della tab (anche precaricata) react-navigation ridisegna lo schermo; la pagina, senza
// props, non va ridisegnata per questo (era l'intera pagina a ogni cambio tab)
const Semine = memo(SeminePage);

export default function SemineRoute() {
  return (
    <Page>
      <Semine />
    </Page>
  );
}
