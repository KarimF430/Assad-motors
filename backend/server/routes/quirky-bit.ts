import { Router, Request, Response } from 'express'
import Groq from 'groq-sdk'
import { Brand, Model, Variant } from '../db/schemas'
import axios from 'axios'
import * as cheerio from 'cheerio'

const router = Router()

// Initialize Groq client only if API key is available (prevents test failures)
const groqApiKey = process.env.GROQ_API_KEY || process.env.HF_API_KEY || ''
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null


// Cache for quirky bits (1 hour TTL)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 3600000 // 1 hour

// Hour-based themes for variety (rotates every hour)
const QUIRKY_THEMES = [
    { theme: 'SAFETY', angle: 'safety rating, crash protection, family security' },
    { theme: 'MILEAGE', angle: 'fuel efficiency, petrol savings, long drives' },
    { theme: 'TECH', angle: 'features, infotainment, connected tech, ADAS' },
    { theme: 'VALUE', angle: 'price vs competition, resale value, EMI' },
    { theme: 'INDIAN_LIFE', angle: 'Diwali trips, traffic jams, potholes, monsoon' },
    { theme: 'STYLE', angle: 'looks, road presence, Instagram-worthy, alloys' },
    { theme: 'FAMILY', angle: 'boot space, rear seat comfort, AC cooling' },
    { theme: 'COMPARISON', angle: 'vs competitors, why this over rivals' },
    { theme: 'OWNERSHIP', angle: 'service cost, spare parts, insurance' },
    { theme: 'POWER', angle: 'acceleration, turbo, driving pleasure' },
    { theme: 'BRAND', angle: 'brand reputation, heritage, trust' },
    { theme: 'TRENDING', angle: 'latest updates, new launch, waiting period' },
]

// Get current hour's theme (rotates every hour)
function getCurrentTheme(): string {
    const hour = new Date().getHours()
    const theme = QUIRKY_THEMES[hour % QUIRKY_THEMES.length]
    return `Focus on: ${theme.theme} - ${theme.angle}`
}

