// Route /programmazione → pagina portata da src/pages/Programmazione.jsx dentro la cornice di AppLayout.
import Programmazione from '../../../web/pages/Programmazione';
import Page from '../../../web/components/layout/Page';

export default function ProgrammazioneRoute() {
  return (
    <Page>
      <Programmazione />
    </Page>
  );
}
