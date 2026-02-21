'use client'

import { X, Zap } from 'lucide-react'
import { useFavourites } from '@/lib/favourites-context'
import CarCard from './CarCard'

export default function FavouriteCars() {
    const { favourites, clearAllFavourites } = useFavourites()

    // Don't show section if no favourites
    if (favourites.length === 0) {
        return null
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Favourite Cars
                </h2>

                <button
                    onClick={clearAllFavourites}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                >
                    <X className="h-4 w-4" />
                    Clear All
                </button>
            </div>

            {/* Cars Horizontal Scroll */}
            <div className="relative group">
                {/* Left Scroll Arrow */}
                <button
                    onClick={() => {
                        const container = document.getElementById('favourite-cars-scroll')
                        container?.scrollBy({ left: -300, behavior: 'smooth' })
                    }}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                    aria-label="Scroll left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => {
                        const container = document.getElementById('favourite-cars-scroll')
                        container?.scrollBy({ left: 300, behavior: 'smooth' })
                    }}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                    aria-label="Scroll right"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <div
                    id="favourite-cars-scroll"
                    className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {favourites.map((car, idx) => (
                        <div key={car.id} className="relative">
                            {/* Auto-added badge */}
                            {car.isAutoAdded && (
                                <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    <span className="font-semibold">Smart Pick</span>
                                </div>
                            )}
                            <CarCard
                                car={car}
                                index={idx}
                                onClick={() => {
                                    const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                                    const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                                    window.location.href = `/${brandSlug}-cars/${modelSlug}`
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
            </div>
        </div>
    )
}
