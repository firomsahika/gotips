import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/api";
import { useShowInterstitial } from "../../src/ads/AdsProvider";
import { InFeedAd } from "../../src/components/ads/InFeedAd";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { TipCard } from "../../src/components/TipCard";
import { useHabit } from "../../src/storage/habit";
import { theme } from "../../src/theme";

export default function Home() {
  const query = useQuery({ queryKey: ["home"], queryFn: api.home });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const showInterstitial = useShowInterstitial();
  const { habit } = useHabit();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const data = query.data;

  // Filter tips if category selected
  const displayedTips = useMemo(() => {
    if (!data?.latest) return [];
    if (selectedCategory === "all") return data.latest;
    return data.latest.filter((t) => t.category.slug === selectedCategory);
  }, [data?.latest, selectedCategory]);

  if (query.isLoading) return <Loading />;
  if (query.isError) return <ErrorState retry={query.refetch} />;

  const featuredTip = data?.featured[0];

  return (
    <SafeAreaView edges={["top"]} style={s.safe}>
      <StatusBar style="light" backgroundColor={theme.colors.brandDark} translucent={false} />
      <FlatList
        style={s.list}
        data={displayedTips}
        keyExtractor={(x) => x.id}
        contentContainerStyle={s.page}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching}
            onRefresh={query.refetch}
            tintColor={theme.colors.brand}
          />
        }
        renderItem={({ item, index }) => (
          <View key={item.id}>
            {index > 0 && index % 4 === 0 && <InFeedAd />}
            <TipCard tip={item} />
          </View>
        )}
        ListHeaderComponent={
          <>
            {/* SaaS Header */}
            <View style={s.header}>
              <View style={s.headerGlowOne} />
              <View style={s.headerGlowTwo} />
              <View style={s.headerCurve} />

              <View style={s.headerLine}>
                <View style={s.brandRow}>
                  <View style={s.brandMark}>
                    <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={s.brand}>GoTips</Text>
                    <Text style={s.greeting}>{greeting}, Thinker</Text>
                  </View>
                </View>

                {/* Streak Pill */}
                <View style={s.streakPill}>
                  <Text style={s.streakFire}>🔥</Text>
                  <Text style={s.streakText}>{habit.streak}d streak</Text>
                </View>
              </View>

              <Text style={s.heading}>Bite-sized ideas for{`\n`}high performers.</Text>
              <Text style={s.sub}>
                Actionable business strategies, tech tools & productivity systems.
              </Text>
            </View>

            {/* Search Bar Widget */}
            <Pressable
              accessibilityRole="search"
              accessibilityLabel="Search tips"
              onPress={() => router.push("/search")}
              style={s.search}
            >
              <View style={s.searchIcon}>
                <Ionicons name="search" size={19} color={theme.colors.brand} />
              </View>
              <View style={s.searchCopy}>
                <Text style={s.searchLabel}>Find actionable tips</Text>
                <Text style={s.searchHint}>Search AI, business, habits, finance...</Text>
              </View>
              <View style={s.searchBadge}>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.brand} />
              </View>
            </Pressable>

            {/* Quick Category Chips Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.categoryBar}
            >
              <Pressable
                onPress={() => setSelectedCategory("all")}
                style={[s.categoryChip, selectedCategory === "all" && s.categoryChipActive]}
              >
                <Text style={[s.categoryChipText, selectedCategory === "all" && s.categoryChipTextActive]}>
                  ⚡ All Tips
                </Text>
              </Pressable>

              {categoriesQuery.data?.map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.slug)}
                    style={[s.categoryChip, isActive && s.categoryChipActive]}
                  >
                    <Text style={[s.categoryChipText, isActive && s.categoryChipTextActive]}>
                      {cat.icon} {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Featured Tip of the Day */}
            {selectedCategory === "all" && featuredTip && (
              <>
                <View style={s.sectionRow}>
                  <View style={s.sectionTitleRow}>
                    <Text style={s.sectionBadge}>TODAY&apos;S DROP</Text>
                    <Text style={s.section}>Featured Insight</Text>
                  </View>
                  <Text style={s.sectionNote}>Editor&apos;s pick</Text>
                </View>

                <Pressable
                  onPress={() => {
                    showInterstitial();
                    router.push(`/tip/${featuredTip.id}`);
                  }}
                  style={s.featured}
                >
                  <View style={s.featureGlow} />
                  <View style={s.featureTop}>
                    <View style={s.featureTag}>
                      <Ionicons name="star" size={13} color="#FFFFFF" />
                      <Text style={s.featureLabel}>{featuredTip.category.name}</Text>
                    </View>
                    <View style={s.readPill}>
                      <Ionicons name="time-outline" size={12} color={theme.colors.brand} />
                      <Text style={s.readPillText}>
                        {featuredTip.readTimeMinutes ?? 2}m read
                      </Text>
                    </View>
                  </View>

                  <Text style={s.featureTitle}>{featuredTip.title}</Text>
                  <Text style={s.featureCopy} numberOfLines={2}>
                    {featuredTip.excerpt}
                  </Text>

                  <View style={s.featureFoot}>
                    <View style={s.readCta}>
                      <Text style={s.read}>Read today&apos;s tip</Text>
                      <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                    </View>
                    <Text style={s.viewsText}>
                      👀 {featuredTip.viewCount.toLocaleString()} readers
                    </Text>
                  </View>
                </Pressable>
              </>
            )}

            {/* In-feed Ad after Hero */}
            {selectedCategory === "all" && <InFeedAd />}

            {/* Trending Shelf */}
            {selectedCategory === "all" && (data?.popular?.length ?? 0) > 0 && (
              <>
                <View style={s.sectionRow}>
                  <View style={s.sectionTitleRow}>
                    <Text style={s.sectionBadge}>HOT</Text>
                    <Text style={s.section}>Trending Now</Text>
                  </View>
                  <Ionicons name="trending-up" size={18} color={theme.colors.mango} />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.row}
                >
                  {data?.popular.map((t) => (
                    <TipCard tip={t} compact key={t.id} />
                  ))}
                </ScrollView>
              </>
            )}

            {/* Latest Tips Header */}
            <View style={s.sectionRow}>
              <View style={s.sectionTitleRow}>
                <Text style={s.sectionBadge}>
                  {selectedCategory === "all" ? "FEED" : "CATEGORY"}
                </Text>
                <Text style={s.section}>
                  {selectedCategory === "all"
                    ? "Fresh Insights"
                    : `${categoriesQuery.data?.find((c) => c.slug === selectedCategory)?.name ?? "Selected"} Tips`}
                </Text>
              </View>
              <Text style={s.sectionCount}>
                {displayedTips.length} {displayedTips.length === 1 ? "tip" : "tips"}
              </Text>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.brandDark },
  list: { flex: 1, backgroundColor: theme.colors.canvas },
  page: { paddingBottom: 110 },
  header: {
    position: "relative",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    backgroundColor: "#0B1528",
    ...theme.shadow.hero,
  },
  headerGlowOne: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0F285E",
    opacity: 0.85,
  },
  headerGlowTwo: {
    position: "absolute",
    top: -50,
    right: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(37, 99, 235, 0.25)",
  },
  headerCurve: {
    position: "absolute",
    left: -20,
    right: -20,
    top: -40,
    bottom: 20,
    backgroundColor: "rgba(96, 165, 250, 0.12)",
    transform: [{ rotate: "8deg" }],
  },
  headerLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandMark: {
    height: 38,
    width: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brand,
    ...theme.shadow.glow,
  },
  brand: {
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 22,
  },
  greeting: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: "#94A3B8",
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(245, 158, 11, 0.16)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  streakFire: {
    fontSize: 14,
  },
  streakText: {
    color: "#FBBF24",
    fontFamily: theme.fonts.bold,
    fontSize: 12,
  },
  heading: {
    marginTop: 6,
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 27,
    lineHeight: 35,
    position: "relative",
    zIndex: 1,
  },
  sub: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: theme.fonts.regular,
    marginTop: 8,
    position: "relative",
    zIndex: 1,
  },
  search: {
    marginHorizontal: 18,
    marginTop: -16,
    backgroundColor: "#FFFFFF",
    minHeight: 68,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 2,
    ...theme.shadow.card,
  },
  searchIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  searchCopy: { flex: 1, marginLeft: 12 },
  searchLabel: { color: theme.colors.ink, fontFamily: theme.fonts.semiBold, fontSize: 14 },
  searchHint: { color: theme.colors.muted, fontFamily: theme.fonts.regular, fontSize: 11, marginTop: 1 },
  searchBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBar: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 4,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipActive: {
    backgroundColor: theme.colors.brand,
    borderColor: theme.colors.brand,
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.inkLight,
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  sectionRow: {
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleRow: {
    gap: 2,
  },
  sectionBadge: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    letterSpacing: 1,
    color: theme.colors.brand,
  },
  section: { color: theme.colors.ink, fontFamily: theme.fonts.bold, fontSize: 19 },
  sectionNote: { color: theme.colors.muted, fontFamily: theme.fonts.medium, fontSize: 12 },
  sectionCount: { color: theme.colors.muted, fontFamily: theme.fonts.semiBold, fontSize: 12 },
  featured: {
    marginHorizontal: 18,
    borderRadius: 24,
    padding: 20,
    minHeight: 200,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#0F2148",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    ...theme.shadow.hero,
  },
  featureGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1E3A8A",
    opacity: 0.6,
  },
  featureTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.brand,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  featureLabel: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: "#FFFFFF",
  },
  readPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  readPillText: {
    color: theme.colors.brand,
    fontFamily: theme.fonts.bold,
    fontSize: 11,
  },
  featureTitle: {
    marginTop: 16,
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    lineHeight: 29,
    position: "relative",
    zIndex: 1,
  },
  featureCopy: {
    marginTop: 8,
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: theme.fonts.regular,
    position: "relative",
    zIndex: 1,
  },
  featureFoot: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },
  readCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.brand,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  read: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 12,
  },
  viewsText: {
    color: "#94A3B8",
    fontFamily: theme.fonts.medium,
    fontSize: 11,
  },
  row: {
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
});
