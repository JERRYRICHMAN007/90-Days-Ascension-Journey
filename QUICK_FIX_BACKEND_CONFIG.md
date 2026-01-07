# Quick Fix: "Backend server is not configured" Error

## The Problem

You're seeing: **"Backend server is not configured. The administrator needs to set up the backend connection."**

This means `VITE_API_BASE_URL` is not set in your Vercel environment variables.

## The Solution (5 Minutes)

### Step 1: Get Your Backend URL

If you've deployed to Railway, your backend URL looks like:
```
https://your-app-name.up.railway.app
```

**Don't have a backend URL yet?** You need to deploy your backend first. See `PRODUCTION_DEPLOYMENT.md`.

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**
3. **Go to Settings** → **Environment Variables**
4. **Click "Add New"**
5. **Add this variable**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.railway.app/v1` (replace with your actual Railway URL)
   - **Environment**: Select **Production** (important!)
6. **Click "Save"**

### Step 3: Redeploy Frontend

1. **Go to Deployments** tab
2. **Click "Redeploy"** on the latest deployment
3. **Wait for deployment to complete** (2-3 minutes)

### Step 4: Verify

1. **Open your production site**
2. **Open browser console** (F12)
3. **Look for**: `🔗 API Base URL: https://your-backend-url.railway.app/v1`
4. **Should NOT see**: `localhost` or `PRODUCTION_API_URL_NOT_CONFIGURED`

## Still Not Working?

### Check 1: Is Backend Running?

Test your backend health endpoint:
```bash
curl https://your-backend-url.railway.app/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Check 2: Is Environment Variable Set Correctly?

1. Vercel Dashboard → Settings → Environment Variables
2. Verify `VITE_API_BASE_URL` exists
3. Verify it's set for **Production** (not just Preview)
4. Verify value ends with `/v1`

### Check 3: Did You Redeploy?

Environment variables only take effect after redeployment. Make sure you redeployed after adding the variable.

## Example Configuration

**Vercel Environment Variable:**
```
Key: VITE_API_BASE_URL
Value: https://ascension-backend.up.railway.app/v1
Environment: Production ✅
```

**Browser Console Should Show:**
```
🔗 API Base URL: https://ascension-backend.up.railway.app/v1
🌍 Environment: production
```

## Need Help?

1. Check `PRODUCTION_DEBUGGING.md` for detailed troubleshooting
2. Check browser console for error messages
3. Verify backend is deployed and running
4. Verify CORS is configured correctly in Railway

