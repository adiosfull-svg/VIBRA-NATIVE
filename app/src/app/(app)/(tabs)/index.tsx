import { Redirect } from 'expo-router';
import { ComingSoon } from '../../../components/ComingSoon';
import { useRoleAccess } from '../../../lib/useRoleAccess';

// Come HomepageRouter.jsx: admin/super4 vedono la Dashboard, gli altri vanno a "Il Mio Vibra".
export default function Home() {
  const { canAccessRoute } = useRoleAccess();
  if (!canAccessRoute('dashboard')) return <Redirect href="/il-mio-vibra" />;
  return <ComingSoon title="Dashboard" source="src/pages/Dashboard.jsx" />;
}
