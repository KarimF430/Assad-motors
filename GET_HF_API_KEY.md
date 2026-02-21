# 🚀 Get Your FREE Hugging Face API Key

## ✅ **Quick Setup (2 Minutes)**

### **Step 1: Sign Up (FREE)**

1. **Go to Hugging Face:**
   ```
   https://huggingface.co/join
   ```

2. **Fill in details:**
   ```
   Email: your@email.com
   Username: your-username
   Password: ********
   ```

3. **Verify email** (check your inbox)

4. **Done!** You have a FREE account ✅

---

### **Step 2: Get API Token**

1. **Go to Settings:**
   ```
   https://huggingface.co/settings/tokens
   ```

2. **Click "New token"**

3. **Fill in:**
   ```
   Name: ai-car-finder
   Type: Read (select this)
   ```

4. **Click "Generate token"**

5. **Copy the token:**
   ```
   hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   ⚠️ **Save it now!** You can't see it again!

---

### **Step 3: Add to Your Project**

**Local Development:**

1. **Create `.env.local` file:**
   ```bash
   # In your project root
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`:**
   ```bash
   HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   USE_HUGGINGFACE=true
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Save the file**

**Vercel Deployment:**

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Select your project**

3. **Go to Settings → Environment Variables**

4. **Add new variable:**
   ```
   Name: HF_API_KEY
   Value: hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

5. **Click "Save"**

---

## 🧪 **Test It**

### **Test Locally:**

```bash
# 1. Make sure .env.local has your key
cat .env.local | grep HF_API_KEY

# 2. Restart your backend
# Stop: Ctrl+C
# Start: npm run dev

# 3. Test the API
curl -X POST http://localhost:3001/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need a family car under 15 lakhs",
    "sessionId": "test123"
  }'

# Should get AI response!
```

### **Test on Website:**

```bash
# 1. Start your app
npm run dev

# 2. Open browser
http://localhost:3000/ai-chat

# 3. Type a message
"I need a 5 seater car"

# 4. Should get AI response!
```

---

## ✅ **Verify Setup**

Check console logs for:

```
✅ Correct:
🤖 AI Mode: Hugging Face (Vercel)
✅ Using Hugging Face (FREE tier)
Using model: meta-llama/Meta-Llama-3.1-8B-Instruct

❌ Wrong:
⚠️ HF_API_KEY not found
⚠️ Using fallback logic
```

---

## 🎯 **What You're Using**

```
Model: Llama 3.1 8B Instruct
Platform: Hugging Face
Cost: FREE (1000 requests/day)
Speed: 2-4 seconds
Accuracy: 90-95%
```

**Same model as your local Ollama!** ✅

---

## 💰 **FREE Tier Limits**

```
Requests: 1000/day
Rate Limit: 30 requests/minute
Models: All open source models
Cost: $0

For most users: More than enough!
```

**If you need more:**
```
Pro Plan: $9/month
Requests: Unlimited
Speed: Faster
Priority: Higher
```

---

## 🔒 **Security**

**Keep your API key safe:**

- ✅ Never commit to Git
- ✅ Use `.env.local` (already in .gitignore)
- ✅ Only share with trusted services (Vercel)
- ✅ Regenerate if exposed

**If compromised:**
```
1. Go to https://huggingface.co/settings/tokens
2. Click "Revoke" on old token
3. Create new token
4. Update .env.local and Vercel
```

---

## 📝 **Summary**

### **What You Did:**

1. ✅ Created FREE Hugging Face account
2. ✅ Generated API token
3. ✅ Added to `.env.local`
4. ✅ Ready to use!

### **What You Get:**

```
✅ Llama 3.1 8B (best model)
✅ FREE (1000/day)
✅ Works on local and Vercel
✅ Same model everywhere
✅ No downloads needed
```

---

## 🚀 **Next Steps**

1. **Test locally** with your API key
2. **Deploy to Vercel** when ready
3. **Start chatting** with your AI!

---

## 🔗 **Useful Links**

- **Sign Up:** https://huggingface.co/join
- **Get Token:** https://huggingface.co/settings/tokens
- **Models:** https://huggingface.co/models
- **Docs:** https://huggingface.co/docs/api-inference
- **Pricing:** https://huggingface.co/pricing

---

**You're all set! Your AI is ready to use!** 🎉
