/**
 * Ollama Client - Local LLM Integration
 * 
 * This module provides integration with Ollama (Llama 3.1 8B) for:
 * - Natural language understanding
 * - Entity extraction from user queries
 * - Conversational responses
 * 
 * Ollama runs locally, so:
 * - No API costs
 * - Complete privacy
 * - No rate limits
 * - Fast responses (1-3 seconds)
 */

import axios from 'axios'

// Ollama server configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const MODEL_NAME = 'llama3.1:8b'

// ============================================
// TYPE DEFINITIONS
// ============================================

interface OllamaRequest {
    model: string
    prompt: string
    stream: boolean
    options?: {
        temperature?: number
        top_p?: number
        top_k?: number
    }
}

interface OllamaResponse {
    model: string
    created_at: string
    response: string
    done: boolean
}

interface ExtractedRequirements {
    seating?: number
    budget?: {
        min?: number
        max?: number
    }
    usage?: 'city' | 'highway' | 'both'
    fuelType?: 'petrol' | 'diesel' | 'cng' | 'electric'
    bodyType?: 'SUV' | 'Sedan' | 'Hatchback' | 'MUV' | 'Coupe'
    features?: string[]
    priority?: string[]
}

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Query Ollama with a prompt
 * @param prompt - The prompt to send to Ollama
 * @param temperature - Creativity level (0-1, default 0.3 for consistency)
 * @returns The LLM response
 */
export async function queryOllama(
    prompt: string,
    temperature: number = 0.3
): Promise<string> {
    try {
        const response = await axios.post<OllamaResponse>(
            `${OLLAMA_BASE_URL}/api/generate`,
            {
                model: MODEL_NAME,
                prompt: prompt,
                stream: false,
                options: {
                    temperature,
                    top_p: 0.9,
                    top_k: 40
                }
            },
            {
                timeout: 30000 // 30 second timeout
            }
        )

        return response.data.response.trim()
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Ollama server is not running. Please start it with: ollama serve')
            }
            throw new Error(`Ollama request failed: ${error.message}`)
        }
        throw error
    }
}

/**
 * Extract car requirements from user message
 * Uses Llama 3.1 to understand natural language and extract structured data
 * 
 * @param userMessage - User's natural language query
 * @returns Extracted requirements as structured data
 */
export async function extractRequirements(
    userMessage: string
): Promise<ExtractedRequirements> {
    const prompt = `You are an AI assistant for a car recommendation system in India. Extract car requirements from the user's message.

User message: "${userMessage}"

Extract the following information:
- seating: number of people (extract from "5 people", "family of 6", etc.)
- budget: maximum budget in lakhs (convert "15 lakhs" to 1500000, "under 20L" to 2000000)
- usage: "city", "highway", or "both" (infer from context like "city driving", "long trips")
- fuelType: "petrol", "diesel", "cng", or "electric"
- bodyType: "SUV", "Sedan", "Hatchback", "MUV", or "Coupe"
- features: array of features mentioned (e.g., ["sunroof", "automatic", "leather seats"])
- priority: what's most important to the user (e.g., ["mileage", "safety", "space"])

Important:
- Understand Indian English and Hinglish (e.g., "accha mileage" means good mileage)
- Convert lakhs to actual numbers (10 lakh = 1000000)
- If something is not mentioned, set it to null
- Return ONLY valid JSON, no explanation

Example:
Input: "I need a car for 5 people family under 15 lakhs with good mileage"
Output: {
  "seating": 5,
  "budget": {"max": 1500000},
  "usage": null,
  "fuelType": null,
  "bodyType": null,
  "features": [],
  "priority": ["mileage"]
}

Now extract from the user's message. Return ONLY the JSON:`

    try {
        const response = await queryOllama(prompt, 0.1) // Low temperature for consistency

        // Try to parse JSON from response
        // Sometimes LLM adds markdown code blocks, so we need to clean it
        let jsonStr = response

        // Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '')

        // Find JSON object in response
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            jsonStr = jsonMatch[0]
        }

        const extracted = JSON.parse(jsonStr)

        return extracted
    } catch (error) {
        console.error('Failed to extract requirements:', error)

        // Fallback to simple regex-based extraction
        return fallbackExtraction(userMessage)
    }
}

