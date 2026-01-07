# Production Login Debugging Guide

## Error: "Cannot connect to authentication server"

If you're seeing this error in production, follow these steps to diagnose and fix:

### Step 1: Check Browser Console

Open your production site and check the browser console (F12 → Console tab). Look for:

1. **API Base URL Log**:
   ```
   🔗 API Base URL: [should be your Railway backend URL]
   ```
   
   ❌ **WRONG**: `http://localhost:5001/v1` or `PRODUCTION_API_URL_NOT_CONFIGURED`
   ✅ **CORRECT**: `https://your-backend.railway.app/v1`

2. **Environment Log**:
   ```
   🌍 Environment: production
   ```

3. **Warning Messages**:
   ```
   ⚠️ PRODUCTION WARNING: API URL not configured!
   ```

### Step 2: Verify Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Check if `VITE_API_BASE_URL` exists
3. Verify it's set for **Production** environment (not just Preview)
4. Value should be: `https://your-backend.railway.app/v1` (your Railway URL + `/v1`)

**If missing or incorrect:**
1. Add/Update: `VITE_API_BASE_URL` = `https://your-backend.railway.app/v1`
2. Make sure it's set for **Production**
3. **Redeploy** your frontend (Vercel → Deployments → Redeploy)

### Step 3: Verify Backend is Running

Test your backend health endpoint:

```bash
curl https://your-backend.railway.app/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

**If this fails:**
- Backend is not deployed or not running
- Check Railway dashboard for deployment status
- Check Railway logs for errors

### Step 4: Test Backend API Endpoint

Test the authentication endpoint directly:

```bash
curl -X POST https://your-backend.railway.app/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**If this fails:**
- Backend API is not accessible
- Check Railway deployment logs
- Verify all environment variables are set in Railway

### Step 5: Check CORS Configuration

If you see CORS errors in browser console:

1. Go to **Railway Dashboard** → Your Project → **Variables**
2. Verify `APP_URL` matches your Vercel frontend URL exactly:
   ```
   APP_URL=https://your-frontend.vercel.app
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
3. Both should use HTTPS (not HTTP)
4. No trailing slashes
5. Redeploy backend after changing

### Step 6: Network Tab Debugging

1. Open browser DevTools → **Network** tab
2. Try to login
3. Look for the login request:
   - **URL**: Should be `https://your-backend.railway.app/v1/auth/login`
   - **Status**: 
     - ✅ `200` = Success (but might be wrong credentials)
     - ❌ `CORS error` = CORS configuration issue
     - ❌ `Failed to fetch` = Backend not accessible
     - ❌ `404` = Wrong endpoint URL
     - ❌ `500` = Backend error (check Railway logs)

### Common Issues & Solutions

#### Issue 1: API URL Still Shows localhost

**Cause**: `VITE_API_BASE_URL` not set in Vercel

**Solution**:
1. Set `VITE_API_BASE_URL` in Vercel environment variables
2. Make sure it's for **Production** environment
3. Redeploy frontend

#### Issue 2: CORS Error

**Cause**: Backend CORS not allowing frontend URL

**Solution**:
1. Check `APP_URL` in Railway matches frontend URL exactly
2. Both should use HTTPS
3. Redeploy backend

#### Issue 3: Backend Not Accessible

**Cause**: Backend not deployed or Railway service down

**Solution**:
1. Check Railway dashboard - is service running?
2. Check Railway logs for errors
3. Verify all environment variables are set
4. Test health endpoint: `https://your-backend.railway.app/health`

#### Issue 4: 404 Not Found

**Cause**: Wrong API endpoint URL

**Solution**:
1. Verify API URL ends with `/v1`
2. Check backend routes are mounted at `/v1`
3. Test: `https://your-backend.railway.app/v1/health/supabase`

### Quick Checklist

- [ ] `VITE_API_BASE_URL` set in Vercel (Production environment)
- [ ] Value is: `https://your-backend.railway.app/v1`
- [ ] Frontend redeployed after setting variable
- [ ] Backend deployed to Railway
- [ ] Backend health endpoint works: `/health`
- [ ] `APP_URL` in Railway matches frontend URL
- [ ] Both URLs use HTTPS
- [ ] No CORS errors in browser console
- [ ] Network tab shows correct backend URL

### Still Not Working?

1. **Check Browser Console** - Look for error messages
2. **Check Network Tab** - See actual request/response
3. **Check Railway Logs** - Backend might be crashing
4. **Check Vercel Logs** - Frontend build might have issues
5. **Verify Environment Variables** - Both Vercel and Railway

### Getting Help

When asking for help, provide:
1. Browser console logs (especially API Base URL)
2. Network tab screenshot (showing the failed request)
3. Railway backend logs
4. Vercel environment variables (hide secrets)
5. Backend health endpoint response

