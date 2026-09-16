import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api } from "../../src/api";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { TipCard } from "../../src/components/TipCard";
import { useFavorites } from "../../src/favorites";
import { theme } from "../../src/theme";


export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useQuery({ queryKey: ["tip", id], queryFn: () => api.tip(id) });
  const related = useQuery({
    queryKey: ["related", id],
    queryFn: () => api.related(id),
  });
  const { ids, toggle } = useFavorites();
  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState retry={q.refetch} />;
  const tip = q.data;
  const open = async () => {
    if (!tip.sourceUrl?.startsWith("https://")) return;
    const ok = await Linking.canOpenURL(tip.sourceUrl);
    if (ok) Linking.openURL(tip.sourceUrl);
    else
      Alert.alert(
        "Link unavailable",
        "This website can’t be opened on this device.",
      );
  };
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.category}>{tip.category.name.toUpperCase()}</Text>
      <Text style={s.title}>{tip.title}</Text>
      <Text style={s.meta}>
        {new Date(tip.publishedAt).toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}{" "}
        · {tip.viewCount.toLocaleString()} reads
      </Text>
      {tip.coverImageUrl && (
        <Image source={{ uri: tip.coverImageUrl }} style={s.cover} />
      )}
      <Text style={s.content}>{tip.content}</Text>
      {tip.sourceUrl && (
        <Pressable style={s.source} onPress={open}>
          <Ionicons name="open-outline" size={20} color={theme.colors.brand} />
          <View>
            <Text style={s.sourceTitle}>
              {tip.sourceName ?? "Useful resource"}
            </Text>
            <Text style={s.sourceText}>Open official website</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.brand} />
        </Pressable>
      )}
      <Pressable
        style={s.save}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggle(tip.id);
        }}
      >
        <Ionicons
          name={ids.includes(tip.id) ? "heart" : "heart-outline"}
          size={21}
          color={ids.includes(tip.id) ? theme.colors.danger : theme.colors.ink}
        />
        <Text style={s.saveText}>
          {ids.includes(tip.id) ? "Saved to your tips" : "Save this tip"}
        </Text>
      </Pressable>
      <Text style={s.related}>You may also like</Text>
      {related.data?.map((item) => (
        <TipCard key={item.id} tip={item} />
      ))}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  page: { padding: 20, paddingBottom: 40 },
  category: {
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1.3,
    color: theme.colors.brand,
  },
  title: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "900",
    color: theme.colors.ink,
    marginTop: 9,
  },
  meta: { color: theme.colors.muted, marginTop: 12 },
  cover: {
    width: "100%",
    height: 220,
    borderRadius: 22,
    marginTop: 22,
    backgroundColor: theme.colors.sky,
  },
  content: {
    color: theme.colors.ink,
    fontSize: 17,
    lineHeight: 28,
    marginTop: 24,
  },
  source: {
    marginTop: 25,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sourceTitle: { fontWeight: "800", color: theme.colors.ink },
  sourceText: { fontSize: 13, color: theme.colors.muted, marginTop: 3 },
  save: {
    height: 54,
    borderRadius: 15,
    backgroundColor: theme.colors.sky,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
  },
  saveText: { fontWeight: "800", color: theme.colors.ink },
  related: {
    fontSize: 21,
    fontWeight: "900",
    color: theme.colors.ink,
    marginTop: 34,
    marginBottom: 4,
  },
});
