// Route /il-mio-vibra → pagina portata da src/pages/IlMioVibra.jsx dentro la cornice di AppLayout.
import IlMioVibra from '../../../web/pages/IlMioVibra';
import Page from '../../../web/components/layout/Page';

export default function IlMioVibraRoute() {
  return (
    <Page>
      <IlMioVibra />
    </Page>
  );
}
