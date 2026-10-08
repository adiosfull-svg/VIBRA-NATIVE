import { Tabs } from 'expo-router';
import { ContactRound, LayoutGrid, Menu, Send, Sprout, Sparkles } from 'lucide-react-native';
import { useRoleAccess } from '../../../lib/useRoleAccess';
import { colors } from '../../../theme';

// Stessa barra della MobileNavBar web: admin/super4 hanno Dashboard, capogruppo/pr hanno Semine.
// "Cerca" e le sezioni del menu laterale stanno nel tab "Menu".
export default function TabsLayout() {
  const { canAccessRoute } = useRoleAccess();
  const fullAccess = canAccessRoute('dashboard');
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerTitleStyle: { fontWeight: '700' },
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accentForeground,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          href: fullAccess ? undefined : null,
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="semine"
        options={{
          title: 'Semine',
          href: fullAccess ? null : undefined,
          tabBarIcon: ({ color, size }) => <Sprout color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="programmazione"
        options={{ title: 'Weekend', tabBarIcon: ({ color, size }) => <Send color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="clienti"
        options={{ title: 'Clienti', tabBarIcon: ({ color, size }) => <ContactRound color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="il-mio-vibra"
        options={{ title: 'Il Mio Vibra', tabBarLabel: 'Il Mio', tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="menu"
        options={{ title: 'Menu', tabBarIcon: ({ color, size }) => <Menu color={color} size={size} /> }}
      />
    </Tabs>
  );
}
