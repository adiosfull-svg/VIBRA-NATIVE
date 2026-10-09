// Ritorno del login Google sul web: Base44 rimanda a <sito>/api/apps/auth/final-callback
// ?access_token=...&state={"from_url": ...}. Sull'app originale questa pagina la serve Base44 sul
// suo dominio; qui (localhost o il nostro dominio) la gestiamo noi: salviamo il token e torniamo
// alla pagina da cui era partito il login.
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Loading } from '../../../../components/ui';
import { useAuth } from '../../../../lib/auth';
import { BACKEND } from '../../../../lib/backend';

/** Percorso di from_url (solo se è di questo sito), altrimenti la home. */
function returnPath(state?: string): string {
  try {
    const from = new URL(JSON.parse(state ?? '{}').from_url);
    if (typeof window !== 'undefined' && from.origin === window.location.origin) return from.pathname + from.search;
  } catch { /* state mancante o non valido */ }
  return '/';
}

export default function FinalCallback() {
  const { access_token: token, state } = useLocalSearchParams<{ access_token?: string; state?: string }>();
  const { user, refreshUser } = useAuth();
  const [done, setDone] = useState(false);
  useEffect(() => {
    (async () => {
      if (token && BACKEND === 'base44') {
        /* eslint-disable-next-line @typescript-eslint/no-require-imports */
        await (require('../../../../lib/base44Remote') as typeof import('../../../../lib/base44Remote')).completeLogin(token);
        await refreshUser();
      }
      setDone(true);
    })();
  }, [token, refreshUser]);
  if (!done) return <Loading />;
  // token non valido o Base44 irraggiungibile: di nuovo alla pagina di accesso
  return <Redirect href={(user ? returnPath(state) : '/login') as '/'} />;
}
