# 🦙 AI Features - Llama 3.3 Integration

## Overview

This platform integrates **Meta Llama 3.3 70B** for powerful AI-powered quiz generation:

- ✅ **88.4% HumanEval** - Excellent code generation
- ✅ **77% MATH accuracy** - Strong problem-solving
- ✅ **Multilingual** - Supports 8 languages
- ✅ **Privacy-first** - All data stays local
- ✅ **No API costs** - Unlimited free usage
- ✅ **Runs in Docker** - Easy deployment

## System Requirements

### Minimum (Current 16GB Setup)
- **Model**: `ai/llama3.3:70B-Q4_0`
- **Download**: 37GB
- **RAM**: 16GB minimum
- **Mode**: CPU only
- **Speed**: 30-60 seconds per question
- **Storage**: 40GB free space

### Recommended (High Performance)
- **Model**: `ai/llama3.3:70B-Q4_K_M`
- **Download**: 40GB
- **RAM**: 48GB+
- **GPU**: NVIDIA with 41GB+ VRAM
  - RTX 6000 Ada
  - A6000/A100
  - Multi-GPU setup
- **Speed**: 5-15 seconds per question
- **Storage**: 45GB free space

## Quick Setup

### Automatic Setup (Recommended)

**During initial platform setup**, you'll be prompted:
```
Setup Llama AI? (y/n) [n]:
```
Press **y** to automatically download and configure.

### Manual Setup

**Windows:**
```powershell
cd scripts
.\setup-llama.bat
```

**Mac/Linux:**
```bash
cd scripts
chmod +x setup-llama.sh
./setup-llama.sh
```

### Manual Commands

```bash
# Pull the model (one-time, ~30-60 min)
docker model pull ai/llama3.3:70B-Q4_0

# Start Llama service
docker-compose up -d llama

# Check status
docker-compose ps llama

# View logs
docker-compose logs -f llama
```

## Model Comparison

| Feature | Q4_0 (Current) | Q4_K_M (Optimal) |
|---------|---------------|------------------|
| **Download Size** | 37GB | 40GB |
| **RAM Required** | 16GB | 48GB+ |
| **Quality** | Good | Better |
| **Speed (CPU)** | 30-60s | 30-60s |
| **Speed (GPU)** | N/A | 5-15s |
| **Best For** | Limited hardware | Production use |

## Configuration

### Current Setup (docker-compose.yml)

```yaml
llama:
  image: ai/llama3.3:70B-Q4_0
  ports:
    - "8000:8000"
  mem_limit: 16g
  memswap_limit: 20g
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
    interval: 30s
    timeout: 10s
    retries: 5
    start_period: 120s
```

### Upgrade to GPU Setup

For systems with 48GB+ RAM and NVIDIA GPU:

1. **Edit docker-compose.yml:**

```yaml
llama:
  image: ai/llama3.3:70B-Q4_K_M  # Better model
  ports:
    - "8000:8000"
  mem_limit: 48g
  memswap_limit: 52g
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: all
            capabilities: [gpu]
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 60s  # Faster with GPU
```

2. **Pull new model:**
```bash
docker model pull ai/llama3.3:70B-Q4_K_M
```

3. **Restart service:**
```bash
docker-compose up -d llama
```

## Backend Integration

The backend already includes Llama integration via `llamaService.js`:

### Environment Variables (backend/.env)

```env
# Llama Configuration
LLAMA_API_ENDPOINT=http://llama:8000/v1/chat/completions
LLAMA_MODEL=llama3.3
USE_DOCKER=true

# Optional: Gemini Fallback (cloud-based)
GEMINI_API_KEY=your_api_key_here
```

### API Endpoints

```javascript
// Generate quiz questions with AI
POST /api/ai-quiz/generate
{
  "topic": "React Hooks",
  "type": "multiple-choice",
  "difficulty": "medium",
  "count": 5
}

// Check AI service health
GET /api/ai-quiz/health
```

### Service Methods

```javascript
// llamaService.js provides:
generateCompletion(prompt, options)
generateMultipleChoiceQuestion(topic, difficulty)
generateTrueFalseQuestion(topic, difficulty)
generateShortAnswerQuestion(topic, difficulty)
generateCodingQuestion(topic, difficulty, language)
generateEssayQuestion(topic, difficulty)
```

## Using AI Quiz Generator

### Frontend Interface

1. **Login** as admin or instructor
2. **Navigate** to "Manage Quizzes"
3. **Click** "AI Quiz Generator"
4. **Configure**:
   - Topic: "JavaScript Promises"
   - Count: 3-5 questions
   - Type: Multiple Choice
   - Difficulty: Medium
5. **Generate** and wait
6. **Review** and edit questions
7. **Save** to quiz bank

### Best Practices

**For 16GB Systems:**
- Generate 2-3 questions at a time
- Use simpler topics for testing
- Be patient with first generation (60-90s)
- Close unnecessary applications

**For Production:**
- Use GPU-enabled system
- Generate 5-10 questions efficiently
- Complex topics work well
- Batch generation for multiple quizzes

## Performance Expectations

### 16GB RAM (CPU Mode)
```
First Generation:     60-90 seconds (model loading)
Subsequent:           30-60 seconds per question
Memory Usage:         ~14-15GB
CPU Usage:            ~80-100%
Recommended Batch:    2-3 questions
```

### 48GB RAM + GPU (Optimal)
```
First Generation:     20-30 seconds
Subsequent:           5-15 seconds per question
Memory Usage:         ~40GB RAM + 35GB VRAM
GPU Usage:            ~90-100%
Recommended Batch:    10+ questions
```

## Monitoring

### Check Llama Status

