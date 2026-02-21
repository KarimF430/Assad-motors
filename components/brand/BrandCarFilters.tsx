'use client'

import { useState } from 'react'
import { ChevronDown, Filter, X } from 'lucide-react'

export interface FilterState {
  sort: string
  fuelType: string[]
  transmission: string[]
  priceRange: string
  make: string[]
}

interface BrandCarFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export default function BrandCarFilters({ filters, onFilterChange }: BrandCarFiltersProps) {
  const setFilters = (updater: (prev: FilterState) => FilterState) => {
    onFilterChange(updater(filters))
  }

  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  const sortOptions = [
    { value: 'price-low', label: 'Price Low to High' },
    { value: 'price-high', label: 'Price High to Low' }
  ]

  const fuelTypes = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'cng', label: 'CNG' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' }
  ]

  const transmissionTypes = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
    { value: 'amt', label: 'AMT' },
    { value: 'cvt', label: 'CVT' }
  ]

  const priceRanges = [
    { value: '0-5', label: 'Under ₹5 Lakh' },
    { value: '5-10', label: '₹5-10 Lakh' },
    { value: '10-15', label: '₹10-15 Lakh' },
    { value: '15-20', label: '₹15-20 Lakh' },
    { value: '20+', label: 'Above ₹20 Lakh' }
  ]

  const makeOptions = [
    { value: 'maruti', label: 'Maruti Suzuki' },
    { value: 'hyundai', label: 'Hyundai' },
    { value: 'tata', label: 'Tata' },
    { value: 'mahindra', label: 'Mahindra' }
  ]

  const removeMakeFilter = (make: string) => {
    setFilters(prev => ({
      ...prev,
      make: prev.make.filter(m => m !== make)
    }))
  }

  const clearAllFilters = () => {
    onFilterChange({
      sort: '',
      fuelType: [],
      transmission: [],
      priceRange: '',
      make: []
    })
  }

  return (
    <div className="bg-white py-2 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Chips */}
        <div className="relative">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Fuel Type Pills */}
            {fuelTypes.map((fuel) => (
              <button
                key={fuel.value}
                onClick={() => {
                  if (filters.fuelType.includes(fuel.value)) {
                    setFilters(prev => ({ ...prev, fuelType: prev.fuelType.filter(f => f !== fuel.value) }))
                  } else {
                    setFilters(prev => ({ ...prev, fuelType: [...prev.fuelType, fuel.value] }))
                  }
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${filters.fuelType.includes(fuel.value)
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {fuel.label}
              </button>
            ))}

            {/* Transmission Pills */}
            {transmissionTypes.map((trans) => (
              <button
                key={trans.value}
                onClick={() => {
                  if (filters.transmission.includes(trans.value)) {
                    setFilters(prev => ({ ...prev, transmission: prev.transmission.filter(t => t !== trans.value) }))
                  } else {
                    setFilters(prev => ({ ...prev, transmission: [...prev.transmission, trans.value] }))
                  }
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${filters.transmission.includes(trans.value)
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {trans.label}
              </button>
            ))}

            {/* Ratings Filter */}
            <button
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Ratings 4.0+
            </button>

            {/* Offer Filter */}
            <button
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Offer
            </button>

            {/* Best Seller Filter */}
            <button
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Best Seller
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
        </div>

      </div>
    </div>
  )
}
