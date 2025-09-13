@echo off
echo Starting EF Clash Development Environment...
echo.

echo [1/3] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Installing backend dependencies...
cd backend
call python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Starting development servers...
echo.
echo Starting FastAPI backend on http://localhost:8000
start "EF Clash Backend" cmd /k "python main.py"

cd ..
echo Starting React frontend on http://localhost:3000
timeout /t 3 /nobreak > nul
start "EF Clash Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo EF Clash Development Environment Started
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Backend API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause > nul
