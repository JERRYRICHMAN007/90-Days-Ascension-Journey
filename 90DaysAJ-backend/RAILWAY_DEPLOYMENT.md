# Railway Deployment Guide

## Quick Start

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub
- Authorize Railway to access your repositories

### 2. Deploy Backend

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Railway will auto-detect Node.js

### 3. Configure Root Directory

If deploying from monorepo:
1. Go to **Settings** → **Root Directory**
2. Set to: `90DaysAJ-backend`

### 4. Set Environment Variables

Go to **Variables** tab and add:

```env
# Database (from Supabase)
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT-ID.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&sslmode=require

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=5001
HOST=0.0.0.0
NODE_ENV=production

# JWT Secrets (from your local .env file)
JWT_ACCESS_SECRET=your-64-char-secret
JWT_REFRESH_SECRET=your-64-char-secret

# Frontend URL (your Vercel deployment URL)
APP_URL=https://your-frontend-app.vercel.app
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### 5. Configure Build Settings

Go to **Settings** → **Build**:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 6. Get Your Backend URL

After deployment:
1. Go to **Settings** → **Networking**
2. Copy the **Public Domain** URL
3. It will look like: `https://your-app-name.up.railway.app`

### 7. Update Frontend

In Vercel, add environment variable:
```
VITE_API_BASE_URL=https://your-app-name.up.railway.app/v1
```

Then redeploy frontend.

## Troubleshooting

### Build Fails

**Error**: `Cannot find module`
- **Solution**: Ensure `Root Directory` is set to `90DaysAJ-backend`

**Error**: `prisma generate` fails
- **Solution**: Check `DATABASE_URL` is set correctly

### Backend Won't Start

**Error**: `Port already in use`
- **Solution**: Railway handles ports automatically, remove `PORT` from env vars or set to `5001`

**Error**: `Database connection failed`
- **Solution**: 
  - Verify `DATABASE_URL` is correct
  - Check Supabase allows connections from Railway IP
  - Ensure `sslmode=require` in connection string

### CORS Errors

**Error**: `Access-Control-Allow-Origin`
- **Solution**: 
  - Verify `APP_URL` matches your frontend URL exactly
  - Ensure both use HTTPS
  - Check no trailing slashes

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | Supabase PostgreSQL URL | `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres?sslmode=require` |
| `SUPABASE_URL` | ✅ | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key | `eyJhbGc...` |
| `PORT` | ❌ | Server port (default: 5001) | `5001` |
| `HOST` | ❌ | Server host (default: 0.0.0.0) | `0.0.0.0` |
| `NODE_ENV` | ✅ | Environment | `production` |
| `JWT_ACCESS_SECRET` | ✅ | JWT access secret | `64+ char random string` |
| `JWT_REFRESH_SECRET` | ✅ | JWT refresh secret | `64+ char random string` |
| `APP_URL` | ✅ | Frontend URL | `https://your-app.vercel.app` |
| `FRONTEND_URL` | ✅ | Frontend URL | `https://your-app.vercel.app` |

## Testing Deployment

1. **Health Check**:
   ```
   curl https://your-app-name.up.railway.app/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Supabase Connection**:
   ```
   curl https://your-app-name.up.railway.app/v1/health/supabase
   ```
   Should return connection status

3. **Frontend Connection**:
   - Open your Vercel frontend
   - Check browser console for API URL
   - Should show Railway URL, not localhost
   - Try to login

## Monitoring

- **Logs**: Railway Dashboard → Your Project → Deployments → View Logs
- **Metrics**: Railway Dashboard → Your Project → Metrics
- **Deployments**: Railway Dashboard → Your Project → Deployments

## Custom Domain (Optional)

1. Go to **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Add your domain
4. Update DNS records as instructed
5. Update `APP_URL` and `FRONTEND_URL` to use custom domain

