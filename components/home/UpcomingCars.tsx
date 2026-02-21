'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UpcomingCarCard from './UpcomingCarCard'

interface UpcomingCar {
  id: string
  name: string
  brandId: string
  brandName: string
  image: string
  expectedPriceMin: number
  expectedPriceMax: number
  fuelTypes: string[]
  expectedLaunchDate: string
  isNew: boolean
  isPopular: boolean
}

export default function UpcomingCars({ initialCars = [] }: { initialCars?: UpcomingCar[] }) {
  const upcomingCars = initialCars

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Upcoming Cars</h2>

      {/* Cars Horizontal Scroll */}
      <div className="relative">
        {upcomingCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No upcoming cars found.</p>
          </div>
        ) : (
          <div className="relative group">
            {/* Left Scroll Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('upcoming-cars-scroll')
                container?.scrollBy({ left: -300, behavior: 'smooth' })
              }}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('upcoming-cars-scroll')
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
              id="upcoming-cars-scroll"
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {upcomingCars.slice(0, 10).map((car, idx) => (
                <UpcomingCarCard
                  key={car.id}
                  car={car}
                  index={idx}
                  onClick={() => {
                    const brandSlug = car.brandName.toLowerCase().replace(/\s+/g, '-')
                    const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
                    window.location.href = `/${brandSlug}-cars/${modelSlug}`
                  }}
                />
              ))}

              {/* View All Card */}
              {upcomingCars.length > 0 && (
                <Link
                  key="view-all-upcoming"
                  href="/upcoming-cars-in-india"
                  className="flex-shrink-0 w-[220px] sm:w-[240px] bg-gradient-to-br from-[#291e6a] to-red-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center min-h-[280px] sm:min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">View All</h3>
                    <p className="text-white/80 text-sm mb-4">Upcoming Cars</p>
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
