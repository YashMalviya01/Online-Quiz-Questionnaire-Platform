#!/bin/bash

################################################################################
# Complete Quiz Platform Setup for Mac Mini M4
# This script installs and configures the entire project with auto-start
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Online-Quiz-Questionnaire-Platform"
INSTALL_DIR="$HOME/quiz-platform"
REPO_URL="https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform.git"
OLLAMA_MODEL="qwen2.5-coder:7b"
FINE_TUNED_MODEL="quiz-master"
BACKEND_PORT=4000
FRONTEND_PORT=5173

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
}

print_step() {
    echo -e "${GREEN}➡️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_warning "$1 is not installed"
        return 1
    fi
}

################################################################################
# Installation Functions
################################################################################

install_homebrew() {
    print_step "Checking Homebrew..."
    if ! check_command brew; then
        print_step "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for Apple Silicon
        if [[ $(uname -m) == 'arm64' ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        
        print_success "Homebrew installed"
    fi
}

install_git() {
    print_step "Checking Git..."
    if ! check_command git; then
        print_step "Installing Git..."
        brew install git
        print_success "Git installed"
    fi
}

install_nodejs() {
    print_step "Checking Node.js..."
    if ! check_command node; then
        print_step "Installing Node.js..."
        brew install node@20
        brew link node@20
        print_success "Node.js installed"
    else
        NODE_VERSION=$(node -v)
        print_success "Node.js $NODE_VERSION is installed"
    fi
}

install_mongodb() {
    print_step "Checking MongoDB..."
    if ! check_command mongod; then
        print_step "Installing MongoDB..."
        brew tap mongodb/brew
        brew install mongodb-community
        print_success "MongoDB installed"
    fi
    
    # Start MongoDB service
    print_step "Starting MongoDB..."
    brew services start mongodb-community
    print_success "MongoDB service started"
}

install_ollama() {
    print_step "Checking Ollama..."
    if ! check_command ollama; then
        print_step "Installing Ollama..."
        curl -fsSL https://ollama.com/install.sh | sh
        print_success "Ollama installed"
    fi
}

install_python() {
    print_step "Checking Python..."
    if ! check_command python3; then
        print_step "Installing Python..."
        brew install python@3
        print_success "Python installed"
    else
        PYTHON_VERSION=$(python3 --version)
        print_success "$PYTHON_VERSION is installed"
    fi
}

################################################################################
# Project Setup
################################################################################

clone_project() {
    print_step "Setting up project directory..."
    
    if [ -d "$INSTALL_DIR" ]; then
        print_warning "Directory $INSTALL_DIR already exists"
        read -p "Remove and reinstall? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$INSTALL_DIR"
            print_success "Old installation removed"
        else
            print_warning "Using existing installation"
            cd "$INSTALL_DIR"
            git pull
            return 0
        fi
    fi
    
    print_step "Cloning repository..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    print_success "Project cloned to $INSTALL_DIR"
}

setup_backend() {
    print_step "Setting up backend..."
    cd "$INSTALL_DIR/backend"
    
    # Install dependencies
    print_step "Installing backend dependencies..."
    npm install
    
    # Create .env file
    print_step "Creating backend .env file..."
    cat > .env << EOF
# Server Configuration
PORT=$BACKEND_PORT
NODE_ENV=production

# Database
MONGO_URI=mongodb://localhost:27017/quiz-proctor

# JWT & Security
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)

# Frontend URL
FRONTEND_URL=http://localhost:$FRONTEND_PORT
CLIENT_ORIGIN=http://localhost:$FRONTEND_PORT,http://localhost:3000
CORS_ALLOW_ALL=false

# AI Services - Ollama (Mac Mini M4)
OLLAMA_API_ENDPOINT=http://localhost:11434/api/generate
OLLAMA_MODEL=$FINE_TUNED_MODEL

# Code Execution
USE_DOCKER=false
EOF
    
    print_success "Backend configured"
}

setup_frontend() {
    print_step "Setting up frontend..."
    cd "$INSTALL_DIR/frontend"
    
    # Install dependencies
    print_step "Installing frontend dependencies..."
    npm install
    
    # Create .env file
    print_step "Creating frontend .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:$BACKEND_PORT
VITE_WS_URL=ws://localhost:$BACKEND_PORT
EOF
    
    # Build frontend
    print_step "Building frontend..."
    npm run build
    
    print_success "Frontend configured and built"
}

################################################################################
# Ollama Setup
################################################################################

setup_ollama_models() {
    print_step "Setting up Ollama models..."
    
    # Start Ollama service
    print_step "Starting Ollama service..."
    ollama serve > /tmp/ollama-install.log 2>&1 &
    sleep 5
    
    # Pull base model
    print_step "Pulling base model ($OLLAMA_MODEL)..."
    print_warning "This may take several minutes depending on your internet speed..."
    ollama pull $OLLAMA_MODEL
    print_success "Base model downloaded"
    
    # Create fine-tuned model
    print_step "Creating fine-tuned quiz generation model..."
    cd "$INSTALL_DIR"
    
    if [ -f "ai-training/modelfiles/Modelfile.quiz-master" ]; then
        ollama create $FINE_TUNED_MODEL -f ai-training/modelfiles/Modelfile.quiz-master
        print_success "Fine-tuned model created: $FINE_TUNED_MODEL"
    else
        print_warning "Modelfile not found, using base model"
    fi
    
    # Stop temporary Ollama service
    pkill -f "ollama serve" || true
}

################################################################################
# Auto-Start Configuration
################################################################################

create_ollama_service() {
    print_step "Creating Ollama auto-start service..."
    
    local PLIST_FILE="$HOME/Library/LaunchAgents/com.ollama.service.plist"
    
    cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.service</string>
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
    <string>/tmp/ollama.out.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/ollama.err.log</string>
</dict>
</plist>
EOF
    
    # Load the service
    launchctl unload "$PLIST_FILE" 2>/dev/null || true
    launchctl load "$PLIST_FILE"
    
    print_success "Ollama service configured to start on boot"
}

create_backend_service() {
    print_step "Creating backend auto-start service..."
    
    local PLIST_FILE="$HOME/Library/LaunchAgents/com.quizplatform.backend.plist"
    
    cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.quizplatform.backend</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which node)</string>
        <string>$INSTALL_DIR/backend/src/server.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$INSTALL_DIR/backend</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/quiz-backend.out.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/quiz-backend.err.log</string>
</dict>
</plist>
EOF
    
    # Load the service
    launchctl unload "$PLIST_FILE" 2>/dev/null || true
    launchctl load "$PLIST_FILE"
    
    print_success "Backend service configured to start on boot"
}

