/**
 * Vector Store - Semantic Search for Car Consultant
 * 
 * Uses Hugging Face FREE API for embeddings and in-memory HNSW index for fast similarity search.
 * No paid services or separate vector database required!
 * 
 * Features:
 * - Generate embeddings using sentence-transformers (free)
 * - In-memory vector index with cosine similarity
 * - Hybrid search: Vector + Keyword matching
 * - Auto-caching for performance
 */

// NOTE: Mongoose models are imported dynamically to prevent startup crashes
// when MongoDB isn't connected yet
import fs from 'fs';
import path from 'path';

// Cache file path
const CACHE_FILE_PATH = path.join(process.cwd(), 'vector-store-cache.json');

// ============================================
// CONFIGURATION
// ============================================

const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction'
const EMBEDDING_DIMENSIONS = 384 // MiniLM-L6-v2 output dimensions

// In-memory vector store (for free tier - no MongoDB Atlas vector search)
interface VectorEntry {
    id: string
    name: string
    brandName: string
    type: 'model' | 'variant' // Added to distinguish
    embedding: number[]
    data: any // Full car data
}

let vectorStore: VectorEntry[] = []
let isInitialized = false
let lastInitTime = 0
const CACHE_TTL = 3600000 // 1 hour
let isInitializing = false
let initPromise: Promise<void> | null = null

// ============================================
// EMBEDDING GENERATION
// ============================================

/**
 * Generate embedding using Hugging Face Inference API (FREE)
 * Rate limit: 30,000 requests/month on free tier
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const HF_API_KEY = process.env.HF_API_KEY

    if (!HF_API_KEY) {
        console.warn('⚠️ HF_API_KEY not set, using fallback keyword matching')
        return generateFallbackEmbedding(text)
    }

    try {
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: [text.slice(0, 512)], // Limit input size
                options: { wait_for_model: true }
            })
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('HF API error:', error)
            return generateFallbackEmbedding(text)
        }

        const embedding = await response.json()

        // Handle nested array response
        if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
            return embedding[0]
        }

        if (Array.isArray(embedding) && embedding.length === EMBEDDING_DIMENSIONS) {
            return embedding
        }

        console.warn('Unexpected embedding format:', typeof embedding)
        return generateFallbackEmbedding(text)

    } catch (error) {
        console.error('Embedding generation failed:', error)
        return generateFallbackEmbedding(text)
    }
}

/**
 * Fallback: Generate simple TF-IDF-like embedding from text
 * Used when HF API is unavailable
 */
function generateFallbackEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/)
    const embedding = new Array(EMBEDDING_DIMENSIONS).fill(0)

    // Simple hash-based embedding
    words.forEach((word, i) => {
        const hash = simpleHash(word)
        const index = Math.abs(hash) % EMBEDDING_DIMENSIONS
        embedding[index] += 1 / (i + 1) // Position-weighted
    })

    // Normalize
    const norm = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)) || 1
    return embedding.map(v => v / norm)
}

function simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return hash
}

// ============================================
// VECTOR INDEX BUILDING
// ============================================

/**
 * Build rich text representation for a car model
 * This text will be embedded for semantic search
 */
function buildCarTextForEmbedding(model: any, brandName: string): string {
    const parts = [
        brandName,
        model.name,
        model.bodyType,
        model.summary,
        model.pros,
        model.cons,
        model.description,
        model.fuelTypes?.join(' '),
        model.engineSummaries?.map((e: any) => `${e.title} ${e.summary}`).join(' '),
        model.mileageData?.map((m: any) => `${m.engineName} ${m.companyClaimed}`).join(' '),
        model.faqs?.slice(0, 5).map((f: any) => `${f.question} ${f.answer}`).join(' ')
    ].filter(Boolean)

    return parts.join(' ').slice(0, 512)
}

/**
 * Build rich text representation for a car variant
 */
