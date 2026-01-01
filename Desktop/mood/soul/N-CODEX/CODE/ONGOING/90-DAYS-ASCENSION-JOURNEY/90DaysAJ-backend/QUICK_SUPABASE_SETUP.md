# ⚡ Quick Supabase Setup (5 Minutes)

## 🎯 Quick Steps

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) → Sign up
- Click **"New Project"**
- Name: `90-days-ascension`
- Set a **strong password** (save it!)
- Region: Choose closest
- Plan: **Free**
- Click **"Create new project"** → Wait 2-3 minutes

### 2. Get Connection String
- Supabase Dashboard → ⚙️ **Settings** → **Database**
- Scroll to **Connection string** → **URI** tab
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your actual password
- Add `?pgbouncer=true&connection_limit=1` at the end

**Example:**
```
postgresql://postgres:MyPassword123!@#@db.abcdefgh.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

### 3. Create .env File
```powershell
cd 90DaysAJ-backend
copy ENV_TEMPLATE.txt .env
```

### 4. Update .env File
Open `.env` and set:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

### 5. Generate JWT Secrets
Run this **TWICE** in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Use results for:
```env
JWT_ACCESS_SECRET=<first-result>
JWT_REFRESH_SECRET=<second-result>
```

### 6. Setup Database
```powershell
npm install
npm run prisma:generate
npx prisma migrate deploy
```

### 7. Test Connection
```powershell
npm run dev
```

Open: `http://localhost:4000/health`

Should see: `{"status":"ok"}`

---

## ✅ Done!

Your backend is now connected to Supabase!

---

## 📚 Need More Details?

See **[SUPABASE_CONNECTION_GUIDE.md](./SUPABASE_CONNECTION_GUIDE.md)** for:
- Detailed step-by-step instructions
- Troubleshooting guide
- Production deployment steps
- Security best practices

---

## 🆘 Quick Troubleshooting

**Can't connect?**
- Check `DATABASE_URL` is correct
- Verify password matches Supabase
- Make sure project is active (not paused)

**Migration failed?**
- Check Supabase dashboard → Table Editor
- Verify connection string format

**CORS errors?**
- Update `APP_URL` and `FRONTEND_URL` in `.env`
- Match your frontend URL exactly

