import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
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
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
    ...Ionicons.font,
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (fontError) {
      console.warn("Font loading error:", fontError);
    }
  }, [fontError]);

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

  // Safe global default font handling across web and modern React Native
  (Text as any).defaultProps = {
    ...((Text as any).defaultProps ?? {}),
    style: [{ fontFamily: textFontFamily }, (Text as any).defaultProps?.style],
  };
  (TextInput as any).defaultProps = {
    ...((TextInput as any).defaultProps ?? {}),
    style: [{ fontFamily: inputFontFamily }, (TextInput as any).defaultProps?.style],
  };

  if (typeof (Text as any).render === "function" && !(Text as any).__gotipsFontPatched) {
    (Text as any).__gotipsFontPatched = true;
    const origRender = (Text as any).render;
    (Text as any).render = function (props: any, ref: any) {
      const flattened = StyleSheet.flatten(props?.style);
      if (!flattened?.fontFamily) {
        return origRender.call(
          this,
          {
            ...props,
            style: [{ fontFamily: textFontFamily }, props?.style],
          },
          ref
        );
      }
      return origRender.call(this, props, ref);
    };
  }

  if (typeof (TextInput as any).render === "function" && !(TextInput as any).__gotipsFontPatched) {
    (TextInput as any).__gotipsFontPatched = true;
    const origInputRender = (TextInput as any).render;
    (TextInput as any).render = function (props: any, ref: any) {
      const flattened = StyleSheet.flatten(props?.style);
      if (!flattened?.fontFamily) {
        return origInputRender.call(
          this,
          {
            ...props,
            style: [{ fontFamily: inputFontFamily }, props?.style],
          },
          ref
        );
      }
      return origInputRender.call(this, props, ref);
    };
  }

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
                  fontFamily: theme.fonts.bold,
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
