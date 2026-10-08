// Tab "Clienti" (lista) di src/pages/Clienti.jsx: ricerca, filtri "mancanti", ordinamenti, classifica.
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText, EmptyState, ErrorState, Loading, Pill } from '../../../components/ui';
import { ClientRow } from '../../../features/clients/ClientRow';
import { SORTS } from '../../../features/clients/clientStats';
import { useClientsData } from '../../../features/clients/useClientsData';
import { colors, radius } from '../../../theme';

type SortKey = keyof typeof SORTS;
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'alpha', label: 'A–Z' },
  { key: 'visits', label: 'Pres.' },
  { key: 'spent', label: 'Spesa' },
  { key: 'newpeople', label: 'Nuove' },
  { key: 'rating', label: 'Rating' },
];
const MISSING_FILTERS = [
  { key: 'no_phone', label: 'Senza Tel.', check: (c: any) => !c.phone },
  { key: 'no_instagram', label: 'Senza IG', check: (c: any) => !c.instagram },
  { key: 'no_location', label: 'Senza Zona', check: (c: any) => !c.residenza_key },
];

export default function ClientiScreen() {
  const data = useClientsData();
  const [search, setSearch] = useState('');
  const query = useDeferredValue(search.trim().toLowerCase());
  const [sortBy, setSortBy] = useState<SortKey>('visits');
  const [missing, setMissing] = useState<string | null>(null);

  const list = useMemo(() => {
    const check = MISSING_FILTERS.find((f) => f.key === missing)?.check;
    const sorter = SORTS[sortBy];
    return data.clients
      .filter((c: any) => !query || c.name?.toLowerCase().includes(query) || c.instagram?.toLowerCase().includes(query))
      .filter((c) => !check || check(c))
      .sort((a, b) => sorter(a, b, data.getStats));
  }, [data.clients, data.statsMap, query, sortBy, missing]);

  if (!data.promoterId) {
    return <EmptyState title="Nessun promoter collegato" message="Il tuo account non è associato a un promoter: chiedi all'admin di collegarlo." />;
  }
  if (data.error) return <ErrorState error={data.error} onRetry={data.refetch} />;
  if (data.isLoading) return <Loading label="Carico i clienti…" />;

  // La posizione in classifica ha senso solo per ordinamenti numerici, senza ricerca/filtri
  const showPosition = sortBy !== 'alpha' && !query && !missing;

  return (
    <FlatList
      data={list}
      keyExtractor={(c) => c.id}
      renderItem={({ item, index }) => (
        <ClientRow
          client={item}
          stats={data.getStats(item.id)}
          badges={data.badgesMap[item.id]}
          position={showPosition ? index + 1 : undefined}
          onPress={() => router.push({ pathname: '/cliente/[id]', params: { id: item.id } })}
        />
      )}
      initialNumToRender={15}
      windowSize={7}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={<RefreshControl refreshing={data.isRefetching} onRefresh={data.refetch} tintColor={colors.accentForeground} />}
      ListHeaderComponent={
        <View style={s.header}>
          <View style={s.search}>
            <Search size={16} color={colors.mutedForeground} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Cerca per nome o Instagram"
              placeholderTextColor={colors.mutedForeground}
              style={s.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              accessibilityLabel="Cerca cliente"
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pills}>
            <AppText muted size={12}>Ordina:</AppText>
            {SORT_OPTIONS.map((o) => (
              <Pill key={o.key} label={o.label} active={sortBy === o.key} onPress={() => setSortBy(o.key)} />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pills}>
            {MISSING_FILTERS.map((f) => (
              <Pill key={f.key} label={f.label} active={missing === f.key} onPress={() => setMissing(missing === f.key ? null : f.key)} />
            ))}
          </ScrollView>
          <AppText muted size={12}>{list.length} clienti</AppText>
        </View>
      }
      ListEmptyComponent={<EmptyState title="Nessun cliente" message={query ? 'Nessun risultato per la ricerca.' : undefined} />}
    />
  );
}

const s = StyleSheet.create({
  header: { padding: 12, gap: 10 },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, minHeight: 44,
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.foreground, fontSize: 16, paddingVertical: 8 },
  pills: { gap: 6, alignItems: 'center' },
});
