import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button } from '../components/ui';
import { useAuth } from '../lib/auth';
import { BACKEND } from '../lib/backend';
import { colors, radius } from '../theme';

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  // Backend Base44: si entra con Google sulla pagina di accesso di Base44, come nell'app web.
  if (BACKEND === 'base44') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={s.wrap}>
          <AppText size={34} weight="800" style={s.logo}>VIBRA</AppText>
          <AppText muted style={{ textAlign: 'center', marginBottom: 32 }}>Accedi con il tuo account</AppText>
          <View style={{ gap: 12 }}>
            {error ? <AppText style={{ color: colors.destructive }} accessibilityRole="alert">{error}</AppText> : null}
            <Button title="Continua con Google" onPress={google} loading={loading} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.wrap}>
        <AppText size={34} weight="800" style={s.logo}>VIBRA</AppText>
        <AppText muted style={{ textAlign: 'center', marginBottom: 32 }}>Accedi con il tuo account</AppText>
        <View style={{ gap: 12 }}>
          <TextInput
            style={s.input}
            placeholder="Email"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email"
          />
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={submit}
            accessibilityLabel="Password"
          />
          {error ? <AppText style={{ color: colors.destructive }} accessibilityRole="alert">{error}</AppText> : null}
          <Button title="Accedi" onPress={submit} loading={loading} disabled={!email || !password} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, maxWidth: 420, width: '100%', alignSelf: 'center' },
  logo: { textAlign: 'center', letterSpacing: 6, color: colors.accentForeground, marginBottom: 4 },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.foreground,
    paddingHorizontal: 14,
    fontSize: 16,
  },
});
