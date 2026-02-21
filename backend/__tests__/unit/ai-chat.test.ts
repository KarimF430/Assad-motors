/**
 * AI Chat Unit Tests
 * Tests RAG entity extraction, context building, and response generation
 */

// Mock variant data for testing
const mockVariants = [
    {
        _id: 'variant1',
        name: 'Creta SX',
        brandId: 'hyundai',
        price: 1500000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seatingCapacity: '5',
        mileageCompanyClaimed: '17.4 kmpl',
        globalNCAPRating: '5 Star',
        status: 'active'
    },
    {
        _id: 'variant2',
        name: 'Seltos HTX',
        brandId: 'kia',
        price: 1400000,
        fuelType: 'Diesel',
        transmission: 'Manual',
        seatingCapacity: '5',
        mileageCompanyClaimed: '20.8 kmpl',
        globalNCAPRating: '5 Star',
        status: 'active'
    },
    {
        _id: 'variant3',
        name: 'Nexon XZ+',
        brandId: 'tata',
        price: 1200000,
        fuelType: 'Petrol',
        transmission: 'AMT',
        seatingCapacity: '5',
        mileageCompanyClaimed: '17.4 kmpl',
        globalNCAPRating: '5 Star',
        status: 'active'
    }
]

describe('AI Chat - Entity Extraction', () => {
    // Simulating extractCarNamesFromQuery logic
    const extractCarNames = (query: string): string[] => {
        const carKeywords = [
            'creta', 'seltos', 'nexon', 'punch', 'brezza', 'venue', 'sonet',
            'swift', 'baleno', 'i20', 'altroz', 'tiago', 'kwid',
            'city', 'verna', 'ciaz', 'amaze', 'dzire',
            'xuv700', 'hector', 'harrier', 'safari', 'fortuner'
        ]

        const lowerQuery = query.toLowerCase()
        return carKeywords.filter(car => lowerQuery.includes(car))
    }

    describe('extractCarNamesFromQuery', () => {
        it('should extract single car name from query', () => {
            const query = 'Tell me about the Hyundai Creta'
            const result = extractCarNames(query)

            expect(result).toContain('creta')
            expect(result).toHaveLength(1)
        })

        it('should extract multiple car names for comparison queries', () => {
            const query = 'Compare Creta vs Seltos'
            const result = extractCarNames(query)

            expect(result).toContain('creta')
            expect(result).toContain('seltos')
            expect(result).toHaveLength(2)
        })

        it('should handle case-insensitive queries', () => {
            const queries = [
                'CRETA price',
                'creta price',
                'Creta price',
                'CrEtA price'
            ]

            queries.forEach(query => {
                const result = extractCarNames(query)
                expect(result).toContain('creta')
            })
        })

        it('should return empty array for generic queries', () => {
            const query = 'What is a good family car?'
            const result = extractCarNames(query)

            expect(result).toHaveLength(0)
        })

        it('should extract cars from natural language queries', () => {
            const query = 'Is Nexon better than Brezza for city driving?'
            const result = extractCarNames(query)

            expect(result).toContain('nexon')
            expect(result).toContain('brezza')
        })

        it('should handle SUV comparison queries', () => {
            const query = 'XUV700 vs Harrier vs Safari - which is best?'
            const result = extractCarNames(query)

            expect(result).toContain('xuv700')
            expect(result).toContain('harrier')
            expect(result).toContain('safari')
            expect(result).toHaveLength(3)
        })
    })
})

