# Online Quiz Assessment Platform - Docker Demo Setup
# Automated setup script for Docker Compose deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Online Quiz Assessment Platform" -ForegroundColor Cyan
Write-Host "  Docker-based Demo Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "[1/4] Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Docker is NOT installed!" -ForegroundColor Red
    Write-Host "  Please install Docker Desktop first:" -ForegroundColor Yellow
    Write-Host "  https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
Write-Host ""

# Start Docker Compose services
Write-Host "[2/4] Starting all services..." -ForegroundColor Yellow
Write-Host "  This will start MongoDB, Backend, and Frontend containers." -ForegroundColor Cyan
Write-Host "  Please wait, this may take a few minutes on first run..." -ForegroundColor Cyan
Write-Host ""

docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ All services started successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to start services" -ForegroundColor Red
    Write-Host "  Please check Docker Desktop is running" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
Write-Host ""

# Wait for services to be ready
Write-Host "[3/4] Waiting for services to be ready..." -ForegroundColor Yellow
Write-Host "  Waiting 15 seconds for MongoDB and backend to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 15
Write-Host "✓ Services should be ready" -ForegroundColor Green
Write-Host ""

# Load Demo Data
Write-Host "[4/4] Loading demo data..." -ForegroundColor Yellow
Write-Host "  This will create sample users, quizzes, and results." -ForegroundColor Cyan
Write-Host ""

try {
    docker-compose exec -T backend node src/utils/seedData.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Demo data loaded successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Created:" -ForegroundColor Cyan
        Write-Host "  • 6 users (1 admin, 1 instructor, 4 students)" -ForegroundColor White
        Write-Host "  • 3 question banks (JavaScript, Python, Mathematics)" -ForegroundColor White
        Write-Host "  • 1 quiz with 2 questions (Multiple Choice + Code)" -ForegroundColor White
        Write-Host "  • 3 sample results" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "✗ Failed to load demo data" -ForegroundColor Red
        Write-Host "  You can try manually:" -ForegroundColor Yellow
        Write-Host "  docker-compose exec backend node src/utils/seedData.js" -ForegroundColor Cyan
    }
} catch {
    Write-Host ""
    Write-Host "✗ Error loading demo data: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  You can try manually:" -ForegroundColor Yellow
    Write-Host "  docker-compose exec backend node src/utils/seedData.js" -ForegroundColor Cyan
}
Write-Host ""

# Open Browser
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Demo Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:4000" -ForegroundColor Cyan
Write-Host "  MongoDB:  " -NoNewline -ForegroundColor White
Write-Host "localhost:27017" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Demo Credentials:" -ForegroundColor Yellow
Write-Host "  • Admin:      " -NoNewline -ForegroundColor White
Write-Host "admin@quiz.com / admin123" -ForegroundColor Cyan
Write-Host "  • Instructor: " -NoNewline -ForegroundColor White
Write-Host "instructor@quiz.com / instructor123" -ForegroundColor Cyan
Write-Host "  • Student:    " -NoNewline -ForegroundColor White
Write-Host "alice@student.com / student123" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Useful Commands:" -ForegroundColor Yellow
Write-Host "  • View logs:    " -NoNewline -ForegroundColor White
Write-Host "docker-compose logs -f" -ForegroundColor Cyan
Write-Host "  • Stop all:     " -NoNewline -ForegroundColor White
Write-Host "docker-compose down" -ForegroundColor Cyan
Write-Host "  • Restart:      " -NoNewline -ForegroundColor White
Write-Host "docker-compose restart" -ForegroundColor Cyan
Write-Host "  • Rebuild:      " -NoNewline -ForegroundColor White
Write-Host "docker-compose up -d --build" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Documentation:" -ForegroundColor Yellow
Write-Host "  • Quick Start:  " -NoNewline -ForegroundColor White
Write-Host "docs/QUICK_START.md" -ForegroundColor Cyan
Write-Host "  • Demo Guide:   " -NoNewline -ForegroundColor White
Write-Host "docs/DEMO_GUIDE.md" -ForegroundColor Cyan
Write-Host "  • API Docs:     " -NoNewline -ForegroundColor White
Write-Host "docs/API_QUICK_REFERENCE.md" -ForegroundColor Cyan
Write-Host "  • Full Docs:    " -NoNewline -ForegroundColor White
Write-Host "docs/README.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
