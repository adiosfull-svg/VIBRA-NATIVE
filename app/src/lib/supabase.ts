import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { AppState, Platform } from 'react-native';

// Solo per lo stack di PROVA locale (EXPO_PUBLIC_BACKEND=local, scripts/local/dev_stack.sh):
// il backend vero dell'app è Base44 (base44Remote.ts).
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'dev';

// SecureStore accetta valori fino a ~2 KB: la sessione Supabase può superarli,
// quindi la salviamo spezzata in più chiavi.
const CHUNK = 1800;
const secureChunkedStorage = {
  async getItem(key: string) {
    const count = Number(await SecureStore.getItemAsync(`${key}.n`));
    if (!count) return null;
    const parts = await Promise.all(
      Array.from({ length: count }, (_, i) => SecureStore.getItemAsync(`${key}.${i}`)),
    );
    return parts.some((p) => p == null) ? null : parts.join('');
  },
  async setItem(key: string, value: string) {
    await this.removeItem(key);
    const n = Math.ceil(value.length / CHUNK);
    for (let i = 0; i < n; i++) {
      await SecureStore.setItemAsync(`${key}.${i}`, value.slice(i * CHUNK, (i + 1) * CHUNK));
    }
    await SecureStore.setItemAsync(`${key}.n`, String(n));
  },
  async removeItem(key: string) {
    const count = Number(await SecureStore.getItemAsync(`${key}.n`)) || 0;
    await Promise.all(Array.from({ length: count }, (_, i) => SecureStore.deleteItemAsync(`${key}.${i}`)));
    await SecureStore.deleteItemAsync(`${key}.n`);
  },
};

const webStorage = {
  getItem: (k: string) => (typeof localStorage === 'undefined' ? null : localStorage.getItem(k)),
  setItem: (k: string, v: string) => localStorage.setItem(k, v),
  removeItem: (k: string) => localStorage.removeItem(k),
};

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: Platform.OS === 'web' ? webStorage : secureChunkedStorage,
    storageKey: 'vibra-auth',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Il refresh automatico del token va sospeso quando l'app è in background.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
