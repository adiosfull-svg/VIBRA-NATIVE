// crypto.getRandomValues per lo SDK Base44 (uuid): deve essere il primo import
import 'react-native-get-random-values';
// TextDecoder('latin1') (fast-png, jsPDF) sul telefono: prima di ogni altro modulo
import '../lib/textDecoderLatin1';
// localeCompare/toLocaleString veloci su Hermes Android (ICU via JNI a ogni chiamata): prima di tutto
import '../lib/fastIntlInstall';
import '../../global.css';
import '../ui/customCss';
import '../lib/testDiag';
import {
  Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium,
  Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular, PlayfairDisplay_500Medium, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { TEST_DIAG, diagMark } from '../lib/testDiag';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../lib/auth';
import { CrashBoundary, CrashOverlay, installCrashHandler } from '../lib/crashReport';
import { hoverRootProps } from '../ui/gestures';
import { queryClient } from '../lib/queryClient';
import { ViewAsPromoterProvider } from '../lib/viewAs';
import { Toaster } from '../ui/use-toast';
import { Loading } from '../components/ui';
import { colors } from '../theme';

installCrashHandler();

// diagnostica: azioni di navigazione e pila dello stack dell'app dopo ognuna (doppi montaggi da link)
function useNavDiag() {
  const nav = useNavigationContainerRef();
  useEffect(() => {
    if (!TEST_DIAG) return;
    const offA = nav.addListener('__unsafe_action__', (e: { data: { action: { type: string; payload?: unknown } } }) =>
      diagMark(`nav azione ${e.data.action.type} ${JSON.stringify(e.data.action.payload ?? {}).slice(0, 160)}`));
    const offS = nav.addListener('state', () => {
      const keys = (s: { routes: { name: string; key: string; state?: unknown }[] } | undefined): string =>
        s ? s.routes.map((r) => `${r.name}:${r.key.slice(-6)}${r.state ? `[${keys(r.state as never)}]` : ''}`).join(',') : '';
      diagMark(`nav stato ${keys(nav.getRootState() as never).slice(0, 300)}`);
    });
    return () => { offA(); offS(); };
  }, [nav]);
}

function RootNavigator() {
  useNavDiag();
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return <Loading />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Screen name="auth" />
    </Stack>
  );
}

// Stessi font dell'app web (index.html: Inter + Playfair Display). Sul telefono sono dentro l'app
// (plugin expo-font in app.json, stessi nomi di famiglia): disponibili subito, senza il caricamento
// asincrono dei 13 file che teneva lo schermo vuoto all'avvio. Sul web si caricano come prima.
const WEB_FONTS = {
  Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium,
  Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black,
  PlayfairDisplay_400Regular, PlayfairDisplay_500Medium, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold,
};
const useAppFonts = Platform.OS === 'web' ? () => useFonts(WEB_FONTS)[0] : () => true;

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) return null;
  return (
    // hoverRootProps: chiude il tap per l'hover emulato (ui/gestures.ts)
    <SafeAreaProvider style={{ backgroundColor: colors.background }} {...hoverRootProps}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ViewAsPromoterProvider>
            <StatusBar style="light" />
            <CrashBoundary>
              <RootNavigator />
              <PortalHost />
              <Toaster />
            </CrashBoundary>
            <CrashOverlay />
          </ViewAsPromoterProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
