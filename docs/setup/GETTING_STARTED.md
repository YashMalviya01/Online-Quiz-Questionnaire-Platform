# 🚀 Getting Started - Online Quiz Platform

This guide will help you set up and run the Online Quiz Platform on your machine.

## Prerequisites

- **Docker Desktop** 4.0+ (with Docker Compose support)
- **Git** (to clone the repository)
- **16GB RAM minimum** (48GB+ recommended for AI features)
- **40GB free disk space** (for AI models)

## Quick Setup

### Step 1: Choose Your Platform

Navigate to the appropriate scripts folder:

**Windows:**
```powershell
cd scripts\windows
```

**macOS:**
```bash
cd scripts/macos
```

**Linux:**
```bash
cd scripts/linux
```

### Step 2: Run Setup Script

**Windows:**
```powershell
# Batch file
.\setup-demo.bat

# OR PowerShell
.\setup-demo.ps1
```

**macOS/Linux:**
```bash
chmod +x setup-demo.sh
./setup-demo.sh
```

### What the Setup Does

1. ✅ Checks Docker installation
2. ✅ Creates environment files from templates
3. ✅ Builds and starts all containers:
   - MongoDB (Database)
   - Backend API (Node.js/Express)
   - Frontend (React + Vite)
   - Ngrok (Public tunneling)
4. ✅ **Optional:** Downloads Llama 3.3 AI model (37GB)
5. ✅ Loads demo data (users, quizzes, results)
6. ✅ Opens browser to http://localhost:3000

### Step 3: AI Features (Optional)

During setup, you'll be prompted:

```
Setup Llama AI? (y/n) [n]:
```

- Press **y** to enable AI quiz generation (requires 37GB download, ~30-60 minutes)
- Press **n** to skip (you can add it later)

**To add AI later:**
```bash
cd scripts
.\setup-llama.bat   # Windows
./setup-llama.sh    # Mac/Linux
```

## Access the Platform

After setup completes:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Llama AI**: http://localhost:8000 (if enabled)
- **MongoDB**: localhost:27017
- **Public URL**: https://smart-quiz-platform.pentacoresolutions.in
- **Ngrok Dashboard**: http://localhost:4040

## Demo Credentials

```
Admin:      admin@quiz.com / admin123
Instructor: instructor@quiz.com / instructor123
Students:   
  - aman@student.com / student123
  - chetan@student.com / student123
  - vanisha@student.com / student123
  - shashank@student.com / student123
  - yash@student.com / student123
```

## Using AI Quiz Generator

1. Login as **admin** or **instructor**
2. Navigate to **"Manage Quizzes"**
3. Click **"AI Quiz Generator"**
4. Enter:
   - Topic (e.g., "React Hooks", "Python Data Structures")
   - Number of questions (2-3 recommended for first test)
   - Question type (MCQ, True/False, Short Answer, Essay, Coding)
   - Difficulty level (Easy, Medium, Hard)
5. Click **"Generate Questions"**
6. Wait patiently:
   - First generation: 60-90 seconds (loading model)
   - Subsequent: 30-60 seconds each (16GB RAM system)
   - With GPU: 5-15 seconds each

## Useful Commands

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose stop

# Restart specific service
docker-compose restart backend

# Stop and remove everything
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f llama
```

### Check Status

```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Llama model info
docker images | grep llama
```

## Platform-Specific Scripts

### Windows (`scripts/windows/`)
- `setup-demo.bat` - Full platform setup (Batch)
- `setup-demo.ps1` - Full platform setup (PowerShell)

### macOS (`scripts/macos/`)
- `setup-demo.sh` - Full platform setup
- `start-mac.sh` - Quick start all services
- `stop-mac.sh` - Stop all services
- `logs-mac.sh` - View logs
- `cleanup-mac.sh` - Complete cleanup

### Linux (`scripts/linux/`)
- `setup-demo.sh` - Full platform setup
- `start-mac.sh` - Quick start all services
- `stop-mac.sh` - Stop all services
- `logs-mac.sh` - View logs
- `cleanup-mac.sh` - Complete cleanup

### AI Setup (`scripts/`)
- `setup-llama.bat` - Llama setup (Windows)
- `setup-llama.sh` - Llama setup (Mac/Linux)
- `setup-ai-features.bat` - Backend AI config (Windows)
- `setup-ai-features.sh` - Backend AI config (Mac/Linux)

## Troubleshooting

### Docker Not Running
```
Error: Docker daemon not running
```
**Solution:** Start Docker Desktop and wait for it to fully initialize.

### Port Already in Use
```
Error: Port 3000/4000/27017 already in use
```
**Solution:**
```bash
# Find and stop the process
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux

# Or change port in docker-compose.yml
```

### Llama Out of Memory
```
Error: Cannot allocate memory
```
**Solutions:**
- Close other applications
- Generate fewer questions (2-3 instead of 10)
- Stop non-essential services:
  ```bash
  docker-compose stop frontend ngrok
  docker-compose restart llama
  ```

### Llama Too Slow
**Expected on 16GB RAM CPU mode:**
- First generation: 60-90 seconds
- Subsequent: 30-60 seconds

**To improve:**
- Use a more powerful system (48GB+ RAM, GPU)
- Generate simpler topics
- Generate fewer questions at once

### Model Download Failed
```bash
# Retry download
docker model pull ai/llama3.3:70B-Q4_0

# Check available space
df -h  # Mac/Linux
Get-PSDrive  # Windows

# Clear unused Docker resources
docker system prune -a
```

## Moving to Another PC

When setting up on a different machine:

1. **Copy entire project folder**
2. **Run setup script** for your platform
3. **If more powerful (48GB+ RAM with GPU):**
   - See `docs/ai/LLAMA_INTEGRATION.md` for GPU setup
   - Can use higher quality Q4_K_M model

## Next Steps

- 📖 Read [Main README](../../README.md) for complete documentation
- 🦙 See [AI Features Guide](../ai/LLAMA_INTEGRATION.md) for detailed AI setup
- 🤝 Check [CONTRIBUTING.md](../../CONTRIBUTING.md) to contribute
- 📝 Review [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md)

## Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify Docker: `docker ps`
3. Check resources: `docker stats`
4. Review troubleshooting section above
5. Open an issue on GitHub

---

**Last Updated**: November 3, 2025  
**Setup Time**: 5-10 minutes (without AI), 30-90 minutes (with AI)
