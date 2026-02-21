import { Metadata } from 'next'
import CarModelPage from '@/components/car-model/CarModelPage'
import { generateCarStructuredData, parseCarFromUrl, generateCanonicalUrl } from '@/utils/carUrlHelpers'

interface PageProps {
  params: Promise<{
    brand: string
    model: string
  }>
}

// Enable ISR with 1-hour revalidation for better performance
export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand: brandSlug, model: modelSlug } = await params
  const { brand, model } = parseCarFromUrl(brandSlug, modelSlug)
  const fullName = `${brand} ${model}`

  // In a real app, you would fetch car data here
  const carData = {
    brand,
    model,
    fullName,
    startingPrice: 619000,
    rating: 4.2,
    reviewCount: 1543,
    image: '/api/placeholder/800/600'
  }

  const canonicalUrl = generateCanonicalUrl(carData)
  const structuredData = generateCarStructuredData(carData)

  return {
    title: `${fullName} Price, Mileage, Reviews, Specifications | gadizone`,
    description: `Explore ${fullName} price, mileage, reviews, specifications, variants, colors and more. Get on-road price, EMI calculator, expert reviews and user ratings for ${fullName}.`,
    keywords: `${fullName}, ${brand}, ${model}, price, mileage, review, specifications, variants, colors, on-road price, EMI calculator`,
    openGraph: {
      title: `${fullName} - Complete Car Details | gadizone`,
      description: `Discover ${fullName} price, features, specifications, mileage, and expert reviews. Compare variants and get best deals.`,
      images: [carData.image],
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName} - Price, Specs & Reviews`,
      description: `Complete details of ${fullName} including price, mileage, features and expert reviews.`,
      images: [carData.image],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  }
}

export default async function ModelPage({ params }: PageProps) {
  const { brand: brandSlug, model: modelSlug } = await params
  const { brand, model } = parseCarFromUrl(brandSlug, modelSlug)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  try {
    // Fetch all models and brands to find the matching one
    const [modelsRes, brandsRes] = await Promise.all([
      fetch(`${backendUrl}/api/models?limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
    ])

    const modelsResponse = await modelsRes.json()
    const brands = await brandsRes.json()

    const models = modelsResponse.data || modelsResponse

    // Find the brand by slug
    const foundBrand = brands.find((b: any) =>
      b.name.toLowerCase().replace(/\s+/g, '-') === brandSlug
    )

    if (!foundBrand) {
      throw new Error('Brand not found')
    }

    // Find the model by slug and brand
    const foundModel = models.find((m: any) =>
      m.brandId === foundBrand.id &&
      m.name.toLowerCase().replace(/\s+/g, '-') === modelSlug
    )

    if (!foundModel) {
      throw new Error('Model not found')
    }

    // Add brand name to model data
    const modelWithBrand = {
      ...foundModel,
      brand: foundBrand.name,
      brandName: foundBrand.name
    }

    // Pass the real model data to CarModelPage
    return (
      <div className="min-h-screen bg-gray-50">
        <CarModelPage model={modelWithBrand} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching model data:', error)

    // Fallback to a not found page or error message
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Model Not Found</h1>
          <p className="text-gray-600 mb-8">The car model you're looking for doesn't exist.</p>
          <a href="/" className="bg-[#291e6a] text-white px-6 py-3 rounded-lg hover:bg-[#1c144a] transition-all">
            Go to Homepage
          </a>
        </div>
      </div>
    )
  }
}
