@echo off
echo ========================================
echo    DevNote V2 - MERN Blog Platform
echo ========================================
echo.
echo Installing dependencies...
call npm run install-all
echo.
echo Starting the application...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.
call npm run dev