import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/api";
import { useShowInterstitial } from "../../src/ads/AdsProvider";
import { BannerAd } from "../../src/components/ads/BannerAd";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { TipCard } from "../../src/components/TipCard";
import { theme } from "../../src/theme";

export default function Home() {
  const query = useQuery({ queryKey: ["home"], queryFn: api.home });
  const showInterstitial = useShowInterstitial();
  if (query.isLoading) return <Loading />;
  if (query.isError) return <ErrorState retry={query.refetch} />;
  const data = query.data;

  return (
    <SafeAreaView edges={["top"]} style={s.safe}>
      <StatusBar style="light" backgroundColor={theme.colors.brandDark} translucent={false} />
      <FlatList
        style={s.list}
        data={data?.latest}
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
          <>
            {index === 2 && <BannerAd />}
            <TipCard tip={item} />
          </>
        )}
        ListHeaderComponent={
          <>
            <View style={s.header}>
              <View style={s.headerGlowOne} />
              <View style={s.headerGlowTwo} />
              <View style={s.headerLine}>
                <View style={s.brandMark}>
                  <Ionicons name="sparkles" size={19} color="#FFFFFF" />
                </View>
                <Text style={s.brand}>GoTips</Text>
                <View style={s.headerAction}>
                  <Ionicons name="notifications-outline" size={21} color="#FFFFFF" />
                </View>
              </View>

              <Text style={s.kicker}>YOUR DAILY KNOWLEDGE DROP</Text>
              <Text style={s.heading}>Ideas that move{`\n`}you forward.</Text>
              <Text style={s.sub}>
                Short, useful reads for better work and a sharper digital life.
              </Text>
            </View>

            <Pressable
              accessibilityRole="search"
              accessibilityLabel="Search tips"
              onPress={() => router.push("/search")}
              style={s.search}
            >
              <View style={s.searchIcon}>
                <Ionicons name="search" size={20} color={theme.colors.brand} />
              </View>
              <View style={s.searchCopy}>
                <Text style={s.searchLabel}>Find your next idea</Text>
                <Text style={s.searchHint}>Search tips, tools and topics</Text>
              </View>
              <Ionicons name="arrow-forward" size={19} color={theme.colors.muted} />
            </Pressable>

            <View style={s.sectionRow}>
              <Text style={s.section}>Featured for you</Text>
              <Text style={s.sectionNote}>Editor&apos;s pick</Text>
            </View>

            {data?.featured[0] && (
              <Pressable
                onPress={() => {
                  showInterstitial();
                  router.push(`/tip/${data.featured[0].id}`);
                }}
                style={s.featured}
              >
                <View style={s.featureGradient} />
                <View style={s.featureTop}>
                  <View style={s.featureTag}>
                    <Ionicons name="flash" size={13} color="#FFFFFF" />
                    <Text style={s.featureLabel}>{data.featured[0].category.name}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </View>
                <Text style={s.featureTitle}>{data.featured[0].title}</Text>
                <Text style={s.featureCopy} numberOfLines={2}>
                  {data.featured[0].excerpt}
                </Text>
                <View style={s.featureFoot}>
                  <Text style={s.read}>Open tip</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </View>
              </Pressable>
            )}

            <View style={s.sectionRow}>
              <Text style={s.section}>Popular right now</Text>
              <Ionicons name="trending-up" size={18} color={theme.colors.brand} />
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

            <View style={s.sectionRow}>
              <Text style={s.section}>Fresh tips</Text>
              <Text style={s.sectionNote}>Just added</Text>
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
  page: { paddingBottom: 36 },
  header: {
    position: "relative",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#0C1F46",
    overflow: "hidden",
  },
  headerGlowOne: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#143E9B",
    opacity: 0.82,
  },
  headerGlowTwo: {
    position: "absolute",
    left: -20,
    right: -20,
    top: -50,
    bottom: -20,
    backgroundColor: "#4C7BFF",
    opacity: 0.18,
    transform: [{ rotate: "8deg" }],
  },
  headerLine: { flexDirection: "row", alignItems: "center", position: "relative", zIndex: 1 },
  brandMark: {
    height: 36,
    width: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  brand: { fontFamily: theme.fonts.bold, color: "#FFFFFF", fontSize: 19, marginLeft: 10, flex: 1 },
  headerAction: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  kicker: {
    marginTop: 29,
    color: "#DDEAFF",
    fontFamily: theme.fonts.semiBold,
    fontSize: 11,
    letterSpacing: 1.2,
    position: "relative",
    zIndex: 1,
  },
  heading: {
    marginTop: 7,
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 31,
    lineHeight: 39,
    position: "relative",
    zIndex: 1,
  },
  sub: {
    color: "#D2E3FD",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 9,
    maxWidth: 330,
    position: "relative",
    zIndex: 1,
  },
  search: {
    marginHorizontal: 20,
    marginTop: -22,
    backgroundColor: "rgba(255,255,255,0.82)",
    minHeight: 70,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    ...theme.shadow.card,
  },
  searchIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: theme.colors.sky,
    alignItems: "center",
    justifyContent: "center",
  },
  searchCopy: { flex: 1, marginLeft: 11 },
  searchLabel: { color: theme.colors.ink, fontFamily: theme.fonts.semiBold, fontSize: 15 },
  searchHint: { color: theme.colors.muted, fontSize: 12, marginTop: 1 },
  sectionRow: {
    marginHorizontal: 20,
    marginTop: 29,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section: { color: theme.colors.ink, fontFamily: theme.fonts.bold, fontSize: 21 },
  sectionNote: { color: theme.colors.brand, fontFamily: theme.fonts.semiBold, fontSize: 12 },
  featured: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 21,
    minHeight: 214,
    overflow: "hidden",
    ...theme.shadow.card,
    position: "relative",
    backgroundColor: "#1D4ED8",
  },
  featureGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1D4ED8",
    opacity: 0.95,
  },
  featureTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 },
  featureTag: {
    backgroundColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
  },
  featureLabel: { color: "#FFFFFF", fontFamily: theme.fonts.semiBold, fontSize: 11 },
  featureTitle: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 23,
    lineHeight: 30,
    marginTop: 17,
    position: "relative",
    zIndex: 1,
  },
  featureCopy: {
    color: "#DCEBFF",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
    position: "relative",
    zIndex: 1,
  },
  featureFoot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 16,
    position: "relative",
    zIndex: 1,
  },
  read: { color: "#FFFFFF", fontFamily: theme.fonts.semiBold, fontSize: 14 },
  row: { gap: 13, paddingLeft: 20, paddingRight: 20 },
});
