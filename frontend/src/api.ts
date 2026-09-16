import { config } from "./config";
import type { Category, HomeData, Tip } from "./types";

type Envelope<T> = { success: boolean; data: T; message?: string };
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${config.apiUrl}${path}`);
  if (!response.ok)
    throw new Error(
      "Couldn’t load GoTips. Check your connection and try again.",
    );
  return ((await response.json()) as Envelope<T>).data;
}

export const api = {
  home: () => get<HomeData>("/home"),
  categories: () => get<Category[]>("/categories"),
  categoryTips: (slug: string) => get<Tip[]>(`/categories/${slug}/tips`),
  tip: (id: string) => get<Tip>(`/tips/${id}`),
  related: (id: string) => get<Tip[]>(`/tips/${id}/related`),
  search: (q: string) => get<Tip[]>(`/tips/search?q=${encodeURIComponent(q)}`),
};
