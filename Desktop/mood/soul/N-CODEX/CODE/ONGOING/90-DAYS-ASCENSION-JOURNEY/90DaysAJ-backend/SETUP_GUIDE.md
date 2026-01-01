# Backend Setup Guide

## Option 1: Using Docker (Recommended - Easiest)

### Prerequisites
1. Install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/
2. After installation, restart your computer
3. Open Docker Desktop and ensure it's running

### Setup Steps

1. **Create .env file**:
   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

2. **Start PostgreSQL and MinIO**:
   ```powershell
   docker compose up -d postgres minio
   ```

3. **Wait for services to be ready** (about 30 seconds), then run migrations:
   ```powershell
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Seed the database** (optional):
   ```powershell
   npm run prisma:seed
   ```

5. **Start the backend server**:
   ```powershell
   npm run dev
   ```

The backend will be running on `http://localhost:4000`

---

## Option 2: Manual PostgreSQL Setup (No Docker)

### Prerequisites
1. Install PostgreSQL: https://www.postgresql.org/download/windows/
2. During installation, remember your PostgreSQL password

### Setup Steps

1. **Create PostgreSQL database**:
   - Open pgAdmin (comes with PostgreSQL) or use psql
   - Create a new database named `ascension`
   - Or use command line:
   ```sql
   CREATE DATABASE ascension;
   ```

2. **Create .env file**:
   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

3. **Edit .env file** with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/ascension
   ```
   Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

4. **Generate JWT secrets** (run in Node.js):
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Run this twice and update `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `.env`

5. **Install dependencies and setup database**:
   ```powershell
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Seed the database** (optional):
   ```powershell
   npm run prisma:seed
   ```

7. **Start the backend server**:
   ```powershell
   npm run dev
   ```

---

## Verify Setup

1. **Check backend is running**:
   - Visit: http://localhost:4000/health
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Check database connection**:
   - Run: `npx prisma studio`
   - Opens a GUI to view your database tables

---

## Troubleshooting

### Database Connection Errors
- **Error: "Connection refused"**: PostgreSQL is not running
  - Docker: Check `docker compose ps` to see if postgres is running
  - Manual: Check Windows Services for PostgreSQL service

- **Error: "password authentication failed"**: Wrong credentials in DATABASE_URL
  - Check your .env file has correct username/password

### Port Already in Use
- **Port 4000 in use**: Change `PORT` in `.env` to another port (e.g., 4001)
- **Port 5432 in use**: Another PostgreSQL instance is running

### Prisma Errors
- **"Prisma Client not generated"**: Run `npx prisma generate`
- **"Migration failed"**: Check database connection and credentials

---

## Next Steps

Once the backend is running:
1. Update frontend `.env.local` with: `VITE_API_BASE_URL=http://localhost:4000/v1`
2. Test authentication by signing up a new user
3. Check database with Prisma Studio to see created users

