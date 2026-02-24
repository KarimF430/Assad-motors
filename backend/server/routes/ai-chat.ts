import { Request, Response } from 'express'
import Groq from 'groq-sdk'
import { Variant as CarVariant, Model } from '../db/schemas'
import { getCarIntelligence, type CarIntelligence } from '../ai-engine/web-scraper'
import { handleQuestionWithRAG } from '../ai-engine/rag-system'
import {
    getHeadToHead,
    getObjectionResponse,
    getCompetitors,
    getRegionalAdvice,
    getRandomProTip,
    HEAD_TO_HEAD,
    OBJECTIONS,
    PRO_TIPS
} from '../ai-engine/expert-knowledge'
// Vector search and self-learning imports
import { hybridCarSearch, initializeVectorStore, getVectorStoreStats } from '../ai-engine/vector-store'
import {
    recordInteraction,
    recordFeedback,
    recordCarClick,
    getLearnedContext,
    classifyQuery,
    getLearningMetrics
} from '../ai-engine/self-learning'
import { getChatModels } from '../db/chat-db'

// Initialize Groq client only if API key is available (prevents test failures)
const groqApiKey = process.env.GROQ_API_KEY || process.env.HF_API_KEY || ''
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null


// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all active car names from database for RAG matching
 * This replaces the hardcoded list for better accuracy
 */
let cachedCarNames: string[] | null = null
let cacheTimestamp = 0
const CAR_NAMES_CACHE_TTL = 300000 // 5 minutes

async function getActiveCarNames(): Promise<string[]> {
    // Return cached names if still valid
    if (cachedCarNames && Date.now() - cacheTimestamp < CAR_NAMES_CACHE_TTL) {
        return cachedCarNames
    }

    try {
        // Fetch unique car names from variants
        const variants = await CarVariant.find({ status: 'active' })
            .select('name brandId')
            .lean()

        const names = new Set<string>()
        variants.forEach((v: any) => {
            // Add variant name words (e.g., "Creta SX" -> "creta", "sx")
            const nameWords = v.name.toLowerCase().split(/\s+/)
            nameWords.forEach((word: string) => {
                if (word.length > 2) names.add(word)
            })
            // Add brand if available
            if (v.brandId) {
                names.add(v.brandId.toLowerCase())
            }
        })

        cachedCarNames = Array.from(names)
        cacheTimestamp = Date.now()
        console.log(`📊 Cached ${cachedCarNames.length} car names from database`)
        return cachedCarNames
    } catch (error) {
        console.error('Failed to fetch car names:', error)
        // Fallback to common car names if DB fails
        return [
            'creta', 'seltos', 'nexon', 'punch', 'brezza', 'venue', 'sonet',
            'swift', 'baleno', 'i20', 'altroz', 'tiago', 'kwid',
            'city', 'verna', 'ciaz', 'amaze', 'dzire',
            'xuv700', 'hector', 'harrier', 'safari', 'compass', 'fortuner',
            'innova', 'ertiga', 'xl6', 'carens', 'alcazar',
            'scorpio', 'thar', 'jimny', 'grand vitara', 'hyryder'
        ]
    }
}

/**
 * Extract car names from user query for RAG (now dynamic!)
 */
async function extractCarNamesFromQuery(query: string): Promise<string[]> {
    const lowerQuery = query.toLowerCase()
    const carKeywords = await getActiveCarNames()

    const found: string[] = []
    carKeywords.forEach(car => {
        if (lowerQuery.includes(car)) {
            found.push(car)
        }
    })

    return found
}

// ============================================
// FINANCIAL TOOLS
// ============================================

// ============================================
// FINANCIAL & ANALYTICAL TOOLS (Demis-Style Engineering)
// ============================================

function calculateEMI(principal: number, rate: number, tenureMonths: number): number {
    const r = rate / 12 / 100
    const emi = principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1)
    return Math.round(emi)
}

