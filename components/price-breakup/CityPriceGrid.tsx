'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'
import { getNearbyCities, CITY_COORDINATES } from '@/lib/city-coordinates'

interface CityPriceGridProps {
    brandSlug: string
    modelSlug: string
    brandName: string
    modelName: string
    basePrice: number // Ex-showroom price
    fuelType: string
    currentCity: string
}

export default function CityPriceGrid({
    brandSlug,
    modelSlug,
    brandName,
    modelName,
    basePrice,
    fuelType,
    currentCity
}: CityPriceGridProps) {
    // Get nearby cities within 250km and calculate prices
    const cityPrices = useMemo(() => {
        const currentCitySlug = currentCity.toLowerCase().replace(/\s+/g, '-').replace(/,.*$/, '')

        // Get nearby cities within 250km radius
        const nearbyCities = getNearbyCities(currentCitySlug, 250, 8)

        // Calculate on-road prices for each city
        return nearbyCities.map(city => {
            const breakup = { totalOnRoadPrice: basePrice }
            return {
                ...city,
                onRoadPrice: breakup.totalOnRoadPrice
            }
        })
    }, [basePrice, fuelType, currentCity])

    if (!basePrice || cityPrices.length === 0) return null

    // Get display name for current city
    const currentCityName = currentCity.split(',')[0]

    return (
        <div>
            {/* Section Header */}
            <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {brandName} {modelName} Price in Nearby Cities
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Compare on-road prices in cities within 250km of {currentCityName}
                </p>
            </div>

            {/* City Price Grid - 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {cityPrices.map((city) => (
                    <Link
                        key={city.slug}
                        href={`/${brandSlug}-cars/${modelSlug}/price-in/${city.slug}`}
                        className="group block p-4 rounded-xl border border-gray-200 hover:border-[#4a3d9e] hover:shadow-md transition-all bg-white"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-gray-400 group-hover:text-[#291e6a] transition-colors" />
                            <span className="font-semibold text-gray-900 text-sm">{city.name}</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-lg font-bold text-gray-900">₹{(city.onRoadPrice / 100000).toFixed(2)} Lakhs</span>
                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#291e6a] transition-colors" />
                        </div>
                        <span className="text-xs text-gray-500">Price</span>
                    </Link>
                ))}
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-400 mt-5">
                * Prices are approximate and may vary based on RTO charges and local taxes
            </p>
        </div>
    )
}
