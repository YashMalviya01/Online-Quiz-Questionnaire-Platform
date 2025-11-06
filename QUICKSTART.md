# 🚀 Quick Start Guide - Mac Mini M4

## ⚡ Fastest Way to Get Started

### Option 1: Auto-Start on Boot (Recommended)

Run this **once** to set up automatic startup:

```bash
cd /Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform
./scripts/macos/install-autostart.sh
```

**What this does:**
- ✅ Installs LaunchAgent for boot startup
- ✅ Makes all scripts executable
- ✅ Configures auto-start on Mac login
- ✅ Platform starts automatically 30 seconds after login

After installation, the platform will start automatically every time you log in to your Mac!

### Option 2: Manual Start (Anytime)

```bash
cd /Users/chetan/Desktop/Online-Quiz-Questionnaire-Platform
./scripts/macos/auto-start.sh
```

This starts all services immediately:
- Ollama AI
- MongoDB
- Backend API
- Frontend
- Ngrok Tunnel

## 🛑 Stop All Services

```bash
./scripts/macos/stop.sh
```

## 📊 View Logs

```bash
./scripts/macos/logs-mac.sh
```

## 🧹 Cleanup Logs

```bash
./scripts/macos/cleanup-mac.sh
```

## 🌐 Access the Platform

Once started, access at:
- **Local**: http://localhost:5173
- **Public**: https://smart-quiz.major-project.ngrok.dev
- **Backend**: http://localhost:4000
- **Ngrok Dashboard**: http://localhost:4040

## 👤 Demo Credentials

### Admin
- Email: `admin@quiz.com`
- Password: `admin123`

### Instructor
- Email: `instructor@quiz.com`
- Password: `instructor123`

### Student
- Email: `chetan@student.com`
- Password: `student123`

## 🎯 Common Tasks

### Generate AI Questions

1. Login as Instructor or Admin
2. Go to "Create Quiz"
3. Click "Generate Questions"
4. Fill the form:
   - Select programming language
   - Enter custom prompt (what questions you want)
   - Choose question type
   - Set difficulty and count
5. Click "Generate"

### Check if Services are Running

```bash
# Backend
lsof -i :4000

# Frontend
lsof -i :5173

# MongoDB
docker ps | grep mongo

# Ollama
pgrep -x Ollama
```

### Restart Individual Service

```bash
# Backend only
cd backend && pkill -f "node.*server.js" && npm start > ../logs/backend.log 2>&1 &

# Frontend only
cd frontend && pkill -f vite && npm run dev > ../logs/frontend.log 2>&1 &
```

## 🔧 Troubleshooting

### Service Won't Start

```bash
# Check logs
tail -f logs/backend.log
tail -f logs/frontend.log

# Check if port is in use
lsof -i :4000  # Backend
lsof -i :5173  # Frontend

# Kill stuck processes
pkill -f "node.*server.js"
pkill -f vite
```

### Ollama Issues

```bash
# Check if running
pgrep -x Ollama

# Check API
curl http://localhost:11434/api/tags

# Restart
pkill -x Ollama && open -a Ollama
```

### MongoDB Issues

```bash
# Check container
docker ps | grep mongo

# Restart
docker-compose restart mongo

# View logs
docker logs online-quiz-questionnaire-platform-mongo-1
```

## ⚙️ Advanced

### Disable Auto-Start

```bash
launchctl unload ~/Library/LaunchAgents/com.quiz.platform.autostart.plist
```

### Re-enable Auto-Start

```bash
launchctl load ~/Library/LaunchAgents/com.quiz.platform.autostart.plist
```

### Check Auto-Start Status

```bash
launchctl list | grep quiz.platform
```

### Uninstall Auto-Start

```bash
launchctl unload ~/Library/LaunchAgents/com.quiz.platform.autostart.plist
rm ~/Library/LaunchAgents/com.quiz.platform.autostart.plist
```

## 📚 More Information

See [README.md](../README.md) for:
- Full feature list
- Detailed setup instructions
- API documentation
- Development guide
- Contributing guidelines

## 🆘 Need Help?

1. Check logs: `./scripts/macos/logs-mac.sh`
2. Review [README.md](../README.md)
3. Check [docs/](../docs/) folder
4. Contact development team

---

**Made with ❤️ for Mac Mini M4**
