import { useEffect, useRef } from "react";
import { useInterstitialAd } from "react-native-google-mobile-ads";
import { config } from "../config";

export function useInterstitialController(adsReady: boolean) {
  const openedTips = useRef(0);
  const { isLoaded, load, show } = useInterstitialAd(config.ads.interstitialId, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    if (adsReady) load();
  }, [adsReady, load]);

  return {
    showInterstitial: () => {
      openedTips.current += 1;
      if (openedTips.current < config.interstitialFrequency || !isLoaded) return;

      openedTips.current = 0;
      show();
    },
  };
}