/**
 * @jest-environment jsdom
 */

import {
    formatIndianPrice,
    formatLakhPrice,
    formatPriceWithLabel,
    getStartingPriceText,
} from '@/lib/price-display-utils'

describe('Price Display Utils', () => {
    describe('formatIndianPrice', () => {
        it('should format price with Indian number system commas', () => {
            const result = formatIndianPrice(850000)

            expect(result).toBe('8,50,000')
        })

        it('should format price under 1 lakh correctly', () => {
            const result = formatIndianPrice(75000)

            expect(result).toBe('75,000')
        })

        it('should round decimal values', () => {
            const result = formatIndianPrice(75432.89)

            expect(result).toBe('75,433')
        })

        it('should handle zero price', () => {
            const result = formatIndianPrice(0)

            expect(result).toBe('0')
        })
    })

    describe('formatLakhPrice', () => {
        it('should format price in lakhs with 2 decimals', () => {
            const result = formatLakhPrice(850000)

            expect(result).toBe('8.50 Lakh')
        })

        it('should handle exact lakh values', () => {
            const result = formatLakhPrice(1000000)

            expect(result).toBe('10.00 Lakh')
        })

        it('should format decimal lakhs correctly', () => {
            const result = formatLakhPrice(1234567)

            expect(result).toBe('12.35 Lakh')
        })
    })

    describe('formatPriceWithLabel', () => {
        it('should format Ex-Showroom price in Indian format', () => {
            const result = formatPriceWithLabel(850000, false, 'indian')

            expect(result.label).toBe('Ex-Showroom')
            expect(result.price).toBe('₹ 8,50,000')
        })

        it('should format On-Road price in Indian format', () => {
            const result = formatPriceWithLabel(950000, true, 'indian')

            expect(result.label).toBe('On-Road')
            expect(result.price).toBe('₹ 9,50,000')
        })

        it('should format price in Lakh format when specified', () => {
            const result = formatPriceWithLabel(850000, false, 'lakh')

            expect(result.label).toBe('Ex-Showroom')
            expect(result.price).toBe('8.50 Lakh')
        })

        it('should default to Indian format', () => {
            const result = formatPriceWithLabel(850000, false)

            expect(result.price).toBe('₹ 8,50,000')
        })
    })

    describe('getStartingPriceText', () => {
        it('should format Ex-Showroom starting price', () => {
            const result = getStartingPriceText(850000, false)

            expect(result).toBe('Ex-Showroom Price ₹ 8.50 Lakh')
        })

        it('should format On-Road starting price', () => {
            const result = getStartingPriceText(950000, true)

            expect(result).toBe('On-Road Price ₹ 9.50 Lakh')
        })
    })
})
