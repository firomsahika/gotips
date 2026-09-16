# GoTips

GoTips is an original, mobile-first knowledge app. The repository is deliberately split into two deployable applications:

- `frontend/` — Expo + React Native client
- `backend/` — Express + Prisma API

## Run locally

1. Copy `frontend/.env.example` to `frontend/.env` and `backend/.env.example` to `backend/.env`.
2. In `backend`, install packages, run `npx prisma generate`, then `npm run dev`.
3. In `frontend`, install packages and run `npx expo start`.

The frontend uses test ad unit IDs by default. Replace them only in a production build.