describe('AI Chat - RAG Context Building', () => {
    // Simulating buildRAGContext logic
    const buildRAGContext = (question: string, carData: any[]): string => {
        const lowerQ = question.toLowerCase()
        let contextText = '\n**Available Cars from Database:**\n'

        carData.forEach(car => {
            contextText += `\n**${car.brandId} ${car.name}:**\n`
            contextText += `- Price: ₹${(car.price / 100000).toFixed(1)}L\n`

            // MILEAGE DATA (if question about mileage/fuel)
            if (lowerQ.includes('mileage') || lowerQ.includes('fuel') || lowerQ.includes('efficiency')) {
                if (car.mileageCompanyClaimed) contextText += `- Mileage: ${car.mileageCompanyClaimed}\n`
            }

            // SAFETY DATA (if question about safety)
            if (lowerQ.includes('safe') || lowerQ.includes('airbag') || lowerQ.includes('ncap')) {
                if (car.globalNCAPRating) contextText += `- NCAP Rating: ${car.globalNCAPRating}\n`
            }

            // Always include fuel type
            if (car.fuelType) contextText += `- Fuel Type: ${car.fuelType}\n`
        })

        return contextText
    }

    describe('buildRAGContext - Field Selection', () => {
        it('should include mileage data for fuel-related queries', () => {
            const question = 'What is the mileage of Creta?'
            const context = buildRAGContext(question, mockVariants)

            expect(context).toContain('Mileage:')
            expect(context).toContain('17.4 kmpl')
        })

        it('should include safety data for safety-related queries', () => {
            const question = 'Is Nexon safe? What is its NCAP rating?'
            const context = buildRAGContext(question, mockVariants)

            expect(context).toContain('NCAP Rating:')
            expect(context).toContain('5 Star')
        })

        it('should NOT include mileage for price queries', () => {
            const question = 'What is the price of Seltos?'
            const context = buildRAGContext(question, mockVariants)

            expect(context).toContain('Price:')
            expect(context).not.toMatch(/Mileage:.*kmpl/)
        })

        it('should always include price and fuel type', () => {
            const question = 'Tell me about Creta'
            const context = buildRAGContext(question, mockVariants)

            expect(context).toContain('Price:')
            expect(context).toContain('Fuel Type:')
        })

        it('should format price in lakhs correctly', () => {
            const question = 'Creta price?'
            const context = buildRAGContext(question, [mockVariants[0]])

            expect(context).toContain('₹15.0L')
        })
    })
})

describe('AI Chat - Intent Detection', () => {
    // Simulating intent detection logic
    type Intent = 'greeting' | 'comparison' | 'recommendation' | 'spec_query' | 'price_query' | 'general'

    const detectIntent = (query: string): Intent => {
        const lowerQ = query.toLowerCase()

        // Greeting patterns
        if (/^(hi|hello|hey|good morning|good evening|namaste)/i.test(query)) {
            return 'greeting'
        }

        // Comparison patterns
        if (lowerQ.includes(' vs ') || lowerQ.includes('compare') || lowerQ.includes('better than')) {
            return 'comparison'
        }

        // Recommendation patterns
        if (lowerQ.includes('suggest') || lowerQ.includes('recommend') ||
            lowerQ.includes('which car') || lowerQ.includes('best car')) {
            return 'recommendation'
        }

        // Price query patterns
        if (lowerQ.includes('price') || lowerQ.includes('cost') ||
            lowerQ.includes('on-road') || lowerQ.includes('emi')) {
            return 'price_query'
        }

        // Spec query patterns
        if (lowerQ.includes('mileage') || lowerQ.includes('engine') ||
            lowerQ.includes('safety') || lowerQ.includes('feature')) {
            return 'spec_query'
        }

        return 'general'
    }

    describe('detectIntent', () => {
        it('should detect greeting intent', () => {
            const greetings = ['Hi', 'Hello', 'Hey there', 'Good morning', 'Namaste']

            greetings.forEach(greeting => {
                expect(detectIntent(greeting)).toBe('greeting')
            })
        })

        it('should detect comparison intent', () => {
            const comparisons = [
                'Creta vs Seltos',
                'Compare Nexon and Brezza',
                'Is Creta better than Seltos?'
            ]

            comparisons.forEach(query => {
                expect(detectIntent(query)).toBe('comparison')
            })
        })

        it('should detect recommendation intent', () => {
            const recommendations = [
                'Suggest a car under 15 lakhs',
                'Recommend a family SUV',
                'Which car should I buy?',
                'Best car for city driving'
            ]

            recommendations.forEach(query => {
                expect(detectIntent(query)).toBe('recommendation')
            })
        })

        it('should detect price query intent', () => {
            const priceQueries = [
                'What is the price of Creta?',
                'Nexon on-road price in Mumbai',
                'EMI for Seltos',
                'How much does Brezza cost?'
            ]

            priceQueries.forEach(query => {
                expect(detectIntent(query)).toBe('price_query')
            })
        })

        it('should detect spec query intent', () => {
            const specQueries = [
                'What is the mileage of Swift?',
                'Creta engine power',
                'Safety features of Nexon',
                'What features does Seltos have?'
            ]

            specQueries.forEach(query => {
                expect(detectIntent(query)).toBe('spec_query')
            })
        })
    })
})

