// crypto.getRandomValues per lo SDK Base44 (uuid): deve essere il primo import
import 'react-native-get-random-values';
// TextDecoder('latin1') (fast-png, jsPDF) sul telefono: prima di ogni altro modulo
import '../lib/textDecoderLatin1';
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
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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

function RootNavigator() {
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

export default function RootLayout() {
  // Stessi font dell'app web (index.html: Inter + Playfair Display)
  const [fontsLoaded] = useFonts({
    Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium,
    Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black,
    PlayfairDisplay_400Regular, PlayfairDisplay_500Medium, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold,
  });
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
