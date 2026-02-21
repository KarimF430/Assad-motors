'use client'

import { useState, useMemo, useEffect } from 'react'
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
}

// Budget range IDs
type BudgetRangeId = 'under-10' | 'under-15' | 'under-20' | 'under-25' | 'under-30' | 'under-40' | 'under-50' | 'under-60' | 'under-80' | 'under-100' | 'above-100'

interface BudgetRange {
  id: BudgetRangeId
  label: string
  min: number
  max: number
  urlSlug: string
}

interface CarsByBudgetProps {
  allCars: Car[]
}

/**
 * ✅ DYNAMIC BUDGET FILTERS: Cars by Budget Section
 * 
 * Features:
 * 1. Only shows budget ranges that have cars in the database
 * 2. Automatically selects the first available budget range
 * 3. Dynamically updates when new cars are added
 * 4. Full SEO support - all content is server-rendered
 */
export default function CarsByBudget({ allCars }: CarsByBudgetProps) {
  // All possible budget ranges
  const allBudgetRanges: BudgetRange[] = [
    { id: 'under-10', label: 'Under ₹10 Lakh', min: 0, max: 1000000, urlSlug: '10' },
    { id: 'under-15', label: '₹10-15 Lakh', min: 1000001, max: 1500000, urlSlug: '15' },
    { id: 'under-20', label: '₹15-20 Lakh', min: 1500001, max: 2000000, urlSlug: '20' },
    { id: 'under-25', label: '₹20-25 Lakh', min: 2000001, max: 2500000, urlSlug: '25' },
    { id: 'under-30', label: '₹25-30 Lakh', min: 2500001, max: 3000000, urlSlug: '30' },
    { id: 'under-40', label: '₹30-40 Lakh', min: 3000001, max: 4000000, urlSlug: '40' },
    { id: 'under-50', label: '₹40-50 Lakh', min: 4000001, max: 5000000, urlSlug: '50' },
    { id: 'under-60', label: '₹50-60 Lakh', min: 5000001, max: 6000000, urlSlug: '60' },
    { id: 'under-80', label: '₹60-80 Lakh', min: 6000001, max: 8000000, urlSlug: '80' },
    { id: 'under-100', label: '₹80L-1 Cr', min: 8000001, max: 10000000, urlSlug: '1-crore' },
    { id: 'above-100', label: 'Above ₹1 Crore', min: 10000001, max: Infinity, urlSlug: 'above-1-crore' },
  ]

  // Calculate which budget ranges have cars (memoized for performance)
  const availableBudgetRanges = useMemo(() => {
    return allBudgetRanges.filter(range => {
      // Count cars in this range
      const carsInRange = allCars.filter(car => {
        const price = car.startingPrice
        return price >= range.min && price <= range.max
      })
      return carsInRange.length > 0
    })
  }, [allCars])

  // Get the first available range or default to 'under-10'
  const defaultRange = availableBudgetRanges.length > 0 ? availableBudgetRanges[0].id : 'under-10'

  const [selectedBudget, setSelectedBudget] = useState<BudgetRangeId>(defaultRange)

  // Update selected budget if it becomes unavailable (e.g., after data refresh)
  useEffect(() => {
    const isSelectedAvailable = availableBudgetRanges.some(r => r.id === selectedBudget)
    if (!isSelectedAvailable && availableBudgetRanges.length > 0) {
      setSelectedBudget(availableBudgetRanges[0].id)
    }
  }, [availableBudgetRanges, selectedBudget])

  // Filter cars based on selected budget range
  const selectedRange = allBudgetRanges.find(b => b.id === selectedBudget)
  const currentCars = allCars.filter(car => {
    const price = car.startingPrice
    if (!selectedRange) return false
    return price >= selectedRange.min && price <= selectedRange.max
  }).slice(0, 10) // Limit to 10 cars, 11th is "See More" card

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById(`budget-cars-${selectedBudget}`)
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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Used Cars by Budget</h2>

      {/* Budget Filter Buttons with Scroll Arrows */}
      <div className="relative group/filters mb-5">
        {/* Left Scroll Arrow for Filters */}
        <button
          onClick={() => {
            const container = document.getElementById('budget-filters-scroll')
            if (container) {
              container.scrollBy({ left: -200, behavior: 'smooth' })
            }
          }}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover/filters:opacity-100 -ml-4"
          aria-label="Scroll filters left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Scroll Arrow for Filters */}
        <button
          onClick={() => {
            const container = document.getElementById('budget-filters-scroll')
            if (container) {
              container.scrollBy({ left: 200, behavior: 'smooth' })
            }
          }}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover/filters:opacity-100 -mr-4"
          aria-label="Scroll filters right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          id="budget-filters-scroll"
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availableBudgetRanges.map((budget) => (
            <button
              key={budget.id}
              onClick={() => setSelectedBudget(budget.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium 
                transition-all duration-200 whitespace-nowrap
                ${selectedBudget === budget.id
                  ? 'bg-gradient-to-r from-[#291e6a] to-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }
              `}
            >
              {budget.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cars Horizontal Scroll */}
      <div className="relative">
        {currentCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No cars found in this budget range.</p>
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
              id={`budget-cars-${selectedBudget}`}
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {currentCars.slice(0, 10).map((car, idx) => (
                <CarCard
                  key={car.id}
                  car={car}
                  index={idx}
                />
              ))}

              {/* See More tile - always show to encourage visiting budget page for full list */}
              {currentCars.length > 0 && (
                <Link
                  href={`/best-cars-under-${selectedRange?.urlSlug || '10'}-lakh`}
                  className="flex-shrink-0 w-[260px] sm:w-72 bg-gradient-to-br from-[#291e6a] to-[#1c144a] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {/* Top section matching image height */}
                  <div className="h-40 sm:h-48 flex items-center justify-center bg-gradient-to-br from-[#291e6a] to-[#291e6a]">
                    <div className="text-center px-4 sm:px-6">
                      <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        See More
                      </h3>
                    </div>
                  </div>

                  {/* Bottom section matching card info height */}
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-[#291e6a] to-[#1c144a]">
                    <h4 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 sm:mb-4">
                      {selectedRange?.label} Cars
                    </h4>

                    {/* Spacer to match card height */}
                    <div className="h-20 sm:h-24"></div>

                    {/* Button matching View Details */}
                    <div className="w-full bg-white text-[#1c144a] py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base text-center shadow-md">
                      View All Cars
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
