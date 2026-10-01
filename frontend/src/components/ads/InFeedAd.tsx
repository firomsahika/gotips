import { StyleSheet, View } from "react-native";
import { BannerAd } from "./BannerAd";

export function InFeedAd({ inline = false }: { inline?: boolean }) {
  return (
    <View style={[styles.container, inline && styles.inline]}>
      <BannerAd inline={inline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  inline: {
    marginVertical: 10,
  },
});