function buildVariantTextForEmbedding(variant: any, brandName: string, modelName: string): string {
    const parts = [
        brandName,
        modelName,
        variant.name,
        `Price: ${(variant.price / 100000).toFixed(2)} Lakhs`,
        variant.transmission,
        variant.fuelType,
        variant.keyFeatures,
        variant.headerSummary,
        variant.engineSummary,
        variant.mileageCompanyClaimed ? `Mileage ${variant.mileageCompanyClaimed}` : '',
        variant.airbags ? `${variant.airbags} Airbags` : '',
        variant.sunroof ? 'Sunroof' : '',
        variant.ventilatedSeats ? 'Ventilated Seats' : '',
        variant.adasLevel ? `ADAS Level ${variant.adasLevel}` : '',
        variant.cruiseControl ? 'Cruise Control' : '',
        variant.touchScreenInfotainment ? 'Touchscreen' : '',
        variant.androidAppleCarplay ? 'Android Auto Apple CarPlay' : '',
        variant.wirelessCharging ? 'Wireless Charging' : '',
        variant.isofix ? 'ISOFIX' : ''
    ].filter(Boolean)

    return parts.join(' ').slice(0, 512)
}

/**
 * Initialize vector store with all active car models
 * Generates embeddings for each car and stores in memory
 */
export async function initializeVectorStore(): Promise<void> {
    // Check if already initialized and cache is valid
    if (isInitialized && Date.now() - lastInitTime < CACHE_TTL) {
        return
    }

    // If already initializing, wait for the existing promise
    if (isInitializing && initPromise) {
        return initPromise
    }

    // Start initialization
    isInitializing = true
    initPromise = (async () => {
        try {
            console.log('🔄 Initializing vector store...')
            const startTime = Date.now()

            // 1. Try to load from file cache first
            try {
                if (fs.existsSync(CACHE_FILE_PATH)) {
                    const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
                    const cachedData = JSON.parse(raw);

                    if (Array.isArray(cachedData) && cachedData.length > 0) {
                        console.log(`📂 Loaded ${cachedData.length} vectors from cache (${CACHE_FILE_PATH})`);
                        vectorStore = cachedData;
                        isInitialized = true;
                        lastInitTime = Date.now();
                        return;
                    }
                }
            } catch (err) {
                console.warn('⚠️ Failed to load vector cache:', err);
            }

            try {
                // Dynamic import
                const { Model, Brand, Variant } = await import('../db/schemas')

                const models = await Model.find({ status: 'active' })
                    .select('id name brandId bodyType summary pros cons description fuelTypes transmissions engineSummaries mileageData faqs minPrice maxPrice heroImage isNew isPopular')
                    .lean()

                const brands = await Brand.find({}).select('id name').lean()
                const brandMap = new Map(brands.map(b => [b.id, b.name]))

                console.log(`📊 Processing ${models.length} car models...`)
                const batchSize = 5
                const newVectorStore: VectorEntry[] = []

                for (let i = 0; i < models.length; i += batchSize) {
                    const batch = models.slice(i, i + batchSize)
                    const embeddings = await Promise.all(
                        batch.map(async (model) => {
                            const brandName = brandMap.get(model.brandId) || ''
                            const text = buildCarTextForEmbedding(model, brandName)
                            const embedding = await generateEmbedding(text)

                            // Production formatting
                            const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                            const modelSlug = (model as any).slug || model.name.toLowerCase().replace(/\s+/g, '-')

                            return {
                                id: model.id || model._id?.toString(),
                                name: model.name,
                                brandName,
                                type: 'model' as const,
                                embedding,
                                data: {
                                    ...model,
                                    brandName,
                                    brandSlug,
                                    modelSlug,
                                    slug: `${brandSlug}-cars/${modelSlug}` // For easy frontend use
                                }
                            }
                        })
                    )
                    newVectorStore.push(...embeddings)
                    if (i + batchSize < models.length) await new Promise(r => setTimeout(r, 100))
                }

                const variants = await Variant.find({ status: 'active' })
                    .select('id name brandId modelId price keyFeatures headerSummary engineSummary mileageCompanyClaimed transmission fuelType airbags sunroof ventilatedSeats adasLevel cruiseControl touchScreenInfotainment androidAppleCarplay wirelessCharging isofix')
                    .lean()

                console.log(`📊 Processing ${variants.length} car variants...`)
                const modelMap = new Map(models.map(m => [m.id || m._id.toString(), { name: m.name, heroImage: m.heroImage }]))

                for (let i = 0; i < variants.length; i += batchSize) {
                    const batch = variants.slice(i, i + batchSize)
                    const embeddings = await Promise.all(
                        batch.map(async (variant) => {
                            const brandName = brandMap.get(variant.brandId) || ''
                            const modelData = modelMap.get(variant.modelId) || { name: '', heroImage: '' }
                            const modelName = modelData.name
                            const heroImage = modelData.heroImage
                            if (!variant.price) return null
                            const text = buildVariantTextForEmbedding(variant, brandName, modelName)
                            const embedding = await generateEmbedding(text)

                            // Production formatting
                            const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                            const modelSlug = (variant as any).modelSlug || modelName.toLowerCase().replace(/\s+/g, '-')
                            const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

                            return {
                                id: variant.id || variant._id?.toString(),
                                name: variant.name,
                                brandName,
                                type: 'variant' as const,
                                embedding,
                                data: {
                                    ...variant,
                                    brandName,
                                    modelName,
                                    heroImage,
                                    brandSlug,
                                    modelSlug,
                                    variantSlug,
                                    price: variant.price,
                                    slug: `${brandSlug}-cars/${modelSlug}/variant/${variantSlug}`
                                }
                            }
                        })
                    )
                    const validEmbeddings = embeddings.filter(e => e !== null) as VectorEntry[]
                    newVectorStore.push(...validEmbeddings)
                    if (i + batchSize < variants.length) await new Promise(r => setTimeout(r, 100))
                }

                vectorStore = newVectorStore
                isInitialized = true
                lastInitTime = Date.now()
                console.log(`✅ Vector store initialized: ${vectorStore.length} cars in ${Date.now() - startTime}ms`)

                try { fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(vectorStore, null, 2)); } catch (err) { }

            } catch (error) {
                console.error('❌ Failed to initialize vector store:', error)
            }
        } finally {
            isInitializing = false
            initPromise = null
        }
    })()

    return initPromise
}

