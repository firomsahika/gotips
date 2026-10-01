# GoTips

GoTips is a production-grade, SaaS-style mobile knowledge application built with Expo / React Native and an Express + Prisma backend, inspired by daily insight apps like MangoTips.

## Key Features & SaaS UX
- **Daily Drop & Streak Engine**: Tracks daily visits and habit streaks (`🔥 3d streak`) to drive long-term retention.
- **Interactive Audio Briefs**: Simulated 60s audio player with real-time playback bar for busy commuters.
- **2-Minute Action Checklist**: Action step on each tip with interactive completion checkmark and haptic feedback.
- **Curated Topics & Category Pills**: Quick horizontal carousel filter on Home plus rich gradient category cards with tip count metrics.
- **Vault & Mastered Library**: Segmented shelf to revisit bookmarked tips and track applied knowledge.
- **Reading Preferences**: Live typography toggle (`A-` / `A+`) and push reminder preferences.

## Google Mobile Ads Architecture
- **In-Feed Adaptive Banners (`InFeedAd`)**: Strategically positioned between tips (every 3rd or 4th tip in Home, Categories, Search, and Vault) with distinct policy-compliant `SPONSORED` labeling.
- **Interstitial Ads with Smart Cooldown**: Auto-loaded in background; triggers between tip navigation with a 35-second cooldown timer to prevent ad spam and comply with Google AdMob policies.
- **Rewarded Video Ads (`useShowRewarded`)**: Unlocks exclusive **VIP / Pro Strategy Masterclasses**, boosting CPM rates ($20–$40+ eCPM) while giving users premium value.
- **In-Content Detail Banners**: Embedded before related tips.
- **Web & Simulator Mocking**: In dev or web mode, high-fidelity mock ad cards display with zero layout shifts.

## Running Locally

1. Copy `frontend/.env.example` to `frontend/.env` and `backend/.env.example` to `backend/.env`.
2. In `backend`:
   ```bash
   npm install
   npx prisma generate
   npm run dev
   ```
3. In `frontend`:
   ```bash
   npm install
   npx expo start
   ```
4. For physical device testing, set `EXPO_PUBLIC_API_BASE_URL` in `frontend/.env` to your local LAN IP (e.g. `http://192.168.1.X:5000/api/v1`).

