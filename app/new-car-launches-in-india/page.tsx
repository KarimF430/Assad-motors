import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import NewLaunchesClient from './NewLaunchesClient'
import Breadcrumb from '@/components/common/Breadcrumb'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Generate metadata for SEO
// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
    const { dynamicDescription } = await getNewLaunchesData()
    let description = `Explore the latest new car launches in India with prices, specifications, and expert reviews. Discover newly launched cars from Maruti, Hyundai, Tata, Mahindra, and more.`

    if (dynamicDescription) {
        try {
            const parsed = JSON.parse(dynamicDescription)
            if (parsed.short) {
                description = parsed.short
            }
        } catch (e) {
            // Fallback
        }
    }

    return {
        title: `New Car Launches in India 2025 - Latest Cars, Prices & Specs | gadizone`,
        description,
        keywords: `new car launches India, latest cars 2025, new cars India, car prices, recently launched cars`,
        openGraph: {
            title: `New Car Launches in India 2025`,
            description,
            type: 'website'
        },
        alternates: {
            canonical: `/new-car-launches-in-india`
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

// Server-side data fetching
async function getNewLaunchesData() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    try {
        const [modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/models-with-pricing?limit=300`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        const modelsResponse = await modelsRes.json()
        const brands = await brandsRes.json()

        const models = modelsResponse.data || modelsResponse

        // Create brand map and active brands set
        const activeBrandIds = new Set<string>()
        const brandMap = brands.reduce((acc: any, brand: any) => {
            // Only add to active set if status is active (default to active for safety if missing)
            const isActive = brand.status === 'active' || !brand.status
            if (isActive) {
                activeBrandIds.add(brand.id)
                if (brand._id) activeBrandIds.add(brand._id)
            }

            acc[brand.id] = brand.name
            if (brand._id) acc[brand._id] = brand.name
            return acc
        }, {})

        // Process all cars and filter new launches - check for active brand
        const allCars = models
            .filter((model: any) => activeBrandIds.has(model.brandId)) // Filter inactive brands
            .map((model: any) => {
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
                    launchDate: model.launchDate ? formatLaunchDate(model.launchDate) : 'Recently Launched',
                    slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                    isNew: model.isNew || false,
                    isPopular: model.isPopular || false,
                    rating: 4.5,
                    reviews: 1247,
                    variants: model.variantCount || 0
                }
            })

        // Filter new launches
        const newLaunches = allCars
            .filter((car: any) => car.isNew)
            .sort((a: any, b: any) => (b.startingPrice || 0) - (a.startingPrice || 0))

        // Generate dynamic description
        const topCars = newLaunches.slice(0, 3)
        const topCarNames = topCars.map((car: any) => `${car.brandName} ${car.name}`)
        const carCount = newLaunches.length

        let shortDesc = `Check out ${carCount}+ recently launched cars in India! Discover the latest models featuring cutting-edge technology, modern design, and advanced safety features.`

        let extendedDesc = ''
        if (topCarNames.length >= 3) {
            extendedDesc += ` Fresh arrivals include ${topCarNames[0]}, ${topCarNames[1]}, and ${topCarNames[2]} - making waves in the Indian automobile market with their stunning features.`
        } else if (topCarNames.length >= 1) {
            extendedDesc += ` The ${topCarNames[0]} is one of the latest additions to the Indian car market.`
        }

        extendedDesc += ` Compare prices, specifications, mileage, features, and genuine owner reviews to stay updated on the newest car releases.`

        const dynamicDescription = JSON.stringify({ short: shortDesc, extended: extendedDesc })

        return { cars: newLaunches, dynamicDescription }
    } catch (error) {
        console.error('Error fetching new launches data:', error)
        return { cars: [], dynamicDescription: '' }
    }
}

export default async function NewLaunchesPage() {
    const { cars, dynamicDescription } = await getNewLaunchesData()

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Ad3DCarousel className="my-4" />
                    </div>

                    <PageSection background="white">
                        <Link
                            href="/"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Home
                        </Link>

                        <NewLaunchesClient
                            initialCars={cars}
                            dynamicDescription={dynamicDescription || ''}
                        />
                    </PageSection>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Ad3DCarousel className="my-4" />
                    </div>
                </main>
            </div>
            <Breadcrumb items={[{ label: 'New Car Launches' }]} />
            <Footer />
        </>
    )
}
