# Production Deployment Guide

## Overview

This guide ensures your application works universally across all devices and networks, not just from your local machine.

## Problem: Login Only Works on Your Laptop

If login only works on your laptop, it means:
- ❌ Backend is running locally (localhost)
- ❌ Frontend is pointing to localhost API URL
- ❌ CORS is not configured for production frontend URL
- ❌ Environment variables are not set for production

## Solution: Deploy Backend to Cloud

### Step 1: Choose a Backend Hosting Platform

**Recommended Options:**

1. **Railway.app** (Recommended - Free tier available)
   - Easy deployment from GitHub
   - Automatic HTTPS
   - Environment variable management
   - URL: https://railway.app

2. **Render.com** (Free tier available)
   - Simple deployment
   - Automatic SSL
   - URL: https://render.com

3. **Fly.io** (Free tier available)
   - Global edge deployment
   - URL: https://fly.io

4. **Vercel** (For serverless functions)
   - Good for frontend + API routes
   - URL: https://vercel.com

### Step 2: Deploy Backend to Railway (Recommended)

#### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Select the `90DaysAJ-backend` folder as the root directory

#### 2.2 Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
# Database
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT-ID.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&sslmode=require

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server
PORT=5001
HOST=0.0.0.0
NODE_ENV=production

# JWT Secrets (use the same ones from your .env file)
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# Frontend URL (your Vercel frontend URL)
APP_URL=https://your-frontend-app.vercel.app
FRONTEND_URL=https://your-frontend-app.vercel.app

# Optional: File Storage (if using S3)
S3_ENDPOINT=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

#### 2.3 Configure Build Settings

In Railway, go to **Settings** → **Build**:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `90DaysAJ-backend` (if deploying from monorepo)

#### 2.4 Get Your Backend URL

After deployment, Railway will provide a URL like:
```
https://your-app-name.up.railway.app
```

**Important:** Copy this URL - you'll need it for the frontend configuration.

### Step 3: Update Frontend Environment Variables

#### 3.1 In Vercel Dashboard

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

```env
# Production API URL (use your Railway backend URL)
VITE_API_BASE_URL=https://your-app-name.up.railway.app/v1
```

**Important:** 
- Make sure to set this for **Production** environment
- The URL should end with `/v1` (the API version path)
- After adding, redeploy your frontend

#### 3.2 Verify Environment Variable

After redeploying, check browser console:
- You should see: `🔗 API Base URL: https://your-backend-url.railway.app/v1`
- NOT: `🔗 API Base URL: http://localhost:5001/v1`

### Step 4: Update Backend CORS Configuration

The backend CORS is already configured to accept your frontend URL via `APP_URL` environment variable. Make sure:

1. `APP_URL` in Railway matches your Vercel frontend URL exactly
2. Both URLs use HTTPS (not HTTP)
3. No trailing slashes

Example:
```env
APP_URL=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app
```

### Step 5: Test Production Deployment

#### 5.1 Test Backend Health

Open in browser:
```
https://your-backend-url.railway.app/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

#### 5.2 Test API Endpoint

Open in browser:
```
https://your-backend-url.railway.app/v1/health/supabase
```

Should return:
```json
{
  "status": "ok",
  "services": {
    "supabase_auth": "connected",
    "database": "connected"
  }
}
```

#### 5.3 Test Frontend Connection

1. Open your production frontend URL
2. Open browser DevTools (F12) → Console
3. Look for: `🔗 API Base URL: https://your-backend-url.railway.app/v1`
4. Try to login
5. Check Network tab for API calls to your backend URL

### Step 6: Verify Universal Access

Test from different devices:

1. **Your Laptop** ✅ (should work)
2. **Your Phone** (on different network) ✅ (should work)
3. **Friend's Device** ✅ (should work)
4. **Different Browser** ✅ (should work)

All should be able to login successfully.

## Troubleshooting

### Issue: "Cannot connect to authentication service"

**Solution:**
1. Check backend is deployed and running (test `/health` endpoint)
2. Verify `VITE_API_BASE_URL` is set in Vercel environment variables
3. Check browser console for actual API URL being used
4. Verify CORS allows your frontend URL

### Issue: CORS Error

**Solution:**
1. Check `APP_URL` in Railway matches your frontend URL exactly
2. Ensure both use HTTPS
3. Check browser console for CORS error details
4. Verify backend CORS configuration allows your origin

### Issue: Backend Not Starting

**Solution:**
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check `NODE_ENV=production` is set
4. Verify database connection (check `DATABASE_URL`)

### Issue: Database Connection Failed

**Solution:**
1. Verify `DATABASE_URL` is correct
2. Check Supabase project is active
3. Ensure database is accessible from Railway IP (check Supabase network settings)
4. Test connection locally first

## Environment Variables Checklist

### Backend (Railway)

- [ ] `DATABASE_URL` - Supabase PostgreSQL connection string
- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `PORT` - Server port (5001)
- [ ] `HOST` - Server host (0.0.0.0 for production)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `JWT_ACCESS_SECRET` - JWT access token secret
- [ ] `JWT_REFRESH_SECRET` - JWT refresh token secret
- [ ] `APP_URL` - Your frontend URL (Vercel)
- [ ] `FRONTEND_URL` - Your frontend URL (Vercel)

### Frontend (Vercel)

- [ ] `VITE_API_BASE_URL` - Your backend URL + `/v1` (Railway)

## Quick Reference

### Backend URLs
- Health: `https://your-backend.railway.app/health`
- API Base: `https://your-backend.railway.app/v1`
- Supabase Health: `https://your-backend.railway.app/v1/health/supabase`

### Frontend URLs
- Production: `https://your-app.vercel.app`
- Local Dev: `http://localhost:5173`

### Testing Commands

```bash
# Test backend health
curl https://your-backend.railway.app/health

# Test API endpoint
curl https://your-backend.railway.app/v1/health/supabase

# Test from different network (use your phone's browser)
# Open: https://your-app.vercel.app
# Try to login
```

## Security Checklist

- [ ] All environment variables are set (no defaults exposed)
- [ ] JWT secrets are strong (64+ characters, random)
- [ ] Database connection uses SSL (`sslmode=require`)
- [ ] CORS only allows your frontend URL
- [ ] HTTPS is enabled (automatic on Railway/Vercel)
- [ ] No sensitive data in code or logs

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Set environment variables in Railway
3. ✅ Set `VITE_API_BASE_URL` in Vercel
4. ✅ Redeploy frontend
5. ✅ Test from multiple devices
6. ✅ Verify universal login works

## Support

If you encounter issues:

1. Check Railway logs: Railway Dashboard → Your Project → Deployments → View Logs
2. Check Vercel logs: Vercel Dashboard → Your Project → Deployments → View Logs
3. Check browser console for errors
4. Verify all environment variables are set correctly

---

**Remember:** The key to universal access is ensuring:
- ✅ Backend is deployed to cloud (not localhost)
- ✅ Frontend points to cloud backend URL
- ✅ CORS allows your frontend domain
- ✅ Environment variables are set correctly

