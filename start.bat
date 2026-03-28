@echo off
title Issara Furniture Loyalty System
:: Switch to the directory where this script is located
cd /d "%~dp0"

echo ==========================================================
echo        Issara Furniture Loyalty System (Live)
echo ==========================================================
echo.
echo Starting the system...
echo * Please keep this black window open while using the system.
echo.

:: Automatically open the browser after waiting 3 seconds for server to start
start /b cmd /c "timeout /t 3 /nobreak > NUL & start http://localhost:5000/owner"

:: Move to backend folder and start server
cd backend
echo [System] Starting Node.js backend...
node server.js

:: Keep window open if server crashes
pause
