import { Router } from 'express';
import { getRedisCacheStats } from '../middleware/redis-cache';
import { getCacheStats } from '../middleware/cache';
import mongoose from 'mongoose';

const router = Router();

/**
 * Health Check Endpoint
 * Returns system health status
 */
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        redis: 'unknown',
        memory: 'unknown'
      }
    };

    // Check MongoDB
    try {
      const dbState = mongoose.connection.readyState;
      health.services.database = dbState === 1 ? 'connected' : 'disconnected';
    } catch (error) {
      health.services.database = 'error';
    }

    // Check Redis
    try {
      const redisStats = await getRedisCacheStats();
      health.services.redis = redisStats.connected ? 'connected' : 'disconnected';
    } catch (error) {
      health.services.redis = 'error';
    }

    // Check Memory
    const memUsage = process.memoryUsage();
    const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    health.services.memory = `${memUsedMB}MB / ${memTotalMB}MB`;

    // Determine overall status
    const allHealthy = Object.values(health.services).every(
      status => status !== 'error' && status !== 'disconnected'
    );
    health.status = allHealthy ? 'healthy' : 'degraded';

    const statusCode = allHealthy ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Metrics Endpoint
 * Returns detailed system metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      },
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      cpu: {
        usage: process.cpuUsage()
      },
      database: {
        status: 'unknown',
        connections: 0
      },
      cache: {
        redis: {},
        memory: {}
      }
    };

    // MongoDB metrics
    try {
      metrics.database.status = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      // Get connection pool stats if available
      const poolSize = (mongoose.connection.db as any)?.serverConfig?.s?.poolSize || 0;
      metrics.database.connections = poolSize;
    } catch (error) {
      metrics.database.status = 'error';
    }

    // Redis cache metrics
    try {
      metrics.cache.redis = await getRedisCacheStats();
    } catch (error) {
      metrics.cache.redis = { error: 'Redis not available' };
    }

    // Memory cache metrics
    try {
      metrics.cache.memory = getCacheStats();
    } catch (error) {
      metrics.cache.memory = { error: 'Memory cache not available' };
    }

    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get metrics',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Readiness Check
 * Returns whether the service is ready to accept traffic
 */
router.get('/ready', async (req, res) => {
  try {
    // Check if database is connected
    const dbReady = mongoose.connection.readyState === 1;

    if (dbReady) {
      res.status(200).json({
        ready: true,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        ready: false,
        reason: 'Database not connected',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Liveness Check
 * Returns whether the service is alive
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString()
  });
});

/**
 * Performance Stats
 * Returns performance statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      timestamp: new Date().toISOString(),
      requests: {
        // These would be tracked by middleware in production
        total: 0,
        success: 0,
        errors: 0,
        averageResponseTime: 0
      },
      cache: {
        redis: await getRedisCacheStats(),
        memory: getCacheStats()
      },
      database: {
        queries: 0, // Would be tracked by middleware
        averageQueryTime: 0
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get stats',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
