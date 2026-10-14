// Route /promoter/:id → pagina portata da src/pages/PromoterDetail.jsx (RoleGate "promoter-detail").
import { memo } from 'react';
import PromoterDetailPage from '../../../web/pages/PromoterDetail';
import RoleGate from '../../../web/components/RoleGate';
import Page from '../../../web/components/layout/Page';

const PromoterDetail = memo(PromoterDetailPage);

export default function PromoterDetailRoute() {
  return (
    <Page>
      <RoleGate routeName="promoter-detail">
        <PromoterDetail />
      </RoleGate>
    </Page>
  );
}
