'use client'

import { useState } from 'react'
import Link from 'next/link'
import CarCard from './CarCard'

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
  popularRank: number | null
}

interface ExploreFuelCarsProps {
  initialCars?: Car[]
  title: string
  fuelType: string
  showFilters?: boolean
}

export default function ExploreFuelCars({ initialCars = [], title, fuelType, showFilters = true }: ExploreFuelCarsProps) {
  const [transmissionFilter, setTransmissionFilter] = useState<'all' | 'Automatic' | 'Manual'>('all')

  const popularCars = initialCars.filter(car => {
    const isFuelTarget = car.fuelTypes && car.fuelTypes.includes(fuelType)
    const matchesTransmission = !showFilters || transmissionFilter === 'all' || (car.transmissions && car.transmissions.includes(transmissionFilter))
    return isFuelTarget && matchesTransmission
  })

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('popular-cars-scroll')
    if (container) {
      const scrollAmount = 300
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>

        {/* Transmission Segmented Control */}
        {showFilters && (
          <div className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex bg-[#F1F5F9] p-1.5 rounded-[14px] mt-2 sm:mt-0">
            <button
              onClick={() => setTransmissionFilter('all')}
              className={`py-2 px-2 sm:px-8 text-[13px] sm:text-base font-semibold rounded-[10px] transition-all duration-300 ${transmissionFilter === 'all'
                ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[#DC2626]'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setTransmissionFilter('Automatic')}
              className={`py-2 px-2 sm:px-8 text-[13px] sm:text-base font-semibold rounded-[10px] transition-all duration-300 ${transmissionFilter === 'Automatic'
                ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[#DC2626]'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Automatic
            </button>
            <button
              onClick={() => setTransmissionFilter('Manual')}
              className={`py-2 px-2 sm:px-8 text-[13px] sm:text-base font-semibold rounded-[10px] transition-all duration-300 ${transmissionFilter === 'Manual'
                ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[#DC2626]'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Manual
            </button>
          </div>
        )}
      </div>

      {/* Cars Horizontal Scroll */}
      <div className="relative">
        {popularCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No popular cars found.</p>
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
              id="popular-cars-scroll"
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularCars.slice(0, 10).map((car, idx) => (
                <CarCard
                  key={car.id}
                  car={car}
                  index={idx}
                />
              ))}

              {/* View All Card */}
              {popularCars.length > 0 && (
                <Link
                  key="view-all-popular"
                  href={`/fuel-cars/${fuelType.toLowerCase()}`}
                  className="flex-shrink-0 w-[220px] sm:w-[240px] bg-gradient-to-br from-[#291e6a] to-red-500 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center min-h-[280px] sm:min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">View All</h3>
                    <p className="text-white/80 text-sm mb-4">{title}</p>
                    <div className="px-5 py-2 bg-white text-[#1c144a] rounded-full font-semibold text-sm">
                      Explore
                    </div>
                  </div>
                </Link>
              )}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
          </div>
        )}
      </div>
    </div>
  )
}
