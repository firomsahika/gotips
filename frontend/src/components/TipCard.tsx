import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRef } from "react";
import { useShowInterstitial } from "../ads/AdsProvider";
import { useFavorites } from "../favorites";
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
  const { ids, toggle } = useFavorites();
  const scale = useRef(new Animated.Value(1)).current;
  const isSaved = ids.includes(tip.id);

  const animatePress = (to: number) => {
    Animated.spring(scale, {
      toValue: to,
      friction: 6,
      tension: 140,
      useNativeDriver: true,
    }).start();
  };

  const handleFavorite = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggle(tip.id);
  };

  const readTime = tip.readTimeMinutes ?? 2;

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
          <View style={styles.topRow}>
            <View style={styles.catBadge}>
              <Text style={styles.catText}>
                {tip.category.icon ? `${tip.category.icon} ` : ""}
                {tip.category.name}
              </Text>
            </View>
            <View style={styles.readTimeBadge}>
              <Ionicons name="flash" size={10} color={theme.colors.mango} />
              <Text style={styles.readTimeText}>{readTime}m read</Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={compact ? 2 : 2}>
            {tip.title}
          </Text>

          <Text style={styles.excerpt} numberOfLines={compact ? 2 : 2}>
            {tip.excerpt}
          </Text>

          <View style={styles.footRow}>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={12} color={theme.colors.muted} />
              <Text style={styles.metaText}>{tip.viewCount.toLocaleString()}</Text>
            </View>

            <Pressable
              hitSlop={8}
              onPress={handleFavorite}
              style={[styles.favButton, isSaved && styles.favButtonActive]}
            >
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={16}
                color={isSaved ? theme.colors.danger : theme.colors.muted}
              />
            </Pressable>
          </View>
        </View>

        {tip.coverImageUrl ? (
          <Image source={{ uri: tip.coverImageUrl }} style={styles.image} />
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackIcon}>{tip.category.icon || "💡"}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    marginHorizontal: 18,
    marginVertical: 7,
    borderRadius: 22,
  },
  compactWrap: {
    marginRight: 12,
    marginLeft: 0,
    marginVertical: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    ...theme.shadow.card,
  },
  compact: {
    width: 275,
    padding: 15,
  },
  copy: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: theme.colors.brandSoft,
    borderRadius: 8,
  },
  catText: {
    color: theme.colors.brand,
    fontFamily: theme.fonts.bold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  readTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: theme.colors.mangoSoft,
    borderRadius: 6,
  },
  readTimeText: {
    fontSize: 10,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.gold,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  excerpt: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: theme.fonts.regular,
    color: theme.colors.muted,
    marginTop: 5,
  },
  footRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lineLight,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    color: theme.colors.muted,
  },
  favButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  favButtonActive: {
    backgroundColor: theme.colors.dangerSoft,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: theme.colors.sky,
  },
  fallback: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  fallbackIcon: {
    fontSize: 32,
  },
});

