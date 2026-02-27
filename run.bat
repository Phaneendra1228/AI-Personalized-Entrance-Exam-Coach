@echo off
echo ==========================================
echo Starting AI Entrance Exam Coach
echo ==========================================
echo.

echo [1/2] Starting Backend Server (Port 8000)...
start "AI Coach Backend" cmd /k "cd backend && ..\.venv\Scripts\python.exe -m uvicorn main:app --reload --reload-exclude *.db --reload-exclude *.db-journal"

echo [2/2] Starting Frontend Server (Port 3000)...
start "AI Coach Frontend" cmd /k "cd frontend && set TURBOPACK=0 && npm run dev"

echo.
echo Waiting 5 seconds for servers to start...
timeout /t 5 /nobreak > nul

echo.
echo Opening the app in your default browser...
start http://localhost:3000

echo.
echo Both servers are now running in background windows!
echo DO NOT close the new windows if you want to keep the app running.
echo.
pause
