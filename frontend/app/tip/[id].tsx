import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api } from "../../src/api";
import { useShowRewarded } from "../../src/ads/AdsProvider";
import { BannerAd } from "../../src/components/ads/BannerAd";
import { ErrorState, Loading } from "../../src/components/ScreenState";
import { TipCard } from "../../src/components/TipCard";
import { useFavorites } from "../../src/favorites";
import { useHabit } from "../../src/storage/habit";
import { theme } from "../../src/theme";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useQuery({ queryKey: ["tip", id], queryFn: () => api.tip(id) });
  const related = useQuery({
    queryKey: ["related", id],
    queryFn: () => api.related(id),
  });

  const { ids, toggle } = useFavorites();
  const { habit, markTipRead, toggleMastered, unlockProTip } = useHabit();
  const showRewarded = useShowRewarded();

  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [reaction, setReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState({
    inspiring: 34,
    practical: 89,
    game_changer: 42,
  });

  const audioTimer = useRef<any>(null);

  // Mark tip as read in history
  useEffect(() => {
    if (id) {
      markTipRead(id);
    }
  }, [id]);

  // Audio player simulation
  useEffect(() => {
    if (isPlayingAudio) {
      audioTimer.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 1) {
            setIsPlayingAudio(false);
            clearInterval(audioTimer.current);
            return 0;
          }
          return prev + 0.05;
        });
      }, 500);
    } else {
      if (audioTimer.current) clearInterval(audioTimer.current);
    }
    return () => {
      if (audioTimer.current) clearInterval(audioTimer.current);
    };
  }, [isPlayingAudio]);

  if (q.isLoading) return <Loading />;
  if (q.isError || !q.data) return <ErrorState retry={q.refetch} />;

  const tip = q.data;
  const isSaved = ids.includes(tip.id);
  const isMastered = habit.masteredIds.includes(tip.id);
  const isProUnlocked = habit.unlockedProIds.includes(tip.id);

  const toggleAudio = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPlayingAudio(!isPlayingAudio);
  };

  const openExternal = async () => {
    if (!tip.sourceUrl?.startsWith("https://")) return;
    const ok = await Linking.canOpenURL(tip.sourceUrl);
    if (ok) Linking.openURL(tip.sourceUrl);
    else Alert.alert("Link unavailable", "This website can’t be opened on this device.");
  };

  const shareTip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        title: tip.title,
        message: `💡 "${tip.title}"\n\n${tip.excerpt}\n\nRead more practical daily tips on GoTips!`,
      });
    } catch {
      // Dismiss
    }
  };

  const handleUnlockPro = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showRewarded(() => {
      unlockProTip(tip.id);
      Alert.alert(
        "🎉 Pro Strategy Unlocked!",
        "You now have full access to the tactical rollout framework and checklist for this tip."
      );
    });
  };

  const handleReact = (type: "inspiring" | "practical" | "game_changer") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (reaction === type) {
      setReaction(null);
      setReactionCounts((p) => ({ ...p, [type]: p[type] - 1 }));
    } else {
      setReaction(type);
      setReactionCounts((p) => ({ ...p, [type]: p[type] + 1 }));
      api.react(tip.id, "helpful").catch(() => {});
    }
  };

  return (
    <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      {/* Top Meta Bar */}
      <View style={s.topBar}>
        <View style={s.catPill}>
          <Text style={s.catPillText}>{tip.category.name}</Text>
        </View>

        <View style={s.topActions}>
          {/* Font Size Toggle */}
          <Pressable
            onPress={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
            style={s.topActionBtn}
          >
            <Text style={s.fontSizeText}>{fontSize === "normal" ? "A+" : "A-"}</Text>
          </Pressable>

          {/* Share Button */}
          <Pressable onPress={shareTip} style={s.topActionBtn}>
            <Ionicons name="share-social-outline" size={18} color={theme.colors.ink} />
          </Pressable>

          {/* Bookmark Button */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggle(tip.id);
            }}
            style={[s.topActionBtn, isSaved && s.topActionBtnActive]}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={18}
              color={isSaved ? theme.colors.danger : theme.colors.ink}
            />
          </Pressable>
        </View>
      </View>

      {/* Title */}
      <Text style={s.title}>{tip.title}</Text>

      {/* Meta Bar */}
      <View style={s.metaRow}>
        <View style={s.metaChip}>
          <Ionicons name="time-outline" size={13} color={theme.colors.muted} />
          <Text style={s.metaText}>{tip.readTimeMinutes ?? 2} min read</Text>
        </View>
        <Text style={s.metaDot}>·</Text>
        <View style={s.metaChip}>
          <Ionicons name="eye-outline" size={13} color={theme.colors.muted} />
          <Text style={s.metaText}>{tip.viewCount.toLocaleString()} reads</Text>
        </View>
        <Text style={s.metaDot}>·</Text>
        <Text style={s.metaText}>
          {new Date(tip.publishedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>

      {/* Audio Brief Player Widget */}
      <View style={s.audioCard}>
        <Pressable onPress={toggleAudio} style={s.audioPlayBtn}>
          <Ionicons
            name={isPlayingAudio ? "pause" : "play"}
            size={18}
            color="#FFFFFF"
          />
        </Pressable>
        <View style={s.audioCopy}>
          <View style={s.audioHeader}>
            <Text style={s.audioTitle}>Audio Summary</Text>
            <Text style={s.audioDuration}>
              {isPlayingAudio ? `${Math.round(audioProgress * 60)}s / 60s` : "60 sec brief"}
            </Text>
          </View>
          <View style={s.audioBarBg}>
            <View style={[s.audioBarFill, { width: `${audioProgress * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Cover Image if available */}
      {tip.coverImageUrl && (
        <Image source={{ uri: tip.coverImageUrl }} style={s.cover} />
      )}

      {/* Body Content */}
      <Text style={[s.content, fontSize === "large" && s.contentLarge]}>
        {tip.content}
      </Text>

      {/* 2-Minute Action Step Widget (Habit Tracker) */}
      <View style={s.actionBox}>
        <View style={s.actionHeader}>
          <View style={s.actionBadge}>
            <Ionicons name="flash" size={14} color="#F59E0B" />
            <Text style={s.actionBadgeText}>2-MINUTE ACTION STEP</Text>
          </View>
        </View>
        <Text style={s.actionText}>
          {tip.actionStep ?? "Take 2 minutes to apply this principle to your top priority today."}
        </Text>
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toggleMastered(tip.id);
          }}
          style={[s.masterBtn, isMastered && s.masterBtnDone]}
        >
          <Ionicons
            name={isMastered ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={isMastered ? "#FFFFFF" : theme.colors.brand}
          />
          <Text style={[s.masterBtnText, isMastered && s.masterBtnTextDone]}>
            {isMastered ? "Completed & Applied! 🔥" : "Mark as Applied Today"}
          </Text>
        </Pressable>
      </View>

      {/* Key Takeaways Card */}
      <View style={s.takeawaysBox}>
        <View style={s.takeawaysHeader}>
          <Ionicons name="bulb" size={18} color={theme.colors.brand} />
          <Text style={s.takeawaysTitle}>Key Takeaways</Text>
        </View>
        {(tip.keyTakeaways ?? [tip.excerpt]).map((t, idx) => (
          <View key={idx} style={s.takeawayRow}>
            <View style={s.bulletDot} />
            <Text style={s.takeawayItem}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Pro Strategy Breakdown (Unlocked via Google Rewarded Video Ad) */}
      <View style={[s.proCard, isProUnlocked && s.proCardUnlocked]}>
        <View style={s.proHeader}>
          <View style={s.proPill}>
            <Ionicons name="ribbon" size={14} color={isProUnlocked ? "#10B981" : "#D97706"} />
            <Text style={[s.proPillText, isProUnlocked && s.proPillTextUnlocked]}>
              {isProUnlocked ? "PRO STRATEGY UNLOCKED" : "EXCLUSIVE PRO BREAKDOWN"}
            </Text>
          </View>
        </View>

        {isProUnlocked ? (
          <View style={s.proBody}>
            <Text style={s.proFrameworkTitle}>
              {tip.proBreakdown?.frameworkTitle ?? "Tactical Implementation Framework"}
            </Text>
            <Text style={s.proStrategy}>
              {tip.proBreakdown?.strategy ??
                "Step 1: Audit baseline. Step 2: Test 7-day iteration. Step 3: Automate or delegate."}
            </Text>
            <Text style={s.checklistHeading}>Rollout Checklist:</Text>
            {(tip.proBreakdown?.checklist ?? [
              "Audit current baseline",
              "Execute daily checkpoint",
              "Review after 7 days",
            ]).map((step, i) => (
              <View key={i} style={s.checklistRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={s.checklistText}>{step}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={s.proLockedBody}>
            <Text style={s.proLockedTitle}>Deep-Dive Framework & Checklist</Text>
            <Text style={s.proLockedDesc}>
              Unlock the advanced step-by-step masterclass framework, templates, and execution checklist by watching a short 15-second sponsor video.
            </Text>
            <Pressable onPress={handleUnlockPro} style={s.unlockBtn}>
              <Ionicons name="play-circle" size={18} color="#FFFFFF" />
              <Text style={s.unlockBtnText}>Watch Video & Unlock Pro</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Google In-Content Banner Ad Placement */}
      <BannerAd inline />

      {/* Source Resource Link */}
      {tip.sourceUrl && (
        <Pressable style={s.source} onPress={openExternal}>
          <View style={s.sourceIconWrap}>
            <Ionicons name="open-outline" size={19} color={theme.colors.brand} />
          </View>
          <View style={s.sourceCopy}>
            <Text style={s.sourceTitle}>{tip.sourceName ?? "External Reference"}</Text>
            <Text style={s.sourceText}>Open official website & resources</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
        </Pressable>
      )}

      {/* Feedback Reactions */}
      <View style={s.reactionCard}>
        <Text style={s.reactionHeading}>Was this tip helpful?</Text>
        <View style={s.reactionRow}>
          <Pressable
            onPress={() => handleReact("inspiring")}
            style={[s.reactionBtn, reaction === "inspiring" && s.reactionBtnActive]}
          >
            <Text style={s.reactionEmoji}>💡</Text>
            <Text style={s.reactionLabel}>Inspiring</Text>
            <Text style={s.reactionCount}>{reactionCounts.inspiring}</Text>
          </Pressable>

          <Pressable
            onPress={() => handleReact("practical")}
            style={[s.reactionBtn, reaction === "practical" && s.reactionBtnActive]}
          >
            <Text style={s.reactionEmoji}>🎯</Text>
            <Text style={s.reactionLabel}>Practical</Text>
            <Text style={s.reactionCount}>{reactionCounts.practical}</Text>
          </Pressable>

          <Pressable
            onPress={() => handleReact("game_changer")}
            style={[s.reactionBtn, reaction === "game_changer" && s.reactionBtnActive]}
          >
            <Text style={s.reactionEmoji}>🔥</Text>
            <Text style={s.reactionLabel}>Game Changer</Text>
            <Text style={s.reactionCount}>{reactionCounts.game_changer}</Text>
          </Pressable>
        </View>
      </View>

      {/* Related Tips Section */}
      {(related.data?.length ?? 0) > 0 && (
        <View style={s.relatedSection}>
          <Text style={s.relatedHeading}>More from {tip.category.name}</Text>
          {related.data?.map((item) => (
            <TipCard key={item.id} tip={item} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 60, backgroundColor: theme.colors.canvas },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.colors.brandSoft,
    borderRadius: 8,
  },
  catPillText: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.brand,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...theme.shadow.soft,
  },
  topActionBtnActive: {
    backgroundColor: theme.colors.dangerSoft,
    borderColor: theme.colors.dangerSoft,
  },
  fontSizeText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  title: {
    fontSize: 27,
    lineHeight: 35,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 16,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.muted,
    fontFamily: theme.fonts.medium,
  },
  metaDot: {
    color: theme.colors.muted,
    fontSize: 12,
  },
  audioCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    ...theme.shadow.soft,
  },
  audioPlayBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadow.glow,
  },
  audioCopy: {
    flex: 1,
  },
  audioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  audioTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.ink,
  },
  audioDuration: {
    fontSize: 11,
    color: theme.colors.muted,
    fontFamily: theme.fonts.medium,
  },
  audioBarBg: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  audioBarFill: {
    height: "100%",
    backgroundColor: theme.colors.brand,
    borderRadius: 3,
  },
  cover: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: theme.colors.sky,
  },
  content: {
    color: theme.colors.ink,
    fontSize: 16,
    lineHeight: 27,
    fontFamily: theme.fonts.regular,
  },
  contentLarge: {
    fontSize: 19,
    lineHeight: 31,
  },
  actionBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    padding: 18,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionBadgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    letterSpacing: 1,
    color: "#B45309",
  },
  actionText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: theme.fonts.medium,
    color: "#78350F",
    marginBottom: 14,
  },
  masterBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  masterBtnDone: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  masterBtnText: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: theme.colors.brand,
  },
  masterBtnTextDone: {
    color: "#FFFFFF",
  },
  takeawaysBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...theme.shadow.soft,
  },
  takeawaysHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  takeawaysTitle: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  takeawayRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand,
    marginTop: 7,
  },
  takeawayItem: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.inkLight,
    fontFamily: theme.fonts.regular,
  },
  proCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  proCardUnlocked: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  proHeader: {
    marginBottom: 10,
  },
  proPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  proPillText: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    letterSpacing: 1,
    color: "#B45309",
  },
  proPillTextUnlocked: {
    color: "#15803D",
  },
  proLockedBody: {
    gap: 10,
  },
  proLockedTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  proLockedDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.muted,
  },
  unlockBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D97706",
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 4,
  },
  unlockBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: theme.fonts.bold,
  },
  proBody: {
    gap: 8,
  },
  proFrameworkTitle: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  proStrategy: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.inkLight,
  },
  checklistHeading: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: "#15803D",
    marginTop: 6,
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 2,
  },
  checklistText: {
    fontSize: 12,
    color: theme.colors.inkLight,
  },
  source: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    gap: 12,
    ...theme.shadow.soft,
  },
  sourceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceCopy: { flex: 1 },
  sourceTitle: { fontFamily: theme.fonts.bold, color: theme.colors.ink, fontSize: 13 },
  sourceText: { fontSize: 11, color: theme.colors.muted, marginTop: 2 },
  reactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    ...theme.shadow.soft,
  },
  reactionHeading: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.ink,
    marginBottom: 12,
  },
  reactionRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  reactionBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  reactionBtnActive: {
    backgroundColor: theme.colors.brandSoft,
    borderColor: theme.colors.brand,
  },
  reactionEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  reactionLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  reactionCount: {
    fontSize: 10,
    fontFamily: theme.fonts.medium,
    color: theme.colors.muted,
    marginTop: 2,
  },
  relatedSection: {
    marginTop: 28,
  },
  relatedHeading: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
    marginBottom: 8,
  },
});
