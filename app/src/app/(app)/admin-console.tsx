// Route /admin-console → pagina portata da src/pages/AdminConsole.jsx (RoleGate "admin-console").
import { memo } from 'react';
import AdminConsolePage from '../../web/pages/AdminConsole';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const AdminConsole = memo(AdminConsolePage);

export default function AdminConsoleRoute() {
  return (
    <Page>
      <RoleGate routeName="admin-console">
        <AdminConsole />
      </RoleGate>
    </Page>
  );
}