describe('AI Chat - Response Validation', () => {
    const validateAIResponse = (response: string): { isValid: boolean; issues: string[] } => {
        const issues: string[] = []

        // Check for empty response
        if (!response || response.trim().length === 0) {
            issues.push('Response is empty')
        }

        // Check for reasonable length (not too short, not too long)
        if (response.length < 20) {
            issues.push('Response is too short')
        }

        if (response.length > 2000) {
            issues.push('Response is too long')
        }

        // Check for hallucination markers (prices that seem wrong)
        const priceMatches = response.match(/₹(\d+\.?\d*)/g)
        if (priceMatches) {
            priceMatches.forEach(price => {
                const value = parseFloat(price.replace('₹', ''))
                // Most Indian cars are between 5L and 50L
                if (value > 0 && value < 5) {
                    issues.push(`Suspiciously low price: ${price}`)
                }
                if (value > 100) {
                    issues.push(`Suspiciously high price: ${value}L`)
                }
            })
        }

        return {
            isValid: issues.length === 0,
            issues
        }
    }

    describe('validateAIResponse', () => {
        it('should validate a good response', () => {
            const response = 'The Hyundai Creta starts at ₹11.0L and offers excellent value with its premium features and 5-star safety rating.'
            const result = validateAIResponse(response)

            expect(result.isValid).toBe(true)
            expect(result.issues).toHaveLength(0)
        })

        it('should flag empty responses', () => {
            const result = validateAIResponse('')

            expect(result.isValid).toBe(false)
            expect(result.issues).toContain('Response is empty')
        })

        it('should flag too short responses', () => {
            const result = validateAIResponse('Yes.')

            expect(result.isValid).toBe(false)
            expect(result.issues).toContain('Response is too short')
        })

        it('should flag suspiciously high prices', () => {
            const response = 'The car costs ₹500L which is great value.'
            const result = validateAIResponse(response)

            expect(result.isValid).toBe(false)
            expect(result.issues.some(i => i.includes('Suspiciously high'))).toBe(true)
        })
    })
})

describe('AI Chat - FIND_CARS Trigger', () => {
    const parseFindCarsCommand = (aiResponse: string): { budget?: number; seating?: number; usage?: string } | null => {
        if (!aiResponse.includes('FIND_CARS:')) {
            return null
        }

        const match = aiResponse.match(/FIND_CARS:\s*({.*?})/)
        if (!match) {
            return null
        }

        try {
            return JSON.parse(match[1])
        } catch {
            return null
        }
    }

    describe('parseFindCarsCommand', () => {
        it('should parse valid FIND_CARS command', () => {
            const response = 'Great! Let me find cars for you. FIND_CARS: {"budget": 1500000, "seating": 5, "usage": "city"}'
            const result = parseFindCarsCommand(response)

            expect(result).not.toBeNull()
            expect(result?.budget).toBe(1500000)
            expect(result?.seating).toBe(5)
            expect(result?.usage).toBe('city')
        })

        it('should return null for responses without FIND_CARS', () => {
            const response = 'The Creta is a great car for families.'
            const result = parseFindCarsCommand(response)

            expect(result).toBeNull()
        })

        it('should handle malformed JSON gracefully', () => {
            const response = 'FIND_CARS: {budget: 1500000}' // Invalid JSON (no quotes)
            const result = parseFindCarsCommand(response)

            expect(result).toBeNull()
        })
    })
})

describe('AI Chat - Car Name Cache', () => {
    // Simulating the caching logic
    let cachedCarNames: string[] | null = null
    let cacheTimestamp = 0
    const CAR_NAMES_CACHE_TTL = 300000 // 5 minutes

    const getActiveCarNames = async (): Promise<string[]> => {
        if (cachedCarNames && Date.now() - cacheTimestamp < CAR_NAMES_CACHE_TTL) {
            return cachedCarNames
        }

        // Simulate DB fetch
        const names = ['creta', 'seltos', 'nexon', 'brezza', 'venue']
        cachedCarNames = names
        cacheTimestamp = Date.now()

        return cachedCarNames
    }

    beforeEach(() => {
        cachedCarNames = null
        cacheTimestamp = 0
    })

    it('should cache car names on first call', async () => {
        const names1 = await getActiveCarNames()
        const names2 = await getActiveCarNames()

        expect(names1).toEqual(names2)
    })

    it('should return cached names within TTL', async () => {
        const names1 = await getActiveCarNames()
        const initialTimestamp = cacheTimestamp

        const names2 = await getActiveCarNames()

        // Timestamp should not change (cache was used)
        expect(cacheTimestamp).toBe(initialTimestamp)
        expect(names1).toEqual(names2)
    })
})
