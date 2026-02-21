# 🚀 Ollama + Llama 3.1 Setup Guide

## Overview

This guide will help you set up Ollama with Llama 3.1 8B for the AI Car Finder.

---

## ✅ Installation Steps

### 1. Install Ollama (In Progress)

Ollama is currently being installed via Homebrew. This may take 5-10 minutes.

```bash
brew install ollama
```

### 2. Start Ollama Server

Once installation completes, start the Ollama server:

```bash
# Start Ollama in the background
ollama serve &
```

Or run it in a separate terminal:

```bash
ollama serve
```

**Note**: Keep this running while your app is active!

### 3. Download Llama 3.1 Model

Download the Llama 3.1 8B model (~4.7GB):

```bash
ollama pull llama3.1:8b
```

This will take 5-10 minutes depending on your internet speed.

### 4. Test Ollama

Test that everything works:

```bash
# Test the model
ollama run llama3.1:8b "Extract car requirements: I need a 5 seater under 15 lakhs"
```

You should see a response from the AI!

### 5. Verify API Access

Test the HTTP API:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:8b",
  "prompt": "Hello, are you working?",
  "stream": false
}'
```

---

## 🔧 Configuration

### Environment Variables (Optional)

Add to your `.env` file if Ollama is running on a different host:

```bash
# Default: http://localhost:11434
OLLAMA_URL=http://localhost:11434
```

---

## 🎯 How It Works

### 1. User sends message
```
"I need a car for 5 people under 15 lakhs"
```

### 2. Ollama extracts requirements
```json
{
  "seating": 5,
  "budget": {"max": 1500000},
  "usage": null,
  "fuelType": null,
  "features": []
}
```

### 3. System asks follow-up questions
```
"Great! What's your budget range?"
```

### 4. When enough info collected, show results
```
"🎯 I found 3 cars that match 85%+ of your requirements!"
```

---

## 📊 Performance

### Expected Performance:
- **Response time**: 1-3 seconds
- **Accuracy**: 85-90% for entity extraction
- **Memory usage**: ~8GB RAM
- **Concurrent users**: 5-10 (depends on hardware)

### System Requirements:
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 5GB for model
- **CPU**: Any modern CPU (M1/M2 Mac ideal)

---

## 🐛 Troubleshooting

### Ollama not running
```bash
# Error: ECONNREFUSED
# Solution: Start Ollama server
ollama serve
```

### Model not found
```bash
# Error: model 'llama3.1:8b' not found
# Solution: Download the model
ollama pull llama3.1:8b
```

### Slow responses
```bash
# Try a smaller model
ollama pull phi3:mini

# Update ollama-client.ts to use:
# const MODEL_NAME = 'phi3:mini'
```

### Out of memory
```bash
# Use a smaller model
ollama pull phi3:mini  # Only 2.3GB, runs on 4GB RAM
```

---

## 🔄 Alternative Models

If Llama 3.1 8B is too slow or uses too much RAM:

### Phi-3 Mini (Faster, Smaller)
```bash
ollama pull phi3:mini
# Size: 2.3GB
# RAM: 4GB
# Speed: < 1 second
```

### Mistral 7B (Alternative)
```bash
ollama pull mistral:7b
# Size: 4.1GB
# RAM: 6GB
# Speed: 1-2 seconds
```

Update `backend/ai-engine/ollama-client.ts`:
```typescript
const MODEL_NAME = 'phi3:mini'  // or 'mistral:7b'
```

---

## 📝 Next Steps

After Ollama is installed and running:

1. ✅ **Test the integration**
   ```bash
   # Start your backend
   cd backend
   npm run dev
   
   # In another terminal, test the AI chat
   curl -X POST http://localhost:3001/api/ai-chat \
     -H "Content-Type: application/json" \
     -d '{"message": "I need a car for 5 people", "sessionId": "test123"}'
   ```

2. ✅ **Try the frontend**
   - Go to http://localhost:3000
   - Click "Start AI Search"
   - Chat with the AI!

3. ✅ **Monitor performance**
   ```bash
   # Check Ollama logs
   ollama ps
   
   # Check running models
   ollama list
   ```

---

## 🎓 Learning Resources

- **Ollama Docs**: https://ollama.com/docs
- **Llama 3.1 Info**: https://ollama.com/library/llama3.1
- **API Reference**: https://github.com/ollama/ollama/blob/main/docs/api.md

---

## 🚀 Production Deployment

For production, you'll want to:

1. **Run Ollama as a service**
   ```bash
   # Create systemd service (Linux)
   # Or use launchd (Mac)
   # Or Docker container
   ```

2. **Use a dedicated server**
   - Ollama server on separate machine
   - Update OLLAMA_URL in .env

3. **Load balancing**
   - Multiple Ollama instances
   - Nginx load balancer

4. **Monitoring**
   - Track response times
   - Monitor memory usage
   - Set up alerts

---

## ✅ Checklist

- [ ] Ollama installed (`brew install ollama`)
- [ ] Ollama server running (`ollama serve`)
- [ ] Llama 3.1 model downloaded (`ollama pull llama3.1:8b`)
- [ ] API test successful (curl test)
- [ ] Backend integration working
- [ ] Frontend chat working

---

**Status**: Ollama is currently being installed via Homebrew.
**Next**: Once installation completes, run `ollama serve` and `ollama pull llama3.1:8b`
