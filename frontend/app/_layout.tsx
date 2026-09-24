import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { FavoritesProvider } from "../src/favorites";
import { AdsProvider } from "../src/ads/AdsProvider";
import { theme } from "../src/theme";

const client = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

function AppLoader() {
  return (
    <View style={styles.loaderShell}>
      <View style={styles.loaderBadge}>
        <Text style={styles.loaderGlyph}>G</Text>
      </View>
      <Text style={styles.loaderTitle}>GoTips</Text>
      <Text style={styles.loaderSubtitle}>Bringing better ideas to your day</Text>
      <ActivityIndicator size="small" color={theme.colors.brand} />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("gotips.onboardingSeen")
      .then((value) => setShowOnboarding(value !== "true"))
      .catch(() => setShowOnboarding(true));
  }, []);

  const textFontFamily = fontsLoaded ? theme.fonts.regular : "System";
  const inputFontFamily = fontsLoaded ? theme.fonts.regular : "System";

  if (!fontsLoaded && !fontError) {
    return <AppLoader />;
  }

  if (showOnboarding === null) {
    return <AppLoader />;
  }

  (Text as any).defaultProps = {
    ...((Text as any).defaultProps ?? {}),
    style: [{ fontFamily: textFontFamily }, (Text as any).defaultProps?.style],
  };
  (TextInput as any).defaultProps = {
    ...((TextInput as any).defaultProps ?? {}),
    style: [{ fontFamily: inputFontFamily }, (TextInput as any).defaultProps?.style],
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <FavoritesProvider>
          <AdsProvider>
            <StatusBar
              style="light"
              translucent={false}
              backgroundColor={theme.colors.brandDark}
            />
            <Stack
              initialRouteName={showOnboarding ? "onboarding" : "(tabs)"}
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.ink,
                headerTitleStyle: {
                  fontWeight: "800",
                  fontSize: 18,
                  color: theme.colors.ink,
                },
                contentStyle: {
                  backgroundColor: theme.colors.canvas,
                },
                headerShadowVisible: true,
              }}
            >
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="tip/[id]" options={{ title: "Tip" }} />
              <Stack.Screen
                name="category/[slug]"
                options={{ title: "Category" }}
              />
              <Stack.Screen name="search" options={{ title: "Search" }} />
              <Stack.Screen
                name="legal/[page]"
                options={{ title: "Privacy & legal" }}
              />
            </Stack>
          </AdsProvider>
        </FavoritesProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loaderShell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.canvas,
    paddingHorizontal: 32,
  },
  loaderBadge: {
    width: 94,
    height: 94,
    borderRadius: 28,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadow.card,
  },
  loaderGlyph: {
    color: "#FFFFFF",
    fontSize: 32,
    fontFamily: theme.fonts.bold,
  },
  loaderTitle: {
    marginTop: 20,
    color: theme.colors.ink,
    fontSize: 30,
    fontFamily: theme.fonts.bold,
  },
  loaderSubtitle: {
    marginTop: 8,
    marginBottom: 18,
    color: theme.colors.muted,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    textAlign: "center",
  },
});
