// Route /promoter → pagina portata da src/pages/Promoter.jsx (RoleGate "promoter").
import { memo } from 'react';
import PromoterPage from '../../../web/pages/Promoter';
import RoleGate from '../../../web/components/RoleGate';
import Page from '../../../web/components/layout/Page';

const Promoter = memo(PromoterPage);

export default function PromoterRoute() {
  return (
    <Page>
      <RoleGate routeName="promoter">
        <Promoter />
      </RoleGate>
    </Page>
  );
}