create_frontend_service() {
    print_step "Creating frontend auto-start service..."
    
    # Create a simple HTTP server script for serving the built frontend
    local SERVER_SCRIPT="$INSTALL_DIR/frontend/serve.js"
    
    cat > "$SERVER_SCRIPT" << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.join(__dirname, 'dist');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Serve index.html for client-side routing
                fs.readFile(path.join(DIST_DIR, 'index.html'), (err, indexContent) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error loading index.html');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server running at http://localhost:${PORT}/`);
});
EOF
    
    local PLIST_FILE="$HOME/Library/LaunchAgents/com.quizplatform.frontend.plist"
    
    cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.quizplatform.frontend</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which node)</string>
        <string>$SERVER_SCRIPT</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$INSTALL_DIR/frontend</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PORT</key>
        <string>$FRONTEND_PORT</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/quiz-frontend.out.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/quiz-frontend.err.log</string>
</dict>
</plist>
EOF
    
    # Load the service
    launchctl unload "$PLIST_FILE" 2>/dev/null || true
    launchctl load "$PLIST_FILE"
    
    print_success "Frontend service configured to start on boot"
}

################################################################################
# Helper Scripts
################################################################################

create_helper_scripts() {
    print_step "Creating helper scripts..."
    
    local SCRIPTS_DIR="$INSTALL_DIR/scripts/macos"
    mkdir -p "$SCRIPTS_DIR"
    
    # Start all services
    cat > "$SCRIPTS_DIR/start-all.sh" << EOF
#!/bin/bash
echo "Starting all Quiz Platform services..."
launchctl load ~/Library/LaunchAgents/com.ollama.service.plist
launchctl load ~/Library/LaunchAgents/com.quizplatform.backend.plist
launchctl load ~/Library/LaunchAgents/com.quizplatform.frontend.plist
brew services start mongodb-community
echo "✅ All services started"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend: http://localhost:$BACKEND_PORT"
echo "Ollama: http://localhost:11434"
EOF
    
    # Stop all services
    cat > "$SCRIPTS_DIR/stop-all.sh" << EOF
#!/bin/bash
echo "Stopping all Quiz Platform services..."
launchctl unload ~/Library/LaunchAgents/com.ollama.service.plist 2>/dev/null || true
launchctl unload ~/Library/LaunchAgents/com.quizplatform.backend.plist 2>/dev/null || true
launchctl unload ~/Library/LaunchAgents/com.quizplatform.frontend.plist 2>/dev/null || true
brew services stop mongodb-community
echo "✅ All services stopped"
EOF
    
    # Status check
    cat > "$SCRIPTS_DIR/status.sh" << EOF
#!/bin/bash
echo "════════════════════════════════════════════════════════════════"
echo "Quiz Platform Status"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "LaunchAgents:"
launchctl list | grep -E "ollama|quizplatform"
echo ""
echo "MongoDB:"
brew services list | grep mongodb
echo ""
echo "Logs:"
echo "  Ollama:   tail -f /tmp/ollama.out.log"
echo "  Backend:  tail -f /tmp/quiz-backend.out.log"
echo "  Frontend: tail -f /tmp/quiz-frontend.out.log"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:$FRONTEND_PORT"
echo "  Backend:  http://localhost:$BACKEND_PORT"
echo "  Ollama:   http://localhost:11434"
EOF
    
    # View logs
    cat > "$SCRIPTS_DIR/logs.sh" << EOF
#!/bin/bash
echo "Select service to view logs:"
echo "1) Ollama"
echo "2) Backend"
echo "3) Frontend"
echo "4) All (split screen)"
read -p "Choice: " choice

case \$choice in
    1) tail -f /tmp/ollama.out.log ;;
    2) tail -f /tmp/quiz-backend.out.log ;;
    3) tail -f /tmp/quiz-frontend.out.log ;;
    4) tail -f /tmp/ollama.out.log & tail -f /tmp/quiz-backend.out.log & tail -f /tmp/quiz-frontend.out.log ;;
    *) echo "Invalid choice" ;;
