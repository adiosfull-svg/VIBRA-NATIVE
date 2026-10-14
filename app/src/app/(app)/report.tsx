// Route /report → pagina portata da src/pages/Report.jsx (RoleGate "admin-console").
import { memo } from 'react';
import ReportPage from '../../web/pages/Report';
import RoleGate from '../../web/components/RoleGate';
import Page from '../../web/components/layout/Page';

const Report = memo(ReportPage);

export default function ReportRoute() {
  return (
    <Page>
      <RoleGate routeName="admin-console">
        <Report />
      </RoleGate>
    </Page>
  );
}
