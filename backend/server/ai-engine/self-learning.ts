/**
 * Self-Learning AI System - Production Ready
 * 
 * This system learns from every user interaction to improve over time.
 * Data is persisted to MongoDB for durability.
 * 
 * Features:
 * - Feedback collection (thumbs up/down)
 * - Pattern recognition from successful queries
 * - Context enhancement for similar future queries
 * - Analytics and metrics dashboard
 * - Auto-improvement over time
 */

import mongoose from 'mongoose'

// ============================================
// MONGODB SCHEMAS FOR LEARNING
// ============================================

/**
 * Store every AI interaction for learning
 */
const interactionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, index: true },
    query: { type: String, required: true },
    queryLower: { type: String, index: true }, // For pattern matching
    queryType: {
        type: String,
        enum: ['comparison', 'recommendation', 'price', 'features', 'safety', 'mileage', 'general'],
        default: 'general',
        index: true
    },
    response: { type: String, required: true },
    carsRecommended: [{
        modelId: String,
        modelName: String,
        brandName: String,
        clicked: { type: Boolean, default: false }
    }],
    feedback: {
        type: String,
        enum: ['thumbs_up', 'thumbs_down', 'none'],
        default: 'none',
        index: true
    },
    feedbackText: String,
    responseTimeMs: Number,
    contextUsed: String, // What RAG context was provided
    createdAt: { type: Date, default: Date.now, index: true }
})

// TTL index: auto-delete interactions older than 90 days
interactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

/**
 * Store learned patterns from successful interactions
 */
