# Production Backend Setup - Quick Fix

## Problem
You're seeing: **"Backend server is not configured. The administrator needs to set up the backend connection."**

This happens because the frontend doesn't know where your production backend is located.

## Solution: Set Vercel Environment Variable

### Step 1: Get Your Backend URL

**Do you have a backend deployed?**

#### Option A: Backend Already Deployed (Railway/Render/etc.)
Your backend URL should look like:
- `https://your-app-name.up.railway.app`
- `https://your-app.onrender.com`
- Or your custom domain

**Copy this URL** - you'll need it in Step 2.

#### Option B: No Backend Deployed Yet
You need to deploy your backend first. See `PRODUCTION_DEPLOYMENT.md` for full instructions.

**Quick Railway Deployment:**
1. Go to https://railway.app
2. Sign up/login with GitHub
3. New Project → Deploy from GitHub repo
4. Select your repo and `90DaysAJ-backend` folder
5. Add environment variables (see `PRODUCTION_DEPLOYMENT.md`)
6. Copy the generated URL (e.g., `https://your-app.up.railway.app`)

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your frontend project** (90DaysAJ-frontend)
3. **Go to Settings** → **Environment Variables**
4. **Click "Add New"**
5. **Fill in:**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.railway.app/v1`
     - ⚠️ **Important**: Replace `your-backend-url.railway.app` with your actual backend URL
     - ⚠️ **Important**: Must end with `/v1` (the API version path)
   - **Environment**: Select **Production** (and optionally Preview/Development)
6. **Click "Save"**

### Step 3: Redeploy Frontend

**Critical**: Environment variables only take effect after redeployment!

1. **Go to Deployments** tab in Vercel
2. **Click the "..." menu** on the latest deployment
3. **Click "Redeploy"**
4. **Wait 2-3 minutes** for deployment to complete

### Step 4: Verify It Works

1. **Open your production site** (e.g., `https://your-app.vercel.app`)
2. **Open browser console** (F12 → Console tab)
3. **Look for**:
   ```
   🔗 API Base URL: https://your-backend-url.railway.app/v1
   ```
4. **Should NOT see**:
   - ❌ `localhost`
   - ❌ `PRODUCTION_API_URL_NOT_CONFIGURED`
   - ❌ `127.0.0.1`

5. **Try to login** - it should work now!

## Troubleshooting

### Still Getting "Backend server is not configured"?

#### Check 1: Is Backend Running?
Test your backend health endpoint:
```bash
curl https://your-backend-url.railway.app/health
```

Should return: `{"status":"ok","timestamp":"..."}`

If it fails:
- Backend might be down
- Check Railway logs
- Verify backend is deployed and running

#### Check 2: Is Environment Variable Set Correctly?
1. Vercel Dashboard → Settings → Environment Variables
2. Verify `VITE_API_BASE_URL` exists
3. Verify it's set for **Production** environment (not just Preview)
4. Verify value is: `https://your-backend-url.railway.app/v1`
   - Must be HTTPS (not HTTP)
   - Must end with `/v1`
   - No trailing slash after `/v1`

#### Check 3: Did You Redeploy?
- Environment variables only work after redeployment
- Go to Deployments → Redeploy latest deployment
- Wait for deployment to complete

#### Check 4: CORS Issues?
If you see CORS errors in console:
- Backend needs `APP_URL` environment variable set to your frontend URL
- In Railway: Set `APP_URL=https://your-frontend.vercel.app`
- Redeploy backend after setting

### Example Configuration

**Vercel Environment Variable:**
```
Key: VITE_API_BASE_URL
Value: https://90daysaj-backend.up.railway.app/v1
Environment: Production
```

**Railway Environment Variables:**
```
APP_URL=https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app
```

## Quick Test

After setup, test from your phone or another device:
1. Open your production site URL
2. Try to login
3. Should work from anywhere in the world!

## Need Help?

If still not working:
1. Check browser console for exact error
2. Check Railway backend logs
3. Verify both frontend and backend are deployed
4. Verify all environment variables are set correctly




