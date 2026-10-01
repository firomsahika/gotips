import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";

export function BannerAd({ inline = false }: { size?: any; inline?: boolean }) {
  return (
    <View style={[styles.wrap, inline && styles.inlineWrap]}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Ad · Google AdMob</Text>
        </View>
        <Ionicons name="information-circle-outline" size={14} color={theme.colors.muted} />
      </View>
      <View style={styles.contentRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Boost Your Daily Workflow with Top SaaS Tools</Text>
          <Text style={styles.sub}>Sponsored insight partner · Try premium workflows free</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 18,
    marginVertical: 14,
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    ...theme.shadow.soft,
  },
  inlineWrap: {
    marginHorizontal: 0,
    marginVertical: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: "rgba(100, 116, 139, 0.12)",
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: theme.fonts.bold,
    color: theme.colors.muted,
    letterSpacing: 0.8,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.ink,
    lineHeight: 18,
  },
  sub: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
});

