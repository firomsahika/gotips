import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/api";
import { Loading } from "../../src/components/ScreenState";
import { TipCard } from "../../src/components/TipCard";
import { useFavorites } from "../../src/favorites";
import { theme } from "../../src/theme";


export default function Favorites() {
  const { ids, ready } = useFavorites();
  const q = useQuery({ queryKey: ["home"], queryFn: api.home });
  if (!ready || q.isLoading) return <Loading />;
  const tips = [
    ...(q.data?.featured ?? []),
    ...(q.data?.popular ?? []),
    ...(q.data?.latest ?? []),
  ].filter(
    (t, i, a) => ids.includes(t.id) && a.findIndex((x) => x.id === t.id) === i,
  );
  return (
    <FlatList
      data={tips}
      keyExtractor={(x) => x.id}
      renderItem={({ item }) => <TipCard tip={item} />}
      contentContainerStyle={s.page}
      ListHeaderComponent={
        <>
          <Text style={s.title}>Saved tips</Text>
          <Text style={s.copy}>
            Keep useful ideas close when you need them.
          </Text>
        </>
      }
      ListEmptyComponent={
        <View style={s.empty}>
          <Text style={s.emptyTitle}>Nothing saved yet</Text>
          <Text style={s.copy}>
            Tap the heart on any tip to build your own knowledge shelf.
          </Text>
        </View>
      }
    />
  );
}
const s = StyleSheet.create({
  page: { padding: 20 },
  title: {
    fontSize: 29,
    fontWeight: "900",
    color: theme.colors.ink,
    marginTop: 24,
  },
  copy: {
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.muted,
    marginTop: 8,
  },
  empty: { paddingTop: 74, alignItems: "center", gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: theme.colors.ink },
});