esac
EOF
    
    # Make all scripts executable
    chmod +x "$SCRIPTS_DIR"/*.sh
    
    print_success "Helper scripts created in $SCRIPTS_DIR"
}

################################################################################
# Main Installation Flow
################################################################################

main() {
    print_header "Quiz Platform Complete Setup for Mac Mini M4"
    echo ""
    
    # System dependencies
    print_header "Step 1: Installing System Dependencies"
    install_homebrew
    install_git
    install_nodejs
    install_python
    install_mongodb
    install_ollama
    echo ""
    
    # Project setup
    print_header "Step 2: Setting Up Project"
    clone_project
    setup_backend
    setup_frontend
    echo ""
    
    # Ollama setup
    print_header "Step 3: Configuring AI Models"
    setup_ollama_models
    echo ""
    
    # Auto-start services
    print_header "Step 4: Configuring Auto-Start Services"
    create_ollama_service
    create_backend_service
    create_frontend_service
    echo ""
    
    # Helper scripts
    print_header "Step 5: Creating Helper Scripts"
    create_helper_scripts
    echo ""
    
    # Final steps
    print_header "Installation Complete! 🎉"
    echo ""
    print_success "Quiz Platform is now installed and configured"
    echo ""
    echo "📍 Installation Directory: $INSTALL_DIR"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend:  http://localhost:$FRONTEND_PORT"
    echo "   Backend:   http://localhost:$BACKEND_PORT/api/health"
    echo "   Ollama:    http://localhost:11434/api/tags"
    echo ""
    echo "🔧 Management Scripts:"
    echo "   Start all:  $INSTALL_DIR/scripts/macos/start-all.sh"
    echo "   Stop all:   $INSTALL_DIR/scripts/macos/stop-all.sh"
    echo "   Status:     $INSTALL_DIR/scripts/macos/status.sh"
    echo "   Logs:       $INSTALL_DIR/scripts/macos/logs.sh"
    echo ""
    echo "📊 Service Status:"
    launchctl list | grep -E "ollama|quizplatform" || echo "   (Services will start on next boot)"
    echo ""
    echo "💡 To start services now:"
    echo "   cd $INSTALL_DIR/scripts/macos && ./start-all.sh"
    echo ""
    echo "📝 Logs are available at:"
    echo "   /tmp/ollama.out.log"
    echo "   /tmp/quiz-backend.out.log"
    echo "   /tmp/quiz-frontend.out.log"
    echo ""
    print_warning "Services will automatically start on next boot"
    echo ""
    read -p "Start all services now? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        cd "$INSTALL_DIR/scripts/macos"
        ./start-all.sh
        sleep 5
        ./status.sh
    fi
    echo ""
    print_success "Setup complete! Your Quiz Platform is ready to use."
}

# Run main installation
main
