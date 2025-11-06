#!/bin/bash

# Setup Fine-Tuned Quiz Generation Model on Mac Mini M4
# This creates a specialized model optimized for quiz question generation

echo "════════════════════════════════════════════════════════════════"
echo "🎓 Quiz Generation Model Setup"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed!"
    echo "Install with: curl -fsSL https://ollama.com/install.sh | sh"
    exit 1
fi

echo "✅ Ollama is installed"
echo ""

# Check if base model exists
echo "➡️  Checking for base model (qwen2.5-coder:7b)..."
if ! ollama list | grep -q "qwen2.5-coder:7b"; then
    echo "⚠️  Base model not found. Pulling qwen2.5-coder:7b..."
    echo "   (This may take several minutes)"
    ollama pull qwen2.5-coder:7b
    echo "✅ Base model downloaded"
else
    echo "✅ Base model already available"
fi
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MODELFILE_PATH="$SCRIPT_DIR/../ai-training/modelfiles/Modelfile.quiz-master"

# Check if Modelfile exists
if [ ! -f "$MODELFILE_PATH" ]; then
    echo "❌ Modelfile not found at: $MODELFILE_PATH"
    echo "Please ensure the project structure is correct"
    exit 1
fi

echo "✅ Modelfile found"
echo ""

# Create the fine-tuned model
echo "➡️  Creating fine-tuned quiz generation model..."
echo "   Model name: quiz-master"
echo "   Based on: qwen2.5-coder:7b"
echo ""

ollama create quiz-master -f "$MODELFILE_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "✅ SUCCESS! Quiz Master model created!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "📊 Model Information:"
    ollama show quiz-master
    echo ""
    echo "🧪 Test the model:"
    echo "   ollama run quiz-master"
    echo ""
    echo "💡 To use in your app, update backend/.env:"
    echo "   OLLAMA_MODEL=quiz-master"
    echo ""
    echo "🎯 The model is now optimized for:"
    echo "   ✓ Generating quiz questions"
    echo "   ✓ Multiple programming languages"
    echo "   ✓ Appropriate difficulty levels"
    echo "   ✓ Clear explanations"
    echo "   ✓ Valid JSON output"
    echo ""
else
    echo "❌ Failed to create model"
    exit 1
fi
