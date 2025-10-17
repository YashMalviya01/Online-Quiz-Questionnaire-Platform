#!/bin/bash

# Online Quiz Assessment Platform - Docker Demo Setup
# Automated setup script for Docker Compose deployment on macOS/Linux

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

create_env_file() {
    local service_dir="$1"
    local label="$2"
    local example_file="$service_dir/.env.example"
    local target_file="$service_dir/.env"

    if [ -f "$target_file" ]; then
        echo -e "${GREEN}✓ ${label} .env already exists${NC}"
    elif [ -f "$example_file" ]; then
        cp "$example_file" "$target_file"
        echo -e "${GREEN}✓ Created ${label} .env from template${NC}"
    else
        if [ "$label" = "Backend" ]; then
        cat <<'EOF' > "$target_file"
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
EOF
        else
            cat <<'EOF' > "$target_file"
VITE_API_BASE_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
VITE_API_PORT=4000
VITE_PUBLIC_TUNNEL_URL=https://smart-quiz-platform.pentacoresolutions.in
EOF
        fi
        echo -e "${YELLOW}⚠ ${label} .env template missing; generated defaults${NC}"
    fi
}

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Online Quiz Assessment Platform${NC}"
echo -e "${CYAN}  Docker-based Demo Setup${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check Docker
echo -e "${YELLOW}[1/5] Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker is installed: ${DOCKER_VERSION}${NC}"
else
    echo -e "${RED}✗ Docker is NOT installed!${NC}"
    echo -e "${YELLOW}  Please install Docker Desktop first:${NC}"
    echo -e "${CYAN}  https://www.docker.com/products/docker-desktop/${NC}"
    echo ""
    echo -e "${GRAY}  Press any key to exit...${NC}"
    read -n 1 -s
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo -e "${RED}✗ Docker daemon is not running!${NC}"
    echo -e "${YELLOW}  Please start Docker Desktop and try again${NC}"
    echo ""
    echo -e "${GRAY}  Press any key to exit...${NC}"
    read -n 1 -s
    exit 1
fi
echo ""

# Check Docker Compose
echo -e "${YELLOW}Checking Docker Compose...${NC}"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}✓ Docker Compose is installed: ${COMPOSE_VERSION}${NC}"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✓ Docker Compose is installed: ${COMPOSE_VERSION}${NC}"
else
    echo -e "${RED}✗ Docker Compose is NOT installed!${NC}"
    echo -e "${YELLOW}  Please install Docker Compose${NC}"
    exit 1
fi
echo ""

# Prepare environment files
echo -e "${YELLOW}[2/5] Preparing environment files...${NC}"
create_env_file "../backend" "Backend"
create_env_file "../frontend" "Frontend"
echo ""

# Start Docker Compose services
echo -e "${YELLOW}[3/5] Starting all services...${NC}"
echo -e "${CYAN}  This will start MongoDB, Backend, and Frontend containers.${NC}"
echo -e "${CYAN}  Please wait, this may take a few minutes on first run...${NC}"
echo ""

# Change to parent directory where docker-compose.yml is located
cd ..
$COMPOSE_CMD up -d --build
cd "RUN ON MAC"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All services started successfully!${NC}"
else
    echo -e "${RED}✗ Failed to start services${NC}"
    echo -e "${YELLOW}  Please check Docker Desktop is running${NC}"
    echo ""
    echo -e "${GRAY}  Press any key to exit...${NC}"
    read -n 1 -s
    exit 1
fi
echo ""

# Wait for services to be ready
echo -e "${YELLOW}[4/5] Waiting for services to be ready...${NC}"
echo -e "${CYAN}  Waiting 15 seconds for MongoDB and backend to initialize...${NC}"
sleep 15
echo -e "${GREEN}✓ Services should be ready${NC}"
echo ""

# Load Demo Data
echo -e "${YELLOW}[5/5] Loading demo data...${NC}"
echo -e "${CYAN}  This will create sample users, quizzes, and results.${NC}"
echo ""

cd ..
$COMPOSE_CMD exec -T backend node src/utils/seedData.js
cd "RUN ON MAC"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Demo data loaded successfully!${NC}"
    echo ""
    echo -e "${CYAN}  Created:${NC}"
    echo -e "${WHITE}  • 7 users (1 admin, 1 instructor, 5 students)${NC}"
    echo -e "${WHITE}  • 3 question banks (JavaScript, Python, Mathematics)${NC}"
    echo -e "${WHITE}  • 1 quiz with 2 questions (Multiple Choice + Code)${NC}"
    echo -e "${WHITE}  • 3 sample results${NC}"
else
    echo ""
    echo -e "${RED}✗ Failed to load demo data${NC}"
    echo -e "${YELLOW}  You can try manually:${NC}"
    echo -e "${CYAN}  $COMPOSE_CMD exec backend node src/utils/seedData.js${NC}"
fi
echo ""

# Open Browser (macOS specific)
echo -e "${YELLOW}Opening browser...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    elif command -v gnome-open &> /dev/null; then
        gnome-open http://localhost:3000
    fi
fi
echo ""

echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  Demo Setup Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${WHITE}  Frontend: ${NC}${CYAN}http://localhost:3000${NC}"
echo -e "${WHITE}  Backend:  ${NC}${CYAN}http://localhost:4000${NC}"
echo -e "${WHITE}  MongoDB:  ${NC}${CYAN}localhost:27017${NC}"
echo -e "${WHITE}  Public Tunnel: ${NC}${CYAN}https://smart-quiz-platform.pentacoresolutions.in${NC}"
echo -e "${WHITE}  Ngrok Dashboard: ${NC}${CYAN}http://localhost:4040${NC}"
echo ""
echo -e "${WHITE}  Demo Credentials:${NC}"
echo -e "${WHITE}  • Admin:      ${NC}${CYAN}admin@quiz.com${NC} / ${CYAN}admin123${NC}"
echo -e "${WHITE}  • Instructor: ${NC}${CYAN}instructor@quiz.com${NC} / ${CYAN}instructor123${NC}"
echo -e "${WHITE}  • Students:   ${NC}${CYAN}aman|chetan|vanisha|shashank|yash@student.com${NC} / ${CYAN}student123${NC}"
echo ""
echo -e "${WHITE}  Useful Commands:${NC}"
echo -e "${WHITE}  • View logs:    ${NC}${CYAN}$COMPOSE_CMD logs -f${NC}"
echo -e "${WHITE}  • Stop all:     ${NC}${CYAN}$COMPOSE_CMD down${NC}"
echo -e "${WHITE}  • Restart:      ${NC}${CYAN}$COMPOSE_CMD restart${NC}"
echo ""
echo -e "${WHITE}  Documentation: ${NC}${CYAN}README.md${NC}"
echo ""
echo -e "${GRAY}  Press any key to exit...${NC}"
read -n 1 -s
