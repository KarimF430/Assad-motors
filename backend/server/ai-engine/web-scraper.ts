/**
 * Web Scraper - Reddit & Forum Intelligence
 * 
 * This module scrapes car reviews and discussions from:
 * - Reddit (r/CarsIndia, r/India)
 * - Team-BHP forums
 * - CarDekho forums
 * 
 * Features:
 * - Real owner experiences
 * - Common issues and problems
 * - Sentiment analysis
 * - Pros and cons extraction
 * - Caching for performance
 */

import axios from 'axios'
import * as cheerio from 'cheerio'


// ============================================
// TYPE DEFINITIONS
// ============================================

interface ScrapedReview {
    source: 'reddit' | 'teambhp' | 'cardekho'
    carModel: string
    author: string
    date: Date
    content: string
    upvotes?: number
    sentiment: 'positive' | 'negative' | 'neutral'
    pros: string[]
    cons: string[]
    commonIssues: string[]
}

export interface CarIntelligence {
    model: string
    totalReviews: number
    averageSentiment: number // -1 to 1
    topPros: string[]
    topCons: string[]
    commonIssues: string[]
    ownerRecommendation: number // 0-100%
    lastUpdated: Date
    imageUrl?: string
}

// ============================================
// REDDIT SCRAPING
// ============================================

/**
 * Scrape Reddit for car discussions
 * Uses Reddit's JSON API (no authentication needed for public posts)
 */
export async function scrapeReddit(carModel: string): Promise<ScrapedReview[]> {
    const reviews: ScrapedReview[] = []

    try {
        // Search r/CarsIndia for the car model
        const searchQuery = encodeURIComponent(`${carModel} review OR experience OR owner`)
        const url = `https://www.reddit.com/r/CarsIndia/search.json?q=${searchQuery}&restrict_sr=1&sort=relevance&limit=25`

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            timeout: 10000
        })

        const posts = response.data.data.children

        for (const post of posts) {
            const data = post.data

            // Skip if no text content
            if (!data.selftext || data.selftext.length < 50) continue

            // Analyze sentiment and extract insights using Ollama
            const analysis = await analyzeReviewWithAI(data.selftext, carModel)

            reviews.push({
                source: 'reddit',
                carModel,
                author: data.author,
                date: new Date(data.created_utc * 1000),
                content: data.selftext,
                upvotes: data.ups,
                sentiment: analysis.sentiment,
                pros: analysis.pros,
                cons: analysis.cons,
                commonIssues: analysis.issues
            })
        }

        console.log(`✅ Scraped ${reviews.length} Reddit reviews for ${carModel}`)
        return reviews
    } catch (error) {
        console.error('Reddit scraping error:', error)
        return []
    }
}

/**
 * Scrape Reddit comments for additional insights
 */
export async function scrapeRedditComments(postId: string): Promise<string[]> {
    try {
        const url = `https://www.reddit.com/comments/${postId}.json`
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        })

        const comments: string[] = []
        const commentData = response.data[1].data.children

        for (const comment of commentData) {
            if (comment.data.body && comment.data.body.length > 20) {
                comments.push(comment.data.body)
            }
        }

        return comments
    } catch (error) {
        console.error('Reddit comments error:', error)
        return []
    }
}

// ============================================
// TEAM-BHP SCRAPING
// ============================================

/**
 * Scrape Team-BHP forum for car reviews
 * Team-BHP has detailed owner reviews and discussions
 */
export async function scrapeTeamBHP(carModel: string): Promise<ScrapedReview[]> {
    const reviews: ScrapedReview[] = []

    try {
        // Search Team-BHP
        const searchQuery = encodeURIComponent(carModel)
        const url = `https://www.team-bhp.com/forum/search.php?searchid=${searchQuery}`

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            timeout: 10000
        })

        const $ = cheerio.load(response.data)

        // Extract review threads
        $('.threadtitle').each((i, elem) => {
            const title = $(elem).text().trim()
            const link = $(elem).attr('href')

            // Only process if it looks like a review
            if (title.toLowerCase().includes('review') ||
                title.toLowerCase().includes('ownership') ||
                title.toLowerCase().includes('experience')) {
                // TODO: Scrape individual thread for full review
                // For now, we'll just collect the links
            }
        })

        console.log(`✅ Found ${reviews.length} Team-BHP reviews for ${carModel}`)
        return reviews
    } catch (error) {
        console.error('Team-BHP scraping error:', error)
        return []
    }
}

// ============================================
// AI-POWERED ANALYSIS
// ============================================

/**
 * Analyze review text using Groq (Llama 3.3)
 * Extracts sentiment, pros, cons, and common issues
 */
