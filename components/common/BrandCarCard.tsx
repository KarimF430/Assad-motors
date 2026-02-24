'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Fuel, Settings, Gauge, Banknote } from 'lucide-react'
import { useFavourites } from '@/lib/favourites-context'
import { OptimizedImage } from '@/components/common/OptimizedImage'

export interface Car {
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
    rating?: number
    reviews?: number
    variants?: number
    variantName?: string
}

// Helper function to format transmission
const formatTransmission = (transmission: string): string => {
    const lower = transmission.toLowerCase()
    if (lower === 'manual') return 'Manual'
    if (lower === 'automatic') return 'Automatic'
    return transmission.toUpperCase()
}

// Helper function to format fuel type
const formatFuelType = (fuel: string): string => {
    const lower = fuel.toLowerCase()
    if (lower === 'cng') return 'CNG'
    if (lower === 'petrol') return 'Petrol'
    if (lower === 'diesel') return 'Diesel'
    if (lower === 'electric') return 'Electric'
    return fuel
}

// BrandCarCard - Vertical card matching brand page CarCard design
export function BrandCarCard({ car, index = 0 }: { car: Car; index?: number }) {
    const { isFavourite, toggleFavourite } = useFavourites()
    const [mounted, setMounted] = useState(false)
    const isFav = mounted ? isFavourite(car.id) : false

    useEffect(() => {
        setMounted(true)
    }, [])

    const displayPrice = car.startingPrice
    const kmDriven = "70,000"
    const variantText = car.variantName || "LXI"
    const emiEstimation = Math.round((displayPrice * 0.85 * 0.09) / 12 + (displayPrice * 0.85) / 60).toLocaleString('en-IN')

    const brandSlug = car.brandName?.toLowerCase().replace(/\s+/g, '-') || ''
    const modelSlug = car.name?.toLowerCase().replace(/\s+/g, '-') || ''
    const carHref = `/${brandSlug}-cars/${modelSlug}`

    return (
        <Link
            href={carHref}
            className="flex flex-col bg-white rounded-xl border border-gray-200 hover:shadow-lg active:scale-[0.98] transition-all duration-300 overflow-hidden cursor-pointer group"
        >
            {/* Image Container */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavourite(car)
                    }}
                    aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-200 z-10 ${isFav
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-white hover:bg-red-50'
                        }`}
                >
                    <Heart
                        className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${isFav ? 'text-white' : 'text-gray-400 hover:text-red-500'}`}
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
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain p-2"
                            priority={index < 2}
                        />
                    ) : (
                        <div className="bg-gray-200 text-gray-600 text-sm font-semibold text-center flex items-center justify-center h-full w-full p-2">
                            {car.brandName} {car.name}
                        </div>
                    )}
                </div>
            </div>

            {/* Car Info */}
            <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base truncate" title={`${car.brandName} ${car.name} ${variantText}`}>
                        {(() => {
                            const yearMatch = car.launchDate?.match(/\d{4}/);
                            return yearMatch ? <span className="mr-1">{yearMatch[0]}</span> : null;
                        })()}
                        {car.brandName} {car.name} <span className="font-medium text-gray-500 text-xs sm:text-sm ml-1">{variantText}</span>
                    </h3>

                    <div className="flex items-baseline mb-3 mt-1">
                        <span className="text-red-600 font-bold text-base sm:text-lg">₹ {(displayPrice / 100000).toFixed(2)} Lakh</span>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-1.5 text-[11px] sm:text-sm text-gray-600 mb-3 bg-slate-50 rounded-lg p-2 sm:p-3 border border-slate-100">
                        <div className="flex items-center overflow-hidden" title="Fuel Type">
                            <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate font-medium">{formatFuelType((car.fuelTypes || ['Petrol'])[0])}</span>
                        </div>
                        <div className="flex items-center overflow-hidden" title="Transmission">
                            <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate font-medium">{formatTransmission((car.transmissions || ['Manual'])[0])}</span>
                        </div>
                        <div className="flex items-center overflow-hidden" title="Kilometers Driven">
                            <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate font-medium">70,000 km</span>
                        </div>
                        <div className="flex items-center overflow-hidden" title="EMI starts at">
                            <Banknote className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate font-bold text-gray-900 text-[11px] sm:text-xs">
                                ₹{emiEstimation}/m
                            </span>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg text-center">
                    View Details
                </div>
            </div>
        </Link>
    )
}
