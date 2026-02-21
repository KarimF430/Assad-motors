import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageSection from '@/components/common/PageSection'
import Footer from '@/components/Footer'
import Ad3DCarousel from '@/components/ads/Ad3DCarousel'
import BudgetCarsClient from '@/app/cars-by-budget/[budget]/BudgetCarsClient'
import Breadcrumb from '@/components/common/Breadcrumb'

export const revalidate = 3600

const transMap: Record<string, string> = {
    'automatic': 'Automatic',
    'manual': 'Manual',
    'imt': 'IMT',
    'cvt': 'CVT',
    'dct': 'DCT'
}

type Props = {
    params: Promise<{ type: string }>
}

function generateDynamicDescription(cars: any[], transType: string, topCarName: string | null): string {
    const topCars = cars.slice(0, 5)
    const carCount = cars.length
    const currentYear = new Date().getFullYear();
    const transLabel = transMap[transType] || transType;

    let shortDesc = `Looking for the best ${transLabel} cars in India ${currentYear}? Browse our curated list of ${carCount}+ top-rated ${transLabel} cars suited for city driving and highway cruising.`

    const extendedDesc = `
        <div class="prose prose-sm max-w-none text-gray-700">
            <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Why Buy an ${transLabel} Car?</h2>
            <p>${transLabel} transmission cars offer specific advantages. ${transLabel === 'Automatic' ? 'Automatic cars provide stress-free driving in traffic' : 'Manual cars offer better control and fuel efficiency'}. In ${currentYear}, there are excellent options across all budgets.</p>
            
            <h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">Top 5 ${transLabel} Cars</h2>
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
    const transLabel = transMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
    const year = new Date().getFullYear()

    return {
        title: `Best ${transLabel} Cars in India ${year} - Price, Specs & Reviews | gadizone`,
        description: `Find the best ${transLabel} cars in India. Compare prices, specs and reviews of top ${transLabel} models.`,
        keywords: `${transLabel} cars, best ${transLabel} cars India, ${transLabel} car price`,
        openGraph: {
            title: `Best ${transLabel} Cars in India ${year}`,
            description: `Find the best ${transLabel} cars in India.`,
            type: 'website'
        },
        alternates: {
            canonical: `/transmission-cars/${type}`
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

async function getTransCarsData(type: string) {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const transLabel = transMap[type] || type.charAt(0).toUpperCase() + type.slice(1)

    try {
        const [modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/models-with-pricing?limit=500`, { next: { revalidate: 3600 } }),
            fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
        ])

        const modelsResponse = await modelsRes.json()
        const brands = await brandsRes.json()
        const models = modelsResponse.data || modelsResponse

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

        const processedCars = models
            .filter((model: any) => {
                if (!activeBrandIds.has(model.brandId)) return false;
                const trans = model.transmissionTypes || []
                return trans.some((t: string) => t.toLowerCase().includes(transLabel.toLowerCase()))
            })
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

        const cars = processedCars.sort((a: any, b: any) => (a.startingPrice || 0) - (b.startingPrice || 0))
        const popularCars = cars.filter((c: any) => c.isPopular).slice(0, 10)
        const newLaunchedCars = cars.filter((c: any) => c.isNew).slice(0, 10)

        const topCarName = cars.length > 0 ? `${cars[0].brandName} ${cars[0].name}` : null
        const dynamicDescription = generateDynamicDescription(cars, type, topCarName)

        return { cars, popularCars, newLaunchedCars, dynamicDescription }
    } catch (error) {
        console.error('Error fetching transmission cars data:', error)
        return { cars: [], popularCars: [], newLaunchedCars: [], dynamicDescription: '' }
    }
}

export default async function TransmissionPage({ params }: Props) {
    const { type } = await params
    const transLabel = transMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
    const { cars, popularCars, newLaunchedCars, dynamicDescription } = await getTransCarsData(type)

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
                        budgetLabel={`${transLabel} Cars`}
                        budgetDescription={dynamicDescription || ''}
                    />
                </PageSection>



                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Ad3DCarousel className="my-4" />
                </div>
            </main>
            <Breadcrumb items={[{ label: `${transLabel} Cars` }]} />
            <Footer />
        </div>
    )
}
