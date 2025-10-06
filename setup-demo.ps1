# College Major Project Demo Setup Script
# Online Quiz Platform with AI Proctoring

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  College Major Project Demo Setup" -ForegroundColor Cyan
Write-Host "  Online Quiz Platform with AI Proctoring" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "[1/5] Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "✓ MongoDB is running on port 27017" -ForegroundColor Green
} else {
    Write-Host "✗ MongoDB is NOT running!" -ForegroundColor Red
    Write-Host "  Starting MongoDB with Docker..." -ForegroundColor Yellow
    docker start mongodb 2>$null
    if ($LASTEXITCODE -ne 0) {
        docker run -d --name mongodb -p 27017:27017 mongo:latest
    }
    Start-Sleep -Seconds 3
}
Write-Host ""

# Check Backend
Write-Host "[2/5] Checking Backend..." -ForegroundColor Yellow
$backendRunning = Test-NetConnection -ComputerName localhost -Port 4000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($backendRunning) {
    Write-Host "✓ Backend is running on port 4000" -ForegroundColor Green
} else {
    Write-Host "✗ Backend is NOT running!" -ForegroundColor Red
    Write-Host "  Starting backend in new window..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
    Start-Sleep -Seconds 5
}
Write-Host ""

# Check Frontend
Write-Host "[3/5] Checking Frontend..." -ForegroundColor Yellow
$frontendRunning = $false
foreach ($port in @(5173, 5174, 5175)) {
    if (Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue) {
        $frontendRunning = $true
        Write-Host "✓ Frontend is running on port $port" -ForegroundColor Green
        break
    }
}
if (-not $frontendRunning) {
    Write-Host "✗ Frontend is NOT running!" -ForegroundColor Red
    Write-Host "  Starting frontend in new window..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
    Start-Sleep -Seconds 5
}
Write-Host ""

# Load Demo Data
Write-Host "[4/5] Loading demo data..." -ForegroundColor Yellow
Write-Host "  This will create sample quizzes, users, and results." -ForegroundColor Cyan
Write-Host "  Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/seed" -Method Post -ContentType "application/json" -ErrorAction Stop
    Write-Host "✓ Demo data loaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Created:" -ForegroundColor Cyan
    Write-Host "  • 6 users (1 admin, 1 instructor, 4 students)" -ForegroundColor White
    Write-Host "  • 5 quizzes (JS, Python, Web Dev, DSA, Database)" -ForegroundColor White
    Write-Host "  • 20+ questions with all types" -ForegroundColor White
    Write-Host "  • 5 sample results" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to load demo data" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Please check if backend is running on port 4000" -ForegroundColor Yellow
}
Write-Host ""

# Open Browser
Write-Host "[5/5] Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5174"
Write-Host "✓ Browser opened" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Demo Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5174" -ForegroundColor Cyan
Write-Host "  Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:4000" -ForegroundColor Cyan
Write-Host "  MongoDB:  " -NoNewline -ForegroundColor White
Write-Host "localhost:27017" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Demo Credentials:" -ForegroundColor Yellow
Write-Host "  • Admin:      " -NoNewline -ForegroundColor White
Write-Host "admin@demo.com / demo123" -ForegroundColor Cyan
Write-Host "  • Instructor: " -NoNewline -ForegroundColor White
Write-Host "professor@demo.com / demo123" -ForegroundColor Cyan
Write-Host "  • Student:    " -NoNewline -ForegroundColor White
Write-Host "alice@demo.com / demo123" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Note: " -NoNewline -ForegroundColor Yellow
Write-Host "Authentication is disabled for demo." -ForegroundColor White
Write-Host "  You're automatically logged in as admin." -ForegroundColor White
Write-Host ""
Write-Host "  Documentation:" -ForegroundColor Yellow
Write-Host "  • DEMO_GUIDE.md - Complete demonstration guide" -ForegroundColor White
Write-Host "  • PROJECT_PRESENTATION.md - Full project details" -ForegroundColor White
Write-Host "  • README.md - Setup and features" -ForegroundColor White
Write-Host ""
Write-Host "  Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
