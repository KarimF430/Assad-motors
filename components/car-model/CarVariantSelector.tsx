'use client'

import { useState } from 'react'
import { ChevronDown, Car, MapPin } from 'lucide-react'

interface CarVariantSelectorProps {
  carData: {
    fullName: string
  }
}

export default function CarVariantSelector({ carData }: CarVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const variants = [
    'LXi',
    'VXi',
    'VXi AGS',
    'VXi+ AGS',
    'ZXi',
    'ZXi AGS',
    'ZXi+ AGS'
  ]

  const cities = [
    'New Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad'
  ]

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Variant Selector */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Car className="h-4 w-4 text-blue-600" />
              Select Variant
            </label>
            <div className="relative">
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl px-4 py-4 pr-12 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <option value="" className="text-gray-500">Choose Variant</option>
                {variants.map((variant) => (
                  <option key={variant} value={variant} className="text-gray-900">
                    {carData.fullName} {variant}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* City Selector */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              Select City
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-gray-200 hover:border-green-300 focus:border-green-500 rounded-xl px-4 py-4 pr-12 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <option value="" className="text-gray-500">Choose City</option>
                {cities.map((city) => (
                  <option key={city} value={city} className="text-gray-900">
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
