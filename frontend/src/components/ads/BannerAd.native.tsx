import { StyleSheet, View, Text } from "react-native";
import {
  BannerAd as NativeBannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import { config } from "../../config";
import { theme } from "../../theme";
import { useAdsReady } from "../../ads/AdsProvider";

export function BannerAd({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  inline = false,
}: {
  size?: BannerAdSize;
  inline?: boolean;
}) {
  const ready = useAdsReady();
  if (!ready) return null;

  return (
    <View style={[styles.wrap, inline && styles.inlineWrap]}>
      <View style={styles.badgeRow}>
        <View style={styles.adDot} />
        <Text style={styles.label}>SPONSORED</Text>
      </View>
      <View style={styles.adFrame}>
        <NativeBannerAd
          unitId={config.ads.bannerId}
          size={size}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
    marginHorizontal: 18,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...theme.shadow.soft,
  },
  inlineWrap: {
    marginHorizontal: 0,
    marginVertical: 12,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(100, 116, 139, 0.08)",
    gap: 5,
  },
  adDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.muted,
  },
  label: {
    fontSize: 9,
    fontFamily: theme.fonts.bold,
    letterSpacing: 1.1,
    color: theme.colors.muted,
  },
  adFrame: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 12,
  },
});