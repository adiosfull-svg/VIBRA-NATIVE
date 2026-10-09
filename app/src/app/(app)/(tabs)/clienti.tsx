// Route /clienti → pagina portata da src/pages/Clienti.jsx dentro la cornice di AppLayout.
import Clienti from '../../../web/pages/Clienti';
import Page from '../../../web/components/layout/Page';

export default function ClientiRoute() {
  return (
    <Page>
      <Clienti />
    </Page>
  );
}
