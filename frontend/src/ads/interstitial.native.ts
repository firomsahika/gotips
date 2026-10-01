import { useEffect, useRef } from "react";
import { AdEventType, useInterstitialAd } from "react-native-google-mobile-ads";
import { config } from "../config";

export function useInterstitialController(adsReady: boolean) {
  const openedTips = useRef(0);
  const lastShownTime = useRef(0);
  const { isLoaded, isClosed, load, show } = useInterstitialAd(config.ads.interstitialId, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    if (adsReady) {
      load();
    }
  }, [adsReady, load]);

  // Reload ad when previous one was closed
  useEffect(() => {
    if (isClosed && adsReady) {
      load();
    }
  }, [isClosed, adsReady, load]);

  return {
    showInterstitial: (force: boolean = false) => {
      openedTips.current += 1;
      const now = Date.now();
      const timeSinceLast = now - lastShownTime.current;

      // Minimum 35s cooldown between interstitials to avoid user annoyance & adhere to Google AdMob policy
      const cooldownPassed = timeSinceLast > 35_000;

      if ((openedTips.current >= config.interstitialFrequency || force) && isLoaded && cooldownPassed) {
        openedTips.current = 0;
        lastShownTime.current = now;
        try {
          show();
        } catch {
          // Graceful catch if display fails
        }
      }
    },
  };
}