/**
 * Fallback extraction using regex (if LLM fails)
 * Simple pattern matching for basic requirements
 */
function fallbackExtraction(message: string): ExtractedRequirements {
    const lowerMessage = message.toLowerCase()
    const extracted: ExtractedRequirements = {}

    // Extract seating
    const seatingMatch = lowerMessage.match(/(\d+)\s*(seater|people|person)/i)
    if (seatingMatch) {
        extracted.seating = parseInt(seatingMatch[1])
    }

    // Extract budget (in lakhs)
    const budgetMatch = lowerMessage.match(/(\d+)\s*(lakh|lakhs|l)/i)
    if (budgetMatch) {
        const lakhs = parseInt(budgetMatch[1])
        extracted.budget = { max: lakhs * 100000 }
    }

    // Extract usage
    if (lowerMessage.includes('city')) extracted.usage = 'city'
    if (lowerMessage.includes('highway')) extracted.usage = 'highway'

    // Extract fuel type
    if (lowerMessage.includes('petrol')) extracted.fuelType = 'petrol'
    if (lowerMessage.includes('diesel')) extracted.fuelType = 'diesel'
    if (lowerMessage.includes('cng')) extracted.fuelType = 'cng'
    if (lowerMessage.includes('electric') || lowerMessage.includes('ev')) {
        extracted.fuelType = 'electric'
    }

    // Extract body type
    if (lowerMessage.includes('suv')) extracted.bodyType = 'SUV'
    if (lowerMessage.includes('sedan')) extracted.bodyType = 'Sedan'
    if (lowerMessage.includes('hatchback')) extracted.bodyType = 'Hatchback'

    // Extract features
    const features: string[] = []
    if (lowerMessage.includes('sunroof')) features.push('sunroof')
    if (lowerMessage.includes('automatic')) features.push('automatic')
    if (lowerMessage.includes('safety')) features.push('safety features')
    if (features.length > 0) extracted.features = features

    return extracted
}

/**
 * Generate conversational response
 * Creates natural, friendly responses for the chat interface
 * 
 * @param context - Current conversation context
 * @param requirements - Extracted requirements so far
 * @returns AI-generated response
 */
export async function generateResponse(
    context: string,
    requirements: Partial<ExtractedRequirements>
): Promise<string> {
    const prompt = `You are a friendly AI car assistant for an Indian car website. 

Current requirements collected:
${JSON.stringify(requirements, null, 2)}

Context: ${context}

Generate a friendly, conversational response that:
1. Acknowledges what the user said
2. Asks for the next most important missing information
3. Uses simple, clear language
4. Keeps it brief (2-3 sentences max)
5. Uses Indian context (lakhs, Indian roads, etc.)

Examples:
- "Great! A 5-seater would be perfect. What's your budget range?"
- "Perfect budget! Where will you mostly drive - city or highway?"
- "Got it! For city driving, what fuel type do you prefer?"

Generate response:`

    const response = await queryOllama(prompt, 0.7) // Higher temperature for variety
    return response
}

/**
 * Check if Ollama is running and accessible
 * @returns true if Ollama is running, false otherwise
 */
export async function checkOllamaStatus(): Promise<boolean> {
    try {
        const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
            timeout: 5000
        })
        return response.status === 200
    } catch (error) {
        return false
    }
}

/**
 * Get list of available models
 * @returns Array of model names
 */
export async function getAvailableModels(): Promise<string[]> {
    try {
        const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`)
        return response.data.models.map((m: any) => m.name)
    } catch (error) {
        console.error('Failed to get models:', error)
        return []
    }
}
