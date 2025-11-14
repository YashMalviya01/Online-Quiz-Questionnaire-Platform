# macOS Setup for Online Quiz Platform

## 🚀 Quick Start

This single script will:
- ✅ Check and install all required dependencies
- ✅ Configure environment files
- ✅ Build & run Docker containers for MongoDB, Backend, Frontend, Ngrok
- ✅ Start Ollama service headlessly
- ✅ Configure auto-start on boot so everything comes online after reboot

### Prerequisites

1. **macOS** (Mac Mini M4 or any Mac)
2. **Admin privileges** (for installing Homebrew if needed)

### One-Command Installation

```bash
cd /Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform/scripts/macos
./setup-and-autostart.sh
```

That's it! The script will handle everything automatically.

## 📋 What the Script Does

### Step 1: System Requirements Check
- Checks for macOS
- Installs Homebrew (if needed)
- Installs Node.js (if needed)
- Verifies Docker is installed and running
- Verifies Ollama is installed

### Step 2: Install Dependencies
- Installs backend npm packages
- Installs frontend npm packages

### Step 3: Configure Environment
- Creates `.env` files for backend and frontend
- Configures API URLs and Ngrok domain

### Step 4: Configure Ngrok
- Checks for Ngrok configuration
- Prompts to set up authtoken if needed

### Step 5: Setup Ollama AI
- Starts Ollama application
- Downloads `qwen2.5-coder:7b` model (if not present)

### Step 6: Start All Services
- **MongoDB**: Port 27017 (Docker container)
- **Backend**: Docker container exposing port 4000
- **Frontend**: Docker container (Nginx) exposing port 5173
- **Ngrok**: Docker container tunneling directly to the frontend container

### Step 7: Configure Auto-Start
- Creates boot startup script
- Installs LaunchAgent to run on login
- Services will automatically start on every boot

## 🌐 Access Points

After setup, access your application at:

- **Local Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Public Access**: https://smart-quiz-major-project.ngrok.app
- **Ngrok Dashboard**: http://localhost:4040

## 👥 Demo Credentials

```
Admin:      admin@quiz.com / admin123
Instructor: instructor@quiz.com / instructor123
Student:    chetan@student.com / student123
```

## 🛠️ Management Commands

### Stop All Services
```bash
# Stop Docker containers
docker-compose down

# Stop Node processes
pkill -f "node.*server.js"
pkill -f "vite"
```

### Disable Auto-Start
```bash
launchctl unload ~/Library/LaunchAgents/com.quiz.platform.autostart.plist
```

### Enable Auto-Start
```bash
launchctl load ~/Library/LaunchAgents/com.quiz.platform.autostart.plist
```

### Restart Services
```bash
# Restart containers
cd /Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform
docker-compose up -d --build backend frontend

# Or rerun the boot script
bash /Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform/scripts/macos/boot-start.sh
```

### View Logs
```bash
# View all logs
tail -f ~/Desktop/Online-Quiz-Questionnaire-Platform/logs/*.log

# View specific service log
tail -f ~/Desktop/Online-Quiz-Questionnaire-Platform/logs/backend.log
tail -f ~/Desktop/Online-Quiz-Questionnaire-Platform/logs/frontend.log
tail -f ~/Desktop/Online-Quiz-Questionnaire-Platform/logs/autostart.log
```

## 🔧 Troubleshooting

### Services Not Starting
```bash
# Check Docker is running
docker info

# Check service logs
tail -50 ~/Desktop/Online-Quiz-Questionnaire-Platform/logs/backend.log
tail -50 ~/Desktop/Online-Quiz-Questionnaire-Platform/logs/frontend.log

# Rebuild & restart app containers
docker-compose up -d --build backend frontend
```

### Ngrok Tunnel Issues
```bash
# Check ngrok status
curl http://localhost:4040/api/tunnels

# View ngrok logs
docker-compose logs ngrok
```

### MongoDB Issues
```bash
# Check MongoDB container
docker-compose ps mongo

# View MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

### Port Already in Use
```bash
# Find what's using a port (e.g., 4000)
lsof -i :4000

# Kill process on port
kill -9 $(lsof -t -i:4000)
```

## 📦 Manual Installation (if script fails)

If the automated script fails, follow these steps:

1. **Install Homebrew**:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js**:
   ```bash
   brew install node
   ```

3. **Install Docker Desktop**: Download from https://www.docker.com/products/docker-desktop

4. **Install Ollama**: Download from https://ollama.com/download

5. **Install Dependencies**:
   ```bash
   cd ~/Desktop/Online-Quiz-Questionnaire-Platform/backend
   npm install
   
   cd ~/Desktop/Online-Quiz-Questionnaire-Platform/frontend
   npm install
   ```

6. **Configure Ngrok**:
   ```bash
   ngrok authtoken YOUR_AUTH_TOKEN
   ```

7. **Start Services**:
   ```bash
   cd ~/Desktop/Online-Quiz-Questionnaire-Platform
   docker-compose up -d
   
   cd backend && npm start &
   cd ../frontend && npm run dev &
   ```

## 🔐 Security Notes

- Change JWT_SECRET in `backend/.env` for production
- Never commit `.env` files to version control
- Keep your Ngrok authtoken private
- Update demo credentials for production use

## 📞 Support

For issues or questions:
1. Check logs in `~/Desktop/Online-Quiz-Questionnaire-Platform/logs/`
2. Verify all prerequisites are installed
3. Ensure Docker Desktop is running
4. Check Ngrok dashboard at http://localhost:4040

---

Made with ❤️ for Mac Mini M4
