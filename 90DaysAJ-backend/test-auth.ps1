# Test Authentication Endpoints

Write-Host "`n=== Testing Authentication ===" -ForegroundColor Cyan

# Test 1: Register a new user
Write-Host "`n1. Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = "test@example.com"
    password = "Test1234!"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:4000/v1/auth/register" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $registerBody
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host "User ID: $($registerData.data.user.id)" -ForegroundColor Cyan
    Write-Host "Email: $($registerData.data.user.email)" -ForegroundColor Cyan
    
    # Save tokens for login test
    $global:accessToken = $registerData.data.tokens.accessToken
    $global:refreshToken = $registerData.data.tokens.refreshToken
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

# Test 2: Login
Write-Host "`n2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "Test1234!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:4000/v1/auth/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginBody
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "User: $($loginData.data.user.email)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan

