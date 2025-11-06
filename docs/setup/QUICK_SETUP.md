# 🎯 Quick Setup Guide - Connect Windows to Mac Mini Ollama

## Current Status
✅ Mac Mini has Ollama with qwen2.5-coder:7b installed  
✅ Backend code configured for IP: `10.108.51.85`  
❌ Network connection not working yet  

## The Problem
Ollama on Mac Mini is only listening on `localhost` (127.0.0.1), not on the network interface. Your Windows machine can't connect to it.

## The Solution - Run This on Mac Mini

### Option 1: Quick Manual Start (Temporary)

On your Mac Mini terminal:
```bash
# Stop existing Ollama
pkill ollama

# Start Ollama listening on all interfaces
export OLLAMA_HOST=0.0.0.0:11434
ollama serve
```

Keep this terminal open. Test from Windows:
```powershell
node test-mac-mini-connection.js
```

### Option 2: Automatic Setup (Permanent - RECOMMENDED)

On your Mac Mini terminal:
```bash
cd ~/Desktop/LLM

# Download the setup script
curl -o setup-ollama-network.sh https://raw.githubusercontent.com/Chetankhaped/Online-Quiz-Questionnaire-Platform/master/scripts/macos/setup-ollama-network.sh

# Or if you have the repo, copy from:
# Online Quiz Questionnaire Platform/scripts/macos/setup-ollama-network.sh

# Make it executable
chmod +x setup-ollama-network.sh

# Run it
./setup-ollama-network.sh
```

This will:
- Configure Ollama to listen on all network interfaces (0.0.0.0)
- Set up firewall rules
- Create auto-start service (runs on boot)
- Test the connection

## After Setup - Test from Windows

```powershell
# In your project directory
cd "c:\Users\cheta\OneDrive\Desktop\Online Quiz Questionnaire Platform"

# Run test
node test-mac-mini-connection.js
```

**Expected output:**
```
✅ Server is reachable!
✅ Response received
✅ ALL TESTS PASSED!
```

## Then Start Your Backend

```powershell
cd backend
npm run dev
```

The backend will automatically connect to Mac Mini at `10.108.51.85:11434`

## Troubleshooting

### If still not working after setup:

**On Mac Mini**, check if Ollama is listening on network:
```bash
# Should show Ollama listening on 0.0.0.0:11434 or *:11434
lsof -i :11434

# Test local access
curl http://localhost:11434/api/tags

# Test network access (use your actual IP)
curl http://10.108.51.85:11434/api/tags
```

**On Windows**, test connectivity:
```powershell
# Test if port is reachable
Test-NetConnection -ComputerName 10.108.51.85 -Port 11434

# Test API
curl http://10.108.51.85:11434/api/tags
```

### Common Issues:

1. **Firewall blocking**: Run setup script again, it configures firewall
2. **Different network**: Ensure both devices on same WiFi
3. **IP changed**: Get new IP on Mac Mini with `ifconfig | grep "inet "`

## Files Updated

✅ `backend/.env` - Points to `10.108.51.85:11434`  
✅ `backend/src/services/ollamaService.js` - Default endpoint updated  
✅ `backend/src/controllers/aiQuizController.js` - Status message updated  
✅ `test-mac-mini-connection.js` - Test script created  
✅ `scripts/macos/setup-ollama-network.sh` - Setup script created  

## Next Steps

1. ⏭️ **Run setup script on Mac Mini** (Option 2 above)
2. ⏭️ **Test connection** from Windows
3. ⏭️ **Start backend** server
4. ⏭️ **Use AI features** in your quiz platform!

---

**Need the setup script?** It's in your repo at:  
`scripts/macos/setup-ollama-network.sh`

Just run it on your Mac Mini! 🚀
