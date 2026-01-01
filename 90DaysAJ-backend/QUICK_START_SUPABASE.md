# Quick Start: Connect to Supabase

## 🚀 Fast Setup (5 minutes)

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) → Sign up
- Click **"New Project"**
- Name: `90-days-ascension`
- Password: Create strong password (save it!)
- Region: Choose closest
- Click **"Create new project"**

### 2. Get Connection String
- Wait 2-3 minutes for project to create
- Go to **Settings** → **Database**
- Scroll to **Connection string** → **URI** tab
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your actual password
- Add `?pgbouncer=true&connection_limit=1` at the end

Example:
```
postgresql://postgres:MyPassword123@db.abcdefgh.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

### 3. Update .env File
Open `90DaysAJ-backend/.env` and update:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
PORT=4000
NODE_ENV=production
```

### 4. Generate JWT Secrets
Run in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```
Run twice, use results for:
```env
JWT_ACCESS_SECRET=<first-result>
JWT_REFRESH_SECRET=<second-result>
```

### 5. Run Migrations
```powershell
cd 90DaysAJ-backend
npm run prisma:generate
npx prisma migrate deploy
```

### 6. Start Backend
```powershell
npm run dev
```

### 7. Test
Open browser: `http://localhost:4000/health`
Should see: `{"status":"ok"}`

## ✅ Done!
Your backend is now connected to Supabase!

## Next: Deploy Backend
See `SUPABASE_SETUP.md` for deployment instructions (Railway/Render).

