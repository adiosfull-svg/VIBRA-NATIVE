// Equivalente nativo di src/hooks/usePushNotifications.jsx (web push con service worker e chiavi VAPID).
// Sul telefono le notifiche push passano da expo-notifications: il token del dispositivo (Expo push token)
// si salva in PushSubscription come l'iscrizione del browser (endpoint "expo:<token>"), e il tocco su una
// notifica apre la pagina di `action_url` (come il messaggio NAVIGATE del service worker).
//
// ATTENZIONE: il server Base44 oggi invia SOLO web push (dispatchPushOnNotification e sendPushNotification
// usano web-push con le chiavi VAPID): per ricevere le push sul telefono servono
//  1. un progetto Expo/EAS (projectId) con le credenziali FCM (google-services.json) e APNs;
//  2. lato server, l'invio ai token "expo:" con l'API push di Expo (https://exp.host/--/api/v2/push/send).
// Finché manca il projectId (EXPO_PUBLIC_EAS_PROJECT_ID o expo.extra.eas.projectId) isSupported è false e
// la voce del menu account non compare, come in un browser senza supporto push.
import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { base44 } from '../../lib/base44';
import { win } from '../shims/dom';

type NotificationsModule = typeof import('expo-notifications');
// caricato solo se le push sono configurate (niente modulo nativo all'avvio altrimenti)
const notifications = (): NotificationsModule => require('expo-notifications');

const PROJECT_ID: string | undefined =
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID
  || (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId
  || undefined;

export const PUSH_SUPPORTED = Platform.OS !== 'web' && !!PROJECT_ID;

const TOKEN_KEY = 'vibra_push_token';
const EXPO_PREFIX = 'expo:';

type Permission = 'default' | 'granted' | 'denied';
const toPermission = (status: string): Permission => (status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'default');

function readToken(): string | null {
  try { return win.localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function writeToken(token: string | null) {
  try {
    if (token) win.localStorage.setItem(TOKEN_KEY, token);
    else win.localStorage.removeItem(TOKEN_KEY);
  } catch { /* storage non disponibile */ }
}

type PushUser = { id: string; promoter_id?: string | null } | null | undefined;

export function usePushNotifications(user: PushUser) {
  const [permission, setPermission] = useState<Permission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!PUSH_SUPPORTED) return;
    let alive = true;
    notifications().getPermissionsAsync().then((p) => {
      if (!alive) return;
      const perm = toPermission(p.status);
      setPermission(perm);
      setIsSubscribed(perm === 'granted' && !!readToken());
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const subscribe = useCallback(async () => {
    if (!PUSH_SUPPORTED || !user) return;
    setLoading(true);
    try {
      const N = notifications();
      if (Platform.OS === 'android') {
        await N.setNotificationChannelAsync('default', { name: 'Vibra', importance: N.AndroidImportance.HIGH });
      }
      const req = await N.requestPermissionsAsync();
      const perm = toPermission(req.status);
      setPermission(perm);
      if (perm !== 'granted') { setLoading(false); return; }
      const { data: token } = await N.getExpoPushTokenAsync({ projectId: PROJECT_ID });
      const endpoint = EXPO_PREFIX + token;
      // come l'originale: niente doppioni con lo stesso endpoint (notifiche doppie)
      const existing = await base44.entities.PushSubscription.filter({ user_id: user.id });
      if (!existing.some((s) => s.endpoint === endpoint)) {
        await base44.entities.PushSubscription.create({
          user_id: user.id,
          promoter_id: user.promoter_id || null,
          endpoint,
          // campi obbligatori dell'entità (chiavi del browser): per i token Expo non servono
          p256dh: 'expo',
          auth: 'expo',
          user_agent: `VIBRA app ${Platform.OS} ${Platform.Version}`.substring(0, 200),
        });
      }
      writeToken(token);
      setIsSubscribed(true);
    } catch (err) {
      console.error('Push subscription error:', err);
    }
    setLoading(false);
  }, [user]);

  const unsubscribe = useCallback(async () => {
    if (!PUSH_SUPPORTED || !user) return;
    setLoading(true);
    try {
      const token = readToken();
      if (token) {
        const subs = await base44.entities.PushSubscription.filter({ user_id: user.id });
        const match = subs.find((s) => s.endpoint === EXPO_PREFIX + token);
        if (match) await base44.entities.PushSubscription.delete(match.id);
      }
      writeToken(null);
      setIsSubscribed(false);
    } catch (err) {
      console.error('Push unsubscribe error:', err);
    }
    setLoading(false);
  }, [user]);

  return { isSupported: PUSH_SUPPORTED, isSubscribed, permission, loading, subscribe, unsubscribe };
}

/**
 * Nel layout dell'app (una volta): notifiche mostrate anche ad app aperta e tocco su una notifica →
 * pagina di `action_url` (nell'originale: messaggio NAVIGATE del service worker → evento 'vibra-navigate').
 */
export function usePushNavigation(navigate: (url: string) => void) {
  useEffect(() => {
    if (!PUSH_SUPPORTED) return undefined;
    const N = notifications();
    N.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
    });
    const open = (r: { notification: { request: { content: { data?: Record<string, unknown> } } } } | null) => {
      const url = r?.notification.request.content.data?.action_url;
      if (typeof url === 'string' && url.startsWith('/')) navigate(url);
    };
    // app aperta dal tocco su una notifica (avvio a freddo)
    N.getLastNotificationResponseAsync().then(open).catch(() => {});
    const sub = N.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [navigate]);
}
