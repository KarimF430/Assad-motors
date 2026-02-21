/**
 * User Activity Schema
 * 
 * Tracks user behavior for personalized recommendations:
 * - Page views (model, variant, price breakup)
 * - Time spent on pages
 * - Comparisons made
 * - Cars saved/favorited
 * - Brochure downloads
 * 
 * Uses MongoDB TTL for automatic cleanup (90 days retention)
 */

import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
    // User identification (one of these should be present)
    userId: { type: String, default: null },      // Logged-in user ID
    sessionId: { type: String, required: true },  // Anonymous session tracking

    // What was viewed
    modelId: { type: String, default: null },
    variantId: { type: String, default: null },
    brandId: { type: String, default: null },

    // Activity type
    activityType: {
        type: String,
        required: true,
        enum: [
            'view_model',
            'view_variant',
            'view_price_breakup',
            'compare',
            'save',
            'unsave',
            'download_brochure',
            'emi_calculate',
            'share',
            'search'
        ]
    },

    // Additional context
    duration: { type: Number, default: 0 },       // Time spent in seconds
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Inferred preferences (extracted from activity)
    inferredPreferences: {
        bodyType: { type: String, default: null },
        priceRange: {
            min: { type: Number, default: null },
            max: { type: Number, default: null }
        },
        fuelType: { type: String, default: null },
        brandId: { type: String, default: null }
    },

    // Timestamps with TTL
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7776000  // 90 days TTL (auto-delete)
    }
});

// Indexes for efficient queries
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ sessionId: 1, createdAt: -1 });
userActivitySchema.index({ modelId: 1, activityType: 1 });
userActivitySchema.index({ variantId: 1, activityType: 1 });
userActivitySchema.index({ activityType: 1, createdAt: -1 });
userActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Log a user activity event
 */
export async function logActivity(params: {
    userId?: string;
    sessionId: string;
    activityType: string;
    modelId?: string;
    variantId?: string;
    brandId?: string;
    duration?: number;
    metadata?: Record<string, any>;
    inferredPreferences?: {
        bodyType?: string;
        priceRange?: { min?: number; max?: number };
        fuelType?: string;
        brandId?: string;
    };
}): Promise<void> {
    try {
        await UserActivity.create(params);
        console.log(`[Activity] Logged: ${params.activityType} for ${params.userId || params.sessionId}`);
    } catch (error) {
        console.error('[Activity] Error logging activity:', error);
    }
}

/**
 * Get recent activities for a user/session
 */
export async function getRecentActivities(
    identifiers: { userId?: string; sessionId?: string },
    limit: number = 20
) {
    const query = identifiers.userId
        ? { userId: identifiers.userId }
        : { sessionId: identifiers.sessionId };

    return UserActivity.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
}

/**
 * Get inferred preferences from recent activity
 */
export async function getInferredPreferences(
    identifiers: { userId?: string; sessionId?: string }
) {
    const activities = await getRecentActivities(identifiers, 50);

    // Aggregate preferences from activities
    const bodyTypes: Record<string, number> = {};
    const fuelTypes: Record<string, number> = {};
    const brands: Record<string, number> = {};
    const prices: number[] = [];

    for (const activity of activities as any[]) {
        const prefs = activity.inferredPreferences;
        if (!prefs) continue;

        if (prefs.bodyType) {
            bodyTypes[prefs.bodyType] = (bodyTypes[prefs.bodyType] || 0) + 1;
        }
        if (prefs.fuelType) {
            fuelTypes[prefs.fuelType] = (fuelTypes[prefs.fuelType] || 0) + 1;
        }
        if (prefs.brandId) {
            brands[prefs.brandId] = (brands[prefs.brandId] || 0) + 1;
        }
        if (prefs.priceRange?.min) prices.push(prefs.priceRange.min);
        if (prefs.priceRange?.max) prices.push(prefs.priceRange.max);
    }

    // Get top preferences
    const topBodyType = Object.entries(bodyTypes)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
    const topFuelType = Object.entries(fuelTypes)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
    const topBrand = Object.entries(brands)
        .sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
        preferredBodyType: topBodyType || null,
        preferredFuelType: topFuelType || null,
        preferredBrandId: topBrand || null,
        budgetRange: prices.length > 0 ? {
            min: Math.min(...prices),
            max: Math.max(...prices)
        } : null
    };
}

/**
 * Get collaborative filtering data
 * "Users who viewed X also viewed Y"
 */
export async function getCollaborativeData(
    modelId: string,
    limit: number = 10
): Promise<string[]> {
    // Find other models viewed by users who viewed this model
    const viewersOfModel = await UserActivity.distinct('sessionId', {
        modelId,
        activityType: 'view_model'
    });

    if (viewersOfModel.length === 0) return [];

    // Find what else these users viewed
    const otherViews = await UserActivity.aggregate([
        {
            $match: {
                sessionId: { $in: viewersOfModel },
                modelId: { $nin: [modelId, null] },
                activityType: 'view_model'
            }
        },
        {
            $group: {
                _id: '$modelId',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: limit
        }
    ]);

    return otherViews.map(v => v._id);
}

export default {
    UserActivity,
    logActivity,
    getRecentActivities,
    getInferredPreferences,
    getCollaborativeData
};
