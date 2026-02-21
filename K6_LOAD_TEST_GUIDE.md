# 🚀 K6 Load Testing Guide - gadizone

## 📊 Test Overview

**Target Load:** 500,000 daily users  
**Users per Second:** ~20 (average)  
**Test Duration:** 67 minutes  
**Peak Load:** 60 users/second (3x normal)

---

## 🛠️ Prerequisites

### 1. Install K6

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```bash
choco install k6
```

**Or download from:** https://k6.io/docs/get-started/installation/

---

## 🎯 Available Test Scripts

### 1. **Full Load Test** (k6-load-test.js)
- Duration: ~67 minutes
- Simulates 500k daily users
- Tests all user journeys
- Includes stress testing

### 2. **Quick Smoke Test** (k6-quick-test.js)
- Duration: 5 minutes
- Quick validation
- Basic functionality check

---

## 🚀 Running Tests

### Step 1: Start Your Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Wait for both services to be ready!

---

### Step 2: Run Load Test

**Terminal 3 - Full Load Test:**
```bash
k6 run k6-load-test.js
```

**With Custom URLs:**
```bash
k6 run k6-load-test.js \
  -e BASE_URL=http://localhost:3000 \
  -e BACKEND_URL=http://localhost:5000
```

**Quick Smoke Test:**
```bash
k6 run k6-quick-test.js
```

**With HTML Report:**
```bash
k6 run k6-load-test.js --out json=results.json
```

---

## 📈 Test Stages

### Full Load Test Timeline:

```
0-2min:   Warm up (5 users)
2-7min:   Ramp up (10 users)
7-12min:  Target load (20 users/sec) ← Normal traffic
12-42min: Sustained load (20 users/sec) ← Main test
42-47min: Spike test (40 users/sec) ← 2x load
47-52min: Recovery (20 users/sec)
52-57min: Stress test (60 users/sec) ← 3x load
57-62min: Recovery (20 users/sec)
62-67min: Cool down (0 users)
```

---

## 🎭 User Journey Scenarios

The test simulates 5 realistic user behaviors:

### 1. Homepage Browsing (30%)
- Load homepage
- View popular cars
- Check popular comparisons
- Scroll through content

### 2. Search Journey (20%)
- Perform AI search
- View search results
- Browse filtered cars

### 3. Brand Exploration (20%)
- Visit brand page
- View brand models
- Check specifications

### 4. Model Details View (15%)
- Open model page
- View variants
- Check pricing
- Read features

### 5. Comparison Journey (15%)
- Load comparison page
- View popular comparisons
- Compare car models

---

## 📊 Success Criteria (Thresholds)

### Response Time:
- ✅ 95% of requests < 2 seconds
- ✅ 90% of API calls < 1 second
- ✅ 95% of page loads < 3 seconds

### Reliability:
- ✅ Error rate < 1%
- ✅ 99% of requests succeed

### Performance:
- ✅ System stable under 20 users/sec
- ✅ Handles 2x spike (40 users/sec)
- ✅ Survives 3x stress (60 users/sec)

---

## 📈 Interpreting Results

### Good Results:
```
✅ http_req_duration........: avg=500ms  p(95)=1500ms
✅ http_req_failed.........: 0.5%
✅ http_reqs...............: 50000 (20/s)
```

### Warning Signs:
```
⚠️  http_req_duration........: avg=1500ms  p(95)=3000ms
⚠️  http_req_failed.........: 2%
⚠️  http_reqs...............: 30000 (12/s)
```

### Critical Issues:
```
❌ http_req_duration........: avg=5000ms  p(95)=10000ms
❌ http_req_failed.........: 10%
❌ http_reqs...............: 10000 (4/s)
```

---

## 🔧 Optimization Tips

### If Response Times Are High:

1. **Database Optimization:**
   - Add indexes
   - Optimize queries
   - Use caching

2. **API Optimization:**
   - Enable compression
   - Implement pagination
   - Add response caching

3. **Frontend Optimization:**
   - Enable CDN
   - Optimize images
   - Lazy load components

### If Error Rate Is High:

1. **Check Logs:**
   ```bash
   # Backend logs
   tail -f backend/logs/error.log
   
   # Frontend logs
   npm run dev (check console)
   ```

2. **Monitor Resources:**
   ```bash
   # CPU and Memory
   top
   
   # Network
   netstat -an | grep ESTABLISHED | wc -l
   ```

3. **Scale Services:**
   - Increase server resources
   - Add load balancer
   - Use horizontal scaling

---

## 📊 Monitoring During Test

### Real-time Monitoring:

**Terminal 4 - Backend Health:**
```bash
watch -n 1 'curl -s http://localhost:5000/api/stats'
```

**Terminal 5 - System Resources:**
```bash
# macOS
top -l 1 | head -n 10

# Linux
htop
```

---

## 🎯 Test Scenarios by Load

### Light Load (5-10 users/sec):
- Normal daily traffic
- Should handle easily
- Response time < 500ms

### Normal Load (20 users/sec):
- Peak daily traffic
- Target performance
- Response time < 1000ms

### Heavy Load (40 users/sec):
- Marketing campaign spike
- Should handle gracefully
- Response time < 2000ms

### Stress Load (60 users/sec):
- Extreme conditions
- System should survive
- Response time < 5000ms

---

## 📝 Sample Output

```
     ✓ homepage loaded
     ✓ brands API responded
     ✓ models API responded
     ✓ comparisons loaded

     checks.........................: 98.50% ✓ 49250  ✗ 750
     data_received..................: 250 MB 62 kB/s
     data_sent......................: 15 MB  3.8 kB/s
     http_req_blocked...............: avg=1.2ms   p(95)=5ms
     http_req_connecting............: avg=800µs   p(95)=3ms
     http_req_duration..............: avg=450ms   p(95)=1.2s
     http_req_failed................: 1.50%  ✓ 750   ✗ 49250
     http_reqs......................: 50000  20.83/s
     iteration_duration.............: avg=5.2s    p(95)=8s
     iterations.....................: 10000  4.17/s
     vus............................: 20     min=0   max=60
     vus_max........................: 60     min=60  max=60
```

---

## 🚨 Troubleshooting

### Test Won't Start:
```bash
# Check if services are running
curl http://localhost:3000
curl http://localhost:5000/api/brands

# Check K6 installation
k6 version
```

### High Error Rate:
```bash
# Check backend logs
cd backend
npm run dev (check console)

# Check database connection
# Verify API endpoints
```

### Slow Response Times:
```bash
# Check system resources
top

# Check network latency
ping localhost

# Check database performance
# Monitor query execution time
```

---

## 📊 Expected Results for 500k Daily Users

### Requests:
- Total: ~50,000 requests in test
- Rate: 20 requests/second average
- Peak: 60 requests/second

### Response Times:
- Average: 400-800ms
- P95: 1000-2000ms
- P99: 2000-3000ms

### Success Rate:
- Target: 99%+
- Acceptable: 98%+
- Critical: < 95%

---

## 🎯 Next Steps After Testing

### If Tests Pass:
1. ✅ Document results
2. ✅ Set up monitoring
3. ✅ Configure alerts
4. ✅ Plan for scaling

### If Tests Fail:
1. ❌ Identify bottlenecks
2. ❌ Optimize code
3. ❌ Add caching
4. ❌ Scale infrastructure
5. ❌ Re-run tests

---

## 📞 Support

For issues or questions:
- Check K6 docs: https://k6.io/docs/
- Review test logs
- Monitor system resources
- Optimize bottlenecks

---

**Happy Load Testing! 🚀**
