import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, Text } from "react-native";
import { api } from "../../src/api";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { TipCard } from "../../src/components/TipCard";
import { theme } from "../../src/theme";


export default function Category() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const q = useQuery({
    queryKey: ["category", slug],
    queryFn: () => api.categoryTips(slug),
  });
  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState retry={q.refetch} />;
  return (
    <FlatList
      data={q.data}
      keyExtractor={(x) => x.id}
      renderItem={({ item }) => <TipCard tip={item} />}
      contentContainerStyle={s.page}
      ListHeaderComponent={
        <Text style={s.title}>{q.data?.[0]?.category.name ?? slug} tips</Text>
      }
      ListEmptyComponent={
        <Text style={s.empty}>
          No tips available here yet. Check back soon.
        </Text>
      }
    />
  );
}
const s = StyleSheet.create({
  page: { padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: theme.colors.ink,
    marginBottom: 8,
  },
  empty: { color: theme.colors.muted, paddingTop: 50, textAlign: "center" },
});
