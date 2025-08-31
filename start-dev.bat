@echo off
echo Starting DevNote V2 Development Environment...
echo.

echo Installing dependencies...
call npm run install-all

echo.
echo Starting development servers...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.

start cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start cmd /k "cd client && npm start"

echo.
echo Development servers are starting...
echo Check the opened terminal windows for status.
pause