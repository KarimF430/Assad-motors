import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'

import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import FuelCarsClient from './FuelCarsClient'
import Breadcrumb from '@/components/common/Breadcrumb'

export const revalidate = 3600

const fuelTypeMap: Record<string, string> = {
    'petrol': 'Petrol',
    'diesel': 'Diesel',
    'cng': 'CNG',
    'electric': 'Electric',
    'hybrid': 'Hybrid'
}

type Props = {
    params: Promise<{ type: string }>
}

function generateDynamicDescription(cars: any[], fuelType: string, topCarName: string | null): string {
    const topCars = cars.slice(0, 5)
    const carCount = cars.length
    const currentYear = new Date().getFullYear();
    const fuelLabel = fuelTypeMap[fuelType] || fuelType;

    let shortDesc = `Looking for the best ${fuelLabel} cars in India ${currentYear}? Explore our list of ${carCount}+ top-rated ${fuelLabel} cars with latest prices, mileage, and features.`

    const extendedDesc = `
        <div class="prose prose-sm max-w-none text-gray-700">
            <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Why Choose a ${fuelLabel} Car?</h2>
            <p>${fuelLabel} cars continue to be a popular choice in India due to their ${fuelLabel === 'Diesel' ? 'efficiency and torque' : fuelLabel === 'CNG' ? 'low running costs' : 'performance and refinement'}. In ${currentYear}, you have excellent options from top brands.</p>
            
            <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Top 5 ${fuelLabel} Cars</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full text-left text-sm whitespace-nowrap">
                    <thead class="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-2 text-gray-900 font-semibold">Model</th>
                            <th scope="col" class="px-4 py-2 text-gray-900 font-semibold text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${topCars.map(car => `
                            <tr>
                                <td class="px-4 py-2 font-medium text-gray-900">${car.brandName} ${car.name}</td>
                                <td class="px-4 py-2 text-gray-600 text-right">₹ ${(car.startingPrice / 100000).toFixed(2)} Lakh*</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p class="text-xs text-gray-500 mt-2 italic">*Prices are ex-showroom and subject to change.</p>
        </div>
    `
    return JSON.stringify({ short: shortDesc, extended: extendedDesc })
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { type } = await params
    const fuelLabel = fuelTypeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
    const year = new Date().getFullYear()

    return {
        title: `Best ${fuelLabel} Cars in India ${year} - Price, Mileage & Reviews | assadmotors`,
        description: `Find the best ${fuelLabel} cars in India. Compare prices, mileage, specs and reviews of top ${fuelLabel} models from Maruti, Tata, Hyundai & more.`,
        keywords: `${fuelLabel} cars, best ${fuelLabel} cars India, ${fuelLabel} car price, ${fuelLabel} mileage cars`,
        openGraph: {
            title: `Best ${fuelLabel} Cars in India ${year}`,
            description: `Find the best ${fuelLabel} cars in India.`,
            type: 'website'
        },
        alternates: {
            canonical: `/fuel-cars/${type}`
        }
    }
}

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

async function getFuelCarsData(type: string) {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const fuelLabel = fuelTypeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)

    try {
        // Fetch all models and filter manually since we don't have a dedicated endpoint yet
        // OR use the existing models API if it supports filtering. 
        // For now, fetching models and filtering client-side logic on server
        const [modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/models-with-pricing?limit=500`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        const modelsResponse = await modelsRes.json()
        const brands = await brandsRes.json()
        const models = modelsResponse.data || modelsResponse

        // Create brand map
        const activeBrandIds = new Set<string>()
        const brandMap = brands.reduce((acc: any, brand: any) => {
            const isActive = brand.status === 'active' || !brand.status
            if (isActive) {
                activeBrandIds.add(brand.id)
                if (brand._id) activeBrandIds.add(brand._id)
            }
            acc[brand.id] = brand.name
            if (brand._id) acc[brand._id] = brand.name
            return acc
        }, {})

        const allCars = models
            .filter((model: any) => activeBrandIds.has(model.brandId))
            .map((model: any) => ({
                id: model.id,
                name: model.name,
                brand: model.brandId,
                brandName: brandMap[model.brandId] || 'Unknown',
                image: model.heroImage ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`) : '',
                startingPrice: model.lowestPrice || model.price || 0,
                lowestPriceFuelType: model.lowestPriceFuelType || (model.fuelTypes?.[0] || 'Petrol'),
                fuelTypes: model.fuelTypes?.length > 0 ? model.fuelTypes : ['Petrol'],
                transmissions: model.transmissionTypes?.length > 0 ? model.transmissionTypes : ['Manual'],
                seating: model.seating || 5,
                launchDate: model.launchDate ? `Launched ${formatLaunchDate(model.launchDate)}` : 'Launched',
                slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                isNew: model.isNew || false,
                isPopular: model.isPopular || false,
                rating: 4.5,
                reviews: 1247,
                variants: model.variantCount || 0
            }))

        const processedCars = allCars.filter((car: any) => {
            const fuels = car.fuelTypes || []
            return fuels.some((f: string) => f.toLowerCase() === fuelLabel.toLowerCase())
        })

        const cars = processedCars.sort((a: any, b: any) => (a.startingPrice || 0) - (b.startingPrice || 0))
        const popularCars = cars.filter((c: any) => c.isPopular).slice(0, 10)
        const newLaunchedCars = cars.filter((c: any) => c.isNew).slice(0, 10)

        const topCarName = cars.length > 0 ? `${cars[0].brandName} ${cars[0].name}` : null
        const dynamicDescription = generateDynamicDescription(cars, type, topCarName)

        return { cars, popularCars, newLaunchedCars, dynamicDescription, allCars }
    } catch (error) {
        console.error('Error fetching fuel cars data:', error)
        return { cars: [], popularCars: [], newLaunchedCars: [], dynamicDescription: '', allCars: [] }
    }
}

export default async function FuelTypePage({ params }: Props) {
    const { type } = await params
    const fuelLabel = fuelTypeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
    const { cars, popularCars, newLaunchedCars, dynamicDescription, allCars } = await getFuelCarsData(type)

    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>
                <PageSection background="white">
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>
                    <FuelCarsClient
                        initialCars={cars}
                        popularCars={popularCars}
                        newLaunchedCars={newLaunchedCars}
                        fuelLabel={`${fuelLabel} Cars`}
                        fuelDescription={dynamicDescription || ''}
                        allCars={allCars}
                        fuelSlug={type}
                    />
                </PageSection>



                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>
            </main>
            <Breadcrumb items={[{ label: `${fuelLabel} Cars` }]} />
            
        </div>
    )
}
