'use client'

import React from 'react'
import { Fuel, Gauge, ExternalLink } from 'lucide-react'
import { OptimizedImage } from '@/components/common/OptimizedImage'

interface Car {
    id: string
    name: string
    brand: string
    brandName: string
    image: string
    startingPrice: number
    fuelTypes: string[]
    transmissions: string[]
    slug: string
}

interface UsedCarCardProps {
    car: Car
    city: string
}

// Platform configurations with URL patterns
const platforms = [
    {
        name: 'Cars24',
        color: 'bg-blue-600 hover:bg-blue-700',
        buildUrl: (brand: string, model: string, city: string) =>
            `https://www.cars24.com/buy-used-${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-cars-${city.toLowerCase()}/`
    },
    {
        name: 'Spinny',
        color: 'bg-purple-600 hover:bg-purple-700',
        buildUrl: (brand: string, model: string, city: string) =>
            `https://www.spinny.com/buy-used-cars-${city.toLowerCase()}/s/${brand.toLowerCase()}_${model.toLowerCase().replace(/\s+/g, '-')}/`
    },
    {
        name: 'OLX',
        color: 'bg-green-600 hover:bg-green-700',
        buildUrl: (brand: string, model: string, city: string) =>
            `https://www.olx.in/${city.toLowerCase()}/cars_c84?filter=make_eq_${brand.toLowerCase()}`
    },
    {
        name: 'CarWale',
        color: 'bg-orange-600 hover:bg-orange-700',
        buildUrl: (brand: string, model: string, city: string) =>
            `https://www.carwale.com/used/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-cars-in-${city.toLowerCase()}/`
    },
    {
        name: 'CarDekho',
        color: 'bg-red-600 hover:bg-red-700',
        buildUrl: (brand: string, model: string, city: string) =>
            `https://www.cardekho.com/used-cars+${brand.toLowerCase()}+${model.toLowerCase().replace(/\s+/g, '+')}+in+${city.toLowerCase()}`
    }
]

// Helper function to format fuel type
const formatFuelType = (fuel: string): string => {
    const lower = fuel.toLowerCase()
    if (lower === 'cng') return 'CNG'
    if (lower === 'petrol') return 'Petrol'
    if (lower === 'diesel') return 'Diesel'
    if (lower === 'electric') return 'Electric'
    return fuel
}

// Helper function to format transmission
const formatTransmission = (transmission: string): string => {
    const lower = transmission.toLowerCase()
    if (lower === 'manual') return 'Manual'
    if (lower === 'automatic') return 'Automatic'
    return transmission.toUpperCase()
}

export default function UsedCarCard({ car, city }: UsedCarCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Image Container */}
            <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {/* Used Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-md">
                    FIND USED
                </div>

                {/* Car Image */}
                <div className="w-full h-full flex items-center justify-center relative">
                    {car.image ? (
                        <OptimizedImage
                            src={car.image}
                            alt={`${car.brandName} ${car.name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
                            className="object-contain p-2"
                        />
                    ) : (
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='#374151' className="w-3/4 h-3/4">
                            <path d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z' />
                            <circle cx='100' cy='220' r='25' fill='#111827' />
                            <circle cx='300' cy='220' r='25' fill='#111827' />
                            <path d='M80 110h240l-20-30H100z' fill='#6B7280' />
                        </svg>
                    )}
                </div>
            </div>

            {/* Car Info */}
            <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 text-lg truncate" title={`${car.brandName} ${car.name}`}>
                    {car.brandName} {car.name}
                </h3>

                <div className="flex flex-col mb-3">
                    <div className="flex items-baseline">
                        <span className="text-gray-600 text-sm">New Price:</span>
                        <span className="text-gray-900 font-semibold text-base ml-2">₹{(car.startingPrice / 100000).toFixed(2)}L</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">Used prices vary by condition & year</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-600">
                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                        <Fuel className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{(car.fuelTypes || ['Petrol']).map(f => formatFuelType(f)).join('/')}</span>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                        <Gauge className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{(car.transmissions || ['Manual']).map(t => formatTransmission(t)).join('/')}</span>
                    </div>
                </div>

                {/* Platform Buttons */}
                <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 flex items-center">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Find Used on:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {platforms.slice(0, 4).map((platform) => (
                            <a
                                key={platform.name}
                                href={platform.buildUrl(car.brandName, car.name, city)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${platform.color} text-white text-xs font-medium py-2 px-3 rounded-lg text-center transition-all duration-200 shadow-sm hover:shadow-md`}
                            >
                                {platform.name}
                            </a>
                        ))}
                    </div>
                    {/* Fifth platform as full width */}
                    <a
                        href={platforms[4].buildUrl(car.brandName, car.name, city)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${platforms[4].color} text-white text-xs font-medium py-2 px-3 rounded-lg text-center transition-all duration-200 shadow-sm hover:shadow-md block`}
                    >
                        {platforms[4].name}
                    </a>
                </div>
            </div>
        </div>
    )
}
