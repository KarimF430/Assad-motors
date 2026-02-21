/**
 * AI Adapter - Works on Both Local and Vercel
 * 
 * Automatically detects environment and uses appropriate AI:
 * - Local: Hugging Face (FREE, cloud)
 * - Vercel: Hugging Face (FREE, cloud)
 * 
 * Using Hugging Face everywhere for simplicity!
 */

import * as hf from './huggingface-client.js'
import * as groq from './groq-client.js'

// ============================================
// ENVIRONMENT DETECTION
// ============================================

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined
const useHuggingFace = true // Always use Hugging Face

console.log(`🤖 AI Mode: Hugging Face (Cloud)`)
console.log('✅ Using Hugging Face (FREE tier)')

// ============================================
// EXPORTS
// ============================================

export const extractRequirements = hf.extractRequirements
export const generateResponse = hf.generateResponse
export const checkStatus = hf.checkHFStatus
export const classifyUserIntent = groq.classifyUserIntent // Use Groq for intent (faster!)

/**
 * Get current AI provider info
 */
export function getAIProvider() {
    return {
        provider: 'huggingface',
        isCloud: true,
        isLocal: false,
        cost: 'FREE',
        environment: isVercel ? 'vercel' : 'local'
    }
}
