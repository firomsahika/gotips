import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/api";
import { TipCard } from "../src/components/TipCard";
import { theme } from "../src/theme";

export default function Search() {
  const [text, setText] = useState("");
  const q = useQuery({
    queryKey: ["search", text],
    queryFn: () => api.search(text),
    enabled: text.trim().length > 1,
  });

  return (
    <FlatList
      data={q.data ?? []}
      keyExtractor={(x) => x.id}
      renderItem={({ item }) => <TipCard tip={item} />}
      contentContainerStyle={s.page}
      ListHeaderComponent={
        <View style={s.searchWrap}>
          <View style={s.searchField}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.muted}
              style={s.searchIcon}
            />
            <TextInput
              autoFocus
              value={text}
              onChangeText={setText}
              placeholder="Search tips, tools and ideas"
              placeholderTextColor={theme.colors.muted}
              style={s.input}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          {text.length > 1 && (
            <Text style={s.count}>
              {q.isFetching ? "Searching…" : `${q.data?.length ?? 0} results`}
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        text.length > 1 && !q.isFetching ? (
          <Text style={s.empty}>No tips found. Try a different keyword.</Text>
        ) : null
      }
    />
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  searchWrap: { marginBottom: 16 },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 18,
    paddingHorizontal: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: theme.colors.ink,
  },
  count: {
    color: theme.colors.muted,
    marginTop: 14,
    fontWeight: "700",
    fontSize: 13,
  },
  empty: {
    color: theme.colors.muted,
    textAlign: "center",
    paddingTop: 52,
    fontSize: 15,
  },
});
