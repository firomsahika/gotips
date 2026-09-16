import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/api";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { theme } from "../../src/theme";


export default function Categories() {
  const q = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState retry={q.refetch} />;
  return (
    <FlatList
      data={q.data}
      numColumns={2}
      contentContainerStyle={s.page}
      columnWrapperStyle={s.row}
      keyExtractor={(x) => x.id}
      ListHeaderComponent={
        <>
          <Text style={s.title}>Explore by topic</Text>
          <Text style={s.copy}>
            Choose an area and find quick, practical knowledge.
          </Text>
        </>
      }
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => router.push(`/category/${item.slug}`)}
          style={[
            s.card,
            {
              backgroundColor: [
                theme.colors.sky,
                "#EAF8F3",
                "#FFF3DE",
                "#F2EDFF",
              ][index % 4],
            },
          ]}
        >
          <Text style={s.icon}>{item.icon}</Text>
          <Text style={s.name}>{item.name}</Text>
          <Text style={s.desc} numberOfLines={2}>
            {item.description}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.ink} />
        </Pressable>
      )}
    />
  );
}
const s = StyleSheet.create({
  page: { padding: 20, gap: 14 },
  row: { gap: 14 },
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
    marginBottom: 14,
  },
  card: {
    flex: 1,
    minHeight: 180,
    borderRadius: 20,
    padding: 17,
    justifyContent: "space-between",
  },
  icon: { fontSize: 30 },
  name: { fontSize: 17, fontWeight: "900", color: theme.colors.ink },
  desc: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.muted,
    marginTop: -9,
  },
});