const learnedPatternSchema = new mongoose.Schema({
    patternKey: { type: String, required: true, unique: true }, // Normalized query pattern
    queryType: {
        type: String,
        enum: ['comparison', 'recommendation', 'price', 'features', 'safety', 'mileage', 'general'],
        required: true
    },
    exampleQueries: [String], // Original queries that matched this pattern
    successfulContext: String, // Context that led to positive feedback
    keywords: [String], // Extracted keywords for matching
    successCount: { type: Number, default: 0 },
    failCount: { type: Number, default: 0 },
    successRate: { type: Number, default: 0.5 },
    lastUsed: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

learnedPatternSchema.index({ queryType: 1, successRate: -1 })
learnedPatternSchema.index({ keywords: 1 })

// Create models (handle hot reload in dev)
export const AIInteraction = mongoose.models.AIInteraction || mongoose.model('AIInteraction', interactionSchema)
export const LearnedPattern = mongoose.models.LearnedPattern || mongoose.model('LearnedPattern', learnedPatternSchema)

// ============================================
// QUERY CLASSIFICATION
// ============================================

/**
 * Classify query type for better routing and learning
 */
export function classifyQuery(query: string): string {
    const lower = query.toLowerCase()

    // Comparison queries
    if (lower.includes(' vs ') || lower.includes('compare') || lower.includes('versus') ||
        lower.includes('better than') || lower.includes('difference between')) {
        return 'comparison'
    }

    // Recommendation queries
    if (lower.includes('best') || lower.includes('recommend') || lower.includes('suggest') ||
        lower.includes('which car') || lower.includes('should i buy') || lower.includes('good car')) {
        return 'recommendation'
    }

    // Price queries
    if (lower.includes('price') || lower.includes('cost') || lower.includes('lakh') ||
        lower.includes('budget') || lower.includes('on-road') || lower.includes('emi')) {
        return 'price'
    }

    // Safety queries
    if (lower.includes('safe') || lower.includes('ncap') || lower.includes('airbag') ||
        lower.includes('crash') || lower.includes('adas')) {
        return 'safety'
    }

    // Mileage queries
    if (lower.includes('mileage') || lower.includes('fuel efficiency') || lower.includes('kmpl') ||
        lower.includes('average') || lower.includes('economy')) {
        return 'mileage'
    }

    // Features queries
    if (lower.includes('feature') || lower.includes('sunroof') || lower.includes('touchscreen') ||
        lower.includes('automatic') || lower.includes('ventilated') || lower.includes('cruise')) {
        return 'features'
    }

    return 'general'
}

/**
 * Extract normalized pattern from query
 * Removes specific car names and numbers to get generalizable pattern
 */
function extractPatternKey(query: string): string {
    let pattern = query.toLowerCase()

    // Common car names to normalize
    const carPatterns = [
        'creta', 'seltos', 'nexon', 'brezza', 'venue', 'sonet', 'punch',
        'swift', 'baleno', 'i20', 'altroz', 'tiago', 'glanza',
        'city', 'verna', 'ciaz', 'amaze', 'dzire',
        'xuv700', 'xuv400', 'hector', 'harrier', 'safari', 'thar',
        'fortuner', 'innova', 'ertiga', 'carens', 'alcazar',
        'hyundai', 'tata', 'maruti', 'mahindra', 'kia', 'honda', 'toyota', 'mg'
    ]

    // Replace car names with placeholder
    for (const car of carPatterns) {
        pattern = pattern.replace(new RegExp(`\\b${car}\\b`, 'gi'), '{CAR}')
    }

    // Replace numbers and prices
    pattern = pattern.replace(/₹?\s*\d+\.?\d*\s*(lakh|lakhs|l|k|cr)?/gi, '{PRICE}')
    pattern = pattern.replace(/\b\d+\b/g, '{NUM}')

    // Remove extra whitespace
    pattern = pattern.replace(/\s+/g, ' ').trim()

    return pattern
}

/**
 * Extract keywords from query for matching
 */
function extractKeywords(query: string): string[] {
    const lower = query.toLowerCase()
    const keywords: string[] = []

    // Keyword categories
    const keywordMaps: Record<string, string[]> = {
        'family': ['family', 'kids', 'parents', 'space', 'comfort', 'safe'],
        'budget': ['budget', 'cheap', 'affordable', 'value', 'money', 'lakh'],
        'city': ['city', 'traffic', 'parking', 'small', 'compact', 'daily'],
        'highway': ['highway', 'road trip', 'travel', 'long drive', 'touring'],
        'safety': ['safe', 'safety', 'ncap', 'airbag', 'adas', 'crash'],
        'mileage': ['mileage', 'fuel', 'efficiency', 'petrol', 'diesel', 'cng'],
        'features': ['features', 'sunroof', 'touchscreen', 'automatic', 'camera'],
        'suv': ['suv', 'crossover', 'ground clearance', 'offroad'],
        'sedan': ['sedan', 'saloon', 'boot space'],
        'hatchback': ['hatchback', 'hatch', 'compact']
    }

    for (const [category, words] of Object.entries(keywordMaps)) {
        if (words.some(word => lower.includes(word))) {
            keywords.push(category)
        }
    }

    return keywords
}

// ============================================
// INTERACTION TRACKING
// ============================================

/**
 * Record an AI interaction
 * Called after every chat response
 */
export async function recordInteraction(
    sessionId: string,
    query: string,
    response: string,
    carsRecommended: Array<{ modelId: string; modelName: string; brandName: string }>,
    contextUsed: string,
    responseTimeMs: number
): Promise<string> {
    try {
        const interaction = await AIInteraction.create({
            sessionId,
            query,
            queryLower: query.toLowerCase(),
            queryType: classifyQuery(query),
            response,
            carsRecommended: carsRecommended.map(car => ({
                ...car,
                clicked: false
            })),
            contextUsed,
            responseTimeMs
        })

        console.log(`📝 Recorded interaction: ${interaction._id}`)
        return interaction._id.toString()

    } catch (error) {
        console.error('Failed to record interaction:', error)
        return ''
    }
}

// ============================================
// FEEDBACK COLLECTION
// ============================================

/**
 * Record user feedback (thumbs up/down)
 * Called from frontend when user clicks feedback buttons
 */
export async function recordFeedback(
    sessionId: string,
    queryText: string,
    feedback: 'thumbs_up' | 'thumbs_down',
    feedbackText?: string
): Promise<void> {
    try {
        // Find and update the interaction
        const interaction = await AIInteraction.findOneAndUpdate(
            { sessionId, queryLower: queryText.toLowerCase() },
            {
                $set: {
                    feedback,
                    feedbackText
                }
            },
            { new: true, sort: { createdAt: -1 } }
        )

        if (!interaction) {
            console.warn(`⚠️ Interaction not found for feedback: ${queryText.slice(0, 50)}...`)
            return
        }

        // Learn from feedback
        if (feedback === 'thumbs_up') {
            await learnFromSuccess(interaction)
        } else {
            await learnFromFailure(interaction)
        }

        console.log(`👍/👎 Feedback recorded: ${feedback} for "${queryText.slice(0, 30)}..."`)

    } catch (error) {
        console.error('Failed to record feedback:', error)
    }
}

/**
 * Record when user clicks on a recommended car
 */
export async function recordCarClick(
    sessionId: string,
    modelId: string
): Promise<void> {
    try {
        await AIInteraction.updateOne(
            { sessionId, 'carsRecommended.modelId': modelId },
            {
                $set: {
                    'carsRecommended.$.clicked': true
                }
            }
        )

        console.log(`🚗 Car click recorded: ${modelId}`)

    } catch (error) {
        console.error('Failed to record car click:', error)
    }
}

// ============================================
// LEARNING ENGINE
// ============================================

/**
 * Learn from successful interaction (positive feedback)
 */
async function learnFromSuccess(interaction: any): Promise<void> {
    try {
        const patternKey = extractPatternKey(interaction.query)
        const keywords = extractKeywords(interaction.query)

        await LearnedPattern.findOneAndUpdate(
            { patternKey },
            {
                $set: {
                    queryType: interaction.queryType,
                    successfulContext: interaction.contextUsed?.slice(0, 500),
                    lastUsed: new Date()
                },
                $addToSet: {
                    exampleQueries: { $each: [interaction.query.slice(0, 200)] },
                    keywords: { $each: keywords }
                },
                $inc: { successCount: 1 }
            },
            { upsert: true, new: true }
        ).then(async (pattern) => {
            // Update success rate
            const total = pattern.successCount + pattern.failCount
            const successRate = total > 0 ? pattern.successCount / total : 0.5
            await LearnedPattern.updateOne(
                { _id: pattern._id },
                { $set: { successRate } }
            )
        })

        console.log(`📚 Learned from success: "${patternKey.slice(0, 50)}..."`)

    } catch (error) {
        console.error('Failed to learn from success:', error)
    }
}

/**
 * Learn from failed interaction (negative feedback)
 */
async function learnFromFailure(interaction: any): Promise<void> {
    try {
        const patternKey = extractPatternKey(interaction.query)

        await LearnedPattern.findOneAndUpdate(
            { patternKey },
            {
                $set: { lastUsed: new Date() },
                $inc: { failCount: 1 }
            }
        ).then(async (pattern) => {
            if (pattern) {
                // Update success rate
                const total = pattern.successCount + pattern.failCount
                const successRate = total > 0 ? pattern.successCount / total : 0.5
                await LearnedPattern.updateOne(
                    { _id: pattern._id },
                    { $set: { successRate } }
                )
            }
        })

        console.log(`📉 Learned from failure: "${patternKey.slice(0, 50)}..."`)

    } catch (error) {
        console.error('Failed to learn from failure:', error)
    }
}

// ============================================
// CONTEXT ENHANCEMENT
// ============================================

/**
 * Get learned context for a query
 * Uses past successful responses to improve new ones
 */
export async function getLearnedContext(query: string): Promise<string> {
    try {
        const queryType = classifyQuery(query)
        const keywords = extractKeywords(query)
        const patternKey = extractPatternKey(query)

        // Find matching patterns with high success rate
        const patterns = await LearnedPattern.find({
            $or: [
                { patternKey },
                { queryType, keywords: { $in: keywords } }
            ],
            successRate: { $gte: 0.6 }
        })
            .sort({ successRate: -1 })
            .limit(3)
            .lean()

        if (patterns.length === 0) {
            return ''
        }

        // Build context from successful patterns
        let context = '\n\n**📚 Learned from past successful responses:**\n'

        for (const pattern of patterns) {
            if (pattern.successfulContext) {
                context += `- [${pattern.queryType}] ${pattern.successfulContext.slice(0, 150)}...\n`
            }
        }

        console.log(`🧠 Found ${patterns.length} learned patterns for "${query.slice(0, 30)}..."`)

        return context

    } catch (error) {
        console.error('Failed to get learned context:', error)
        return ''
    }
}

/**
 * Get similar successful queries for inspiration
 */
export async function getSimilarSuccessfulQueries(query: string, limit = 3): Promise<string[]> {
    try {
        const keywords = extractKeywords(query)
        const queryType = classifyQuery(query)

        const interactions = await AIInteraction.find({
            queryType,
            feedback: 'thumbs_up',
            $or: keywords.map(kw => ({ queryLower: { $regex: kw, $options: 'i' } }))
        })
            .select('query')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()

        return interactions.map(i => i.query)

    } catch (error) {
        console.error('Failed to get similar queries:', error)
        return []
    }
}

// ============================================
// ANALYTICS & METRICS
// ============================================

/**
 * Get comprehensive learning metrics
 */
export async function getLearningMetrics(): Promise<object> {
    try {
        const now = new Date()
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Total stats
        const totalInteractions = await AIInteraction.countDocuments()
        const totalWithFeedback = await AIInteraction.countDocuments({ feedback: { $ne: 'none' } })
        const totalThumbsUp = await AIInteraction.countDocuments({ feedback: 'thumbs_up' })
        const totalThumbsDown = await AIInteraction.countDocuments({ feedback: 'thumbs_down' })
        const totalCarClicks = await AIInteraction.countDocuments({ 'carsRecommended.clicked': true })

        // Last 24 hours
        const last24hInteractions = await AIInteraction.countDocuments({ createdAt: { $gte: oneDayAgo } })
        const last24hThumbsUp = await AIInteraction.countDocuments({ createdAt: { $gte: oneDayAgo }, feedback: 'thumbs_up' })

        // Last 7 days
        const last7dInteractions = await AIInteraction.countDocuments({ createdAt: { $gte: sevenDaysAgo } })

        // Learned patterns
        const totalPatterns = await LearnedPattern.countDocuments()
        const highSuccessPatterns = await LearnedPattern.countDocuments({ successRate: { $gte: 0.7 } })

        // Top patterns
        const topPatterns = await LearnedPattern.find()
            .sort({ successRate: -1, successCount: -1 })
            .limit(10)
            .select('patternKey queryType successRate successCount lastUsed')
            .lean()

        // Query type distribution
        const queryTypeStats = await AIInteraction.aggregate([
            { $group: { _id: '$queryType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        // Calculate satisfaction rate
        const satisfactionRate = totalWithFeedback > 0
            ? ((totalThumbsUp / totalWithFeedback) * 100).toFixed(1)
            : 'N/A'

        // Average response time
        const avgResponseTime = await AIInteraction.aggregate([
            { $match: { responseTimeMs: { $exists: true } } },
            { $group: { _id: null, avg: { $avg: '$responseTimeMs' } } }
        ])

        return {
            overview: {
                totalInteractions,
                last24hInteractions,
                last7dInteractions,
                satisfactionRate: `${satisfactionRate}%`,
                carClickRate: totalInteractions > 0 ? `${((totalCarClicks / totalInteractions) * 100).toFixed(1)}%` : 'N/A',
                avgResponseTimeMs: avgResponseTime[0]?.avg?.toFixed(0) || 'N/A'
            },
            feedback: {
                totalWithFeedback,
                thumbsUp: totalThumbsUp,
                thumbsDown: totalThumbsDown,
                last24hThumbsUp
            },
            learning: {
                totalPatterns,
                highSuccessPatterns,
                topPatterns: topPatterns.map(p => ({
                    pattern: p.patternKey.slice(0, 50),
                    type: p.queryType,
                    successRate: `${(p.successRate * 100).toFixed(0)}%`,
                    uses: p.successCount
                }))
            },
            queryTypes: queryTypeStats.map(q => ({
                type: q._id,
                count: q.count
            })),
            lastUpdated: now.toISOString()
        }

    } catch (error) {
        console.error('Failed to get learning metrics:', error)
        return { error: 'Failed to get metrics' }
    }
}

/**
 * Get recent interactions for debugging
 */
export async function getRecentInteractions(limit = 20): Promise<any[]> {
    try {
        return await AIInteraction.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('query queryType feedback responseTimeMs createdAt carsRecommended')
            .lean()

    } catch (error) {
        console.error('Failed to get recent interactions:', error)
        return []
    }
}
