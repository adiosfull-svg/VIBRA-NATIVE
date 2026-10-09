// Indirizzo di ritorno del login Base44 sul telefono (vibra://auth?access_token=..., passando dalla
// pagina ponte /accesso-app dell'app Base44). Di solito il token lo legge signInWithGoogle dal
// risultato del browser interno; se invece il sistema apre direttamente questa pagina (può
// succedere su Android), il token lo salviamo qui.
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Loading } from '../components/ui';
import { useAuth } from '../lib/auth';
import { BACKEND } from '../lib/backend';

export default function AuthReturn() {
  const { access_token: token } = useLocalSearchParams<{ access_token?: string }>();
  const { user, refreshUser } = useAuth();
  const [done, setDone] = useState(!token);
  useEffect(() => {
    if (!token || BACKEND !== 'base44' || user) { setDone(true); return; }
    (async () => {
      /* eslint-disable-next-line @typescript-eslint/no-require-imports */
      await (require('../lib/base44Remote') as typeof import('../lib/base44Remote')).completeLogin(token);
      await refreshUser();
      setDone(true);
    })();
  }, [token, user, refreshUser]);
  if (!done) return <Loading />;
  return <Redirect href="/" />;
}
