# GoTips store submission checklist

Do not submit until every box is complete. A build that contains a placeholder policy, broken link, test ad, sample app identifier, or empty content is not release-ready.

## Release configuration

- [ ] Register the final bundle identifiers. If `com.gotips.app` is unavailable, choose unique identifiers **before** any production release.
- [ ] In `frontend/.env` / EAS production variables, set real AdMob Android and iOS **app** IDs, banner and interstitial unit IDs, the production API URL, `EAS_PROJECT_ID`, and public HTTPS privacy/terms URLs.
- [ ] Set a real publisher/support email and legal entity in `backend/public/privacy.html` and `backend/public/terms.html`, then deploy them on HTTPS. Set `EXPO_PUBLIC_PRIVACY_POLICY_URL` and `EXPO_PUBLIC_TERMS_URL` to those exact URLs.
- [ ] Use `EXPO_PUBLIC_ADS_MODE=production` only for the store build. Check the test build shows Google test ads only.
- [ ] Configure UMP GDPR/EEA and IDFA/ATT messages in AdMob **Privacy & messaging**. Test consent, decline, and privacy-options paths on a physical device.
- [ ] Do not add ad overlays, “support us by clicking” language, or forced/repeated interstitials. Keep interstitial frequency conservative and let users close/skip them.
- [ ] Confirm every external content link is HTTPS, accurate, and has a purpose. Do not ship placeholders or dead links.

## Content and review quality

- [ ] Seed at least 20–30 original, reviewed tips before sending to review; every item should have a title, excerpt, full content, category, and valid publication date.
- [ ] Confirm content is not copied/scraped and that any external material is properly licensed or linked with permission.
- [ ] Test offline/error states, API downtime, slow connections, small phones, tablets, dark-mode system setting, and orientation lock.
- [ ] Take store screenshots from the actual production-quality app; do not use Mango Tips imagery or branding.
- [ ] Give Apple/Google reviewers an active, no-login test build. In review notes: “No account is required. Ads are optional and content remains available when ads cannot load.”

## Apple App Store Connect

- [ ] Create the App Store Connect record, upload a TestFlight build, and complete all metadata (subtitle, description, keywords, category, age rating, support URL, marketing URL if used).
- [ ] Enter the live HTTPS privacy-policy URL in App Store Connect **and** ensure the in-app policy is accessible.
- [ ] Complete App Privacy / Nutrition Label based on the actual Google Mobile Ads SDK and any analytics SDKs—not only GoTips code. Declare tracking only when applicable.
- [ ] Verify the ATT message matches the actual tracking behavior and appears before personalized-ad use.
- [ ] Submit final app assets, support URL, and functional metadata. Apple rejects temporary text, empty sites, and apps that primarily act as content aggregators or ad containers.

## Google Play Console

- [ ] Use an Android App Bundle (`.aab`) and enroll in Play App Signing.
- [ ] Complete App content: Ads = yes, target audience, content rating, Data safety, privacy policy, and any required declarations.
- [ ] Data Safety must include SDK-collected/shared data (including Google Mobile Ads), not merely app-owned data.
- [ ] By 31 August 2026, new submissions must target Android 16 / API 36; this project pins target API 36 in Expo build properties.
- [ ] Start with internal testing, then closed testing, then production after policy checks pass.

## Commands

```bash
cd frontend
npx eas login
npx eas init
npx eas build --platform all --profile preview
npx eas build --platform all --profile production
npx eas submit --platform android --profile production
npx eas submit --platform ios --profile production
```

`eas submit` uploads the build; Apple TestFlight/App Review and Google Play release setup are still completed in their respective consoles.
