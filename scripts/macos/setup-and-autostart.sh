#!/bin/bash

###############################################################################
# Complete Setup & Auto-Start Script for Online Quiz Platform on Mac Mini M4
# This script will:
# 1. Install all dependencies
# 2. Configure the project
# 3. Set up auto-start on boot
# 4. Start all services
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform"
LOG_DIR="$PROJECT_DIR/logs"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
PLIST_FILE="$HOME/Library/LaunchAgents/com.quiz.platform.autostart.plist"

# Create logs directory
mkdir -p "$LOG_DIR"

clear
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                                      ║${NC}"
echo -e "${CYAN}║          🚀 Online Quiz Platform - Complete Setup 🚀                ║${NC}"
echo -e "${CYAN}║                    Mac Mini M4 Installer                            ║${NC}"
echo -e "${CYAN}║                                                                      ║${NC}"
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""

###############################################################################
# Helper Functions
###############################################################################

print_step() {
    echo ""
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

check_service() {
    local port=$1
    if lsof -i ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=${3:-30}
    local attempt=0
    
    echo -e "${YELLOW}⏳${NC} Waiting for $service_name on port $port..."
    
    while [ $attempt -lt $max_attempts ]; do
        if lsof -i ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    print_error "$service_name failed to start"
    return 1
}

check_docker_container() {
    local container_name=$1
    if docker ps --format '{{.Names}}' | grep -q "${container_name}"; then
        return 0
    else
        return 1
    fi
}

###############################################################################
# Step 1: System Requirements Check
###############################################################################

print_step "📋 Step 1/7: Checking System Requirements"

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS only"
    exit 1
fi
print_success "Running on macOS"

# Check for Homebrew
if ! check_command "brew"; then
    print_warning "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    print_success "Homebrew installed"
else
    print_success "Homebrew is installed"
fi

# Check for Node.js
if ! check_command "node"; then
    print_warning "Node.js not found. Installing via Homebrew..."
    brew install node
    print_success "Node.js installed"
else
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
fi

# Check for npm
if ! check_command "npm"; then
    print_error "npm not found. Please install Node.js first"
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
fi

# Check for Docker
if ! check_command "docker"; then
    print_error "Docker not found"
    print_info "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
else
    print_success "Docker is installed"
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_warning "Docker is not running. Starting Docker Desktop..."
        open -a Docker
        print_info "Waiting for Docker to start..."
        sleep 10
        
        # Wait for Docker to be ready
        MAX_WAIT=30
        COUNTER=0
        while [ $COUNTER -lt $MAX_WAIT ]; do
            if docker info > /dev/null 2>&1; then
                print_success "Docker is running"
                break
            fi
            COUNTER=$((COUNTER + 1))
            sleep 2
        done
        
        if [ $COUNTER -eq $MAX_WAIT ]; then
            print_error "Docker failed to start"
            exit 1
        fi
    else
        print_success "Docker is running"
    fi
fi

# Check for Ollama
if ! check_command "ollama"; then
    print_error "Ollama not found"
    print_info "Please install Ollama from: https://ollama.com/download"
    exit 1
else
    print_success "Ollama is installed"
fi

###############################################################################
# Step 2: Install Project Dependencies
###############################################################################

print_step "📦 Step 2/7: Installing Project Dependencies"

cd "$PROJECT_DIR"

# Install backend dependencies
print_info "Installing backend dependencies..."
cd "$PROJECT_DIR/backend"
if [ ! -d "node_modules" ]; then
    npm install
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd "$PROJECT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    npm install
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi

###############################################################################
# Step 3: Configure Environment Files
###############################################################################

print_step "⚙️  Step 3/7: Configuring Environment"

cd "$PROJECT_DIR"

# Backend .env
if [ ! -f "backend/.env" ]; then
    print_info "Creating backend .env file..."
    cp backend/.env.example backend/.env 2>/dev/null || cat > backend/.env << 'EOF'
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/quiz-proctor
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=https://smart-quiz-major-project.ngrok.app
CORS_ORIGIN=https://smart-quiz-major-project.ngrok.app
CORS_DOMAIN=smart-quiz-major-project.ngrok.app
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:7b
EOF
    print_success "Backend .env created"
else
    print_success "Backend .env already exists"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    print_info "Creating frontend .env file..."
    cp frontend/.env.example frontend/.env 2>/dev/null || cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:4000
VITE_PUBLIC_TUNNEL_URL=https://smart-quiz-major-project.ngrok.app
EOF
    print_success "Frontend .env created"
else
    print_success "Frontend .env already exists"
fi

###############################################################################
# Step 4: Configure Ngrok
###############################################################################

print_step "🌐 Step 4/7: Configuring Ngrok"

# Check if ngrok is configured
if [ -f "$HOME/.ngrok2/ngrok.yml" ] || [ -f "$HOME/Library/Application Support/ngrok/ngrok.yml" ]; then
    print_success "Ngrok is already configured"
else
    print_warning "Ngrok configuration not found"
    print_info "Please run: ngrok authtoken YOUR_AUTH_TOKEN"
    print_info "Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo ""
    read -p "Press Enter after configuring ngrok, or 's' to skip: " -n 1 -r
    echo ""
fi

###############################################################################
# Step 5: Start Ollama and Pull Model
###############################################################################

print_step "🤖 Step 5/7: Setting Up Ollama AI"

# Start Ollama server in background if not running
if ! pgrep -f "ollama serve" > /dev/null; then
    print_info "Starting Ollama service in background..."
    nohup ollama serve > "$LOG_DIR/ollama.log" 2>&1 &
    sleep 5
else
    print_success "Ollama service already running"
fi

# Wait for Ollama API
print_info "Waiting for Ollama API..."
MAX_WAIT=15
COUNTER=0
while [ $COUNTER -lt $MAX_WAIT ]; do
    if curl -s --connect-timeout 2 http://localhost:11434/api/tags > /dev/null 2>&1; then
        print_success "Ollama API is ready"
        break
    fi
    COUNTER=$((COUNTER + 1))
    sleep 2
done

if [ $COUNTER -eq $MAX_WAIT ]; then
    print_error "Ollama API not responding"
    exit 1
fi

# Check if model exists
if ollama list | grep -q "qwen2.5-coder:7b"; then
    print_success "Ollama model 'qwen2.5-coder:7b' is already available"
else
    print_info "Pulling Ollama model 'qwen2.5-coder:7b' (this may take a while)..."
    ollama pull qwen2.5-coder:7b
    print_success "Ollama model downloaded"
fi

###############################################################################
# Step 6: Start Services
###############################################################################

print_step "🚀 Step 6/7: Starting All Services"

cd "$PROJECT_DIR"

# Stop any existing services
print_info "Stopping any existing services..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
docker-compose down 2>/dev/null || true
sleep 3

# Start MongoDB
print_info "Starting MongoDB..."
docker-compose up -d mongo

# Wait for MongoDB to be accessible
print_info "Waiting for MongoDB to initialize (this may take up to 60 seconds)..."
if wait_for_service "MongoDB" 27017 30; then
    print_success "MongoDB is ready"
else
    print_error "MongoDB failed to become accessible"
    docker-compose logs --tail=30 mongo
    exit 1
fi

# Build & start backend/frontend containers
print_info "Building and starting backend/frontend containers..."
cd "$PROJECT_DIR"
docker-compose up -d --build backend frontend >> "$LOG_DIR/docker-build.log" 2>&1

# Wait for backend to be reachable
if wait_for_service "Backend" 4000 30; then
    print_success "Backend container is serving on port 4000"
else
    print_error "Backend container failed to expose port 4000"
    docker-compose logs --tail=50 backend
    exit 1
fi

# Wait for frontend to be reachable
if wait_for_service "Frontend" 5173 30; then
    print_success "Frontend container is serving on port 5173"
else
    print_error "Frontend container failed to expose port 5173"
    docker-compose logs --tail=50 frontend
    exit 1
fi

# Start Ngrok after frontend is ready
print_info "Starting Ngrok tunnel..."
docker-compose up -d --no-deps ngrok
sleep 5

# Get Ngrok URL
NGROK_URL="https://smart-quiz-major-project.ngrok.app"
if curl -s --connect-timeout 2 http://localhost:4040/api/tunnels 2>/dev/null | grep -q "public_url"; then
    TUNNEL_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -1)
    if [ -n "$TUNNEL_URL" ]; then
        NGROK_URL="$TUNNEL_URL"
    fi
