# PowerShell script to check Supabase connection status
# Usage: .\check-supabase.ps1

Write-Host "🔍 Checking Supabase Connection..." -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "   Create it using: .\create-env.ps1" -ForegroundColor Yellow
    exit 1
}

# Load environment variables
$envContent = Get-Content ".env" -Raw
$supabaseUrl = $null

# Extract SUPABASE_URL from .env
if ($envContent -match 'SUPABASE_URL=(.+)') {
    $supabaseUrl = $matches[1].Trim()
}

if (-not $supabaseUrl) {
    Write-Host "❌ SUPABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "📍 Supabase URL: $supabaseUrl" -ForegroundColor Gray
Write-Host ""

# Test 1: Check if project is reachable
Write-Host "Test 1: Checking if Supabase project is reachable..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$supabaseUrl/rest/v1/" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Project is reachable (HTTP $($response.StatusCode))" -ForegroundColor Green
} catch {
    $errorMsg = $_.Exception.Message
    if ($errorMsg -match "connection refused" -or $errorMsg -match "ECONNREFUSED") {
        Write-Host "❌ Connection refused - Project is likely PAUSED" -ForegroundColor Red
        Write-Host "   → Go to: https://app.supabase.com" -ForegroundColor Yellow
        Write-Host "   → Find your project and click 'Restore'" -ForegroundColor Yellow
        Write-Host "   → Wait 1-2 minutes, then restart your server" -ForegroundColor Yellow
    } elseif ($errorMsg -match "timeout" -or $errorMsg -match "ETIMEDOUT") {
        Write-Host "⚠️  Request timed out - Project may be initializing" -ForegroundColor Yellow
        Write-Host "   → Wait 2-3 minutes and try again" -ForegroundColor Yellow
    } elseif ($errorMsg -match "not found" -or $errorMsg -match "ENOTFOUND") {
        Write-Host "❌ Hostname not found - Check SUPABASE_URL in .env" -ForegroundColor Red
        Write-Host "   → Verify URL format: https://xxxxx.supabase.co" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Connection failed: $errorMsg" -ForegroundColor Red
    }
    exit 1
}

# Test 2: Check backend health endpoint (if server is running)
Write-Host ""
Write-Host "Test 2: Checking backend server health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:4000/v1/health/supabase" -Method GET -TimeoutSec 5 -ErrorAction Stop
    $healthData = $healthResponse.Content | ConvertFrom-Json
    
    if ($healthData.status -eq "ok") {
        Write-Host "✅ Backend server is running and Supabase is connected!" -ForegroundColor Green
        Write-Host "   Supabase Auth: $($healthData.services.supabase_auth)" -ForegroundColor Gray
        Write-Host "   Database: $($healthData.services.database)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Backend server responded but Supabase connection has issues" -ForegroundColor Yellow
        Write-Host "   Error: $($healthData.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️  Backend server is not running or not responding" -ForegroundColor Yellow
    Write-Host "   → Start server with: npm run dev" -ForegroundColor Gray
    Write-Host "   → Then test: curl http://localhost:4000/v1/health/supabase" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📚 For more help, see: SUPABASE_TROUBLESHOOTING.md" -ForegroundColor Cyan

