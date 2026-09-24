import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/api";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { ScreenHero } from "../../src/components/ScreenHero";
import { theme } from "../../src/theme";

export default function Categories() {
  const q = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState retry={q.refetch} />;
  return <SafeAreaView edges={["top"]} style={s.safe}><StatusBar style="light" backgroundColor={theme.colors.brandDark} translucent={false} />
    <FlatList data={q.data} numColumns={2} contentContainerStyle={s.page} columnWrapperStyle={s.row} keyExtractor={(x) => x.id}
      ListHeaderComponent={<><ScreenHero eyebrow="BROWSE BY INTEREST" title="Explore topics" subtitle="Pick a subject and find a useful idea." icon="grid-outline" /><Text style={s.label}>ALL TOPICS</Text></>}
      renderItem={({ item, index }) => <Pressable onPress={() => router.push(`/category/${item.slug}`)} style={[s.card, { backgroundColor: [theme.colors.sky, "#EAF8F3", "#FFF4E3", "#F0ECFF"][index % 4] }]}><View style={s.iconBox}><Text style={s.icon}>{item.icon}</Text></View><Text style={s.name}>{item.name}</Text><Text style={s.desc} numberOfLines={2}>{item.description}</Text><View style={s.cardFoot}><Text style={s.explore}>Explore</Text><Ionicons name="arrow-forward" size={16} color={theme.colors.ink} /></View></Pressable>}
    />
  </SafeAreaView>;
}
const s = StyleSheet.create({ safe: { flex: 1, backgroundColor: theme.colors.brandDark }, page: { paddingBottom: 32, gap: 14 }, row: { gap: 14, paddingHorizontal: 20 }, label: { marginHorizontal: 20, marginTop: 25, marginBottom: 13, color: theme.colors.muted, fontFamily: theme.fonts.semiBold, letterSpacing: 1.1, fontSize: 11 }, card: { flex: 1, minHeight: 192, borderRadius: 22, padding: 16, justifyContent: "space-between" }, iconBox: { width: 43, height: 43, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.68)", alignItems: "center", justifyContent: "center" }, icon: { fontSize: 24 }, name: { fontSize: 17, fontFamily: theme.fonts.bold, color: theme.colors.ink, marginTop: 11 }, desc: { fontSize: 13, lineHeight: 18, color: theme.colors.muted, marginTop: -4 }, cardFoot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, explore: { fontSize: 12, color: theme.colors.ink, fontFamily: theme.fonts.semiBold } });
