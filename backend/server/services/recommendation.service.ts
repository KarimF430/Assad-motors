/**
 * Netflix/Instagram-Style Recommendation Service
 * 
 * OPTIMIZED VERSION with:
 * - Redis caching (5-min TTL)
 * - Batch queries (single DB call for prices)
 * - Pre-aggregated model data
 * 
 * Performance: ~50 DB calls → 2-3 DB calls per request
 */

import { Model, Variant, Brand } from '../db/schemas';
import { getCacheRedisClient } from '../config/redis-config';

// Top-level redis removed to avoid race condition
const CACHE_TTL = 300; // 5 minutes

// ============================================================================
// TYPES
// ============================================================================

export interface SimilarityWeights {
    bodyType: number;
    priceRange: number;
    fuelType: number;
    brand: number;
    features: number;
    userBehavior: number;
}

export interface RecommendationContext {
    type: 'model' | 'variant';
    sourceId: string;
    sourcePrice?: number;
    sourceBodyType?: string;
    sourceFuelType?: string;
    sourceBrandId?: string;
    userId?: string;
    sessionId?: string;
}

export interface ScoredItem {
    id: string;
    name: string;
    brandName?: string;
    price: number;
    bodyType?: string;
    fuelType?: string;
    heroImage?: string;
    similarityScore: number;
    matchReasons: string[];
}

// ============================================================================
// WEIGHT CONFIGURATIONS
// ============================================================================

const DEFAULT_WEIGHTS: SimilarityWeights = {
    bodyType: 0.20,
    priceRange: 0.30,
    fuelType: 0.15,
    brand: 0.10,
    features: 0.15,
    userBehavior: 0.10
};

const VARIANT_WEIGHTS: SimilarityWeights = {
    bodyType: 0.15,
    priceRange: 0.40,
    fuelType: 0.15,
    brand: 0.10,
    features: 0.10,
    userBehavior: 0.10
};

// ============================================================================
// CACHED DATA LOADERS (Single DB call each, cached)
// ============================================================================

/**
 * Get all models with their starting prices - SINGLE CACHED QUERY
 */
async function getModelsWithPrices(): Promise<Map<string, any>> {
    const cacheKey = 'recommendation:models_with_prices';

    // Try cache first
    const redis = getCacheRedisClient();
    if (redis) {
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                console.log('✅ Recommendation cache HIT: models_with_prices');
                return new Map(data);
            }
        } catch (e) {
            console.error('Cache read error:', e);
        }
    }

    console.log('📥 Recommendation cache MISS: fetching models with prices');

    // Batch query: Get all models and their lowest variant prices in 2 queries
    const [models, brands, variantPrices] = await Promise.all([
        Model.find({ status: 'active' }).lean(),
        Brand.find({ status: 'active' }).lean(),
        // Aggregate to get min price per model - SINGLE QUERY
        Variant.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$modelId',
                    minPrice: { $min: '$price' },
                    fuelTypes: { $addToSet: '$fuelType' }
                }
            }
        ])
    ]);

    const brandMap = new Map(brands.map((b: any) => [b.id, b.name]));
    const priceMap = new Map(variantPrices.map((v: any) => [v._id, {
        minPrice: v.minPrice,
        fuelTypes: v.fuelTypes
    }]));

    // Build enriched model map
    const modelMap = new Map<string, any>();
    for (const model of models as any[]) {
        const priceData = priceMap.get(model.id);
        if (!priceData || priceData.minPrice === 0) continue; // Skip models without variants

        modelMap.set(model.id, {
            ...model,
            startingPrice: priceData.minPrice,
            variantFuelTypes: priceData.fuelTypes,
            brandName: brandMap.get(model.brandId) || ''
        });
    }

    // Cache the result
    if (redis) {
        try {
            await redis.setex(cacheKey, CACHE_TTL, JSON.stringify([...modelMap]));
            console.log(`💾 Cached ${modelMap.size} models with prices (TTL: ${CACHE_TTL}s)`);
        } catch (e) {
            console.error('Cache write error:', e);
        }
    }

    return modelMap;
}

/**
 * Get all variants with model data - SINGLE CACHED QUERY
 */
