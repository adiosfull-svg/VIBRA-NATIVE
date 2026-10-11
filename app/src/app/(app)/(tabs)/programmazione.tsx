// Route /programmazione → pagina portata da src/pages/Programmazione.jsx dentro la cornice di AppLayout.
import { memo } from 'react';
import ProgrammazionePage from '../../../web/pages/Programmazione';
import Page from '../../../web/components/layout/Page';

// memo: al focus della tab (anche precaricata) react-navigation ridisegna lo schermo; la pagina, senza
// props, non va ridisegnata per questo (era l'intera pagina a ogni cambio tab)
const Programmazione = memo(ProgrammazionePage);

export default function ProgrammazioneRoute() {
  return (
    <Page>
      <Programmazione />
    </Page>
  );
}
