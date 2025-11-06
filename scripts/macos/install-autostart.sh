#!/bin/bash

###############################################################################
# Install Auto-Start for Online Quiz Platform on Mac Mini M4
# This script configures the platform to start automatically on system boot
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform"
PLIST_SOURCE="$PROJECT_DIR/scripts/macos/com.quiz.platform.autostart.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/com.quiz.platform.autostart.plist"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     📦 Installing Auto-Start for Quiz Platform                      ║${NC}"
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Step 1: Make scripts executable
echo -e "${YELLOW}[1/5] Making scripts executable...${NC}"
chmod +x "$PROJECT_DIR/scripts/macos/auto-start.sh"
chmod +x "$PROJECT_DIR/scripts/macos/stop.sh"
chmod +x "$PROJECT_DIR/scripts/macos/cleanup-mac.sh"
chmod +x "$PROJECT_DIR/scripts/macos/logs-mac.sh"
chmod +x "$PROJECT_DIR/scripts/macos/start-mac.sh"
echo -e "${GREEN}✓${NC} Scripts are now executable"

# Step 2: Create LaunchAgents directory if it doesn't exist
echo ""
echo -e "${YELLOW}[2/5] Creating LaunchAgents directory...${NC}"
mkdir -p "$HOME/Library/LaunchAgents"
echo -e "${GREEN}✓${NC} Directory created/verified"

# Step 3: Copy plist file
echo ""
echo -e "${YELLOW}[3/5] Installing LaunchAgent...${NC}"
if [ -f "$PLIST_DEST" ]; then
    echo -e "${YELLOW}⚠${NC} Existing LaunchAgent found. Unloading..."
    launchctl unload "$PLIST_DEST" 2>/dev/null || true
    rm "$PLIST_DEST"
fi

cp "$PLIST_SOURCE" "$PLIST_DEST"
echo -e "${GREEN}✓${NC} LaunchAgent installed"

# Step 4: Load the LaunchAgent
echo ""
echo -e "${YELLOW}[4/5] Loading LaunchAgent...${NC}"
launchctl load "$PLIST_DEST"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} LaunchAgent loaded successfully"
else
    echo -e "${RED}✗${NC} Failed to load LaunchAgent"
    exit 1
fi

# Step 5: Create logs directory
echo ""
echo -e "${YELLOW}[5/5] Creating logs directory...${NC}"
mkdir -p "$PROJECT_DIR/logs"
echo -e "${GREEN}✓${NC} Logs directory created"

# Summary
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  ✨ INSTALLATION COMPLETE ✨                         ║${NC}"
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo ""
echo -e "${BLUE}📝 What was installed:${NC}"
echo -e "   ✓ LaunchAgent: $PLIST_DEST"
echo -e "   ✓ Auto-start script: $PROJECT_DIR/scripts/macos/auto-start.sh"
echo -e "   ✓ Stop script: $PROJECT_DIR/scripts/macos/stop.sh"
echo ""
echo -e "${BLUE}🚀 How to use:${NC}"
echo -e "   Manual start:  ${GREEN}./scripts/macos/auto-start.sh${NC}"
echo -e "   Manual stop:   ${GREEN}./scripts/macos/stop.sh${NC}"
echo -e "   View logs:     ${GREEN}./scripts/macos/logs-mac.sh${NC}"
echo -e "   Cleanup:       ${GREEN}./scripts/macos/cleanup-mac.sh${NC}"
echo ""
echo -e "${BLUE}⚙️  Auto-start configuration:${NC}"
echo -e "   The platform will now start automatically when you log in"
echo -e "   It will start in ~30 seconds after login"
echo ""
echo -e "${BLUE}🔧 To disable auto-start:${NC}"
echo -e "   ${YELLOW}launchctl unload ~/Library/LaunchAgents/com.quiz.platform.autostart.plist${NC}"
echo ""
echo -e "${BLUE}🔧 To re-enable auto-start:${NC}"
echo -e "   ${YELLOW}launchctl load ~/Library/LaunchAgents/com.quiz.platform.autostart.plist${NC}"
echo ""
echo -e "${BLUE}📊 To test now (without rebooting):${NC}"
echo -e "   ${GREEN}./scripts/macos/auto-start.sh${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: Reboot your Mac to test the auto-start functionality${NC}"
echo ""
