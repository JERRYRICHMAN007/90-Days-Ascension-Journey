# Aether

One unified app: React UI + Express API.

## Project structure

```
Aether/
├── package.json       # Root — run everything from here
├── client/            # React + Vite (UI)
├── server/            # Express + Prisma (API)
├── docs/              # Guides, project notes, Aether OS V2 specs
└── README.md
```

## Quick start (one command)

From the **project root** (not inside `client` or `server`):

```bash
npm install
cp client/.env.example client/.env.local
cp server/.env.example server/.env
# Edit server/.env (database, JWT, Supabase, etc.)

npm run dev
```

This starts:

| Service | URL |
|---------|-----|
| **Web app** | http://127.0.0.1:5174 |
| **API** | http://127.0.0.1:5001/v1 |

The UI talks to the API through Vite’s proxy (`/v1` → port 5001), so you use **one browser URL** for development.

## Production (single server)

Build both, then run the API — it also serves the React build:

```bash
npm run build
cd server
set NODE_ENV=production
npm start
```

Open http://localhost:5001 — UI and API on the **same port**.

## Scripts (root)

| Command | What it does |
|---------|----------------|
| `npm run dev` | API + web together |
| `npm run dev:client` | Web only |
| `npm run dev:server` | API only |
| `npm run build` | Build client, then compile server |
| `npm start` | Run API (set `NODE_ENV=production` to serve UI) |

## Separate hosting (optional)

You can still deploy UI (Vercel) and API (Railway) separately. Set `VITE_API_BASE_URL=https://your-api.com/v1` when building the client.

## Documentation

- [Docs index](./docs/README.md)
- [Environment setup](./docs/guides/ENVIRONMENT_SETUP.md)
- [Client README](./client/README.md)
- [Server README](./server/README.md)
