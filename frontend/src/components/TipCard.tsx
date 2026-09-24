import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRef } from "react";
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
  const scale = useRef(new Animated.Value(1)).current;

  const animatePress = (to: number) => {
    Animated.spring(scale, {
      toValue: to,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardWrap,
        compact && styles.compactWrap,
        { transform: [{ scale }] },
      ]}
    >
      <Pressable
        style={[styles.card, compact && styles.compact]}
        onPressIn={() => animatePress(0.98)}
        onPressOut={() => animatePress(1)}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    marginHorizontal: 18,
    marginVertical: 10,
    borderRadius: 24,
  },
  compactWrap: {
    marginRight: 10,
    marginLeft: 0,
    marginVertical: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E7EDF8",
    backgroundColor: "#FFFFFF",
    ...theme.shadow.soft,
  },
  compact: {
    width: 268,
    padding: 14,
    borderRadius: 22,
  },
  copy: {
    flex: 1,
    justifyContent: "center",
  },
  category: {
    color: theme.colors.brand,
    fontFamily: theme.fonts.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  excerpt: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.muted,
    marginTop: 6,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  date: {
    color: theme.colors.muted,
    fontSize: 12,
    fontFamily: theme.fonts.medium,
  },
  image: {
    width: 94,
    height: 94,
    borderRadius: 18,
    backgroundColor: theme.colors.sky,
    borderWidth: 1,
    borderColor: "rgba(36,107,222,0.08)",
  },
  fallback: {
    width: 94,
    height: 94,
    borderRadius: 18,
    backgroundColor: theme.colors.sky,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(36,107,222,0.08)",
  },
});
