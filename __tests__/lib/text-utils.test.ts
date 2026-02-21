/**
 * @jest-environment jsdom
 */

import { truncateText, truncateCarName } from '@/lib/text-utils'

describe('Text Utils', () => {
    describe('truncateText', () => {
        it('should return original text if shorter than max length', () => {
            const text = 'Short text'
            const result = truncateText(text, 20)

            expect(result).toBe('Short text')
        })

        it('should truncate text and add ellipsis if longer than max length', () => {
            const text = 'This is a very long text that needs truncation'
            const result = truncateText(text, 18)

            expect(result).toBe('This is a very lon...')
            expect(result.length).toBe(21) // 18 chars + '...'
        })

        it('should use default max length of 18 if not specified', () => {
            const text = 'This is a very long text'
            const result = truncateText(text)

            expect(result).toBe('This is a very lon...')
        })

        it('should handle empty string', () => {
            const result = truncateText('')

            expect(result).toBe('')
        })

        it('should handle text exactly at max length', () => {
            const text = 'Exactly 18 chars!!'
            const result = truncateText(text, 18)

            expect(result).toBe('Exactly 18 chars!!')
        })
    })

    describe('truncateCarName', () => {
        it('should combine brand and model names', () => {
            const result = truncateCarName('Maruti', 'Swift')

            expect(result).toBe('Maruti Swift')
        })

        it('should truncate combined name if too long', () => {
            const result = truncateCarName('Mercedes-Benz', 'GLE-Class Coupe', 18)

            expect(result).toBe('Mercedes-Benz GLE-...')
        })

        it('should use default max length of 18', () => {
            const result = truncateCarName('Hyundai', 'Creta Knight Edition')

            expect(result).toBe('Hyundai Creta Knig...')
        })

        it('should handle short brand and model names', () => {
            const result = truncateCarName('Tata', 'Nexon')

            expect(result).toBe('Tata Nexon')
        })
    })
})
