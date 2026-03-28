@echo off
title Issara Furniture (World Wide Web Mode)
cd /d "%~dp0"

echo ==========================================================
echo    Issara Furniture System (Internet Mode)
echo ==========================================================
echo.
echo [1] Starting the Local Database...
start /b cmd /c "cd backend && node server.js"

echo [2] Giving it 3 seconds to warm up...
timeout /t 3 /nobreak > NUL

echo [3] Creating a Worldwide Magic Link (Please wait)...
echo ----------------------------------------------------------
echo Look for a URL like: https://something.trycloudflare.com
echo Customers can access the system using that link anywhere!
echo ==========================================================
npx install-local cloudflared || npx --yes cloudflared tunnel --url http://localhost:5000

pause
