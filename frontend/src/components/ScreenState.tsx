import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { theme } from "../../src/theme";


export function Loading() {
  return (
    <View style={{ padding: 32 }}>
      <ActivityIndicator color={theme.colors.brand} />
    </View>
  );
}
export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <View style={{ padding: 32, alignItems: "center", gap: 12 }}>
      <Text
        style={{ color: theme.colors.ink, fontWeight: "700", fontSize: 17 }}
      >
        Couldn’t load tips
      </Text>
      <Pressable
        onPress={retry}
        style={{
          backgroundColor: theme.colors.brand,
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Try again</Text>
      </Pressable>
    </View>
  );
}