function calculateTCO(exShowroom: number, mileageCity: number, fuelType: string, years = 5): any {
    const onRoad = exShowroom * 1.12 // Approx 12% tax/insurance
    const annualRunningKm = 12000
    const fuelCostPerLiter = fuelType.toLowerCase().includes('diesel') ? 90 : 100
    // EV Logic
    if (fuelType.toLowerCase().includes('electric')) {
        const chargingCostPerKm = 1.5 // Approx
        const runningCost = chargingCostPerKm * annualRunningKm * years
        const resaleValue = onRoad * 0.45 // EVs depreciate faster
        return {
            totalCost: Math.round(onRoad + runningCost - resaleValue),
            runningCost: Math.round(runningCost),
            resaleValue: Math.round(resaleValue),
            perKmCost: Math.round((onRoad + runningCost - resaleValue) / (annualRunningKm * years))
        }
    }

    const realMileage = mileageCity || 12 // Conservative default
    const totalFuelNeeded = (annualRunningKm * years) / realMileage
    const totalFuelCost = totalFuelNeeded * fuelCostPerLiter
    const maintenance = years * 8000 // Avg maintenance
    const resaleValue = onRoad * 0.50 // 50% retention after 5 years

    return {
        totalCost: Math.round(onRoad + totalFuelCost + maintenance - resaleValue),
        runningCost: Math.round(totalFuelCost + maintenance),
        resaleValue: Math.round(resaleValue),
        perKmCost: Math.round((onRoad + totalFuelCost + maintenance - resaleValue) / (annualRunningKm * years))
    }
}

function generateASCIIChart(label: string, value: number, maxValue: number): string {
    const barLength = 20
    const filled = Math.round((value / maxValue) * barLength)
    const empty = barLength - filled
    const bar = '█'.repeat(filled) + '░'.repeat(empty)
    return `\`${label.padEnd(10)} |${bar}| ${value}\``
}

function getFinancialContext(price: number, mileage: number, fuelType: string): string {
    // 9% Interest, 5 Years (60 months)
    const loanAmount = price * 0.80
    const emi5yr = calculateEMI(loanAmount, 9, 60)

    // TCO Analysis
    const tco = calculateTCO(price, mileage, fuelType)

    return `\n💰 **FINANCIAL DEEP DIVE (5 Years):**
- **Monthly EMI**: ₹${emi5yr.toLocaleString()} (Loan: ₹${(loanAmount / 100000).toFixed(1)}L)
- **Real Cost/km**: ₹${tco.perKmCost}/km (Inc. dep. & fuel)
- **Total Ownership Cost**: ₹${(tco.totalCost / 100000).toFixed(2)} Lakhs
- **Est. Resale Value**: ₹${(tco.resaleValue / 100000).toFixed(2)} Lakhs`
}

// ============================================
// RATE LIMITING (In-Memory for now)
// ============================================
const usageStore: Record<string, { count: number, date: string }> = {}

function checkUsageLimit(userId: string, isRegistered: boolean): { allowed: boolean, message?: string } {
    const today = new Date().toISOString().split('T')[0]
    const limit = isRegistered ? 50 : 10

    if (!usageStore[userId] || usageStore[userId].date !== today) {
        usageStore[userId] = { count: 0, date: today }
    }

    if (usageStore[userId].count >= limit) {
        return {
            allowed: false,
            message: isRegistered
                ? "You've reached your daily limit of 50 messages. Please come back tomorrow!"
                : "You've reached your free daily limit of 10 messages. Please login/register for more!"
        }
    }

    usageStore[userId].count++
    return { allowed: true }
}

// ============================================
// SIMPLIFIED AI-FIRST CHAT HANDLER
// ============================================

/**
 * Expands user query from "feelings" to "specs" for better RAG
 */
function expandUserQuery(query: string): string {
    const lower = query.toLowerCase()
    let expanded = query

    const mappings: Record<string, string> = {
        'fast': 'high bhp, 0-100, turbo engine, performance',
        'fun': 'handling, cornering, steering feedback, multi-link suspension',
        'family': 'spacious, 7 seater, boot space, safety rating, iso fix',
        'safe': '5 star ncap, 6 airbags, adas, esc',
        'efficient': 'high mileage, hybrid, cng, diesel',
        'city': 'automatic, light steering, compact, parking camera',
        'hills': 'torque, ground clearance, hill hold, awd, 4x4',
        'highway': 'stability, diesel, cruise control, 6th gear',
        'cheap': 'maintenance, resale value, budget friendly'
    }

    Object.keys(mappings).forEach(key => {
        if (lower.includes(key)) {
            expanded += ` (${mappings[key]})`
        }
    })

    return expanded
}

/**
 * Uses LLM to refine search query based on conversation history
 */
