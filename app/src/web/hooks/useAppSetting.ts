// Port di src/hooks/useAppSetting.jsx: stessa logica (cache in memoria + cache locale
// stale-while-revalidate + DB come fonte di verità), con AsyncStorage al posto di localStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { base44 } from '../../lib/base44';

const settingsCache = new Map<string, { value: string; recordId: string | null }>();
const pendingRequests = new Map<string, Promise<any>>();
const LOCAL_PREFIX = 'app_setting_cache_';

export function bustAppSettingCache(key: string) {
  settingsCache.delete(key);
  pendingRequests.delete(key);
  AsyncStorage.removeItem(LOCAL_PREFIX + key).catch(() => {});
}

export function useAppSetting(key: string): [string, (v: string) => Promise<void>, boolean] {
  const [value, setValue] = useState(() => settingsCache.get(key)?.value ?? '');
  const [recordId, setRecordId] = useState<string | null>(() => settingsCache.get(key)?.recordId ?? null);
  const [loading, setLoading] = useState(() => !settingsCache.has(key));

  useEffect(() => {
    let mounted = true;
    if (settingsCache.has(key)) { setLoading(false); return; }
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
