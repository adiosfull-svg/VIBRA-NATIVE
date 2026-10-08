// Sostituisce la Sidebar web (src/components/layout/Sidebar.jsx) e il menu account.
import { router, type Href } from 'expo-router';
import {
  Bell, BookOpen, BrainCircuit, Building, CalendarRange, ChevronRight, Download, GraduationCap, LogOut,
  Send, Settings, Sprout, UsersRound, type LucideIcon,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Card } from '../../../components/ui';
import { useAuth } from '../../../lib/auth';
import { useRoleAccess, type RouteName } from '../../../lib/useRoleAccess';
import { colors } from '../../../theme';

type Item = { label: string; icon: LucideIcon; name: string; route?: RouteName; adminOnly?: boolean };

const ITEMS: Item[] = [
  { label: 'Promoter', icon: UsersRound, name: 'promoter', route: 'promoter' },
  { label: 'Semine', icon: Sprout, name: 'semine' },
  { label: 'Messaggi', icon: Send, name: 'messaggi' },
  { label: 'Serate', icon: CalendarRange, name: 'serate', route: 'serate' },
  { label: 'Locali', icon: Building, name: 'locali', route: 'locali' },
  { label: 'Formazione', icon: BookOpen, name: 'formazione', route: 'formazione' },
  { label: 'Download', icon: Download, name: 'download', route: 'download' },
  { label: 'Vibra GPT', icon: BrainCircuit, name: 'ricerca-ai', route: 'ricerca-ai' },
  { label: 'Notifiche', icon: Bell, name: 'notifiche' },
  { label: "Guida all'uso", icon: GraduationCap, name: 'academy' },
  { label: 'Impostazioni app', icon: Settings, name: 'impostazioni-app', adminOnly: true },
];

const ROLE_LABEL: Record<string, string> = { admin: 'Admin', super4: 'Super 4', capogruppo: 'Capogruppo', pr: 'PR' };

export default function MenuScreen() {
  const { user, signOut } = useAuth();
  const { canAccessRoute, isAdmin } = useRoleAccess();
  const items = ITEMS.filter((i) => (!i.route || canAccessRoute(i.route)) && (!i.adminOnly || isAdmin));

  return (
    <ScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
      <Card>
        <AppText weight="700" size={16}>{user?.full_name || user?.email}</AppText>
        <AppText muted size={12}>{user?.email} · {ROLE_LABEL[user?.role ?? ''] ?? user?.role}</AppText>
      </Card>
      <Card style={{ padding: 0 }}>
        {items.map((item, i) => (
          <Row
            key={item.name}
            icon={item.icon}
            label={item.label}
            last={i === items.length - 1}
            onPress={() => router.push({ pathname: '/sezione/[name]', params: { name: item.name, title: item.label } } as Href)}
          />
        ))}
      </Card>
      <Card style={{ padding: 0 }}>
        <Row icon={LogOut} label="Esci" last danger onPress={signOut} />
      </Card>
    </ScrollView>
  );
}

function Row({ icon: Icon, label, onPress, last, danger }: {
  icon: LucideIcon; label: string; onPress: () => void; last?: boolean; danger?: boolean;
}) {
  const tint = danger ? colors.destructive : colors.foreground;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [s.row, !last && s.divider, pressed && { backgroundColor: colors.secondary }]}
    >
      <Icon size={18} color={danger ? colors.destructive : colors.accentForeground} />
      <AppText style={{ flex: 1, color: tint }}>{label}</AppText>
      {!danger && <ChevronRight size={16} color={colors.mutedForeground} />}
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, minHeight: 48 },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
});