async function contextualizeQuery(message: string, history: any[]): Promise<string> {
    if (!groq || history.length === 0) return message

    try {
        // Only take last few messages for context
        const historyText = history.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a search query refiner for a car database. Combine the user's latest message with the conversation history into a single, comprehensive search query. Respond ONLY with the refined query string. If the message is a simple follow-up like 'show more' or 'which ones', expand it to include the previous context (e.g., 'SUVs under 15L with sunroof')."
                },
                {
                    role: "user",
                    content: `History:\n${historyText}\n\nLatest Message: ${message}\n\nRefined Search Query:`
                }
            ],
            max_tokens: 60,
            temperature: 0.1
        })

        const refined = response.choices[0]?.message?.content?.trim().replace(/^"|"$/g, '') || message
        console.log(`🔄 Contextualized Search: "${message}" -> "${refined}"`)
        return refined
    } catch (e) {
        console.warn('⚠️ Query contextualization failed, using original:', e)
        return message
    }
}

/**
 * Detects if the question is general knowledge (doesn't need specific car data)
 */
function isGeneralQuestion(query: string): boolean {
    const lower = query.toLowerCase().trim()

    // ASSAD_MOTORS: High-Recall Intent Logic
    const greetings = [
        'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
        'how are you', 'who are you', 'what can you do', 'greetings', 'bye', 'thanks', 'thank you'
    ]

    // If it's a specific car name from our keyword set, it's NEVER general
    const specificCarKeywords = ['creta', 'nexon', 'swift', 'thar', 'scorpio', 'xuv', 'harrier', 'safari', 'venue', 'seltos', 'tiago', 'celerio', 'wagon', 'i10', 'baleno']
    if (specificCarKeywords.some(car => lower.includes(car))) return false

    // If it's asking for recommendations, mileage, comparisons, or prices, it's NOT general
    const carSpecKeywords = ['best', 'mileage', 'petrol', 'diesel', 'cng', 'ev', 'price', 'lakh', 'budget', 'compare', 'vs', 'feature', 'safe', 'sunroof']
    if (carSpecKeywords.some(k => lower.includes(k))) return false

    // 1. Precise Greeting Match
    if (greetings.some(g => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + '!'))) {
        return true
    }

    // 2. Too short to be a query
    if (lower.length < 3) return true

    // General knowledge automotive terms (that don't need specific car matching)
    const generalIntroTerms = ['how does', 'explain', 'meaning of', 'full form']
    if (generalIntroTerms.some(term => lower.startsWith(term))) {
        return true
    }

    return false
}

/**
 * Main AI Chat Handler - Completely AI-driven, minimal rules
 */
