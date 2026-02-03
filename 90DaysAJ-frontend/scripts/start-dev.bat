@echo off
cd /d "%~dp0"
set VITE_PATH=%~dp0node_modules\vite\bin\vite.js
node "%VITE_PATH%"

