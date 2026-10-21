// Stato della rete sul telefono (expo-network) collegato a React Query: senza rete le richieste si mettono
// in pausa invece di fallire (le pagine restano coi dati salvati, lib/queryCachePersist) e ripartono da sole
// quando la rete torna. Sul web React Query usa già gli eventi online/offline del browser.
// Si guarda solo `isConnected`: `isInternetReachable` su Android può restare falso/nullo per qualche secondo
// anche con la rete, e metterebbe in pausa le richieste senza motivo.
import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

const online = (s: { isConnected?: boolean | null }) => s.isConnected !== false;

if (Platform.OS !== 'web') {
  onlineManager.setEventListener((setOnline) => {
    Network.getNetworkStateAsync().then((s) => setOnline(online(s))).catch(() => {});
    const sub = Network.addNetworkStateListener((s) => setOnline(online(s)));
    return () => sub.remove();
  });
}

const subscribe = (fn: () => void) => onlineManager.subscribe(fn);
const isOnline = () => onlineManager.isOnline();

/** true con la rete; ridisegna solo chi lo usa quando cambia. */
export function useOnline() {
  return useSyncExternalStore(subscribe, isOnline, isOnline);
}
