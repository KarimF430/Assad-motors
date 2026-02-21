/**
 * RAG (Retrieval-Augmented Generation) System
 * Combines MongoDB car data with web scraping for intelligent responses
 */

import mongoose from 'mongoose'
import { HfInference } from '@huggingface/inference'
import { Variant, Model, Brand } from '../db/schemas'
import axios from 'axios'
import * as cheerio from 'cheerio'

const hf = new HfInference(process.env.HF_API_KEY)
const MODEL_NAME = 'meta-llama/Meta-Llama-3.1-70B-Instruct'

// Car schema (assuming you have this)
// The CarData interface is no longer directly used as retrieveCarData now returns `any[]`
// based on the full schema, which is then enriched.
// If specific typing is needed for the enriched variants, a new interface should be defined.

// REMOVED: localKnowledgeBase (User requested NO mock data)

/**
 * Retrieve relevant car data from MongoDB with ALL schema fields
 */
export async function retrieveCarData(query: string, filters?: any): Promise<any[]> {
    try {
        console.log('📊 RAG: Retrieving car data from MongoDB...')

        // Build search query
        const searchQuery: any = { status: 'active' }

        // Add filters if provided
        if (filters?.budget) {
            searchQuery.price = {
                $gte: filters.budget.min || 0,
                $lte: filters.budget.max || 100000000
            }
        }

        if (filters?.seating) {
            searchQuery.seatingCapacity = filters.seating.toString()
        }

        if (filters?.fuelType) {
            searchQuery.fuelType = new RegExp(filters.fuelType, 'i')
        }

        const Car = mongoose.model('Car')

        // 1. Text Search (if query provided)
        let cars = []
        if (query && query.length > 2) {
            const brands = extractBrands(query)
            if (brands.length > 0) {
                searchQuery.brandName = { $in: brands.map(b => new RegExp(b, 'i')) }
            }

            // Simple regex search on name/model if brand not found
            if (brands.length === 0) {
                searchQuery.$or = [
                    { modelName: new RegExp(query, 'i') },
                    { name: new RegExp(query, 'i') }
                ]
            }
        }

        cars = await Car.find(searchQuery).limit(5).lean()

        if (cars.length === 0) {
            console.log('⚠️ No cars found in DB matching criteria')
            return []
        }

        console.log(`✅ Found ${cars.length} cars in DB`)
        return cars

    } catch (error) {
        console.error('MongoDB Retrieval Error:', error)
        return [] // Return empty, NO MOCK DATA
    }
}

/**
 * Retrieve REAL web intelligence data using Google News RSS
 */
export async function retrieveWebData(carName: string): Promise<any> {
    try {
        console.log(`🌐 RAG: Scraping real news for "${carName}"...`)

        const query = encodeURIComponent(`${carName} India car review problems waiting period`)
        const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml'
            }
        })
        const xml = response.data
        const $ = cheerio.load(xml, { xmlMode: true })

        const items = $('item').slice(0, 5).map((i: number, el: any) => ({
            title: $(el).find('title').text(),
            link: $(el).find('link').text(),
            pubDate: $(el).find('pubDate').text(),
            description: $(el).find('description').text().replace(/<[^>]*>/g, '') // Strip HTML
        })).get()

        if (items.length === 0) {
            console.log('⚠️ No news found')
            return null
        }

        console.log(`✅ Found ${items.length} news articles`)

        return {
            source: 'Google News (Real-Time)',
            articles: items,
            summary: `Found ${items.length} recent articles. Top headline: ${items[0].title}`
        }

    } catch (error) {
        console.error('Error retrieving web data:', error)
        return null
    }
}

/**
 * Generate RAG-enhanced response using ALL schema data
 */
