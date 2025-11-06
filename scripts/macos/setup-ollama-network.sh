#!/bin/bash

# Mac Mini Ollama Network Configuration Script
# This configures Ollama to accept connections from your Windows machine

echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║     Mac Mini - Ollama Network Access Setup                           ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed!"
    echo "Install with: curl -fsSL https://ollama.com/install.sh | sh"
    exit 1
fi

echo "✅ Ollama is installed"
echo ""

# Stop any running Ollama process
echo "➡️  Stopping existing Ollama processes..."
pkill ollama
sleep 2

# Check if model is available
echo "➡️  Checking for qwen2.5-coder:7b model..."
if ollama list | grep -q "qwen2.5-coder:7b"; then
    echo "✅ Model qwen2.5-coder:7b is available"
else
    echo "⚠️  Model not found. Pulling qwen2.5-coder:7b (this will take several minutes)..."
    ollama pull qwen2.5-coder:7b
fi
echo ""

# Create LaunchAgent to run Ollama on all interfaces
echo "➡️  Creating Ollama LaunchAgent for network access..."

PLIST_PATH=~/Library/LaunchAgents/com.ollama.network.plist

cat > "$PLIST_PATH" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.network</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OLLAMA_HOST</key>
        <string>0.0.0.0:11434</string>
        <key>OLLAMA_ORIGINS</key>
        <string>*</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/ollama-network.out.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/ollama-network.err.log</string>
</dict>
</plist>
EOF

echo "✅ LaunchAgent created at $PLIST_PATH"
echo ""

# Load the LaunchAgent
echo "➡️  Loading Ollama service..."
launchctl unload "$PLIST_PATH" 2>/dev/null
launchctl load "$PLIST_PATH"

sleep 3

# Check if Ollama is running
echo "➡️  Checking Ollama status..."
if lsof -i :11434 > /dev/null 2>&1; then
    echo "✅ Ollama is running on port 11434"
else
    echo "❌ Ollama is not running. Starting manually..."
    export OLLAMA_HOST=0.0.0.0:11434
    ollama serve > /tmp/ollama-manual.log 2>&1 &
    sleep 3
fi
echo ""

# Get network information
echo "➡️  Network Information:"
echo ""
echo "Mac Mini IP Addresses:"
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print "   " $2}'
echo ""

# Test local access
echo "➡️  Testing local access..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Local access works (http://localhost:11434)"
else
    echo "❌ Local access failed"
fi
echo ""

# Get the primary IP address
PRIMARY_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

# Test network access
echo "➡️  Testing network access..."
if curl -s "http://${PRIMARY_IP}:11434/api/tags" > /dev/null; then
    echo "✅ Network access works (http://${PRIMARY_IP}:11434)"
else
    echo "⚠️  Network access might be blocked by firewall"
    echo ""
    echo "To allow Ollama through firewall:"
    echo "  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/ollama"
    echo "  sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/local/bin/ollama"
fi
echo ""

# Configure firewall
echo "➡️  Configuring macOS firewall..."
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/ollama 2>/dev/null
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/local/bin/ollama 2>/dev/null
echo "✅ Firewall configured"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Your Mac Mini Ollama server is now accessible from your network:"
echo ""
echo "📍 Access URLs:"
echo "   Local:   http://localhost:11434"
echo "   Network: http://${PRIMARY_IP}:11434"
echo ""
echo "🧪 Test from Windows:"
echo "   curl http://${PRIMARY_IP}:11434/api/tags"
echo ""
echo "📊 Monitor logs:"
echo "   tail -f /tmp/ollama-network.out.log"
echo "   tail -f /tmp/ollama-network.err.log"
echo ""
echo "🔄 Manage service:"
echo "   launchctl unload ~/Library/LaunchAgents/com.ollama.network.plist"
echo "   launchctl load ~/Library/LaunchAgents/com.ollama.network.plist"
echo ""
echo "✅ Ollama will automatically start on Mac Mini boot"
echo ""
