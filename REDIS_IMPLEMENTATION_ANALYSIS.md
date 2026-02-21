# Redis Cache Implementation - Complete Analysis

## Performance Impact of connect-redis Downgrade

**ZERO PERFORMANCE IMPACT** - Here's why:

| Aspect | v9.0.0 | v7.1.1 | Impact |
|--------|--------|--------|--------|
| Session SET operation | O(1) | O(1) | Same |
| Session GET operation | O(1) | O(1) | Same |
| Redis commands used | SET, GET, DEL, EXPIRE | SET, GET, DEL, EXPIRE | Identical |
| Serialization | JSON.stringify/parse | JSON.stringify/parse | Same |
| Network calls | 1 per operation | 1 per operation | Same |

The only difference is v9 uses the `redis` npm package's API, while v7 adapts both `redis` and `ioredis` APIs. The actual Redis server operations are **identical**.

---

## Complete Redis Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       REDIS (Upstash)                           │
│                   Single Redis Instance                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SESSIONS (connect-redis)              │   │
│  │  Prefix: sess:                                           │   │
│  │  Example: sess:tahR-2bKph5ltZyserw-mH2H6gU_huHQ          │   │
│  │  TTL: 30 days                                            │   │
│  │  Data: { userId, userEmail, cookie settings }            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      API CACHE                           │   │
│  │  Prefix: cache:v2:                                       │   │
│  │  Example: cache:v2:brands:/api/brands:{}                 │   │
│  │  TTL: 5 min - 2 hours (varies by endpoint)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   CAR HASH STORAGE                       │   │
│  │  Prefix: car:                                            │   │
│  │  Example: car:model-brand-bmw-3-series                   │   │
│  │  Uses: HSET/HGETALL (structured data)                    │   │
│  │  TTL: 30 minutes                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    SEARCH INDEX                          │   │
│  │  Prefix: search:idx: and search:data:                    │   │
│  │  Uses: ZSET (sorted sets) + String storage               │   │
│  │  TTL: Persistent until rebuild                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   YOUTUBE CACHE                          │   │
│  │  Key: youtube:popular-videos                             │   │
│  │  TTL: 24 hours                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Redis Configuration (`redis-config.ts`)

### Client: `ioredis`

**Connection Options:**
- `maxRetriesPerRequest: 3` - Limit retries per request
- `enableOfflineQueue: false` - Fail fast if disconnected
- `lazyConnect: true` - Don't block server startup
- `keepAlive: 30000` - 30 second keepalive ping
- `family: 4` - IPv4 only (Render/Upstash compatibility)

**Retry Strategy:**
- Exponential backoff
- Max 5 connection attempts
- Max 3 second delay

**TLS Support:**
- Enabled via `REDIS_TLS=true` env var
- Uses TLSv1.2 minimum

**Singleton Pattern:**
- Single Redis client instance shared across all modules
- `getRedisClient()` - General access
- `getSessionRedisClient()` - For session store
- `getCacheRedisClient()` - For caching

---

## 2. Session Storage (`index.ts` + `connect-redis`)

### Configuration:
```typescript
{
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,              // HTTPS only in production
    httpOnly: true,            // No JS access
    maxAge: 30 days,
    sameSite: 'none',          // Cross-origin cookies
    domain: '.gadizone.com'    // Cross-subdomain sharing
  },
  name: 'sid',
  proxy: true                  // Trust proxy for Render/Vercel
}
```

### Storage:
- **Key format:** `sess:{sessionID}`
- **Value:** JSON serialized session data
- **TTL:** 30 days (cookie maxAge)

---

## 3. API Cache Middleware (`redis-cache.ts`)

### Middleware: `redisCacheMiddleware(ttl, staleTime)`

**Features:**
1. **Stale-While-Revalidate (SWR):**
   - Returns stale data immediately
   - Refreshes in background
   - Zero latency for users

2. **Cache Stampede Prevention:**
   - Uses Redis locks (`lock:{key}`)
   - Only 1 request refreshes cache
   - Others wait for result

3. **Response Headers:**
   - `X-Cache: HIT | MISS | STALE | HIT-AFTER-WAIT`
   - `X-Cache-TTL: seconds remaining`

### Key Format:
```
cache:v2:{namespace}:{path}:{query_json}
```

### TTL Values (in seconds):
| Cache Type | TTL | Stale Time |
|------------|-----|------------|
| Brands | 3600 (1h) | 300 (5m) |
| Models | 1800 (30m) | 180 (3m) |
| Popular Cars | 3600 (1h) | - |
| Model Details | 3600 (1h) | - |
| Brand Models | 1800 (30m) | - |
| Variants | 900 (15m) | 120 (2m) |
| Stats | 300 (5m) | - |
| Comparisons | 7200 (2h) | - |
| News | 600 (10m) | - |
| Search | 1800 (30m) | 180 (3m) |
| Car Details | 1800 (30m) | - |

