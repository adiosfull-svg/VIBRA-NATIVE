// Backend VERO: lo SDK Base44 (stessa versione dell'app web originale) con l'app 69de4f1f7f53d9f187d01392.
// Dati, funzioni server, automazioni, file e login restano su Base44.
// Token: come sul web (localStorage "base44_access_token"); sul telefono in SecureStore.
// Login con Google tramite la pagina di accesso di Base44, che torna con ?access_token=...
import { createClient } from '@base44/sdk';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { readOnlyClient } from './readonlyGuard';
import { toast } from '../ui/use-toast';

export const APP_ID = '69de4f1f7f53d9f187d01392';
export const SERVER_URL = 'https://base44.app';
const TOKEN_KEY = 'base44_access_token';
/** Modalità prova (default): l'app legge i dati veri ma non scrive. EXPO_PUBLIC_BASE44_READONLY=0 la toglie. */
export const READ_ONLY = process.env.EXPO_PUBLIC_BASE44_READONLY !== '0';

const isWeb = Platform.OS === 'web';

// Sul web lo SDK legge da solo il token da URL/localStorage, come nell'originale.
const sdk = createClient({ appId: APP_ID, serverUrl: SERVER_URL, appBaseUrl: SERVER_URL, requiresAuth: false });

const tokenStore = {
  async get(): Promise<string | null> {
    if (isWeb) return typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async set(token: string) {
    if (isWeb) localStorage.setItem(TOKEN_KEY, token);
    else await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clear() {
    if (isWeb) { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('token'); }
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

// Avvisa AuthProvider quando l'utente esce (anche da base44.auth.logout() chiamato dalle pagine).
type Listener = () => void;
const signOutListeners = new Set<Listener>();
export function onSignedOut(cb: Listener) {
  signOutListeners.add(cb);
  return () => { signOutListeners.delete(cb); };
}

/** Token salvato → lo imposta nello SDK. Restituisce false se non c'è. */
export async function restoreSession(): Promise<boolean> {
  const token = await tokenStore.get();
  if (!token) return false;
  sdk.auth.setToken(token, false);
  return true;
}

/**
 * Accesso con Google sulla pagina di Base44. Sul web: redirect a pagina intera come l'originale
 * (al ritorno lo SDK legge ?access_token). Sul telefono: browser interno che torna all'app.
 * Restituisce true se il token è stato ottenuto.
 */
export async function signInWithGoogle(): Promise<boolean> {
  if (isWeb) {
    sdk.auth.loginWithProvider('google', '/');
    return false;
  }
  const returnUrl = Linking.createURL('auth');
  const url = `${SERVER_URL}/api/apps/auth/login?app_id=${APP_ID}&from_url=${encodeURIComponent(returnUrl)}`;
  const result = await WebBrowser.openAuthSessionAsync(url, returnUrl);
  if (result.type !== 'success') return false;
  const token = Linking.parse(result.url).queryParams?.access_token;
  if (typeof token !== 'string' || !token) throw new Error('Accesso non riuscito: Base44 non ha restituito il token');
  await tokenStore.set(token);
  sdk.auth.setToken(token, false);
  return true;
}

/**
 * Ritorno del login sul web: Base44 apre <sito>/api/apps/auth/final-callback?access_token=...
 * (route app/api/apps/auth/final-callback.tsx), come fa con l'app originale sul suo dominio.
 */
export async function completeLogin(token: string) {
  await tokenStore.set(token);
  sdk.auth.setToken(token, false);
}

export async function signOut() {
  await tokenStore.clear();
  signOutListeners.forEach((cb) => cb());
  if (isWeb) {
    sdk.auth.logout(window.location.origin + '/');
  } else {
    // Sul telefono lo SDK, dopo aver tolto il token, tenterebbe un redirect della pagina (che non c'è)
    try { sdk.auth.logout(); } catch { /* atteso su React Native */ }
  }
}

let lastNotice = 0;
function notifyBlocked(what: string) {
  console.warn(`[sola lettura] bloccato: ${what}`);
  // un avviso ogni pochi secondi, anche se una schermata tenta più scritture insieme
  if (Date.now() - lastNotice < 4000) return;
  lastNotice = Date.now();
  toast({ title: 'Modalità prova', description: 'Salvataggio disattivato: l\'app non modifica ancora i dati di Base44.' });
}

const client = READ_ONLY ? readOnlyClient(sdk as unknown as Record<string, any>, notifyBlocked) as unknown as typeof sdk : sdk;

/** Stesso oggetto `base44` dell'app web; logout passa da signOut per pulire anche il token salvato. */
export const remoteBase44 = new Proxy(client, {
  get(obj, key) {
    if (key !== 'auth') return Reflect.get(obj, key);
    const auth = obj.auth;
    return new Proxy(auth, {
      get(a, k) {
        if (k === 'logout') return (_redirect?: string) => signOut();
        const v = Reflect.get(a, k);
        return typeof v === 'function' ? v.bind(a) : v;
      },
    });
  },
});
