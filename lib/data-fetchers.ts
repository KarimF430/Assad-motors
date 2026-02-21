// Shared data fetching utilities for consistent data across all pages
// This ensures Popular Cars and New Launches are identical everywhere

interface Car {
    id: string
    name: string
    brand: string
    brandName: string
    image: string
    startingPrice: number
    lowestPriceFuelType?: string
    fuelTypes: string[]
    transmissions: string[]
    seating: number
    launchDate: string
    slug: string
    isNew: boolean
    isPopular: boolean
    popularRank?: number | null
    newRank?: number | null
}

// Helper function to normalize fuel types
const normalizeFuelType = (fuel: string): string => {
    const lower = fuel.toLowerCase()
    if (lower === 'petrol') return 'Petrol'
    if (lower === 'diesel') return 'Diesel'
    if (lower === 'cng') return 'CNG'
    if (lower === 'electric') return 'Electric'
    if (lower === 'hybrid') return 'Hybrid'
    return fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase()
}

// Helper function to normalize transmission types
const normalizeTransmission = (transmission: string): string => {
    const lower = transmission.toLowerCase()
    if (lower === 'manual') return 'Manual'
    if (lower === 'automatic') return 'Automatic'
    if (lower === 'amt') return 'AMT'
    if (lower === 'cvt') return 'CVT'
    if (lower === 'dct') return 'DCT'
    if (lower === 'torque converter') return 'Automatic'
    return transmission.toUpperCase()
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

/**
 * Fetch popular cars with consistent formatting
 * This is the single source of truth for popular cars across the entire project
 */
export async function getPopularCars(limit: number = 10): Promise<Car[]> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5001'

    try {
        const popularRes = await fetch(`${backendUrl}/api/cars/popular?limit=${limit}`, {
            next: { revalidate: 3600 },
            cache: 'force-cache'
        })

        if (!popularRes.ok) {
            console.error('Failed to fetch popular cars:', popularRes.status)
            return []
        }

        const popularData = await popularRes.json()

        const popularCars: Car[] = Array.isArray(popularData) ? popularData.map((car: any) => ({
            id: car.id,
            name: car.name,
            brand: car.brandId,
            brandName: car.brandName,
            image: car.image ? (car.image.startsWith('http') ? car.image : `${backendUrl}${car.image}`) : '',
            startingPrice: car.startingPrice,
            popularRank: car.popularRank ?? null,
            newRank: car.newRank ?? null,
            lowestPriceFuelType: car.lowestPriceFuelType,
            fuelTypes: (car.fuelTypes || ['Petrol']).map(normalizeFuelType),
            transmissions: (car.transmissions || ['Manual']).map(normalizeTransmission),
            seating: car.seating,
            launchDate: car.launchDate ? `Launched ${formatLaunchDate(car.launchDate)}` : 'Launched',
            slug: `${car.brandName.toLowerCase().replace(/\s+/g, '-')}-${car.name.toLowerCase().replace(/\s+/g, '-')}`,
            isNew: car.isNew,
            isPopular: car.isPopular,
        })) : []

        return popularCars
    } catch (error) {
        console.error('Error fetching popular cars:', error)
        return []
    }
}

/**
 * Fetch new launched cars with consistent formatting
 * This is the single source of truth for new launches across the entire project
 */
export async function getNewLaunches(limit: number = 10): Promise<Car[]> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5001'

    try {
        // Fetch models and brands
        const [modelsRes, brandsRes] = await Promise.all([
            fetch(`${backendUrl}/api/models-with-pricing?limit=100`, {
                next: { revalidate: 3600 },
                cache: 'force-cache'
            }),
            fetch(`${backendUrl}/api/brands`, {
                next: { revalidate: 3600 },
                cache: 'force-cache'
            }),
        ])

        if (!modelsRes.ok || !brandsRes.ok) {
            console.error('Failed to fetch new launches data')
            return []
        }

        const modelsData = await modelsRes.json()
        const brandsData = await brandsRes.json()

        const models = modelsData.data || modelsData
        const brands = brandsData

        // Create brand map
        const brandMap = brands.reduce((acc: any, brand: any) => {
            acc[brand.id] = brand.name
            return acc
        }, {})

        // Process all cars
        const allCars: Car[] = Array.isArray(models) ? models.map((model: any) => {
            const brandName = brandMap[model.brandId] || 'Unknown'
            return {
                id: model.id,
                name: model.name,
                brand: model.brandId,
                brandName: brandName,
                image: model.heroImage ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`) : '/car-placeholder.jpg',
                startingPrice: model.lowestPrice || 0,
                fuelTypes: (model.fuelTypes || ['Petrol']).map(normalizeFuelType),
                transmissions: (model.transmissions || ['Manual']).map(normalizeTransmission),
                seating: 5,
                launchDate: model.launchDate || 'Launched',
                slug: `${brandName.toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                isNew: model.isNew || false,
                isPopular: model.isPopular || false,
                newRank: model.newRank ?? null
            }
        }) : []

        // Filter and sort new launched cars, then limit
        const newLaunchedCars = allCars
            .filter(car => car.isNew)
            .sort((a, b) => (a.newRank || 999) - (b.newRank || 999))
            .slice(0, limit) // Limit to specified number

        return newLaunchedCars
    } catch (error) {
        console.error('Error fetching new launches:', error)
        return []
    }
}

export type { Car }
