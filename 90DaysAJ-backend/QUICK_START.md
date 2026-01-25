# 🚀 Quick Start - Supabase Integration

Your backend is now properly integrated with Supabase!

## ✅ What's Done

- ✅ Supabase client installed and configured
- ✅ Authentication routes updated to use Supabase Auth API
- ✅ Auth middleware updated to verify Supabase tokens
- ✅ Environment variables configured
- ✅ No more connection issues (uses HTTPS REST API)

## 🏃 Start Your Backend

```powershell
cd 90DaysAJ-backend
npm run dev
```

Server will start on: `http://localhost:4000`

## 🧪 Test It

### 1. Health Check
```powershell
curl http://localhost:4000/health
```

### 2. Register a User
```powershell
curl -X POST http://localhost:4000/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Test1234!\"}'
```

### 3. Login
```powershell
curl -X POST http://localhost:4000/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"Test1234!\"}'
```

## 📝 Environment Variables

Make sure your `.env` file has:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (secret!)

## 🎯 What Changed

### Before:
- ❌ Direct PostgreSQL connection (connection issues)
- ❌ Custom JWT authentication

### Now:
- ✅ Supabase REST API (HTTPS - no connection issues!)
- ✅ Supabase Auth API (built-in authentication)

## 📚 Documentation

- See `SUPABASE_INTEGRATION_COMPLETE.md` for full details
- See `PROPER_SUPABASE_SETUP.md` for integration approach

## 🆘 Troubleshooting

### Common Issues

#### "Supabase service unavailable" Error

**Most Common Cause: Project is Paused**

Free tier Supabase projects pause after 1 week of inactivity.

**Quick Fix:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Find your project: `qeezmjebcgtgvuyfqjxb`
3. Click **"Restore"** if paused
4. Wait 1-2 minutes for initialization
5. Restart your backend server:
   ```powershell
   # Stop server (Ctrl+C), then:
   npm run dev
   ```

**Test Connection:**
```powershell
curl http://localhost:4000/v1/health/supabase
```

**For detailed troubleshooting, see:** `SUPABASE_TROUBLESHOOTING.md`

### Other Issues

If the server doesn't start:
1. Check that `.env` file exists and has all Supabase credentials
2. Check for TypeScript errors: `npm run build`
3. Make sure port 4000 is not in use
4. Verify Supabase project is active in dashboard

## 📚 Documentation

- See `SUPABASE_TROUBLESHOOTING.md` for connection issues
- See `SUPABASE_INTEGRATION_COMPLETE.md` for full details
- See `PROPER_SUPABASE_SETUP.md` for integration approach

Your backend is now properly connected to Supabase! 🎉

