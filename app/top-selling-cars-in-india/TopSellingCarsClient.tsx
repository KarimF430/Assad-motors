'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import CarGrid from '@/components/common/CarGrid'
import HorizontalCarCard from '@/components/common/HorizontalCarCard'
import CarCard from '@/components/home/CarCard'

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
    bodyType?: string
    rating?: number
    reviews?: number
    variants?: number
}

interface TopSellingCarsClientProps {
    carsByBodyType: Record<string, Car[]>
    popularCars: Car[]
    newLaunchedCars: Car[]
    dynamicDescription: string
}

const bodyTypeFilters = ['All', 'SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe']



export default function TopSellingCarsClient({
    carsByBodyType,
    popularCars,
    newLaunchedCars,
    dynamicDescription
}: TopSellingCarsClientProps) {
    const [selectedBodyType, setSelectedBodyType] = useState<string>('All')
    const [isExpanded, setIsExpanded] = useState(false)

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Parse description - supports both JSON format and plain text
    let shortText = "Discover India's most popular cars! Browse our curated list of top-selling models featuring unbeatable value, trusted reliability, and impressive performance."
    let extendedText = ''
    try {
        const parsed = JSON.parse(dynamicDescription)
        shortText = parsed.short || shortText
        extendedText = parsed.extended || ''
    } catch {
        // Plain text fallback
    }

    // Get cars for selected body type
    const filteredCars = carsByBodyType[selectedBodyType] || []

    return (
        <>
            {/* Header & Filters */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Top Selling Cars in India {new Date().getFullYear()}
                </h1>
                <div className="text-gray-600 mb-6">
                    <p className={isExpanded ? 'mb-4' : 'line-clamp-2'}>{shortText}</p>
                    {isExpanded && (
                        <div
                            className="mt-4 animate-fadeIn"
                            dangerouslySetInnerHTML={{ __html: extendedText }}
                        />
                    )}
                    {extendedText && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-red-600 font-medium hover:text-red-700 transition-colors mt-2"
                        >
                            {isExpanded ? '...show less' : '...read more'}
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200">
                    {bodyTypeFilters.map(bodyType => (
                        <button
                            key={bodyType}
                            onClick={() => setSelectedBodyType(bodyType)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedBodyType === bodyType
                                ? 'bg-[#291e6a] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {bodyType}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cars List */}
            {filteredCars.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No cars found for this category.</p>
                </div>
            ) : (
                <CarGrid>
                    {filteredCars.map((car) => (
                        <HorizontalCarCard key={car.id} car={car} />
                    ))}
                </CarGrid>
            )}

            {/* Popular Cars */}
            {popularCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Most Popular Cars in India {new Date().getFullYear()}</h2>
                    <div className="relative group">
                        <button
                            onClick={() => {
                                const container = document.getElementById('top-selling-popular-scroll')
                                container?.scrollBy({ left: -300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const container = document.getElementById('top-selling-popular-scroll')
                                container?.scrollBy({ left: 300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div id="top-selling-popular-scroll" className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {popularCars.map((car) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    onClick={() => {
                                        const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                        const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                        window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* New Launches */}
            {newLaunchedCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Newly Launched Cars in India {new Date().getFullYear()}</h2>
                    <div className="relative group">
                        <button
                            onClick={() => {
                                const container = document.getElementById('top-selling-new-scroll')
                                container?.scrollBy({ left: -300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                const container = document.getElementById('top-selling-new-scroll')
                                container?.scrollBy({ left: 300, behavior: 'smooth' })
                            }}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div id="top-selling-new-scroll" className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {newLaunchedCars.map((car) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    onClick={() => {
                                        const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                        const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                        window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
