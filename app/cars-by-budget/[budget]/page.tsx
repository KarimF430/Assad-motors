import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import BudgetCarsClient from './BudgetCarsClient'

interface PageProps {
    params: Promise<{ budget: string }>
}

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Budget ranges configuration
const budgetRanges: Record<string, { label: string; min: number; max: number; lakhValue: string; title: string }> = {
    'under-8': {
        label: 'Under ₹8 Lakh',
        min: 100000,
        max: 800000,
        lakhValue: '8 lakh',
        title: 'Best Cars Under 8 Lakh'
    },
    'under-10': {
        label: 'Under ₹10 Lakh',
        min: 100000,
        max: 1000000,
        lakhValue: '10 lakh',
        title: 'Best Cars Under 10 Lakh'
    },
    'under-15': {
        label: 'Under ₹15 Lakh',
        min: 100000,
        max: 1500000,
        lakhValue: '15 lakh',
        title: 'Best Cars Under 15 Lakh'
    },
    'under-25': {
        label: 'Under ₹25 Lakh',
        min: 100000,
        max: 2500000,
        lakhValue: '25 lakh',
        title: 'Best Cars Under 25 Lakh'
    },
    'under-50': {
        label: 'Under ₹50 Lakh',
        min: 100000,
        max: 5000000,
        lakhValue: '50 lakh',
        title: 'Best Cars Under 50 Lakh'
    },
    'above-50': {
        label: 'Above ₹50 Lakh',
        min: 5000001,
        max: Infinity,
        lakhValue: '50 lakh',
        title: 'Best Luxury Cars Above 50 Lakh'
    }
}

// Generate dynamic description based on actual cars data
function generateDynamicDescription(cars: any[], lakhValue: string, topCarName: string | null): string {
    const topCars = cars.slice(0, 3)
    const topCarNames = topCars.map(car => `${car.brandName} ${car.name}`)
    const carCount = cars.length

    // First part - shown initially (2 lines)
    let shortDesc = `Looking for the perfect car within your budget? Explore our curated selection of ${carCount}+ best cars under Rs. ${lakhValue} in India, featuring top-rated models with excellent mileage, safety features, and value for money.`

    // Extended part - shown on "read more"
    let extendedDesc = ''

    if (topCarNames.length >= 3) {
        extendedDesc += ` Top picks in this price segment include ${topCarNames[0]}, ${topCarNames[1]}, and ${topCarNames[2]} - each offering a unique blend of style, performance, and affordability.`
    } else if (topCarNames.length >= 1) {
        extendedDesc += ` The ${topCarNames[0]} stands out as one of the most sought-after choices in this segment.`
    }

    extendedDesc += ` Compare specifications, on-road prices, mileage figures, interior features, and genuine owner reviews to make an informed decision.`

    if (topCarName) {
        extendedDesc += ` Based on popularity and user ratings, we recommend the ${topCarName} as an excellent choice for buyers in this budget.`
    }

    return JSON.stringify({ short: shortDesc, extended: extendedDesc })
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { budget } = await params
    const budgetInfo = budgetRanges[budget] || budgetRanges['under-8']

    return {
        title: `${budgetInfo.title} in India - Prices, Specs & Reviews | gadizone`,
        description: `Find the best cars ${budgetInfo.label.toLowerCase()} in India. Compare prices, specifications, features, and expert reviews.`,
        keywords: `cars ${budgetInfo.label.toLowerCase()}, budget cars, best cars under ${budgetInfo.lakhValue}, car prices India`,
        openGraph: {
            title: `${budgetInfo.title} in India`,
            description: `Find the best cars ${budgetInfo.label.toLowerCase()} in India.`,
            type: 'website'
        },
        alternates: {
            canonical: `/cars-by-budget/${budget}`
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
async function getBudgetCarsData(budgetSlug: string) {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    try {
        // Fetch budget cars using optimized endpoint
        const [budgetRes, modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/cars-by-budget/${budgetSlug}?page=1&limit=100`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/models-with-pricing?limit=20`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        if (!budgetRes.ok) {
            console.error('Failed to fetch budget cars')
            return { cars: [], popularCars: [], newLaunchedCars: [] }
        }

        const budgetData = await budgetRes.json()
        const modelsResponse = await modelsRes.json()
        const brands = await brandsRes.json()

        const models = modelsResponse.data || modelsResponse

        // Create brand map
        const brandMap = brands.reduce((acc: any, brand: any) => {
            acc[brand.id] = brand.name
            return acc
        }, {})

        // Process budget cars
        const cars = budgetData.data || []

        // Process popular/new cars
        const processedCars = models.map((model: any) => {
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

        const popularCars = processedCars.filter((c: any) => c.isPopular).slice(0, 10)
        const newLaunchedCars = processedCars.filter((c: any) => c.isNew).slice(0, 10)

        // Generate dynamic description based on actual car data
        const budgetInfo = budgetRanges[budgetSlug]
        const lakhValue = budgetInfo?.lakhValue || '10 lakh'
        const topCarName = cars.length > 0 ? `${cars[0].brandName} ${cars[0].name}` : null
        const dynamicDescription = generateDynamicDescription(cars, lakhValue, topCarName)

        return { cars, popularCars, newLaunchedCars, dynamicDescription }
    } catch (error) {
        console.error('Error fetching budget cars data:', error)
        return { cars: [], popularCars: [], newLaunchedCars: [], dynamicDescription: '' }
    }
}

export default async function BudgetCarsPage({ params }: PageProps) {
    const { budget: budgetSlug } = await params
    const budgetInfo = budgetRanges[budgetSlug]

    if (!budgetInfo) {
        notFound()
    }

    const { cars, popularCars, newLaunchedCars, dynamicDescription } = await getBudgetCarsData(budgetSlug)

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

                    <BudgetCarsClient
                        initialCars={cars}
                        popularCars={popularCars}
                        newLaunchedCars={newLaunchedCars}
                        budgetLabel={budgetInfo.title}
                        budgetDescription={dynamicDescription || ''}
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
