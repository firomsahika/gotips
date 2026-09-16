import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { openPrivacyChoices } from "../../src/ads/consent";
import { theme } from "../../src/theme";

const rows: Array<[string, string, () => void]> = [
  ["bookmarks-outline", "Saved tips",
     () => router.push("/(tabs)/favorites")],
  [
    "information-circle-outline",
    "About GoTips",
    () => router.push("/legal/about"),
  ],
  [
    "shield-checkmark-outline",
    "Privacy policy",
    () => router.push("/legal/privacy"),
  ],
  ["document-text-outline", "Terms of use", () => router.push("/legal/terms")],
  ["options-outline", "Privacy choices", () => openPrivacyChoices()],
];
export default function More() {
  return (
    <View style={s.page}>
      <View style={s.hero}>
        <View style={s.mark}>
          <Ionicons name="sparkles" size={26} color="white" />
        </View>
        <Text style={s.title}>GoTips</Text>
        <Text style={s.copy}>Small ideas. Meaningful momentum.</Text>
      </View>
      {rows.map(([icon, label, onPress]) => (
        <Pressable
          key={label as string}
          style={s.row}
          onPress={onPress as () => void}
        >
          <Ionicons name={icon as any} size={22} color={theme.colors.ink} />
          <Text style={s.label}>{label}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.muted}
          />
        </Pressable>
      ))}
      <Text style={s.version}>Version 1.0.0</Text>
    </View>
  );
}
const s = StyleSheet.create({
  page: { padding: 20, paddingTop: 50 },
  hero: { paddingBottom: 28 },
  mark: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.ink,
    marginTop: 15,
  },
  copy: { color: theme.colors.muted, marginTop: 4 },
  row: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderColor: theme.colors.line,
  },
  label: { fontSize: 16, fontWeight: "700", flex: 1, color: theme.colors.ink },
  version: {
    textAlign: "center",
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 28,
  },
});