async function getVariantsWithModels(): Promise<Map<string, any>> {
    const cacheKey = 'recommendation:variants_with_models';

    // Try cache first
    const redis = getCacheRedisClient();
    if (redis) {
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                console.log('✅ Recommendation cache HIT: variants_with_models');
                return new Map(data);
            }
        } catch (e) {
            console.error('Cache read error:', e);
        }
    }

    console.log('📥 Recommendation cache MISS: fetching variants with models');

    // Batch query: Get all data in parallel
    const [variants, models, brands] = await Promise.all([
        Variant.find({ status: 'active' }).lean(),
        Model.find({ status: 'active' }).lean(),
        Brand.find({ status: 'active' }).lean()
    ]);

    const brandMap = new Map(brands.map((b: any) => [b.id, b.name]));
    const modelMap = new Map((models as any[]).map(m => [m.id, m]));

    // Build enriched variant map
    const variantMap = new Map<string, any>();
    for (const variant of variants as any[]) {
        const model = modelMap.get(variant.modelId);
        if (!model) continue;

        variantMap.set(variant.id, {
            ...variant,
            modelName: model.name,
            bodyType: model.bodyType,
            brandName: brandMap.get(variant.brandId) || '',
            heroImage: model.heroImage
        });
    }

    // Cache the result
    if (redis) {
        try {
            await redis.setex(cacheKey, CACHE_TTL, JSON.stringify([...variantMap]));
            console.log(`💾 Cached ${variantMap.size} variants with models (TTL: ${CACHE_TTL}s)`);
        } catch (e) {
            console.error('Cache write error:', e);
        }
    }

    return variantMap;
}

// ============================================================================
// SIMILARITY SCORING FUNCTIONS (Pure, no DB calls)
// ============================================================================

function scoreBodyType(source: string | undefined, target: string | undefined): number {
    if (!source || !target) return 0;
    if (source.toLowerCase() === target.toLowerCase()) return 1.0;

    const similarGroups: Record<string, string[]> = {
        suv: ['suv', 'crossover', 'muv'],
        sedan: ['sedan', 'saloon'],
        hatchback: ['hatchback', 'premium hatchback'],
        mpv: ['mpv', 'muv', 'van']
    };

    const sourceLower = source.toLowerCase();
    const targetLower = target.toLowerCase();

    for (const group of Object.values(similarGroups)) {
        if (group.includes(sourceLower) && group.includes(targetLower)) {
            return 0.7;
        }
    }
    return 0;
}

function scorePriceRange(sourcePrice: number, targetPrice: number, tolerancePercent: number = 20): number {
    if (!sourcePrice || !targetPrice) return 0;

    const priceDiff = Math.abs(sourcePrice - targetPrice);
    const tolerance = sourcePrice * (tolerancePercent / 100);

    if (priceDiff === 0) return 1.0;
    if (priceDiff <= tolerance * 0.5) return 0.9;
    if (priceDiff <= tolerance) return 0.7;
    if (priceDiff <= tolerance * 1.5) return 0.4;
    if (priceDiff <= tolerance * 2) return 0.2;
    return 0;
}

function scoreFuelType(sourceFuels: string | string[] | undefined, targetFuels: string | string[] | undefined): number {
    if (!sourceFuels || !targetFuels) return 0;

    const sourceArray = Array.isArray(sourceFuels) ? sourceFuels : [sourceFuels];
    const targetArray = Array.isArray(targetFuels) ? targetFuels : [targetFuels];

    const sourceLower = sourceArray.map(f => f.toLowerCase());
    const targetLower = targetArray.map(f => f.toLowerCase());

    if (sourceLower.some(f => targetLower.includes(f))) return 1.0;

    const fuelGroups: Record<string, string[]> = {
        petrol: ['petrol', 'cng', 'petrol + cng'],
        diesel: ['diesel'],
        electric: ['electric', 'ev'],
        hybrid: ['hybrid', 'mild hybrid', 'strong hybrid', 'phev']
    };

    for (const group of Object.values(fuelGroups)) {
        const sourceInGroup = sourceLower.some(f => group.includes(f));
        const targetInGroup = targetLower.some(f => group.includes(f));
        if (sourceInGroup && targetInGroup) return 0.6;
    }
    return 0;
}

function scoreBrand(sourceBrandId: string | undefined, targetBrandId: string | undefined): number {
    if (!sourceBrandId || !targetBrandId) return 0;
    return sourceBrandId === targetBrandId ? 1.0 : 0;
}

// ============================================================================
// MAIN RECOMMENDATION FUNCTIONS (Optimized - 2-3 DB calls max)
// ============================================================================

/**
 * Get similar models - OPTIMIZED with caching
 */
