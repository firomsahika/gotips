import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { openPrivacyChoices } from "../../src/ads/consent";
import { BannerAd } from "../../src/components/ads/BannerAd";
import { ScreenHero } from "../../src/components/ScreenHero";
import { useFavorites } from "../../src/favorites";
import { useHabit } from "../../src/storage/habit";
import { theme } from "../../src/theme";

export default function More() {
  const { ids } = useFavorites();
  const { habit, toggleDailyReminder, setFontSize } = useHabit();

  const handleShareApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        title: "GoTips App",
        message:
          "Check out GoTips for daily bite-sized business strategies, tech tools, and productivity frameworks! Available on iOS and Android.",
      });
    } catch {
      // Dismiss
    }
  };

  const handleRate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Enjoying GoTips?",
      "Your 5-star review helps us keep adding free daily strategies and actionable insights!",
      [
        { text: "Not now", style: "cancel" },
        { text: "Rate 5 Stars ⭐", onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={s.safe}>
      <StatusBar style="light" backgroundColor={theme.colors.brandDark} translucent={false} />
      <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
        <ScreenHero
          eyebrow="PROFILE & SETTINGS"
          title="Account & Tools"
          subtitle="Customize your experience and track your habit growth."
          icon="settings-outline"
        />

        {/* Knowledge & Habit Metrics Dashboard */}
        <View style={s.statsCard}>
          <Text style={s.statsTitle}>YOUR KNOWLEDGE PROGRESS</Text>
          <View style={s.statsGrid}>
            <View style={s.statItem}>
              <Text style={s.statEmoji}>🔥</Text>
              <Text style={s.statValue}>{habit.streak}d</Text>
              <Text style={s.statLabel}>Streak</Text>
            </View>

            <View style={s.statItem}>
              <Text style={s.statEmoji}>🎯</Text>
              <Text style={s.statValue}>{habit.masteredIds.length}</Text>
              <Text style={s.statLabel}>Applied</Text>
            </View>

            <View style={s.statItem}>
              <Text style={s.statEmoji}>📚</Text>
              <Text style={s.statValue}>{habit.readCount}</Text>
              <Text style={s.statLabel}>Read</Text>
            </View>

            <View style={s.statItem}>
              <Text style={s.statEmoji}>❤️</Text>
              <Text style={s.statValue}>{ids.length}</Text>
              <Text style={s.statLabel}>Saved</Text>
            </View>
          </View>
        </View>

        {/* Free Tier / Ad-Supported Status */}
        <View style={s.tierCard}>
          <View style={s.tierIconWrap}>
            <Ionicons name="sparkles" size={20} color="#F59E0B" />
          </View>
          <View style={s.tierCopy}>
            <Text style={s.tierTitle}>GoTips Free Access</Text>
            <Text style={s.tierDesc}>
              100% free daily insights supported by Google Mobile Ads partners.
            </Text>
          </View>
        </View>

        {/* Reading Preferences */}
        <Text style={s.label}>PREFERENCES</Text>
        <View style={s.list}>
          <View style={s.switchRow}>
            <View style={s.rowIcon}>
              <Ionicons name="notifications-outline" size={20} color={theme.colors.brand} />
            </View>
            <View style={s.rowCopy}>
              <Text style={s.rowTitle}>Daily Morning Reminder</Text>
              <Text style={s.rowDesc}>Receive fresh strategy drop notification</Text>
            </View>
            <Switch
              value={habit.dailyReminder}
              onValueChange={toggleDailyReminder}
              trackColor={{ false: "#CBD5E1", true: theme.colors.brand }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Pressable
            style={s.row}
            onPress={() =>
              setFontSize(habit.fontSize === "normal" ? "large" : "normal")
            }
          >
            <View style={s.rowIcon}>
              <Ionicons name="text-outline" size={20} color={theme.colors.brand} />
            </View>
            <View style={s.rowCopy}>
              <Text style={s.rowTitle}>Reading Font Size</Text>
              <Text style={s.rowDesc}>
                Currently: {habit.fontSize === "large" ? "Large (19px)" : "Standard (16px)"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>
        </View>

        {/* In-Feed Google Ad */}
        <BannerAd inline />

        {/* Privacy & Legal */}
        <Text style={s.label}>DATA & LEGAL</Text>
        <View style={s.list}>
          <Pressable style={s.row} onPress={() => openPrivacyChoices()}>
            <View style={s.rowIcon}>
              <Ionicons name="options-outline" size={20} color={theme.colors.brand} />
            </View>
            <View style={s.rowCopy}>
              <Text style={s.rowTitle}>Advertising Privacy Choices</Text>
              <Text style={s.rowDesc}>Manage Google UMP & GDPR consent choices</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>

          <Pressable style={s.row} onPress={() => router.push("/legal/privacy")}>
            <View style={s.rowIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.brand} />
            </View>
            <View style={s.rowCopy}>
              <Text style={s.rowTitle}>Privacy Policy</Text>
              <Text style={s.rowDesc}>How Google Mobile Ads & data are handled</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>

          <Pressable style={s.row} onPress={() => router.push("/legal/terms")}>
            <View style={s.rowIcon}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.brand} />
            </View>
            <View style={s.rowCopy}>
              <Text style={s.rowTitle}>Terms of Service</Text>
              <Text style={s.rowDesc}>Acceptable use & publisher terms</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>

          <Pressable style={[s.row, s.rowLast]} onPress={() => router.push("/legal/about")}>
            <View style={s.rowIcon}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.brand} />
            </View>
            <View style={s.rowCopy}>
              <Text style={s.rowTitle}>About GoTips</Text>
              <Text style={s.rowDesc}>Version 1.0.0 · Production Release</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>
        </View>

        {/* Community & Growth */}
        <Text style={s.label}>SPREAD THE WORD</Text>
        <View style={s.list}>
          <Pressable style={s.row} onPress={handleShareApp}>
            <View style={s.rowIcon}>
              <Ionicons name="share-social-outline" size={20} color={theme.colors.brand} />
            </View>
            <View style={s.rowCopy}>
              <Text style={s.rowTitle}>Share GoTips with Friends</Text>
              <Text style={s.rowDesc}>Help colleagues improve daily habits</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>

          <Pressable style={[s.row, s.rowLast]} onPress={handleRate}>
            <View style={s.rowIcon}>
              <Ionicons name="star-outline" size={20} color="#F59E0B" />
            </View>
            <View style={s.rowCopy}>
              <Text style={s.rowTitle}>Rate on App Store / Play Store</Text>
              <Text style={s.rowDesc}>Leave your feedback to support our team</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>
        </View>

        <Text style={s.version}>GoTips · Version 1.0.0 (Build 1)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.brandDark },
  page: { backgroundColor: theme.colors.canvas, paddingBottom: 110 },
  statsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...theme.shadow.card,
  },
  statsTitle: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    letterSpacing: 1,
    color: theme.colors.muted,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    color: theme.colors.muted,
    marginTop: 2,
  },
  tierCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 18,
    marginTop: 14,
    padding: 14,
    backgroundColor: "#FEF3C7",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  tierIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  tierCopy: { flex: 1 },
  tierTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: "#92400E",
  },
  tierDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: "#B45309",
    marginTop: 2,
  },
  label: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    letterSpacing: 1.1,
    marginHorizontal: 18,
    marginTop: 24,
    marginBottom: 10,
  },
  list: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...theme.shadow.card,
  },
  row: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.colors.lineLight,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  switchRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.colors.lineLight,
  },
  rowIcon: {
    height: 40,
    width: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.brandSoft,
    marginRight: 12,
  },
  rowCopy: { flex: 1 },
  rowTitle: { color: theme.colors.ink, fontFamily: theme.fonts.semiBold, fontSize: 14 },
  rowDesc: { color: theme.colors.muted, fontSize: 11, marginTop: 2 },
  version: {
    textAlign: "center",
    color: theme.colors.muted,
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    marginTop: 26,
  },
});
