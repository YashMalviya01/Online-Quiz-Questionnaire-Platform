#!/bin/bash

###############################################################################
# Ngrok Configuration Helper for Online Quiz Platform
# This script helps configure and troubleshoot ngrok tunnel issues
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_DIR="/Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🔧 Ngrok Configuration Helper                                   ║${NC}"
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Check if ngrok container is running
echo -e "${YELLOW}[1/5] Checking Ngrok container status...${NC}"
if docker ps | grep -q "ngrok"; then
    CONTAINER_NAME=$(docker ps | grep "ngrok" | awk '{print $NF}')
    echo -e "${GREEN}✓${NC} Ngrok container is running: ${CYAN}$CONTAINER_NAME${NC}"
else
    echo -e "${RED}✗${NC} Ngrok container is not running"
    echo -e "${YELLOW}💡 Start it with: docker-compose up -d ngrok${NC}"
    exit 1
fi

# Check ngrok logs for errors
echo ""
echo -e "${YELLOW}[2/5] Checking Ngrok logs...${NC}"
cd "$PROJECT_DIR"
NGROK_LOGS=$(docker-compose logs ngrok --tail=20 2>&1)

if echo "$NGROK_LOGS" | grep -q "ERR_NGROK"; then
    echo -e "${RED}✗${NC} Ngrok errors detected:"
    echo ""
    echo "$NGROK_LOGS" | grep "ERR_NGROK" | sed 's/^/   /'
    echo ""
    
    if echo "$NGROK_LOGS" | grep -q "ERR_NGROK_3200"; then
        echo -e "${YELLOW}💡 Error ERR_NGROK_3200: The reserved domain is offline or not available${NC}"
        echo -e "${YELLOW}   Solutions:${NC}"
        echo -e "${CYAN}   1. Remove the --url flag to use dynamic URLs (free tier)${NC}"
        echo -e "${CYAN}   2. Verify your reserved domain in ngrok dashboard${NC}"
        echo -e "${CYAN}   3. Check if your ngrok plan supports reserved domains${NC}"
    elif echo "$NGROK_LOGS" | grep -q "ERR_NGROK_108"; then
        echo -e "${YELLOW}💡 Error ERR_NGROK_108: Invalid authtoken${NC}"
        echo -e "${YELLOW}   Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken${NC}"
    fi
else
    echo -e "${GREEN}✓${NC} No critical errors in logs"
fi

# Check ngrok API
echo ""
echo -e "${YELLOW}[3/5] Checking Ngrok API...${NC}"
if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Ngrok API is accessible at http://localhost:4040"
else
    echo -e "${RED}✗${NC} Cannot access Ngrok API"
    echo -e "${YELLOW}💡 Check if port 4040 is available${NC}"
fi

# Get tunnel information
echo ""
echo -e "${YELLOW}[4/5] Retrieving tunnel information...${NC}"
TUNNEL_INFO=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null)

if [ -n "$TUNNEL_INFO" ]; then
    PUBLIC_URL=$(echo "$TUNNEL_INFO" | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -1)
    
    if [ -n "$PUBLIC_URL" ]; then
        echo -e "${GREEN}✓${NC} Active tunnel found!"
        echo -e "   ${CYAN}Public URL: $PUBLIC_URL${NC}"
        
        # Extract tunnel details
        TUNNEL_NAME=$(echo "$TUNNEL_INFO" | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)
        PROTO=$(echo "$TUNNEL_INFO" | grep -o '"proto":"[^"]*' | head -1 | cut -d'"' -f4)
        
        echo -e "   ${CYAN}Protocol: $PROTO${NC}"
        echo -e "   ${CYAN}Name: $TUNNEL_NAME${NC}"
    else
        echo -e "${YELLOW}⚠${NC} No active tunnels found"
        echo -e "${YELLOW}💡 Ngrok may still be starting up${NC}"
    fi
else
    echo -e "${RED}✗${NC} Could not retrieve tunnel information"
fi

# Check authtoken
echo ""
echo -e "${YELLOW}[5/5] Checking Ngrok configuration...${NC}"

# Check if authtoken is set
if docker-compose exec ngrok sh -c 'echo $NGROK_AUTHTOKEN' 2>/dev/null | grep -q "[a-zA-Z0-9]"; then
    TOKEN_PREVIEW=$(docker-compose exec ngrok sh -c 'echo $NGROK_AUTHTOKEN' 2>/dev/null | head -c 10)
    echo -e "${GREEN}✓${NC} Authtoken is configured: ${CYAN}${TOKEN_PREVIEW}...${NC}"
else
    echo -e "${RED}✗${NC} Authtoken is not configured or invalid"
    echo -e "${YELLOW}💡 Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken${NC}"
    echo -e "${YELLOW}💡 Set it in docker-compose.yml under NGROK_AUTHTOKEN${NC}"
fi

# Summary and recommendations
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     📊 Summary & Recommendations                                    ║${NC}"
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""

if [ -n "$PUBLIC_URL" ]; then
    echo -e "${GREEN}✓ Ngrok is working correctly!${NC}"
    echo ""
    echo -e "${CYAN}🌐 Access your application at:${NC}"
    echo -e "   ${GREEN}$PUBLIC_URL${NC}"
    echo ""
    echo -e "${CYAN}📊 View tunnel details:${NC}"
    echo -e "   ${GREEN}http://localhost:4040${NC}"
else
    echo -e "${YELLOW}⚠ Ngrok tunnel is not active${NC}"
    echo ""
    echo -e "${CYAN}🔧 Troubleshooting steps:${NC}"
    echo -e "   1. Check logs: ${YELLOW}docker-compose logs ngrok${NC}"
    echo -e "   2. Verify authtoken is valid"
    echo -e "   3. Restart ngrok: ${YELLOW}docker-compose restart ngrok${NC}"
    echo -e "   4. Check your ngrok account limits at dashboard.ngrok.com"
    echo ""
    echo -e "${CYAN}💡 Common issues:${NC}"
    echo -e "   • ERR_NGROK_3200: Reserved domain offline/unavailable"
    echo -e "   • ERR_NGROK_108: Invalid authtoken"
    echo -e "   • ERR_NGROK_105: Account limit reached"
fi

echo ""
echo -e "${CYAN}📚 Useful commands:${NC}"
echo -e "   View logs:      ${YELLOW}docker-compose logs -f ngrok${NC}"
echo -e "   Restart:        ${YELLOW}docker-compose restart ngrok${NC}"
echo -e "   Stop:           ${YELLOW}docker-compose stop ngrok${NC}"
echo -e "   Dashboard:      ${YELLOW}http://localhost:4040${NC}"
echo ""
