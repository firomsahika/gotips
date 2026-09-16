import { createContext, useContext, useEffect, useState } from "react";
import { prepareAds } from "./consent";
import { useInterstitialController } from "./interstitial";

const AdsContext = createContext({
  ready: false,
  showInterstitial: () => undefined,
});

export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const { showInterstitial } = useInterstitialController(ready);
  useEffect(() => {
    prepareAds().then(setReady);
  }, []);
  return (
    <AdsContext.Provider value={{ ready, showInterstitial }}>
      {children}
    </AdsContext.Provider>
  );
}
export const useAdsReady = () => useContext(AdsContext).ready;
export const useShowInterstitial = () => useContext(AdsContext).showInterstitial;
