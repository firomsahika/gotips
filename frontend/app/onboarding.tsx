import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../src/theme";

const slides = [
  {
    eyebrow: "Curated wisdom",
    title: "Discover insight in under 2 minutes",
    description: "Fresh ideas, useful tools, and better work habits designed for busy people.",
  },
  {
    eyebrow: "Built for focus",
    title: "Save what matters and revisit anytime",
    description: "Keep your best ideas close so you can come back when you need a boost.",
  },
  {
    eyebrow: "A better daily rhythm",
    title: "Turn inspiration into action",
    description: "A calmer, more premium reading experience for clearer thinking and smarter habits.",
  },
] as const;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const current = useMemo(() => slides[step], [step]);

  const finish = async () => {
    await AsyncStorage.setItem("gotips.onboardingSeen", "true");
    router.replace("/(tabs)");
  };

  const isLast = step === slides.length - 1;

  return (
    <View style={styles.screen}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.headerRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>G</Text>
        </View>
        <Text style={styles.brand}>GoTips</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>{current.eyebrow}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </View>

      <View style={styles.progress}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, step === index && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        {step > 0 && (
          <Pressable style={styles.secondaryButton} onPress={() => setStep((v) => v - 1)}>
            <Text style={styles.secondaryLabel}>Back</Text>
          </Pressable>
        )}

        <Pressable style={styles.primaryButton} onPress={isLast ? finish : () => setStep((v) => v + 1)}>
          <Text style={styles.primaryLabel}>{isLast ? "Get started" : "Next"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.dark.base,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  glowOne: {
    position: "absolute",
    top: -80,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(96,165,250,0.18)",
  },
  glowTwo: {
    position: "absolute",
    bottom: -60,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(59,130,246,0.14)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 1,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: theme.fonts.bold,
  },
  brand: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 20,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 28,
    padding: 24,
    zIndex: 1,
    ...theme.shadow.card,
  },
  eyebrow: {
    color: theme.colors.dark.accent,
    fontFamily: theme.fonts.semiBold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 12,
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 30,
    lineHeight: 38,
  },
  description: {
    marginTop: 16,
    color: theme.colors.dark.muted,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  progress: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
    zIndex: 1,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dotActive: {
    width: 24,
    backgroundColor: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    zIndex: 1,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryLabel: {
    color: theme.colors.brandDark,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
  },
  secondaryButton: {
    flex: 0.42,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryLabel: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.semiBold,
    fontSize: 15,
  },
});
