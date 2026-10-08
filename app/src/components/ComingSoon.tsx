import { StyleSheet, View } from 'react-native';
import { Hammer } from 'lucide-react-native';
import { AppText } from './ui';
import { colors } from '../theme';

/** Segnaposto per le sezioni non ancora portate dall'app web. */
export function ComingSoon({ title, source }: { title: string; source?: string }) {
  return (
    <View style={s.wrap}>
      <Hammer size={32} color={colors.mutedForeground} />
      <AppText weight="700" size={18} style={{ marginTop: 12 }}>{title}</AppText>
      <AppText muted style={{ textAlign: 'center', marginTop: 6 }}>
        Sezione in fase di porting dall'app web.
      </AppText>
      {source ? <AppText muted size={11} style={{ marginTop: 10 }}>Origine: {source}</AppText> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background },
});
