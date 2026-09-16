import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FavoritesProvider } from "../src/favorites";
import { AdsProvider } from "../src/ads/AdsProvider";

const client = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});
export default function RootLayout() {
  return (
    <QueryClientProvider client={client}>
      <FavoritesProvider>
        <AdsProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerTitleStyle: { fontWeight: "800" },
            }}
          >
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
  );
}
