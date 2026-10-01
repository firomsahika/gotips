import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STREAK_KEY = "gotips.streak.data";
const MASTERED_KEY = "gotips.tips.mastered";
const UNLOCKED_PRO_KEY = "gotips.tips.unlocked_pro";
const READ_COUNT_KEY = "gotips.tips.read_count";
const SETTINGS_KEY = "gotips.settings.preferences";

export type HabitData = {
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  readCount: number;
  masteredIds: string[];
  unlockedProIds: string[];
  fontSize: "normal" | "large";
  dailyReminder: boolean;
};

const getTodayString = () => new Date().toISOString().split("T")[0];

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

export function useHabit() {
  const [data, setData] = useState<HabitData>({
    streak: 1,
    lastActiveDate: getTodayString(),
    readCount: 0,
    masteredIds: [],
    unlockedProIds: [],
    fontSize: "normal",
    dailyReminder: true,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [streakRaw, masteredRaw, unlockedRaw, readRaw, settingsRaw] =
          await Promise.all([
            AsyncStorage.getItem(STREAK_KEY),
            AsyncStorage.getItem(MASTERED_KEY),
            AsyncStorage.getItem(UNLOCKED_PRO_KEY),
            AsyncStorage.getItem(READ_COUNT_KEY),
            AsyncStorage.getItem(SETTINGS_KEY),
          ]);

        const today = getTodayString();
        const yesterday = getYesterdayString();

        let streak = 1;
        let lastDate = today;

        if (streakRaw) {
          const parsed = JSON.parse(streakRaw);
          if (parsed.lastActiveDate === today) {
            streak = parsed.streak;
            lastDate = today;
          } else if (parsed.lastActiveDate === yesterday) {
            streak = parsed.streak + 1;
            lastDate = today;
            await AsyncStorage.setItem(
              STREAK_KEY,
              JSON.stringify({ streak, lastActiveDate: today })
            );
          } else {
            // Missed a day, reset streak to 1
            streak = 1;
            lastDate = today;
            await AsyncStorage.setItem(
              STREAK_KEY,
              JSON.stringify({ streak, lastActiveDate: today })
            );
          }
        } else {
          await AsyncStorage.setItem(
            STREAK_KEY,
            JSON.stringify({ streak: 1, lastActiveDate: today })
          );
        }

        const masteredIds = masteredRaw ? JSON.parse(masteredRaw) : [];
        const unlockedProIds = unlockedRaw ? JSON.parse(unlockedRaw) : [];
        const readCount = readRaw ? parseInt(readRaw, 10) : 0;
        const settings = settingsRaw
          ? JSON.parse(settingsRaw)
          : { fontSize: "normal", dailyReminder: true };

        setData({
          streak,
          lastActiveDate: lastDate,
          readCount,
          masteredIds,
          unlockedProIds,
          fontSize: settings.fontSize ?? "normal",
          dailyReminder: settings.dailyReminder ?? true,
        });
      } catch {
        // Fallback gracefully
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const markTipRead = async (_id: string) => {
    setData((prev) => {
      const nextCount = prev.readCount + 1;
      AsyncStorage.setItem(READ_COUNT_KEY, nextCount.toString()).catch(() => {});
      return { ...prev, readCount: nextCount };
    });
  };

  const toggleMastered = async (id: string) => {
    setData((prev) => {
      const exists = prev.masteredIds.includes(id);
      const nextIds = exists
        ? prev.masteredIds.filter((x) => x !== id)
        : [...prev.masteredIds, id];
      AsyncStorage.setItem(MASTERED_KEY, JSON.stringify(nextIds)).catch(() => {});
      return { ...prev, masteredIds: nextIds };
    });
  };

  const unlockProTip = async (id: string) => {
    setData((prev) => {
      if (prev.unlockedProIds.includes(id)) return prev;
      const nextIds = [...prev.unlockedProIds, id];
      AsyncStorage.setItem(UNLOCKED_PRO_KEY, JSON.stringify(nextIds)).catch(() => {});
      return { ...prev, unlockedProIds: nextIds };
    });
  };

  const setFontSize = async (fontSize: "normal" | "large") => {
    setData((prev) => {
      const next = { ...prev, fontSize };
      AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ fontSize, dailyReminder: prev.dailyReminder })
      ).catch(() => {});
      return next;
    });
  };

  const toggleDailyReminder = async () => {
    setData((prev) => {
      const dailyReminder = !prev.dailyReminder;
      const next = { ...prev, dailyReminder };
      AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ fontSize: prev.fontSize, dailyReminder })
      ).catch(() => {});
      return next;
    });
  };

  return {
    loaded,
    habit: data,
    markTipRead,
    toggleMastered,
    unlockProTip,
    setFontSize,
    toggleDailyReminder,
  };
}
