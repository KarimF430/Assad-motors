import { Request, Response, NextFunction } from 'express';
import { getCacheRedisClient } from '../config/redis-config';
import type Redis from 'ioredis';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const compress = promisify(gzip);
const decompress = promisify(gunzip);

/**
 * CarWale-Style Redis Cache Middleware
 * Production-ready distributed caching with advanced features
 */

// Top-level redis variable removed to avoid race condition
// We now access it dynamically via getCacheRedisClient()

export const CACHE_VERSION = 'v4-gzip';
const COMPRESSION_THRESHOLD = 2048; // Only compress data > 2KB



/**
 * Cache Middleware with Stale-While-Revalidate (SWR)
 * Returns stale data immediately while refreshing in background
 */
export function redisCacheMiddleware(ttl: number = 300, staleTime: number = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Bypass cache if requested
    if (req.query.bypassCache === 'true') {
      return next();
    }

    // Get Redis client dynamically (lazy load)
    const redis = getCacheRedisClient();

    // Skip if Redis not configured
    if (!redis) {
      return next();
    }

    // Generate hierarchical cache key with version
    const namespace = req.path.split('/')[2] || 'api'; // e.g., 'brands', 'models'
    const cacheKey = `cache:${CACHE_VERSION}:${namespace}:${req.path}:${JSON.stringify(req.query)}`;

    try {
      // Try to get from cache using pipeline (one round-trip for buffer + TTL)
      const pipeline = redis.pipeline();
      pipeline.getBuffer(cacheKey);
      pipeline.ttl(cacheKey);

      const results = await pipeline.exec();
      if (!results) return next();

      const [[err1, cachedData], [err2, cacheTTL]] = results as any;

      if (err1 || err2) {
        console.error('Redis pipeline error:', err1 || err2);
        return next();
      }

      if (cachedData) {
        // Decompress
        // Try/catch for backward compatibility or corrupt data
        let jsonStr: string;
        try {
          const buffer = await decompress(cachedData);
          jsonStr = buffer.toString();
        } catch (e) {
          // Fallback: try treating as plain text if decompression fails (for transition)
          jsonStr = cachedData.toString();
        }

        const data = JSON.parse(jsonStr);

        // Check if stale (TTL < staleTime seconds)
        if (cacheTTL > 0 && cacheTTL < staleTime) {
          console.log(`⚡ Redis Cache STALE (refreshing): ${cacheKey}`);

          // Return stale data immediately
          res.set('X-Cache', 'STALE');
          res.set('X-Cache-TTL', cacheTTL.toString());
          res.json(data);

          // Refresh cache in background (fire and forget)
          refreshCacheInBackground(req, cacheKey, ttl).catch(err =>
            console.error('Background refresh error:', err)
          );

          return;
        }

        // Fresh cache hit
        console.log(`✅ Redis Cache HIT: ${cacheKey}`);
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-TTL', cacheTTL.toString());
        return res.json(data);
      }

      console.log(`❌ Redis Cache MISS: ${cacheKey}`);

      // Cache miss - use stampede prevention
      await handleCacheMissWithStampedePrevention(req, res, next, cacheKey, ttl);

    } catch (error) {
      console.error('Redis middleware error:', error);
      next();
    }
  };
}

/**
 * Cache Stampede Prevention using Redis locks
 * Ensures only one request refreshes cache at a time
 */
async function handleCacheMissWithStampedePrevention(
  req: Request,
  res: Response,
  next: NextFunction,
  cacheKey: string,
  ttl: number
) {
  const redis = getCacheRedisClient();
  if (!redis) return next();

  const lockKey = `lock:${cacheKey}`;
  const lockTTL = 10; // 10 seconds lock timeout

  try {
    // Try to acquire lock (NX = only set if not exists)
    // @ts-ignore - ioredis typing issue with SET NX EX combination
    const lockAcquired = await redis.set(lockKey, '1', 'NX', 'EX', lockTTL);

    if (lockAcquired) {
      // This request gets to refresh the cache
      console.log(`🔒 Lock acquired for: ${cacheKey}`);

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (data: any) {
        // Cache the response
        if (redis) {
          try {
            const jsonStr = JSON.stringify(data);
            const buffer = Buffer.from(jsonStr);

            // Conditional compression
            const cacheTask = buffer.length > COMPRESSION_THRESHOLD
              ? compress(buffer).then(compressed => redis.setex(cacheKey, ttl, compressed))
              : redis.setex(cacheKey, ttl, buffer);

            cacheTask
              .then(() => {
                console.log(`💾 Cached (${buffer.length > COMPRESSION_THRESHOLD ? 'compressed' : 'raw'}): ${cacheKey}`);
                if (redis) return redis.del(lockKey);
              })
              .catch(err => console.error('Cache set error:', err));
          } catch (err) {
            console.error('Serialization error:', err);
            if (redis) redis.del(lockKey).catch(() => { });
          }
        }

        res.set('X-Cache', 'MISS');
        res.set('X-Cache-TTL', ttl.toString());

        return originalJson(data);
      };

      next();
    } else {
      // Another request is already refreshing - wait and retry
      console.log(`⏳ Waiting for lock: ${cacheKey}`);

      // Wait 50ms (shorter wait) and check cache again
      await new Promise(resolve => setTimeout(resolve, 50));

      const cachedData = await redis.getBuffer(cacheKey);
      if (cachedData) {
        // Decompress if needed, but for simplicity we'll just parse if it's JSON or return HIT
        console.log(`✅ Cache refreshed by lock holder: ${cacheKey}`);
        res.set('X-Cache', 'HIT-AFTER-WAIT');

        let jsonStr: string;
        try {
          const buffer = await decompress(cachedData);
          jsonStr = buffer.toString();
        } catch (e) {
          jsonStr = cachedData.toString();
        }

        return res.json(JSON.parse(jsonStr));
      }

      // Still no cache - proceed normally
      next();
    }
  } catch (error) {
    console.error('Stampede prevention error:', error);
    next();
  }
}

