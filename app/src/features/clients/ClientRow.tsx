// Versione nativa di src/components/client/ClientRowCard.jsx (card mobile).
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Gem, Minus, Star, TrendingDown, TrendingUp } from 'lucide-react-native';
import { AppText } from '../../components/ui';
import { BADGE_META } from '../../legacy/utils/clientBadges';
import { rankingColor } from '../../legacy/utils/clientRanking';
import { twColor, twColors } from '../../lib/tw';
import { colors } from '../../theme';

const RANK_COLOR = (i: number) => (i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#fb923c' : '#60a5fa');
const eur = (n: number) => `€${Math.round(n || 0).toLocaleString('it-IT')}`;

export type ClientStats = { visits: number; totalSpent: number; avgSpent: number; rating: number | null };
type Client = { id: string; name?: string; photo_url?: string; is_leader?: boolean; cum_trend_status?: string; new_people_brought?: number };

export function initials(name?: string) {
  return (name || '').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export function ClientAvatar({ client, size = 36 }: { client: Client; size?: number }) {
  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {client.photo_url ? (
        <Image source={{ uri: client.photo_url }} style={{ width: size, height: size }} contentFit="cover" cachePolicy="disk" />
      ) : (
        <AppText weight="700" size={size * 0.32} style={{ color: '#ede9fe' }}>{initials(client.name)}</AppText>
      )}
    </View>
  );
}

function Trend({ trend }: { trend?: string }) {
  if (trend === 'up') return <TrendingUp size={12} color="#34d399" />;
  if (trend === 'down') return <TrendingDown size={12} color="#f87171" />;
  if (trend === 'stable') return <Minus size={12} color="#94a3b8" />;
  return null;
}

export const ClientRow = memo(function ClientRow({ client, stats, badges = [], position, onPress }: {
  client: Client; stats: ClientStats; badges?: string[]; position?: number; onPress: () => void;
}) {
  const ranking = stats.rating;
  const rankColor = twColor(rankingColor(ranking)) ?? colors.mutedForeground;
  const newPeople = client.new_people_brought || 0;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && { backgroundColor: colors.secondary }]}
      accessibilityRole="button"
      accessibilityLabel={`${client.name}, ${stats.visits} presenze`}
    >
      {position != null && (
        <View style={s.position}>
          <AppText size={10} weight="700" style={{ color: RANK_COLOR(position - 1) }}>{position}</AppText>
        </View>
      )}
      <View style={s.head}>
        <ClientAvatar client={client} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={s.nameLine}>
            <AppText weight="600" numberOfLines={1} style={{ flexShrink: 1 }}>{client.name}</AppText>
            {client.is_leader && <Star size={12} color="#facc15" fill="#facc15" />}
            {ranking != null && (
              <View style={s.inline}>
                <Gem size={12} color={rankColor} />
                <AppText size={12} weight="700" style={{ color: rankColor }}>{ranking.toFixed(1)}</AppText>
              </View>
            )}
            <Trend trend={client.cum_trend_status} />
          </View>
          {badges.length > 0 && (
            <View style={[s.inline, { marginTop: 3, flexWrap: 'wrap' }]}>
              {badges.map((badge) => {
                const meta = (BADGE_META as Record<string, { label: string; color: string }>)[badge];
                const c = twColors(meta?.color ?? '');
                return (
                  <View key={badge} style={[s.badge, { backgroundColor: c.backgroundColor, borderColor: c.borderColor }]}>
                    <AppText size={9} style={{ color: c.color }}>{badge} {meta?.label}</AppText>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
      <View style={s.stats}>
        <Stat label="Pres." value={String(stats.visits)} />
        <Stat label="Spesa tot." value={eur(stats.totalSpent)} color={colors.accentForeground} />
        <Stat label="Media" value={eur(stats.avgSpent)} />
        <Stat label="Nuove" value={String(newPeople)} color={newPeople > 0 ? '#fbbf24' : colors.mutedForeground} />
      </View>
    </Pressable>
  );
});

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <AppText muted size={10}>{label}</AppText>
      <AppText weight="700" style={color ? { color } : undefined}>{value}</AppText>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 8,
  },
  position: {
    position: 'absolute', top: 0, left: 0, width: 19, height: 19, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.card, borderBottomRightRadius: 7, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.border,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 8 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  avatar: {
    backgroundColor: 'rgba(139,92,246,0.3)', borderWidth: 1, borderColor: 'rgba(167,139,250,0.4)',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  badge: { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, borderWidth: 1 },
  stats: { flexDirection: 'row', paddingLeft: 48 },
});
