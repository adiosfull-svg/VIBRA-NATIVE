import { Redirect } from 'expo-router';
import Dashboard from '../../../web/pages/Dashboard';
import Page from '../../../web/components/layout/Page';
import { useRoleAccess } from '../../../lib/useRoleAccess';

// Come HomepageRouter.jsx: admin/super4 vedono la Dashboard, gli altri vanno a "Il Mio Vibra".
export default function Home() {
  const { canAccessRoute } = useRoleAccess();
  if (!canAccessRoute('dashboard')) return <Redirect href="/il-mio-vibra" />;
  return (
    <Page>
      <Dashboard />
    </Page>
  );
}
