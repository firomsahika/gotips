import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import { theme } from "../../src/theme";
const text = {
  privacy: {
    title: "Privacy policy",
    body: "GoTips does not require an account and does not sell personal information. Saved-tip IDs are stored only on your device.\n\nGoTips uses Google Mobile Ads to show clearly labelled ads. Google and its advertising partners may process device and advertising data according to your consent choices and their policies. You can change available advertising privacy choices at any time from More.\n\nFor the full, current policy—including publisher contact, data retention, third parties, and regional rights—use the public policy link in the app store listing.",
  },
  terms: {
    title: "Terms of use",
    body: "GoTips provides short educational content for general information. It is not financial, medical, legal, or professional advice.\n\nUse external resources at your own discretion. GoTips only displays HTTPS links supplied by its publisher and does not control third-party websites.\n\nThe publisher may update the service or these terms. The complete current terms are published at the app store listing link.",
  },
  about: {
    title: "About GoTips",
    body: "GoTips helps you discover practical technology, work, career, and learning ideas in a few focused minutes.\n\nThis version has no user accounts. Your saved tips stay on your device. Content is fetched from the GoTips publisher API.",
  },
} as const;
export default function Legal() {
  const { page } = useLocalSearchParams<{ page: keyof typeof text }>();
  const entry = text[page] ?? text.about;
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.title}>{entry.title}</Text>
      <Text style={s.body}>{entry.body}</Text>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  page: { padding: 22 },
  title: {
    fontSize: 29,
    fontWeight: "900",
    color: theme.colors.ink,
    marginTop: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
    color: theme.colors.ink,
    marginTop: 20,
  },
});
