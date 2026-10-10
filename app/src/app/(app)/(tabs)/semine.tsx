// Route /semine → pagina portata da src/pages/Semine.jsx dentro la cornice di AppLayout.
import Semine from '../../../web/pages/Semine';
import Page from '../../../web/components/layout/Page';

export default function SemineRoute() {
  return (
    <Page>
      <Semine />
    </Page>
  );
}
