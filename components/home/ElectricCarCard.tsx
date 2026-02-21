'use client'

import React from 'react'

import { Heart, Fuel, Zap } from 'lucide-react'
import { useFavourites } from '@/lib/favourites-context'
import { OptimizedImage } from '@/components/common/OptimizedImage'

interface ElectricCar {
    id: string
    name: string
    brand: string
    brandName: string
    image: string
    startingPrice: number
    range?: string // e.g., "500-600 km"
    fuelTypes: string[]
    seating: number
    slug: string
    isNew: boolean
    isPopular: boolean
}

interface ElectricCarCardProps {
    car: ElectricCar
    index?: number
    onClick: () => void
}

export default function ElectricCarCard({ car, index, onClick }: ElectricCarCardProps) {
    const { isFavourite, toggleFavourite } = useFavourites()
    const [mounted, setMounted] = React.useState(false)
    const isFav = mounted ? isFavourite(car.id) : false

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Get on-road price
    

    const displayPrice = car.startingPrice
    const priceLabel = 'Price'

    // Default range for electric cars
    const displayRange = car.range || '400-500 km'

    return (
        <div
            onClick={onClick}
            className="flex-shrink-0 w-[260px] sm:w-72 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:shadow-lg active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer group"
        >
            {/* Image Container - Green tint background */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-emerald-50 to-green-100 overflow-hidden">
                {/* New/Popular Badge */}
                {car.isNew && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-10 shadow-md">
                        NEW
                    </div>
                )}
                {car.isPopular && !car.isNew && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-10 shadow-md">
                        POPULAR
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleFavourite(car as any)
                    }}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-200 z-10 ${isFav
                        ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                        : 'bg-white hover:bg-red-50 active:bg-red-100'
                        }`}
                >
                    <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${isFav ? 'text-white' : 'text-gray-400 hover:text-red-500'
                            }`}
                        fill={isFav ? 'currentColor' : 'none'}
                    />
                </button>

                {/* Car Image */}
                <div className="w-full h-full flex items-center justify-center relative">
                    {car.image ? (
                        <OptimizedImage
                            src={car.image}
                            alt={`${car.brandName} ${car.name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                            className="object-contain p-2"
                            priority={index !== undefined ? index < 2 : (car.isPopular || car.isNew)}
                        />
                    ) : (
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='#065f46' className="w-3/4 h-3/4">
                            <path d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z' />
                            <circle cx='100' cy='220' r='25' fill='#111827' />
                            <circle cx='300' cy='220' r='25' fill='#111827' />
                            <path d='M80 110h240l-20-30H100z' fill='#10b981' />
                        </svg>
                    )}
                </div>
            </div>

            {/* Car Info */}
            <div className="p-4 sm:p-5">
                <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg truncate" title={`${car.brandName} ${car.name}`}>
                    {car.brandName} {car.name}
                </h3>

                <div className="flex flex-col mb-3 sm:mb-4">
                    <div className="flex items-baseline">
                        <span className="text-emerald-600 font-bold text-lg sm:text-xl">₹ {(displayPrice / 100000).toFixed(2)} Lakh</span>
                        <span className="text-gray-500 text-xs sm:text-sm ml-2">Onwards</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{priceLabel}</span>
                </div>

                <div className="space-y-2 sm:space-y-2.5 text-sm text-gray-600 mb-3 sm:mb-4">
                    <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-2 sm:mr-3 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">Electric</span>
                    </div>
                    <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-2 sm:mr-3 text-emerald-500 flex-shrink-0" />
                        <span className="truncate text-emerald-600 font-medium">{displayRange} Range</span>
                    </div>
                </div>

                <button
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg transform group-hover:scale-105"
                >
                    View Details
                </button>
            </div>
        </div>
    )
}
