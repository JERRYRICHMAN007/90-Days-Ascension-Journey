# PowerShell script to create .env file with Supabase connection
# Run this script: .\create-env.ps1

$envContent = @"
# ============================================
# SUPABASE CONFIGURATION
# ============================================
# Get from: Supabase Dashboard → Settings → API
SUPABASE_URL=https://qeezmjebcgtgvuyfqjxb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZXptamViY2d0Z3Z1eWZxanhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzQ2MzQsImV4cCI6MjA4MDgxMDYzNH0.bQEybGJkfzKOW60LHpTcaOEGV2-mqcnzOpSPURSjNKA
SUPABASE_SERVICE_ROLE_KEY=sb_secret_TJUJkBCLYqFi8oq0fuUYDw_BVOYn7cW

# ============================================
# SUPABASE DATABASE CONNECTION
# ============================================
DATABASE_URL=postgresql://postgres:jjrRichman007@db.qeezmjebcgtgvuyfqjxb.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&sslmode=require

# Optional: Direct connection for migrations (without pgbouncer)
DIRECT_URL=postgresql://postgres:jjrRichman007@db.qeezmjebcgtgvuyfqjxb.supabase.co:5432/postgres?sslmode=require

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=4000
HOST=127.0.0.1
NODE_ENV=development

# ============================================
# JWT SECRETS (Generated secure random strings)
# ============================================
JWT_ACCESS_SECRET=3qtuIsVee5HrIpJCEfazg672Ba/u3zcmclmt5QGy5buS1hbSaEeU4RHhhUNiuvPu9RX8KlPPUib8McKNOVGM2g==
JWT_REFRESH_SECRET=0sxB7VEbiYyp/E3VGuiNDlyWA1I1ryQfIC9dgepo9/oV0VkdcYLVqA3+XxIAVPiLUZDwgqBiak6qiGsbbvFsDg==

# ============================================
# CORS & FRONTEND URL
# ============================================
APP_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# ============================================
# EMAIL (Optional - for password reset)
# ============================================
MAIL_API_KEY=

# ============================================
# FILE STORAGE (Optional)
# ============================================
S3_ENDPOINT=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_FORCE_PATH_STYLE=false
CDN_URL=
FILE_MAX_BYTES=5242880
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host "📝 Connection string configured with SSL mode" -ForegroundColor Cyan
Write-Host "🔐 JWT secrets generated and configured" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: If database connection fails:" -ForegroundColor Yellow
Write-Host "   1. Check if your Supabase database is paused (free tier)" -ForegroundColor Yellow
Write-Host "   2. Go to Supabase Dashboard → Settings → Database" -ForegroundColor Yellow
Write-Host "   3. Click 'Restore' or make a request to wake it up" -ForegroundColor Yellow
Write-Host "   4. Wait 1-2 minutes for database to become active" -ForegroundColor Yellow

