import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'

import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import BudgetCarsClient from '@/app/cars-by-budget/[budget]/BudgetCarsClient'
import Breadcrumb from '@/components/common/Breadcrumb'
import { budgetEditorials } from '@/lib/budget-editorials'

const BUDGET_INFO = {
    label: 'Under ₹10 Lakh',
    min: 100000,
    max: 1000000,
    lakhValue: '10 lakh',
    title: 'Best Cars Under 10 Lakh',
    apiSlug: 'under-10'
}

export const revalidate = 3600


export const metadata: Metadata = {
    title: `${BUDGET_INFO.title} in India ${new Date().getFullYear()} - Price, Mileage & Reviews | assadmotors`,
    description: `Find the best cars ${BUDGET_INFO.label.toLowerCase()} in India ${new Date().getFullYear()}. Compare on-road prices, specs, mileage, features and expert reviews of top models like Maruti Swift, Tata Punch & more.`,
    keywords: `cars ${BUDGET_INFO.label.toLowerCase()}, best cars under ${BUDGET_INFO.lakhValue} ${new Date().getFullYear()}, budget cars India, car prices under ${BUDGET_INFO.lakhValue}`,
    openGraph: {
        title: `${BUDGET_INFO.title} in India ${new Date().getFullYear()}`,
        description: `Find the best cars ${BUDGET_INFO.label.toLowerCase()} in India ${new Date().getFullYear()}.`,
        type: 'website'
    },
    alternates: {
        canonical: `/best-cars-under-10-lakh`
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

async function getBudgetCarsData() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

    try {
        const [budgetRes, modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/cars-by-budget/${BUDGET_INFO.apiSlug}?page=1&limit=100`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/models-with-pricing?limit=100`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        if (!budgetRes.ok) return { cars: [], popularCars: [], newLaunchedCars: [], dynamicDescription: '' }

        const budgetData = await budgetRes.json()
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

        const allCars = budgetData.data || []
        const cars = allCars
            .filter((car: any) => {
                // Filter by active brand
                if (!activeBrandIds.has(car.brandId || car.brand)) return false
                // Strict price filter
                const price = car.startingPrice || car.lowestPrice || 0
                return price <= BUDGET_INFO.max
            })

        const processedCars = models
            .filter((model: any) => activeBrandIds.has(model.brandId)) // Filter inactive brands
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
            // Strict price filter for popular/new cars too
            .filter((car: any) => car.startingPrice <= BUDGET_INFO.max)

        // Filter processedCars to only include models within this page's price band
        const filteredCars = processedCars.filter((c: any) => {
            const price = c.startingPrice || 0
            return price >= BUDGET_INFO.min && price <= BUDGET_INFO.max
        })

        const popularCars = filteredCars.filter((c: any) => c.isPopular).slice(0, 10)
        const newLaunchedCars = filteredCars.filter((c: any) => c.isNew).slice(0, 10)
        const topCarName = cars.length > 0 ? `${cars[0].brandName} ${cars[0].name}` : null

        const dynamicDescription = JSON.stringify(budgetEditorials['10-lakh'] ?? { short: '', extended: '' })

        return { cars, popularCars, newLaunchedCars, dynamicDescription, allCars: processedCars }
    } catch (error) {
        console.error('Error fetching budget cars data:', error)
        return { cars: [], popularCars: [], newLaunchedCars: [], dynamicDescription: '' }
    }
}

export default async function BestCarsUnder10LakhPage() {
    const { cars, popularCars, newLaunchedCars, dynamicDescription, allCars } = await getBudgetCarsData()

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
                    <BudgetCarsClient
                        initialCars={cars}
                        popularCars={popularCars}
                        newLaunchedCars={newLaunchedCars}
                        budgetLabel={BUDGET_INFO.title}
                        budgetDescription={dynamicDescription || ''}
                    allCars={allCars}
                    budgetSlug={BUDGET_INFO.apiSlug}
                    />
                </PageSection>



                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>
            </main>
            <Breadcrumb items={[{ label: 'Best Cars Under 10 Lakh' }]} />
            
        </div>
    )
}
