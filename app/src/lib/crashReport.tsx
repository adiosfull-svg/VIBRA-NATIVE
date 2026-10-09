// Errori fatali visibili anche nella build release (dove l'app altrimenti si chiude senza dire nulla):
//  - CrashBoundary: un errore durante il disegno mostra CrashScreen invece di chiudere l'app;
//  - installCrashHandler: gli altri errori fatali (eventi, timer...) vengono salvati e mostrati
//    (subito, e al riavvio successivo se l'app si chiude comunque).
// Solo componenti React Native di base: se il problema è nello strato ui/, questa schermata funziona lo stesso.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Component, useEffect, useState, type ReactNode } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

const KEY = 'vibra:lastCrash';

export type CrashInfo = { message: string; stack?: string; componentStack?: string; when: string; fatal?: boolean };

type Listener = (c: CrashInfo) => void;
const listeners = new Set<Listener>();

function toInfo(error: unknown, extra?: Partial<CrashInfo>): CrashInfo {
  const e = error as { message?: unknown; stack?: unknown; name?: unknown } | undefined;
  const message = e && typeof e.message === 'string' ? `${typeof e.name === 'string' ? `${e.name}: ` : ''}${e.message}` : String(error);
  return { message, stack: typeof e?.stack === 'string' ? e.stack : undefined, when: new Date().toISOString(), ...extra };
}

async function save(info: CrashInfo) {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(info)); } catch { /* niente */ }
}

/** Da chiamare una volta all'avvio (fuori dai componenti). In sviluppo resta anche la schermata rossa. */
export function installCrashHandler() {
  const g = globalThis as { ErrorUtils?: { getGlobalHandler: () => (e: unknown, fatal?: boolean) => void; setGlobalHandler: (h: (e: unknown, fatal?: boolean) => void) => void } };
  if (Platform.OS === 'web' || !g.ErrorUtils) return;
  const previous = g.ErrorUtils.getGlobalHandler();
  g.ErrorUtils.setGlobalHandler((error, fatal) => {
    const info = toInfo(error, { fatal });
    void save(info).then(() => {
      if (__DEV__) previous(error, fatal);
      else if (fatal) listeners.forEach((l) => l(info)); // in release l'app resta aperta e mostra l'errore
      else previous(error, fatal);
    });
  });
}

function CrashScreen({ info, onClose, closeLabel }: { info: CrashInfo; onClose: () => void; closeLabel: string }) {
  const [copied, setCopied] = useState(false);
  const text = [`VIBRA errore (${info.when})${info.fatal ? ' [fatale]' : ''}`, info.message, '', 'Stack:', info.stack ?? '-', '', 'Componenti:', info.componentStack ?? '-'].join('\n');
  return (
    <View style={{ flex: 1, backgroundColor: '#09090b', paddingTop: 56, paddingHorizontal: 16, paddingBottom: 24 }}>
      <Text style={{ color: '#f87171', fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Si è verificato un errore</Text>
      <Text style={{ color: '#a1a1aa', fontSize: 13, marginBottom: 12 }}>
        Fai uno screenshot di questa schermata (o tocca «Copia») e mandalo a Claude.
      </Text>
      <ScrollView style={{ flex: 1, backgroundColor: '#18181b', borderRadius: 8, padding: 12 }}>
        <Text selectable style={{ color: '#fafafa', fontSize: 14, fontWeight: '600', marginBottom: 10 }}>{info.message}</Text>
        <Text selectable style={{ color: '#d4d4d8', fontSize: 11, fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }) }}>
          {(info.componentStack ?? '').trim().split('\n').slice(0, 25).join('\n')}
          {'\n\n'}
          {(info.stack ?? '').split('\n').slice(0, 40).join('\n')}
        </Text>
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <Pressable onPress={() => { void Clipboard.setStringAsync(text).then(() => setCopied(true)); }} style={{ flex: 1, backgroundColor: '#27272a', borderRadius: 10, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: '#fafafa', fontWeight: '600' }}>{copied ? 'Copiato' : 'Copia'}</Text>
        </Pressable>
        <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: '#7c3aed', borderRadius: 10, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: '#ffffff', fontWeight: '600' }}>{closeLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

type BoundaryState = { info: CrashInfo | null };

/** Errori durante il disegno: schermata con il messaggio invece della chiusura dell'app. */
export class CrashBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { info: null };
  static getDerivedStateFromError(error: unknown): BoundaryState {
    return { info: toInfo(error) };
  }
  componentDidCatch(error: unknown, errorInfo: { componentStack?: string | null }) {
    const info = toInfo(error, { componentStack: errorInfo.componentStack ?? undefined });
    this.setState({ info });
    void save(info);
  }
  render() {
    if (this.state.info) return <CrashScreen info={this.state.info} closeLabel="Riprova" onClose={() => this.setState({ info: null })} />;
    return this.props.children;
  }
}

/**
 * Mostra sopra l'app l'errore fatale appena avvenuto o quello rimasto dall'ultima chiusura
 * (salvato da installCrashHandler o da CrashBoundary). «Continua» lo cancella.
 */
export function CrashOverlay() {
  const [info, setInfo] = useState<CrashInfo | null>(null);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    AsyncStorage.getItem(KEY).then((v) => { if (v) setInfo(JSON.parse(v) as CrashInfo); }).catch(() => {});
    const l: Listener = (c) => setInfo(c);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  if (!info) return null;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, elevation: 99999 }}>
      <CrashScreen info={info} closeLabel="Continua" onClose={() => { setInfo(null); void AsyncStorage.removeItem(KEY); }} />
    </View>
  );
}
