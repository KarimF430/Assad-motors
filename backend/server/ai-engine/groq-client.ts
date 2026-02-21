/**
 * Groq Client - FAST & FREE Intent Classification
 * 
 * Groq provides:
 * - FREE API with generous limits
 * - 500+ tokens/second (100x faster than Hugging Face)
 * - 99.9% uptime
 * - Supports Llama 3.1, Mixtral, and other models
 */

import Groq from 'groq-sdk'

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || process.env.HF_API_KEY // Fallback to HF key for now
})

// Use Llama 3.1 8B for fast intent classification
const INTENT_MODEL = 'llama-3.1-8b-instant'

console.log('⚡ Using Groq (FREE & FAST) for intent classification')

/**
 * Classify user intent using Groq
 * Returns: 'query' (wants information) or 'recommendation' (wants car suggestions)
 */
export async function classifyUserIntent(userMessage: string): Promise<'query' | 'recommendation'> {
    try {
        const completion = await groq.chat.completions.create({
            model: INTENT_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a classifier. Reply with ONLY one word: 'query' or 'recommendation'."
                },
                {
                    role: "user",
                    content: `Classify this user message:

"${userMessage}"

Rules:
- "query" = User wants INFORMATION about specific cars, features, comparisons, news, specs, etc.
- "recommendation" = User wants YOU TO SUGGEST cars based on their personal needs

Examples of QUERY:
- "honda amaze or city?" → query (comparing two cars)
- "honda amaze" → query (asking about Honda Amaze)
- "city car" → query (asking about Honda City)
- "what's the mileage of creta" → query
- "is nexon safe" → query
- "upcoming tata cars" → query
- "creta vs seltos" → query (comparison)
- "tell me about harrier" → query
- "price of fortuner" → query
- "can you suggest upcoming cars" → query (wants info about upcoming)

Examples of RECOMMENDATION:
- "suggest me a car" → recommendation
- "help me find a good suv" → recommendation
- "which car should i buy" → recommendation
- "best car for my family" → recommendation
- "i need a car for city driving" → recommendation
- "looking for automatic car" → recommendation

Key distinction:
- Specific car names (honda amaze, creta, nexon) → query
- "X or Y?" comparisons → query
- Generic needs (family car, city car, automatic) → recommendation

Reply with ONE word:`
                }
            ],
            max_tokens: 10,
            temperature: 0.1
        })

        const classification = completion.choices[0]?.message?.content?.trim().toLowerCase() || ''

        console.log(`🎯 Groq Classification: "${classification}"`)

        if (classification.includes('query')) {
            return 'query'
        } else if (classification.includes('recommendation')) {
            return 'recommendation'
        }

        // Default to query if unclear (safer - won't force questions)
        console.log('⚠️ Unclear classification, defaulting to query')
        return 'query'

    } catch (error: any) {
        console.error('❌ Groq classification error:', error.message || error)

        // Fallback to simple keyword detection
        return fallbackClassification(userMessage)
    }
}

/**
 * Fallback classification using keywords (if Groq fails)
 */
function fallbackClassification(message: string): 'query' | 'recommendation' {
    const lower = message.toLowerCase()

    // Strong query indicators
    const queryKeywords = [
        'upcoming', 'launch', 'expected', 'waiting period', 'discount', 'offer',
        'what is', 'how is', 'tell me', 'show me', 'what are', 'which is better',
        'compare', 'vs', 'versus', 'mileage', 'safety', 'problem', 'issue',
        'review', 'rating', 'spec', 'feature'
    ]

    // Strong recommendation indicators
    const recommendationKeywords = [
        'for me', 'for my', 'should i buy', 'help me find', 'help me choose',
        'i want to buy', 'i need', 'looking for a car', 'find me a car'
    ]

    // Check recommendation first (more specific)
    if (recommendationKeywords.some(kw => lower.includes(kw))) {
        console.log('📋 Fallback: RECOMMENDATION (keyword match)')
        return 'recommendation'
    }

    // Then check query
    if (queryKeywords.some(kw => lower.includes(kw))) {
        console.log('📋 Fallback: QUERY (keyword match)')
        return 'query'
    }

    // Default to recommendation (safer)
    console.log('📋 Fallback: RECOMMENDATION (default)')
    return 'recommendation'
}

export default {
    classifyUserIntent
}
