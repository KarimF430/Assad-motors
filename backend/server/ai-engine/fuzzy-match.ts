/**
 * Fuzzy Matching Utilities
 * 
 * Handles typos and variations in car name matching.
 * E.g., "creat" → "creta", "nexn" → "nexon"
 */

// ============================================
// LEVENSHTEIN DISTANCE
// ============================================

/**
 * Calculate Levenshtein distance between two strings
 * Lower distance = more similar
 */
export function levenshtein(a: string, b: string): number {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    const matrix: number[][] = []

    // Initialize first column
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i]
    }

    // Initialize first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1]
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                )
            }
        }
    }

    return matrix[b.length][a.length]
}

// ============================================
// FUZZY CAR MATCHING
// ============================================

interface FuzzyMatch {
    car: string
    distance: number
    similarity: number
}

/**
 * Find best car name matches from user query
 * Handles typos like "creat" → "creta"
 */
export function findBestCarMatches(
    query: string,
    carNames: string[],
    maxDistance = 2
): FuzzyMatch[] {
    const queryWords = query.toLowerCase().split(/\s+/)
    const matches: FuzzyMatch[] = []

    for (const car of carNames) {
        const carLower = car.toLowerCase()

        // 1. Check exact substring match
        if (query.toLowerCase().includes(carLower)) {
            matches.push({
                car,
                distance: 0,
                similarity: 1.0
            })
            continue
        }

        // 2. Check each word for fuzzy match
        for (const word of queryWords) {
            if (word.length < 3) continue

            const distance = levenshtein(word, carLower)

            // Only accept if distance is within threshold
            // Threshold scales with word length
            const threshold = Math.min(maxDistance, Math.floor(word.length / 3))

            if (distance <= threshold) {
                const similarity = 1 - (distance / Math.max(word.length, carLower.length))
                matches.push({
                    car,
                    distance,
                    similarity
                })
                break
            }
        }
    }

    // Sort by distance (ascending), then by similarity (descending)
    return matches.sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance
        return b.similarity - a.similarity
    })
}

/**
 * Extract car names from query using fuzzy matching
 */
export function fuzzyExtractCarNames(
    query: string,
    carNames: string[],
    maxResults = 5
): string[] {
    const matches = findBestCarMatches(query, carNames)
    return matches.slice(0, maxResults).map(m => m.car)
}

// ============================================
// COMMON CAR NAME ALIASES
// ============================================

/**
 * Map of common aliases/misspellings to correct car names
 */
export const CAR_ALIASES: Record<string, string> = {
    // Common typos
    'creat': 'creta',
    'creata': 'creta',
    'nexn': 'nexon',
    'nexoon': 'nexon',
    'selto': 'seltos',
    'brezz': 'brezza',
    'briza': 'brezza',
    'swft': 'swift',
    'balenoo': 'baleno',

    // Informal names
    'xv700': 'xuv700',
    'xv400': 'xuv400',
    'fortunner': 'fortuner',
    'inoova': 'innova',

    // Brand shortcuts
    'tata': 'tata',
    'maruti': 'maruti',
    'suzuki': 'maruti',
    'honda': 'honda',
    'hyundai': 'hyundai',
    'hundai': 'hyundai',
    'hundayi': 'hyundai',
    'mahindra': 'mahindra',
    'mahendra': 'mahindra',
    'kiya': 'kia',

    // Model shortcuts
    'safari fa': 'safari',
    'harrier ev': 'harrier',
    'punch ev': 'punch',
    'tiago ev': 'tiago',
    'grand vitara': 'grand vitara',
    'urban cruiser': 'urban cruiser hyryder'
}

/**
 * Resolve car name using aliases
 */
export function resolveCarAlias(name: string): string {
    const lower = name.toLowerCase().trim()
    return CAR_ALIASES[lower] || name
}

/**
 * Extract and resolve car names from query
 */
export function extractAndResolveCarNames(query: string): string[] {
    const lower = query.toLowerCase()
    const resolved: string[] = []

    for (const [alias, carName] of Object.entries(CAR_ALIASES)) {
        if (lower.includes(alias)) {
            resolved.push(carName)
        }
    }

    return [...new Set(resolved)]
}
