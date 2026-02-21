import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import UpcomingCarsClient from './UpcomingCarsClient'
import Breadcrumb from '@/components/common/Breadcrumb'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Generate metadata for SEO
// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
    const { dynamicDescription } = await getUpcomingCarsData()
    let description = `Explore upcoming cars in India with expected prices, launch dates, and specifications. Stay updated on the latest cars from Maruti, Hyundai, Tata, Mahindra, and more.`

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
        title: `Upcoming Cars in India 2025 - Expected Prices & Launch Dates | gadizone`,
        description,
        keywords: `upcoming cars India, new car launches 2025, expected car prices, future cars India`,
        openGraph: {
            title: `Upcoming Cars in India 2025`,
            description,
            type: 'website'
        },
        alternates: {
            canonical: `/upcoming-cars-in-india`
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
async function getUpcomingCarsData() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    try {
        const [modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/upcoming-cars?limit=100`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        const upcomingCars = await modelsRes.json()
        const brands = await brandsRes.json()

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

        // Process upcoming cars - filter by active brand
        const processedCars = (upcomingCars.data || upcomingCars || [])
            .filter((car: any) => activeBrandIds.has(car.brandId)) // Filter inactive brands
            .map((car: any) => {
                const heroImage = car.image || car.heroImage
                    ? ((car.image || car.heroImage).startsWith('http') ? (car.image || car.heroImage) : `${backendUrl}${car.image || car.heroImage}`)
                    : ''

                return {
                    id: car.id,
                    name: car.name,
                    brand: car.brandId,
                    brandName: brandMap[car.brandId] || car.brandName || 'Unknown',
                    image: heroImage,
                    expectedPriceMin: car.expectedPriceMin || car.expectedPrice || 0,
                    expectedPriceMax: car.expectedPriceMax || car.expectedPrice || 0,
                    fuelTypes: car.fuelTypes || ['Petrol'],
                    expectedLaunchDate: car.expectedLaunchDate ? formatLaunchDate(car.expectedLaunchDate) : 'Coming Soon',
                    bodyType: car.bodyType,
                    isNew: false,
                    isPopular: car.isPopular || false,
                    isUpcoming: true
                }
            })

        // Generate dynamic description
        const topCars = processedCars.slice(0, 3)
        const topCarNames = topCars.map((car: any) => `${car.brandName} ${car.name}`)
        const carCount = processedCars.length

        let shortDesc = `Stay ahead with ${carCount}+ upcoming cars launching in India! Get exclusive early access to expected prices, launch dates, specifications, and features of the most anticipated cars.`

        let extendedDesc = ''
        if (topCarNames.length >= 3) {
            extendedDesc += ` Highly anticipated launches include ${topCarNames[0]}, ${topCarNames[1]}, and ${topCarNames[2]} - set to revolutionize the Indian automobile market.`
        } else if (topCarNames.length >= 1) {
            extendedDesc += ` The ${topCarNames[0]} is one of the most awaited cars in India.`
        }

        extendedDesc += ` Compare expected prices, specifications, and features to plan your next car purchase smartly.`

        const dynamicDescription = JSON.stringify({ short: shortDesc, extended: extendedDesc })

        return { cars: processedCars, dynamicDescription }
    } catch (error) {
        console.error('Error fetching upcoming cars data:', error)
        return { cars: [], dynamicDescription: '' }
    }
}

export default async function UpcomingCarsPage() {
    const { cars, dynamicDescription } = await getUpcomingCarsData()

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

                        <UpcomingCarsClient
                            initialCars={cars}
                            dynamicDescription={dynamicDescription || ''}
                        />
                    </PageSection>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Ad3DCarousel className="my-4" />
                    </div>
                </main>
            </div>
            <Breadcrumb items={[{ label: 'Upcoming Cars' }]} />
            <Footer />
        </>
    )
}
