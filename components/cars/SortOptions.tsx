'use client'

import { useState } from 'react'
import { ChevronDown, Grid, List } from 'lucide-react'

export default function SortOptions() {
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'fuel-efficiency', label: 'Fuel Efficiency' },
    { value: 'launch-date', label: 'Launch Date' },
    { value: 'alphabetical', label: 'Name (A-Z)' },
  ]

  const selectedOption = sortOptions.find(option => option.value === sortBy)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <span className="text-sm font-medium text-gray-700">
              Sort by: {selectedOption?.label}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      sortBy === option.value 
                        ? 'bg-primary-50 text-primary-700 font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">1-24</span> of{' '}
          <span className="font-medium text-gray-900">487</span> cars
        </p>
      </div>
    </div>
  )
}
