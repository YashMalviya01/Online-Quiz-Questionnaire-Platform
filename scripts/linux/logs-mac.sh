#!/bin/bash

# View logs script for macOS - Shows live logs from all containers

# Color codes
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}Viewing logs (Press Ctrl+C to exit)...${NC}"
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

# Show logs
cd ..
if [ -z "$1" ]; then
    # Show all logs
    $COMPOSE_CMD logs -f
else
    # Show specific service logs
    $COMPOSE_CMD logs -f "$1"
fi
cd "RUN ON LINUX"
