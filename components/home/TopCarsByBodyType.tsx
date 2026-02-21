'use client'

import React, { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Car, CarFront } from 'lucide-react'
import CarCard from './CarCard'
import { OptimizedImage } from '@/components/common/OptimizedImage'

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
    topRank?: number | null
    popularRank?: number | null
}

interface RankedCar extends Car {
    displayRank: number
}

const BODY_TYPES = [
    { id: 'Hatchback', label: 'Hatchback' },
    { id: 'Sedan', label: 'Sedan' },
    { id: 'SUV', label: 'SUV' },
    { id: 'MPV', label: 'MUV' },
    { id: 'Luxury Sedan', label: 'Luxury Sedan' },
    { id: 'Luxury SUV', label: 'Luxury SUV' }
]

export default function TopCarsByBodyType({ initialCars = [] }: { initialCars?: Car[] }) {
    const [selectedBodyType, setSelectedBodyType] = useState('all')
    const scrollRef = useRef<HTMLDivElement>(null)
    const filterRef = useRef<HTMLDivElement>(null)

    // Filter cars by body type and assign rankings
    const rankedCars = useMemo((): RankedCar[] => {
        let filtered = selectedBodyType === 'all'
            ? [...initialCars]
            : initialCars.filter(car => car.bodyType === selectedBodyType)

        // Get cars with explicit topRank (1-10)
        const carsWithTopRank = filtered
            .filter(car => car.topRank && car.topRank >= 1 && car.topRank <= 10)
            .sort((a, b) => (a.topRank || 999) - (b.topRank || 999))

        // Get remaining cars sorted by popularity for filling slots
        const topRankIds = new Set(carsWithTopRank.map(c => c.id))
        const remainingCars = filtered
            .filter(car => !topRankIds.has(car.id))
            .sort((a, b) => {
                if (a.isPopular && !b.isPopular) return -1
                if (!a.isPopular && b.isPopular) return 1
                if (a.popularRank && b.popularRank) return a.popularRank - b.popularRank
                if (a.popularRank && !b.popularRank) return -1
                if (!a.popularRank && b.popularRank) return 1
                return (b.startingPrice || 0) - (a.startingPrice || 0)
            })

        // Combine: topRank cars first, then fill with popular cars up to 10
        const combined = [...carsWithTopRank, ...remainingCars].slice(0, 10)

        return combined.map((car, index) => ({
            ...car,
            displayRank: car.topRank || index + 1
        }))
    }, [initialCars, selectedBodyType])

    const scrollContainer = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 280
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    if (initialCars.length === 0) {
        return null
    }

    return (
        <div>
            {/* Section Header */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Used Cars by Body type
            </h2>

            {/* Compact Horizontal Scrollable Filter Pills */}
            <div
                ref={filterRef}
                className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide mb-6 sm:mb-8 py-4 sm:py-6 px-4 sm:px-8 bg-slate-50 border border-slate-100 rounded-2xl w-full mx-auto justify-start md:justify-center shadow-sm"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {BODY_TYPES.map((type) => {
                    const isActive = selectedBodyType === type.id
                    // Get a representative vehicle image
                    const representativeCar = initialCars.find(c => c.bodyType === type.id && c.isPopular) || initialCars.find(c => c.bodyType === type.id)
                    const fallbackImage = '/car-placeholder.png'
                    const imageUrl = representativeCar?.image || fallbackImage

                    return (
                        <button
                            key={type.id}
                            onClick={() => setSelectedBodyType(type.id)}
                            className={`
                                flex-shrink-0 flex flex-col items-center justify-center transition-all duration-300 min-w-[70px] sm:min-w-[100px] gap-1.5 sm:gap-2
                                ${isActive
                                    ? 'text-[#291e6a] font-bold scale-105'
                                    : 'text-[#291e6a] opacity-70 hover:opacity-100 hover:scale-105'
                                }
                            `}
                        >
                            <div className={`relative w-14 h-9 sm:w-20 sm:h-12 drop-shadow-sm transition-transform duration-300 ${isActive ? 'scale-110' : ''} mix-blend-multiply`}>
                                <OptimizedImage
                                    src={imageUrl}
                                    alt={type.label}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-[11px] sm:text-sm font-semibold tracking-wide">
                                {type.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Cars Horizontal Scroll */}
            <div className="relative">
                {rankedCars.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No cars found in this category.</p>
                    </div>
                ) : (
                    <div className="relative group">
                        {/* Left Scroll Arrow */}
                        <button
                            onClick={() => scrollContainer('left')}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white hover:bg-gray-50 shadow-lg rounded-full items-center justify-center text-gray-500 hover:text-orange-600 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1/2 border border-gray-100"
                            aria-label="Scroll left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Right Scroll Arrow */}
                        <button
                            onClick={() => scrollContainer('right')}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white hover:bg-gray-50 shadow-lg rounded-full items-center justify-center text-gray-500 hover:text-orange-600 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-1/2 border border-gray-100"
                            aria-label="Scroll right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Scrollable Container */}
                        <div
                            ref={scrollRef}
                            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {rankedCars.map((car, idx) => (
                                <div key={car.id} className="relative">
                                    <CarCard
                                        car={car}
                                        index={idx}
                                    />
                                </div>
                            ))}

                            {/* View All Card */}
                            {rankedCars.length > 0 && (
                                <Link
                                    href={selectedBodyType === 'all' ? '/top-selling-cars-in-india' : `/top-selling-cars-in-india?bodyType=${selectedBodyType}`}
                                    className="flex-shrink-0 w-[220px] sm:w-[240px] bg-gradient-to-br from-orange-500 to-red-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                >
                                    <div className="h-full flex flex-col items-center justify-center p-6 text-center min-h-[280px] sm:min-h-[300px]">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">View All</h3>
                                        <p className="text-white/80 text-sm mb-4">
                                            {selectedBodyType === 'all' ? 'Top Cars' : selectedBodyType}
                                        </p>
                                        <div className="px-5 py-2 bg-white text-orange-600 rounded-full font-semibold text-sm">
                                            Explore
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}
