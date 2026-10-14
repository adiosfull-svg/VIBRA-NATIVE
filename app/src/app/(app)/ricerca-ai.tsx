// Route /ricerca-ai → pagina portata da src/pages/RicercaAI.jsx.
import { memo } from 'react';
import RicercaAIPage from '../../web/pages/RicercaAI';
import Page from '../../web/components/layout/Page';

const RicercaAI = memo(RicercaAIPage);

export default function RicercaAIRoute() {
  return (
    <Page>
      <RicercaAI />
    </Page>
  );
}
