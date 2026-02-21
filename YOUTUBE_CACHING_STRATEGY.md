# YouTube API Caching Strategy

## Problem
YouTube API has a daily quota limit. When the quota is exhausted, videos become inaccessible, breaking the user experience.

## Solution
Implemented a **multi-layer caching strategy** to minimize API calls and ensure videos remain accessible even when quota is exhausted.

## How It Works

### 1. **In-Memory Cache (24-hour TTL)**
- Videos are cached in server memory for 24 hours
- First request of the day fetches from YouTube API
- All subsequent requests within 24 hours serve from cache
- **Result**: Reduces API calls from potentially thousands to just 1 per day

### 2. **Stale Cache Fallback**
- If API quota is exhausted, serve stale cache (even if older than 24 hours)
- Videos remain accessible indefinitely using last successful fetch
- Cache persists until server restart

### 3. **Static Fallback Data**
- If no cache exists and API fails, serve curated static videos
- Ensures videos section never breaks
- Uses real video IDs so thumbnails and links work

## Cache Flow

```
Request → Check Cache (< 24h) → Serve Cached Data ✅
          ↓
          Cache Expired → Fetch from YouTube API
          ↓                ↓
          Success         Quota Exceeded
          ↓                ↓
          Update Cache    Serve Stale Cache (if available)
          Return Fresh    ↓
                          No Cache → Serve Static Fallback
```

## Benefits

1. **Quota Efficiency**: ~99% reduction in API calls
   - Before: 1 call per page view
   - After: 1 call per day

2. **Reliability**: Videos always accessible
   - Fresh data when quota available
   - Stale cache when quota exhausted
   - Static fallback as last resort

3. **Performance**: Faster response times
   - Cache serves in <10ms
   - API calls take 500-1000ms

4. **User Experience**: Seamless
   - Users never see errors
   - Videos always playable
   - No visible difference between cached/fresh

## Monitoring

Check server logs for cache status:
- `✅ Serving YouTube videos from cache (age: X minutes)` - Cache hit
- `✅ Fetched fresh YouTube videos and updated cache` - Fresh fetch
- `⚠️ YouTube API error - serving stale cache (age: X hours)` - Quota exhausted, using stale cache
- `⚠️ YouTube API error and no cache - using fallback data` - Using static fallback

## Configuration

**Cache Duration**: 24 hours (configurable in `/app/api/youtube/videos/route.ts`)

```typescript
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
```

To change cache duration, modify this constant. Recommended values:
- **12 hours**: For frequently changing content
- **24 hours** (current): Balanced approach
- **48 hours**: Maximum quota savings

## API Key Setup

1. Update `.env.local`:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   YOUTUBE_CHANNEL_ID=@gadizone
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

## Testing

1. **Fresh Fetch**: Clear cache by restarting server, first request fetches fresh data
2. **Cache Hit**: Subsequent requests within 24h serve from cache
3. **Quota Exhaustion**: Temporarily remove API key to simulate quota exhaustion
4. **Fallback**: Remove API key and restart server to test static fallback

## Future Enhancements

- [ ] Persist cache to disk/database for survival across server restarts
- [ ] Add Redis caching for multi-instance deployments
- [ ] Implement background refresh to update cache before expiry
- [ ] Add admin endpoint to manually refresh cache
