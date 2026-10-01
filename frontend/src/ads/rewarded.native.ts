import { useEffect, useRef, useState } from "react";
import { useRewardedAd } from "react-native-google-mobile-ads";
import { config } from "../config";

export function useRewardedController(adsReady: boolean) {
  const onRewardCallback = useRef<(() => void) | null>(null);
  const [earned, setEarned] = useState(false);

  const { isLoaded, isClosed, isEarnedReward, load, show } = useRewardedAd(
    config.ads.rewardedId,
    {
      requestNonPersonalizedAdsOnly: true,
    }
  );

  // Initial load
  useEffect(() => {
    if (adsReady) {
      load();
    }
  }, [adsReady, load]);

  // Handle reward granted
  useEffect(() => {
    if (isEarnedReward) {
      setEarned(true);
      if (onRewardCallback.current) {
        onRewardCallback.current();
        onRewardCallback.current = null;
      }
    }
  }, [isEarnedReward]);

  // Reload ad after closure
  useEffect(() => {
    if (isClosed && adsReady) {
      setEarned(false);
      load();
    }
  }, [isClosed, adsReady, load]);

  return {
    isRewardedLoaded: isLoaded,
    showRewarded: (onReward: () => void) => {
      onRewardCallback.current = onReward;
      if (isLoaded) {
        try {
          show();
        } catch {
          // If ad presentation fails, don't lock the user out
          onReward();
        }
      } else {
        // Fallback if ad is still loading or unavailable
        onReward();
      }
    },
  };
}
