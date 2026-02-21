'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Calendar, Fuel } from 'lucide-react'

interface UpcomingCar {
    id: string
    name: string
    brand: string
    brandName: string
    image: string
    expectedPriceMin: number
    expectedPriceMax: number
    fuelTypes: string[]
    expectedLaunchDate: string
    bodyType?: string
    isNew: boolean
    isPopular: boolean
    isUpcoming: boolean
}

interface UpcomingCarsClientProps {
    initialCars: UpcomingCar[]
    dynamicDescription: string
}

const bodyTypeFilters = ['All', 'SUV', 'Sedan', 'Hatchback', 'MPV', 'Coupe']

// UpcomingCarCard - matches budget page UI style
function UpcomingCarCard({ car }: { car: UpcomingCar }) {
    const displayPrice = car.expectedPriceMin > 0
        ? `₹ ${(car.expectedPriceMin / 100000).toFixed(2)} - ${(car.expectedPriceMax / 100000).toFixed(2)} Lakh`
        : 'Price TBA'

    return (
        <Link
            href={`/${car.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${car.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="block group"
        >
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="flex min-h-[144px] sm:min-h-[176px]">
                    <div className="w-32 sm:w-48 flex-shrink-0 relative overflow-hidden rounded-l-lg">
                        <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                    const fallback = document.createElement('div')
                                    fallback.className = 'bg-gray-200 text-gray-600 text-xs sm:text-sm font-semibold text-center flex items-center justify-center h-full p-1'
                                    fallback.innerHTML = car.name
                                    parent.appendChild(fallback)
                                }
                            }}
                        />
                        <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded z-10">
                            UPCOMING
                        </span>
                    </div>

                    <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col justify-between min-w-0">
                        <div>
                            <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                                <div className="flex-1 pr-1 sm:pr-2 min-w-0">
                                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                        <span className="truncate block">{car.brandName} {car.name}</span>
                                    </h3>
                                </div>
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5 sm:mt-1" />
                            </div>

                            <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                                <span className="font-semibold text-green-600 text-xs sm:text-sm whitespace-nowrap">Expected {car.expectedLaunchDate}</span>
                            </div>

                            <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                                <Fuel className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-600 text-xs sm:text-sm">{car.fuelTypes.join('/')}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                                <span className="text-base sm:text-xl md:text-2xl font-bold text-red-600">{displayPrice}</span>
                                <span className="text-gray-500 text-xs sm:text-sm">(Expected)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function UpcomingCarsClient({
    initialCars,
    dynamicDescription
}: UpcomingCarsClientProps) {
    const [selectedBodyType, setSelectedBodyType] = useState<string>('All')
    const [isExpanded, setIsExpanded] = useState(false)

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Parse description
    let shortText = "Stay ahead with upcoming cars launching in India! Get exclusive early access to expected prices and launch dates."
    let extendedText = ''
    try {
        const parsed = JSON.parse(dynamicDescription)
        shortText = parsed.short || shortText
        extendedText = parsed.extended || ''
    } catch {
        // Plain text fallback
    }

    // Apply filters
    const filteredCars = initialCars.filter(car => {
        if (selectedBodyType !== 'All') {
            if (!car.bodyType || car.bodyType.toLowerCase() !== selectedBodyType.toLowerCase()) return false
        }
        return true
    })

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Upcoming Cars in India
                </h1>
                <div className="text-gray-600 mb-6">
                    <p className={isExpanded ? '' : 'line-clamp-2'}>
                        {shortText}
                        {isExpanded && extendedText}
                    </p>
                    {extendedText && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-red-600 font-medium hover:text-red-700 transition-colors"
                        >
                            {isExpanded ? '...show less' : '...read more'}
                        </button>
                    )}
                </div>

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

            {filteredCars.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No upcoming cars found matching your filters.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredCars.map((car) => (
                        <UpcomingCarCard key={car.id} car={car} />
                    ))}
                </div>
            )}
        </>
    )
}
