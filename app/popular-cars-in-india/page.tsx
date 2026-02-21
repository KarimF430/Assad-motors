import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import PopularCarsClient from './PopularCarsClient'
import Breadcrumb from '@/components/common/Breadcrumb'

// Enable ISR with 1-hour revalidation
export const revalidate = 3600

// Generate metadata for SEO
// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
    const { dynamicDescription } = await getPopularCarsData()
    let description = `Explore the most popular cars in India with detailed prices, specifications, and expert reviews. Discover India's favourite cars from Maruti, Hyundai, Tata, Mahindra, and more.`

    if (dynamicDescription) {
        try {
            const parsed = JSON.parse(dynamicDescription)
            if (parsed.short) {
                // Remove Markdown style links if any, though likely plain text
                description = parsed.short
            }
        } catch (e) {
            // Fallback
        }
    }

    return {
        title: `Popular Cars in India 2025 - Prices, Specs & Reviews | gadizone`,
        description,
        keywords: `popular cars India, best cars 2025, favourite cars India, car prices, car reviews`,
        openGraph: {
            title: `Popular Cars in India 2025`,
            description,
            type: 'website'
        },
        alternates: {
            canonical: `/popular-cars-in-india`
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
async function getPopularCarsData() {
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

        // Process all cars - filter by active brand
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
                    launchDate: model.launchDate ? `Launched ${formatLaunchDate(model.launchDate)}` : 'Launched',
                    slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                    isNew: model.isNew || false,
                    isPopular: model.isPopular || false,
                    rating: 4.5,
                    reviews: 1247,
                    variants: model.variantCount || 0
                }
            })

        // Filter popular cars and sort
        const popularCars = allCars
            .filter((car: any) => car.isPopular)
            .sort((a: any, b: any) => (b.startingPrice || 0) - (a.startingPrice || 0))

        // Generate dynamic description
        const topCars = popularCars.slice(0, 10)
        const carCount = popularCars.length
        const currentYear = new Date().getFullYear();

        let shortDesc = `Discover India's most loved cars! Explore our curated collection of ${carCount}+ popular models that have won the hearts of Indian car buyers with their exceptional value, reliability, and performance.`

        let extendedDesc = `
            <div class="prose prose-sm max-w-none text-gray-700">
                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Why are these the Most Popular Cars in India?</h2>
                <p>The cars on this list represent the best of what the Indian auto market has to offer. From efficient hatchbacks to powerful SUVs, these models have consistently topped sales charts and customer satisfaction surveys in ${currentYear}.</p>
                
                <h3 class="text-base font-semibold text-gray-900 mt-3 mb-1">What Makes them Popular?</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Exceptional Value for Money</li>
                    <li>Leading Mileage Figures</li>
                    <li>Modern Features & Tech</li>
                    <li>Trusted Brand Value & Service</li>
                </ul>

                <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Top 10 Popular Cars in India ${currentYear}</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-left text-sm whitespace-nowrap">
                        <thead class="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
                            <tr>
                                <th scope="col" class="px-4 py-2 text-gray-900 font-semibold">Model</th>
                                <th scope="col" class="px-4 py-2 text-gray-900 font-semibold text-right">Price (Ex-Showroom)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${topCars.map((car: any) => `
                                <tr>
                                    <td class="px-4 py-2 font-medium text-gray-900">${car.brandName} ${car.name}</td>
                                    <td class="px-4 py-2 text-gray-600 text-right">₹ ${(car.startingPrice / 100000).toFixed(2)} Lakh*</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <p class="text-xs text-gray-500 mt-2 italic">*Prices are subject to change. Check specific model pages for valid offers and on-road prices.</p>
            </div>
        `

        const dynamicDescription = JSON.stringify({ short: shortDesc, extended: extendedDesc })

        return { cars: popularCars, dynamicDescription }
    } catch (error) {
        console.error('Error fetching popular cars data:', error)
        return { cars: [], dynamicDescription: '' }
    }
}

export default async function PopularCarsPage() {
    const { cars, dynamicDescription } = await getPopularCarsData()

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

                        <PopularCarsClient
                            initialCars={cars}
                            dynamicDescription={dynamicDescription || ''}
                        />
                    </PageSection>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Ad3DCarousel className="my-4" />
                    </div>
                </main>
            </div>
            <Breadcrumb items={[{ label: 'Popular Cars' }]} />
            <Footer />
        </>
    )
}
