import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import VariantPage from '@/components/variant/VariantPage'
import { generateVariantSEO } from '@/lib/seo'
import { generateCarProductSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import { FloatingAIBot } from '@/components/FloatingAIBot'

interface PageProps {
  params: Promise<{
    'brand-cars': string
    model: string
    variant: string
  }>
}

// Enable ISR with 1-hour revalidation for caching
export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const variantSlug = resolvedParams.variant

  // Convert slugs to display names
  const brandName = brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const modelName = modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const variantName = variantSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return generateVariantSEO(brandName, modelName, variantName)
}

export default async function VariantDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const brandSlug = resolvedParams['brand-cars'].replace('-cars', '')
  const modelSlug = resolvedParams.model
  const variantSlug = resolvedParams.variant

  // Redirect if this is actually a price page (starts with "price-in")
  if (variantSlug.startsWith('price-in')) {
    const { redirect } = await import('next/navigation')
    redirect(`/${resolvedParams['brand-cars']}/${modelSlug}/${variantSlug}`)
  }

  // Convert slugs to display names
  const brandName = brandSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const modelName = modelSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const variantName = variantSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  // Fetch real data from backend
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    // Fetch brands to get brand ID
    const brandsRes = await fetch(`${backendUrl}/api/brands`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    const brands = await brandsRes.json()

    // Normalize slug for matching (same logic as model page)
    const normalizeBrandSlug = (name: string) =>
      name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const brand = brands.find((b: any) =>
      normalizeBrandSlug(b.name) === brandSlug
    )

    if (!brand) {
      notFound()
    }

    // Fetch models for this brand
    const modelsRes = await fetch(`${backendUrl}/api/models?brandId=${brand.id}`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    })
    const models = await modelsRes.json()
    const model = models.find((m: any) =>
      m.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === modelSlug
    )

    if (!model) {
      notFound()
    }

    // Fetch variants for this model
    const variantsRes = await fetch(`${backendUrl}/api/variants?modelId=${model.id}`, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    })
    const variants = await variantsRes.json()

    // Find the specific variant
    const normalizeForMatch = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const normalizedVariantSlug = normalizeForMatch(variantSlug)

    let variant = variants.find((v: any) =>
      normalizeForMatch(v.name) === normalizedVariantSlug
    )

    if (!variant && variants.length > 0) {
      // Try partial matching
      variant = variants.find((v: any) =>
        normalizeForMatch(v.name).includes(normalizedVariantSlug) ||
        normalizedVariantSlug.includes(normalizeForMatch(v.name))
      )
    }

    if (!variant) {
      variant = variants[0] // Fallback to first variant
    }

    // Calculate model's starting price from variants
    const variantPrices = variants.map((v: any) => v.price).filter((p: number) => p > 0)
    const modelStartingPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0

    // Fetch similar cars (same high-limit as model page)
    const similarModelsRes = await fetch(
      `${backendUrl}/api/models-with-pricing?limit=500`,
      { next: { revalidate: 3600 } }
    ).then(res => res.json()).catch(() => [])

    const similarModelsData = similarModelsRes?.data || similarModelsRes || []

    const brandMap = brands.reduce((acc: any, brand: any) => {
      acc[brand.id] = brand.name
      return acc
    }, {})

    // Process Similar Cars (Server-Side) - EXACT LOGIC FROM CarsYouMightLike
    const currentPrice = modelStartingPrice || model.price || 0
    const currentBodyType = (model.bodyType || '').toLowerCase()

    // Set price range limits (+/- 40%)
    const minPrice = currentPrice * 0.6
    const maxPrice = currentPrice * 1.4

    // First try: Match by body type AND price range
    let filteredCars = similarModelsData.filter((m: any) => {
      if (m.id === model.id) return false

      const price = m.lowestPrice || m.price || 0
      if (price <= 100000) return false

      const matchesBodyType = currentBodyType && m.bodyType &&
        m.bodyType.toLowerCase() === currentBodyType

      const inPriceRange = currentPrice <= 0 || (price >= minPrice && price <= maxPrice)

      return matchesBodyType && inPriceRange
    })

    // Second try: If less than 3 matches, try just body type
    if (filteredCars.length < 3 && currentBodyType) {
      filteredCars = similarModelsData.filter((m: any) => {
        if (m.id === model.id) return false
        const price = m.lowestPrice || m.price || 0
        if (price <= 100000) return false
        return m.bodyType && m.bodyType.toLowerCase() === currentBodyType
      })
    }

    // Third try: If still less than 3 matches, show popular cars
    if (filteredCars.length < 3) {
      filteredCars = similarModelsData.filter((m: any) => {
        if (m.id === model.id) return false
        const price = m.lowestPrice || m.price || 0
        return price > 100000
      })
    }

    // Sort by popularity then by price proximity
    filteredCars.sort((a: any, b: any) => {
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1

      if (currentPrice > 0) {
        const aPrice = a.lowestPrice || a.price || 0
        const bPrice = b.lowestPrice || b.price || 0
        const aDiff = Math.abs(aPrice - currentPrice)
        const bDiff = Math.abs(bPrice - currentPrice)
        return aDiff - bDiff
      }
      return 0
    })

    const similarCars = filteredCars
      .slice(0, 6)
      .map((m: any) => {
        const lowestPrice = m.lowestPrice || m.price || 0
        const fuelTypes = m.fuelTypes && m.fuelTypes.length > 0
          ? m.fuelTypes
          : ['Petrol']
        const transmissions = m.transmissions && m.transmissions.length > 0
          ? m.transmissions
          : ['Manual']

        return {
          id: m.id,
          brandName: brandMap[m.brandId] || 'Unknown',
          name: m.name,
          image: m.heroImage || m.image,
          startingPrice: lowestPrice,
          fuelTypes,
          transmissions,
          launchDate: m.launchDate,
          isNew: m.isNew || false,
          isPopular: m.isPopular || false
        }
      })

    // Add similar cars and starting price to model object
    const modelWithSimilarCars = {
      ...model,
      startingPrice: modelStartingPrice,
      similarCars
    }

    // Generate JSON-LD Schema
    const productSchema = generateCarProductSchema({
      name: `${brandName} ${modelName} ${variantName}`,
      brand: brandName,
      image: variant?.highlightImages?.[0]?.url
        ? (variant.highlightImages[0].url.startsWith('http') ? variant.highlightImages[0].url : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${variant.highlightImages[0].url}`)
        : (model.heroImage?.startsWith('http') ? model.heroImage : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${model.heroImage}`),
      description: variant?.description || variant?.headerSummary || `Full specifications and features of ${brandName} ${modelName} ${variantName}.`,
      lowPrice: variant?.price || modelStartingPrice,
      highPrice: variant?.price || modelStartingPrice,
      currency: 'INR',
      rating: variant?.rating || 0,
      reviewCount: variant?.reviewCount || 0
    })

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: brandName, item: `/${brandSlug}-cars` },
      { name: modelName, item: `/${brandSlug}-cars/${modelSlug}` },
      { name: variantName, item: `/${brandSlug}-cars/${modelSlug}/${variantSlug}` }
    ])

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <VariantPage
          brandName={brandName}
          modelName={modelName}
          variantName={variantName}
          initialBrand={brand}
          initialModel={modelWithSimilarCars}
          initialVariant={variant}
          initialAllVariants={variants}
        />
        <FloatingAIBot type="variant" id={variant?.id || variantSlug} name={variant?.name || variantName} />
      </>
    )
  } catch (error) {
    console.error('Error fetching variant data:', error)

    // Return with empty data on error
    return (
      <>
        <VariantPage
          brandName={brandName}
          modelName={modelName}
          variantName={variantName}
        />
        <FloatingAIBot type="variant" id={variantSlug} name={variantName} />
      </>
    )
  }
}
