import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

export function ScreenHero({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.overlayOne} />
      <View style={styles.overlayTwo} />
      <View style={styles.glow} />
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.iconShadow}>
        <View style={styles.icon}>
          <Ionicons name={icon} color="#FFFFFF" size={25} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#0F234E",
    overflow: "hidden",
    position: "relative",
  },
  overlayOne: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#143E9B",
    opacity: 0.85,
  },
  overlayTwo: {
    position: "absolute",
    left: -60,
    right: -60,
    top: -60,
    bottom: -20,
    backgroundColor: "#4C7BFF",
    opacity: 0.26,
    transform: [{ rotate: "8deg" }],
  },
  glow: {
    position: "absolute",
    top: -28,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  copy: { flex: 1, paddingRight: 14 },
  eyebrow: {
    fontFamily: theme.fonts.semiBold,
    color: "#DDEAFF",
    fontSize: 11,
    letterSpacing: 1.25,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: theme.fonts.bold,
    color: "#FFFFFF",
    fontSize: 27,
    lineHeight: 34,
    marginTop: 4,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    color: "#D5E4FB",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  iconShadow: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  icon: {
    height: 52,
    width: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
});
