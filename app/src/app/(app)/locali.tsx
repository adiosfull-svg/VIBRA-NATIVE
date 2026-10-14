// Route /locali → pagina portata da src/pages/Locali.jsx (RoleGate "locali").
import { memo } from 'react';
import LocaliPage from '../../web/pages/Locali';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const Locali = memo(LocaliPage);

export default function LocaliRoute() {
  return (
    <Page>
      <RoleGate routeName="locali">
        <Locali />
      </RoleGate>
    </Page>
  );
}
