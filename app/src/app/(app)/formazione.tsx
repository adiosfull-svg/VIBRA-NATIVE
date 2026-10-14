// Route /formazione → pagina portata da src/pages/Formazione.jsx.
import { memo } from 'react';
import FormazionePage from '../../web/pages/Formazione';
import Page from '../../web/components/layout/Page';

const Formazione = memo(FormazionePage);

export default function FormazioneRoute() {
  return (
    <Page>
      <Formazione />
    </Page>
  );
}
