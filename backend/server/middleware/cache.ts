import { Request, Response, NextFunction } from 'express';

/**
 * Simple In-Memory Cache Middleware
 * For production, replace with Redis
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number = 1000; // Max 1000 entries

  set(key: string, data: any, ttl: number = 300): void {
    // Clean old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000 // Convert to milliseconds
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
}

// Singleton cache instance
const cache = new SimpleCache();

/**
 * Cache Middleware Factory
 * Usage: app.get('/api/brands', cacheMiddleware(3600), handler)
 */
export function cacheMiddleware(ttl: number = 300) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = `${req.path}:${JSON.stringify(req.query)}`;

    // Try to get from cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`✅ Cache HIT: ${cacheKey}`);
      return res.json(cachedData);
    }

    console.log(`❌ Cache MISS: ${cacheKey}`);

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function(data: any) {
      cache.set(cacheKey, data, ttl);
      return originalJson(data);
    };

    next();
  };
}

/**
 * Invalidate cache for specific patterns
 */
export function invalidateCache(pattern: string): void {
  // For simple cache, we'll clear all
  // In Redis, you'd use pattern matching
  cache.clear();
  console.log(`🗑️ Cache invalidated: ${pattern}`);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return cache.getStats();
}

/**
 * Cache TTL Constants (in seconds)
 */
export const CacheTTL = {
  BRANDS: 3600,      // 1 hour
  MODELS: 1800,      // 30 minutes
  VARIANTS: 900,     // 15 minutes
  STATS: 300,        // 5 minutes
  COMPARISONS: 7200, // 2 hours
};

/**
 * TODO: For production with 1M+ users, replace with Redis:
 * 
 * import Redis from 'ioredis';
 * const redis = new Redis({
 *   host: process.env.REDIS_HOST || 'localhost',
 *   port: parseInt(process.env.REDIS_PORT || '6379'),
 *   password: process.env.REDIS_PASSWORD,
 *   maxRetriesPerRequest: 3,
 *   enableOfflineQueue: false,
 * });
 * 
 * Benefits of Redis:
 * - Distributed caching across multiple servers
 * - Persistent cache (survives server restarts)
 * - Advanced features (pub/sub, sorted sets, etc.)
 * - Better performance at scale
 * - Pattern-based invalidation
 */
