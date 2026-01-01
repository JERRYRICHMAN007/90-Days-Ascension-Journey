# Quick Setup Instructions

## ⚠️ IMPORTANT: Docker is NOT installed

You have two options:

### Option A: Install Docker (Easiest - Recommended)
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Open Docker Desktop
4. Then run:
   ```powershell
   cd backend
   docker compose up -d postgres
   npm run prisma:generate
   npx prisma migrate dev
   npm run dev
   ```

### Option B: Use Local PostgreSQL (Manual Setup)

#### Step 1: Install PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user

#### Step 2: Create Database
Open pgAdmin (comes with PostgreSQL) or use command line:
```sql
CREATE DATABASE ascension;
```

#### Step 3: Update .env File
Open `backend/.env` and update:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ascension
```
Replace `YOUR_PASSWORD` with your PostgreSQL password.

Also update these JWT secrets (generate secure random strings, at least 32 characters):
```
JWT_ACCESS_SECRET=your-secure-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-secure-refresh-secret-min-32-chars
```

**⚠️ IMPORTANT:** Never commit real secrets to git. Use environment variables or a secrets manager.

#### Step 4: Run Setup Commands
```powershell
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

---

## ✅ What I've Done For You

1. ✅ Created `.env` file with default settings
2. ✅ Generated secure JWT secrets
3. ✅ Dependencies are already installed

## 🔧 What You Need To Do

**Choose ONE option:**

### If you want to use Docker:
1. Install Docker Desktop
2. Restart computer
3. Run: `docker compose up -d postgres`
4. Then continue with migrations

### If you want to use local PostgreSQL:
1. Install PostgreSQL
2. Create database named `ascension`
3. Update `.env` file with your PostgreSQL password
4. Update JWT secrets in `.env` (I've provided them above)
5. Run the setup commands

---

## 🚀 After Database is Ready

Once PostgreSQL is running (either via Docker or local), run:

```powershell
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

The backend will start on `http://localhost:4000`

---

## 📝 Next Steps After Backend is Running

1. Update frontend environment:
   - Create `react-dashboard/.env.local`
   - Add: `VITE_API_BASE_URL=http://localhost:4000/v1`

2. Test the connection:
   - Visit: http://localhost:4000/health
   - Should see: `{"status":"ok"}`

3. Try signing up a new user in your app!

