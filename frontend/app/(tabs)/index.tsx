import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../../src/api";
import { useShowInterstitial } from "../../src/ads/AdsProvider";
import { BannerAd } from "../../src/components/ads/BannerAd";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { TipCard } from "../../src/components/TipCard";
import { theme } from "../../src/theme";


export default function Home() {
  const query = useQuery({ queryKey: ["home"], queryFn: api.home });
  const showInterstitial = useShowInterstitial();
  const data = query.data;
  if (query.isLoading) return <Loading />;
  if (query.isError) return <ErrorState retry={query.refetch} />;
  
  return (
    <FlatList
      data={data?.latest}
      renderItem={({ item, index }) => (
        <>
          {index === 2 && <BannerAd />}
          <TipCard tip={item} />
        </>
      )}
      keyExtractor={(x) => x.id}
      contentContainerStyle={s.page}
      refreshControl={
        <RefreshControl
          refreshing={query.isRefetching}
          onRefresh={query.refetch}
        />
      }
      ListHeaderComponent={
        <>
          <View style={s.top}>
            <Text style={s.eyebrow}>YOUR DAILY EDGE</Text>
            <Text style={s.heading}>
              Ideas worth your{`\n`}next few minutes.
            </Text>
            <Text style={s.sub}>
              Curated tips for sharper work and better digital habits.
            </Text>
          </View>
          <Pressable onPress={() => router.push("/search")} style={s.search}>
            <Ionicons name="search" size={20} color={theme.colors.muted} />
            <Text style={s.searchText}>Search tips, tools and ideas</Text>
          </Pressable>
          <Text style={s.section}>Featured today</Text>
          {data?.featured[0] && (
            <Pressable
              onPress={() => {
                showInterstitial();
                router.push(`/tip/${data.featured![0].id}`);
              }}
              style={s.featured}
            >
              <Text style={s.featureLabel}>
                {data.featured[0].category.name} · Editor’s pick
              </Text>
              <Text style={s.featureTitle}>{data.featured[0].title}</Text>
              <Text style={s.featureCopy} numberOfLines={2}>
                {data.featured[0].excerpt}
              </Text>
              <Text style={s.read}>
                Read the tip <Ionicons name="arrow-forward" size={15} />
              </Text>
            </Pressable>
          )}
          <Text style={s.section}>Popular now</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.row}
          >
            {data?.popular.map((t) => (
              <TipCard tip={t} compact key={t.id} />
            ))}
          </ScrollView>
          <Text style={s.section}>Latest tips</Text>
        </>
      }
    />
  );
}
const s = StyleSheet.create({
  page: { padding: 20, paddingBottom: 32 },
  top: { paddingTop: 24 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: "800",
    color: theme.colors.brand,
  },
  heading: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    color: theme.colors.ink,
    marginTop: 7,
  },
  sub: {
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.muted,
    marginTop: 8,
  },
  search: {
    height: 52,
    backgroundColor: theme.colors.sky,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 22,
  },
  searchText: { color: theme.colors.muted, fontWeight: "600" },
  section: {
    fontWeight: "900",
    fontSize: 20,
    color: theme.colors.ink,
    marginTop: 28,
    marginBottom: 12,
  },
  featured: {
    backgroundColor: theme.colors.ink,
    borderRadius: 24,
    padding: 22,
    minHeight: 195,
  },
  featureLabel: { color: "#9ED5FF", fontSize: 12, fontWeight: "800" },
  featureTitle: {
    fontWeight: "900",
    fontSize: 23,
    lineHeight: 29,
    color: "white",
    marginTop: 10,
  },
  featureCopy: { color: "#D4DCE7", lineHeight: 20, marginTop: 8 },
  read: { color: "white", fontWeight: "800", marginTop: 16 },
  row: { gap: 12, paddingRight: 20 },
});
