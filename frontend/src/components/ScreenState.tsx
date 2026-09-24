import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../src/theme";

export function Loading() {
  return (
    <View style={styles.shell}>
      <View style={styles.card}>
        <ActivityIndicator size="small" color={theme.colors.brand} />
        <Text style={styles.title}>Loading ideas</Text>
        <Text style={styles.subtitle}>Preparing the latest tips for you.</Text>
      </View>
    </View>
  );
}

export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <View style={styles.shell}>
      <View style={styles.card}>
        <Text style={styles.title}>Couldn’t load tips</Text>
        <Text style={styles.subtitle}>Please check your connection and try again.</Text>
        <Pressable onPress={retry} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.canvas,
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    ...theme.shadow.soft,
  },
  title: {
    marginTop: 14,
    color: theme.colors.ink,
    fontSize: 20,
    fontFamily: theme.fonts.bold,
  },
  subtitle: {
    marginTop: 8,
    color: theme.colors.muted,
    fontSize: 14,
    textAlign: "center",
    fontFamily: theme.fonts.regular,
  },
  button: {
    marginTop: 18,
    backgroundColor: theme.colors.brand,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
  },
});
