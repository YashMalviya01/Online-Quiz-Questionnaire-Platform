@echo off
echo ========================================
echo   College Major Project Demo Setup
echo   Online Quiz Platform with AI Proctoring
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/5] Checking MongoDB...
netstat -ano | findstr :27017 > nul
if %errorlevel% == 0 (
    echo ✓ MongoDB is running on port 27017
) else (
    echo ✗ MongoDB is NOT running!
    echo   Please start MongoDB first:
    echo   docker run -d -p 27017:27017 mongo
    pause
    exit /b 1
)
echo.

REM Check if backend is running
echo [2/5] Checking Backend...
netstat -ano | findstr :4000 > nul
if %errorlevel% == 0 (
    echo ✓ Backend is running on port 4000
) else (
    echo ✗ Backend is NOT running!
    echo   Starting backend in new window...
    start "Backend Server" cmd /k "cd backend && npm run dev"
    timeout /t 5 > nul
)
echo.

REM Check if frontend is running
echo [3/5] Checking Frontend...
netstat -ano | findstr "5173 5174 5175" > nul
if %errorlevel% == 0 (
    echo ✓ Frontend is running
) else (
    echo ✗ Frontend is NOT running!
    echo   Starting frontend in new window...
    start "Frontend Server" cmd /k "cd frontend && npm run dev"
    timeout /t 5 > nul
)
echo.

REM Load demo data
echo [4/5] Loading demo data...
echo   This will create sample quizzes, users, and results.
echo   Press any key to continue...
pause > nul

curl -X POST http://localhost:4000/api/seed -H "Content-Type: application/json" > nul 2>&1

if %errorlevel% == 0 (
    echo ✓ Demo data loaded successfully!
    echo.
    echo   Created:
    echo   • 6 users (1 admin, 1 instructor, 4 students)
    echo   • 5 quizzes (JS, Python, Web Dev, DSA, Database)
    echo   • 20+ questions with all types
    echo   • 5 sample results
) else (
    echo ✗ Failed to load demo data
    echo   Please check if backend is running on port 4000
)
echo.

REM Open browser
echo [5/5] Opening browser...
start http://localhost:5174
echo ✓ Browser opened
echo.

echo ========================================
echo   Demo Setup Complete!
echo ========================================
echo.
echo   Frontend: http://localhost:5174
echo   Backend:  http://localhost:4000
echo   MongoDB:  localhost:27017
echo.
echo   Demo Credentials:
echo   • Admin:      admin@demo.com / demo123
echo   • Instructor: professor@demo.com / demo123
echo   • Student:    alice@demo.com / demo123
echo.
echo   Note: Authentication is disabled for demo.
echo   You're automatically logged in as admin.
echo.
echo   Press any key to exit...
pause > nul
