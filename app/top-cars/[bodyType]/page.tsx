import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import TopCarsClient from './TopCarsClient'

interface PageProps {
    params: Promise<{ bodyType: string }>
}

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Body type configuration
const bodyTypes: Record<string, { label: string; description: string }> = {
    'suv': {
        label: 'SUV',
        description: 'Discover the best SUVs in India with powerful performance, spacious interiors, and advanced features. Perfect for families and adventure enthusiasts.'
    },
    'sedan': {
        label: 'Sedan',
        description: 'Explore premium sedans with elegant design, comfortable rides, and cutting-edge technology. Ideal for executive and luxury car buyers.'
    },
    'hatchback': {
        label: 'Hatchback',
        description: 'Find the perfect hatchback with fuel efficiency, compact design, and great value. Best for city driving and first-time buyers.'
    },
    'muv': {
        label: 'MUV/MPV',
        description: 'Spacious MUVs and MPVs perfect for large families. Featuring versatile seating, ample cargo space, and comfort on long journeys.'
    },
    'luxury': {
        label: 'Luxury Cars',
        description: 'Premium luxury cars with world-class comfort, advanced technology, and prestigious brands. Experience automotive excellence.'
    },
    'sports': {
        label: 'Sports Cars',
        description: 'High-performance sports cars with thrilling acceleration, stunning design, and racing heritage. For driving enthusiasts.'
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { bodyType } = await params
    const bodyTypeInfo = bodyTypes[bodyType] || bodyTypes['suv']

    return {
        title: `Best ${bodyTypeInfo.label} Cars in India 2025 - Prices & Specs | gadizone`,
        description: `${bodyTypeInfo.description} Compare prices, specifications, and reviews of top ${bodyTypeInfo.label} cars.`,
        keywords: `${bodyTypeInfo.label} cars India, best ${bodyTypeInfo.label}, ${bodyTypeInfo.label} prices, top ${bodyTypeInfo.label} 2025`,
        openGraph: {
            title: `Best ${bodyTypeInfo.label} Cars in India 2025`,
            description: bodyTypeInfo.description,
            type: 'website'
        },
        alternates: {
            canonical: `/top-cars/${bodyType}`
        }
    }
}

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

// Auto-rank cars by body type based on popularity and price
function autoRankCarsByBodyType(cars: any[]) {
    const bodyTypes = ['SUV', 'Sedan', 'Hatchback', 'MUV', 'Coupe']
    const rankedCars: any[] = []
    
    bodyTypes.forEach(bodyType => {
        // Filter cars for this body type
        const bodyCars = cars.filter((car: any) => 
            car.bodyType && car.bodyType.toLowerCase() === bodyType.toLowerCase()
        )
        
        // Sort by popularity first, then by price (descending)
        const sorted = bodyCars.sort((a: any, b: any) => {
            // Prioritize popular cars
            if (a.isPopular && !b.isPopular) return -1
            if (!a.isPopular && b.isPopular) return 1
            // Then sort by price (higher price = better car, usually)
            return (b.startingPrice || 0) - (a.startingPrice || 0)
        })
        
        // Assign ranks 1-10 for this body type
        sorted.slice(0, 10).forEach((car, index) => {
            rankedCars.push({
                ...car,
                topRank: index + 1,
                bodyTypeCategory: bodyType
            })
        })
    })
    
    return rankedCars
}

// Server-side data fetching - Auto-rank top 10 cars for EACH body type
async function getTopCarsData() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    try {
        const [modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/models-with-pricing?limit=300`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        const modelsResponse = await modelsRes.json()
        const brands = await brandsRes.json()

        const models = modelsResponse.data || modelsResponse

        // Create brand map
        const brandMap = brands.reduce((acc: any, brand: any) => {
            acc[brand.id] = brand.name
            return acc
        }, {})

        // Process all cars
        const allCars = models.map((model: any) => {
            const lowestPrice = model.lowestPrice || model.price || 0
            const fuelTypes = model.fuelTypes && model.fuelTypes.length > 0 ? model.fuelTypes : ['Petrol']
            const transmissions = model.transmissionTypes && model.transmissionTypes.length > 0 ? model.transmissionTypes : ['Manual']
            const heroImage = model.heroImage
                ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`)
                : ''

            return {
                id: model.id,
                name: model.name,
                brand: model.brandId,
                brandName: brandMap[model.brandId] || 'Unknown',
                image: heroImage,
                startingPrice: lowestPrice,
                lowestPriceFuelType: model.lowestPriceFuelType || fuelTypes[0],
                fuelTypes,
                transmissions,
                bodyType: model.bodyType,
                seating: model.seating || 5,
                launchDate: model.launchDate ? `Launched ${formatLaunchDate(model.launchDate)}` : 'Launched',
                slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                isNew: model.isNew || false,
                isPopular: model.isPopular || false,
                rating: 4.5,
                reviews: 1247,
                variants: model.variantCount || 0
            }
        })

        // Auto-rank cars by body type
        const rankedCars = autoRankCarsByBodyType(allCars)
        
        const popularCars = rankedCars.filter((c: any) => c.isPopular).slice(0, 10)
        const newLaunchedCars = rankedCars.filter((c: any) => c.isNew).slice(0, 10)

        console.log('[Server] Total ranked cars:', rankedCars.length)
        console.log('[Server] Body types:', rankedCars.map((c: any) => c.bodyTypeCategory).filter((v: any, i: any, a: any) => a.indexOf(v) === i))

        return { cars: rankedCars, popularCars, newLaunchedCars }
    } catch (error) {
        console.error('Error fetching top cars data:', error)
        return { cars: [], popularCars: [], newLaunchedCars: [] }
    }
}

export default async function TopCarsPage({ params }: PageProps) {
    const { bodyType: bodyTypeSlug } = await params
    const bodyTypeInfo = bodyTypes[bodyTypeSlug]

    if (!bodyTypeInfo) {
        notFound()
    }

    const { cars, popularCars, newLaunchedCars } = await getTopCarsData()

    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>

                {/* Header & Filters */}
                <PageSection background="white">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>

                    <TopCarsClient
                        initialCars={cars}
                        popularCars={popularCars}
                        newLaunchedCars={newLaunchedCars}
                        bodyTypeLabel={bodyTypeInfo.label}
                        bodyTypeDescription={bodyTypeInfo.description}
                    />
                </PageSection>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>
            </main>

            <Footer />
        </div>
    )
}
