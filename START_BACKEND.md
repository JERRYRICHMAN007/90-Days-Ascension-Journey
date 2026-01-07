# 🚀 How to Start the Backend Server

## Quick Start

### Option 1: Using the Startup Script (Easiest)
1. Open PowerShell or Command Prompt
2. Navigate to the backend directory:
   ```powershell
   cd 90DaysAJ-backend
   ```
3. Run the startup script:
   ```powershell
   .\start-server.ps1
   ```
   Or if using Command Prompt:
   ```cmd
   start-server.bat
   ```

### Option 2: Manual Start
1. Open PowerShell or Command Prompt
2. Navigate to the backend directory:
   ```powershell
   cd 90DaysAJ-backend
   ```
3. Start the server:
   ```powershell
   npm run dev
   ```

## ✅ Verify Server is Running

Once started, you should see:
```
Server running on http://127.0.0.1:5001
```

Test the server by opening in your browser:
- `http://localhost:5001/health` - Should return `{"status":"ok"}`
- `http://localhost:5001/v1/health/supabase` - Tests Supabase connection

## 🔧 Troubleshooting

### Server won't start?
1. **Check if port 5001 is already in use:**
   ```powershell
   Get-NetTCPConnection -LocalPort 5001
   ```
   If something is using it, either stop that process or change the port in `.env`

2. **Check if .env file exists:**
   ```powershell
   cd 90DaysAJ-backend
   Test-Path .env
   ```
   If it doesn't exist, copy `ENV_TEMPLATE.txt` to `.env` and fill in your Supabase credentials.

3. **Install dependencies:**
   ```powershell
   cd 90DaysAJ-backend
   npm install
   ```

4. **Check for errors:**
   Look at the terminal output when starting the server. Common issues:
   - Missing `.env` file
   - Invalid Supabase credentials
   - Port already in use
   - Missing dependencies

### Frontend still can't connect?
1. Make sure the backend is running on `http://localhost:5001`
2. Check the browser console for CORS errors
3. Verify the frontend API URL in `90DaysAJ-frontend/src/services/api.js` (should be `http://localhost:5001/v1`)

## 📝 Notes

- The server runs on **port 5001** by default
- The API base URL is: `http://localhost:5001/v1`
- Health check endpoint: `http://localhost:5001/health`
- Keep the terminal window open while the server is running
- Press `Ctrl+C` to stop the server


