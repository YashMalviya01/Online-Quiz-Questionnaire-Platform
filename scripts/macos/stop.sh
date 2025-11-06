#!/bin/bash

###############################################################################
# Stop Script for Online Quiz Platform on Mac Mini M4
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🛑 Stopping Online Quiz Platform Services                       ║${NC}"
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Stop Frontend
echo -e "${YELLOW}[1/4] Stopping Frontend...${NC}"
pkill -f "vite" 2>/dev/null && echo -e "${GREEN}✓${NC} Frontend stopped" || echo -e "${YELLOW}⚠${NC} Frontend was not running"

# Stop Backend
echo -e "${YELLOW}[2/4] Stopping Backend...${NC}"
pkill -f "node.*server.js" 2>/dev/null && echo -e "${GREEN}✓${NC} Backend stopped" || echo -e "${YELLOW}⚠${NC} Backend was not running"

# Stop Docker containers
echo -e "${YELLOW}[3/4] Stopping Docker containers...${NC}"
cd /Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform
docker-compose down 2>/dev/null && echo -e "${GREEN}✓${NC} Docker containers stopped" || echo -e "${YELLOW}⚠${NC} No Docker containers to stop"

# Ollama (optional - leave running)
echo -e "${YELLOW}[4/4] Ollama Status...${NC}"
if pgrep -x "Ollama" > /dev/null; then
    echo -e "${BLUE}ℹ${NC} Ollama is still running (not stopped automatically)"
    echo -e "${YELLOW}   Run 'pkill -x Ollama' to stop it manually if needed${NC}"
else
    echo -e "${YELLOW}⚠${NC} Ollama was not running"
fi

echo ""
echo -e "${GREEN}✓ All services stopped successfully${NC}"
echo ""
