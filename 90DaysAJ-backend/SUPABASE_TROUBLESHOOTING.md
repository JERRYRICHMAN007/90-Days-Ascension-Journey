# 🔧 Supabase Connection Troubleshooting Guide

## Common Error: "Supabase service unavailable"

If you see this error:
```
Supabase service unavailable. URL: https://qeezmjebcgtgvuyfqjxb.supabase.co. 
If you just restored: wait 1-2 minutes, then restart backend server. 
Check dashboard for project status.
```

## Quick Fixes (Try in Order)

### 1. Check Supabase Project Status

**Most Common Cause: Project is Paused**

Free tier Supabase projects automatically pause after 1 week of inactivity.

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Check your project status:
   - **Active** ✅ - Project is running
   - **Paused** ⏸️ - Project needs to be restored
   - **Initializing** 🔄 - Wait 1-2 minutes

### 2. Restore Paused Project

If your project is paused:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click on your project: `qeezmjebcgtgvuyfqjxb`
3. Click **"Restore"** or **"Resume"** button
4. Wait 1-2 minutes for the project to fully initialize
5. Restart your backend server:
   ```powershell
   # Stop the server (Ctrl+C)
   # Then restart:
   cd 90DaysAJ-backend
   npm run dev
   ```

### 3. Verify Environment Variables

Check that your `.env` file has correct values:

```powershell
# In 90DaysAJ-backend directory
cat .env
```

Should contain:
```env
SUPABASE_URL=https://qeezmjebcgtgvuyfqjxb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

**To get fresh keys:**
1. Go to Supabase Dashboard → Your Project
2. Settings → API
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

### 4. Test Supabase Connection

Use the health check endpoint:

```powershell
# Start your server first
npm run dev

# In another terminal, test connection:
curl http://localhost:4000/v1/health/supabase
```

Expected response:
```json
{
  "status": "ok",
  "services": {
    "supabase_auth": "connected",
    "database": "connected"
  }
}
```

If you get an error, the project is likely paused or still initializing.

### 5. Check Network/Firewall

If you're behind a corporate firewall or VPN:

1. Try accessing the Supabase dashboard in your browser
2. If dashboard works but API doesn't, check firewall rules
3. Ensure port 443 (HTTPS) is not blocked

### 6. Verify Project URL

Double-check the URL format:
- ✅ Correct: `https://qeezmjebcgtgvuyfqjxb.supabase.co`
- ❌ Wrong: `http://qeezmjebcgtgvuyfqjxb.supabase.co` (missing 's' in https)
- ❌ Wrong: `qeezmjebcgtgvuyfqjxb.supabase.co` (missing https://)

## Step-by-Step Recovery Process

### If Project Was Just Restored:

1. **Wait 1-2 minutes** after clicking "Restore"
   - Supabase needs time to spin up services
   - Dashboard will show "Initializing..." status

2. **Check project status in dashboard:**
   - Go to: https://app.supabase.com/project/qeezmjebcgtgvuyfqjxb
   - Look for green "Active" status

3. **Restart your backend server:**
   ```powershell
   # Stop current server (Ctrl+C)
   cd 90DaysAJ-backend
   npm run dev
   ```

4. **Test the connection:**
   ```powershell
   curl http://localhost:4000/v1/health/supabase
   ```

### If Project is Active But Still Getting Errors:

1. **Regenerate API keys:**
   - Supabase Dashboard → Settings → API
   - Copy fresh keys to `.env` file
   - Restart server

2. **Check for typos in `.env`:**
   ```powershell
   # Verify no extra spaces or quotes
   Get-Content .env | Select-String "SUPABASE"
   ```

3. **Clear node_modules and reinstall:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run dev
   ```

## Prevention Tips

### Keep Project Active

Free tier projects pause after 7 days of inactivity. To prevent pausing:

1. **Use project regularly** (at least once per week)
2. **Set up monitoring** to ping your API
3. **Consider upgrading** to Pro plan if you need 24/7 uptime

### Monitor Project Status

1. Bookmark your Supabase dashboard
2. Check project status weekly
3. Set up email notifications in Supabase settings

## Still Having Issues?

### Check Server Logs

Look for detailed error messages in your terminal:

```powershell
# Look for these error patterns:
# - "ENOTFOUND" → DNS/hostname issue
# - "ECONNREFUSED" → Connection refused (project paused)
# - "ETIMEDOUT" → Timeout (project initializing)
```

### Verify in Browser

Try accessing Supabase API directly:
```
https://qeezmjebcgtgvuyfqjxb.supabase.co/rest/v1/
```

If you get a response (even an error), the project is active.
If you get "connection refused" or timeout, project is paused.

### Contact Support

If none of the above works:

1. Check [Supabase Status Page](https://status.supabase.com/)
2. Check [Supabase Discord](https://discord.supabase.com/)
3. Review [Supabase Documentation](https://supabase.com/docs)

## Quick Reference

| Issue | Solution | Time |
|-------|----------|------|
| Project paused | Restore in dashboard | 1-2 min |
| Just restored | Wait + restart server | 1-2 min |
| Wrong API keys | Update `.env` file | Immediate |
| Network issue | Check firewall/VPN | Varies |
| Project initializing | Wait for completion | 2-3 min |

---

**Remember:** Free tier projects pause automatically. Always check the dashboard first! 🎯

