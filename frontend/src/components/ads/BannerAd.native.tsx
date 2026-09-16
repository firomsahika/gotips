import { StyleSheet, View, Text } from "react-native";
import {
  BannerAd as NativeBannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import { config } from "../../config";
import { theme } from "../../theme";
import { useAdsReady } from "../../ads/AdsProvider";

/** An editorially separate, clearly labelled placement. Never position beside actions. */
export function BannerAd() {
  const ready = useAdsReady();
  if (!ready) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>ADVERTISEMENT</Text>
      <NativeBannerAd
        unitId={config.ads.bannerId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.line,
    paddingVertical: 8,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: theme.colors.muted,
    marginBottom: 5,
  },
});