import { Router } from 'express';
import { getRedisCacheStats, clearAllCache, invalidateRedisCache } from '../middleware/redis-cache';

const router = Router();

/**
 * GET /api/cache/stats
 * Get Redis cache statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await getRedisCacheStats();
        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * POST /api/cache/clear
 * Clear all cache (admin only)
 */
router.post('/clear', async (req, res) => {
    try {
        await clearAllCache();
        res.json({
            success: true,
            message: 'All cache cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * POST /api/cache/invalidate
 * Invalidate cache by pattern
 * Body: { pattern: 'brands' | 'models' | 'variants' }
 */
router.post('/invalidate', async (req, res) => {
    try {
        const { pattern } = req.body;

        if (!pattern) {
            return res.status(400).json({
                success: false,
                error: 'Pattern is required'
            });
        }

        await invalidateRedisCache(pattern);

        res.json({
            success: true,
            message: `Cache invalidated for pattern: ${pattern}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * GET /api/cache/health
 * Check Redis health
 */
router.get('/health', async (req, res) => {
    try {
        const stats = await getRedisCacheStats();

        const isHealthy = stats.connected &&
            parseFloat(stats.hitRate || '0') > 50;

        res.json({
            success: true,
            healthy: isHealthy,
            redis: {
                connected: stats.connected,
                hitRate: stats.hitRate,
                totalKeys: stats.totalKeys
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            healthy: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
