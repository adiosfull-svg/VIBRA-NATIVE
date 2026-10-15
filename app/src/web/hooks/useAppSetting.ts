// Port di src/hooks/useAppSetting.jsx: stessa logica (cache in memoria + cache locale
// stale-while-revalidate + DB come fonte di verità), con AsyncStorage al posto di localStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { base44 } from '../../lib/base44';
import { queryClient } from '../../lib/queryClient';

const settingsCache = new Map<string, { value: string; recordId: string | null }>();
const pendingRequests = new Map<string, Promise<any>>();
const LOCAL_PREFIX = 'app_setting_cache_';
// Chiavi svuotate a mano (bustAppSettingCache): la tabella in cache potrebbe avere il valore vecchio.
const busted = new Set<string>();

// PORT: la tabella intera ['all-app-settings'] (useAllVenueLogos, Il Mio Vibra) è quasi sempre già in
// cache: se c'è, il valore si legge da lì invece di una richiesta per chiave (Locali ne faceva 3 per card,
// 9 per 3 locali, prima di disegnare loghi, piantine e formule). Una chiave assente = nessun record.
function cachedFromAllSettings(key: string): boolean {
  if (settingsCache.has(key)) return true;
  if (busted.has(key)) return false;
  const all = queryClient.getQueryData<{ id: string; key: string; value?: string }[]>(['all-app-settings']);
  if (!Array.isArray(all)) return false;
  const rec = all.find((r) => r?.key === key);
  settingsCache.set(key, { value: rec?.value || '', recordId: rec?.id ?? null });
  return true;
}

export function bustAppSettingCache(key: string) {
  busted.add(key);
  settingsCache.delete(key);
  pendingRequests.delete(key);
  AsyncStorage.removeItem(LOCAL_PREFIX + key).catch(() => {});
}

export function useAppSetting(key: string): [string, (v: string) => Promise<void>, boolean] {
  const [value, setValue] = useState(() => (cachedFromAllSettings(key), settingsCache.get(key)?.value ?? ''));
  const [recordId, setRecordId] = useState<string | null>(() => settingsCache.get(key)?.recordId ?? null);
  const [loading, setLoading] = useState(() => !settingsCache.has(key));

  useEffect(() => {
    let mounted = true;
    if (cachedFromAllSettings(key)) {
      // chiave cambiata dopo il primo render: valore dalla cache
      const cached = settingsCache.get(key)!;
      setValue(cached.value); setRecordId(cached.recordId); setLoading(false);
      return;
    }
    // cache locale: mostra subito l'ultimo valore noto
    AsyncStorage.getItem(LOCAL_PREFIX + key).then((v) => {
      if (mounted && v != null && !settingsCache.has(key)) { setValue(v); setLoading(false); }
    }).catch(() => {});

    let promise = pendingRequests.get(key);
    if (!promise) {
      promise = base44.entities.AppSettings.filter({ key }).then((records) => {
        const data = records?.[0] || null;
        settingsCache.set(key, { value: data?.value || '', recordId: data?.id ?? null });
        AsyncStorage.setItem(LOCAL_PREFIX + key, data?.value || '').catch(() => {});
        return data;
      }).finally(() => pendingRequests.delete(key));
      pendingRequests.set(key, promise);
    }
    promise.then((data) => {
      if (!mounted) return;
      setValue(data?.value || '');
      if (data) setRecordId(data.id);
      setLoading(false);
    }).catch(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [key]);

  const updateValue = useCallback(async (newValue: string) => {
    setValue(newValue);
    const currentRecordId = recordId || settingsCache.get(key)?.recordId || null;
    settingsCache.set(key, { value: newValue, recordId: currentRecordId });
    AsyncStorage.setItem(LOCAL_PREFIX + key, newValue).catch(() => {});
    if (currentRecordId) {
      await base44.entities.AppSettings.update(currentRecordId, { key, value: newValue });
    } else {
      const created = await base44.entities.AppSettings.create({ key, value: newValue });
      setRecordId(created.id);
      settingsCache.set(key, { value: newValue, recordId: created.id });
    }
  }, [key, recordId]);

  return [value, updateValue, loading];
}
