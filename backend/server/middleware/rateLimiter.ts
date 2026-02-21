import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getRedisClient } from './redis-cache';

/**
 * Rate Limiting Middleware for API Protection
 * Prevents DDoS attacks and API abuse
 */

// Create a fresh Redis store per limiter with unique prefix.
function makeStore(prefix: string) {
  try {
    const redis = getRedisClient();
    // If Redis isn't ready, fall back to memory store silently
    if (!redis || (redis as any).status !== 'ready') return undefined;
    return new (RedisStore as any)({
      sendCommand: (...args: string[]) => (redis as any).call(...args),
      prefix,
    });
  } catch (e) {
    return undefined;
  }
}

// General API rate limiter - applies to all /api routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: makeStore('rl:api:'),
  // Skip rate limiting for certain IPs (e.g., internal services)
  skip: (req) => {
    // Skip for localhost in development
    if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') {
      return true;
    }
    return false;
  }
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:auth:'),
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Moderate rate limiter for data modification endpoints
export const modifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 POST/PUT/PATCH/DELETE requests per minute
  message: {
    error: 'Too many modification requests, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:modify:'),
  // Only apply to modification methods
  skip: (req) => {
    return !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  }
});

// Lenient rate limiter for public read-only endpoints
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: {
    error: 'Too many requests, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:public:'),
});

// Very strict limiter for bulk operations
export const bulkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 bulk operations per hour
  message: {
    error: 'Too many bulk operations, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:bulk:'),
});

/**
 * Rate Limiting Strategy:
 * 
 * 1. Public endpoints (GET /api/brands, /api/models): publicLimiter (60/min)
 * 2. Auth endpoints (POST /api/auth/login): authLimiter (5/15min)
 * 3. Modification endpoints (POST/PUT/PATCH/DELETE): modifyLimiter (20/min)
 * 4. Bulk operations (POST /api/bulk/*): bulkLimiter (10/hour)
 * 5. All other API endpoints: apiLimiter (100/15min)
 * 
 * Benefits:
 * - Prevents DDoS attacks
 * - Protects against brute force login attempts
 * - Prevents API abuse
 * - Reduces infrastructure costs
 * - Improves service stability
 */
