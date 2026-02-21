import { Router, Request, Response } from 'express';
import { priceMonitoringService } from '../services/price-monitoring.service';

const router = Router();

/**
 * Get price history for a specific variant
 * GET /api/price-history/variant/:variantId
 */
router.get('/variant/:variantId', async (req: Request, res: Response) => {
    try {
        const { variantId } = req.params;
        const limit = parseInt(req.query.limit as string) || 10;

        const history = await priceMonitoringService.getVariantPriceHistory(variantId, limit);

        res.json({
            success: true,
            count: history.length,
            history
        });
    } catch (error: any) {
        console.error('Error fetching variant price history:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get recent price drops across all variants
 * GET /api/price-history/recent-drops
 */
router.get('/recent-drops', async (req: Request, res: Response) => {
    try {
        const days = parseInt(req.query.days as string) || 7;
        const limit = parseInt(req.query.limit as string) || 20;

        const drops = await priceMonitoringService.getRecentPriceDrops(days, limit);

        res.json({
            success: true,
            count: drops.length,
            drops
        });
    } catch (error: any) {
        console.error('Error fetching recent price drops:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
