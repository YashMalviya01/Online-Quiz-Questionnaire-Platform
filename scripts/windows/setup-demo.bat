@echo off
echo ========================================
echo   Online Quiz Assessment Platform
echo   Docker-based Demo Setup
echo ========================================
echo.

REM Check if Docker is running
echo [1/5] Checking Docker...
docker --version > nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Docker is installed
) else (
    echo ✗ Docker is NOT installed!
    echo   Please install Docker Desktop first:
    echo   https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo.

REM Prepare environment files
echo [2/5] Preparing environment files...
call :EnsureEnv "..\..\backend" "backend"
call :EnsureEnv "..\..\frontend" "frontend"
echo.

REM Start Docker Compose services
echo [3/5] Starting all services...
echo   This will start MongoDB, Backend, and Frontend containers.
echo   Please wait, this may take a few minutes on first run...
echo.

cd ..\..
docker-compose up -d --build
cd scripts\windows

if %errorlevel% == 0 (
    echo ✓ All services started successfully!
) else (
    echo ✗ Failed to start services
    echo   Please check Docker Desktop is running
    pause
    exit /b 1
)
echo.

REM Wait for services to be ready
echo [4/5] Waiting for services to be ready...
timeout /t 15 /nobreak > nul
echo ✓ Services should be ready
echo.

echo [5/6] Question Bank System...
echo   ✓ Question generation ready with pre-built question bank
echo   • 4000+ questions across JavaScript, Python, Java, C++
echo   • Topic-based filtering and difficulty levels
echo   • Multiple question types (MCQ, True/False, Fill-in-the-blank, Coding)
echo.

REM Load demo data
echo [6/6] Loading demo data...
echo   This will create sample users, quizzes, and results.
echo.

cd ..\..
docker-compose exec -T backend node src/utils/seedData.js
cd scripts\windows

if %errorlevel% == 0 (
    echo.
    echo ✓ Demo data loaded successfully!
    echo.
    echo   Created:
    echo   • 7 users (1 admin, 1 instructor, 5 students)
    echo   • 3 question banks (JavaScript, Python, Mathematics)
    echo   • 1 quiz with 2 questions (Multiple Choice + Code)
    echo   • 3 sample results
) else (
    echo.
    echo ✗ Failed to load demo data
    echo   You can try manually: docker-compose exec backend node src/utils/seedData.js
)
echo.

REM Open browser
echo Opening browser...
start http://localhost:3000
echo.

echo ========================================
echo   Demo Setup Complete!
echo ========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:4000
echo   MongoDB:  localhost:27017
echo   Public Tunnel: https://smart-quiz-platform.pentacoresolutions.in
echo   Ngrok Dashboard: http://localhost:4040
echo.
echo   Demo Credentials:
echo   • Admin:      admin@quiz.com / admin123
echo   • Instructor: instructor@quiz.com / instructor123
echo   • Students:   aman^|chetan^|vanisha^|shashank^|yash@student.com / student123
echo.
echo   Useful Commands:
echo   • View logs:       docker-compose logs -f
echo   • Stop all:        docker-compose down
echo   • Restart:         docker-compose restart
echo.
echo   Question Generation:
echo   • Generate quizzes with the question bank
echo   • Go to: Manage Quizzes ^> Generate Questions
echo   • 4000+ questions, topic-based, multiple types
echo.
echo   Documentation: README.md ^| docs\setup\GETTING_STARTED.md
echo.
echo   Press any key to exit...
pause > nul

goto :EOF

:EnsureEnv
set "dir=%~1"
set "label=%~2"

if exist "%dir%\.env" (
    echo   ✓ %label% .env already exists
    goto :EOF
)

if exist "%dir%\.env.example" (
    copy /Y "%dir%\.env.example" "%dir%\.env" > nul
    echo   ✓ Created %label% .env from template
    goto :EOF
)

if /I "%label%"=="backend" (
    > "%dir%\.env" (
        echo PORT=4000
        echo NODE_ENV=development
        echo MONGO_URI=mongodb://mongo:27017/quiz-proctor
        echo JWT_SECRET=supersecretjwt
        echo SESSION_SECRET=supersecretsession
        echo FRONTEND_URL=https://smart-quiz-platform.pentacoresolutions.in
        echo CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
        echo CORS_ALLOW_ALL=false
        echo CORS_DOMAIN=https://smart-quiz-platform.pentacoresolutions.in
        echo LOG_LEVEL=info
        echo GEMINI_API_KEY=your-gemini-api-key-here
        echo USE_DOCKER=false
    )
) else (
    > "%dir%\.env" (
        echo VITE_API_BASE_URL=http://localhost:4000
        echo VITE_WS_URL=ws://localhost:4000
        echo VITE_API_PORT=4000
        echo VITE_PUBLIC_TUNNEL_URL=https://smart-quiz-platform.pentacoresolutions.in
    )
)
echo   Generated %label% .env with defaults
goto :EOF
