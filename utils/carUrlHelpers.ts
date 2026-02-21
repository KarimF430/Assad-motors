// Utility functions for generating consistent car model page URLs

export interface CarUrlData {
  brand: string
  model: string
  id?: number
}

/**
 * Generate URL-friendly slug from text
 * Converts text to lowercase, replaces spaces with hyphens, removes special characters
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove special characters except hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
}

/**
 * Generate car model page URL
 * Format: /cars/[brand-slug]/[model-slug]
 */
export const generateCarModelUrl = (car: CarUrlData): string => {
  const brandSlug = generateSlug(car.brand)
  const modelSlug = generateSlug(car.model)
  return `/cars/${brandSlug}/${modelSlug}`
}

/**
 * Generate car comparison URL with multiple cars
 * Format: /compare?cars=brand1-model1,brand2-model2
 */
export const generateCompareUrl = (cars: CarUrlData[]): string => {
  const carSlugs = cars.map(car => `${generateSlug(car.brand)}-${generateSlug(car.model)}`)
  return `/compare?cars=${carSlugs.join(',')}`
}

/**
 * Generate car brand page URL
 * Format: /cars/[brand-slug]
 */
export const generateBrandUrl = (brand: string): string => {
  const brandSlug = generateSlug(brand)
  return `/cars/${brandSlug}`
}

/**
 * Generate search results URL with query
 * Format: /search?q=[query]&category=[category]
 */
export const generateSearchUrl = (query: string, category?: string): string => {
  const params = new URLSearchParams()
  params.set('q', query)
  if (category) {
    params.set('category', category)
  }
  return `/search?${params.toString()}`
}

/**
 * Generate EMI calculator URL for specific car
 * Format: /emi-calculator?car=[brand-model]
 */
export const generateEMIUrl = (car: CarUrlData): string => {
  const carSlug = `${generateSlug(car.brand)}-${generateSlug(car.model)}`
  return `/emi-calculator?car=${carSlug}`
}

/**
 * Generate price breakup URL for specific car and city
 * Format: /[brand]-cars/[model]/price-in-[city]
 */
export const generatePriceBreakupUrl = (car: CarUrlData, city?: string): string => {
  const brandSlug = generateSlug(car.brand)
  const modelSlug = generateSlug(car.model)
  const citySlug = city ? generateSlug(city.split(',')[0]) : 'mumbai' // Extract city name before comma

  return `/${brandSlug}-cars/${modelSlug}/price-in-${citySlug}`
}

/**
 * Parse car data from URL params
 * Reverse operation of generateCarModelUrl
 */
export const parseCarFromUrl = (brandSlug: string, modelSlug: string): { brand: string; model: string } => {
  // Convert slug back to readable format
  const brand = brandSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const model = modelSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return { brand, model }
}

/**
 * Validate if URL params match expected car data
 */
export const validateCarUrl = (brandSlug: string, modelSlug: string, expectedCar: CarUrlData): boolean => {
  const expectedBrandSlug = generateSlug(expectedCar.brand)
  const expectedModelSlug = generateSlug(expectedCar.model)

  return brandSlug === expectedBrandSlug && modelSlug === expectedModelSlug
}

/**
 * Generate canonical URL for SEO
 */
export const generateCanonicalUrl = (car: CarUrlData, baseUrl: string = 'https://www.gadizone.com'): string => {
  const modelUrl = generateCarModelUrl(car)
  return `${baseUrl}${modelUrl}`
}

/**
 * Generate structured data for car model page
 */
export const generateCarStructuredData = (car: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": car.fullName,
    "brand": {
      "@type": "Brand",
      "name": car.brand
    },
    "model": car.model,
    "url": generateCanonicalUrl(car),
    "image": car.image,
    "offers": {
      "@type": "Offer",
      "price": car.startingPrice,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": car.rating,
      "reviewCount": car.reviewCount
    }
  }
}

/**
 * Generate SEO-friendly variant slug
 * Format: brand-model-variant-name (all lowercase, hyphenated)
 */
export const generateVariantSlug = (brand: string, model: string, variant: string): string => {
  return `${generateSlug(brand)}-${generateSlug(model)}-${generateSlug(variant)}`
}

/**
 * Parse SEO variant slug back to brand, model, and variant
 * Assumes first two segments are brand and model; remaining joined as variant
 */
export const parseVariantSlug = (slug: string): { brand: string; model: string; variant: string } => {
  const parts = slug.split('-')
  const brand = parts[0] || ''
  const model = parts[1] || ''
  const variant = parts.slice(2).join('-')
  return { brand, model, variant }
}
