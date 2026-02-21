'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CarFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export default function CarFilters({ onFiltersChange }: CarFiltersProps) {
  const [selectedPrice, setSelectedPrice] = useState('All Prices')
  const [selectedFuel, setSelectedFuel] = useState('All Fuel Types')
  const [selectedBody, setSelectedBody] = useState('All Body Types')

  const priceRanges = [
    'All Prices',
    'Under ₹5 Lakh',
    '₹5-10 Lakh',
    '₹10-15 Lakh',
    '₹15-20 Lakh',
    'Above ₹20 Lakh'
  ]

  const fuelTypes = [
    'All Fuel Types',
    'Petrol',
    'Diesel',
    'CNG',
    'Electric',
    'Hybrid'
  ]

  const bodyTypes = [
    'All Body Types',
    'Hatchback',
    'Sedan',
    'SUV',
    'MUV',
    'Coupe',
    'Convertible'
  ]

  const handleFilterChange = (type: string, value: string) => {
    const filters = {
      price: type === 'price' ? value : selectedPrice,
      fuel: type === 'fuel' ? value : selectedFuel,
      body: type === 'body' ? value : selectedBody
    }
    
    if (type === 'price') setSelectedPrice(value)
    if (type === 'fuel') setSelectedFuel(value)
    if (type === 'body') setSelectedBody(value)
    
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-3">
          {/* Price Filter */}
          <div className="relative flex-1 min-w-[120px]">
            <select
              value={selectedPrice}
              onChange={(e) => handleFilterChange('price', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {priceRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Fuel Type Filter */}
          <div className="relative flex-1 min-w-[120px]">
            <select
              value={selectedFuel}
              onChange={(e) => handleFilterChange('fuel', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Body Type Filter */}
          <div className="relative flex-1 min-w-[120px]">
            <select
              value={selectedBody}
              onChange={(e) => handleFilterChange('body', e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {bodyTypes.map((body) => (
                <option key={body} value={body}>
                  {body}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
