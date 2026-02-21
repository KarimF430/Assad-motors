'use client'

import Link from 'next/link'
import { Star, Fuel, Users, ArrowRight, TrendingUp } from 'lucide-react'
import { OptimizedImage } from '@/components/common/OptimizedImage'

interface SearchCarData {
  id: number
  brand: string
  model: string
  fullName: string
  image: string
  priceRange: string
  rating: number
  reviewCount: number
  mileage: string
  seating: number
  fuelType: string
  category: string
  isPopular?: boolean
  matchScore?: number
}

interface SearchResultCardProps {
  car: SearchCarData
  searchTerm?: string
  className?: string
  index?: number
}

export default function SearchResultCard({ car, searchTerm, className = '', index }: SearchResultCardProps) {
  // Generate URL-friendly slug from brand and model
  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const modelPageUrl = `/cars/${generateSlug(car.brand)}/${generateSlug(car.model)}`

  // Highlight search term in text
  const highlightText = (text: string, term?: string) => {
    if (!term) return text

    const regex = new RegExp(`(${term})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <Link href={modelPageUrl} className={`block ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300 p-4">
        <div className="flex items-start space-x-4">
          {/* Car Image */}
          <div className="flex-shrink-0 w-24 h-16 relative">
            <OptimizedImage
              src={car.image}
              alt={car.fullName}
              fill
              className="object-cover rounded-lg"
              priority={index !== undefined ? index < 2 : (car.isPopular || (car.matchScore ?? 0) > 90)}
            />
          </div>

          {/* Car Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Brand and Model */}
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate" title={car.fullName}>
                  {highlightText(car.fullName, searchTerm)}
                </h3>

                {/* Category */}
                <p className="text-sm text-gray-500 mb-2">{car.category}</p>

                {/* Price */}
                <p className="text-lg font-bold text-blue-600 mb-2">{car.priceRange}</p>

                {/* Key Specs */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Fuel className="h-4 w-4 text-green-600" />
                    <span>{car.mileage}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>{car.seating} Seater</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{car.rating}</span>
                    <span className="text-gray-400">({car.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Right Side Info */}
              <div className="flex flex-col items-end space-y-2">
                {/* Badges */}
                <div className="flex flex-col space-y-1">
                  {car.isPopular && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Popular</span>
                    </span>
                  )}
                  {car.matchScore && car.matchScore > 80 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      {car.matchScore}% Match
                    </span>
                  )}
                </div>

                {/* View Details Arrow */}
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