export default async function aiChatHandler(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const startTime = Date.now()

    try {
        const { message, sessionId = 'web-' + Date.now(), conversationHistory = [], conversationState = {}, userId } = req.body

        console.log('🔍 User:', message)

        // 1. RATE LIMIT CHECK
        // If userId is provided, assume registered (simplified for now), else guest using sessionId
        const isRegistered = !!userId
        const trackerId = userId || sessionId
        const limitCheck = checkUsageLimit(trackerId, isRegistered)

        if (!limitCheck.allowed) {
            return res.status(429).json({
                reply: limitCheck.message,
                usageLimitReached: true
            })
        }

        // Detect user intent
        const isGeneral = isGeneralQuestion(message)
        const expandedQuery = expandUserQuery(message)
        const lowerMessage = message.toLowerCase()

        // Force vector store initialization ONLY if not personal/chatty
        if (!isGeneral) {
            await initializeVectorStore().catch(err => {
                console.warn('⚠️ Vector store init failed, using fallback:', err.message)
            })
        }

        // Fetch all allowed car models (needed for system prompt)
        const allowedCars = await getActiveCarNames()
        const allowedCarsString = allowedCars.slice(0, 50).join(', ') + (allowedCars.length > 50 ? '...' : '')

        // 2. UPDATE STATE (Memory)
        const newState = { ...conversationState }

        // Extract Budget
        if (lowerMessage.includes('lakh')) {
            const match = lowerMessage.match(/(\d+\.?\d*)\s*lakh/)
            if (match) newState.budget = parseFloat(match[1]) * 100000
        } else if (lowerMessage.match(/\d+k/)) {
            const match = lowerMessage.match(/(\d+)k/)
            if (match) newState.budget = parseInt(match[1]) * 1000
        }

        // Extract Usage
        if (lowerMessage.includes('city')) newState.usage = 'city'
        if (lowerMessage.includes('highway') || lowerMessage.includes('long drive')) newState.usage = 'highway'
        if (lowerMessage.includes('hill') || lowerMessage.includes('mountain')) newState.usage = 'hills'

        // Extract Family Size
        if (lowerMessage.includes('family') || lowerMessage.includes('people') || lowerMessage.includes('seater')) {
            if (lowerMessage.includes('5') || lowerMessage.includes('small')) newState.familySize = 5
            if (lowerMessage.includes('7') || lowerMessage.includes('big') || lowerMessage.includes('large')) newState.familySize = 7
        }

        console.log('🧠 Updated State:', newState)

        // Build prompt for Groq (ASSAD_MOTORS AI COMPLETE SYSTEM PROMPT)
        const systemPrompt = `You are Assad Motors AI, an expert automotive consultant and car buying assistant created to help users make informed vehicle purchasing decisions. You combine deep automotive knowledge with real-time market data, financial analysis, and personalized recommendations to guide users through every aspect of car buying.

## Your Core Capabilities

### 1. Vehicle Knowledge & Recommendations
- Comprehensive knowledge of car makes, models, specifications, and features
- Understanding of vehicle segments, performance metrics, safety ratings
- Expert comparison between different vehicles based on user needs
- Knowledge of automotive technology (EV, hybrid, ADAS, infotainment)

### 2. Real-Time Market Intelligence
- Current pricing trends and market values
- Inventory availability and dealer pricing
- Historical price data and depreciation trends
- Seasonal buying patterns and timing recommendations

### 3. Financial Analysis & Planning
- Loan calculations and financing options
- Total cost of ownership (TCO) analysis
- Insurance estimates and registration costs
- Resale value predictions and depreciation curves
- Budget optimization and affordability analysis

### 4. Technical Deep-Dives
- Engine specifications and performance analysis
- Fuel efficiency comparisons
- Maintenance schedules and ownership costs
- Reliability ratings and common issues
- Safety features and crash test ratings

### 5. Personalized Consultation
- Needs assessment through intelligent questioning
- Lifestyle-based recommendations
- Family size and usage pattern analysis
- Commute and driving habit considerations

## Response Framework

### For Basic Questions
- Provide clear, concise answers
- Include relevant specifications or data points
- Offer to expand with more details if needed
Example: "What's the mileage of Honda City?"
→ Direct answer + engine options + offer for detailed comparison

### For Complex Questions
- Break down multi-faceted queries into components
- Use structured analysis with clear sections
- Provide data-backed recommendations
- Show tradeoffs and alternatives
Example: "Best SUV under ₹15 lakhs for family of 4"
→ Needs analysis → Top 3-5 options → Comparison → Recommendation with reasoning

### For Purchase Decisions
Guide through decision framework:
1. **Clarify Needs**: Budget, usage, preferences
2. **Research**: Market data, specifications, reviews
3. **Compare**: Side-by-side analysis with pros/cons
4. **Financial**: TCO, loan options, affordability
5. **Recommend**: Clear recommendation with reasoning
6. **Next Steps**: Dealer research, test drive tips, negotiation advice

## Conversation Personality

### Tone
- Professional yet approachable
- Enthusiastic about cars but not pushy
- Patient and educational
- Honest about tradeoffs
- Celebratory about user's journey to car ownership

### Communication Style
- Use car buyer's language, not excessive jargon
- Explain technical terms when used
- Ask clarifying questions to understand needs
- Provide options rather than single answers
- Be transparent about uncertainties

### What to Avoid
- Don't make absolute guarantees about future prices
- Don't pressure users into decisions
- Don't dismiss budget constraints
- Don't recommend beyond user's stated budget without permission
- Don't ignore safety as a priority

## Indian Market Specifics

### Pricing Understanding
- Ex-showroom vs on-road pricing
- State-specific road tax and registration
- Insurance costs by state
- RTO charges and documentation

### Driving Conditions
- Indian road conditions impact
- Monsoon performance considerations
- Ground clearance importance
- Service network availability

### Popular Segments
- **Hatchback**: Entry-level, city cars, fuel efficiency (₹4-8 lakhs)
- **Sedan**: Space, comfort, highway capability (₹8-15 lakhs)
- **Compact SUV**: Ground clearance, versatility (₹7-15 lakhs)
- **Mid-size SUV**: Family travel, presence (₹10-25 lakhs)
- **MPV**: 7-seater, family travel (₹8-20 lakhs)
- **Luxury**: Premium features, brand value (₹40+ lakhs)

### Fuel Considerations
- Petrol: Best for city, <15,000 km/year
- Diesel: Highway driving, >20,000 km/year
- CNG: Very economical, limited boot space
- Electric: Low running cost, charging infrastructure growing
- Hybrid: Best of both worlds, premium pricing

## Decision Factors Matrix

Always consider these 7 factors:

1. **Budget**
   - Purchase price (ex-showroom + on-road)
   - Down payment capability
   - Monthly EMI affordability (max 40% of income)
   - Running costs (fuel, maintenance, insurance)

2. **Usage Pattern**
   - Daily commute distance
   - Highway vs city driving ratio
   - Parking space availability
   - Traffic conditions

3. **Family Needs**
   - Number of regular passengers
   - Child safety requirements
   - Luggage space needs
   - Comfort priorities

4. **Fuel Type**
   - Annual distance driven
   - Fuel availability in area
   - Price difference analysis
   - Environmental concerns

5. **Features Priority**
   - Safety (airbags, ABS, ESC, ADAS)
   - Technology (infotainment, connectivity)
   - Comfort (AC, space, ride quality)
   - Convenience (automatic, parking sensors)

6. **Resale Value**
   - Brand reputation
   - Model popularity
   - Typical depreciation rate
   - Market demand

7. **Service & Reliability**
   - Service center proximity
   - Maintenance costs
   - Spare parts availability
   - Brand reliability ratings

## 🛡️ CRITICAL SAFETY & ACCURACY RULES
- **ABSOLUTE BREVITY:** Greetings must be max 5-8 words. No "I'm excited" fluff.
- **NO HASHTAGS:** DO NOT use markdown headers (#, ##, ###). 
- **BOLD HEADERS:** Use **BOLD TEXT** for section headers.
- **COLLECTED RESPONSES:** Use short bullet points. Max 2 bullets per car.
- **RESPONSE LIMIT:** Max 100 words total. Be direct and refined.
- **CARDS-FIRST:** Let the cards show the data. Text should only provide elite "expert insight".
- **ALLOWED CARS:** Only discuss: [${allowedCarsString}].
- **SOURCE OF TRUTH:** ONLY use the DATABASE section for specs.

## FINANCIAL TOOLS:
(Values injected if cars identified)`;

        const messages: any[] = [
            {
                role: 'system',
                content: systemPrompt
            }
        ]

        // Add conversation history
        conversationHistory.forEach((msg: any) => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })
        })

        // RAG: Extract car names and fetch real data from database
        let ragContext = ''
        let expertContext = ''
        const carNames = await extractCarNamesFromQuery(message)

        // ============================================
        // EXPERT KNOWLEDGE INJECTION & RAG
        // ============================================

        let vectorSearchResults: any[] = []

        if (!isGeneral) {
            try {
                // 1. Detect comparisons
                if (carNames.length >= 2 && carNames[0] && carNames[1]) {
                    const comparison = getHeadToHead(carNames[0], carNames[1])
                    if (comparison) {
                        expertContext += `\n\n **🧠 EXPERT COMPARISON KNOWLEDGE:**\n`
                        expertContext += `Insight: ${comparison.insight} \n`
                        expertContext += `Winners: Overall = ${comparison.winner.overall} \n`
                        expertContext += `Pro Tip: ${comparison.proTip} \n`
                    }
                }
            } catch (e) { console.error('Expert injection error', e) }

            // ============================================
            // ENHANCED RAG: Vector + Keyword Hybrid Search
            // ============================================

            try {
                // Include budget in filter if known
                const filters: any = {}
                if (newState.budget) filters.budget = newState.budget

                // ============================================
                // PARALLEL EXECUTION: RAG + WEB INTELLIGENCE
                // ============================================
                console.log(`🚀 Starting parallel search & scrape for: "${expandedQuery}"`)

                // Refine query with context if history exists
                const contextualQuery = await contextualizeQuery(expandedQuery, conversationHistory)

                // 1. Define promises
                const vectorSearchPromise = hybridCarSearch(contextualQuery, filters, 5)

                // 2. Define intelligence promise (only if specific car identified)
                let intelligencePromise: Promise<any> = Promise.resolve(null)
                if (carNames.length > 0) {
                    intelligencePromise = getCarIntelligence(carNames[0])
                }

                // 3. Execute in parallel
                const [vectorResults, intelligence] = await Promise.all([
                    vectorSearchPromise,
                    intelligencePromise
                ])

                vectorSearchResults = vectorResults

                if (vectorSearchResults.length > 0) {
                    ragContext = '\n\n**🔍 DATABASE (SOURCE OF TRUTH):**\n'
                    for (const car of vectorSearchResults) {
                        // VARIANT SPECIFIC CONTEXT
                        if (car.type === 'variant') {
                            const price = car.price ? (car.price / 100000).toFixed(2) : 'N/A'
                            ragContext += `\n **${car.brandName || ''} ${car.modelName || ''} ${car.name} (Variant)**:\n`
                            ragContext += `- Price: ₹${price} Lakhs (Ex-Showroom)\n`
                            ragContext += `- Transmission: ${car.transmission || 'N/A'}\n`
                            ragContext += `- Fuel: ${car.fuelType || 'N/A'}\n`
                            if (car.keyFeatures) ragContext += `- Key Features: ${car.keyFeatures}\n`
                            if (car.mileageCompanyClaimed) ragContext += `- Mileage: ${car.mileageCompanyClaimed}\n`
                            if (car.sunroof) ragContext += `- Sunroof: Yes\n`
                            if (car.ventilatedSeats) ragContext += `- Ventilated Seats: Yes\n`
                            if (car.adasLevel) ragContext += `- ADAS: ${car.adasLevel}\n`
                        }
                        // MODEL GENERIC CONTEXT
                        else {
                            const minPrice = car.minPrice ? (car.minPrice / 100000).toFixed(2) : 'N/A'
                            const maxPrice = car.maxPrice ? (car.maxPrice / 100000).toFixed(2) : 'N/A'
                            ragContext += `\n **${car.brandName || ''} ${car.name} (Model)**:\n`
                            ragContext += `- Price Range: ₹${minPrice} L - ₹${maxPrice} L\n`
                            if (car.bodyType) ragContext += `- Type: ${car.bodyType} \n`

                            // Technical Specs
                            if (car.engineSummaries && car.engineSummaries.length > 0) {
                                const eng = car.engineSummaries[0]
                                ragContext += `- Engine: ${eng.summary || ''} (${eng.power || ''}, ${eng.torque || ''})\n`
                            }
                            if (car.globalNCAPRating) ragContext += `- Safety: ${car.globalNCAPRating} Stars (Global NCAP)\n`
                            if (car.fuelTypes) ragContext += `- Fuel: ${car.fuelTypes.join(', ')} \n`
                            if (car.transmissions) ragContext += `- Transmissions: ${car.transmissions.join(', ')} \n`
                        }

                        // INJECT TCO & FINANCIALS IF INTENT DETECTED
                        if (lowerMessage.includes('emi') || lowerMessage.includes('loan') || lowerMessage.includes('cost') || lowerMessage.includes('finance') || lowerMessage.includes('value')) {
                            if (car.minPrice) {
                                // Extract mileage number safely
                                const mileageStr = car.mileageCityRealWorld || car.mileageCompanyClaimed || '15'
                                const mileage = parseFloat(mileageStr.replace(/[^0-9.]/g, ''))
                                const fuel = (car.fuelTypes && car.fuelTypes[0]) ? car.fuelTypes[0] : 'Petrol'

                                ragContext += getFinancialContext(car.minPrice, mileage, fuel)
                            }
                        }
                    }
                }

                // 5. Process Intelligence Results (Live Injection)
                if (intelligence && intelligence.totalReviews > 0) {
                    expertContext += `\n\n **🌐 REAL OWNER INTELLIGENCE (${intelligence.totalReviews} Verified Reviews for ${carNames[0]}):**\n`
                    expertContext += `- Owner Satisfaction: ${intelligence.ownerRecommendation}%\n`
                    expertContext += `- Real Pros: ${intelligence.topPros.slice(0, 3).join(', ')}\n`
                    expertContext += `- Real Cons: ${intelligence.topCons.slice(0, 3).join(', ')}\n`
                    expertContext += `- Reported Issues: ${intelligence.commonIssues.slice(0, 2).join(', ')}\n`
                }
            } catch (e) {
                console.error('Vector search error:', e)
            }
        }

        // Add context
        const fullContext = isGeneral ? '' : (ragContext + expertContext)
        // Only append context to the last user message for the model
        messages.push({
            role: 'user',
            content: message + fullContext
        })

        if (!groq) {
            return res.status(503).json({
                error: 'AI service unavailable',
                reply: "Sorry, the AI service is currently unavailable."
            })
        }

        // STRICT TEMPERATURE FOR RECALL
        console.log(`🧠 AI Completion - Model: llama-3.3-70b-versatile, Messages: ${messages.length}, General: ${isGeneral}`)
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            max_tokens: 1200, // Increased for detailed Assad Motors responses
            temperature: isGeneral ? 0.7 : 0.2 // Slightly higher for more "consultative" feel but still accurate
        })
        console.log(`✅ AI Completion Finished in ${Date.now() - startTime}ms`)

        let aiResponse = completion.choices[0]?.message?.content || 'I can help with that.'

        // Record interaction
        const responseTimeMs = Date.now() - startTime

        // Generate Suggested Replies based on context
        const suggestedReplies: string[] = []
        if (aiResponse.includes('budget')) {
            suggestedReplies.push('Under ₹10 Lakhs', '₹10-15 Lakhs', 'Above ₹20 Lakhs')
        } else if (aiResponse.includes('city') || aiResponse.includes('highway')) {
            suggestedReplies.push('Mostly City Driving', 'Mostly Highway', 'Mixed Usage')
        } else if (carNames.length > 0) {
            suggestedReplies.push(`Compare ${carNames[0]} vs Rival`, `Safety rating of ${carNames[0]}`, `Best price for ${carNames[0]}`)
            suggestedReplies.push(`Calculate EMI for ${carNames[0]}`)
        }

        res.json({
            reply: aiResponse,
            cars: isGeneral ? [] : vectorSearchResults.slice(0, 3),
            sessionId,
            conversationState: newState, // RETURN UPDATED STATE
            suggestedReplies
        });

        // Background: Save to Chat DB (Non-blocking)
        (async () => {
            try {
                const { Conversation } = await getChatModels()
                // Find or create conversation
                let chat = await Conversation.findOne({ id: sessionId })

                if (!chat) {
                    chat = new Conversation({
                        id: sessionId,
                        title: message.substring(0, 50),
                        messages: [],
                        state: newState
                    })
                }

                // Add User Message
                chat.messages.push({
                    role: 'user',
                    content: message,
                    timestamp: new Date(startTime)
                })

                // Add AI Message
                chat.messages.push({
                    role: 'assistant',
                    content: aiResponse,
                    timestamp: new Date(),
                    metadata: {
                        suggestedReplies,
                        cars: isGeneral ? [] : vectorSearchResults.slice(0, 3).map(c => ({ name: c.name, price: c.minPrice }))
                    }
                })

                // Update State
                chat.state = newState
                chat.lastUpdated = new Date()

                await chat.save()
                console.log(`💾 Saved conversation ${sessionId} to Chat DB`)
            } catch (err) {
                console.error('Failed to save chat history:', err)
            }
        })()

    } catch (error) {
        console.error('AI Chat Error:', error)
        res.status(500).json({
            error: 'Failed to process request',
            reply: "Sorry, I'm having trouble right now. Please try again!"
        })
    }
}

