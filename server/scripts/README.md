# Backend Scripts

Utility scripts for backend development and setup.

## Available Scripts

### `start-server.ps1` / `start-server.bat`
Starts the backend development server. Automatically checks for dependencies and .env file.

**Usage:**
```powershell
cd 90DaysAJ-backend
.\scripts\start-server.ps1
```

Or simply:
```bash
npm run dev
```

### `create-env.ps1`
Creates a `.env` file with Supabase configuration template.

**Usage:**
```powershell
cd 90DaysAJ-backend
.\scripts\create-env.ps1
```

**Note:** Review and update the generated `.env` file with your actual Supabase credentials.

### `check-supabase.ps1`
Checks Supabase connection status and backend health.

**Usage:**
```powershell
cd 90DaysAJ-backend
.\scripts\check-supabase.ps1
```

This script verifies:
- Supabase project is reachable
- Backend server health endpoint
- Database connection status

### `test-auth.ps1`
Tests authentication endpoints (register, login).

**Usage:**
```powershell
cd 90DaysAJ-backend
.\scripts\test-auth.ps1
```

**Note:** Make sure the backend server is running before executing this script.

### `ENV_TEMPLATE.txt`
Template file for environment variables. Use with `create-env.ps1` or manually copy to `.env`.

## Quick Reference

All scripts should be run from the `90DaysAJ-backend` directory. The scripts will handle path resolution automatically.