export async function getSimilarModels(
    context: RecommendationContext,
    limit: number = 6,
    excludeIds: string[] = []
): Promise<ScoredItem[]> {
    try {
        // Single cached call - returns all models with prices
        const modelMap = await getModelsWithPrices();

        const sourceModel = modelMap.get(context.sourceId);
        if (!sourceModel) return [];

        const sourcePrice = sourceModel.startingPrice;
        const weights = DEFAULT_WEIGHTS;

        // Score each model (in-memory, no DB calls)
        const scoredModels: ScoredItem[] = [];

        for (const [modelId, model] of modelMap) {
            if (modelId === context.sourceId || excludeIds.includes(modelId)) continue;

            const bodyTypeScore = scoreBodyType(sourceModel.bodyType, model.bodyType);
            const priceScore = scorePriceRange(sourcePrice, model.startingPrice, 20);
            const fuelScore = scoreFuelType(sourceModel.fuelTypes, model.fuelTypes);
            const brandScore = scoreBrand(sourceModel.brandId, model.brandId);

            const totalScore =
                (bodyTypeScore * weights.bodyType) +
                (priceScore * weights.priceRange) +
                (fuelScore * weights.fuelType) +
                (brandScore * weights.brand) +
                (0.5 * weights.features); // Neutral feature score

            const matchReasons: string[] = [];
            if (bodyTypeScore >= 0.7) matchReasons.push('Same body type');
            if (priceScore >= 0.7) matchReasons.push('Similar price range');
            if (fuelScore >= 0.6) matchReasons.push('Same fuel type');
            if (brandScore === 1) matchReasons.push('Same brand');

            scoredModels.push({
                id: model.id,
                name: model.name,
                brandName: model.brandName,
                price: model.startingPrice,
                bodyType: model.bodyType,
                fuelType: model.fuelTypes?.[0],
                heroImage: model.heroImage,
                similarityScore: Math.round(totalScore * 100),
                matchReasons
            });
        }

        return scoredModels
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);

    } catch (error) {
        console.error('[Recommendation] Error getting similar models:', error);
        return [];
    }
}

/**
 * Get similar variants - OPTIMIZED with caching
 */
export async function getSimilarVariants(
    context: RecommendationContext,
    limit: number = 6,
    excludeIds: string[] = []
): Promise<ScoredItem[]> {
    try {
        // Single cached call - returns all variants with model data
        const variantMap = await getVariantsWithModels();

        const sourceVariant = variantMap.get(context.sourceId);
        if (!sourceVariant) return [];

        const sourcePrice = sourceVariant.price;
        const weights = VARIANT_WEIGHTS;

        // Score each variant (in-memory, no DB calls)
        const scoredVariants: ScoredItem[] = [];

        for (const [variantId, variant] of variantMap) {
            // Skip same model variants and excluded
            if (variant.modelId === sourceVariant.modelId || excludeIds.includes(variantId)) continue;

            const bodyTypeScore = scoreBodyType(sourceVariant.bodyType, variant.bodyType);
            const priceScore = scorePriceRange(sourcePrice, variant.price, 15);
            const fuelScore = scoreFuelType(sourceVariant.fuelType, variant.fuelType);
            const brandScore = scoreBrand(sourceVariant.brandId, variant.brandId);

            const totalScore =
                (bodyTypeScore * weights.bodyType) +
                (priceScore * weights.priceRange) +
                (fuelScore * weights.fuelType) +
                (brandScore * weights.brand) +
                (0.5 * weights.features);

            const matchReasons: string[] = [];
            if (priceScore >= 0.7) matchReasons.push(`₹${Math.round(variant.price / 100000)}L`);
            if (bodyTypeScore >= 0.7) matchReasons.push(variant.bodyType);
            if (fuelScore >= 0.6) matchReasons.push(variant.fuelType);

            scoredVariants.push({
                id: variant.id,
                name: `${variant.modelName} ${variant.name}`,
                brandName: variant.brandName,
                price: variant.price,
                bodyType: variant.bodyType,
                fuelType: variant.fuelType,
                heroImage: variant.heroImage,
                similarityScore: Math.round(totalScore * 100),
                matchReasons
            });
        }

        return scoredVariants
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit);

    } catch (error) {
        console.error('[Recommendation] Error getting similar variants:', error);
        return [];
    }
}

/**
 * Get personalized recommendations - OPTIMIZED with caching
 */
export async function getPersonalizedRecommendations(
    userId?: string,
    sessionId?: string,
    limit: number = 5
): Promise<ScoredItem[]> {
    try {
        // Use cached models with prices
        const modelMap = await getModelsWithPrices();

        // Filter popular models (in-memory)
        const popularModels: ScoredItem[] = [];

        for (const [, model] of modelMap) {
            if (!model.isPopular) continue;

            popularModels.push({
                id: model.id,
                name: model.name,
                brandName: model.brandName,
                price: model.startingPrice,
                bodyType: model.bodyType,
                fuelType: model.fuelTypes?.[0],
                heroImage: model.heroImage,
                similarityScore: 0,
                matchReasons: ['Popular']
            });

            if (popularModels.length >= limit) break;
        }

        return popularModels;

    } catch (error) {
        console.error('[Recommendation] Error getting personalized recommendations:', error);
        return [];
    }
}

/**
 * Invalidate recommendation cache (call when models/variants are updated)
 */
export async function invalidateRecommendationCache(): Promise<void> {
    const redis = getCacheRedisClient();
    if (!redis) return;

    try {
        await Promise.all([
            redis.del('recommendation:models_with_prices'),
            redis.del('recommendation:variants_with_models')
        ]);
        console.log('🗑️ Recommendation cache invalidated');
    } catch (error) {
        console.error('Cache invalidation error:', error);
    }
}

export default {
    getSimilarModels,
    getSimilarVariants,
    getPersonalizedRecommendations,
    invalidateRecommendationCache
};
