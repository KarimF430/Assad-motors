/**
 * Learning System - Self-Improving AI
 * 
 * This system learns from user interactions to improve accuracy over time.
 * 
 * Features:
 * - Pattern recognition
 * - Interaction tracking
 * - Feedback learning
 * - Continuous improvement
 * - A/B testing
 */

import { queryOllama } from './ollama-client'

// ============================================
// TYPE DEFINITIONS
// ============================================

interface Interaction {
    sessionId: string
    userMessage: string
    extracted: any
    aiResponse: string
    userAction: 'clicked_car' | 'skipped' | 'asked_more' | 'completed'
    carClicked?: string
    feedback?: 'positive' | 'negative' | 'neutral'
    timestamp: Date
    responseTime: number
}

interface Pattern {
    phrase: string
    keywords: string[]
    extracted: any
    confidence: number
    occurrences: number
    successRate: number
    lastUsed: Date
}

interface Metrics {
    totalInteractions: number
    extractionAccuracy: number
    conversationCompletionRate: number
    avgResponseTime: number
    carClickRate: number
    userSatisfaction: number
}

// ============================================
// LEARNING SYSTEM CLASS
// ============================================

class LearningSystem {
    private patterns: Map<string, Pattern> = new Map()
    private interactions: Interaction[] = []
    private metrics: Metrics = {
        totalInteractions: 0,
        extractionAccuracy: 0,
        conversationCompletionRate: 0,
        avgResponseTime: 0,
        carClickRate: 0,
        userSatisfaction: 0
    }

    // ============================================
    // INTERACTION TRACKING
    // ============================================

    /**
     * Log an interaction for learning
     */
    logInteraction(interaction: Interaction) {
        this.interactions.push(interaction)
        this.metrics.totalInteractions++

        // Update metrics
        this.updateMetrics()

        // Learn from this interaction
        if (interaction.feedback === 'positive') {
            this.learnFromSuccess(interaction)
        } else if (interaction.feedback === 'negative') {
            this.learnFromFailure(interaction)
        }

        // Prune old interactions (keep last 10000)
        if (this.interactions.length > 10000) {
            this.interactions = this.interactions.slice(-10000)
        }
    }

    /**
     * Learn from successful interaction
     */
    private learnFromSuccess(interaction: Interaction) {
        const keywords = this.extractKeywords(interaction.userMessage)
        const patternKey = keywords.join('_')

        const existing = this.patterns.get(patternKey)

        if (existing) {
            // Reinforce existing pattern
            existing.occurrences++
            existing.successRate = (existing.successRate * (existing.occurrences - 1) + 1) / existing.occurrences
            existing.confidence = Math.min(0.95, existing.confidence + 0.05)
            existing.lastUsed = new Date()
        } else {
            // Create new pattern
            this.patterns.set(patternKey, {
                phrase: interaction.userMessage,
                keywords,
                extracted: interaction.extracted,
                confidence: 0.6,
                occurrences: 1,
                successRate: 1.0,
                lastUsed: new Date()
            })
        }
    }

    /**
     * Learn from failed interaction
     */
    private learnFromFailure(interaction: Interaction) {
        const keywords = this.extractKeywords(interaction.userMessage)
        const patternKey = keywords.join('_')

        const existing = this.patterns.get(patternKey)

        if (existing) {
            // Reduce confidence
            existing.successRate = (existing.successRate * (existing.occurrences - 1)) / existing.occurrences
            existing.confidence = Math.max(0.1, existing.confidence - 0.1)
        }
    }

    // ============================================
    // PATTERN RECOGNITION
    // ============================================

    /**
     * Extract keywords from user message
     */
    private extractKeywords(message: string): string[] {
        const lowerMessage = message.toLowerCase()
        const keywords: string[] = []

        // Common car-related keywords
        const keywordMap = {
            seating: ['family', 'people', 'seater', '5', '7', 'kids'],
            budget: ['budget', 'lakh', 'lakhs', 'cheap', 'affordable', 'expensive'],
            usage: ['city', 'highway', 'both', 'daily', 'commute', 'travel'],
            fuelType: ['petrol', 'diesel', 'cng', 'electric', 'ev', 'hybrid'],
            bodyType: ['suv', 'sedan', 'hatchback', 'muv', 'coupe'],
            features: ['sunroof', 'automatic', 'manual', 'safety', 'airbags', 'abs']
        }

        for (const [category, words] of Object.entries(keywordMap)) {
            for (const word of words) {
                if (lowerMessage.includes(word)) {
                    keywords.push(category)
                    break
                }
            }
        }

        return keywords
    }

    /**
     * Find matching patterns for a message
     */
    findMatchingPatterns(message: string): Pattern[] {
        const keywords = this.extractKeywords(message)

        const matches: Array<{ pattern: Pattern, score: number }> = []

        for (const pattern of this.patterns.values()) {
            // Calculate similarity score
            const overlap = keywords.filter(k => pattern.keywords.includes(k)).length
            const score = overlap / Math.max(keywords.length, pattern.keywords.length)

            if (score > 0.3) {
                matches.push({ pattern, score: score * pattern.confidence })
            }
        }

        // Sort by score
        matches.sort((a, b) => b.score - a.score)

        return matches.slice(0, 3).map(m => m.pattern)
    }

