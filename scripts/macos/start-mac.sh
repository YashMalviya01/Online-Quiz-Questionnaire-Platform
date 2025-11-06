#!/bin/bash

# Quick start script for macOS - Starts existing containers
# Use setup-demo.sh for first-time setup

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}Starting Online Quiz Assessment Platform...${NC}"
echo ""

# Check which docker compose command to use
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}✗ Docker Compose is NOT installed!${NC}"
    exit 1
fi

# Start services
cd ..
$COMPOSE_CMD start
cd "RUN ON MAC"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All services started!${NC}"
    echo ""
    echo -e "${CYAN}  Frontend: http://localhost:3000${NC}"
    echo -e "${CYAN}  Backend:  http://localhost:4000${NC}"
    echo ""
    
    # Open browser
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:3000
    fi
else
    echo -e "${YELLOW}Services not found. Run ./setup-demo.sh first${NC}"
fi
