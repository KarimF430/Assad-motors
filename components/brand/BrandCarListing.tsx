'use client'

import { Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Car {
  id: string
  name: string
  brand: string
  rating: number
  totalRatings: number
  bhp: number
  variants: number
  price: {
    min: number
    max: number
  }
  avgPrice: number
  image: string
  isNew?: boolean
}

interface BrandCarListingProps {
  brandSlug: string
}

export default function BrandCarListing({ brandSlug }: BrandCarListingProps) {
  // Mock car data - in real app, this would come from API based on brandSlug and filters
  const cars: Car[] = [
    {
      id: '1',
      name: 'Maruti Swift',
      brand: 'Maruti Suzuki',
      rating: 4.5,
      totalRatings: 1247,
      bhp: 89,
      variants: 23,
      price: { min: 585000, max: 850000 },
      avgPrice: 585000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format',
      isNew: false
    },
    {
      id: '2',
      name: 'Maruti Swift',
      brand: 'Maruti Suzuki',
      rating: 4.5,
      totalRatings: 1247,
      bhp: 89,
      variants: 23,
      price: { min: 585000, max: 850000 },
      avgPrice: 585000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format',
      isNew: false
    },
    {
      id: '3',
      name: 'Maruti Swift',
      brand: 'Maruti Suzuki',
      rating: 4.5,
      totalRatings: 1247,
      bhp: 89,
      variants: 23,
      price: { min: 585000, max: 850000 },
      avgPrice: 585000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format',
      isNew: false
    },
    {
      id: '4',
      name: 'Maruti Swift',
      brand: 'Maruti Suzuki',
      rating: 4.5,
      totalRatings: 1247,
      bhp: 89,
      variants: 23,
      price: { min: 585000, max: 850000 },
      avgPrice: 585000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format',
      isNew: false
    },
    {
      id: '5',
      name: 'Maruti Swift',
      brand: 'Maruti Suzuki',
      rating: 4.5,
      totalRatings: 1247,
      bhp: 89,
      variants: 23,
      price: { min: 585000, max: 850000 },
      avgPrice: 585000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format',
      isNew: false
    },
    {
      id: '6',
      name: 'Maruti Swift',
      brand: 'Maruti Suzuki',
      rating: 4.5,
      totalRatings: 1247,
      bhp: 89,
      variants: 23,
      price: { min: 585000, max: 850000 },
      avgPrice: 585000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format',
      isNew: false
    },
    {
      id: '7',
      name: 'Maruti Swift',
      brand: 'Maruti Suzuki',
      rating: 4.5,
      totalRatings: 1247,
      bhp: 89,
      variants: 23,
      price: { min: 585000, max: 850000 },
      avgPrice: 585000,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format',
      isNew: true
    }
  ]

  const formatPrice = (price: number) => {
    return (price / 100000).toFixed(2)
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.brand.toLowerCase().replace(' ', '-')}/${car.name.toLowerCase().replace(' ', '-')}`}
              className="block"
            >
              <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                <div className="flex">
                  {/* Car Image */}
                  <div className="relative w-44 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-l-xl overflow-hidden">
                    {car.isNew && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </div>
                    )}
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23374151'%3E%3Cpath d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z'/%3E%3Ccircle cx='100' cy='220' r='25' fill='%23111827'/%3E%3Ccircle cx='300' cy='220' r='25' fill='%23111827'/%3E%3Cpath d='M80 110h240l-20-30H100z' fill='%236B7280'/%3E%3C/svg%3E"
                      }}
                    />
                  </div>

                  {/* Car Details */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start h-full">
                      <div className="flex-1 flex flex-col justify-between">
                        {/* Car Name and Arrow */}
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">{car.name}</h3>
                          <ChevronRight className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-green-500 text-green-500" />
                            <span className="text-sm font-medium text-gray-900">{car.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">{car.totalRatings} Ratings</span>
                        </div>

                        {/* BHP */}
                        <div className="text-sm text-gray-600 mb-2">
                          {car.bhp} bhp
                        </div>

                        {/* Variants */}
                        <div className="text-sm font-medium text-blue-600 mb-3">
                          {car.variants} Variants
                        </div>

                        {/* Price */}
                        <div className="mt-auto">
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            Rs. {formatPrice(car.avgPrice)} Lakh{' '}
                            <span className="text-sm font-normal text-gray-500">onwards</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Avg. Ex-Showroom price
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