// Helper to fetch real-time news with relevance filtering
async function fetchRealTimeNews(query: string) {
    try {
        // Search for specific car news in India
        const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' car india news')}&hl=en-IN&gl=IN&ceid=IN:en`
        const { data } = await axios.get(searchUrl, { timeout: 3000 })
        const $ = cheerio.load(data, { xmlMode: true })

        // Extract key words from query for relevance check
        const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)

        const newsItems: string[] = []
        $('item').each((_, elem) => {
            if (newsItems.length >= 2) return false // Stop after 2 relevant items

            const title = $(elem).find('title').text()
            const titleLower = title.toLowerCase()
            const pubDate = $(elem).find('pubDate').text()

            // Check if news is relevant (contains at least one query keyword)
            const isRelevant = queryWords.some(word => titleLower.includes(word))

            if (isRelevant) {
                // Remove source name from title (usually at the end after ' - ')
                const cleanTitle = title.split(' - ').slice(0, -1).join(' - ') || title
                newsItems.push(`- ${cleanTitle} (${new Date(pubDate).toLocaleDateString()})`)
            }
        })

        if (newsItems.length === 0) {
            console.log(`⚠️ No relevant news found for: ${query}`)
        } else {
            console.log(`✅ Found ${newsItems.length} relevant news for: ${query}`)
        }

        return newsItems.join('\n')
    } catch (error) {
        console.error('⚠️ News fetch failed:', error instanceof Error ? error.message : error)
        return ''
    }
}

/**
 * GET /api/quirky-bit/:type/:id
 * Generate contextual quirky bits for Brand/Model/Variant pages
 */
router.get('/:type/:id', async (req: Request, res: Response) => {
    const { type, id } = req.params

    // Validate type
    if (!['brand', 'model', 'variant', 'price', 'comparison'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Must be brand, model, variant, price, or comparison' })
    }

    // Check cache - includes hour to ensure fresh content every hour
    const currentHour = new Date().getHours()
    const cacheKey = `${type}-${id}-hour${currentHour}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`✅ Cache hit for ${cacheKey}`)
        return res.json(cached.data)
    }

    try {
        let context = ''
        let entityName = ''
        let dataSummary = ''

        // Fetch entity data based on type
        if (type === 'brand') {
            let brand;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                brand = await Brand.findById(id)
            } else {
                const searchName = id.replace(/^brand-/, '').replace(/-/g, ' ')
                brand = await Brand.findOne({
                    name: { $regex: new RegExp(searchName, 'i') }
                })
            }

            if (!brand) {
                console.warn(`⚠️ Brand not found for ID: ${id}, using fallback`)
                context = `Brand: ${id.replace(/^brand-/, '').replace(/-/g, ' ')}`
                entityName = id.replace(/^brand-/, '').replace(/-/g, ' ')
            } else {
                context = `Brand: ${brand.name}`
                entityName = brand.name
                dataSummary = `
                Name: ${brand.name}
                Market Ranking: ${brand.ranking || 'N/A'}
                Summary: ${brand.summary || 'N/A'}
                `
            }
        } else if (type === 'model') {
            let model;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                model = await Model.findById(id)
            }

            // Fallback search if not found by ID
            if (!model) {
                const searchName = id.replace(/-/g, ' ')
                model = await Model.findOne({ name: { $regex: new RegExp(searchName, 'i') } })
            }

            if (!model) {
                console.warn(`⚠️ Model not found for ID: ${id}, using fallback`)
                context = `${id.replace(/-/g, ' ')}`
                entityName = id.replace(/-/g, ' ')
            } else {
                // Fetch Brand for context
                const brand = await Brand.findOne({ id: model.brandId })
                const brandName = brand ? brand.name : 'Unknown Brand'

                context = `${brandName} ${model.name}`
                entityName = model.name

                // Construct rich data summary
                const mileage = model.mileageData?.[0]
                const engine = model.engineSummaries?.[0]

                dataSummary = `
                Car: ${brandName} ${model.name}
                Body Type: ${model.bodyType || 'N/A'}
                Launch Date: ${model.launchDate || 'N/A'}
                Pros: ${model.pros || 'N/A'}
                Cons: ${model.cons || 'N/A'}
                Mileage: ${mileage ? `Claimed: ${mileage.companyClaimed}, City: ${mileage.cityRealWorld}` : 'N/A'}
                Engine: ${engine ? `${engine.power} Power, ${engine.torque} Torque` : 'N/A'}
                Seating: ${model.seating}
                Fuel Types: ${model.fuelTypes?.join(', ') || 'N/A'}
                `
            }
        } else if (type === 'variant') {
            let variant;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                variant = await Variant.findById(id)
            }

            if (!variant) {
                // Fallback search
                const searchName = id.replace(/-/g, ' ')
                variant = await Variant.findOne({ name: { $regex: new RegExp(searchName, 'i') } })
            }

            if (!variant) {
                console.warn(`⚠️ Variant not found for ID: ${id}, using fallback`)
                context = `${id.replace(/-/g, ' ')}`
                entityName = id.replace(/-/g, ' ')
            } else {
                // Fetch Model and Brand
                const model = await Model.findOne({ id: variant.modelId })
                const brand = await Brand.findOne({ id: variant.brandId })

                const brandName = brand ? brand.name : ''
                const modelName = model ? model.name : ''

                context = `${brandName} ${modelName} ${variant.name}`
                entityName = variant.name

                dataSummary = `
                Variant: ${brandName} ${modelName} ${variant.name}
                Price: ₹${variant.price ? (variant.price / 100000).toFixed(2) + ' Lakh' : 'N/A'}
                Key Features: ${variant.keyFeatures || 'N/A'}
                Value for Money: ${variant.isValueForMoney ? 'Yes' : 'No'}
                Engine: ${variant.engineName || 'N/A'} - ${variant.power || 'N/A'} Power
                Mileage: ${variant.mileageCompanyClaimed || variant.mileageCityRealWorld || 'N/A'}
                `
            }
        } else if (type === 'price') {
            // ID can be Variant ID or Model ID/Slug
            let variant;
            let model;

            // Try to find Variant first
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                variant = await Variant.findById(id)
            }

            if (!variant) {
                const searchName = id.replace(/-/g, ' ')
                variant = await Variant.findOne({ name: { $regex: new RegExp(searchName, 'i') } })
            }

            if (variant) {
                // It's a Variant
                const model = await Model.findOne({ id: variant.modelId })
                const brand = await Brand.findOne({ id: variant.brandId })

                context = `On-Road Price of ${brand?.name} ${model?.name} ${variant.name}`
                entityName = variant.name

                const exShowroom = variant.price || 0
                const rto = Math.round(exShowroom * 0.15)
                const insurance = Math.round(exShowroom * 0.04)
                const onRoad = exShowroom + rto + insurance

                dataSummary = `
                Variant: ${variant.name}
                Ex-Showroom Price: ₹${(exShowroom / 100000).toFixed(2)} Lakh
                Estimated RTO: ₹${(rto / 100000).toFixed(2)} Lakh
                Estimated Insurance: ₹${(insurance / 100000).toFixed(2)} Lakh
                Approx On-Road: ₹${(onRoad / 100000).toFixed(2)} Lakh
                `
            } else {
                // Try to find Model
                if (id.match(/^[0-9a-fA-F]{24}$/)) {
                    model = await Model.findById(id)
                }
                if (!model) {
                    const searchName = id.replace(/-/g, ' ')
                    model = await Model.findOne({ name: { $regex: new RegExp(searchName, 'i') } })
                }

                if (model) {
                    // It's a Model
                    const brand = await Brand.findOne({ id: model.brandId })
                    context = `Price range of ${brand?.name} ${model.name}`
                    entityName = model.name

                    // Fetch lowest and highest price variants
                    const variants = await Variant.find({ modelId: model.id }).sort({ price: 1 })
                    const minPrice = variants[0]?.price || 0
                    const maxPrice = variants[variants.length - 1]?.price || 0

                    dataSummary = `
                    Model: ${brand?.name} ${model.name}
                    Price Range: ₹${(minPrice / 100000).toFixed(2)} Lakh - ₹${(maxPrice / 100000).toFixed(2)} Lakh
                    Variants: ${variants.length} variants available
                    Top Model: ${variants[variants.length - 1]?.name || 'N/A'}
                    Base Model: ${variants[0]?.name || 'N/A'}
                    `
                } else {
                    console.warn(`⚠️ Entity not found for Price ID: ${id}, using fallback`)
                    context = `Price of ${id.replace(/-/g, ' ')}`
                    entityName = id.replace(/-/g, ' ')
                }
            }
        } else if (type === 'comparison') {
            if (id === 'general') {
                context = 'Car Comparison'
                entityName = 'Comparison Tool'
                dataSummary = 'Compare any two cars to find the best one for you. I can analyze specs, price, and value.'
            } else {
                // ID is "id1,id2" (Variant IDs or Model IDs)
                const [id1, id2] = id.split(',')

                // Try to fetch as models first
                let item1 = await Model.findById(id1) || await Model.findOne({ id: id1 })
                let item2 = await Model.findById(id2) || await Model.findOne({ id: id2 })
                let isModel = true

                // If not models, try variants
                if (!item1 || !item2) {
                    item1 = await Variant.findById(id1) || await Variant.findOne({ id: id1 })
                    item2 = await Variant.findById(id2) || await Variant.findOne({ id: id2 })
                    isModel = false
                }

                if (!item1 || !item2) {
                    context = `Comparison`
                    entityName = "Comparison"
                    dataSummary = "Comparing two cars."
                } else {
                    context = `Comparison between ${item1.name} vs ${item2.name}`
                    entityName = `${item1.name} vs ${item2.name}`

                    // Fetch brands
                    const brand1 = await Brand.findOne({ id: item1.brandId })
                    const brand2 = await Brand.findOne({ id: item2.brandId })

                    dataSummary = `
                    Car 1: ${brand1?.name} ${item1.name}
                    ${isModel ? `Mileage: ${(item1 as any).mileageData?.[0]?.companyClaimed || 'N/A'}` : `Price: ₹${(item1 as any).price}`}
                    
                    Car 2: ${brand2?.name} ${item2.name}
                    ${isModel ? `Mileage: ${(item2 as any).mileageData?.[0]?.companyClaimed || 'N/A'}` : `Price: ₹${(item2 as any).price}`}
                    `
                }
            }
        }
        console.log(`📰 Fetching news for: ${entityName}`)
        const news = await fetchRealTimeNews(entityName)
        if (news) {
            dataSummary += `\nLATEST NEWS (Real-time):\n${news}`
        }

        console.log(`🤖 Generating quirky bit for: ${context}`)

        // Generate quirky bit using Groq with STRICT data adherence
        if (!groq) {
            // Fallback when Groq is not available
            const result = {
                text: `${entityName} is a great choice. Ask me for more details!`,
                ctaText: type === 'brand' ? 'Tell me more' :
                    type === 'model' ? `Ask about ${entityName}` : 'Compare variants',
                chatContext: `Tell me more about ${context}`,
                type,
                entityName
            }
            cache.set(cacheKey, { data: result, timestamp: Date.now() })
            return res.json(result)
        }

        const prompt = `
        You're a professional car expert writing ONE insightful, memorable fact with subtle humor.
        
        🎯 THIS HOUR'S FOCUS: ${getCurrentTheme()}
        (Write about THIS specific angle - make it unique!)
        
        DATA:
        ${dataSummary || context}

        STYLE GUIDE:
        ✅ Be PROFESSIONAL - Sound like an expert, not a stand-up comedian
        ✅ Be INSIGHTFUL - Share a genuinely useful or surprising fact
        ✅ Be SUBTLE - Humor through clever wordplay, not cultural clichés
        ⚡ Be CONCISE - Under 100 characters, no fluff

        EXAMPLES OF GOOD FACTS:
        - "XUV700's ADAS detects obstacles faster than you can say 'brake'"
        - "Nexon scored 5 stars in crash tests. Your peace of mind? Priceless."
        - "Swift holds its value like fine wine - just depreciates slower"
        - "This engine drinks less fuel than a hybrid in traffic"
        - "Boot space: 450L. Weekend trips? Sorted."
        - "0-100 in 9.5s. Coffee's still hot when you reach the office."

        DON'T DO THIS:
        ❌ "Diwali trips", "chai", "Sharma ji", "mother-in-law" (too informal)
        ❌ "This car has good mileage" (boring, not specific)
        ❌ Multiple emojis or exclamation marks!!!

        RULES:
        1. Focus on the THEME above
        2. Use actual data from the specs provided
        3. One emoji max (optional)
        4. Be clever, not corny

        Write ONE professional-yet-witty fact now (no quotes):
        `

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are an elite automotive journalist known for uncovering fascinating, little-known engineering facts. Your style is sharp, witty, and deeply knowledgeable.'
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: 100,
            temperature: 0.8  // Higher creativity for quirky facts
        })

        const text = response.choices[0]?.message?.content?.trim() ||
            `${entityName} is a great choice. Ask me for more details!`

        // Determine CTA text based on type
        const ctaText = type === 'brand' ? 'Tell me more' :
            type === 'model' ? `Ask about ${entityName}` :
                'Compare variants'

        // Create chat context for AI
        const chatContext = `Tell me more about ${context}. specifically: ${text}`

        const result = {
            text,
            ctaText,
            chatContext,
            type,
            entityName
        }

        // Cache the result
        cache.set(cacheKey, { data: result, timestamp: Date.now() })
        console.log(`✅ Generated and cached quirky bit for ${cacheKey}`)

        res.json(result)

    } catch (error: any) {
        console.error('❌ Quirky bit generation error:', error.message || error)
        res.status(500).json({
            error: 'Failed to generate quirky bit',
            text: 'Discover interesting facts about this car. Click to chat with AI!',
            ctaText: 'Chat with AI',
            chatContext: 'Tell me about this car'
        })
    }
})

export default router
