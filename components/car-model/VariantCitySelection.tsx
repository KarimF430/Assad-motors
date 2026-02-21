'use client'

import { useState } from 'react'
import { MapPin, Car, ChevronDown } from 'lucide-react'

interface CarData {
  brand: string
  model: string
  fullName: string
}

interface VariantCitySelectionProps {
  carData: CarData
}

export default function VariantCitySelection({ carData }: VariantCitySelectionProps) {
  const [selectedCity, setSelectedCity] = useState('New Delhi')
  const [selectedVariant, setSelectedVariant] = useState('LXI')
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [showVariantDropdown, setShowVariantDropdown] = useState(false)

  const cities = [
    'New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad',
    'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam'
  ]

  const variants = [
    { name: 'LXI', engine: '1.2L Petrol', transmission: 'Manual', price: '₹6.19 L' },
    { name: 'VXI', engine: '1.2L Petrol', transmission: 'Manual', price: '₹6.89 L' },
    { name: 'ZXI', engine: '1.2L Petrol', transmission: 'Manual', price: '₹7.59 L' },
    { name: 'ZXI+', engine: '1.2L Petrol', transmission: 'AMT', price: '₹8.29 L' }
  ]

  const selectedVariantData = variants.find(v => v.name === selectedVariant) || variants[0]

  return (
    <div className="bg-white mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Box - Choose Variant */}
        <div className="relative">
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Car className="h-4 w-4 inline mr-2" />
              Choose Variant
            </label>
            <button
              onClick={() => setShowVariantDropdown(!showVariantDropdown)}
              className="w-full p-3 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50"
            >
              <div>
                <div className="font-medium text-gray-900">{selectedVariantData.name}</div>
                <div className="text-sm text-gray-600">{selectedVariantData.engine}</div>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showVariantDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showVariantDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {variants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => {
                      setSelectedVariant(variant.name)
                      setShowVariantDropdown(false)
                    }}
                    className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedVariant === variant.name ? 'bg-orange-50 text-orange-700' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{variant.name}</div>
                        <div className="text-sm text-gray-600">{variant.engine} • {variant.transmission}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{variant.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Box - Choose City */}
        <div className="relative">
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MapPin className="h-4 w-4 inline mr-2" />
              Choose City
            </label>
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="w-full p-3 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50"
            >
              <span className="font-medium text-gray-900">{selectedCity}</span>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showCityDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city)
                      setShowCityDropdown(false)
                    }}
                    className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedCity === city ? 'bg-orange-50 text-orange-700' : ''
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
