/**
 * Recommendations API Routes
 * 
 * Provides personalized and similar car recommendations
 * with support for both model-level and variant-level queries.
 */

import express, { Router, Request, Response } from 'express';
import {
    getSimilarModels,
    getSimilarVariants,
    getPersonalizedRecommendations
} from '../services/recommendation.service';
import {
    logActivity,
    getRecentActivities,
    getInferredPreferences
} from '../db/user-activity.schema';

const router: Router = express.Router();

// ============================================================================
// RECOMMENDATION ENDPOINTS
// ============================================================================

/**
 * GET /api/recommendations/similar/model/:modelId
 * Get similar models to a given model
 */
router.get('/similar/model/:modelId', async (req: Request, res: Response) => {
    try {
        const { modelId } = req.params;
        const limit = parseInt(req.query.limit as string) || 6;
        const excludeStr = (req.query.exclude as string) || '';
        const excludeIds = excludeStr ? excludeStr.split(',') : [];

        const recommendations = await getSimilarModels(
            { type: 'model', sourceId: modelId },
            limit,
            excludeIds
        );

        res.json({
            success: true,
            count: recommendations.length,
            recommendations
        });
    } catch (error: any) {
        console.error('[Recommendations API] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get recommendations'
        });
    }
});

/**
 * GET /api/recommendations/similar/variant/:variantId
 * Get similar variants to a given variant (more precise budget matching)
 */
router.get('/similar/variant/:variantId', async (req: Request, res: Response) => {
    try {
        const { variantId } = req.params;
        const limit = parseInt(req.query.limit as string) || 6;
        const excludeStr = (req.query.exclude as string) || '';
        const excludeIds = excludeStr ? excludeStr.split(',') : [];

        const recommendations = await getSimilarVariants(
            { type: 'variant', sourceId: variantId },
            limit,
            excludeIds
        );

        res.json({
            success: true,
            count: recommendations.length,
            recommendations
        });
    } catch (error: any) {
        console.error('[Recommendations API] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get recommendations'
        });
    }
});

/**
 * GET /api/recommendations/personalized
 * Get personalized recommendations based on user activity
 */
router.get('/personalized', async (req: Request, res: Response) => {
    try {
        const userId = (req.session as any)?.userId;
        const sessionId = req.sessionID || req.query.sessionId as string;
        const limit = parseInt(req.query.limit as string) || 5;

        const recommendations = await getPersonalizedRecommendations(
            userId,
            sessionId,
            limit
        );

        res.json({
            success: true,
            count: recommendations.length,
            recommendations
        });
    } catch (error: any) {
        console.error('[Recommendations API] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get recommendations'
        });
    }
});

// ============================================================================
// ACTIVITY TRACKING ENDPOINTS
// ============================================================================

/**
 * POST /api/recommendations/activity
 * Log user activity for recommendation improvement
 */
router.post('/activity', async (req: Request, res: Response) => {
    try {
        const {
            activityType,
            modelId,
            variantId,
            brandId,
            duration,
            metadata,
            inferredPreferences
        } = req.body;

        const userId = (req.session as any)?.userId;
        const sessionId = req.sessionID || req.body.sessionId;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: 'Session ID required'
            });
        }

        if (!activityType) {
            return res.status(400).json({
                success: false,
                error: 'Activity type required'
            });
        }

        await logActivity({
            userId,
            sessionId,
            activityType,
            modelId,
            variantId,
            brandId,
            duration,
            metadata,
            inferredPreferences
        });

        res.json({ success: true });
    } catch (error: any) {
        console.error('[Activity API] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to log activity'
        });
    }
});

/**
 * GET /api/recommendations/preferences
 * Get inferred user preferences from activity history
 */
router.get('/preferences', async (req: Request, res: Response) => {
    try {
        const userId = (req.session as any)?.userId;
        const sessionId = req.sessionID || req.query.sessionId as string;

        if (!userId && !sessionId) {
            return res.status(400).json({
                success: false,
                error: 'User ID or Session ID required'
            });
        }

        const preferences = await getInferredPreferences({ userId, sessionId });

        res.json({
            success: true,
            preferences
        });
    } catch (error: any) {
        console.error('[Preferences API] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get preferences'
        });
    }
});

/**
 * GET /api/recommendations/history
 * Get recent activity history for a user/session
 */
router.get('/history', async (req: Request, res: Response) => {
    try {
        const userId = (req.session as any)?.userId;
        const sessionId = req.sessionID || req.query.sessionId as string;
        const limit = parseInt(req.query.limit as string) || 20;

        if (!userId && !sessionId) {
            return res.status(400).json({
                success: false,
                error: 'User ID or Session ID required'
            });
        }

        const activities = await getRecentActivities({ userId, sessionId }, limit);

        res.json({
            success: true,
            count: activities.length,
            activities
        });
    } catch (error: any) {
        console.error('[History API] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get history'
        });
    }
});

export default router;
