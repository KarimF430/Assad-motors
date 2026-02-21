/**
 * AI Feedback & Analytics API Routes
 * 
 * Endpoints for:
 * - Recording user feedback (thumbs up/down)
 * - Recording car clicks
 * - Getting learning metrics and analytics
 */

import { Router, Request, Response } from 'express'
import {
    recordFeedback,
    recordCarClick,
    getLearningMetrics,
    getRecentInteractions
} from '../ai-engine/self-learning'
import { getVectorStoreStats, refreshVectorStore } from '../ai-engine/vector-store'

const router = Router()

// ============================================
// FEEDBACK ENDPOINTS
// ============================================

/**
 * POST /api/ai-feedback
 * Record user feedback on AI response
 * Body: { sessionId, query, feedback: 'thumbs_up' | 'thumbs_down', feedbackText? }
 */
router.post('/feedback', async (req: Request, res: Response) => {
    try {
        const { sessionId, query, feedback, feedbackText } = req.body

        if (!sessionId || !query || !feedback) {
            return res.status(400).json({
                error: 'Missing required fields: sessionId, query, feedback'
            })
        }

        if (!['thumbs_up', 'thumbs_down'].includes(feedback)) {
            return res.status(400).json({
                error: 'feedback must be thumbs_up or thumbs_down'
            })
        }

        await recordFeedback(sessionId, query, feedback, feedbackText)

        res.json({
            success: true,
            message: `Feedback recorded: ${feedback}`
        })

    } catch (error) {
        console.error('Feedback API error:', error)
        res.status(500).json({ error: 'Failed to record feedback' })
    }
})

/**
 * POST /api/ai-feedback/car-click
 * Record when user clicks on a recommended car
 * Body: { sessionId, modelId }
 */
router.post('/car-click', async (req: Request, res: Response) => {
    try {
        const { sessionId, modelId } = req.body

        if (!sessionId || !modelId) {
            return res.status(400).json({
                error: 'Missing required fields: sessionId, modelId'
            })
        }

        await recordCarClick(sessionId, modelId)

        res.json({
            success: true,
            message: 'Car click recorded'
        })

    } catch (error) {
        console.error('Car click API error:', error)
        res.status(500).json({ error: 'Failed to record car click' })
    }
})

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

/**
 * GET /api/ai-feedback/metrics
 * Get comprehensive learning metrics
 */
router.get('/metrics', async (_req: Request, res: Response) => {
    try {
        const metrics = await getLearningMetrics()
        const vectorStats = getVectorStoreStats()

        res.json({
            learning: metrics,
            vectorStore: vectorStats,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Metrics API error:', error)
        res.status(500).json({ error: 'Failed to get metrics' })
    }
})

/**
 * GET /api/ai-feedback/interactions
 * Get recent interactions for debugging
 */
router.get('/interactions', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 20
        const interactions = await getRecentInteractions(limit)

        res.json({
            count: interactions.length,
            interactions
        })

    } catch (error) {
        console.error('Interactions API error:', error)
        res.status(500).json({ error: 'Failed to get interactions' })
    }
})

/**
 * POST /api/ai-feedback/refresh-vectors
 * Force refresh of vector store (admin endpoint)
 */
router.post('/refresh-vectors', async (_req: Request, res: Response) => {
    try {
        console.log('🔄 Refreshing vector store...')
        await refreshVectorStore()
        const stats = getVectorStoreStats()

        res.json({
            success: true,
            message: 'Vector store refreshed',
            stats
        })

    } catch (error) {
        console.error('Refresh vectors error:', error)
        res.status(500).json({ error: 'Failed to refresh vector store' })
    }
})

export default router
