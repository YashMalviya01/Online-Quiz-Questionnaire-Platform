#!/bin/bash

# Question Bank System - Installation Script
# Installs dependencies for question generation features

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Question Bank System - Setup Script                       ║"
echo "║   No external API keys required                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the backend directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "🔑 Next Steps:"
echo ""
echo "1. Start the backend server:"
echo "   npm run dev"
echo ""
echo "2. Access question generation:"
echo "   - Login as instructor or admin"
echo "   - Navigate to Quiz Configuration"
echo "   - Click 'Generate Questions'"
echo ""
echo "3. Question Bank Features:"
echo "   - 4000+ pre-built questions"
echo "   - Multiple languages (JavaScript, Python, Java, C++)"
echo "   - Topic-based filtering"
echo "   - Multiple question types (MCQ, True/False, Fill-in-the-blank, Coding)"
echo ""
echo "📚 For more information, see:"
echo "   - README.md (Question Generation section)"
echo ""
echo "🎉 Setup complete! Happy quiz generating!"