export async function generateRAGResponse(
    question: string,
    context: {
        carData?: any[]
        webData?: any
        conversationHistory?: any[]
    }
): Promise<string> {
    try {
        const lowerQ = question.toLowerCase()

        // Build context from retrieved data - extract relevant fields based on question
        let contextText = ''

        if (context.carData && context.carData.length > 0) {
            contextText += '\n**Available Cars from Database:**\n'

            context.carData.forEach(car => {
                contextText += `\n**${car.brandName} ${car.modelName} - ${car.name}:**\n`
                contextText += `- Price: ₹${(car.price / 100000).toFixed(1)}L\n`

                // MILEAGE DATA (if question about mileage/fuel)
                if (lowerQ.includes('mileage') || lowerQ.includes('fuel') || lowerQ.includes('efficiency')) {
                    if (car.mileageCompanyClaimed) contextText += `- Company Claimed: ${car.mileageCompanyClaimed}\n`
                    if (car.mileageCityRealWorld) contextText += `- City (Real): ${car.mileageCityRealWorld}\n`
                    if (car.mileageHighwayRealWorld) contextText += `- Highway (Real): ${car.mileageHighwayRealWorld}\n`
                    if (car.fuelTankCapacity) contextText += `- Tank Capacity: ${car.fuelTankCapacity}\n`
                }

                // SAFETY DATA (if question about safety)
                if (lowerQ.includes('safe') || lowerQ.includes('airbag') || lowerQ.includes('ncap')) {
                    if (car.globalNCAPRating) contextText += `- NCAP Rating: ${car.globalNCAPRating}\n`
                    if (car.airbags) contextText += `- Airbags: ${car.airbags}\n`
                    if (car.airbagsLocation) contextText += `- Airbag Locations: ${car.airbagsLocation}\n`
                    if (car.adasLevel) contextText += `- ADAS Level: ${car.adasLevel}\n`
                    if (car.adasFeatures) contextText += `- ADAS Features: ${car.adasFeatures}\n`
                    if (car.abs) contextText += `- ABS: ${car.abs}\n`
                    if (car.esc) contextText += `- ESC: ${car.esc}\n`
                    if (car.hillAssist) contextText += `- Hill Assist: ${car.hillAssist}\n`
                    if (car.tyrePressureMonitor) contextText += `- TPMS: ${car.tyrePressureMonitor}\n`
                }

                // ENGINE & PERFORMANCE (if question about power/performance)
                if (lowerQ.includes('engine') || lowerQ.includes('power') || lowerQ.includes('performance')) {
                    if (car.engineType) contextText += `- Engine: ${car.engineType}\n`
                    if (car.displacement) contextText += `- Displacement: ${car.displacement}\n`
                    if (car.power || car.maxPower) contextText += `- Power: ${car.power || car.maxPower}\n`
                    if (car.torque) contextText += `- Torque: ${car.torque}\n`
                    if (car.transmission) contextText += `- Transmission: ${car.transmission}\n`
                    if (car.zeroTo100KmphTime) contextText += `- 0-100: ${car.zeroTo100KmphTime}\n`
                    if (car.topSpeed) contextText += `- Top Speed: ${car.topSpeed}\n`
                }

                // FEATURES (if question about features/comfort)
                if (lowerQ.includes('feature') || lowerQ.includes('comfort') || lowerQ.includes('sunroof') || lowerQ.includes('touchscreen')) {
                    if (car.sunroof) contextText += `- Sunroof: ${car.sunroof}\n`
                    if (car.touchScreenInfotainment) contextText += `- Touchscreen: ${car.touchScreenInfotainment}\n`
                    if (car.ventilatedSeats) contextText += `- Ventilated Seats: ${car.ventilatedSeats}\n`
                    if (car.cruiseControl) contextText += `- Cruise Control: ${car.cruiseControl}\n`
                    if (car.androidAppleCarplay) contextText += `- Android Auto/CarPlay: ${car.androidAppleCarplay}\n`
                    if (car.wirelessCharging) contextText += `- Wireless Charging: ${car.wirelessCharging}\n`
                    if (car.airPurifier) contextText += `- Air Purifier: ${car.airPurifier}\n`
                    if (car.headsUpDisplay) contextText += `- HUD: ${car.headsUpDisplay}\n`
                }

                // DIMENSIONS (if question about space/size)
                if (lowerQ.includes('space') || lowerQ.includes('boot') || lowerQ.includes('size') || lowerQ.includes('dimension')) {
                    if (car.seatingCapacity) contextText += `- Seating: ${car.seatingCapacity}\n`
                    if (car.bootSpace) contextText += `- Boot Space: ${car.bootSpace}\n`
                    if (car.length) contextText += `- Length: ${car.length}\n`
                    if (car.width) contextText += `- Width: ${car.width}\n`
                    if (car.height) contextText += `- Height: ${car.height}\n`
                    if (car.wheelbase) contextText += `- Wheelbase: ${car.wheelbase}\n`
                    if (car.groundClearance) contextText += `- Ground Clearance: ${car.groundClearance}\n`
                }

                // WARRANTY (if question about warranty/service)
                if (lowerQ.includes('warranty') || lowerQ.includes('service')) {
                    if (car.warranty) contextText += `- Warranty: ${car.warranty}\n`
                }

                // BASIC INFO (always include)
                if (car.fuelType) contextText += `- Fuel Type: ${car.fuelType}\n`
                if (car.seatingCapacity) contextText += `- Seating: ${car.seatingCapacity} people\n`
            })
        }

        // Add web intelligence context
        if (context.webData) {
            if (context.webData.articles && context.webData.articles.length > 0) {
                // Google News RSS data
                contextText += `\n**Recent News & Information (${context.webData.source}):**\n`
                contextText += `${context.webData.summary}\n\n`

                // Add top 3 articles
                context.webData.articles.slice(0, 3).forEach((article: any, i: number) => {
                    contextText += `${i + 1}. ${article.title}\n`
                    if (article.description) {
                        contextText += `   ${article.description.substring(0, 150)}...\n`
                    }
                })
            } else {
                // Legacy structure (if any)
                contextText += '\n**Real Owner Feedback (Web Scraping):**\n'
                if (context.webData.reviews) {
                    contextText += `- Total Reviews: ${context.webData.reviews.totalReviews}\n`
                    contextText += `- Owner Recommendation: ${context.webData.reviews.ownerRecommendation}%\n`
                    contextText += `- Average Rating: ${context.webData.reviews.averageRating}/5\n`
                }

                if (context.webData.pros) {
                    contextText += `\nPros: ${context.webData.pros.join(', ')}\n`
                }

                if (context.webData.cons) {
                    contextText += `Cons: ${context.webData.cons.join(', ')}\n`
                }

                if (context.webData.waitingPeriod) contextText += `- Waiting Period: ${context.webData.waitingPeriod}\n`
                if (context.webData.discounts) contextText += `- Discounts: ${context.webData.discounts}\n`
                if (context.webData.facelift) contextText += `- Facelift Info: ${context.webData.facelift}\n`

                if (context.webData.launchDate) contextText += `- Expected Launch: ${context.webData.launchDate}\n`
            }
        }

        // Generate AI response with Groq (no fallback - Groq is reliable)
        const prompt = `You are an expert Indian car advisor. Answer the user's question based on the provided data.

**Question:** ${question}

**Available Data:**
${contextText}

**Instructions:**
- Synthesize a clear, concise answer from the data
- For launch dates/news: Say "Based on recent news articles, [answer]"
- Include specific details (dates, prices, features) from the data
- Be conversational and natural
- Keep response 2-3 sentences
- If data is insufficient, say so honestly

**Answer:**`

        console.log('🤖 Sending prompt to Groq LLM...')
        console.log(`📏 Prompt length: ${prompt.length} chars`)

        // Use Groq only (no fallback)
        const Groq = (await import('groq-sdk')).default
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: 'You are a helpful car expert. Provide concise, accurate answers.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7
        })

        const generatedText = completion.choices[0]?.message?.content?.trim() || ''
        console.log('✅ Groq generated response successfully')
        return generatedText

    } catch (error: any) {
        console.error('❌ RAG response generation error:', error.message || error)

        // Last resort: Create a basic summary from the data
        if (context.webData && context.webData.articles && context.webData.articles.length > 0) {
            console.log('⚡ Creating basic summary from web data')
            const articles = context.webData.articles.slice(0, 3)
            const titles = articles.map((a: any) => a.title).join('. ')
            return `Based on ${articles.length} recent news articles: ${titles.substring(0, 300)}...`
        }

        // If we have car data, mention it
        if (context.carData && context.carData.length > 0) {
            const car = context.carData[0]
            return `I found information about ${car.brandName} ${car.modelName} (₹${(car.price / 100000).toFixed(1)}L). Could you be more specific about what you'd like to know?`
        }

        return "I'd be happy to help! Could you provide more details about what you're looking for?"
    }
}

