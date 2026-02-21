/**
 * Redis Search Index Service
 * Elasticsearch-like in-memory search index with zero database hits
 * 
 * Architecture:
 * - On startup: Load all models + brands from MongoDB once
 * - Store in Redis sorted sets for O(1) prefix matching
 * - All search queries hit Redis only (0 DB hits)
 * - Auto-refresh every 30 minutes or on data changes
 */

import { getRedisClient } from '../middleware/redis-cache';
import type Redis from 'ioredis';
import { CAR_ALIASES } from '../ai-engine/fuzzy-match';

// Search index configuration
const SEARCH_INDEX_PREFIX = 'search:idx:';
const SEARCH_DATA_PREFIX = 'search:data:';
const SEARCH_INDEX_META = 'search:meta';
const INDEX_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Cached search data in memory for even faster access
let inMemoryCache: Map<string, SearchResult> = new Map();
let inMemoryCacheArray: SearchResult[] = []; // Pre-cached array for faster search
let lastIndexBuild = 0;
let isBuilding = false;

/**
 * Helper function to scan keys using SCAN (non-blocking, safe for production)
 */
async function scanKeys(redis: Redis, pattern: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';

    do {
        const [newCursor, foundKeys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = newCursor;
        keys.push(...foundKeys);
    } while (cursor !== '0');

    return keys;
}

export interface SearchResult {
    id: string;
    name: string;
    brandName: string;
    brandSlug: string;
    modelSlug: string;
    slug: string;
    heroImage: string;
}

interface IndexMeta {
    lastBuild: number;
    modelCount: number;
    brandCount: number;
    version: string;
}

/**
 * Build the search index from MongoDB
 * Called on startup and periodically for refresh
 */
export async function buildSearchIndex(): Promise<void> {
    if (isBuilding) {
        console.log('⏳ Search index build already in progress, skipping...');
        return;
    }

    isBuilding = true;
    const startTime = Date.now();

    try {
        const redis = getRedisClient();

        // Import mongoose dynamically to avoid circular dependencies
        const mongoose = (await import('mongoose')).default;
        const db = mongoose.connection.db;

        if (!db) {
            console.warn('⚠️ Database not connected, skipping search index build');
            return;
        }

        console.log('🔨 Building search index...');

        // Fetch only models that have variants >= 1,00,000
        const [models, brands] = await Promise.all([
            db.collection('models').aggregate([
                { $match: { status: 'active' } },
                {
                    $lookup: {
                        from: 'variants',
                        localField: 'id',
                        foreignField: 'modelId',
                        pipeline: [
                            { $match: { status: 'active', price: { $gte: 100000 } } },
                            { $limit: 1 }
                        ],
                        as: 'qualifyingVariants'
                    }
                },
                { $match: { 'qualifyingVariants.0': { $exists: true } } },
                { $project: { _id: 0, id: 1, name: 1, brandId: 1, heroImage: 1 } }
            ]).toArray(),
            db.collection('brands').find(
                { status: 'active' },
                { projection: { _id: 0, id: 1, name: 1 } }
            ).toArray()
        ]);

        // Create brand lookup map
        const brandMap = new Map<string, string>();
        brands.forEach((brand: any) => {
            brandMap.set(brand.id, brand.name);
        });

        // Clear in-memory cache
        inMemoryCache.clear();

        // Build search index entries
        const searchEntries: SearchResult[] = models.map((model: any) => {
            const brandName = brandMap.get(model.brandId) || 'Unknown';
            const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
            const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-');

            return {
                id: model.id,
                name: model.name,
                brandName,
                brandSlug,
                modelSlug,
                slug: `${brandSlug}-${modelSlug}`,
                heroImage: model.heroImage || ''
            };
        });

        // Store in both Redis and in-memory cache
        if (redis) {
            await storeInRedis(redis, searchEntries, brands.length);
        }

        // Always store in memory for fastest access
        searchEntries.forEach(entry => {
            inMemoryCache.set(entry.id, entry);
        });
        inMemoryCacheArray = searchEntries; // Update the pre-cached array

        lastIndexBuild = Date.now();
        const buildTime = Date.now() - startTime;

        console.log(`✅ Search index built: ${searchEntries.length} models, ${brands.length} brands in ${buildTime}ms`);

        // Schedule periodic refresh
        scheduleIndexRefresh();

    } catch (error) {
        console.error('❌ Failed to build search index:', error);
    } finally {
        isBuilding = false;
    }
}

/**
 * Store search entries in Redis for persistence
 */
async function storeInRedis(redis: Redis, entries: SearchResult[], brandCount: number): Promise<void> {
    const pipeline = redis.pipeline();

    // Clear old index keys using SCAN (safe for production)
    const oldKeys = await scanKeys(redis, `${SEARCH_INDEX_PREFIX}*`);
    if (oldKeys.length > 0) {
        // Delete in batches to avoid command too long
        for (let i = 0; i < oldKeys.length; i += 100) {
            const batch = oldKeys.slice(i, i + 100);
            await redis.del(...batch);
        }
    }

    // Clear old data keys using SCAN
    const oldDataKeys = await scanKeys(redis, `${SEARCH_DATA_PREFIX}*`);
    if (oldDataKeys.length > 0) {
        for (let i = 0; i < oldDataKeys.length; i += 100) {
            const batch = oldDataKeys.slice(i, i + 100);
            await redis.del(...batch);
        }
    }

    // Store each entry as JSON and create index keys
    entries.forEach(entry => {
        // Store full data
        pipeline.set(`${SEARCH_DATA_PREFIX}${entry.id}`, JSON.stringify(entry), 'EX', 3600);

        // Create searchable index keys for various terms
        const searchTerms = generateSearchTerms(entry);
        searchTerms.forEach(term => {
            // Use sorted set with score = 0 for alphabetical ordering
            pipeline.zadd(`${SEARCH_INDEX_PREFIX}${term}`, 0, entry.id);
            pipeline.expire(`${SEARCH_INDEX_PREFIX}${term}`, 3600); // 1 hour TTL
        });
    });

    // Store metadata
    const meta: IndexMeta = {
        lastBuild: Date.now(),
        modelCount: entries.length,
        brandCount: brandCount,
        version: 'v1.1' // Incremented version
    };
    pipeline.set(SEARCH_INDEX_META, JSON.stringify(meta), 'EX', 3600);

    await pipeline.exec();
}

/**
 * Generate search terms for a model entry
 * Creates terms for: model name, brand name, combined name
 */
function generateSearchTerms(entry: SearchResult): string[] {
    const terms: Set<string> = new Set();

    const addTermPrefixes = (text: string) => {
        const normalized = text.toLowerCase().trim();
        // Add full term
        terms.add(normalized);
        // Add each word
        normalized.split(/\s+/).forEach(word => {
            terms.add(word);
            // Add prefixes for autocomplete (min 2 chars)
            for (let i = 2; i <= word.length; i++) {
                terms.add(word.substring(0, i));
            }
        });
    };

    addTermPrefixes(entry.name);
    addTermPrefixes(entry.brandName);
    addTermPrefixes(`${entry.brandName} ${entry.name}`);

    // Add fuzzy aliases if they exist
    const lowerName = entry.name.toLowerCase();
    for (const [alias, resolved] of Object.entries(CAR_ALIASES)) {
        if (resolved === lowerName) {
            terms.add(alias);
            // Add prefixes for aliases too
            for (let i = 2; i <= alias.length; i++) {
                terms.add(alias.substring(0, i));
            }
        }
    }

    return Array.from(terms);
}

/**
 * Search from the in-memory/Redis index (0 DB hits)
 */
export async function searchFromIndex(query: string, limit: number = 20): Promise<{
    results: SearchResult[];
    source: 'memory' | 'redis' | 'mongodb';
    indexAge: number;
} | null> {
    const startTime = Date.now();
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery || normalizedQuery.length < 2) {
        return { results: [], source: 'memory', indexAge: Date.now() - lastIndexBuild };
    }

    // Try in-memory cache first (fastest)
    if (inMemoryCache.size > 0) {
        const results = searchInMemory(normalizedQuery, limit);
        console.log(`⚡ Search from memory: "${query}" -> ${results.length} results in ${Date.now() - startTime}ms`);
        return {
            results,
            source: 'memory',
            indexAge: Date.now() - lastIndexBuild
        };
    }

    // Try Redis if memory cache is empty
    const redis = getRedisClient();
    if (redis) {
        try {
            const results = await searchInRedis(redis, normalizedQuery, limit);
            if (results.length > 0) {
                console.log(`⚡ Search from Redis: "${query}" -> ${results.length} results in ${Date.now() - startTime}ms`);
                return {
                    results,
                    source: 'redis',
                    indexAge: Date.now() - lastIndexBuild
                };
            }
        } catch (error) {
            console.warn('⚠️ Redis search failed, falling back:', error);
        }
    }

    // No index available
    return null;
}

