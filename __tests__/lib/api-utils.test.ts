/**
 * @jest-environment jsdom
 */

describe('API Utility Functions', () => {
    let formatPrice: any
    let formatMileage: any
    let getImageUrl: any
    let handleApiError: any

    beforeEach(() => {
        jest.resetModules()
        process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000'

        // Re-import modules after setting env var
        const apiModule = require('@/lib/api')
        formatPrice = apiModule.formatPrice
        formatMileage = apiModule.formatMileage
        getImageUrl = apiModule.getImageUrl
        handleApiError = apiModule.handleApiError
    })

    afterEach(() => {
        delete process.env.NEXT_PUBLIC_API_URL
    })

    describe('formatPrice', () => {
        it('should format prices in Crores for values >= 10 million', () => {
            expect(formatPrice(10000000)).toBe('₹1.0 Cr')
            expect(formatPrice(25000000)).toBe('₹2.5 Cr')
            expect(formatPrice(50000000)).toBe('₹5.0 Cr')
        })

        it('should format prices in Lakhs for values >= 100k but < 10 million', () => {
            expect(formatPrice(100000)).toBe('₹1.0 L')
            expect(formatPrice(750000)).toBe('₹7.5 L')
            expect(formatPrice(1500000)).toBe('₹15.0 L')
            expect(formatPrice(9999999)).toBe('₹100.0 L')
        })

        it('should format prices below 1 lakh with commas', () => {
            expect(formatPrice(50000)).toBe('₹50,000')
            expect(formatPrice(99999)).toBe('₹99,999')
            expect(formatPrice(1000)).toBe('₹1,000')
        })

        it('should handle edge cases', () => {
            expect(formatPrice(0)).toBe('₹0')
            expect(formatPrice(99999)).toBe('₹99,999')
            expect(formatPrice(100000)).toBe('₹1.0 L')
            expect(formatPrice(9999999)).toBe('₹100.0 L')
            expect(formatPrice(10000000)).toBe('₹1.0 Cr')
        })

        it('should round to 1 decimal place', () => {
            expect(formatPrice(123456)).toBe('₹1.2 L')
            expect(formatPrice(12345678)).toBe('₹1.2 Cr')
        })
    })

    describe('formatMileage', () => {
        it('should format mileage with kmpl unit', () => {
            expect(formatMileage(15)).toBe('15 kmpl')
            expect(formatMileage(20.5)).toBe('20.5 kmpl')
            expect(formatMileage(25.75)).toBe('25.75 kmpl')
        })

        it('should handle undefined mileage', () => {
            expect(formatMileage(undefined)).toBe('N/A')
            expect(formatMileage(0)).toBe('N/A')
        })

        it('should handle decimal values', () => {
            expect(formatMileage(18.5)).toBe('18.5 kmpl')
            expect(formatMileage(22.123)).toBe('22.123 kmpl')
        })
    })

    describe('getImageUrl', () => {
        it('should return placeholder for undefined image', () => {
            expect(getImageUrl(undefined)).toBe('/api/placeholder/400/300')
            expect(getImageUrl('')).toBe('/api/placeholder/400/300')
        })

        it('should return full URL for http images', () => {
            expect(getImageUrl('http://example.com/image.jpg')).toBe('http://example.com/image.jpg')
            expect(getImageUrl('https://cdn.example.com/car.png')).toBe('https://cdn.example.com/car.png')
        })

        it('should prepend API base URL for relative paths', () => {
            expect(getImageUrl('/uploads/car.jpg')).toBe('http://localhost:5000/uploads/car.jpg')
            expect(getImageUrl('images/logo.png')).toBe('http://localhost:5000images/logo.png')
        })

        it('should handle different path formats', () => {
            expect(getImageUrl('/uploads/brands/maruti.png')).toBe('http://localhost:5000/uploads/brands/maruti.png')
            expect(getImageUrl('uploads/models/swift.jpg')).toBe('http://localhost:5000uploads/models/swift.jpg')
        })
    })

    describe('handleApiError', () => {
        it('should extract message from response.data.message', () => {
            const error = {
                response: {
                    data: {
                        message: 'Invalid credentials'
                    }
                }
            }
            expect(handleApiError(error)).toBe('Invalid credentials')
        })

        it('should extract message from error.message', () => {
            const error = new Error('Network error')
            expect(handleApiError(error)).toBe('Network error')
        })

        it('should return default message for unknown errors', () => {
            expect(handleApiError({})).toBe('An unexpected error occurred')
            expect(handleApiError(null)).toBe('An unexpected error occurred')
            expect(handleApiError(undefined)).toBe('An unexpected error occurred')
        })

        it('should handle string errors', () => {
            expect(handleApiError('Something went wrong')).toBe('An unexpected error occurred')
        })

        it('should prioritize response.data.message over error.message', () => {
            const error = {
                message: 'Generic error',
                response: {
                    data: {
                        message: 'Specific API error'
                    }
                }
            }
            expect(handleApiError(error)).toBe('Specific API error')
        })
    })
})
