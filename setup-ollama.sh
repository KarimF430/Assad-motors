#!/bin/bash

# 🚀 Ollama Quick Start Script
# This script sets up and starts Ollama with Llama 3.1 for the AI Car Finder

set -e  # Exit on error

echo "🚀 Starting Ollama Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo -e "${RED}❌ Ollama is not installed!${NC}"
    echo ""
    echo "Installing Ollama via Homebrew..."
    brew install ollama
    echo -e "${GREEN}✅ Ollama installed!${NC}"
else
    echo -e "${GREEN}✅ Ollama is already installed${NC}"
fi

echo ""

# Check if Ollama server is running
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama server is already running${NC}"
else
    echo -e "${YELLOW}⚠️  Ollama server is not running${NC}"
    echo "Starting Ollama server in the background..."
    
    # Start Ollama in background
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    
    # Wait for server to start
    echo "Waiting for server to start..."
    sleep 3
    
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Ollama server started successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to start Ollama server${NC}"
        echo "Check logs: tail -f /tmp/ollama.log"
        exit 1
    fi
fi

echo ""

# Check if Llama 3.1 model is downloaded
if ollama list | grep -q "llama3.1:8b"; then
    echo -e "${GREEN}✅ Llama 3.1 8B model is already downloaded${NC}"
else
    echo -e "${YELLOW}⚠️  Llama 3.1 8B model not found${NC}"
    echo "Downloading Llama 3.1 8B (~4.7GB)..."
    echo "This may take 5-10 minutes depending on your internet speed..."
    echo ""
    
    ollama pull llama3.1:8b
    
    echo -e "${GREEN}✅ Llama 3.1 8B model downloaded!${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Ollama is ready!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test the model
echo "Testing Llama 3.1..."
echo ""

TEST_RESPONSE=$(curl -s http://localhost:11434/api/generate -d '{
  "model": "llama3.1:8b",
  "prompt": "Say hello in one word",
  "stream": false
}' | grep -o '"response":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TEST_RESPONSE" ]; then
    echo -e "${GREEN}✅ Test successful!${NC}"
    echo "Response: $TEST_RESPONSE"
else
    echo -e "${RED}❌ Test failed${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}📊 System Info${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Ollama URL: http://localhost:11434"
echo "Model: llama3.1:8b"
echo "Status: Running ✓"
echo ""

# Show available models
echo "Available models:"
ollama list

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🚀 Next Steps${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Start your backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start your frontend:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 and click 'Start AI Search'"
echo ""
echo "4. To stop Ollama:"
echo "   pkill ollama"
echo ""
echo "5. To view Ollama logs:"
echo "   tail -f /tmp/ollama.log"
echo ""
echo -e "${GREEN}✨ Happy coding!${NC}"