---

## 4. Car Details Hash Storage

### Function: `cacheCarDetails(carId, carData, ttl)`

**Uses Redis Hash (HSET) for structured data:**
```
Key: car:{brandSlug}-{modelSlug}
Fields:
  - id, name, brand
  - price, fuelType, transmission
  - rating, image
  - updatedAt (timestamp)
```

**Benefits of Hash:**
- Fetch individual fields without full deserialization
- Atomic field updates
- Memory efficient for structured data

---

## 5. Search Index

### Location: `search-index.ts`

**Structure:**
1. **Index (Sorted Set):**
   - Key: `search:idx:{query_prefix}`
   - Score: Relevance score
   - Value: Car/Brand ID

2. **Data (String):**
   - Key: `search:data:{id}`
   - Value: JSON serialized search result

**Operations:**
- `ZRANGE` - Get top N results for query
- `KEYS` - Find matching indices (prefix search)
- `MGET` - Batch fetch search result data
- `PIPELINE` - Batch write operations

---

## 6. YouTube Cache

### Location: `youtube.ts`

**Single Cache Entry:**
- Key: `youtube:popular-videos`
- TTL: 86400 seconds (24 hours)
- Value: JSON stringified video list

---

## 7. Cache Operations Summary

### Redis Commands Used:

| Command | Purpose | Files |
|---------|---------|-------|
| `GET` | Retrieve cached data | All cache operations |
| `SET` | Store data with options | Locks, raw storage |
| `SETEX` | Store with TTL | API cache, YouTube |
| `DEL` | Delete keys | Invalidation, cleanup |
| `TTL` | Check remaining time | SWR logic |
| `EXPIRE` | Update TTL | Hash storage |
| `HSET` | Store hash fields | Car details |
| `HGETALL` | Get all hash fields | Car details retrieval |
| `KEYS` | Pattern matching | Search, invalidation |
| `SCAN` | Safe pattern matching | Invalidation |
| `ZRANGE` | Get sorted set range | Search index |
| `PIPELINE` | Batch operations | Index rebuild |
| `MGET` | Batch get | Search results |
| `FLUSHDB` | Clear all data | Full cache clear |
| `INFO` | Server statistics | Monitoring |
| `DBSIZE` | Key count | Monitoring |
| `PING` | Health check | Diagnostics |

---

## 8. Cache Warmup (Server Startup)

### Function: `warmUpCache(storage)`

**Pre-caches on server start:**
1. All brands (36 brands)
2. Popular models (196 models)
3. Top 10 models as hashes

**Purpose:**
- Ensures first requests are fast
- Reduces cold start latency

---

## 9. Cache Invalidation

### Strategies:

1. **Pattern-based:** `invalidateRedisCache(pattern)`
   - Uses SCAN for production safety
   - Matches `cache:*{pattern}*`

2. **Full clear:** `clearAllCache()`
   - Uses FLUSHDB
   - For emergency/deployment resets

3. **Automatic TTL expiry:**
   - Most caches auto-expire
   - No manual cleanup needed

---

## 10. Endpoints Using Redis Cache

| Endpoint | Cache Type | TTL |
|----------|------------|-----|
| `/api/brands` | API Cache | 1 hour |
| `/api/models` | API Cache | 30 min |
| `/api/variants` | API Cache | 15 min |
| `/api/news` | API Cache | 10 min |
| `/api/search` | Search Index | 30 min |
| `/api/youtube/popular` | YouTube Cache | 24 hours |
| Model/Variant lookup | Hash Storage | 30 min |

---

## 11. Monitoring & Stats

### Endpoint: `/api/monitoring/metrics`

**Provides:**
- `connected`: Redis connection status
- `totalKeys`: Number of cached keys
- `hitRate`: Cache hit percentage
- `hits/misses`: Absolute counts
- `usedMemory`: Memory consumption
- `evictedKeys`: Keys removed due to memory
- `expiredKeys`: Keys that expired

---

## Summary

Your Redis implementation is **production-ready** with:

| Feature | Status |
|---------|--------|
| Connection pooling | ✅ Singleton pattern |
| Automatic reconnection | ✅ Exponential backoff |
| TLS encryption | ✅ Configurable |
| Session persistence | ✅ 30-day sessions |
| API response caching | ✅ Multi-tier TTL |
| Stale-While-Revalidate | ✅ Zero latency |
| Cache stampede prevention | ✅ Redis locks |
| Search indexing | ✅ Sorted sets |
| Hash storage | ✅ For car details |
| Cache warmup | ✅ On server start |
| Pattern invalidation | ✅ SCAN-based |
| Monitoring | ✅ Stats endpoint |
| Graceful shutdown | ✅ Connection cleanup |

**The connect-redis downgrade affects ONLY the session storage adapter, and has ZERO impact on any of the above caching functionality.**
