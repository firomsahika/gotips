import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../src/api";
import { InFeedAd } from "../src/components/ads/InFeedAd";
import { TipCard } from "../src/components/TipCard";
import { theme } from "../src/theme";

const popularQueries = [
  "AI",
  "Productivity",
  "Shortcut",
  "Focus",
  "Decision",
  "Feedback",
  "Career",
  "Business",
];

export default function Search() {
  const [text, setText] = useState("");
  const q = useQuery({
    queryKey: ["search", text],
    queryFn: () => api.search(text),
    enabled: text.trim().length > 1,
  });

  const tips = q.data ?? [];

  return (
    <FlatList
      data={tips}
      keyExtractor={(x) => x.id}
      renderItem={({ item, index }) => (
        <View key={item.id}>
          {index > 0 && index % 4 === 0 && <InFeedAd />}
          <TipCard tip={item} />
        </View>
      )}
      contentContainerStyle={s.page}
      ListHeaderComponent={
        <View style={s.searchWrap}>
          {/* Input field */}
          <View style={s.searchField}>
            <Ionicons
              name="search"
              size={19}
              color={theme.colors.muted}
              style={s.searchIcon}
            />
            <TextInput
              autoFocus
              value={text}
              onChangeText={setText}
              placeholder="Search tips, topics & frameworks"
              placeholderTextColor={theme.colors.muted}
              style={s.input}
              returnKeyType="search"
            />
            {text.length > 0 && (
              <Pressable onPress={() => setText("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={theme.colors.muted} />
              </Pressable>
            )}
          </View>

          {/* Popular searches suggestions */}
          <View style={s.suggestionsWrap}>
            <Text style={s.suggestionLabel}>TRENDING TOPICS</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.suggestionRow}
            >
              {popularQueries.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setText(item)}
                  style={[s.chip, text.toLowerCase() === item.toLowerCase() && s.chipActive]}
                >
                  <Text style={[s.chipText, text.toLowerCase() === item.toLowerCase() && s.chipTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Results count banner */}
          {text.length > 1 && (
            <View style={s.countRow}>
              <Text style={s.count}>
                {q.isFetching ? "Searching insights…" : `${tips.length} tips found for "${text}"`}
              </Text>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        text.length > 1 && !q.isFetching ? (
          <View style={s.empty}>
            <Ionicons name="search-outline" size={40} color={theme.colors.muted} />
            <Text style={s.emptyTitle}>No matching tips found</Text>
            <Text style={s.emptySubtitle}>
              Try searching with broader terms like &quot;productivity&quot;, &quot;meeting&quot;, or &quot;AI&quot;.
            </Text>
          </View>
        ) : null
      }
    />
  );
}

const s = StyleSheet.create({
  page: { paddingBottom: 60, backgroundColor: theme.colors.canvas },
  searchWrap: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 54,
    ...theme.shadow.card,
  },
  searchIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  suggestionsWrap: {
    marginTop: 16,
  },
  suggestionLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    letterSpacing: 1,
    color: theme.colors.muted,
    marginBottom: 8,
  },
  suggestionRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: theme.colors.brand,
    borderColor: theme.colors.brand,
  },
  chipText: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.inkLight,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  countRow: {
    marginTop: 14,
    marginBottom: 4,
  },
  count: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.semiBold,
    fontSize: 12,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.muted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});
