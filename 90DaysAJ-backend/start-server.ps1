# PowerShell script to start the backend server
Write-Host "🚀 Starting 90 Days Ascension Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "   Please create a .env file with your Supabase credentials." -ForegroundColor Yellow
    Write-Host "   See ENV_TEMPLATE.txt for reference." -ForegroundColor Yellow
    Write-Host ""
}

# Check if node_modules exists
if (-not (Test-Path node_modules)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start the server
Write-Host "▶️  Starting server on http://localhost:5001..." -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev


