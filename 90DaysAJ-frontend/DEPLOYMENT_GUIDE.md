# Deployment Guide

This guide will help you deploy the 90 Days Ascension Journey application so it works on all devices and in production.

## Prerequisites

1. **Backend deployed** on a hosting service (Railway, Render, Fly.io, etc.)
2. **Frontend deployed** on Vercel
3. **Environment variables** configured correctly

## Step 1: Deploy Backend

### Option A: Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Select the `90DaysAJ-backend` folder
5. Railway will auto-detect Node.js and deploy
6. Add environment variables in Railway dashboard:
   - `DATABASE_URL` (from Supabase)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET` (generate a random string)
   - `NODE_ENV=production`
7. Copy your Railway backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set:
   - **Root Directory**: `90DaysAJ-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables (same as Railway)
6. Copy your Render backend URL

## Step 2: Configure Frontend Environment Variables

### In Vercel Dashboard:

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

   **Name**: `VITE_API_BASE_URL`
   
   **Value**: `https://your-backend-url.com/v1`
   
   (Replace with your actual backend URL from Step 1)
   
   **Environment**: Select **Production**, **Preview**, and **Development**

4. Click **Save**

### Example Values:

- Railway: `https://your-app.railway.app/v1`
- Render: `https://your-app.onrender.com/v1`
- Fly.io: `https://your-app.fly.dev/v1`

## Step 3: Redeploy Frontend

After setting environment variables:

1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Step 4: Verify Deployment

1. Visit your deployed frontend URL
2. Try to sign in
3. Check browser console for any errors
4. Verify API calls are going to your backend URL (not localhost)

## Troubleshooting

### "API URL not configured" Error

- **Cause**: `VITE_API_BASE_URL` not set in Vercel
- **Fix**: Add the environment variable in Vercel and redeploy

### "Cannot connect to server" Error

- **Cause**: Backend not deployed or URL incorrect
- **Fix**: 
  1. Verify backend is running and accessible
  2. Check backend URL in Vercel environment variables
  3. Ensure backend URL includes `/v1` at the end

### Works Locally But Not in Production

- **Cause**: Environment variable not set for production
- **Fix**: Make sure `VITE_API_BASE_URL` is set for **Production** environment in Vercel

### CORS Errors

- **Cause**: Backend not allowing requests from frontend domain
- **Fix**: Update backend CORS settings to include your Vercel domain

## Local Development

For local development, create a `.env.local` file in `90DaysAJ-frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5001/v1
```

This file is gitignored and won't affect production.

## Network Access (Testing on Other Devices)

If you want to test on other devices on your local network:

1. Find your computer's local IP address:
   - Windows: `ipconfig` → Look for IPv4 Address
   - Mac/Linux: `ifconfig` or `ip addr`
2. Access the app via: `http://YOUR_IP:5174`
3. The app will automatically use `http://YOUR_IP:5001/v1` for the backend

## Quick Checklist

- [ ] Backend deployed and accessible
- [ ] Backend URL copied (e.g., `https://your-app.railway.app`)
- [ ] `VITE_API_BASE_URL` set in Vercel for all environments
- [ ] Frontend redeployed after setting environment variables
- [ ] Tested login/signup on deployed site
- [ ] Verified API calls in browser DevTools Network tab

