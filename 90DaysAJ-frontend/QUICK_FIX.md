# Quick Fix: Cannot Login on Other Devices / Production

## The Problem

Your app is trying to connect to `http://localhost:5001/v1`, which only works on your local machine. When you access the site from other devices or in production, it can't reach localhost.

## The Solution (3 Steps)

### Step 1: Deploy Your Backend

You need to deploy your backend to a hosting service. Here are quick options:

**Railway (Easiest):**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo → Choose `90DaysAJ-backend` folder
4. Add environment variables (see backend README)
5. Copy your Railway URL (e.g., `https://your-app.railway.app`)

**Render (Alternative):**
1. Go to https://render.com
2. New Web Service → Connect GitHub
3. Set Root Directory: `90DaysAJ-backend`
4. Add environment variables
5. Copy your Render URL

### Step 2: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.com/v1` (use your Railway/Render URL + `/v1`)
   - **Environment**: Check **Production**, **Preview**, and **Development**
5. Click **Save**

### Step 3: Redeploy Frontend

1. In Vercel, go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Verify It Works

1. Visit your deployed site
2. Open browser DevTools (F12) → Console tab
3. You should see: `🔗 API Base URL: https://your-backend-url.com/v1`
4. Try logging in - it should work!

## Still Having Issues?

- **Check**: Is backend URL correct? Must end with `/v1`
- **Check**: Did you redeploy after setting environment variable?
- **Check**: Is backend actually running? Test the URL in browser
- **Check**: Browser console for specific error messages

## For Local Development

Create `.env.local` in `90DaysAJ-frontend/` folder:
```
VITE_API_BASE_URL=http://localhost:5001/v1
```

This only affects local development, not production.

