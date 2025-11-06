@echo off
REM Question Bank System - Installation Script for Windows
REM Installs dependencies for question generation features

echo ================================================================
echo    Question Bank System - Setup Script
echo    No external API keys required
echo ================================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the backend directory.
    exit /b 1
)

echo [INFO] Installing dependencies...
call npm install

echo.
echo [SUCCESS] Dependencies installed successfully!
echo.
echo [INFO] Next Steps:
echo.
echo 1. Start the backend server:
echo    npm run dev
echo.
echo 2. Access question generation:
echo    - Login as instructor or admin
echo    - Navigate to Quiz Configuration
echo    - Click 'Generate Questions'
echo.
echo 3. Question Bank Features:
echo    - 4000+ pre-built questions
echo    - Multiple languages (JavaScript, Python, Java, C++)
echo    - Topic-based filtering
echo    - Multiple question types (MCQ, True/False, Fill-in-the-blank, Coding)
echo.
echo [INFO] For more information, see:
echo    - README.md (Question Generation section)
echo.
echo [SUCCESS] Setup complete! Happy quiz generating!
echo.
pause
