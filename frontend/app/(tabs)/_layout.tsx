import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Animated, StyleSheet, View } from "react-native";
import { theme } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.semiBold,
          marginTop: 4,
        },
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: "rgba(255,255,255,0.72)",
          borderTopWidth: 0,
          borderTopColor: "transparent",
          shadowColor: "#102A56",
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -8 },
          elevation: 10,
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 10,
          borderRadius: 24,
          overflow: "hidden",
        },
        tabBarBackground: () => <View style={styles.tabBackground} />,
        tabBarItemStyle: {
          paddingVertical: 5,
          borderRadius: 16,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarIcon: ({ color, focused }) => {
          const names = {
            index: focused ? "home" : "home-outline",
            categories: focused ? "grid" : "grid-outline",
            favorites: focused ? "heart" : "heart-outline",
            more: focused ? "menu" : "menu-outline",
          } as const;

          return (
            <Animated.View
              style={[
                styles.iconShell,
                focused && styles.iconShellActive,
                focused && { transform: [{ scale: 1.04 }] },
              ]}
            >
              <Ionicons
                name={names[route.name as keyof typeof names]}
                size={22}
                color={focused ? theme.colors.brand : color}
              />
            </Animated.View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Discover" }} />
      <Tabs.Screen name="categories" options={{ title: "Categories" }} />
      <Tabs.Screen name="favorites" options={{ title: "Saved" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  iconShell: {
    width: 42,
    height: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconShellActive: {
    backgroundColor: "rgba(36,107,222,0.12)",
    width: 52,
    height: 36,
    borderRadius: 14,
  },
});