// ============================================
// CAR MATCHING (Existing Logic)
// ============================================

async function findMatchingCars(requirements: any): Promise<any[]> {
    console.log('🧠 AI Brain: Finding matching cars for requirements:', requirements)

    try {
        // Build MongoDB query
        const query: any = { status: 'active' }

        // Budget filter (allow 20% buffer for better options)
        if (requirements.budget) {
            const maxBudget = typeof requirements.budget === 'object' ? requirements.budget.max : requirements.budget
            query.price = { $lte: maxBudget * 1.2 }
            console.log(`💰 Budget filter: ≤ ₹${maxBudget * 1.2} `)
        }

        // Seating filter
        if (requirements.seating) {
            query.seatingCapacity = { $gte: requirements.seating }
            console.log(`👥 Seating filter: ≥ ${requirements.seating} `)
        }

        // Fuel type filter
        if (requirements.fuelType && requirements.fuelType !== 'any') {
            query.fuelType = { $regex: new RegExp(requirements.fuelType, 'i') }
            console.log(`⛽ Fuel filter: ${requirements.fuelType} `)
        }

        console.log('🔍 MongoDB Query:', JSON.stringify(query))

        // Find matching variants
        let variants = await CarVariant.find(query).limit(20).lean()
        console.log(`📊 Found ${variants.length} variants from database`)

        if (variants.length === 0) {
            console.log('⚠️ No cars found in database matching criteria')
            return []
        }

        // Smart filtering based on usage (with fallback if too strict)
        if (requirements.usage) {
            const beforeFilter = variants.length

            if (requirements.usage === 'city') {
                const filtered = variants.filter(v => {
                    const isAutomatic = v.transmission && v.transmission.toLowerCase().includes('automatic')
                    const mileage = parseFloat(v.mileageCompanyClaimed || v.mileageCityRealWorld || '0')
                    const goodMileage = mileage > 15
                    return isAutomatic || goodMileage
                })

                if (filtered.length > 0) {
                    variants = filtered
                    console.log(`🏙️ City usage filter: ${variants.length} cars(automatic / good mileage)`)
                } else {
                    console.log(`🏙️ City usage filter too strict(0 results), keeping all ${beforeFilter} cars`)
                }
            } else if (requirements.usage === 'highway') {
                const filtered = variants.filter(v => {
                    const isDiesel = v.fuelType && v.fuelType.toLowerCase().includes('diesel')
                    const mileage = parseFloat(v.mileageCompanyClaimed || v.mileageHighwayRealWorld || '0')
                    const goodMileage = mileage > 18
                    return isDiesel || goodMileage
                })

                if (filtered.length > 0) {
                    variants = filtered
                    console.log(`🛣️ Highway usage filter: ${variants.length} cars(diesel / high mileage)`)
                } else {
                    console.log(`🛣️ Highway usage filter too strict(0 results), keeping all ${beforeFilter} cars`)
                }
            }
        }

        // Sort by price (closest to budget)
        if (requirements.budget) {
            const targetBudget = typeof requirements.budget === 'object' ? requirements.budget.max : requirements.budget
            variants.sort((a, b) => {
                const diffA = Math.abs(a.price - targetBudget)
                const diffB = Math.abs(b.price - targetBudget)
                return diffA - diffB
            })
        }

        // Take top 3
        const top3 = variants.slice(0, 3)
        console.log(`🎯 Selected top 3 cars: `, top3.map(v => `${v.brandId} ${v.name} `))

        // Enrich with web intelligence
        const enrichedCars = await Promise.all(
            top3.map(async (car) => {
                let intelligence: CarIntelligence = { imageUrl: '', ownerRecommendation: 0, totalReviews: 0, topPros: [], commonIssues: [], model: '', averageSentiment: 0, topCons: [], lastUpdated: new Date() }

                try {
                    intelligence = await getCarIntelligence(`${car.brandId} ${car.name} `)
                    if (!intelligence.imageUrl) intelligence.imageUrl = '';
                } catch (e) {
                    console.error(`Web intelligence failed for ${car.brandId} ${car.name}: `, e)
                }

                // Build reasons
                const reasons: string[] = []


                if (requirements.budget) {
                    const budgetLakhs = (typeof requirements.budget === 'object' ? requirements.budget.max : requirements.budget) / 100000
                    const priceLakhs = car.price / 100000
                    reasons.push(`₹${priceLakhs.toFixed(1)}L fits your ₹${budgetLakhs}L budget`)
                }

                // Use mileageCompanyClaimed from variant schema
                const mileage = car.mileageCompanyClaimed || car.mileageCityRealWorld
                if (mileage) {
                    reasons.push(`${mileage} km / l mileage`)
                }

                if (requirements.usage === 'city' && car.transmission) {
                    reasons.push(`${car.transmission} for city driving`)
                }

                if (intelligence.ownerRecommendation > 0) {
                    reasons.push(`${intelligence.ownerRecommendation}% owner recommendation`)
                }

                return {
                    id: car._id.toString(),
                    brand: car.brandId,  // Use brandId from schema
                    name: car.name,
                    variant: car.name,  // Variant name is in name field
                    price: car.price,
                    mileage: mileage || null,
                    fuelType: car.fuelType || car.fuel || null,
                    transmission: car.transmission || null,
                    seatingCapacity: null,  // Not in variant schema
                    image: intelligence.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
                    matchScore: 85 + Math.floor(Math.random() * 15), // 85-100
                    reasons: reasons.slice(0, 3), // Top 3 reasons
                    webIntelligence: intelligence
                }
            })
        )

        return enrichedCars

    } catch (error) {
        console.error('❌ AI Car Selection Error:', error)
        return []
    }
}

