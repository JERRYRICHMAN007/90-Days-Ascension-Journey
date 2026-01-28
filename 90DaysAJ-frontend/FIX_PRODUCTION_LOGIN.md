# Fix Production Login - Step by Step

## The Problem
You're seeing: **"Backend server is not configured. The administrator needs to set up the backend connection."**

This means your production frontend doesn't know where your backend is located.

## Quick Fix (5 Minutes)

### Step 1: Get Your Backend URL

**Do you have a backend deployed?**

#### ✅ If Backend is Already Deployed:
1. Go to your Railway dashboard: https://railway.app
2. Select your backend project
3. Go to **Settings** → **Networking**
4. Copy the **Public Domain** URL (e.g., `https://your-app.up.railway.app`)
5. **Save this URL** - you'll need it in Step 2

#### ❌ If Backend is NOT Deployed:
You need to deploy it first. See `90DaysAJ-backend/RAILWAY_DEPLOYMENT.md` for instructions.

**Quick Steps:**
1. Go to https://railway.app
2. Sign up/login with GitHub
3. New Project → Deploy from GitHub repo
4. Select your repo → Choose `90DaysAJ-backend` folder
5. Add environment variables (see Railway deployment guide)
6. Copy the generated URL

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your frontend project** (the one showing the error)
3. **Click "Settings"** (left sidebar)
4. **Click "Environment Variables"** (under Configuration)
5. **Click "Add New"** button
6. **Fill in the form:**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.railway.app/v1`
     - ⚠️ Replace `your-backend-url.railway.app` with your actual Railway URL
     - ⚠️ **Must end with `/v1`** (the API version)
   - **Environment**: 
     - ✅ Check **Production**
     - ✅ Optionally check Preview and Development
7. **Click "Save"**

### Step 3: Redeploy Frontend

**⚠️ CRITICAL**: Environment variables only work after redeployment!

1. **Go to "Deployments"** tab (top navigation)
2. **Find the latest deployment**
3. **Click the "..." menu** (three dots) on the right
4. **Click "Redeploy"**
5. **Wait 2-3 minutes** for deployment to complete

### Step 4: Test It Works

1. **Open your production site** (your Vercel URL)
2. **Open browser console** (Press F12 → Console tab)
3. **Look for this line:**
   ```
   🔗 API Base URL: https://your-backend-url.railway.app/v1
   ```
4. **Should NOT see:**
   - ❌ `localhost:5001`
   - ❌ `PRODUCTION_API_URL_NOT_CONFIGURED`
   - ❌ `127.0.0.1`

5. **Try to login** - it should work now! 🎉

## Example Configuration

**Vercel Environment Variable:**
```
Key:   VITE_API_BASE_URL
Value: https://90daysaj-backend.up.railway.app/v1
Environment: Production ✅
```

**What you'll see in browser console (after fix):**
```
🔗 API Base URL: https://90daysaj-backend.up.railway.app/v1
🌍 Environment: production
🌐 Hostname: your-app.vercel.app
🔐 VITE_API_BASE_URL set: true
```

## Troubleshooting

### Still Not Working?

#### 1. Check Backend is Running
Test your backend:
```bash
curl https://your-backend-url.railway.app/health
```

Should return: `{"status":"ok","timestamp":"..."}`

If it fails:
- Backend might be down
- Check Railway → Deployments → View Logs
- Verify backend is deployed

#### 2. Verify Environment Variable
1. Vercel → Settings → Environment Variables
2. Check `VITE_API_BASE_URL` exists
3. Check it's set for **Production** (not just Preview)
4. Check value is: `https://your-backend.railway.app/v1`
   - ✅ Must be HTTPS (not HTTP)
   - ✅ Must end with `/v1`
   - ✅ No trailing slash

#### 3. Did You Redeploy?
- Environment variables only work after redeployment
- Go to Deployments → Redeploy
- Wait for completion

#### 4. CORS Errors?
If you see CORS errors in console:
- Backend needs `APP_URL` set to your frontend URL
- In Railway: Variables → Add `APP_URL=https://your-frontend.vercel.app`
- Redeploy backend

#### 5. Check Browser Console
Open browser console (F12) and look for:
- Exact error message
- Network tab → Check if API requests are going to the right URL
- Should show your Railway URL, not localhost

## Common Mistakes

❌ **Wrong**: `VITE_API_BASE_URL=https://your-backend.railway.app` (missing `/v1`)
✅ **Correct**: `VITE_API_BASE_URL=https://your-backend.railway.app/v1`

❌ **Wrong**: Set only for Preview environment
✅ **Correct**: Set for Production environment

❌ **Wrong**: Forgot to redeploy after adding variable
✅ **Correct**: Always redeploy after adding environment variables

## Still Need Help?

1. **Check browser console** for exact error
2. **Check Railway logs** for backend errors
3. **Verify both are deployed**:
   - Frontend on Vercel ✅
   - Backend on Railway ✅
4. **Verify all environment variables** are set correctly

## Quick Checklist

- [ ] Backend deployed to Railway
- [ ] Backend URL copied (e.g., `https://xxx.up.railway.app`)
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Value ends with `/v1`
- [ ] Set for Production environment
- [ ] Frontend redeployed after adding variable
- [ ] Backend health check works
- [ ] Browser console shows correct API URL
- [ ] Login works on production site




