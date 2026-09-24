import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/api";
import { Loading } from "../../src/components/ScreenState";
import { ScreenHero } from "../../src/components/ScreenHero";
import { TipCard } from "../../src/components/TipCard";
import { useFavorites } from "../../src/favorites";
import { theme } from "../../src/theme";

export default function Favorites() {
  const { ids, ready } = useFavorites(); const q = useQuery({ queryKey: ["home"], queryFn: api.home });
  if (!ready || q.isLoading) return <Loading />;
  const tips = [...(q.data?.featured ?? []), ...(q.data?.popular ?? []), ...(q.data?.latest ?? [])].filter((t, i, a) => ids.includes(t.id) && a.findIndex((x) => x.id === t.id) === i);
  return <SafeAreaView edges={["top"]} style={s.safe}><StatusBar style="light" backgroundColor={theme.colors.brandDark} translucent={false} />
    <FlatList data={tips} keyExtractor={(x) => x.id} renderItem={({ item }) => <TipCard tip={item} />} contentContainerStyle={s.page}
      ListHeaderComponent={<ScreenHero eyebrow="YOUR PERSONAL LIBRARY" title="Saved tips" subtitle={tips.length ? `${tips.length} useful ideas ready when you are.` : "Keep useful ideas ready when you need them."} icon="heart-outline" />}
      ListEmptyComponent={<View style={s.empty}><View style={s.emptyIcon}><Ionicons name="heart-outline" size={30} color={theme.colors.brand} /></View><Text style={s.emptyTitle}>Your shelf is waiting</Text><Text style={s.copy}>Save a tip and it will appear here for your next focused moment.</Text></View>}
    />
  </SafeAreaView>;
}
const s = StyleSheet.create({ safe: { flex: 1, backgroundColor: theme.colors.brandDark }, page: { paddingBottom: 32 }, empty: { margin: 20, marginTop: 55, alignItems: "center", backgroundColor: theme.colors.surface, borderRadius: 24, padding: 28 }, emptyIcon: { width: 64, height: 64, borderRadius: 22, backgroundColor: theme.colors.sky, alignItems: "center", justifyContent: "center", marginBottom: 17 }, emptyTitle: { color: theme.colors.ink, fontFamily: theme.fonts.bold, fontSize: 20 }, copy: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8 } });
