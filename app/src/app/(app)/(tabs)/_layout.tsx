// Tab principali con la barra di navigazione dell'app web (MobileNavBar).
import { Tabs } from 'expo-router';
import MobileNavBar from '../../../web/components/layout/MobileNavBar';
import { THEME } from '../../../ui/palette.generated';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <MobileNavBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: THEME.background } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="semine" />
      <Tabs.Screen name="programmazione" />
      <Tabs.Screen name="clienti" />
      <Tabs.Screen name="il-mio-vibra" />
    </Tabs>
  );
}
