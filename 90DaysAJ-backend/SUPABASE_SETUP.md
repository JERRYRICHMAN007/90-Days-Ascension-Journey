# Supabase Setup Guide - Step by Step

This guide will help you connect your backend to Supabase (PostgreSQL database).

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

## Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `90-days-ascension-journey` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., `US East`, `Europe West`)
   - **Pricing Plan**: Select **Free** (500 MB database, perfect for development)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

## Step 3: Get Your Database Connection String

1. In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
2. Click **Database** in the settings menu
3. Scroll down to **Connection string**
4. Select **URI** tab
5. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the database password you created in Step 2
7. **Important**: Add `?pgbouncer=true&connection_limit=1` at the end for better connection handling:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   ```

## Step 4: Update Your Backend .env File

1. Open `90DaysAJ-backend/.env` file
2. Replace the `DATABASE_URL` with your Supabase connection string:

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1

# Server Configuration
PORT=4000
HOST=0.0.0.0
NODE_ENV=production

# JWT Secrets (Generate secure random strings, at least 32 characters)
JWT_ACCESS_SECRET=your-secure-access-secret-min-32-chars-generate-random
JWT_REFRESH_SECRET=your-secure-refresh-secret-min-32-chars-generate-random

# CORS - Add your frontend URL (Vercel deployment URL)
APP_URL=https://your-frontend-url.vercel.app

# Email (Optional - for password reset)
MAIL_API_KEY=your-sendgrid-api-key-if-needed

# File Storage (Optional - can use Supabase Storage later)
S3_ENDPOINT=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_FORCE_PATH_STYLE=false
CDN_URL=
FILE_MAX_BYTES=5242880
```

## Step 5: Generate Secure JWT Secrets

Run these commands in PowerShell to generate secure secrets:

```powershell
# Generate JWT Access Secret (32+ characters)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Generate JWT Refresh Secret (32+ characters)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Copy the generated strings and use them for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

## Step 6: Run Database Migrations

1. Open terminal in `90DaysAJ-backend` folder
2. Run these commands:

```powershell
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables in Supabase
npx prisma migrate deploy

# (Optional) Seed database with initial data
npm run prisma:seed
```

## Step 7: Test the Connection

1. Start your backend:
```powershell
npm run dev
```

2. Check if it connects:
```powershell
curl http://localhost:4000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## Step 8: Update Frontend API URL

1. Open `90DaysAJ-frontend/.env.local` (create if doesn't exist)
2. Add your backend URL:

```env
# For local development
VITE_API_BASE_URL=http://localhost:4000/v1

# For production (after deploying backend)
# VITE_API_BASE_URL=https://your-backend-url.railway.app/v1
```

## Step 9: Deploy Backend to Production

### Option A: Railway.app (Recommended - Free tier available)

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Add environment variables from your `.env` file
6. Railway will auto-detect Node.js and deploy
7. Get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render.com

1. Go to [https://render.com](https://render.com)
2. Sign up
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables
7. Deploy

## Step 10: Update Frontend for Production

1. In Vercel dashboard, go to your project
2. Go to **Settings** → **Environment Variables**
3. Add:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/v1
   ```
4. Redeploy your frontend

## Troubleshooting

### Connection Issues
- Make sure your Supabase project is active
- Check that the password in connection string matches
- Verify the connection string format is correct

### Migration Errors
- Make sure you ran `npx prisma migrate deploy` (not `migrate dev`)
- Check Supabase dashboard → Database → Tables to see if tables were created

### CORS Errors
- Add your frontend URL to `APP_URL` in backend `.env`
- Make sure backend CORS allows your frontend origin

## Next Steps

- ✅ Database connected to Supabase
- ✅ Backend running locally
- ⏭️ Deploy backend to Railway/Render
- ⏭️ Update frontend API URL
- ⏭️ Test login/signup functionality

