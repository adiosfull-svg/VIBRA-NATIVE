import { Stack } from 'expo-router';
import { colors } from '../../theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cliente/[id]" options={{ title: 'Cliente' }} />
      <Stack.Screen name="sezione/[name]" options={{ title: '' }} />
    </Stack>
  );
}