// ============================================
// SIMILARITY SEARCH
// ============================================

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    let dotProduct = 0, normA = 0, normB = 0
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * Semantic search using vector similarity
 * Finds cars matching user intent, not just keywords
 */
export async function semanticCarSearch(
    query: string,
    filters?: {
        budget?: number
        bodyType?: string
        fuelType?: string
        minScore?: number
    },
    limit = 5
): Promise<any[]> {
    if (!isInitialized) {
        await initializeVectorStore()
    }

    const lowerQuery = query.toLowerCase()
    const isEVQuery = lowerQuery.includes('ev') || lowerQuery.includes('electric') || lowerQuery.includes('battery') || lowerQuery.includes('charging')

    const queryEmbedding = await generateEmbedding(query)
    const scored = vectorStore.map(entry => {
        let score = cosineSimilarity(queryEmbedding, entry.embedding)
        const isEVModel = entry.name.toLowerCase().includes('ev') || entry.data.fuelTypes?.some((f: string) => f.toLowerCase() === 'electric')

        if (!isEVQuery && isEVModel) score = score * 0.7
        else if (isEVQuery && isEVModel) score = score * 1.1
        else if (!isEVQuery && !isEVModel) score = score * 1.05

        return { ...entry, score, isEV: isEVModel }
    })

    const minScore = filters?.minScore || 0.3
    let filtered = scored.filter(entry => entry.score >= minScore)

    if (filters?.budget) {
        filtered = filtered.filter(entry => {
            if (entry.type === 'variant') return entry.data.price <= filters.budget!
            return entry.data.minPrice && entry.data.minPrice <= filters.budget!
        })
    }

    if (filters?.bodyType) {
        const bodyTypeLower = filters.bodyType.toLowerCase()
        filtered = filtered.filter(entry => entry.data.bodyType?.toLowerCase().includes(bodyTypeLower))
    }

    if (filters?.fuelType) {
        const fuelTypeLower = filters.fuelType.toLowerCase()
        filtered = filtered.filter(entry => entry.data.fuelTypes?.some((f: string) => f.toLowerCase().includes(fuelTypeLower)))
    }

    filtered.sort((a, b) => b.score - a.score)
    const results = filtered.slice(0, limit).map(entry => ({
        ...entry.data,
        searchScore: entry.score,
        matchType: 'semantic',
        type: entry.type,
        isEV: entry.isEV
    }))

    console.log(`🔍 Semantic search: "${query.slice(0, 50)}..." → ${results.length} results`)
    return results
}

