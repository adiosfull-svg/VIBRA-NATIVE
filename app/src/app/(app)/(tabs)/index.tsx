import { Redirect } from 'expo-router';
import { memo } from 'react';
import DashboardPage from '../../../web/pages/Dashboard';
import { useRoleAccess } from '../../../lib/useRoleAccess';
import Page from '../../../web/components/layout/Page';

// memo: al focus della tab (anche precaricata) react-navigation ridisegna lo schermo; la pagina, senza
// props, non va ridisegnata per questo (era l'intera pagina a ogni cambio tab)
const Dashboard = memo(DashboardPage);

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
