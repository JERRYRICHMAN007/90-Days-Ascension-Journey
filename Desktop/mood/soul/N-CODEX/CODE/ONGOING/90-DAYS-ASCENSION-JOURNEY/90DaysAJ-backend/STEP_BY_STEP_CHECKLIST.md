# ✅ Step-by-Step Checklist: Connect to Supabase

Follow these steps in order. Check off each step as you complete it.

## Phase 1: Supabase Setup (5-10 minutes)

- [ ] **Step 1.1**: Go to [supabase.com](https://supabase.com) and sign up
- [ ] **Step 1.2**: Click "New Project"
- [ ] **Step 1.3**: Fill in project details:
  - Name: `90-days-ascension-journey`
  - Database Password: Create and **SAVE THIS PASSWORD**
  - Region: Choose closest to you
  - Plan: Free
- [ ] **Step 1.4**: Click "Create new project"
- [ ] **Step 1.5**: Wait 2-3 minutes for project creation

## Phase 2: Get Connection String (2 minutes)

- [ ] **Step 2.1**: In Supabase dashboard, go to **Settings** (gear icon)
- [ ] **Step 2.2**: Click **Database** in settings menu
- [ ] **Step 2.3**: Scroll to **Connection string** section
- [ ] **Step 2.4**: Click **URI** tab
- [ ] **Step 2.5**: Copy the connection string
- [ ] **Step 2.6**: Replace `[YOUR-PASSWORD]` with your actual database password
- [ ] **Step 2.7**: Add `?pgbouncer=true&connection_limit=1` at the end

**Example format:**
```
postgresql://postgres:MyPassword123@db.abcdefgh.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

## Phase 3: Generate JWT Secrets (1 minute)

- [ ] **Step 3.1**: Open PowerShell
- [ ] **Step 3.2**: Run this command (copy the output):
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```
- [ ] **Step 3.3**: Run it again to get a second secret
- [ ] **Step 3.4**: Save both secrets (you'll use them in .env)

## Phase 4: Update Backend .env File (3 minutes)

- [ ] **Step 4.1**: Open `90DaysAJ-backend/.env` file
- [ ] **Step 4.2**: Update `DATABASE_URL` with your Supabase connection string
- [ ] **Step 4.3**: Set `PORT=4000`
- [ ] **Step 4.4**: Set `NODE_ENV=production`
- [ ] **Step 4.5**: Add `JWT_ACCESS_SECRET` (from Step 3.2)
- [ ] **Step 4.6**: Add `JWT_REFRESH_SECRET` (from Step 3.3)
- [ ] **Step 4.7**: Add `APP_URL` (your Vercel frontend URL, or `http://localhost:5173` for local)

**Your .env should look like:**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
PORT=4000
NODE_ENV=production
JWT_ACCESS_SECRET=your-64-char-secret-from-step-3
JWT_REFRESH_SECRET=your-64-char-secret-from-step-3
APP_URL=http://localhost:5173
```

## Phase 5: Run Database Migrations (2 minutes)

- [ ] **Step 5.1**: Open terminal in `90DaysAJ-backend` folder
- [ ] **Step 5.2**: Run: `npm run prisma:generate`
- [ ] **Step 5.3**: Wait for it to complete
- [ ] **Step 5.4**: Run: `npx prisma migrate deploy`
- [ ] **Step 5.5**: Wait for migrations to complete
- [ ] **Step 5.6**: (Optional) Run: `npm run prisma:seed` to add test data

## Phase 6: Test Backend Connection (1 minute)

- [ ] **Step 6.1**: Start backend: `npm run dev`
- [ ] **Step 6.2**: Wait for "Server running on port 4000" message
- [ ] **Step 6.3**: Open browser: `http://localhost:4000/health`
- [ ] **Step 6.4**: Should see: `{"status":"ok","timestamp":"..."}`
- [ ] **Step 6.5**: ✅ Backend is connected!

## Phase 7: Update Frontend (2 minutes)

- [ ] **Step 7.1**: Create/update `90DaysAJ-frontend/.env.local`
- [ ] **Step 7.2**: Add: `VITE_API_BASE_URL=http://localhost:4000/v1`
- [ ] **Step 7.3**: Restart frontend dev server
- [ ] **Step 7.4**: Try to sign up/login - should work now!

## Phase 8: Deploy Backend to Production (15-20 minutes)

### Option A: Railway.app (Recommended)

- [ ] **Step 8.1**: Go to [railway.app](https://railway.app)
- [ ] **Step 8.2**: Sign up with GitHub
- [ ] **Step 8.3**: Click "New Project" → "Deploy from GitHub repo"
- [ ] **Step 8.4**: Select your repository
- [ ] **Step 8.5**: Railway auto-detects Node.js
- [ ] **Step 8.6**: Go to "Variables" tab
- [ ] **Step 8.7**: Add all environment variables from your `.env` file
- [ ] **Step 8.8**: Set `NODE_ENV=production`
- [ ] **Step 8.9**: Set `PORT=4000` (or Railway's assigned port)
- [ ] **Step 8.10**: Wait for deployment
- [ ] **Step 8.11**: Copy your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render.com

- [ ] **Step 8.1**: Go to [render.com](https://render.com)
- [ ] **Step 8.2**: Sign up
- [ ] **Step 8.3**: Click "New +" → "Web Service"
- [ ] **Step 8.4**: Connect GitHub repo
- [ ] **Step 8.5**: Configure:
  - Environment: Node
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
- [ ] **Step 8.6**: Add environment variables
- [ ] **Step 8.7**: Deploy

## Phase 9: Update Frontend for Production (5 minutes)

- [ ] **Step 9.1**: Go to Vercel dashboard
- [ ] **Step 9.2**: Select your project
- [ ] **Step 9.3**: Go to Settings → Environment Variables
- [ ] **Step 9.4**: Add: `VITE_API_BASE_URL` = `https://your-backend-url.railway.app/v1`
- [ ] **Step 9.5**: Redeploy frontend
- [ ] **Step 9.6**: Test login/signup on production site

## ✅ All Done!

Your app should now be:
- ✅ Connected to Supabase database
- ✅ Backend running locally
- ✅ Backend deployed to production
- ✅ Frontend connected to production backend

## Troubleshooting

**Can't connect to database?**
- Check Supabase project is active
- Verify password in connection string
- Make sure connection string has `?pgbouncer=true&connection_limit=1`

**Migration errors?**
- Run `npx prisma migrate deploy` (not `migrate dev`)
- Check Supabase dashboard → Database → Tables

**CORS errors?**
- Add frontend URL to `APP_URL` in backend `.env`
- Make sure backend CORS allows your frontend origin

**Need help?**
- Check `SUPABASE_SETUP.md` for detailed instructions
- Check `QUICK_START_SUPABASE.md` for quick reference