fi
print_success "Ngrok tunnel: $NGROK_URL"

###############################################################################
# Step 7: Setup Auto-Start on Boot
###############################################################################

print_step "🔄 Step 7/7: Configuring Auto-Start on Boot"

# Create startup script
STARTUP_SCRIPT="$PROJECT_DIR/scripts/macos/boot-start.sh"
print_info "Creating boot startup script..."

cat > "$STARTUP_SCRIPT" << 'EOFSCRIPT'
#!/bin/bash

PROJECT_DIR="/Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform"
LOG_DIR="$PROJECT_DIR/logs"
PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$PATH"

mkdir -p "$LOG_DIR"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_DIR/autostart.log"
}

check_port() {
    local port=$1
    if command -v nc >/dev/null 2>&1; then
        nc -z localhost "$port" >/dev/null 2>&1
    else
        lsof -i ":$port" -sTCP:LISTEN -t >/dev/null 2>&1
    fi
}

wait_for_port() {
    local service_name=$1
    local port=$2
    local attempts=${3:-40}
    local attempt=0

    while [ $attempt -lt $attempts ]; do
        if check_port "$port"; then
            log "$service_name is listening on port $port"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done

    log "$service_name failed to listen on port $port within expected time"
    return 1
}

log "Boot startup script initiated"

