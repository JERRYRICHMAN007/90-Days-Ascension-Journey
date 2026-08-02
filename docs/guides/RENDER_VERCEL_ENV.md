# Render + Vercel env setup (Aether)

Frontend: https://aether-beta-indol.vercel.app

## Password special characters

If your DB password contains `@`, encode it as `%40` in `DATABASE_URL`.

Example: password `@jjrRichman007` → `%40jjrRichman007`

## Render — paste each key in Environment

| Key | Notes |
|-----|--------|
| `SUPABASE_URL` | Project URL from Supabase API settings |
| `SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (secret) |
| `DATABASE_URL` | **Session pooler** URI with encoded password |
| `JWT_ACCESS_SECRET` | Random string you generate (not from Supabase) |
| `JWT_REFRESH_SECRET` | Different random string |
| `FRONTEND_URL` | `https://aether-beta-indol.vercel.app` |
| `APP_URL` | `https://aether-beta-indol.vercel.app` |
| `ALLOWED_ORIGINS` | `https://aether-beta-indol.vercel.app` |

Do **not** set `NODE_ENV=production` on Render.

After save → Manual Deploy. Test: `https://YOUR-RENDER-APP.onrender.com/health`

## Vercel — one variable

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | `https://YOUR-RENDER-APP.onrender.com/v1` |

Redeploy Vercel after saving.

## Supabase Auth URLs

Site URL: `https://aether-beta-indol.vercel.app`

Redirect URLs:
- `https://aether-beta-indol.vercel.app/**`
- `http://localhost:5174/**`
