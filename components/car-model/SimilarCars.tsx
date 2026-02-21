'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, Heart, ArrowRight, Fuel, Users, Zap } from 'lucide-react'
import Link from 'next/link'

interface CarData {
  fullName: string
  brand: string
  model: string
}

interface SimilarCarsProps {
  carData: CarData
}

export default function SimilarCars({ carData }: SimilarCarsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set())

  // Mock similar cars removed - will fetch real data from backend
  const similarCars: any[] = []

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const toggleWishlist = (carId: number) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(carId)) {
        newSet.delete(carId)
      } else {
        newSet.add(carId)
      }
      return newSet
    })
  }

  const badgeColors = {
    'Premium': 'bg-purple-100 text-purple-700',
    'Safety': 'bg-green-100 text-green-700',
    'Spacious': 'bg-blue-100 text-blue-700',
    'Performance': 'bg-red-100 text-red-700',
    'Affordable': 'bg-orange-100 text-orange-700'
  }

  // Don't render if no similar cars
  if (similarCars.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Cars Similar to {carData.fullName}
          </h2>
          <p className="text-gray-600">
            Explore other cars in the same price range and category
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/compare"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Compare All
          </Link>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Car Cards */}
      {/* Similar Cars Horizontal Scroll */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {similarCars.map((car) => (
            <div key={car.id} className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              {/* Car Image */}
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.fullName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => toggleWishlist(car.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${wishlistItems.has(car.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Heart className={`h-4 w-4 ${wishlistItems.has(car.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Similarity Badge */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {car.similarity}% Match
                </div>

                {/* Category Badge */}
                <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium ${badgeColors[car.badge as keyof typeof badgeColors]}`}>
                  {car.badge}
                </div>
              </div>

              {/* Car Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{car.fullName}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{car.rating}</span>
                    <span className="text-xs text-gray-500">({car.reviewCount})</span>
                  </div>
                </div>

                <p className="text-xl font-bold text-blue-600 mb-3">{car.priceRange}</p>

                {/* Key Specs */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <Fuel className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-600">{car.mileage}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-gray-600">{car.seating} Seater</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="text-xs text-gray-600">{car.fuelType}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {car.keyFeatures.slice(0, 2).map((feature: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                        {feature}
                      </span>
                    ))}
                    {car.keyFeatures.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                        +{car.keyFeatures.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    href={`/cars/${car.brand.toLowerCase().replace(' ', '-')}/${car.model.toLowerCase().replace(' ', '-')}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                    Compare
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
      </div>

      {/* Comparison Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Comparison with {carData.fullName}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Price Range</p>
            <p className="font-semibold text-gray-900">₹5.99L - ₹11.21L</p>
            <p className="text-xs text-gray-500">Across similar cars</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg. Mileage</p>
            <p className="font-semibold text-gray-900">20.4 kmpl</p>
            <p className="text-xs text-gray-500">Similar to your choice</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg. Rating</p>
            <p className="font-semibold text-gray-900">4.2/5</p>
            <p className="text-xs text-gray-500">Customer satisfaction</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Best Match</p>
            <p className="font-semibold text-gray-900">Hyundai i20</p>
            <p className="text-xs text-gray-500">92% similarity</p>
          </div>
        </div>
      </div>

      {/* View All Link */}
      <div className="mt-4 text-center">
        <Link
          href="/cars?category=hatchback"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>View All Hatchback Cars</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
