import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useShowInterstitial } from "../ads/AdsProvider";
import { theme } from "../theme";
import type { Tip } from "../types";



export function TipCard({
  tip,
  compact = false,
}: {
  tip: Tip;
  compact?: boolean;
}) {
  const showInterstitial = useShowInterstitial();

  return (
    <Pressable
      style={[styles.card, compact && styles.compact]}
      onPress={() => {
        showInterstitial();
        router.push(`/tip/${tip.id}`);
      }}
    >
      <View style={styles.copy}>
        <Text style={styles.category}>{tip.category.name}</Text>
        <Text style={styles.title} numberOfLines={compact ? 3 : 2}>
          {tip.title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={compact ? 2 : 2}>
          {tip.excerpt}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={14} color={theme.colors.muted} />
          <Text style={styles.date}>
            {new Date(tip.publishedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>
      {tip.coverImageUrl ? (
        <Image source={{ uri: tip.coverImageUrl }} style={styles.image} />
      ) : (
        <View style={styles.fallback}>
          <Ionicons name="bulb-outline" size={28} color={theme.colors.brand} />
        </View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: theme.colors.line,
  },
  compact: {
    width: 250,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: 14,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.surface,
  },
  copy: { flex: 1 },
  category: {
    color: theme.colors.brand,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 5,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    color: theme.colors.ink,
  },
  excerpt: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.muted,
    marginTop: 5,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10 },
  date: { color: theme.colors.muted, fontSize: 12 },
  image: {
    width: 94,
    height: 94,
    borderRadius: 14,
    backgroundColor: theme.colors.sky,
  },
  fallback: {
    width: 94,
    height: 94,
    borderRadius: 14,
    backgroundColor: theme.colors.sky,
    alignItems: "center",
    justifyContent: "center",
  },
});