    /**
     * Enhance extraction using learned patterns
     */
    async enhanceExtraction(userMessage: string, baseExtraction: any): Promise<any> {
        const matches = this.findMatchingPatterns(userMessage)

        if (matches.length === 0) {
            return baseExtraction
        }

        // Use the best matching pattern
        const bestMatch = matches[0]

        // Merge with base extraction (base takes priority)
        const enhanced = {
            ...bestMatch.extracted,
            ...baseExtraction // User's current input overrides learned patterns
        }

        console.log(`📚 Enhanced extraction using pattern (confidence: ${bestMatch.confidence.toFixed(2)})`)

        return enhanced
    }

    // ============================================
    // METRICS & ANALYTICS
    // ============================================

    /**
     * Update system metrics
     */
    private updateMetrics() {
        if (this.interactions.length === 0) return

        const recent = this.interactions.slice(-100) // Last 100 interactions

        // Conversation completion rate
        const completed = recent.filter(i => i.userAction === 'completed').length
        this.metrics.conversationCompletionRate = completed / recent.length

        // Car click rate
        const clicked = recent.filter(i => i.userAction === 'clicked_car').length
        this.metrics.carClickRate = clicked / recent.length

        // Average response time
        const totalTime = recent.reduce((sum, i) => sum + i.responseTime, 0)
        this.metrics.avgResponseTime = totalTime / recent.length

        // User satisfaction (based on feedback)
        const withFeedback = recent.filter(i => i.feedback)
        if (withFeedback.length > 0) {
            const positive = withFeedback.filter(i => i.feedback === 'positive').length
            this.metrics.userSatisfaction = positive / withFeedback.length
        }

        // Extraction accuracy (based on successful completions)
        this.metrics.extractionAccuracy = this.calculateAccuracy(recent)
    }

    /**
     * Calculate extraction accuracy
     */
    private calculateAccuracy(interactions: Interaction[]): number {
        const successful = interactions.filter(i =>
            i.userAction === 'completed' || i.userAction === 'clicked_car'
        ).length

        return successful / interactions.length
    }

    /**
     * Get current metrics
     */
    getMetrics(): Metrics {
        return { ...this.metrics }
    }

    /**
     * Get top performing patterns
     */
    getTopPatterns(limit: number = 10): Pattern[] {
        return Array.from(this.patterns.values())
            .sort((a, b) => b.successRate * b.occurrences - a.successRate * a.occurrences)
            .slice(0, limit)
    }

    // ============================================
    // A/B TESTING
    // ============================================

    /**
     * Test different prompts and track performance
     */
    async abTest(message: string, promptA: string, promptB: string): Promise<any> {
        const useA = Math.random() > 0.5

        const prompt = useA ? promptA : promptB
        const result = await queryOllama(prompt.replace('{message}', message))

        // Log which variant was used
        console.log(`🧪 A/B Test: Using variant ${useA ? 'A' : 'B'}`)

        return {
            result,
            variant: useA ? 'A' : 'B'
        }
    }

    // ============================================
    // EXPORT/IMPORT FOR PERSISTENCE
    // ============================================

    /**
     * Export learned patterns for persistence
     */
    exportPatterns(): string {
        const data = {
            patterns: Array.from(this.patterns.entries()),
            metrics: this.metrics,
            timestamp: new Date()
        }
        return JSON.stringify(data)
    }

    /**
     * Import learned patterns
     */
    importPatterns(data: string) {
        try {
            const parsed = JSON.parse(data)
            this.patterns = new Map(parsed.patterns)
            this.metrics = parsed.metrics
            console.log(`✅ Imported ${this.patterns.size} patterns`)
        } catch (error) {
            console.error('Failed to import patterns:', error)
        }
    }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const learningSystem = new LearningSystem()

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Track user feedback
 */
export function trackFeedback(
    sessionId: string,
    userMessage: string,
    extracted: any,
    feedback: 'positive' | 'negative'
) {
    learningSystem.logInteraction({
        sessionId,
        userMessage,
        extracted,
        aiResponse: '',
        userAction: 'completed',
        feedback,
        timestamp: new Date(),
        responseTime: 0
    })
}

/**
 * Get system performance report
 */
export function getPerformanceReport() {
    const metrics = learningSystem.getMetrics()
    const topPatterns = learningSystem.getTopPatterns(5)

    return {
        metrics,
        topPatterns,
        recommendations: generateRecommendations(metrics)
    }
}

/**
 * Generate improvement recommendations
 */
function generateRecommendations(metrics: Metrics): string[] {
    const recommendations: string[] = []

    if (metrics.extractionAccuracy < 0.7) {
        recommendations.push('⚠️ Low extraction accuracy - consider fine-tuning the model')
    }

    if (metrics.conversationCompletionRate < 0.5) {
        recommendations.push('⚠️ Low completion rate - simplify the conversation flow')
    }

    if (metrics.avgResponseTime > 5000) {
        recommendations.push('⚠️ Slow responses - optimize model or use caching')
    }

    if (metrics.carClickRate < 0.3) {
        recommendations.push('⚠️ Low click rate - improve car matching algorithm')
    }

    if (recommendations.length === 0) {
        recommendations.push('✅ System performing well!')
    }

    return recommendations
}
