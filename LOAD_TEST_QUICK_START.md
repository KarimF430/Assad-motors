# ⚡ K6 Load Test - Quick Start

## 🎯 Goal
Test gadizone with **500k daily users** (~20 users/second)

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Install K6
```bash
brew install k6
```

### 2️⃣ Start Services
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### 3️⃣ Run Test
```bash
# Quick test (5 min)
./run-load-test.sh quick

# Full test (67 min)
./run-load-test.sh full
```

---

## 📊 What Gets Tested

✅ **Homepage** - Popular cars, comparisons  
✅ **Search** - AI-powered car search  
✅ **Brands** - Brand pages and models  
✅ **Models** - Model details and variants  
✅ **Comparisons** - Popular comparisons API  

---

## ✅ Success Criteria

- Response time < 2 seconds (95%)
- Error rate < 1%
- Handles 20 users/second
- Survives 60 users/second spike

---

## 📈 Test Stages

```
Warm up    → 5 users
Normal     → 20 users/sec (30 min)
Spike      → 40 users/sec (5 min)
Stress     → 60 users/sec (5 min)
Cool down  → 0 users
```

---

## 🎭 User Scenarios

- 30% Homepage browsing
- 20% Search journey
- 20% Brand exploration
- 15% Model details
- 15% Comparisons

---

## 📊 Expected Results

```
✅ Total Requests:    ~50,000
✅ Requests/Second:   ~20 avg
✅ Avg Response:      400-800ms
✅ P95 Response:      1-2 seconds
✅ Success Rate:      99%+
```

---

## 🔧 Troubleshooting

**Services not running?**
```bash
curl http://localhost:3000
curl http://localhost:5000/api/brands
```

**K6 not installed?**
```bash
k6 version
```

**Need help?**
- Read: `K6_LOAD_TEST_GUIDE.md`
- Check: Backend/Frontend logs

---

## 📁 Files Created

- `k6-load-test.js` - Full test (67 min)
- `k6-quick-test.js` - Quick test (5 min)
- `run-load-test.sh` - Easy runner script
- `K6_LOAD_TEST_GUIDE.md` - Complete guide

---

**Ready to test? Run:** `./run-load-test.sh quick` 🚀
