// Route /dashboard (link esterni; nell'app la Dashboard è la tab "/"): porta alla tab, già montata e
// precaricata, invece di costruire una seconda Dashboard da zero (1,9-2,9 s sull'emulatore). La tab
// fa lo stesso controllo di accesso di HomepageRouter.jsx (chi non vede la Dashboard va a Il Mio Vibra).
import { Redirect } from 'expo-router';

export default function DashboardRoute() {
  return <Redirect href="/" />;
}
