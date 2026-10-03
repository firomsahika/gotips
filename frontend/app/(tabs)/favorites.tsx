import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/api";
import { InFeedAd } from "../../src/components/ads/InFeedAd";
import { Loading } from "../../src/components/ScreenState";
import { ScreenHero } from "../../src/components/ScreenHero";
import { TipCard } from "../../src/components/TipCard";
import { useFavorites } from "../../src/favorites";
import { useHabit } from "../../src/storage/habit";
import { theme } from "../../src/theme";

export default function Favorites() {
  const { ids, ready } = useFavorites();
  const { habit } = useHabit();
  const q = useQuery({ queryKey: ["home"], queryFn: api.home });
  const [activeTab, setActiveTab] = useState<"saved" | "mastered">("saved");

  const allTips = useMemo(() => {
    return [
      ...(q.data?.featured ?? []),
      ...(q.data?.popular ?? []),
      ...(q.data?.latest ?? []),
    ].filter((t, i, a) => a.findIndex((x) => x.id === t.id) === i);
  }, [q.data]);

  const displayedTips = useMemo(() => {
    if (activeTab === "saved") {
      return allTips.filter((t) => ids.includes(t.id));
    } else {
      return allTips.filter((t) => habit.masteredIds.includes(t.id));
    }
  }, [allTips, ids, habit.masteredIds, activeTab]);

  if (!ready || q.isLoading) return <Loading />;

  return (
    <SafeAreaView edges={["top"]} style={s.safe}>
      <StatusBar style="light" backgroundColor={theme.colors.brandDark} translucent={false} />
      <FlatList
        data={displayedTips}
        keyExtractor={(x) => x.id}
        renderItem={({ item, index }) => (
          <View key={item.id}>
            {index > 0 && index % 4 === 0 && <InFeedAd />}
            <TipCard tip={item} />
          </View>
        )}
        contentContainerStyle={s.page}
        ListHeaderComponent={
          <>
            <ScreenHero
              eyebrow="YOUR VAULT"
              title="Personal Library"
              subtitle={
                displayedTips.length
                  ? `${displayedTips.length} actionable ideas ready for your focus.`
                  : "Keep your highest-impact strategies organized in one place."
              }
              icon="bookmark-outline"
            />

            {/* Segmented Control */}
            <View style={s.tabWrap}>
              <Pressable
                onPress={() => setActiveTab("saved")}
                style={[s.tabBtn, activeTab === "saved" && s.tabBtnActive]}
              >
                <Ionicons
                  name="heart"
                  size={14}
                  color={activeTab === "saved" ? "#FFFFFF" : theme.colors.muted}
                />
                <Text style={[s.tabBtnText, activeTab === "saved" && s.tabBtnTextActive]}>
                  Saved ({ids.length})
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab("mastered")}
                style={[s.tabBtn, activeTab === "mastered" && s.tabBtnActive]}
              >
                <Text style={s.fireIcon}>🔥</Text>
                <Text style={[s.tabBtnText, activeTab === "mastered" && s.tabBtnTextActive]}>
                  Mastered ({habit.masteredIds.length})
                </Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Ionicons
                name={activeTab === "saved" ? "heart-outline" : "flame-outline"}
                size={30}
                color={theme.colors.brand}
              />
            </View>
            <Text style={s.emptyTitle}>
              {activeTab === "saved" ? "Your shelf is waiting" : "No tips mastered yet"}
            </Text>
            <Text style={s.copy}>
              {activeTab === "saved"
                ? "Tap the heart on any tip card or detail screen to store it here for offline review."
                : "Mark action steps as completed to track your executed strategies and progress."}
            </Text>
            <Pressable onPress={() => router.push("/(tabs)")} style={s.discoverBtn}>
              <Text style={s.discoverText}>Discover Fresh Tips</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.brandDark },
  page: { paddingBottom: 110, backgroundColor: theme.colors.canvas },
  tabWrap: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...theme.shadow.soft,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: theme.colors.brand,
  },
  tabBtnText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: theme.colors.muted,
  },
  tabBtnTextActive: {
    color: "#FFFFFF",
  },
  fireIcon: {
    fontSize: 13,
  },
  empty: {
    margin: 18,
    marginTop: 35,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...theme.shadow.card,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: theme.colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 18,
  },
  copy: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  discoverBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.brand,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  discoverText: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 13,
  },
});
