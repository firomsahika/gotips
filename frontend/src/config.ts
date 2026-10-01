const production = process.env.EXPO_PUBLIC_ADS_MODE === "production";
const requiredProductionId = (name: string) => {
  const id = process.env[name];
  if (!id) throw new Error(`${name} must be set for a production build.`);
  return id;
};

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.0.2.2:5000/api/v1",
  interstitialFrequency: 3, // Shows every 3 tip views with cooldown
  ads: {
    bannerId: production
      ? requiredProductionId("EXPO_PUBLIC_ADMOB_BANNER_ID")
      : "ca-app-pub-3940256099942544/6300978111",
    interstitialId: production
      ? requiredProductionId("EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID")
      : "ca-app-pub-3940256099942544/1033173712",
    rewardedId: production
      ? requiredProductionId("EXPO_PUBLIC_ADMOB_REWARDED_ID")
      : "ca-app-pub-3940256099942544/5224354917",
  },
};

