# ⚠️ Docker Required - Installation Instructions

## Current Status
❌ **Docker is NOT installed on your system**

You need Docker Desktop to run the PostgreSQL database. Here's how to install it:

---

## 🐳 Install Docker Desktop

### Step 1: Download
1. Go to: **https://www.docker.com/products/docker-desktop/**
2. Click **"Download for Windows"**
3. Run the installer (`Docker Desktop Installer.exe`)

### Step 2: Install
1. Follow the installation wizard
2. **Important**: Check "Use WSL 2 instead of Hyper-V" if prompted (recommended)
3. Click **"Restart"** when installation completes

### Step 3: Start Docker Desktop
1. After restart, open **Docker Desktop** from Start Menu
2. Wait for Docker to start (you'll see a whale icon in system tray)
3. Make sure it says "Docker Desktop is running"

---

## ✅ After Docker is Installed

Once Docker Desktop is running, come back and I'll run these commands for you:

```powershell
cd backend
docker compose up -d postgres
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

---

## 🔄 Alternative: Use Local PostgreSQL

If you prefer NOT to use Docker, you can:

1. **Install PostgreSQL manually**: https://www.postgresql.org/download/windows/
2. **Create database** named `ascension`
3. **Update `.env`** with your PostgreSQL connection string
4. Then run the Prisma commands

But Docker is **much easier** and recommended!

---

## 📝 What's Already Ready

✅ Backend code is ready  
✅ Dependencies installed  
✅ `.env` file created  
✅ JWT secrets generated  
✅ All setup scripts prepared  

**You just need Docker Desktop installed!**

---

## 🆘 Need Help?

- Docker Desktop docs: https://docs.docker.com/desktop/install/windows-install/
- If you get WSL 2 errors, see: https://docs.docker.com/desktop/troubleshoot/overview/

