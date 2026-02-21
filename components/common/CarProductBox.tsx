'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, Heart, Fuel, Users, Zap, ArrowRight } from 'lucide-react'
import { OptimizedImage } from '@/components/common/OptimizedImage'

interface CarData {
  id: number
  brand: string
  model: string
  fullName: string
  image: string
  priceRange: string
  startingPrice: number
  rating: number
  reviewCount: number
  mileage: string
  seating: number
  fuelType: string
  transmission: string
  keyFeatures: string[]
  badge?: string
  isNew?: boolean
  isPopular?: boolean
}

interface CarProductBoxProps {
  car: CarData
  size?: 'small' | 'medium' | 'large'
  showCompare?: boolean
  showWishlist?: boolean
  className?: string
}

export default function CarProductBox({
  car,
  size = 'medium',
  showCompare = true,
  showWishlist = true,
  className = ''
}: CarProductBoxProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Generate URL-friendly slug from brand and model
  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const modelPageUrl = `/cars/${generateSlug(car.brand)}/${generateSlug(car.model)}`

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Add to compare functionality
    console.log('Add to compare:', car.fullName)
  }

  const sizeClasses = {
    small: 'w-full max-w-sm',
    medium: 'w-full max-w-md',
    large: 'w-full max-w-lg'
  }

  const badgeColors = {
    'New Launch': 'bg-green-100 text-green-700',
    'Popular': 'bg-blue-100 text-blue-700',
    'Best Seller': 'bg-orange-100 text-orange-700',
    'Premium': 'bg-purple-100 text-purple-700',
    'Value': 'bg-yellow-100 text-yellow-700'
  }

  return (
    <Link href={modelPageUrl} className={`block ${sizeClasses[size]} ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 hover:border-blue-300 group">
        {/* Car Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <OptimizedImage
            src={car.image}
            alt={car.fullName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {car.isNew && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                NEW
              </span>
            )}
            {car.isPopular && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                POPULAR
              </span>
            )}
            {car.badge && (
              <span className={`px-2 py-1 text-xs font-medium rounded ${badgeColors[car.badge as keyof typeof badgeColors] || 'bg-gray-100 text-gray-700'}`}>
                {car.badge}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="p-4">
          {/* Brand and Model */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {car.fullName}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{car.rating}</span>
              <span className="text-xs text-gray-500">({car.reviewCount})</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-3">
            <p className="text-xl font-bold text-blue-600">{car.priceRange}</p>
            <p className="text-xs text-gray-500">Ex-showroom price</p>
          </div>

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
            <div className="flex flex-wrap gap-1">
              {car.keyFeatures.slice(0, 2).map((feature, index) => (
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
            <div className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors text-center group-hover:bg-blue-700">
              View Details
            </div>
            {showCompare && (
              <button
                onClick={handleCompare}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Compare
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
