/**
 * @jest-environment jsdom
 */

import { formatPrice, formatPriceRange } from '@/utils/priceFormatter'

describe('Price Formatter Utils', () => {
    describe('formatPrice', () => {
        it('should format prices under 100 lakhs in Lakhs', () => {
            expect(formatPrice(7.5)).toBe('₹ 7.50 Lakh')
            expect(formatPrice(12.99)).toBe('₹ 12.99 Lakh')
            expect(formatPrice(99.99)).toBe('₹ 99.99 Lakh')
        })

        it('should format prices 100 lakhs and above in Crores', () => {
            expect(formatPrice(100)).toBe('₹ 1.00 Crore')
            expect(formatPrice(150)).toBe('₹ 1.50 Crore')
            expect(formatPrice(250.5)).toBe('₹ 2.50 Crore')
        })

        it('should handle edge case at 100 lakhs boundary', () => {
            expect(formatPrice(99.99)).toBe('₹ 99.99 Lakh')
            expect(formatPrice(100.00)).toBe('₹ 1.00 Crore')
            expect(formatPrice(100.01)).toBe('₹ 1.00 Crore')
        })

        it('should handle very small and very large values', () => {
            expect(formatPrice(0.5)).toBe('₹ 0.50 Lakh')
            expect(formatPrice(0)).toBe('₹ 0.00 Lakh')
            expect(formatPrice(1000)).toBe('₹ 10.00 Crore')
        })

        it('should format with exactly 2 decimal places', () => {
            expect(formatPrice(7.123)).toBe('₹ 7.12 Lakh')
            expect(formatPrice(7.567)).toBe('₹ 7.57 Lakh')
            expect(formatPrice(100.456)).toBe('₹ 1.00 Crore')
        })
    })

    describe('formatPriceRange', () => {
        it('should format range when both prices in Lakhs', () => {
            expect(formatPriceRange(7.4, 12.5)).toBe('₹ 7.40 - 12.50 Lakh')
            expect(formatPriceRange(10, 99)).toBe('₹ 10.00 - 99.00 Lakh')
        })

        it('should format range when both prices in Crores', () => {
            expect(formatPriceRange(100, 150)).toBe('₹ 1.00 - 1.50 Crore')
            expect(formatPriceRange(250, 300)).toBe('₹ 2.50 - 3.00 Crore')
        })

        it('should format range with different units separately', () => {
            expect(formatPriceRange(50, 150)).toBe('₹ 50.00 Lakh - ₹ 1.50 Crore')
            expect(formatPriceRange(99.99, 100.01)).toBe('₹ 99.99 Lakh - ₹ 1.00 Crore')
        })

        it('should handle equal start and end prices', () => {
            expect(formatPriceRange(10, 10)).toBe('₹ 10.00 - 10.00 Lakh')
            expect(formatPriceRange(100, 100)).toBe('₹ 1.00 - 1.00 Crore')
        })

        it('should handle edge cases at boundaries', () => {
            expect(formatPriceRange(99.99, 99.99)).toBe('₹ 99.99 - 99.99 Lakh')
            expect(formatPriceRange(100, 100)).toBe('₹ 1.00 - 1.00 Crore')
        })
    })
})
