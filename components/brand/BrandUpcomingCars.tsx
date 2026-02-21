'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UpcomingCarCard from '../home/UpcomingCarCard'

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

interface BrandUpcomingCarsProps {
  brandId: string
  brandName: string
}

export default function BrandUpcomingCars({ brandId, brandName }: BrandUpcomingCarsProps) {
  const [upcomingCars, setUpcomingCars] = useState<UpcomingCar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUpcomingCars() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
        const response = await fetch(`${backendUrl}/api/upcoming-cars`)

        if (response.ok) {
          const allUpcomingCars = await response.json()
          // Filter by brandId and map to match UpcomingCar interface
          const brandUpcomingCars = allUpcomingCars
            .filter((car: any) => car.brandId === brandId)
            .map((car: any) => ({
              id: car.id,
              name: car.name,
              brandId: car.brandId,
              brandName: brandName,
              image: car.heroImage || '',
              expectedPriceMin: car.expectedPriceMin,
              expectedPriceMax: car.expectedPriceMax,
              fuelTypes: car.fuelTypes || ['Petrol'],
              expectedLaunchDate: car.expectedLaunchDate,
              isNew: true,
              isPopular: false
            }))
          setUpcomingCars(brandUpcomingCars)
        }
      } catch (error) {
        console.error('Error fetching upcoming cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingCars()
  }, [brandId, brandName])

  // Don't render if no upcoming cars
  if (!loading && upcomingCars.length === 0) {
    return null
  }

  return (
    <div className="py-3 sm:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{brandName} Upcoming Cars</h2>

        {/* Cars Horizontal Scroll */}
        <div className="relative">
          {loading ? (
            <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative group">
              {/* Left Scroll Arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById('brand-upcoming-scroll')
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
                  const container = document.getElementById('brand-upcoming-scroll')
                  container?.scrollBy({ left: 300, behavior: 'smooth' })
                }}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div id="brand-upcoming-scroll" className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {upcomingCars.map((car) => (
                  <UpcomingCarCard
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
              <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