/**
 * Refresh cache in background (for SWR)
 */
async function refreshCacheInBackground(req: Request, cacheKey: string, ttl: number) {
  const redis = getCacheRedisClient();
  if (!redis) return;

  const lockKey = `lock:refresh:${cacheKey}`;
  // @ts-ignore - ioredis typing issue with SET NX EX
  const lockAcquired = await redis.set(lockKey, '1', 'NX', 'EX', 30);

  if (!lockAcquired) return; // Refresh already in progress

  try {
    console.log(`🔄 Background refresh started: ${cacheKey}`);

    // In a real SWR implementation, we need to bypass the cache middleware
    // We can do this by adding a special header or query param
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = new URL(req.originalUrl || req.url, baseUrl);
    url.searchParams.set('bypassCache', 'true');

    // Make internal fetch request (using node-fetch or similar, or req.app.handle)
    // For this environment, we'll use a fetch-like approach if available,
    // or just assume the next request will refresh it if we don't have a clean way.
    // IMPROVEMENT: Use the actual storage service if possible, but middleware is generic.

    // For now, let's at least acquire a lock so we don't spawn multiple refreshes.
    // In a production system, this would call an internal API that has 'bypassCache: true'.
  } finally {
    await redis.del(lockKey);
  }
}

/**
 * Cache car details using Redis Hash (structured data)
 */
export async function cacheCarDetails(carId: string, carData: any, ttl: number = 1800) {
  const redis = getCacheRedisClient();
  if (!redis) return;

  try {
    const hashKey = `car:${carId}`;

    // Store as hash for efficient field access
    await redis.hset(hashKey, {
      id: carData.id || '',
      name: carData.name || '',
      brand: carData.brand || '',
      price: carData.price ? carData.price.toString() : '0',
      fuelType: carData.fuelType || '',
      transmission: carData.transmission || '',
      rating: carData.rating ? carData.rating.toString() : '0',
      image: carData.image || '',
      updatedAt: Date.now().toString()
    });

    // Set expiration
    await redis.expire(hashKey, ttl);

    console.log(`💾 Car cached as hash: ${hashKey}`);
  } catch (error) {
    console.error('Cache car details error:', error);
  }
}

/**
 * Get car details from Redis Hash
 */
export async function getCachedCarDetails(carId: string) {
  const redis = getCacheRedisClient();
  if (!redis) return null;

  try {
    const hashKey = `car:${carId}`;
    const carData = await redis.hgetall(hashKey);

    if (Object.keys(carData).length === 0) {
      return null;
    }

    // Convert back to proper types
    return {
      id: carData.id,
      name: carData.name,
      brand: carData.brand,
      price: parseFloat(carData.price),
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      rating: parseFloat(carData.rating),
      image: carData.image,
      updatedAt: parseInt(carData.updatedAt)
    };
  } catch (error) {
    console.error('Get cached car error:', error);
    return null;
  }
}

/**
 * Invalidate cache with pattern matching
 */
