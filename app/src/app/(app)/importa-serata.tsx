// Route /importa-serata → pagina portata da src/pages/ImportaSerataBatch.jsx (RoleGate "serate").
import { memo } from 'react';
import ImportaSerataBatchPage from '../../web/pages/ImportaSerataBatch';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const ImportaSerataBatch = memo(ImportaSerataBatchPage);

export default function ImportaSerataBatchRoute() {
  return (
    <Page>
      <RoleGate routeName="serate">
        <ImportaSerataBatch />
      </RoleGate>
    </Page>
  );
}