// ============================================
// EXACT NAME SEARCH (Priority Matching)
// ============================================

import { findBestCarMatches, CAR_ALIASES } from './fuzzy-match'

const KNOWN_CAR_NAMES = [
    'swift', 'creta', 'nexon', 'seltos', 'venue', 'brezza', 'baleno', 'i20', 'i10', 'sonet', 'carens', 'innova', 'fortuner', 'city', 'elevate', 'amaze', 'thar', 'scorpio', 'xuv700', 'xuv400', 'xuv300', 'bolero', 'harrier', 'safari', 'punch', 'tiago', 'tigor', 'altroz', 'curvv', 'fronx', 'jimny', 'invicto', 'hycross', 'grand vitara', 'ertiga', 'xl6', 'dzire', 's-presso', 'wagonr', 'alto', 'eeco', 'verna', 'exter', 'aura', 'alcazar', 'tata', 'maruti', 'hyundai', 'kia', 'mahindra', 'honda', 'toyota', 'mg', 'skoda', 'volkswagen'
]

function extractCarNamesFromQuery(query: string): string[] {
    const lowerQuery = query.toLowerCase()
    const extracted: string[] = []
    for (const carName of KNOWN_CAR_NAMES) { if (lowerQuery.includes(carName)) extracted.push(carName) }
    for (const [alias, resolved] of Object.entries(CAR_ALIASES)) { if (lowerQuery.includes(alias) && !extracted.includes(resolved)) extracted.push(resolved) }
    if (extracted.length === 0) {
        const fuzzyMatches = findBestCarMatches(query, KNOWN_CAR_NAMES, 2)
        for (const match of fuzzyMatches) { if (match.similarity >= 0.7) extracted.push(match.car) }
    }
    return [...new Set(extracted)]
}

export async function exactNameSearch(query: string, limit = 5): Promise<any[]> {
    const { Model, Brand } = await import('../db/schemas')
    const carNames = extractCarNamesFromQuery(query)
    if (carNames.length === 0) return []

    const namePatterns = carNames.map(name => ({ name: { $regex: new RegExp(`^${name}$|^${name}\\s|\\s${name}$|\\s${name}\\s`, 'i') } }))
    const results = await Model.find({ status: 'active', $or: [...namePatterns] }).select('id name brandId bodyType summary pros cons minPrice maxPrice fuelTypes transmissions heroImage isNew isPopular').limit(limit).lean()
    const brands = await Brand.find({}).select('id name').lean()
    const brandMap = new Map(brands.map(b => [b.id, b.name]))

    const scored = results.map(car => {
        const carNameLower = car.name.toLowerCase()
        let score = 0.85
        for (const searchName of carNames) {
            if (carNameLower === searchName) { score = 1.0; break }
            else if (carNameLower.startsWith(searchName) || carNameLower.endsWith(searchName)) score = 0.95
            else if (carNameLower.includes(searchName)) score = Math.max(score, 0.9)
        }
        const isEV = carNameLower.includes('ev') || car.fuelTypes?.some((f: string) => f.toLowerCase() === 'electric')
        const brandName = brandMap.get(car.brandId) || ''
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const modelSlug = (car as any).slug || car.name.toLowerCase().replace(/\s+/g, '-')
        const slug = `${brandSlug}-cars/${modelSlug}`

        return { ...car, brandName, brandSlug, modelSlug, slug, searchScore: score, matchType: 'exact', type: 'model', isEV }
    })
    scored.sort((a, b) => b.searchScore - a.searchScore)
    return scored.slice(0, limit)
}

// ============================================
// HYBRID SEARCH (Vector + Keyword)
// ============================================

