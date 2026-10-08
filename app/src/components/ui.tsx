// Primitive UI native che sostituiscono i componenti shadcn/Tailwind dell'app web.
import type { ReactNode } from 'react';
import {
  ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type TextProps,
  type TextStyle, type ViewStyle,
} from 'react-native';
import { colors, radius } from '../theme';

export function AppText({ style, muted, weight, size, ...rest }: TextProps & {
  muted?: boolean; weight?: TextStyle['fontWeight']; size?: number;
}) {
  return (
    <Text
      {...rest}
      style={[{ color: muted ? colors.mutedForeground : colors.foreground, fontWeight: weight, fontSize: size ?? 14 }, style]}
    />
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[styles.pill, active && styles.pillActive]}
    >
      <AppText size={12} weight="600" style={{ color: active ? colors.primaryForeground : colors.mutedForeground }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function Button({ title, onPress, disabled, loading, variant = 'primary', style }: {
  title: string; onPress: PressableProps['onPress']; disabled?: boolean; loading?: boolean;
  variant?: 'primary' | 'ghost'; style?: StyleProp<ViewStyle>;
}) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        primary ? { backgroundColor: colors.primary } : { backgroundColor: 'transparent' },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={colors.primaryForeground} /> : (
        <AppText weight="600" style={{ color: primary ? colors.primaryForeground : colors.accentForeground }}>{title}</AppText>
      )}
    </Pressable>
  );
}

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.accentForeground} />
      {label ? <AppText muted style={{ marginTop: 8 }}>{label}</AppText> : null}
    </View>
  );
}

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <View style={styles.center}>
      <AppText weight="700" size={16}>{title}</AppText>
      {message ? <AppText muted style={{ marginTop: 6, textAlign: 'center' }}>{message}</AppText> : null}
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <AppText weight="700" size={16}>Impossibile caricare i dati</AppText>
      <AppText muted style={{ marginTop: 6, textAlign: 'center' }}>{error instanceof Error ? error.message : String(error)}</AppText>
      {onRetry ? <Button title="Riprova" onPress={onRetry} style={{ marginTop: 16 }} /> : null}
    </View>
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 12,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },
  pillActive: { backgroundColor: colors.primary },
  button: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
