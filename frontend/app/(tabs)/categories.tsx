import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/api";
import { InFeedAd } from "../../src/components/ads/InFeedAd";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { ScreenHero } from "../../src/components/ScreenHero";
import { theme } from "../../src/theme";

const cardColors = [
  { bg: "#EFF6FF", border: "#BFDBFE", iconBg: "#DBEAFE", accent: "#2563EB" },
  { bg: "#F0FDF4", border: "#BBF7D0", iconBg: "#DCFCE7", accent: "#16A34A" },
  { bg: "#FFFBEB", border: "#FDE68A", iconBg: "#FEF3C7", accent: "#D97706" },
  { bg: "#F5F3FF", border: "#DDD6FE", iconBg: "#EDE9FE", accent: "#7C3AED" },
  { bg: "#FFF1F2", border: "#FECDD3", iconBg: "#FFE4E6", accent: "#E11D48" },
  { bg: "#ECFEFF", border: "#A5F3FC", iconBg: "#CFFAFE", accent: "#0891B2" },
];

export default function Categories() {
  const q = useQuery({ queryKey: ["categories"], queryFn: api.categories });

  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState retry={q.refetch} />;

  const data = q.data ?? [];

  return (
    <SafeAreaView edges={["top"]} style={s.safe}>
      <StatusBar style="light" backgroundColor={theme.colors.brandDark} translucent={false} />
      <FlatList
        data={data}
        numColumns={2}
        contentContainerStyle={s.page}
        columnWrapperStyle={s.row}
        keyExtractor={(x) => x.id}
        ListHeaderComponent={
          <>
            <ScreenHero
              eyebrow="CURATED TOPICS"
              title="Knowledge Hub"
              subtitle="Browse high-leverage frameworks and actionable tactics by subject."
              icon="grid-outline"
            />
            <InFeedAd />
            <View style={s.headerRow}>
              <Text style={s.label}>ALL DOMAINS</Text>
              <Text style={s.countText}>{data.length} categories</Text>
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          const color = cardColors[index % cardColors.length];
          return (
            <Pressable
              onPress={() => router.push(`/category/${item.slug}`)}
              style={[
                s.card,
                { backgroundColor: color.bg, borderColor: color.border },
              ]}
            >
              <View style={s.cardTop}>
                <View style={[s.iconBox, { backgroundColor: color.iconBg }]}>
                  <Text style={s.icon}>{item.icon}</Text>
                </View>
                {item.tipsCount !== undefined && (
                  <View style={s.countBadge}>
                    <Text style={[s.countBadgeText, { color: color.accent }]}>
                      {item.tipsCount} tips
                    </Text>
                  </View>
                )}
              </View>

              <View style={s.cardContent}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.desc} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              <View style={s.cardFoot}>
                <Text style={[s.explore, { color: color.accent }]}>Explore</Text>
                <Ionicons name="arrow-forward" size={14} color={color.accent} />
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.brandDark },
  page: { paddingBottom: 110, backgroundColor: theme.colors.canvas },
  row: { gap: 14, paddingHorizontal: 18, marginBottom: 14 },
  headerRow: {
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    letterSpacing: 1.1,
    fontSize: 11,
  },
  countText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.medium,
    fontSize: 12,
  },
  card: {
    flex: 1,
    minHeight: 180,
    borderRadius: 22,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    ...theme.shadow.soft,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22 },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  countBadgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
  },
  cardContent: {
    marginVertical: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  desc: {
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.muted,
    marginTop: 4,
  },
  cardFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  explore: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
});
