@echo off
echo ========================================
echo   Quick Fix - Restart Without Llama
echo ========================================
echo.

echo Stopping all services...
docker-compose down
echo.

echo Starting core services (MongoDB, Backend, Frontend, Ngrok)...
docker-compose up -d --build
echo.

echo Waiting for services to be ready...
timeout /t 15 /nobreak > nul
echo.

echo Loading demo data...
docker-compose exec -T backend node src/utils/seedData.js
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:4000
echo   MongoDB:  localhost:27017
echo   Public:   https://smart-quiz-platform.pentacoresolutions.in
echo.
echo   Demo Credentials:
echo   • Admin:      admin@quiz.com / admin123
echo   • Instructor: instructor@quiz.com / instructor123
echo   • Students:   student@student.com / student123
echo.
echo   Note: Llama AI is disabled (had download issues)
echo   Alternative: Use Google Gemini API
echo   1. Get API key: https://makersuite.google.com/app/apikey
echo   2. Add to backend\.env: GEMINI_API_KEY=your_key
echo   3. Restart backend: docker-compose restart backend
echo.
echo   Or setup Llama later:
echo   1. Run: docker model pull ai/llama3.3:70B-Q4_0
echo   2. Run: docker model serve ai/llama3.3:70B-Q4_0 --port 8000
echo.
echo Opening browser...
start http://localhost:3000
echo.
pause
