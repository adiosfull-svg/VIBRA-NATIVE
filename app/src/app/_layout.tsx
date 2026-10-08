import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../lib/auth';
import { queryClient } from '../lib/queryClient';
import { ViewAsPromoterProvider } from '../lib/viewAs';
import { Loading } from '../components/ui';
import { colors } from '../theme';

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
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ViewAsPromoterProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </ViewAsPromoterProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
