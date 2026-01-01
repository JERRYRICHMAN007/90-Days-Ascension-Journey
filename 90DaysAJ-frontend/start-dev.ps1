# PowerShell script to start the dev server
$ErrorActionPreference = "Stop"

Write-Host "Starting Vite development server..." -ForegroundColor Green

# Navigate to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Get full path to vite
$vitePath = Join-Path $scriptPath "node_modules\vite\bin\vite.js"

# Run vite using node directly with full path
node $vitePath