/**
 * Enhanced question handler with RAG
 */
export async function handleQuestionWithRAG(
    question: string,
    filters?: any
): Promise<string> {
    try {
        console.log('🔍 RAG: Processing question with database + web data')

        // Step 1: Retrieve relevant car data from MongoDB
        const carData = await retrieveCarData(question, filters)

        // Step 2: Get web intelligence for top cars OR raw question
        let webData = null
        if (carData.length > 0) {
            const topCar = carData[0]
            webData = await retrieveWebData(`${topCar.brandName || topCar.brand} ${topCar.modelName || topCar.model}`)
        } else {
            // No car found in DB? Search web with the raw question!
            console.log('⚠️ No car in DB, searching web for:', question)
            webData = await retrieveWebData(question)
        }

        // Step 3: Generate RAG-enhanced response
        const response = await generateRAGResponse(question, {
            carData,
            webData
        })

        console.log('✅ RAG: Generated response with real data')
        return response

    } catch (error) {
        console.error('RAG error:', error)
        return "I'm having trouble accessing the car data right now. Please try again!"
    }
}

/**
 * Extract car brands from query
 */
function extractBrands(query: string): string[] {
    const brands = [
        'Maruti', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Honda', 'Toyota',
        'Ford', 'Renault', 'Nissan', 'Volkswagen', 'Skoda', 'MG', 'Jeep'
    ]

    const lowerQuery = query.toLowerCase()
    return brands.filter(brand => lowerQuery.includes(brand.toLowerCase()))
}

/**
 * Build knowledge base from car data
 */
export async function buildKnowledgeBase(): Promise<void> {
    try {
        console.log('📚 Building RAG knowledge base...')

        // This would create embeddings for semantic search
        // For now, we'll use simple text matching

        const Car = mongoose.model('Car')
        const totalCars = await Car.countDocuments()

        console.log(`✅ Knowledge base ready with ${totalCars} cars`)

    } catch (error) {
        console.error('Error building knowledge base:', error)
    }
}
