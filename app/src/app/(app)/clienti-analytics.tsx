// Route /clienti-analytics → pagina portata da src/pages/ClientiAnalytics.jsx (RoleGate "clienti-analytics").
import { memo } from 'react';
import ClientiAnalyticsPage from '../../web/pages/ClientiAnalytics';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const ClientiAnalytics = memo(ClientiAnalyticsPage);

export default function ClientiAnalyticsRoute() {
  return (
    <Page>
      <RoleGate routeName="clienti-analytics">
        <ClientiAnalytics />
      </RoleGate>
    </Page>
  );
}
