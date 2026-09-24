import { TestIds } from "react-native-google-mobile-ads";

const production = process.env.EXPO_PUBLIC_ADS_MODE === "production";

const requiredProductionId = (name: string) => {
  const id = process.env[name];
  if (!id) throw new Error(`${name} must be set for a production build.`);
  return id;
};

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.0.2.2:5000/api/v1",
  interstitialFrequency: 5,
  ads: {
    bannerId: production
      ? requiredProductionId("EXPO_PUBLIC_ADMOB_BANNER_ID")
      : TestIds.ADAPTIVE_BANNER,
    interstitialId: production
      ? requiredProductionId("EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID")
      : TestIds.INTERSTITIAL,
  },
};