```bash
# Container running?
docker-compose ps llama

# View real-time logs
docker-compose logs -f llama

# Resource usage
docker stats llama

# Health check
curl http://localhost:8000/health
```

### Expected Output

```bash
# Healthy Llama service:
$ curl http://localhost:8000/health
{
  "status": "healthy",
  "model": "llama3.3",
  "quantization": "Q4_0"
}
```

## Troubleshooting

### Llama Not Starting

**Symptom:** Container exits immediately

**Solutions:**
```bash
# Check logs
docker-compose logs llama

# Verify model downloaded
docker images | grep llama

# Check available RAM
docker stats

# Restart with more memory
docker-compose down
docker-compose up -d llama
```

### Out of Memory

**Symptom:** "Cannot allocate memory" error

**Solutions:**
1. **Close other applications**
2. **Stop non-essential services:**
   ```bash
   docker-compose stop frontend ngrok
   docker-compose restart llama
   ```
3. **Increase swap:**
   - Docker Desktop → Settings → Resources → Swap: 8GB

### Generation Timeout

**Symptom:** Request times out after 5 minutes

**Solutions:**
1. **Normal for CPU mode** - Be patient
2. **Check if model loaded:**
   ```bash
   docker-compose logs llama | grep "Model loaded"
   ```
3. **Reduce question count**
4. **Simplify topic complexity**

### Slow Performance

**Expected Behavior:**
- 16GB CPU: 30-60 seconds is normal
- First generation always slower (model loading)

**Improvements:**
- Upgrade to GPU system
- Use Q4_K_M on powerful hardware
- Generate during low system load

### Model Download Failed

```bash
# Check disk space
df -h  # Mac/Linux
Get-PSDrive  # Windows

# Clear Docker cache
docker system prune -a

# Retry download
docker model pull ai/llama3.3:70B-Q4_0

# Alternative: Download manually from Docker Hub
```

## Alternative: Google Gemini API

If local AI is too slow or resource-intensive:

1. **Get API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Add to backend/.env:**
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. **Backend automatically uses as fallback** if Llama unavailable
4. **Pros:** Faster, no local resources
5. **Cons:** Requires internet, API costs, data sent to cloud

## API Reference

### Generate Questions

**Endpoint:** `POST /api/ai-quiz/generate`

**Request:**
```json
{
  "topic": "Python Data Structures",
  "type": "multiple-choice",
  "difficulty": "medium",
  "count": 5,
  "language": "python"
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "question": "What is the time complexity of...",
      "type": "multiple-choice",
      "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      "correctAnswer": "O(n)",
      "explanation": "Lists in Python...",
      "difficulty": "medium",
      "topic": "Python Data Structures"
    }
  ]
}
```

### Health Check

**Endpoint:** `GET /api/ai-quiz/health`

**Response:**
```json
{
  "llamaAvailable": true,
  "geminiAvailable": false,
  "activeProvider": "llama",
  "modelInfo": {
    "name": "llama3.3",
    "quantization": "Q4_0"
  }
}
```

## Supported Question Types

1. **Multiple Choice**
   - 4 options with one correct answer
   - Explanation included
   - Code examples supported

2. **True/False**
   - Boolean answer
   - Detailed explanation

3. **Short Answer**
   - Open-ended text response
   - Sample answer provided
   - Grading criteria included

4. **Essay**
   - Extended response
   - Key points to cover
   - Grading rubric

5. **Coding**
   - Programming challenge
   - Test cases included
   - Multiple languages: JavaScript, Python, Java, C++

## Best Practices

### Topic Selection
✅ **Good Topics:**
- "React Hooks and State Management"
- "SQL Joins and Database Design"
- "Python List Comprehensions"
- "REST API Design Principles"

❌ **Avoid:**
- Too broad: "Programming"
- Too narrow: "useEffect syntax"
- Ambiguous: "Computer stuff"

### Generation Tips

1. **Start small** - Test with 2-3 questions
2. **Be specific** - Clear topic descriptions
3. **Match difficulty** - Align with student level
4. **Review output** - Always check generated content
5. **Edit as needed** - AI provides starting point
6. **Save good prompts** - Reuse successful topics

## Security & Privacy

✅ **Local Processing**
- All data stays on your server
- No external API calls (unless Gemini enabled)
- Full control over model and data

✅ **Access Control**
- Only admin/instructor roles can generate
- Rate limiting prevents abuse
- Audit logs track usage

✅ **Data Safety**
- Generated questions stored in database
- No PII sent to AI model
- Can be reviewed before student access

## Upgrading

### To Different Model

```bash
# Pull new model
docker model pull ai/llama3.3:70B-Q4_K_M

# Update docker-compose.yml
# Change image line to new model

# Restart service
docker-compose up -d llama
```

### To Newer Llama Version

```bash
# Check available models
docker search llama

# Pull specific version
docker model pull ai/llama3.4:latest

# Update configuration
# Test thoroughly before production
```

## FAQ

**Q: Can I use both Llama and Gemini?**  
A: Yes! Backend tries Llama first, falls back to Gemini if configured.

**Q: How much does it cost?**  
A: Llama is free (local). Gemini has API costs (~$0.001 per question).

**Q: Can I use smaller models?**  
A: Yes, try `ai/llama3.1:8B` for faster but lower quality.

**Q: Does it work offline?**  
A: Yes! Once model is downloaded, fully offline (Llama only).

**Q: Can multiple users generate at once?**  
A: Yes, but queued on 16GB systems. GPU handles concurrent better.

---

**Documentation:** See also
- [Getting Started](../setup/GETTING_STARTED.md)
- [API Reference](./AI_FEATURES_QUICK_REFERENCE.md)
- [Implementation Details](./AI_IMPLEMENTATION_SUMMARY.md)

**Last Updated**: November 3, 2025
