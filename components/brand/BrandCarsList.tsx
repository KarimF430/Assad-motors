'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ChevronRight } from 'lucide-react'

interface Car {
  id: string
  name: string
  brand: string
  brandName: string
  image: string
  startingPrice: number
  lowestPriceFuelType?: string
  fuelTypes: string[]
  transmissions: string[]
  seating: number
  launchDate: string
  slug: string
  isNew: boolean
  isPopular: boolean
  rating?: number
  reviews?: number
  variants?: number
}

// BrandCarCard component (exact copy from budget page) - MOBILE OPTIMIZED
function BrandCarCard({ car }: { car: Car }) {
  const exShowroomPrice = car.startingPrice
  const displayPrice = (exShowroomPrice / 100000).toFixed(2)
  const priceLabel = 'Price'

  return (
    <Link
      href={`/${car.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${car.name.toLowerCase().replace(/\s+/g, '-')}`}
      className="block group"
    >
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="flex min-h-[144px] sm:min-h-[176px]">
          {/* Car Image - Responsive */}
          <div className="w-32 sm:w-48 flex-shrink-0 relative overflow-hidden rounded-l-lg">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  const fallback = document.createElement('div')
                  fallback.className = 'bg-gray-200 text-gray-600 text-xs sm:text-sm font-semibold text-center flex items-center justify-center h-full p-1'
                  fallback.innerHTML = car.name
                  parent.appendChild(fallback)
                }
              }}
            />
            {car.isNew && (
              <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded z-10">
                NEW
              </span>
            )}
            {car.isPopular && !car.isNew && (
              <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded z-10">
                POPULAR
              </span>
            )}
          </div>

          {/* Car Details - Responsive */}
          <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col justify-between min-w-0">
            {/* Top Section */}
            <div>
              <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                <div className="flex-1 pr-1 sm:pr-2 min-w-0">
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    <span className="truncate block">{car.brandName} {car.name}</span>
                  </h3>
                </div>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5 sm:mt-1" />
              </div>

              {/* Rating - Responsive */}
              {car.reviews && car.reviews > 0 ? (
                <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 fill-current flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm whitespace-nowrap">{car.rating}/5</span>
                  <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">{car.reviews} Ratings</span>
                </div>
              ) : null}

              {/* Variants - Responsive */}
              <div className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                {car.variants || 0} Variants
              </div>
            </div>

            {/* Bottom Section: Price - Responsive */}
            <div>
              <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                <span className="text-base sm:text-xl md:text-2xl font-bold text-red-600">₹ {displayPrice}</span>
                <span className="text-sm sm:text-base md:text-lg font-semibold text-red-600">Lakh</span>
                <span className="text-gray-500 text-xs sm:text-sm">Onwards</span>
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500">{priceLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface BrandCarsListProps {
  brand: string
  initialModels?: any[]
  brandId?: string
}

export default function BrandCarsList({ brand, initialModels = [], brandId }: BrandCarsListProps) {
  const [selectedFuel, setSelectedFuel] = useState<string[]>([])
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])

  const fuelFilters = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']
  const transmissionFilters = ['Manual', 'Automatic']

  const brandName = brand === 'maruti-suzuki' ? 'Maruti Suzuki' : brand.charAt(0).toUpperCase() + brand.slice(1)

  // Convert backend models to frontend format
  const models: Car[] = initialModels.map((model: any) => ({
    id: model.id,
    name: model.name,
    brand: brandId || '',
    brandName: brandName,
    image: model.heroImage || '/car-placeholder.jpg',
    startingPrice: model.lowestPrice || 0,
    lowestPriceFuelType: model.lowestPriceFuelType,
    fuelTypes: model.fuelTypes || ['Petrol'],
    transmissions: model.transmissions || ['Manual'],
    seating: 5,
    launchDate: model.launchDate || 'Launched',
    slug: `${brandName.toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
    isNew: model.isNew || false,
    isPopular: model.isPopular || false,
    rating: model.rating || 0,
    reviews: model.reviews || model.reviewCount || 0,
    variants: model.variantCount || 0
  }))

  // Apply filters (exact copy from budget page)
  const filteredModels = models.filter((model) => {
    if (selectedFuel.length > 0) {
      const hasFuel = selectedFuel.some(fuel =>
        model.fuelTypes.some(f => f.toLowerCase() === fuel.toLowerCase())
      )
      if (!hasFuel) return false
    }

    if (selectedTransmission.length > 0) {
      const hasTransmission = selectedTransmission.some(trans =>
        model.transmissions.some(t => t.toLowerCase().includes(trans.toLowerCase()))
      )
      if (!hasTransmission) return false
    }

    return true
  })

  const toggleFilter = (type: 'fuel' | 'transmission', value: string) => {
    if (type === 'fuel') {
      setSelectedFuel(prev =>
        prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
      )
    } else {
      setSelectedTransmission(prev =>
        prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
      )
    }
  }

  return (
    <>
      {/* Filters Section (exact copy from budget page) */}
      <section className="bg-white pt-2 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-200">
            {fuelFilters.map(fuel => (
              <button
                key={fuel}
                onClick={() => toggleFilter('fuel', fuel)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFuel.includes(fuel)
                  ? 'bg-[#291e6a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {fuel}
              </button>
            ))}
            {transmissionFilters.map(trans => (
              <button
                key={trans}
                onClick={() => toggleFilter('transmission', trans)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTransmission.includes(trans)
                  ? 'bg-[#291e6a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {trans}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          {/* Car List - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {models.length === 0 ? (
              <div className="text-center py-20 col-span-full">
                <p className="text-gray-500 text-lg">No models found for {brandName}</p>
              </div>
            ) : (
              filteredModels.map((car) => (
                <BrandCarCard key={car.id} car={car} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}
