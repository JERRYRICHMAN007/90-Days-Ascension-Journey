@echo off
echo Starting 90 Days Ascension Backend Server...
echo.

REM Check if .env exists
if not exist .env (
    echo WARNING: .env file not found!
    echo Please create a .env file with your Supabase credentials.
    echo See ENV_TEMPLATE.txt for reference.
    echo.
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Start the server
echo Starting server on http://localhost:5001...
echo Press Ctrl+C to stop the server
echo.

call npm run dev