export async function hybridCarSearch(query: string, filters?: any, limit = 5): Promise<any[]> {
    const lowerQuery = query.toLowerCase()
    const isEVQuery = lowerQuery.includes('ev') || lowerQuery.includes('electric') || lowerQuery.includes('battery') || lowerQuery.includes('charging')
    const exactResults = await exactNameSearch(query, limit)
    const vectorResults = await semanticCarSearch(query, filters, limit)

    const { Model, Brand } = await import('../db/schemas')
    const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 2)
    const baseQuery: any = { status: 'active', $or: keywords.flatMap(kw => [{ name: { $regex: kw, $options: 'i' } }, { summary: { $regex: kw, $options: 'i' } }, { pros: { $regex: kw, $options: 'i' } }]) }
    if (!isEVQuery) {
        baseQuery.name = { $not: { $regex: '\\bEV\\b', $options: 'i' } }
        baseQuery.fuelTypes = { $not: { $elemMatch: { $regex: '^electric$', $options: 'i' } } }
    }

    const keywordResults = await Model.find(baseQuery).select('id name brandId bodyType summary pros cons minPrice maxPrice fuelTypes transmissions heroImage isNew isPopular').limit(5).lean()
    const brands = await Brand.find({}).select('id name').lean()
    const brandMap = new Map(brands.map(b => [b.id, b.name]))
    const enrichedKeyword = keywordResults.map(car => {
        const isEVModel = car.name.toLowerCase().includes('ev') || car.fuelTypes?.some((f: string) => f.toLowerCase() === 'electric')
        return { ...car, brandName: brandMap.get(car.brandId) || '', matchType: 'keyword', searchScore: isEVModel && !isEVQuery ? 0.3 : 0.5, type: 'model', isEV: isEVModel }
    })

    const seen = new Set<string>()
    const merged: any[] = []
    for (const car of exactResults) { const id = car.id || car._id?.toString(); if (id && !seen.has(id)) { seen.add(id); merged.push(car) } }
    for (const car of vectorResults) { const id = car.id || car._id?.toString(); if (id && !seen.has(id) && (!car.isEV || isEVQuery)) { seen.add(id); merged.push(car) } }
    if (merged.length < limit) { for (const car of vectorResults) { const id = car.id || car._id?.toString(); if (id && !seen.has(id)) { seen.add(id); merged.push(car) } } }
    for (const car of enrichedKeyword.filter(c => !c.isEV || isEVQuery)) { const id = car.id || car._id?.toString(); if (id && !seen.has(id) && merged.length < limit + 2) { seen.add(id); merged.push(car) } }

    merged.sort((a, b) => {
        const matchPriority: Record<string, number> = { exact: 3, semantic: 2, keyword: 1 }
        const aPriority = matchPriority[a.matchType] || 0, bPriority = matchPriority[b.matchType] || 0
        if (aPriority !== bPriority) return bPriority - aPriority
        if (!isEVQuery) { if (a.isEV && !b.isEV) return 1; if (!a.isEV && b.isEV) return -1 }
        return (b.searchScore || 0) - (a.searchScore || 0)
    })
    return merged.slice(0, limit)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getVectorStoreStats() {
    return {
        initialized: isInitialized,
        totalVectors: vectorStore.length,
        lastInitTime: lastInitTime ? new Date(lastInitTime).toISOString() : null,
        cacheAge: lastInitTime ? Math.round((Date.now() - lastInitTime) / 1000) : null
    }
}

export async function refreshVectorStore(): Promise<void> {
    isInitialized = false; lastInitTime = 0; vectorStore = []
    if (fs.existsSync(CACHE_FILE_PATH)) fs.unlinkSync(CACHE_FILE_PATH)
    await initializeVectorStore()
}

export async function addCarToVectorStore(model: any, brandName: string): Promise<void> {
    const text = buildCarTextForEmbedding(model, brandName)
    const embedding = await generateEmbedding(text)
    vectorStore.push({ id: model.id || model._id?.toString(), name: model.name, brandName, type: 'model' as const, embedding, data: { ...model, brandName } })
}
