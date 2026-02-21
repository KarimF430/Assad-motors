// High-Performance Monitoring & Optimization for 500k+ Daily Users

interface PerformanceMetrics {
  apiCalls: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  errorRate: number;
  lastUpdated: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

class PerformanceManager {
  private metrics: PerformanceMetrics;
  private cache: Map<string, CacheEntry<any>>;
  private requestTimes: number[];
  private maxRequestTimes: number = 1000; // Keep last 1000 request times

  constructor() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastUpdated: Date.now()
    };
    this.cache = new Map();
    this.requestTimes = [];

    // Cleanup cache every 5 minutes
    setInterval(() => this.cleanupCache(), 5 * 60 * 1000);
    
    // Log metrics every minute in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => this.logMetrics(), 60 * 1000);
    }
  }

  // Track API call performance
  trackApiCall(duration: number, success: boolean = true): void {
    this.metrics.apiCalls++;
    this.requestTimes.push(duration);
    
    // Keep only recent request times
    if (this.requestTimes.length > this.maxRequestTimes) {
      this.requestTimes.shift();
    }
    
    // Update average response time
    this.metrics.averageResponseTime = 
      this.requestTimes.reduce((a, b) => a + b, 0) / this.requestTimes.length;
    
    // Update error rate
    if (!success) {
      this.metrics.errorRate = (this.metrics.errorRate * (this.metrics.apiCalls - 1) + 1) / this.metrics.apiCalls;
    } else {
      this.metrics.errorRate = (this.metrics.errorRate * (this.metrics.apiCalls - 1)) / this.metrics.apiCalls;
    }
    
    this.metrics.lastUpdated = Date.now();
  }

  // Cache management
  setCache<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    });
  }

  getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.metrics.cacheMisses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.metrics.cacheMisses++;
      return null;
    }
    
    // Update hit count and metrics
    entry.hits++;
    this.metrics.cacheHits++;
    
    return entry.data;
  }

  // Clean expired cache entries
  private cleanupCache(): void {
    const now = Date.now();
    let cleaned = 0;
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    });
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }

  // Get performance metrics
  getMetrics(): PerformanceMetrics & {
    cacheSize: number;
    cacheHitRate: number;
    memoryUsage?: NodeJS.MemoryUsage;
  } {
    const totalCacheRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    const cacheHitRate = totalCacheRequests > 0 ? (this.metrics.cacheHits / totalCacheRequests) * 100 : 0;
    
    // Safely compute memory usage only in Node.js runtime (not Edge or Browser)
    let mem: any = undefined;
    try {
      const g: any = (globalThis as any);
      const p: any = g && g.process ? g.process : undefined;
      if (p && p.versions && p.versions.node && typeof p['memoryUsage'] === 'function') {
        mem = p['memoryUsage']();
      }
    } catch {}

    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      memoryUsage: mem
    };
  }

  // Log performance metrics
  private logMetrics(): void {
    const metrics = this.getMetrics();
    console.log('📊 Performance Metrics:', {
      'API Calls': metrics.apiCalls,
      'Avg Response Time': `${Math.round(metrics.averageResponseTime)}ms`,
      'Cache Hit Rate': `${metrics.cacheHitRate}%`,
      'Cache Size': metrics.cacheSize,
      'Error Rate': `${(metrics.errorRate * 100).toFixed(2)}%`,
      'Memory Usage': metrics.memoryUsage ? `${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)}MB` : 'N/A'
    });
  }

  // Clear all cache
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 All cache cleared');
  }

  // Get cache statistics
  getCacheStats(): Array<{key: string; size: number; hits: number; age: number}> {
    const now = Date.now();
    const stats: Array<{key: string; size: number; hits: number; age: number}> = [];
    
    this.cache.forEach((entry, key) => {
      stats.push({
        key,
        size: JSON.stringify(entry.data).length,
        hits: entry.hits,
        age: now - entry.timestamp
      });
    });
    
    return stats.sort((a, b) => b.hits - a.hits);
  }
}

// Create singleton instance
export const performanceManager = new PerformanceManager();

// High-performance fetch wrapper
export async function performantFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL: number = 300000
): Promise<T> {
  const startTime = Date.now();
  
  // Check cache first
  if (cacheKey) {
    const cached = performanceManager.getCache<T>(cacheKey);
    if (cached) {
      console.log(`🚀 Cache hit: ${cacheKey}`);
      return cached;
    }
  }
  
  try {
    console.log(`📡 Fetching: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      performanceManager.trackApiCall(duration, false);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    performanceManager.trackApiCall(duration, true);
    
    // Cache successful responses
    if (cacheKey) {
      performanceManager.setCache(cacheKey, data, cacheTTL);
      console.log(`💾 Cached: ${cacheKey} (TTL: ${cacheTTL}ms)`);
    }
    
    console.log(`✅ Fetch completed: ${url} (${duration}ms)`);
    return data;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    performanceManager.trackApiCall(duration, false);
    console.error(`❌ Fetch failed: ${url} (${duration}ms)`, error);
    throw error;
  }
}

// Get performance metrics (for React components to import separately)
export function getPerformanceMetrics() {
  return performanceManager.getMetrics();
}

// Utility functions for optimization
export const OptimizationUtils = {
  // Debounce function for search inputs
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  },
  
  // Throttle function for scroll events
  throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },
  
  // Lazy loading utility
  createIntersectionObserver(callback: (entries: IntersectionObserverEntry[]) => void) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1
    });
  },
  
  // Image optimization
  getOptimizedImageUrl(url: string, width: number, height: number, quality: number = 80): string {
    if (!url || url.startsWith('data:')) return url;
    
    // For Next.js Image optimization
    const params = new URLSearchParams({
      url: encodeURIComponent(url),
      w: width.toString(),
      h: height.toString(),
      q: quality.toString()
    });
    
    return `/_next/image?${params.toString()}`;
  }
};

export default performanceManager;
