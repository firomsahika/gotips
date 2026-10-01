import { createContext, useContext, useEffect, useState } from "react";
import { prepareAds } from "./consent";
import { useInterstitialController } from "./interstitial";
import { useRewardedController } from "./rewarded";

type AdsContextType = {
  ready: boolean;
  showInterstitial: (force?: boolean) => void;
  showRewarded: (onReward: () => void) => void;
  isRewardedLoaded: boolean;
};

const AdsContext = createContext<AdsContextType>({
  ready: false,
  showInterstitial: () => undefined,
  showRewarded: (onReward) => onReward(),
  isRewardedLoaded: false,
});

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const { showInterstitial } = useInterstitialController(ready);
  const { showRewarded, isRewardedLoaded } = useRewardedController(ready);

  useEffect(() => {
    prepareAds().then(setReady);
  }, []);

  return (
    <AdsContext.Provider value={{ ready, showInterstitial, showRewarded, isRewardedLoaded }}>
      {children}
    </AdsContext.Provider>
  );
}

export const useAdsReady = () => useContext(AdsContext).ready;
export const useShowInterstitial = () => useContext(AdsContext).showInterstitial;
export const useShowRewarded = () => useContext(AdsContext).showRewarded;
export const useIsRewardedLoaded = () => useContext(AdsContext).isRewardedLoaded;

