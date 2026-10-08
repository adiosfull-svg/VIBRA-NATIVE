// Prima versione nativa di src/components/client/ClientDetailDialog.jsx:
// contatti, statistiche e storico presenze. Le altre schede arriveranno col porting completo.
import { Stack, useLocalSearchParams } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Phone, Star } from 'lucide-react-native';
import { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { InstagramIcon } from '../../../components/InstagramIcon';
import { AppText, Card, EmptyState, Loading } from '../../../components/ui';
import { ClientAvatar } from '../../../features/clients/ClientRow';
import { useClientsData } from '../../../features/clients/useClientsData';
import { calculateAge } from '../../../legacy/utils/clientAge';
import { colors } from '../../../theme';

const eur = (n: number) => `€${Math.round(n || 0).toLocaleString('it-IT')}`;

export default function ClienteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useClientsData();
  const client: any = data.clients.find((c) => c.id === id);
  const stats: any = data.getStats(id);
  const eventsById = useMemo(() => new Map(data.events.map((e: any) => [e.id, e])), [data.events]);

  const history = useMemo(
    () =>
      (stats.attendances ?? [])
        .map((a: any) => ({ ...a, event: eventsById.get(a.event_id) }))
        .filter((a: any) => a.event?.date)
        .sort((a: any, b: any) => b.event.date.localeCompare(a.event.date)),
    [stats.attendances, eventsById],
  );

  if (data.isLoading) return <Loading />;
  if (!client) return <EmptyState title="Cliente non trovato" />;

  const age = calculateAge(client.data_nascita);
  const phone = (client.phone || '').replace(/[^\d+]/g, '');

  return (
    <>
      <Stack.Screen options={{ title: client.name }} />
      <ScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
        <Card style={s.header}>
          <ClientAvatar client={client} size={64} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AppText weight="800" size={18} style={{ flexShrink: 1 }}>{client.name}</AppText>
              {client.is_leader && <Star size={14} color="#facc15" fill="#facc15" />}
            </View>
            {age ? <AppText muted>{age.label}</AppText> : null}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              {phone ? (
                <IconButton label="Chiama" onPress={() => Linking.openURL(`tel:${phone}`)}>
                  <Phone size={18} color={colors.success} />
                </IconButton>
              ) : null}
              {client.instagram ? (
                <IconButton label="Apri Instagram" onPress={() => Linking.openURL(`https://instagram.com/${client.instagram.replace(/^@/, '')}`)}>
                  <InstagramIcon size={18} color="#f472b6" />
                </IconButton>
              ) : null}
            </View>
          </View>
        </Card>

        <View style={s.grid}>
          <Tile label="Presenze" value={String(stats.visits)} />
          <Tile label="Spesa totale" value={eur(stats.totalSpent)} />
          <Tile label="Spesa media" value={eur(stats.avgSpent)} />
          <Tile label="Rating" value={stats.rating != null ? stats.rating.toFixed(1) : '—'} />
          <Tile label="Ven / Sab / Dom" value={`${stats.fri} / ${stats.sat} / ${stats.sun}`} />
          <Tile label="Extra" value={String(stats.extra)} />
        </View>

        {client.notes ? (
          <Card>
            <AppText muted size={12}>Note</AppText>
            <AppText style={{ marginTop: 4 }}>{client.notes}</AppText>
          </Card>
        ) : null}

        <Card style={{ padding: 0 }}>
          <AppText weight="700" style={{ padding: 12 }}>Storico presenze</AppText>
          {history.length === 0 ? (
            <AppText muted style={{ paddingHorizontal: 12, paddingBottom: 12 }}>Nessuna presenza registrata.</AppText>
          ) : (
            history.map((a: any) => (
              <View key={a.id ?? `${a.event_id}`} style={s.histRow}>
                <View style={{ flex: 1 }}>
                  <AppText>{a.event.venue || a.event.name}</AppText>
                  <AppText muted size={12}>{format(parseISO(a.event.date), 'EEEE d MMMM yyyy', { locale: it })}</AppText>
                </View>
                <AppText weight="700" style={{ color: colors.accentForeground }}>{eur(a.revenue)}</AppText>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <Card style={s.tile}>
      <AppText muted size={11}>{label}</AppText>
      <AppText weight="700" size={16} style={{ marginTop: 2 }}>{value}</AppText>
    </Card>
  );
}

function IconButton({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={s.iconBtn} hitSlop={6}>
      {children}
    </Pressable>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { flexBasis: '31%', flexGrow: 1 },
  histRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary,
  },
});
