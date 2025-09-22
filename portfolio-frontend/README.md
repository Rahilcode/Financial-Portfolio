# Portfolio Frontend (Next.js App Router)

## Setup

1. Copy `.env.local` with `NEXT_PUBLIC_API_URL` pointing to your backend (include /api).
2. Install deps: `npm install`
3. Run dev: `npm run dev` (open http://localhost:3000)

## Build

`npm run build` then `npm run start`

## Deploy

Deploy to Vercel: set `NEXT_PUBLIC_API_URL` env variable in project settings.

## Notes

- Frontend expects backend REST endpoints:
  - POST `${API}/auth/login` -> { token }
  - GET `${API}/portfolios` -> list portfolios
  - POST `${API}/portfolios/:id/assets` -> add asset
  - DELETE `${API}/portfolios/:id/assets/:assetId` -> delete
  - GET `${API}/market-data/:portfolioId/assets/:ticker/history?days=30` -> historical
