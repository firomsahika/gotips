import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
const KEY = "gotips.favorite-ids";
const FavoritesContext = createContext<{
  ids: string[];
  toggle: (id: string) => Promise<void>;
  ready: boolean;
}>({ ids: [], toggle: async () => {}, ready: false });
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((value) => {
      setIds(value ? JSON.parse(value) : []);
      setReady(true);
    });
  }, []);
  const toggle = useCallback(
    async (id: string) =>
      setIds((current) => {
        const next = current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id];
        AsyncStorage.setItem(KEY, JSON.stringify(next));
        return next;
      }),
    [],
  );
  return (
    <FavoritesContext.Provider value={{ ids, toggle, ready }}>
      {children}
    </FavoritesContext.Provider>
  );
}
export const useFavorites = () => useContext(FavoritesContext);
