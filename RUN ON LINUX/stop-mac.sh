#!/bin/bash

# Stop script for macOS - Stops running containers

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}Stopping Online Quiz Assessment Platform...${NC}"
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

# Stop services
cd ..
$COMPOSE_CMD stop
cd "RUN ON LINUX"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All services stopped!${NC}"
    echo ""
    echo -e "${YELLOW}  To start again: ./start-mac.sh${NC}"
    echo -e "${YELLOW}  To remove all:  ./cleanup-mac.sh${NC}"
fi
