// Route /dashboard → pagina portata da src/pages/Dashboard.jsx (RoleGate "dashboard" come nell'originale).
import { Redirect } from 'expo-router';
import Dashboard from '../../web/pages/Dashboard';
import Page from '../../web/components/layout/Page';
import { useRoleAccess } from '../../lib/useRoleAccess';

export default function DashboardRoute() {
  const { canAccessRoute } = useRoleAccess();
  if (!canAccessRoute('dashboard')) return <Redirect href="/il-mio-vibra" />;
  return (
    <Page>
      <Dashboard />
    </Page>
  );
}