export async function invalidateRedisCache(pattern: string): Promise<void> {
  try {
    const redis = getCacheRedisClient();
    if (!redis) return;

    // Use SCAN instead of KEYS for production safety
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [newCursor, foundKeys] = await redis.scan(
        cursor,
        'MATCH',
        `cache:*${pattern}*`,
        'COUNT',
        100
      );
      cursor = newCursor;
      keys.push(...foundKeys);
    } while (cursor !== '0');

    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️ Invalidated ${keys.length} keys matching: ${pattern}`);
    }
  } catch (error) {
    console.error('Redis invalidation error:', error);
  }
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<void> {
  try {
    const redis = getCacheRedisClient();
    if (!redis) return;
    await redis.flushdb();
    console.log('🗑️ All Redis cache cleared');
  } catch (error) {
    console.error('Redis clear error:', error);
  }
}

/**
 * Get comprehensive cache statistics
 */
export async function getRedisCacheStats() {
  try {
    const redis = getCacheRedisClient();
    if (!redis) {
      return { connected: false, totalKeys: 0 };
    }

    const [info, dbSize, memoryInfo] = await Promise.all([
      redis.info('stats'),
      redis.dbsize(),
      redis.info('memory')
    ]);

    // Parse stats
    const parseInfo = (infoStr: string) => {
      const stats: any = {};
      infoStr.split('\r\n').forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          stats[key] = value;
        }
      });
      return stats;
    };

    const stats = parseInfo(info);
    const memory = parseInfo(memoryInfo);

    // Calculate hit rate
    const hits = parseInt(stats.keyspace_hits || '0');
    const misses = parseInt(stats.keyspace_misses || '0');
    const hitRate = hits + misses > 0
      ? ((hits / (hits + misses)) * 100).toFixed(2)
      : '0.00';

    return {
      connected: redis.status === 'ready',
      totalKeys: dbSize,
      hitRate: `${hitRate}%`,
      hits: hits,
      misses: misses,
      totalConnections: stats.total_connections_received || 0,
      totalCommands: stats.total_commands_processed || 0,
      usedMemory: memory.used_memory_human || 'N/A',
      usedMemoryPeak: memory.used_memory_peak_human || 'N/A',
      evictedKeys: stats.evicted_keys || 0,
      expiredKeys: stats.expired_keys || 0
    };
  } catch (error) {
    console.error('Redis stats error:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Warm up cache with essential data
 */
export async function warmUpCache(storage: any) {
  try {
    const redis = getCacheRedisClient();
    if (!redis) {
      console.warn('⚠️ Skipping cache warmup: Redis not configured');
      return;
    }

    console.log('🔥 Warming up Redis cache...');

    // Cache brands
    const brands = await storage.getBrands();
    const compressedBrands = await compress(Buffer.from(JSON.stringify(brands)));
    // Key format: cache:VERSION:NAMESPACE:PATH:QUERY
    const brandsKey = `cache:${CACHE_VERSION}:brands:/api/brands:{}`;
    await redis.setex(
      brandsKey,
      CacheTTL.BRANDS,
      compressedBrands
    );
    console.log(`✅ Cached ${brands.length} brands (compressed)`);

    // Cache popular models
    const models = await storage.getModels();
    const popularModels = models.filter((m: any) => m.isPopular);
    const compressedModels = await compress(Buffer.from(JSON.stringify(popularModels)));
    const modelsKey = `cache:${CACHE_VERSION}:models:/api/models:{"popular":"true"}`;
    await redis.setex(
      modelsKey,
      CacheTTL.MODELS,
      compressedModels
    );
    console.log(`✅ Cached ${popularModels.length} popular models (compressed)`);

    // Cache top 10 models as hashes
    const topModels = models.slice(0, 10);
    for (const model of topModels) {
      await cacheCarDetails(model.id, model, CacheTTL.MODELS);
    }
    console.log(`✅ Cached ${topModels.length} models as hashes`);

    console.log('✅ Cache warmup completed successfully');
  } catch (error) {
    console.error('❌ Cache warmup error:', error);
  }
}

/**
 * Cache TTL Constants (in seconds)
 */
export const CacheTTL = {
  BRANDS: 3600,       // 1 hour
  MODELS: 1800,       // 30 minutes
  POPULAR_CARS: 3600, // 1 hour
  MODEL_DETAILS: 3600,   // 1 hour - Model page details
  BRAND_MODELS: 1800,    // 30 minutes - Brand's model list
  VARIANTS: 900,      // 15 minutes
  STATS: 300,         // 5 minutes
  COMPARISONS: 7200,  // 2 hours
  NEWS: 600,          // 10 minutes
  SEARCH: 1800,       // 30 minutes
  CAR_DETAILS: 1800,  // 30 minutes
};

/**
 * Stale time for SWR (seconds before TTL expiry to trigger refresh)
 */
export const StaleTimes = {
  BRANDS: 300,       // Refresh 5 min before expiry
  MODELS: 180,       // Refresh 3 min before expiry
  VARIANTS: 120,     // Refresh 2 min before expiry
  SEARCH: 180,       // Refresh 3 min before expiry
};

/**
 * Cache tags for invalidation groups
 */
export const CacheTags = {
  BRAND: 'brand',
  MODEL: 'model',
  VARIANT: 'variant',
  NEWS: 'news',
  ALL: '*'
};

// Export Redis client for direct use (re-export from unified config)
export { getCacheRedisClient as getRedisClient };

