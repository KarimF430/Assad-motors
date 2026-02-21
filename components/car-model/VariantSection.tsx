'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Filter, Star, Fuel, Zap, Settings, ChevronRight, Check } from 'lucide-react'

interface CarData {
  brand: string
  model: string
  fullName: string
}

interface VariantSectionProps {
  carData: CarData
}

export default function VariantSection({ carData }: VariantSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const router = useRouter()

  const variants = [
    {
      name: 'LXI',
      price: 619000,
      transmission: 'Manual',
      fuelType: 'Petrol',
      mileage: '23.76 kmpl',
      engine: '1.2L',
      power: '89 bhp',
      features: ['Power Steering', 'Central Locking', 'Dual Airbags', 'Manual AC'],
      rating: 4.1,
      popular: false,
      valueForMoney: true
    },
    {
      name: 'VXI',
      price: 689000,
      transmission: 'Manual',
      fuelType: 'Petrol',
      mileage: '23.76 kmpl',
      engine: '1.2L',
      power: '89 bhp',
      features: ['Power Windows', 'Music System', 'Central Locking', 'Auto AC'],
      rating: 4.3,
      popular: true,
      valueForMoney: true
    },
    {
      name: 'ZXI',
      price: 759000,
      transmission: 'Manual',
      fuelType: 'Petrol',
      mileage: '23.76 kmpl',
      engine: '1.2L',
      power: '89 bhp',
      features: ['Touchscreen', 'Alloy Wheels', 'Fog Lamps', 'Auto Climate Control'],
      rating: 4.4,
      popular: true,
      valueForMoney: false
    },
    {
      name: 'ZXI+ AMT',
      price: 829000,
      transmission: 'AMT',
      fuelType: 'Petrol',
      mileage: '22.56 kmpl',
      engine: '1.2L',
      power: '89 bhp',
      features: ['AMT', 'Push Start', 'Reverse Camera', 'Premium Interior'],
      rating: 4.5,
      popular: false,
      valueForMoney: false
    }
  ]

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'petrol', label: 'Fuel Type' },
    { id: 'manual', label: 'Transmission Type' },
    { id: 'value', label: 'Value for Money Variants' }
  ]

  const filteredVariants = variants.filter(variant => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'petrol') return variant.fuelType === 'Petrol'
    if (selectedFilter === 'manual') return variant.transmission === 'Manual'
    if (selectedFilter === 'value') return variant.valueForMoney
    return true
  })

  const handleVariantClick = (variant: typeof variants[0]) => {
    // Navigate to the variant page with proper routing
    const brandSlug = carData.brand.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = carData.model.toLowerCase().replace(/\s+/g, '-')
    const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-')
    const url = `/${brandSlug}-cars/${modelSlug}/${variantSlug}`
    console.log('Navigating to:', url)
    router.push(url)
  }

  const VariantCard = ({ variant }: { variant: typeof variants[0] }) => (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => handleVariantClick(variant)}
    >
      {/* Header with badges */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{variant.name}</h3>
          <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 text-green-600 fill-current" />
            <span className="text-sm font-medium text-green-700 ml-1">{variant.rating}</span>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex gap-2 mb-3">
          {variant.popular && (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1.5"></span>
              Popular Choice
            </span>
          )}
          {variant.valueForMoney && (
            <span className="inline-flex items-center bg-green-50 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              <Check className="h-3 w-3 mr-1" />
              Best Value
            </span>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900">
          ₹{(variant.price / 100000).toFixed(2)} Lakh
        </div>
        <div className="text-xs text-gray-500 mt-0.5">Ex-showroom price</div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm">
          <Fuel className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-700">{variant.fuelType}</span>
        </div>
        <div className="flex items-center text-sm">
          <Settings className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-700">{variant.transmission}</span>
        </div>
        <div className="flex items-center text-sm">
          <Zap className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-700">{variant.power}</span>
        </div>
        <div className="flex items-center text-sm">
          <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-gray-700">{variant.mileage}</span>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">KEY FEATURES</p>
        <div className="flex flex-wrap gap-1.5">
          {variant.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button 
        className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center group-hover:shadow-md"
        onClick={(e) => {
          e.stopPropagation()
          handleVariantClick(variant)
        }}
      >
        View Full Details
        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {carData.fullName} Variants & Price
        </h2>
        <p className="text-gray-600">Choose from {variants.length} variants available</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-[#291e6a] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {filteredVariants.map((variant) => (
          <VariantCard key={variant.name} variant={variant} />
        ))}
      </div>

      {/* More Variants Button */}
      <div className="text-center">
        <button className="inline-flex items-center bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-full font-semibold transition-all duration-200">
          View All {variants.length} Variants
          <ChevronRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  )
}
