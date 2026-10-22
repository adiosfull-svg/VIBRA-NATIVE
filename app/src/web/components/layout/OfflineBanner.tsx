// Avviso «offline» del telefono (scelta di Antonio, 21/10): senza rete l'app resta usabile coi dati salvati
// (lib/queryCachePersist, 24 ore) e le richieste aspettano la rete (lib/network). Una pillola sopra la barra
// in basso (in alto copriva il titolo della pagina), che sale quando la rete cade e scende quando torna;
// non prende i tocchi. Sul web niente.
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnline } from '../../../lib/network';
import { THEME } from '../../../ui/palette.generated';
import { Text } from '../../../ui/text';

export default function OfflineBanner() {
  const online = useOnline();
  const { bottom } = useSafeAreaInsets();
  const v = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!online) setShown(true);
    const anim = Animated.timing(v, { toValue: online ? 0 : 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    anim.start(({ finished }) => { if (finished && online) setShown(false); });
    return () => anim.stop();
  }, [online, v]);
  if (Platform.OS === 'web' || !shown) return null;
  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: bottom + NAV_BAR + 8 }]}>
      <Animated.View style={[styles.pill, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
        <View style={styles.dot} />
        <Text className="text-xs font-medium text-foreground">Sei offline · dati salvati</Text>
      </Animated.View>
    </View>
  );
}

// altezza della barra in basso (MobileNavBar), sopra la safe area
const NAV_BAR = 64;

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    backgroundColor: THEME.card, borderWidth: 1, borderColor: THEME.border,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f59e0b' },
});
