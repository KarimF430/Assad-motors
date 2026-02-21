import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import PriceBreakupPage from '@/components/price-breakup/PriceBreakupPage'
import { FloatingAIBot } from '@/components/FloatingAIBot'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

interface PriceInCityPageProps {
  params: Promise<{
    'brand-cars': string
    model: string
    city: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper to convert slug to display name
const toDisplayName = (slug: string) =>
  slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

// City mapping for display
const cityMap: { [key: string]: string } = {
  'mumbai': 'Mumbai, Maharashtra',
  'delhi': 'Delhi, NCR',
  'bangalore': 'Bangalore, Karnataka',
  'bengaluru': 'Bangalore, Karnataka',
  'chennai': 'Chennai, Tamil Nadu',
  'hyderabad': 'Hyderabad, Telangana',
  'pune': 'Pune, Maharashtra',
  'kolkata': 'Kolkata, West Bengal',
  'ahmedabad': 'Ahmedabad, Gujarat',
  'jaipur': 'Jaipur, Rajasthan',
  'gulbarga': 'Gulbarga, Karnataka',
  'lucknow': 'Lucknow, Uttar Pradesh',
  'chandigarh': 'Chandigarh, Punjab',
  'kochi': 'Kochi, Kerala',
  'indore': 'Indore, Madhya Pradesh'
}

// Generate dynamic metadata for SEO
// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PriceInCityPageProps): Promise<Metadata> {
  const resolvedParams = await params

  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const citySlug = resolvedParams.city

  const brandName = toDisplayName(brandSlug)
  const modelName = toDisplayName(modelSlug)
  const cityName = cityMap[citySlug.toLowerCase()]?.split(',')[0] || toDisplayName(citySlug)

  const title = `${brandName} ${modelName} Price in ${cityName} - On-Road Price, EMI, Variants | gadizone`
  const description = `Get ${brandName} ${modelName} on-road price in ${cityName}. Check detailed price breakup including ex-showroom price, RTO, insurance, and calculate EMI. Compare variants and get the best deals.`

  // Fetch model image for OpenGraph
  let modelImage = 'https://www.gadizone.com/og-image.jpg' // Default fallback
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const start = Date.now()

    // OPTIMIZATION: Use the light "models-with-pricing" or similar if available, 
    // but for now we need the specific model image. 
    // We can reuse the same fetch logic as getPriceBreakupData but lighter.
    // Or just fetch brands -> find brand -> fetch models -> find model.
    // To save time in metadata generation, let's try to hit the specific model endpoint directly if we had ID.
    // Since we don't have ID, we have to search.

    // Strategy: Fetch models list for the brand if possible, or just all models if list is cached/small.
    // Actually, let's just fetch all models like getPriceBreakupData does but faster?
    // No, let's rely on the fact that these are cached.

    const [brandsRes, modelsRes] = await Promise.all([
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/models`, { next: { revalidate: 3600 } }),
    ])

    if (brandsRes.ok && modelsRes.ok) {
      const brands = await brandsRes.json()
      const models = await modelsRes.json()

      const brand = brands.find((b: any) =>
        b.name.toLowerCase() === brandSlug.toLowerCase().replace(/-/g, ' ') ||
        b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug.toLowerCase()
      )

      if (brand) {
        const model = models.find((m: any) =>
          m.brandId === brand.id && (
            m.name.toLowerCase() === modelSlug.toLowerCase().replace(/-/g, ' ') ||
            m.name.toLowerCase().replace(/\s+/g, '-') === modelSlug.toLowerCase()
          )
        )

        if (model && model.heroImage) {
          modelImage = model.heroImage.startsWith('http')
            ? model.heroImage
            : `${backendUrl}${model.heroImage}`
        }
      }
    }
  } catch (e) {
    console.error('Error fetching OG image for price page:', e)
  }

  return {
    title,
    description,
    keywords: `${brandName} ${modelName} price ${cityName}, ${modelName} on-road price, ${modelName} EMI, ${modelName} variants, ${modelName} price breakup`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/${resolvedParams['brand-cars']}/${modelSlug}/price-in/${citySlug}`,
      images: [
        {
          url: modelImage,
          width: 1200,
          height: 630,
          alt: `${brandName} ${modelName} Price in ${cityName}`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [modelImage],
    },
    alternates: {
      canonical: `/${resolvedParams['brand-cars']}/${modelSlug}/price-in/${citySlug}`,
    },
  }
}

// Server-side data fetching
async function getPriceBreakupData(brandSlug: string, modelSlug: string, citySlug: string) {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  try {
    // Parallel fetch for better performance - include models-with-pricing for similar cars
    const [brandsRes, modelsRes, modelsWithPricingRes, popularCarsRes] = await Promise.all([
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/models`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/models-with-pricing?limit=500`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/cars/popular?limit=20`, { next: { revalidate: 3600 } }),
    ])

    if (!brandsRes.ok || !modelsRes.ok) {
      console.error('Failed to fetch initial data')
      return null
    }

    const brands = await brandsRes.json()
    const models = await modelsRes.json()
    const modelsWithPricingData = modelsWithPricingRes.ok ? await modelsWithPricingRes.json() : { data: [] }
    const popularCarsData = popularCarsRes.ok ? await popularCarsRes.json() : []

    // Find the brand
    const normalizedBrandSlug = brandSlug.toLowerCase().replace(/-/g, ' ')
    const brand = brands.find((b: any) =>
      b.name.toLowerCase() === normalizedBrandSlug ||
      b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug.toLowerCase()
    )

    if (!brand) return null

    // Find the model
    const normalizedModelSlug = modelSlug.toLowerCase().replace(/-/g, ' ')
    const model = models.find((m: any) =>
      m.brandId === brand.id && (
        m.name.toLowerCase() === normalizedModelSlug ||
        m.name.toLowerCase().replace(/\s+/g, '-') === modelSlug.toLowerCase()
      )
    )

    if (!model) return null

    // Fetch variants for this model
    const variantsRes = await fetch(`${backendUrl}/api/variants?modelId=${model.id}&full=true`, {
      next: { revalidate: 3600 }
    })

    let variants: any[] = []
    if (variantsRes.ok) {
      variants = await variantsRes.json()
    }

    // Get hero image with proper URL
    const heroImage = model.heroImage
      ? (model.heroImage.startsWith('http')
        ? model.heroImage
        : `${backendUrl}${model.heroImage}`)
      : ''

    // Create map of active brand IDs and names
    const activeBrandIds = new Set<string>()
    const brandMap = brands.reduce((acc: Record<string, string>, b: any) => {
      const isActive = b.status === 'active' || !b.status
      if (isActive) {
        activeBrandIds.add(b.id)
        if (b._id) activeBrandIds.add(b._id)
      }
      acc[b.id] = b.name
      if (b._id) acc[b._id] = b.name
      return acc
    }, {})

    // Helper function to format launch date
    const formatLaunchDate = (date: string): string => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const parts = date.split('-')
      if (parts.length === 2) {
        const year = parts[0]
        const monthIndex = parseInt(parts[1]) - 1
        return `${months[monthIndex]} ${year}`
      }
      return date
    }

    // Helper to resolve asset URL
    const resolveAssetUrl = (url: string | undefined): string => {
      if (!url) return ''
      if (url.startsWith('http')) return url
      return `${backendUrl}${url.startsWith('/') ? url : '/' + url}`
    }

    // Process Similar Cars (Server-Side) - EXACT LOGIC FROM CarsYouMightLike
    const currentPrice = model.price || model.lowestPrice || 0
    const currentBodyType = (model.bodyType || '').toLowerCase()

    // Set price range limits (+/- 40%)
    const minPrice = currentPrice * 0.6
    const maxPrice = currentPrice * 1.4

    const allModelsForSimilar = modelsWithPricingData.data || modelsWithPricingData || []

    // First try: Match by body type AND price range
    let filteredSimilarCars = allModelsForSimilar.filter((m: any) => {
      if (m.id === model.id) return false

      const price = m.lowestPrice || m.price || 0
      if (price <= 100000) return false

      const matchesBodyType = currentBodyType && m.bodyType &&
        m.bodyType.toLowerCase() === currentBodyType

      const inPriceRange = currentPrice <= 0 || (price >= minPrice && price <= maxPrice)

      return matchesBodyType && inPriceRange
    })

    // Second try: If less than 3 matches, try just body type
    if (filteredSimilarCars.length < 3 && currentBodyType) {
      filteredSimilarCars = allModelsForSimilar.filter((m: any) => {
        if (m.id === model.id) return false
        const price = m.lowestPrice || m.price || 0
        if (price <= 100000) return false
        return m.bodyType && m.bodyType.toLowerCase() === currentBodyType
      })
    }

    // Third try: If still less than 3 matches, show popular cars
    if (filteredSimilarCars.length < 3) {
      filteredSimilarCars = allModelsForSimilar.filter((m: any) => {
        if (m.id === model.id) return false
        const price = m.lowestPrice || m.price || 0
        return price > 100000
      })
    }

    // Sort by popularity then by price proximity
    filteredSimilarCars.sort((a: any, b: any) => {
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1

      // If same popularity, sort by price proximity
      if (currentPrice > 0) {
        const aPrice = a.lowestPrice || a.price || 0
        const bPrice = b.lowestPrice || b.price || 0
        const aDiff = Math.abs(aPrice - currentPrice)
        const bDiff = Math.abs(bPrice - currentPrice)
        return aDiff - bDiff
      }
      return 0
    })

    const similarCars = filteredSimilarCars
      .slice(0, 10) // Limit to 10 for price breakup page layout
      .map((m: any) => {
        const lowestPrice = m.lowestPrice || m.price || 0
        const fuelTypes = m.fuelTypes && m.fuelTypes.length > 0 ? m.fuelTypes : ['Petrol']
        const transmissions = m.transmissions && m.transmissions.length > 0 ? m.transmissions : ['Manual']

        return {
          id: m.id,
          name: m.name,
          brand: m.brandId,
          brandName: brandMap[m.brandId] || 'Unknown',
          image: resolveAssetUrl(m.heroImage),
          startingPrice: lowestPrice,
          fuelTypes,
          transmissions,
          seating: m.seating || 5,
          launchDate: m.launchDate ? `Launched ${formatLaunchDate(m.launchDate)}` : 'Launched',
          slug: `${(brandMap[m.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${m.name.toLowerCase().replace(/\s+/g, '-')}`,
          isNew: m.isNew || false,
          isPopular: m.isPopular || false,
        }
      })

    // Process Popular Cars
    const popularCars = Array.isArray(popularCarsData) ? popularCarsData
      .filter((car: any) => {
        if (!activeBrandIds.has(car.brandId) && !activeBrandIds.has(car.brand)) return false
        const price = car.startingPrice || car.lowestPrice || 0
        if (price <= 100000) return false
        return true
      })
      .slice(0, 10)
      .map((car: any) => ({
        id: car.id,
        name: car.name,
        brand: car.brandId,
        brandName: car.brandName || brandMap[car.brandId] || 'Unknown',
        image: resolveAssetUrl(car.image || car.heroImage),
        startingPrice: car.startingPrice || car.lowestPrice || 0,
        fuelTypes: car.fuelTypes || ['Petrol'],
        transmissions: car.transmissions || ['Manual'],
        seating: car.seating || 5,
        launchDate: car.launchDate ? `Launched ${formatLaunchDate(car.launchDate)}` : 'Launched',
        slug: `${(car.brandName || brandMap[car.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${car.name.toLowerCase().replace(/\s+/g, '-')}`,
        isNew: car.isNew || false,
        isPopular: car.isPopular || true,
      })) : []

    return {
      brand: {
        id: brand.id,
        name: brand.name,
        logo: brand.logo ? `${backendUrl}${brand.logo}` : '',
      },
      model: {
        id: model.id,
        name: model.name,
        brandId: brand.id,
        heroImage,
        bodyType: model.bodyType,
        seating: model.seating,
        fuelTypes: model.fuelTypes || ['Petrol'],
        transmissions: model.transmissions || ['Manual'],
      },
      variants: variants.map((v: any) => ({
        id: v.id,
        name: v.name,
        price: v.price,
        fuel: v.fuel || v.fuelType,
        transmission: v.transmission,
        mileage: v.mileage,
        power: v.maxPower || v.power || '',
        keyFeatures: v.keyFeatures || [],
        features: Array.isArray(v.keyFeatures) ? v.keyFeatures.join(', ') : (v.keyFeatures || ''),
      })),
      similarCars,
      popularCars,
    }
  } catch (error) {
    console.error('Error fetching price breakup data:', error)
    return null
  }
}

import { generateCarProductSchema } from '@/lib/structured-data'

export default async function PriceInCityPage({ params, searchParams }: PriceInCityPageProps) {
  // Await params and searchParams as required by Next.js 15
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  // Extract brand from "honda-cars" -> "honda"
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const citySlug = resolvedParams.city

  // Extract variant from search params if provided
  const variantSlug = resolvedSearchParams.variant as string | undefined

  // Fetch initial data server-side for SSR
  const initialData = await getPriceBreakupData(brandSlug, modelSlug, citySlug)

  // Generate structured data for Price Page
  const productSchema = initialData ? generateCarProductSchema({
    name: `${initialData.brand.name} ${initialData.model.name}`,
    brand: initialData.brand.name,
    image: initialData.model.heroImage,
    description: `Get ${initialData.brand.name} ${initialData.model.name} on-road price in ${toDisplayName(citySlug)}. View price breakup, variants, and specs.`,
    lowPrice: initialData.variants.length > 0 ? Math.min(...initialData.variants.map((v: any) => v.price)) : 0,
    highPrice: initialData.variants.length > 0 ? Math.max(...initialData.variants.map((v: any) => v.price)) : 0,
    bodyType: initialData.model.bodyType,
    fuelType: initialData.model.fuelTypes?.[0] || 'Petrol',
    transmission: initialData.model.transmissions?.[0] || 'Manual',
    seatingCapacity: initialData.model.seating ? parseInt(initialData.model.seating.split(' ')[0]) : 5,
    modelDate: new Date().getFullYear().toString()
  }) : null

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <PriceBreakupPage
        brandSlug={brandSlug}
        modelSlug={modelSlug}
        citySlug={citySlug}
        // Pass initial data for SSR
        initialBrand={initialData?.brand}
        initialModel={initialData?.model}
        initialVariants={initialData?.variants}
        initialSimilarCars={initialData?.similarCars}
        initialPopularCars={initialData?.popularCars}
      />
      <FloatingAIBot type="price" id={modelSlug} name={modelSlug} hasStickyBottomBar={true} />
    </>
  )
}
