import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput } from "react-native";
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
        <>
          <TextInput
            autoFocus
            value={text}
            onChangeText={setText}
            placeholder="Search AI, work, tools…"
            style={s.input}
          />
          {text.length > 1 && (
            <Text style={s.count}>
              {q.isFetching ? "Searching…" : `${q.data?.length ?? 0} results`}
            </Text>
          )}
        </>
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
  page: { padding: 20 },
  input: {
    backgroundColor: theme.colors.sky,
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
    color: theme.colors.ink,
  },
  count: { color: theme.colors.muted, marginTop: 18, fontWeight: "700" },
  empty: { color: theme.colors.muted, textAlign: "center", paddingTop: 55 },
});
