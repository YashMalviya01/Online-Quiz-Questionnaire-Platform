#!/bin/bash

# Cleanup script for macOS - Removes all containers and volumes

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Cleanup Warning${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo -e "${RED}This will remove all containers, networks, and volumes.${NC}"
echo -e "${RED}All data will be permanently deleted!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${CYAN}Cleanup cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}Cleaning up...${NC}"

# Check which docker compose command to use
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}✗ Docker Compose is NOT installed!${NC}"
    exit 1
fi

# Remove everything
cd ..
$COMPOSE_CMD down -v
cd "RUN ON LINUX"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Cleanup complete!${NC}"
    echo ""
    echo -e "${YELLOW}  To setup again: ./setup-demo.sh${NC}"
fi
