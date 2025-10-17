# Online Quiz Assessment Platform - Docker Demo Setup
# Automated setup script for Docker Compose deployment

function Ensure-EnvFile {
    param(
        [string]$ServiceDir,
        [string]$Label,
        [string]$DefaultContent
    )

    $targetPath = Join-Path $ServiceDir ".env"
    $examplePath = Join-Path $ServiceDir ".env.example"

    if (Test-Path $targetPath) {
        Write-Host " ✓ $Label .env already exists" -ForegroundColor Green
    }
    elseif (Test-Path $examplePath) {
        Copy-Item $examplePath $targetPath
        Write-Host " ✓ Created $Label .env from template" -ForegroundColor Green
    }
    else {
        $DefaultContent | Set-Content -Path $targetPath -Encoding UTF8
        Write-Host " ⚠ $Label template missing; generated defaults" -ForegroundColor Yellow
    }
}

$backendDefaultEnv = @"
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://mongo:27017/quiz-proctor
JWT_SECRET=supersecretjwt
SESSION_SECRET=supersecretsession
FRONTEND_URL=https://smart-quiz-platform.pentacoresolutions.in
CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
CORS_ALLOW_ALL=false
CORS_DOMAIN=https://smart-quiz-platform.pentacoresolutions.in
LOG_LEVEL=info
"@

$frontendDefaultEnv = @"
VITE_API_BASE_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
VITE_API_PORT=4000
VITE_PUBLIC_TUNNEL_URL=https://smart-quiz-platform.pentacoresolutions.in
"@

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Online Quiz Assessment Platform" -ForegroundColor Cyan
Write-Host "  Docker-based Demo Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "[1/5] Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host " Docker is installed: $dockerVersion" -ForegroundColor Green
    }
} catch {
    Write-Host " Docker is NOT installed!" -ForegroundColor Red
    Write-Host "  Please install Docker Desktop first:" -ForegroundColor Yellow
    Write-Host "  https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""

# Prepare environment files
$projectRoot = (Get-Item "..").FullName
Write-Host "[2/5] Preparing environment files..." -ForegroundColor Yellow
Ensure-EnvFile -ServiceDir (Join-Path $projectRoot "backend") -Label "Backend" -DefaultContent $backendDefaultEnv
Ensure-EnvFile -ServiceDir (Join-Path $projectRoot "frontend") -Label "Frontend" -DefaultContent $frontendDefaultEnv
Write-Host "" 

# Navigate to project root (parent directory)
$originalPath = Get-Location
Set-Location ..

# Build and start services
Write-Host "[3/5] Building and starting Docker containers..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes on first run..." -ForegroundColor Gray

try {
    docker-compose up -d --build
    if ($LASTEXITCODE -eq 0) {
        Write-Host " Containers are running" -ForegroundColor Green
    } else {
        throw "Docker Compose failed"
    }
} catch {
    Write-Host " Failed to start containers" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Try running manually:" -ForegroundColor Yellow
    Write-Host "  docker-compose up -d --build" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Set-Location $originalPath
    exit 1
}

Write-Host ""

# Wait for services to be ready
Write-Host "[4/5] Waiting for services to be ready..." -ForegroundColor Yellow
Write-Host "  Waiting 15 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 15
Write-Host " Services should be ready" -ForegroundColor Green
Write-Host ""

# Load demo data
Write-Host "[5/5] Loading demo data..." -ForegroundColor Yellow
try {
    docker-compose exec -T backend node src/utils/seedData.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host " Demo data loaded successfully" -ForegroundColor Green
    } else {
        Write-Host " Demo data loading had issues (may already exist)" -ForegroundColor Yellow
    }
} catch {
    Write-Host " Could not load demo data: $_" -ForegroundColor Yellow
    Write-Host "  You can load it manually later:" -ForegroundColor Gray
    Write-Host "  docker-compose exec backend node src/utils/seedData.js" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host " Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host " Backend API: http://localhost:4000/api" -ForegroundColor Cyan
Write-Host " Public Tunnel: https://smart-quiz-platform.pentacoresolutions.in" -ForegroundColor Cyan
Write-Host " Ngrok Dashboard: http://localhost:4040" -ForegroundColor Cyan
Write-Host ""
Write-Host " Demo Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:" -ForegroundColor White
Write-Host "    Email: admin@quiz.com" -ForegroundColor Gray
Write-Host "    Password: admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "  Instructor:" -ForegroundColor White
Write-Host "    Email: instructor@quiz.com" -ForegroundColor Gray
Write-Host "    Password: instructor123" -ForegroundColor Gray
Write-Host ""
Write-Host "  Students:" -ForegroundColor White
Write-Host "    Emails: aman|chetan|vanisha|shashank|yash@student.com" -ForegroundColor Gray
Write-Host "    Password: student123" -ForegroundColor Gray
Write-Host ""
Write-Host " Documentation:" -ForegroundColor Yellow
Write-Host "  See README.md for full documentation" -ForegroundColor Gray
Write-Host ""
Write-Host " To stop: docker-compose stop" -ForegroundColor Yellow
Write-Host "  To cleanup: docker-compose down -v" -ForegroundColor Yellow
Write-Host ""

# Return to original directory
Set-Location $originalPath

# Try to open browser
Write-Host "Opening browser..." -ForegroundColor Gray
try {
    Start-Process "http://localhost:3000"
} catch {
    Write-Host "Could not open browser automatically." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
