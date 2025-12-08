## 90DaysAJ Backend – Plan & Notes

### What’s here
- Node/Express/TypeScript API scaffolding with Prisma.
- Auth, file upload, user routes, email/image/S3 helpers, rate limiting, error handling.

### Alignment with frontend schedule
- Focused Implementation (build) block: Mon–Fri 8:00am–10:00am (primary backend build window).
- Deep Learning (study) block: Mon–Fri 10:00am–12:00pm (backend study window).
- Sync with frontend: APIs follow the current frontend features; mobile consumes these APIs.
- Saturday reserved for WordPress; backend can remain idle or handle maintenance.

### Progress & handoff
- Keep API changes small and coherent with the day’s frontend feature.
- Preserve DB migrations in `prisma/migrations`.
- No secrets in git; use `.env` locally and in Vercel/hosted env vars.

### Run locally
- From this folder: `npm install` then `npm run dev` (or `npm run build && npm start`).
- Requires a database URL in `.env` for Prisma.

