# Environment Variables Setup

## Quick Reference

### Frontend (Vercel) - Required Variables

```env
# Production API URL (your backend URL + /v1)
VITE_API_BASE_URL=https://your-backend-url.com/v1
```

**Where to set:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add for **Production** environment
3. Redeploy after adding

### Backend (Vercel/Render/Other) - Required Variables

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

# JWT Secrets (generate secure random strings, 64+ characters)
JWT_ACCESS_SECRET=your-64-char-random-secret
JWT_REFRESH_SECRET=your-64-char-random-secret

# Frontend URL (your Vercel deployment URL)
APP_URL=https://your-frontend-app.vercel.app
FRONTEND_URL=https://your-frontend-app.vercel.app
```

**Where to set:**
1. Your hosting platform (Vercel/Render/etc.) → Your Project → Environment Variables
2. Add each variable
3. Redeploy after adding

## Local Development

### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:5001/v1
```

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT-ID.supabase.co:5432/postgres?sslmode=require
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5001
HOST=127.0.0.1
NODE_ENV=development
JWT_ACCESS_SECRET=your-local-secret
JWT_REFRESH_SECRET=your-local-secret
APP_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

## Verification Checklist

### ✅ Backend Deployment
- [ ] Backend deployed (Vercel/Render/other)
- [ ] Health endpoint works: `https://your-backend-url.com/health`
- [ ] All environment variables set
- [ ] `NODE_ENV=production` is set
- [ ] `APP_URL` matches your frontend URL exactly

### ✅ Frontend Deployment
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Value points to your backend URL + `/v1`
- [ ] Frontend redeployed after adding variable
- [ ] Browser console shows correct API URL (not localhost)

### ✅ Testing
- [ ] Login works on your laptop
- [ ] Login works on your phone (different network)
- [ ] Login works on friend's device
- [ ] No CORS errors in browser console
- [ ] API calls go to your backend URL (check Network tab)

## Common Issues

### Issue: Frontend still uses localhost

**Solution:**
1. Verify `VITE_API_BASE_URL` is set in Vercel
2. Check it's set for **Production** environment (not Preview)
3. Redeploy frontend after adding variable
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: CORS Error

**Solution:**
1. Verify `APP_URL` in backend environment matches frontend URL exactly
2. Both should use HTTPS (not HTTP)
3. No trailing slashes
4. Check browser console for exact CORS error

### Issue: Backend not accessible

**Solution:**
1. Check backend deployment is successful
2. Test health endpoint: `https://your-backend-url.com/health`
3. Check backend logs for errors
4. Verify all environment variables are set

## Security Notes

⚠️ **Never commit `.env` files to Git**
⚠️ **Never expose JWT secrets or database passwords**
⚠️ **Use different secrets for production and development**
⚠️ **Rotate secrets if exposed**

