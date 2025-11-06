#!/bin/bash

# Question Bank Setup Script for Linux/Mac
# This script is deprecated - the platform now uses a pre-built question bank

echo "================================================================"
echo "   Question Bank System - No Setup Required"
echo "   This platform uses a pre-built question bank"
echo "================================================================"
echo ""
echo "[INFO] This script is no longer needed."
echo "[INFO] The platform now generates questions from a comprehensive"
echo "[INFO] question bank (4000+ questions) without external AI services."
echo ""
echo "[INFO] Question bank location: backend/src/data/questionBankGenerated.json"
echo ""
exit 0

# Check Docker is running
if ! docker version >/dev/null 2>&1; then
    echo "[ERROR] Docker is not running. Please start Docker."
    exit 1
fi

echo "[SUCCESS] Docker is running"
echo ""

# Check system RAM
echo "[INFO] Checking system resources..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    RAM=$(sysctl hw.memsize | awk '{print $2/1024/1024/1024 " GB"}')
else
    RAM=$(free -h | awk '/^Mem:/ {print $2}')
fi
echo "System RAM: $RAM"
echo ""

# Recommend model
echo "[INFO] Detecting optimal model configuration..."
echo ""
echo "Your system has: $RAM"
echo ""
echo "Recommended configurations:"
echo "  - 16GB RAM: ai/llama3.3:70B-Q4_0 (CPU mode, 30-60s per question)"
echo "  - 48GB+ RAM: ai/llama3.3:70B-Q4_K_M (GPU mode, 5-15s per question)"
echo ""

read -p "Which model do you want to install? (1=Q4_0/Light, 2=Q4_K_M/Full) [1]: " MODEL_CHOICE
MODEL_CHOICE=${MODEL_CHOICE:-1}

if [ "$MODEL_CHOICE" == "1" ]; then
    MODEL_IMAGE="ai/llama3.3:70B-Q4_0"
    MODEL_SIZE="37GB"
    MODEL_DESC="Lighter quantization for 16GB RAM"
else
    MODEL_IMAGE="ai/llama3.3:70B-Q4_K_M"
    MODEL_SIZE="40GB"
    MODEL_DESC="Full quantization for 48GB+ RAM"
fi

echo ""
echo "[INFO] Selected: $MODEL_IMAGE"
echo "[INFO] Size: $MODEL_SIZE"
echo "[INFO] Description: $MODEL_DESC"
echo ""
echo "[WARNING] This will download approximately $MODEL_SIZE"
echo "[WARNING] Download time: 30-60 minutes depending on internet speed"
echo ""

read -p "Continue with download? (y/n) [y]: " CONFIRM
CONFIRM=${CONFIRM:-y}
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "[INFO] Setup cancelled."
    exit 0
fi

echo ""
echo "[INFO] Step 1/4: Pulling Llama model..."
echo "[INFO] This may take 30-60 minutes. Please be patient..."
echo ""

docker model pull $MODEL_IMAGE
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to pull model. Please check your internet connection."
    echo "[TIP] You can also download via Docker Desktop GUI (Images → Pull)"
    exit 1
fi

echo ""
echo "[SUCCESS] Model downloaded successfully!"
echo ""

# Update docker-compose.yml with selected model
echo "[INFO] Step 2/4: Updating docker-compose.yml..."
sed -i.bak "s|image: ai/llama3\.3:.*|image: $MODEL_IMAGE|g" docker-compose.yml
echo "[SUCCESS] Configuration updated"
echo ""

echo "[INFO] Step 3/4: Starting services..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to start services"
    exit 1
fi

echo ""
echo "[SUCCESS] Services starting..."
echo ""
echo "[INFO] Waiting for services to be ready (30 seconds)..."
sleep 30

echo ""
echo "[INFO] Step 4/4: Verifying installation..."
docker-compose ps

echo ""
echo "================================================================"
echo "   Setup Complete!"
echo "================================================================"
echo ""
echo "Services Status:"
docker-compose ps | grep -E "(llama|backend|frontend|mongo)"
echo ""
echo "Next Steps:"
echo ""
echo "1. Open your browser: http://localhost:3000"
echo "2. Login with: admin@quiz.com / admin123"
echo "3. Go to \"Manage Quizzes\" > \"AI Quiz Generator\""
echo "4. Generate your first AI quiz!"
echo ""
echo "Performance Notes:"
if [ "$MODEL_CHOICE" == "1" ]; then
    echo "  - First generation: 60-90 seconds (model loading)"
    echo "  - Subsequent: 30-60 seconds per question"
    echo "  - TIP: Generate 2-3 questions at a time"
else
    echo "  - First generation: 10-20 seconds (model loading)"
    echo "  - Subsequent: 5-15 seconds per question"
    echo "  - Works best with NVIDIA GPU"
fi
echo ""
echo "Monitoring Commands:"
echo "  docker-compose logs -f llama       (View Llama logs)"
echo "  docker-compose logs -f backend     (View backend logs)"
echo "  docker stats llama                 (Monitor resources)"
echo ""
echo "Documentation:"
echo "  LLAMA_INTEGRATION_GUIDE.md         (Complete guide)"
echo "  AI_FEATURES_QUICK_REFERENCE.md     (Quick reference)"
echo ""
echo "Troubleshooting:"
echo "  If model is slow: Close other apps to free RAM"
echo "  If generation fails: docker-compose restart llama"
echo "  If out of memory: See LLAMA_INTEGRATION_GUIDE.md"
echo ""
echo "================================================================"
echo ""