/**
 * Search in-memory cache
 */
function searchInMemory(query: string, limit: number): SearchResult[] {
    const results: SearchResult[] = [];
    const queryTerms = query.split(/\s+/).filter(t => t.length >= 2);

    for (let i = 0; i < inMemoryCacheArray.length && results.length < limit; i++) {
        const entry = inMemoryCacheArray[i];
        // Check if all query terms match
        const searchableText = `${entry.brandName} ${entry.name}`.toLowerCase();
        const matches = queryTerms.every(term => searchableText.includes(term));

        if (matches) {
            results.push(entry);
        }
    }

    // Sort by relevance (exact matches first, then by name)
    return results.sort((a, b) => {
        const aExact = a.name.toLowerCase().startsWith(query) || a.brandName.toLowerCase().startsWith(query);
        const bExact = b.name.toLowerCase().startsWith(query) || b.brandName.toLowerCase().startsWith(query);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.name.localeCompare(b.name);
    });
}

/**
 * Search in Redis using sorted sets
 */
async function searchInRedis(redis: Redis, query: string, limit: number): Promise<SearchResult[]> {
    // Get matching IDs from index
    const indexKey = `${SEARCH_INDEX_PREFIX}${query}`;
    const ids = await redis.zrange(indexKey, 0, limit - 1);

    if (ids.length === 0) {
        // Try prefix matching using SCAN instead of KEYS
        const keys = await scanKeys(redis, `${SEARCH_INDEX_PREFIX}${query}*`);
        if (keys.length > 0) {
            // Union multiple keys
            const allIds = await Promise.all(
                keys.slice(0, 5).map(key => redis.zrange(key, 0, 10))
            );
            const uniqueIds = Array.from(new Set(allIds.flat())).slice(0, limit);
            return fetchResultsFromRedis(redis, uniqueIds);
        }
        return [];
    }

    return fetchResultsFromRedis(redis, ids);
}

