import type { ConfigContext, ExpoConfig } from "expo/config";

const isProduction = process.env.EAS_BUILD_PROFILE === "production";

const value = (name: string, fallback: string) => {
  const configured = process.env[name];
  if (isProduction && !configured)
    throw new Error(`${name} must be set for a production build.`);
  return configured ?? fallback;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "GoTips",
  slug: "gotips",
  scheme: "gotips",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    bundleIdentifier: "com.gotips.app",
    buildNumber: "1",
    supportsTablet: true,
    infoPlist: {
      NSUserTrackingUsageDescription:
        "GoTips requests permission to deliver and measure relevant advertising. You can still use every GoTips feature if you decline.",
    },
  },
  android: {
    package: "com.gotips.app",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#1769E0",
    },
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          kotlinVersion: "1.9.25",
        },
        ios: { deploymentTarget: "15.1" },
      },
    ],
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: value(
          "ADMOB_ANDROID_APP_ID",
          "ca-app-pub-3940256099942544~3347511713",
        ),
        iosAppId: value(
          "ADMOB_IOS_APP_ID",
          "ca-app-pub-3940256099942544~1458002511",
        ),
      },
    ],
  ],
  experiments: { typedRoutes: true },
  extra: {
    eas: { projectId: "1271aeae-d0bd-4d3d-8d60-d90967724734" },
  },
});
