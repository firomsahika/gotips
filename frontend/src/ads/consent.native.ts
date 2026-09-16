import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";

let started = false;

/** Refreshes UMP consent each launch and starts ads only when the SDK allows it. */
export async function prepareAds(): Promise<boolean> {
  if (started) return true;
  try {
    const initial = await AdsConsent.requestInfoUpdate();
    if (!initial.canRequestAds) {
      const updated = await AdsConsent.loadAndShowConsentFormIfRequired();
      if (!updated.canRequestAds) return false;
    }
    await mobileAds().initialize();
    started = true;
    return true;
  } catch {
    // Ads are optional; content must remain usable if consent services are unavailable.
    return false;
  }
}

export async function openPrivacyChoices() {
  await AdsConsent.showPrivacyOptionsForm();
}