# Allow system services to settle
sleep 15

log "Starting Ollama"
open -a Ollama 2>/dev/null || true
sleep 5

cd "$PROJECT_DIR" || exit 1

log "Starting MongoDB container"
docker-compose up -d mongo

log "Waiting for MongoDB to be ready..."
wait_for_port "MongoDB" 27017 40 || log "MongoDB port 27017 not open yet, continuing"

log "Building and starting backend/frontend containers"
cd "$PROJECT_DIR" || exit 1
docker-compose up -d --build backend frontend >> "$LOG_DIR/docker-build.log" 2>&1
wait_for_port "Backend" 4000 40 || log "Backend did not expose port 4000 in time"
wait_for_port "Frontend" 5173 40 || log "Frontend did not expose port 5173 in time"

cd "$PROJECT_DIR" || exit 1
log "Starting Ngrok tunnel"
docker-compose up -d ngrok

log "Boot startup script completed"

EOFSCRIPT

chmod +x "$STARTUP_SCRIPT"
print_success "Startup script created"

# Create LaunchAgent plist
print_info "Creating LaunchAgent configuration..."

mkdir -p "$HOME/Library/LaunchAgents"

cat > "$PLIST_FILE" << EOFPLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.quiz.platform.autostart</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$STARTUP_SCRIPT</string>
    </array>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>KeepAlive</key>
    <false/>
    
    <key>StandardOutPath</key>
    <string>$LOG_DIR/autostart.log</string>
    
    <key>StandardErrorPath</key>
    <string>$LOG_DIR/autostart-error.log</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin</string>
    </dict>
</dict>
</plist>
EOFPLIST

print_success "LaunchAgent plist created"

# Load the LaunchAgent
print_info "Loading LaunchAgent..."
launchctl unload "$PLIST_FILE" 2>/dev/null || true
launchctl load "$PLIST_FILE"
print_success "Auto-start configured!"

###############################################################################
# Final Summary
###############################################################################

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                      ║${NC}"
echo -e "${GREEN}║              ✨ SETUP COMPLETE - ALL SERVICES RUNNING ✨            ║${NC}"
echo -e "${GREEN}║                                                                      ║${NC}"
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""

print_step "📊 Service Status"
echo -e "   ${GREEN}✓${NC} Ollama AI:    Running on port 11434"
echo -e "   ${GREEN}✓${NC} MongoDB:      Running on port 27017 (Docker)"
echo -e "   ${GREEN}✓${NC} Backend:      Running on port 4000"
echo -e "   ${GREEN}✓${NC} Frontend:     Running on port 5173"
echo -e "   ${GREEN}✓${NC} Ngrok:        Running (Docker)"
echo ""

print_step "🌐 Access URLs"
echo -e "   ${CYAN}Local Frontend:${NC}  http://localhost:5173"
echo -e "   ${CYAN}Backend API:${NC}     http://localhost:4000"
echo -e "   ${CYAN}Public Access:${NC}   $NGROK_URL"
echo -e "   ${CYAN}Ngrok Dashboard:${NC} http://localhost:4040"
echo ""

print_step "📝 Log Files"
echo -e "   Backend:   $BACKEND_LOG"
echo -e "   Frontend:  $FRONTEND_LOG"
echo -e "   Autostart: $LOG_DIR/autostart.log"
echo ""

print_step "👥 Demo Credentials"
echo -e "   ${YELLOW}Admin:${NC}      admin@quiz.com / admin123"
echo -e "   ${YELLOW}Instructor:${NC} instructor@quiz.com / instructor123"
echo -e "   ${YELLOW}Student:${NC}    chetan@student.com / student123"
echo ""

print_step "💡 Useful Commands"
echo -e "   ${CYAN}Stop services:${NC}        docker-compose down && pkill -f node"
echo -e "   ${CYAN}Restart services:${NC}     bash $STARTUP_SCRIPT"
echo -e "   ${CYAN}Disable auto-start:${NC}   launchctl unload $PLIST_FILE"
echo -e "   ${CYAN}Enable auto-start:${NC}    launchctl load $PLIST_FILE"
echo -e "   ${CYAN}View logs:${NC}            tail -f $LOG_DIR/*.log"
echo ""

print_success "The platform will now auto-start on every boot!"
echo ""
