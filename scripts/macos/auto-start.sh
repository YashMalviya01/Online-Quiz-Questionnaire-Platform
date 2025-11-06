#!/bin/bash

###############################################################################
# Auto-Start Script for Online Quiz Platform on Mac Mini M4
# This script starts all required services for the quiz platform
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform"
LOG_DIR="$PROJECT_DIR/logs"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
NGROK_LOG="$LOG_DIR/ngrok.log"

# Create logs directory
mkdir -p "$LOG_DIR"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 Starting Online Quiz Platform on Mac Mini M4                 ║${NC}"
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    
    if lsof -i ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $service_name is already running on port $port"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $service_name is not running on port $port"
        return 1
    fi
}

# Function to wait for service
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=0
    
    echo -e "${YELLOW}⏳${NC} Waiting for $service_name to start on port $port..."
    
    while [ $attempt -lt $max_attempts ]; do
        if lsof -i ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} $service_name is ready!"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    echo -e "${RED}✗${NC} $service_name failed to start within expected time"
    return 1
}

# Step 1: Start Ollama (if not running)
echo ""
echo -e "${BLUE}[1/5] Starting Ollama AI Service...${NC}"
if ! pgrep -x "Ollama" > /dev/null; then
    echo -e "${YELLOW}⚠${NC} Ollama is not running. Starting Ollama..."
    open -a Ollama
    sleep 5
    
    if pgrep -x "Ollama" > /dev/null; then
        echo -e "${GREEN}✓${NC} Ollama started successfully"
    else
        echo -e "${RED}✗${NC} Failed to start Ollama"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Ollama is already running"
fi

# Verify Ollama API is accessible
echo -e "${YELLOW}⏳${NC} Verifying Ollama API..."
max_attempts=10
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Ollama API is accessible"
        break
    fi
    attempt=$((attempt + 1))
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}✗${NC} Ollama API is not responding"
    exit 1
fi

# Step 2: Start MongoDB (Docker)
echo ""
echo -e "${BLUE}[2/5] Starting MongoDB...${NC}"
cd "$PROJECT_DIR"

if ! check_service "MongoDB" 27017; then
    echo -e "${YELLOW}⚠${NC} Starting MongoDB container..."
    docker-compose up -d mongo
    wait_for_service "MongoDB" 27017
else
    echo -e "${GREEN}✓${NC} MongoDB is already running"
fi

# Step 3: Start Ngrok (Docker)
echo ""
echo -e "${BLUE}[3/5] Starting Ngrok Tunnel...${NC}"
if ! docker ps | grep -q "ngrok"; then
    echo -e "${YELLOW}⚠${NC} Starting Ngrok container..."
    docker-compose up -d ngrok
    sleep 5
    echo -e "${GREEN}✓${NC} Ngrok tunnel started"
else
    echo -e "${GREEN}✓${NC} Ngrok is already running"
fi

# Get Ngrok URL
sleep 3
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -1)
if [ -n "$NGROK_URL" ]; then
    echo -e "${GREEN}✓${NC} Ngrok URL: ${BLUE}$NGROK_URL${NC}"
else
    echo -e "${YELLOW}⚠${NC} Could not retrieve Ngrok URL (it may still be starting)"
fi

# Step 4: Start Backend
echo ""
echo -e "${BLUE}[4/5] Starting Backend Server...${NC}"
cd "$PROJECT_DIR/backend"

if ! check_service "Backend" 4000; then
    echo -e "${YELLOW}⚠${NC} Starting backend server..."
    
    # Kill any existing backend processes
    pkill -f "node.*server.js" 2>/dev/null || true
    sleep 2
    
    # Start backend
    npm start > "$BACKEND_LOG" 2>&1 &
    BACKEND_PID=$!
    echo -e "${YELLOW}⏳${NC} Backend PID: $BACKEND_PID"
    
    wait_for_service "Backend" 4000
    echo -e "${GREEN}✓${NC} Backend server started successfully"
    echo -e "${BLUE}   Log file: $BACKEND_LOG${NC}"
else
    echo -e "${GREEN}✓${NC} Backend is already running"
fi

# Step 5: Start Frontend
echo ""
echo -e "${BLUE}[5/5] Starting Frontend Dev Server...${NC}"
cd "$PROJECT_DIR/frontend"

if ! check_service "Frontend" 5173; then
    echo -e "${YELLOW}⚠${NC} Starting frontend server..."
    
    # Kill any existing frontend processes
    pkill -f "vite" 2>/dev/null || true
    sleep 2
    
    # Start frontend
    npm run dev > "$FRONTEND_LOG" 2>&1 &
    FRONTEND_PID=$!
    echo -e "${YELLOW}⏳${NC} Frontend PID: $FRONTEND_PID"
    
    wait_for_service "Frontend" 5173
    echo -e "${GREEN}✓${NC} Frontend server started successfully"
    echo -e "${BLUE}   Log file: $FRONTEND_LOG${NC}"
else
    echo -e "${GREEN}✓${NC} Frontend is already running"
fi

# Summary
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  ✨ ALL SERVICES STARTED ✨                          ║${NC}"
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo -e "   Local Frontend:  ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend API:     ${GREEN}http://localhost:4000${NC}"
if [ -n "$NGROK_URL" ]; then
    echo -e "   Public Access:   ${GREEN}$NGROK_URL${NC}"
fi
echo -e "   Ngrok Dashboard: ${GREEN}http://localhost:4040${NC}"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
echo -e "   ✓ Ollama AI:    ${GREEN}Running (qwen2.5-coder:7b)${NC}"
echo -e "   ✓ MongoDB:      ${GREEN}Running on port 27017${NC}"
echo -e "   ✓ Backend:      ${GREEN}Running on port 4000${NC}"
echo -e "   ✓ Frontend:     ${GREEN}Running on port 5173${NC}"
echo -e "   ✓ Ngrok:        ${GREEN}Running with public tunnel${NC}"
echo ""
echo -e "${BLUE}📝 Logs Location:${NC}"
echo -e "   Backend:  ${YELLOW}$BACKEND_LOG${NC}"
echo -e "   Frontend: ${YELLOW}$FRONTEND_LOG${NC}"
echo ""
echo -e "${BLUE}📚 Demo Credentials:${NC}"
echo -e "   Admin:      admin@quiz.com / admin123"
echo -e "   Instructor: instructor@quiz.com / instructor123"
echo -e "   Student:    chetan@student.com / student123"
echo ""
echo -e "${YELLOW}💡 Tip: Use './scripts/macos/stop.sh' to stop all services${NC}"
echo ""