async function analyzeReviewWithAI(reviewText: string, carModel: string) {
    const prompt = `Analyze this car review for ${carModel}:

"${reviewText.substring(0, 1500)}"

Extract:
1. Sentiment: positive, negative, or neutral
2. Pros: list of positive points mentioned
3. Cons: list of negative points mentioned
4. Issues: any problems or issues mentioned

Return ONLY valid JSON:
{
  "sentiment": "positive" | "negative" | "neutral",
  "pros": ["pro1", "pro2"],
  "cons": ["con1", "con2"],
  "issues": ["issue1", "issue2"]
}
`

    try {
        const GROQ_API_KEY = process.env.GROQ_API_KEY
        if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY missing')

        const Groq = (await import('groq-sdk')).default
        const groq = new Groq({ apiKey: GROQ_API_KEY })

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a JSON extractor data analyst.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1
        })

        const content = completion.choices[0]?.message?.content
        return content ? JSON.parse(content) : { sentiment: 'neutral', pros: [], cons: [], issues: [] }

    } catch (error) {
        console.error('AI analysis error:', error)
        return {
            sentiment: 'neutral',
            pros: [],
            cons: [],
            issues: []
        }
    }
}



/**
 * Aggregate reviews into car intelligence
 */
export function aggregateReviews(reviews: ScrapedReview[]): CarIntelligence {
    if (reviews.length === 0) {
        return {
            model: '',
            totalReviews: 0,
            averageSentiment: 0,
            topPros: [],
            topCons: [],
            commonIssues: [],
            ownerRecommendation: 0,
            lastUpdated: new Date()
        }
    }

    // Count sentiment
    const sentimentScores = reviews.map(r => {
        if (r.sentiment === 'positive') return 1
        if (r.sentiment === 'negative') return -1
        return 0
    })
    const avgSentiment = sentimentScores.reduce((a, b) => a + b, 0 as number) / sentimentScores.length

    // Aggregate pros
    const prosCount: { [key: string]: number } = {}
    reviews.forEach(r => {
        r.pros.forEach(pro => {
            prosCount[pro] = (prosCount[pro] || 0) + 1
        })
    })
    const topPros = Object.entries(prosCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([pro]) => pro)

    // Aggregate cons
    const consCount: { [key: string]: number } = {}
    reviews.forEach(r => {
        r.cons.forEach(con => {
            consCount[con] = (consCount[con] || 0) + 1
        })
    })
    const topCons = Object.entries(consCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([con]) => con)

    // Aggregate issues
    const issuesCount: { [key: string]: number } = {}
    reviews.forEach(r => {
        r.commonIssues.forEach(issue => {
            issuesCount[issue] = (issuesCount[issue] || 0) + 1
        })
    })
    const commonIssues = Object.entries(issuesCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([issue]) => issue)

    // Calculate recommendation score (0-100)
    const ownerRecommendation = Math.round(((avgSentiment + 1) / 2) * 100)

    return {
        model: reviews[0].carModel,
        totalReviews: reviews.length,
        averageSentiment: avgSentiment,
        topPros,
        topCons,
        commonIssues,
        ownerRecommendation,
        lastUpdated: new Date()
    }
}

// ============================================
// CACHING
// ============================================

/**
 * Cache scraped data to avoid repeated requests
 * In production, use Redis or MongoDB
 */
const cache: { [key: string]: { data: CarIntelligence, timestamp: number } } = {}
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function getCachedIntelligence(carModel: string): CarIntelligence | null {
    const cached = cache[carModel]
    if (!cached) return null

    const age = Date.now() - cached.timestamp
    if (age > CACHE_DURATION) {
        delete cache[carModel]
        return null
    }

    return cached.data
}

export function setCachedIntelligence(carModel: string, data: CarIntelligence) {
    cache[carModel] = {
        data,
        timestamp: Date.now()
    }
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Get car intelligence from web sources
 * Checks cache first, then scrapes if needed
 */
export async function getCarIntelligence(carModel: string): Promise<CarIntelligence> {
    // Check cache first
    const cached = getCachedIntelligence(carModel)
    if (cached) {
        console.log(`✅ Using cached intelligence for ${carModel}`)
        return cached
    }

    console.log(`🕷️ Scraping web for ${carModel}...`)

    // Scrape from multiple sources
    const [redditReviews, teamBHPReviews] = await Promise.all([
        scrapeReddit(carModel),
        scrapeTeamBHP(carModel)
    ])

    // Combine all reviews
    const allReviews = [...redditReviews, ...teamBHPReviews]

    // Aggregate into intelligence
    const intelligence = aggregateReviews(allReviews)

    // Cache the result
    setCachedIntelligence(carModel, intelligence)

    console.log(`✅ Intelligence gathered: ${intelligence.totalReviews} reviews, ${intelligence.ownerRecommendation}% recommendation`)

    return intelligence
}
