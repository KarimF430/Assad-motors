# 🕐 Scheduled API Fetcher - Complete Setup Guide

## 📋 Overview

The Scheduled API Fetcher automatically fetches data from external APIs **only twice per day** (1:00 PM and 8:00 PM IST) to save API tokens and costs.

### ⏰ Schedule
- **1:00 PM IST (13:00)** - Afternoon fetch
- **8:00 PM IST (20:00)** - Evening fetch

### 💰 Token Savings
- **Before**: Unlimited API calls (expensive)
- **After**: Only 2 API calls per day (cost-effective)

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install node-cron
```

### 2. Configure Environment Variables
Add these to your `backend/.env` file:

```bash
# External API Configuration
EXTERNAL_API_TOKEN=your_actual_api_token_here
EXTERNAL_API_BASE_URL=https://your-api-provider.com

# Specific API Endpoints (customize these)
CAR_API_ENDPOINT=https://your-api-provider.com/cars
BRAND_API_ENDPOINT=https://your-api-provider.com/brands
NEWS_API_ENDPOINT=https://your-api-provider.com/news

# Scheduler Settings
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE=Asia/Kolkata
```

### 3. Customize API Endpoints
Edit `backend/services/scheduledFetcher.js` and update these functions with your actual API endpoints:

```javascript
// Update these functions with your real API calls
async fetchCarData() {
  const response = await fetch('YOUR_ACTUAL_CAR_API_ENDPOINT', {
    headers: {
      'Authorization': `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  // ... rest of the logic
}
```

### 4. Start the Server
```bash
npm run dev
```

You should see:
```
✅ Scheduled API fetcher initialized (1:00 PM & 8:00 PM IST)
📅 Next fetches scheduled for: 1:00 PM and 8:00 PM IST
```

## 🔧 API Endpoints

The scheduler adds these management endpoints:

### Get Scheduler Status
```bash
GET /api/scheduler/status
```

**Response:**
```json
{
  "success": true,
  "status": {
    "isRunning": false,
    "lastFetchTimes": {
      "afternoon": "2025-11-14T07:30:00.000Z",
      "evening": null
    },
    "nextScheduledTimes": [
      "13:00 IST (1:00 PM)",
      "20:00 IST (8:00 PM)"
    ]
  }
}
```

### Get Cached Data
```bash
# Get all cached data
GET /api/scheduler/cache

# Get specific time slot data
GET /api/scheduler/cache/afternoon
GET /api/scheduler/cache/evening
```

### Manual Trigger (Use Sparingly!)
```bash
POST /api/scheduler/trigger
Authorization: Bearer your_admin_token
Content-Type: application/json

{
  "reason": "Testing new API integration"
}
```

### View Logs
```bash
GET /api/scheduler/logs
```

## 📊 Monitoring & Usage

### Check if Scheduler is Working
```bash
curl http://localhost:5001/api/scheduler/status
```

### View Recent Logs
```bash
curl http://localhost:5001/api/scheduler/logs
```

### Check Cached Data
```bash
curl http://localhost:5001/api/scheduler/cache/afternoon
```

## 🎯 Customization Examples

### Example 1: Car Price API
```javascript
async fetchCarData() {
  try {
    const response = await fetch('https://api.carprice.com/v1/prices', {
      headers: {
        'Authorization': `Bearer ${process.env.CAR_PRICE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      count: data.cars?.length || 0,
      data: data.cars || [],
      tokensUsed: 1,
      fetchTime: new Date().toISOString()
    };
  } catch (error) {
    console.error('Car price API error:', error);
    return { count: 0, data: [], tokensUsed: 0, error: error.message };
  }
}
```

### Example 2: News API
```javascript
async fetchNewsData() {
  try {
    const response = await fetch('https://newsapi.org/v2/everything?q=cars&apiKey=' + process.env.NEWS_API_KEY);
    const data = await response.json();
    
    return {
      count: data.articles?.length || 0,
      data: data.articles || [],
      tokensUsed: 1,
      fetchTime: new Date().toISOString()
    };
  } catch (error) {
    console.error('News API error:', error);
    return { count: 0, data: [], tokensUsed: 0, error: error.message };
  }
}
```

## 📁 File Structure

```
backend/
├── services/
│   └── scheduledFetcher.js     # Main scheduler logic
├── server/
│   └── schedulerIntegration.js # API routes integration
├── cache/                      # Auto-created
│   ├── fetch-cache.json       # Cached API results
│   └── fetch-history.json     # Fetch timestamps
├── logs/                       # Auto-created
│   └── scheduler.log          # Scheduler logs
└── .env.scheduler.example     # Environment template
```

## 🔒 Security Features

### Authentication Required
- All management endpoints require authentication
- Manual triggers require admin tokens
- API tokens are securely stored in environment variables

### Rate Limiting
- Built-in protection against excessive API calls
- Prevents accidental token consumption
- Logs all API usage for monitoring

### Error Handling
- Graceful failure handling
- Automatic fallback mechanisms
- Comprehensive error logging

## 🚨 Important Notes

### Token Conservation
- **Only 2 API calls per day** (saves ~95% of tokens)
- Manual triggers should be used sparingly
- Each API call is logged and tracked

### Timezone Handling
- All times are in **IST (Asia/Kolkata)**
- Cron jobs respect timezone settings
- Logs include timezone information

### Cache Management
- Data is cached between fetch cycles
- Cache persists across server restarts
- Old cache data is automatically cleaned

## 🛠️ Troubleshooting

### Scheduler Not Running
```bash
# Check if scheduler is initialized
curl http://localhost:5001/api/scheduler/status

# Check server logs for errors
tail -f backend/logs/scheduler.log
```

### API Calls Failing
1. Verify API tokens in `.env` file
2. Check API endpoint URLs
3. Review error logs: `GET /api/scheduler/logs`
4. Test API endpoints manually

### Cache Issues
```bash
# Clear cache manually
rm backend/cache/fetch-cache.json
rm backend/cache/fetch-history.json

# Restart server to reinitialize
npm run dev
```

## 📈 Benefits

### Cost Savings
- **95% reduction** in API calls
- **Predictable costs** - only 2 calls per day
- **Token conservation** for other features

### Performance
- **Cached data** available instantly
- **Reduced latency** for users
- **Server resource optimization**

### Reliability
- **Scheduled consistency** - always up-to-date
- **Fallback mechanisms** if APIs fail
- **Comprehensive logging** for debugging

## 🎯 Next Steps

1. **Customize API endpoints** for your specific data sources
2. **Set up monitoring** to track API usage and costs
3. **Configure alerts** for failed fetches
4. **Optimize cache duration** based on data freshness needs

The scheduler is now ready to save your API tokens while keeping your data fresh! 🚀
