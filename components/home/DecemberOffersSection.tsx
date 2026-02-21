'use client'

import { useState, useMemo } from 'react'
import OfferCarCard from './OfferCarCard'

interface Car {
    id: string
    name: string
    brand: string
    brandName: string
    image: string
    startingPrice: number
    fuelTypes: string[]
    transmissions: string[]
    seating: number
    launchDate: string
    slug: string
    isNew: boolean
    isPopular: boolean
}

interface Brand {
    id: string
    name: string
    slug: string
    logo?: string
}

interface BrandColors {
    from: string
    to: string
    hover: string
}

interface DecemberOffersSectionProps {
    initialCars?: Car[]
    initialBrands?: Brand[]
}

// Brand-specific color schemes
const BRAND_COLORS: Record<string, BrandColors> = {
    'hyundai': { from: 'from-blue-500', to: 'to-blue-600', hover: 'hover:from-blue-600 hover:to-blue-700' },
    'maruti': { from: 'from-red-500', to: 'to-red-600', hover: 'hover:from-red-600 hover:to-red-700' },
    'suzuki': { from: 'from-red-500', to: 'to-red-600', hover: 'hover:from-red-600 hover:to-red-700' },
    'mahindra': { from: 'from-orange-500', to: 'to-red-500', hover: 'hover:from-orange-600 hover:to-red-600' },
    'tata': { from: 'from-blue-600', to: 'to-indigo-600', hover: 'hover:from-blue-700 hover:to-indigo-700' },
    'toyota': { from: 'from-red-600', to: 'to-red-700', hover: 'hover:from-red-700 hover:to-red-800' },
    'kia': { from: 'from-red-500', to: 'to-red-600', hover: 'hover:from-red-600 hover:to-red-700' },
}

// Get current month name
const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    return months[new Date().getMonth()]
}

export default function DecemberOffersSection({ initialCars = [], initialBrands = [] }: DecemberOffersSectionProps) {
    // Define the 6 brands to show
    const targetBrands = ['hyundai', 'maruti', 'suzuki', 'mahindra', 'tata', 'toyota', 'kia']

    // Find matching brands from the backend data
    const filteredBrands = initialBrands.filter(brand => {
        const brandSlug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-')
        return targetBrands.some(target =>
            brandSlug.includes(target) || brand.name.toLowerCase().includes(target)
        )
    }).slice(0, 6)

    // If no brands from backend, use fallback
    const brands = filteredBrands.length > 0 ? filteredBrands : [
        { id: 'hyundai', name: 'Hyundai', slug: 'hyundai', logo: '' },
        { id: 'maruti-suzuki', name: 'Maruti Suzuki', slug: 'maruti-suzuki', logo: '' },
        { id: 'mahindra', name: 'Mahindra', slug: 'mahindra', logo: '' },
        { id: 'tata', name: 'Tata', slug: 'tata', logo: '' },
        { id: 'toyota', name: 'Toyota', slug: 'toyota', logo: '' },
        { id: 'kia', name: 'Kia', slug: 'kia', logo: '' },
    ]

    const [selectedBrand, setSelectedBrand] = useState(brands[0]?.id || 'hyundai')

    // Get brand color for selected brand
    const getBrandColor = (brandId: string): BrandColors => {
        const brandKey = Object.keys(BRAND_COLORS).find(key => brandId.toLowerCase().includes(key))
        return brandKey ? BRAND_COLORS[brandKey] : { from: 'from-orange-500', to: 'to-red-500', hover: 'hover:from-orange-600 hover:to-red-600' }
    }

    // Filter cars by selected brand - take up to 5 cars per brand
    const carsByBrand = useMemo(() => {
        const selectedBrandData = brands.find(b => b.id === selectedBrand)
        if (!selectedBrandData) return []

        // Match cars based on brand name
        return initialCars
            .filter(car => {
                const carBrandLower = car.brandName.toLowerCase()
                const brandNameLower = selectedBrandData.name.toLowerCase()
                return carBrandLower.includes(brandNameLower) || brandNameLower.includes(carBrandLower)
            })
            .slice(0, 5)
    }, [selectedBrand, initialCars, brands])

    const scrollContainer = (direction: 'left' | 'right') => {
        const container = document.getElementById(`december-offers-${selectedBrand}`)
        if (container) {
            const scrollAmount = 300
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    // Get current month dynamically
    const currentMonth = getCurrentMonth()

    return (
        <div>
            {/* Dynamic month header */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{currentMonth} Offers on Cars</h2>

            {/* Brand Filter Buttons with Logos and Brand Colors */}
            <div
                className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {brands.map((brand) => {
                    const brandColors = getBrandColor(brand.id)
                    const isActive = selectedBrand === brand.id

                    return (
                        <button
                            key={brand.id}
                            onClick={() => setSelectedBrand(brand.id)}
                            className={`
                flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium 
                transition-all duration-200 whitespace-nowrap
                ${isActive
                                    ? `bg-gradient-to-r ${brandColors.from} ${brandColors.to} text-white shadow-md`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                }
              `}
                        >
                            {/* Brand Logo */}
                            {brand.logo && brand.logo.startsWith('http') ? (
                                <img
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                                    style={{ mixBlendMode: 'multiply' }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            ) : null}
                            <span>{brand.name}</span>
                        </button>
                    )
                })}
            </div>

            {/* Cars Horizontal Scroll */}
            <div className="relative">
                {carsByBrand.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No offers found for this brand.</p>
                    </div>
                ) : (
                    <div className="relative group">
                        {/* Left Scroll Arrow */}
                        <button
                            onClick={() => scrollContainer('left')}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                            aria-label="Scroll left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Right Scroll Arrow */}
                        <button
                            onClick={() => scrollContainer('right')}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                            aria-label="Scroll right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <div
                            id={`december-offers-${selectedBrand}`}
                            className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {carsByBrand.map((car, idx) => (
                                <OfferCarCard
                                    key={car.id}
                                    car={car}
                                    index={idx}
                                    discountPercent={15}
                                    onClick={() => {
                                        const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                        const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                        window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                    }}
                                />
                            ))}
                        </div>
                        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
                    </div>
                )}
            </div>
        </div>
    )
}