/**
 * Fetch full result data from Redis
 */
async function fetchResultsFromRedis(redis: Redis, ids: string[]): Promise<SearchResult[]> {
    if (ids.length === 0) return [];

    const dataKeys = ids.map(id => `${SEARCH_DATA_PREFIX}${id}`);
    const results = await redis.mget(...dataKeys);

    return results
        .filter((data): data is string => data !== null)
        .map(data => JSON.parse(data) as SearchResult);
}

/**
 * Schedule periodic index refresh
 */
let refreshTimer: NodeJS.Timeout | null = null;

function scheduleIndexRefresh(): void {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
    }

    refreshTimer = setTimeout(async () => {
        console.log('🔄 Scheduled search index refresh...');
        await buildSearchIndex();
    }, INDEX_REFRESH_INTERVAL);
}

/**
 * Invalidate the search index (call after model/brand changes)
 */
export async function invalidateSearchIndex(): Promise<void> {
    console.log('🗑️ Invalidating search index...');
    inMemoryCache.clear();
    lastIndexBuild = 0;

    const redis = getRedisClient();
    if (redis) {
        try {
            const keys = await scanKeys(redis, `${SEARCH_INDEX_PREFIX}*`);
            const dataKeys = await scanKeys(redis, `${SEARCH_DATA_PREFIX}*`);

            // Delete in batches
            for (let i = 0; i < keys.length; i += 100) {
                await redis.del(...keys.slice(i, i + 100));
            }
            for (let i = 0; i < dataKeys.length; i += 100) {
                await redis.del(...dataKeys.slice(i, i + 100));
            }
            await redis.del(SEARCH_INDEX_META);
        } catch (error) {
            console.error('Failed to invalidate Redis search index:', error);
        }
    }

    // Rebuild immediately
    await buildSearchIndex();
}

/**
 * Get search index statistics
 */
export function getSearchIndexStats(): {
    inMemoryCount: number;
    lastBuild: number;
    isBuilding: boolean;
    ageMinutes: number;
} {
    return {
        inMemoryCount: inMemoryCache.size,
        lastBuild: lastIndexBuild,
        isBuilding: isBuilding,
        ageMinutes: Math.round((Date.now() - lastIndexBuild) / 60000)
    };
}

// Export for use in routes
export { inMemoryCache, inMemoryCacheArray, lastIndexBuild };
