/**
 * @jest-environment jsdom
 */

import {
    generateSlug,
    generateCarModelUrl,
    generateCompareUrl,
    generateBrandUrl,
    generateSearchUrl,
    generateEMIUrl,
    generatePriceBreakupUrl,
    parseCarFromUrl,
    validateCarUrl,
    generateCanonicalUrl,
    generateVariantSlug,
    parseVariantSlug,
    type CarUrlData,
} from '@/utils/carUrlHelpers'

describe('Car URL Helpers', () => {
    describe('generateSlug', () => {
        it('should convert text to lowercase slug', () => {
            expect(generateSlug('Maruti Suzuki')).toBe('maruti-suzuki')
            expect(generateSlug('HYUNDAI CRETA')).toBe('hyundai-creta')
        })

        it('should replace spaces with hyphens', () => {
            expect(generateSlug('Tata Nexon EV')).toBe('tata-nexon-ev')
            expect(generateSlug('Mercedes Benz GLEClass')).toBe('mercedes-benz-gleclass')
        })

        it('should remove special characters', () => {
            expect(generateSlug('BMW X5 (2024)')).toBe('bmw-x5-2024')
            expect(generateSlug('Audi A6 40 TFSI')).toBe('audi-a6-40-tfsi')
            expect(generateSlug('Kia EV6 GT-Line')).toBe('kia-ev6-gt-line')
        })

        it('should handle multiple consecutive spaces/hyphens', () => {
            expect(generateSlug('Honda   City')).toBe('honda-city')
            expect(generateSlug('Maruti--Suzuki')).toBe('maruti-suzuki')
        })

        it('should trim leading and trailing spaces/hyphens', () => {
            expect(generateSlug('  Suzuki Swift  ')).toBe('suzuki-swift')
            expect(generateSlug('-Toyota-')).toBe('toyota')
        })

        it('should handle empty and edge cases', () => {
            expect(generateSlug('')).toBe('')
            expect(generateSlug('   ')).toBe('')
            expect(generateSlug('123')).toBe('123')
        })
    })

    describe('generateCarModelUrl', () => {
        it('should generate correct car model URL', () => {
            const car: CarUrlData = { brand: 'Maruti', model: 'Swift' }
            expect(generateCarModelUrl(car)).toBe('/cars/maruti/swift')
        })

        it('should handle brands and models with spaces', () => {
            const car: CarUrlData = { brand: 'Maruti Suzuki', model: 'Wagon R' }
            expect(generateCarModelUrl(car)).toBe('/cars/maruti-suzuki/wagon-r')
        })

        it('should handle special characters', () => {
            const car: CarUrlData = { brand: 'Kia', model: 'EV6 GT-Line' }
            expect(generateCarModelUrl(car)).toBe('/cars/kia/ev6-gt-line')
        })
    })

    describe('generateCompareUrl', () => {
        it('should generate comparison URL with multiple cars', () => {
            const cars: CarUrlData[] = [
                { brand: 'Maruti', model: 'Swift' },
                { brand: 'Hyundai', model: 'i20' },
            ]
            expect(generateCompareUrl(cars)).toBe('/compare?cars=maruti-swift,hyundai-i20')
        })

        it('should handle three or more cars', () => {
            const cars: CarUrlData[] = [
                { brand: 'Tata', model: 'Nexon' },
                { brand: 'Hyundai', model: 'Venue' },
                { brand: 'Kia', model: 'Sonet' },
            ]
            expect(generateCompareUrl(cars)).toBe('/compare?cars=tata-nexon,hyundai-venue,kia-sonet')
        })

        it('should handle single car', () => {
            const cars: CarUrlData[] = [{ brand: 'Honda', model: 'City' }]
            expect(generateCompareUrl(cars)).toBe('/compare?cars=honda-city')
        })
    })

    describe('generateBrandUrl', () => {
        it('should generate brand page URL', () => {
            expect(generateBrandUrl('Maruti')).toBe('/cars/maruti')
            expect(generateBrandUrl('Hyundai')).toBe('/cars/hyundai')
        })

        it('should handle multi-word brand names', () => {
            expect(generateBrandUrl('Maruti Suzuki')).toBe('/cars/maruti-suzuki')
            expect(generateBrandUrl('Mercedes Benz')).toBe('/cars/mercedes-benz')
        })
    })

    describe('generateSearchUrl', () => {
        it('should generate search URL with query', () => {
            expect(generateSearchUrl('swift')).toBe('/search?q=swift')
            expect(generateSearchUrl('hyundai creta')).toBe('/search?q=hyundai+creta')
        })

        it('should include category if provided', () => {
            expect(generateSearchUrl('swift', 'hatchback')).toBe('/search?q=swift&category=hatchback')
        })

        it('should handle special characters in query', () => {
            expect(generateSearchUrl('car under 10 lakh')).toContain('q=car+under+10+lakh')
        })
    })

    describe('generateEMIUrl', () => {
        it('should generate EMI calculator URL', () => {
            const car: CarUrlData = { brand: 'Maruti', model: 'Swift' }
            expect(generateEMIUrl(car)).toBe('/emi-calculator?car=maruti-swift')
        })

        it('should handle complex car names', () => {
            const car: CarUrlData = { brand: 'Mercedes Benz', model: 'GLE Class' }
            expect(generateEMIUrl(car)).toBe('/emi-calculator?car=mercedes-benz-gle-class')
        })
    })

    describe('generatePriceBreakupUrl', () => {
        it('should generate price breakup URL with default city', () => {
            const car: CarUrlData = { brand: 'Maruti', model: 'Swift' }
            expect(generatePriceBreakupUrl(car)).toBe('/maruti-cars/swift/price-in-mumbai')
        })

        it('should use specified city', () => {
            const car: CarUrlData = { brand: 'Hyundai', model: 'Creta' }
            expect(generatePriceBreakupUrl(car, 'Delhi')).toBe('/hyundai-cars/creta/price-in-delhi')
        })

        it('should handle city names with state', () => {
            const car: CarUrlData = { brand: 'Tata', model: 'Nexon' }
            expect(generatePriceBreakupUrl(car, 'Bangalore, Karnataka')).toBe('/tata-cars/nexon/price-in-bangalore')
        })
    })

    describe('parseCarFromUrl', () => {
        it('should parse car data from URL slugs', () => {
            const result = parseCarFromUrl('maruti-suzuki', 'wagon-r')
            expect(result).toEqual({ brand: 'Maruti Suzuki', model: 'Wagon R' })
        })

        it('should capitalize words properly', () => {
            const result = parseCarFromUrl('honda', 'city')
            expect(result).toEqual({ brand: 'Honda', model: 'City' })
        })

        it('should handle single-word slugs', () => {
            const result = parseCarFromUrl('tata', 'nexon')
            expect(result).toEqual({ brand: 'Tata', model: 'Nexon' })
        })
    })

    describe('validateCarUrl', () => {
        it('should validate matching URLs', () => {
            const car: CarUrlData = { brand: 'Maruti', model: 'Swift' }
            expect(validateCarUrl('maruti', 'swift', car)).toBe(true)
        })

        it('should reject non-matching brand', () => {
            const car: CarUrlData = { brand: 'Maruti', model: 'Swift' }
            expect(validateCarUrl('hyundai', 'swift', car)).toBe(false)
        })

        it('should reject non-matching model', () => {
            const car: CarUrlData = { brand: 'Maruti', model: 'Swift' }
            expect(validateCarUrl('maruti', 'alto', car)).toBe(false)
        })

        it('should handle multi-word names', () => {
            const car: CarUrlData = { brand: 'Maruti Suzuki', model: 'Wagon R' }
            expect(validateCarUrl('maruti-suzuki', 'wagon-r', car)).toBe(true)
        })
    })

    describe('generateCanonicalUrl', () => {
        it('should generate canonical URL with default baseURL', () => {
            const car: CarUrlData = { brand: 'Maruti', model: 'Swift' }
            expect(generateCanonicalUrl(car)).toBe('https://www.gadizone.com/cars/maruti/swift')
        })

        it('should use custom baseURL', () => {
            const car: CarUrlData = { brand: 'Hyundai', model: 'Creta' }
            expect(generateCanonicalUrl(car, 'https://example.com')).toBe('https://example.com/cars/hyundai/creta')
        })
    })

    describe('generateVariantSlug', () => {
        it('should generate variant slug', () => {
            expect(generateVariantSlug('Maruti', 'Swift', 'VXI')).toBe('maruti-swift-vxi')
        })

        it('should handle complex variant names', () => {
            expect(generateVariantSlug('Hyundai', 'Creta', 'SX(O) 1.5 Turbo')).toBe('hyundai-creta-sxo-15-turbo')
        })

        it('should handle multi-word brand and model', () => {
            expect(generateVariantSlug('Maruti Suzuki', 'Wagon R', 'VXI AMT')).toBe('maruti-suzuki-wagon-r-vxi-amt')
        })
    })

    describe('parseVariantSlug', () => {
        it('should parse simple variant slug', () => {
            const result = parseVariantSlug('maruti-swift-vxi')
            expect(result).toEqual({ brand: 'maruti', model: 'swift', variant: 'vxi' })
        })

        it('should handle multi-word variants', () => {
            const result = parseVariantSlug('maruti-swift-vxi-amt')
            expect(result).toEqual({ brand: 'maruti', model: 'swift', variant: 'vxi-amt' })
        })

        it('should handle complex slugs', () => {
            const result = parseVariantSlug('hyundai-creta-sx-o-15-turbo-dct')
            expect(result).toEqual({ brand: 'hyundai', model: 'creta', variant: 'sx-o-15-turbo-dct' })
        })

        it('should handle edge cases', () => {
            expect(parseVariantSlug('brand-model')).toEqual({ brand: 'brand', model: 'model', variant: '' })
            expect(parseVariantSlug('single')).toEqual({ brand: 'single', model: '', variant: '' })
        })
    })
})
