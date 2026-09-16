import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { theme } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand,
        tabBarStyle: { height: 66, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={
              (
                {
                  index: "home-outline",
                  categories: "grid-outline",
                  favorites: "heart-outline",
                  more: "ellipsis-horizontal-circle-outline",
                } as Record<string, any>
              )[route.name]
            }
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Discover" }} />
      <Tabs.Screen name="categories" options={{ title: "Categories" }} />
      <Tabs.Screen name="favorites" options={{ title: "Saved" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}
