# 🦙 Llama 3.3 Setup - Alternative Solution

## ❌ Issue Encountered

Your system (16GB RAM) is too limited for the Docker Model Runner to load the Llama 3.3 70B Q4_0 model, even though it downloaded successfully (39.97GB).

**Error:** `model too big` - Docker Model Runner cannot allocate enough memory.

## ✅ Recommended Solutions

### Option 1: Use Google Gemini API (Fastest Solution - 5 minutes)

**Pros:**
- ✅ Works immediately
- ✅ No hardware requirements
- ✅ Fast responses (2-5 seconds per question)
- ✅ No downloads needed

**Setup:**
1. **Get API Key** (2 minutes):
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Get API Key" or "Create API Key"
   - Copy your key

2. **Configure Backend**:
   ```bash
   # Edit: backend\.env
   # Add this line:
   GEMINI_API_KEY=your-api-key-here
   ```

3. **Restart Backend**:
   ```bash
   docker-compose restart backend
   ```

4. **Test It**:
   - Login as instructor@quiz.com / instructor123
   - Go to "Manage Quizzes" → "AI Quiz Generator"
   - Generate questions instantly!

---

### Option 2: Use Ollama (Local AI - 2 hours)

**Pros:**
- ✅ Runs locally (privacy-first)
- ✅ Better memory management than Docker Model Runner
- ✅ Works on 16GB RAM with smaller models

**Setup:**

1. **Install Ollama**:
   - Download: https://ollama.com/download/windows
   - Run installer
   - Ollama will start automatically

2. **Pull a Smaller Model** (8B instead of 70B):
   ```powershell
   # Much smaller model that fits in 16GB RAM
   ollama pull llama3.1:8b
   
   # Or even smaller (4GB):
   ollama pull llama3.1:3b
   ```

3. **Start Ollama Server**:
   ```powershell
   # Ollama runs on port 11434 by default
   ollama serve
   ```

4. **Update Backend Configuration**:
   ```env
   # Edit: backend\.env
   LLAMA_API_ENDPOINT=http://host.docker.internal:11434/v1/chat/completions
   LLAMA_MODEL=llama3.1:8b
   USE_DOCKER=false
   ```

5. **Restart Backend**:
   ```bash
   docker-compose restart backend
   ```

**Note:** 8B model quality is lower than 70B, but still good for basic quiz generation.

---

### Option 3: Use on More Powerful PC (48GB+ RAM)

If you have access to a more powerful system:

**Requirements:**
- 48GB+ RAM
- NVIDIA GPU with 41GB+ VRAM (optional but recommended)
- 50GB free disk space

**On that system:**
1. Clone this repository
2. Run setup script: `scripts\windows\setup-demo.bat`
3. When prompted, choose `y` for Llama AI
4. Select option 2 (Q4_K_M model)
5. Wait for download and setup

The 70B model will work smoothly with better hardware.

---

## 🎯 My Recommendation

**For immediate AI quiz generation:** Use **Option 1 (Google Gemini)**
- Takes 5 minutes to set up
- Works perfectly right now
- Free tier: 60 requests/minute (plenty for testing)

**For long-term local AI:** Use **Option 2 (Ollama with 8B model)**
- Takes 2 hours total (mostly download time)
- Privacy-first, runs locally
- Good enough quality for most quiz questions

## 📊 Comparison

| Solution | Setup Time | Quality | Speed | Privacy | Cost |
|----------|-----------|---------|-------|---------|------|
| **Gemini API** | 5 min | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ Fast | ❌ Cloud | Free tier |
| **Ollama 8B** | 2 hours | ⭐⭐⭐ Good | ⚡⚡ Medium | ✅ Local | Free |
| **Llama 70B** | N/A | ⭐⭐⭐⭐⭐ | ❌ Won't fit | ✅ Local | Free |

## 🚀 Quick Start: Gemini Setup

Since you want AI working now, here's the fastest path:

```powershell
# 1. Get API key from: https://makersuite.google.com/app/apikey

# 2. Open backend\.env file
notepad backend\.env

# 3. Add this line (replace with your actual key):
GEMINI_API_KEY=AIzaSyC_your_actual_key_here

# 4. Save and close

# 5. Restart backend
docker-compose restart backend

# 6. Check logs (should show "Gemini AI service available")
docker-compose logs backend | Select-String "Gemini"

# 7. Open platform and test!
# Go to: http://localhost:3000
# Login: instructor@quiz.com / instructor123
# Navigate: Manage Quizzes → AI Quiz Generator
```

## 🆘 Need Help?

- **Gemini not working?** Check API key is correct in backend\.env
- **Want local AI?** Install Ollama from https://ollama.com
- **Have questions?** Check docs\ai\LLAMA_INTEGRATION.md

---

**Current Status:**
- ✅ Platform running perfectly
- ✅ Llama model downloaded (but can't load in 16GB RAM)
- ⏭️ Next: Choose Gemini (fast) or Ollama (local)

**I recommend starting with Gemini API to test AI features immediately, then explore Ollama later for local AI.**
