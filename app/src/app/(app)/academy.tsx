// Route /academy → pagina portata da src/pages/VibraAcademy.jsx.
import { memo } from 'react';
import VibraAcademyPage from '../../web/pages/VibraAcademy';
import Page from '../../web/components/layout/Page';

const VibraAcademy = memo(VibraAcademyPage);

export default function VibraAcademyRoute() {
  return (
    <Page>
      <VibraAcademy />
    </Page>
  );
}
