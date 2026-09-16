import * as Linking from "expo-linking";
export function safeExternalUrl(url?: string) {
  return !!url && /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i.test(url);
}
export async function openExternal(url?: string) {
  if (safeExternalUrl(url)) await Linking.openURL(url);
}
export const privacyUrl = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL;
export const termsUrl = process.env.EXPO_PUBLIC_TERMS_URL;
