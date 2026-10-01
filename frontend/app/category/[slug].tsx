import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/api";
import { InFeedAd } from "../../src/components/ads/InFeedAd";
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

  const tips = q.data ?? [];
  const category = tips[0]?.category;

  return (
    <FlatList
      data={tips}
      keyExtractor={(x) => x.id}
      contentContainerStyle={s.page}
      renderItem={({ item, index }) => (
        <View key={item.id}>
          {index > 0 && index % 4 === 0 && <InFeedAd />}
          <TipCard tip={item} />
        </View>
      )}
      ListHeaderComponent={
        <View style={s.hero}>
          <View style={s.heroTop}>
            <View style={s.iconShell}>
              <Text style={s.iconText}>{category?.icon ?? "✦"}</Text>
            </View>
            <View style={s.countBadge}>
              <Text style={s.countText}>{tips.length} tips</Text>
            </View>
          </View>
          <Text style={s.title}>{category?.name ?? slug}</Text>
          <Text style={s.subtitle}>
            {category?.description ?? "Practical insights and proven tactics."}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={s.empty}>
          <Ionicons name="folder-open-outline" size={40} color={theme.colors.muted} />
          <Text style={s.emptyTitle}>No tips found in this category</Text>
          <Text style={s.emptyText}>Check back soon or explore other curated topics.</Text>
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backBtnText}>Explore Other Categories</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const s = StyleSheet.create({
  page: { paddingBottom: 60, backgroundColor: theme.colors.canvas },
  hero: {
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 16,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...theme.shadow.soft,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconShell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 24,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.colors.surfaceSoft,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  countText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: theme.colors.brand,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.muted,
    marginTop: 4,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginHorizontal: 18,
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: "center",
    marginTop: 6,
  },
  backBtn: {
    marginTop: 18,
    backgroundColor: theme.colors.brand,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 13,
  },
});
