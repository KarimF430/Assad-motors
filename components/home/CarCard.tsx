'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, Users, Fuel, Heart, Gauge, Settings, Banknote } from 'lucide-react'
import { useFavourites } from '@/lib/favourites-context'
import { OptimizedImage } from '@/components/common/OptimizedImage'


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
  variantName?: string
}

interface CarCardProps {
  car: Car
  index?: number
  onClick?: () => void
}

// Helper function to format transmission
const formatTransmission = (transmission: string): string => {
  const lower = transmission.toLowerCase()
  if (lower === 'manual') return 'Manual'
  if (lower === 'automatic') return 'Automatic'
  return transmission.toUpperCase()
}

// Helper function to format fuel type
const formatFuelType = (fuel: string): string => {
  const lower = fuel.toLowerCase()
  if (lower === 'cng') return 'CNG'
  if (lower === 'petrol') return 'Petrol'
  if (lower === 'diesel') return 'Diesel'
  if (lower === 'electric') return 'Electric'
  return fuel
}

// Helper function to format launch date
const formatLaunchDate = (dateString: string): string => {
  if (!dateString || dateString === 'Recently Launched' || dateString === 'Launched') return 'Recently Launched'

  // Remove "Launched " prefix if present to parse the date
  const cleanDate = dateString.replace(/^Launched\s+/, '')

  // Consistent month names (same as other components)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  try {
    const date = new Date(cleanDate)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString.startsWith('Launched') ? dateString : `Launched ${dateString}`
    }

    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return `Launched ${month} ${year}`
  } catch (e) {
    return dateString.startsWith('Launched') ? dateString : `Launched ${dateString}`
  }
}

export default function CarCard({ car, index, onClick }: CarCardProps) {
  const { isFavourite, toggleFavourite } = useFavourites()
  const [mounted, setMounted] = React.useState(false)
  const isFav = mounted ? isFavourite(car.id) : false

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const displayPrice = car.startingPrice
  const kmDriven = "70,000" // Mocked metric for used cars per user requirements
  const variantText = car.variantName || "LXI" // Fallback variant
  const emiEstimation = Math.round((displayPrice * 0.85 * 0.09) / 12 + (displayPrice * 0.85) / 60).toLocaleString('en-IN')

  // Compute href for SEO
  const brandSlug = car.brandName?.toLowerCase().replace(/\s+/g, '-') || car.brand?.toLowerCase().replace(/\s+/g, '-') || ''
  const modelSlug = car.name?.toLowerCase().replace(/\s+/g, '-') || car.slug || ''
  const carHref = `/${brandSlug}-cars/${modelSlug}`

  return (
    <Link
      href={carHref}
      onClick={onClick}
      className="flex flex-col flex-shrink-0 w-[260px] sm:w-72 bg-white rounded-xl border border-gray-200 hover:shadow-lg active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Badges removed per user request */}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault() // Prevent navigation
            e.stopPropagation()
            toggleFavourite(car)
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2 right-2 sm:top-3 right-2 sm:right-3 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-200 z-10 ${isFav
            ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            : 'bg-white hover:bg-red-50 active:bg-red-100'
            }`}
        >
          <Heart
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${isFav ? 'text-white' : 'text-gray-400 hover:text-red-500'
              }`}
            fill={isFav ? 'currentColor' : 'none'}
          />
        </button>


        {/* Car Image */}
        <div className="w-full h-full flex items-center justify-center relative">
          {car.image ? (
            <OptimizedImage
              src={car.image}
              alt={`${car.brandName} ${car.name}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
              className="object-contain p-2"
              priority={index !== undefined ? index < 2 : (car.isPopular || car.isNew)} // Only prioritize first 2 to avoid LCP competition
            />
          ) : (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='#374151' className="w-3/4 h-3/4">
              <path d='M50 200h300c5.5 0 10-4.5 10-10v-80c0-16.6-13.4-30-30-30H70c-16.6 0-30 13.4-30 30v80c0 5.5 4.5 10 10 10z' />
              <circle cx='100' cy='220' r='25' fill='#111827' />
              <circle cx='300' cy='220' r='25' fill='#111827' />
              <path d='M80 110h240l-20-30H100z' fill='#6B7280' />
            </svg>
          )}
        </div>
      </div>

      {/* Car Info */}
      <div className="p-4 flex flex-col justify-between" style={{ minHeight: '180px' }}>
        <div>
          <h3 className="font-bold text-gray-900 mb-1 text-base sm:text-lg truncate" title={`${car.brandName} ${car.name} ${variantText}`}>
            {(() => {
              const yearMatch = car.launchDate?.match(/\d{4}/);
              return yearMatch ? <span className="mr-1">{yearMatch[0]}</span> : null;
            })()}
            {car.brandName} {car.name} <span className="font-medium text-gray-500 text-sm ml-1">{variantText}</span>
          </h3>

          <div className="flex items-baseline mb-4 mt-1">
            <span className="text-red-600 font-bold text-lg sm:text-xl">₹ {(displayPrice / 100000).toFixed(2)} Lakh</span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px] sm:text-sm text-gray-600 mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="flex items-center" title="Fuel Type">
              <Fuel className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate font-medium">{formatFuelType((car.fuelTypes || ['Petrol'])[0])}</span>
            </div>
            <div className="flex items-center" title="Transmission">
              <Settings className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate font-medium">{formatTransmission((car.transmissions || ['Manual'])[0])}</span>
            </div>
            <div className="flex items-center" title="Kilometers Driven">
              <Gauge className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate font-medium">{kmDriven} km</span>
            </div>
            <div className="flex items-center" title="EMI starts at">
              <Banknote className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
              <span className="whitespace-nowrap font-bold text-gray-900 tracking-tight text-xs sm:text-[13px]">
                <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium mr-1 uppercase">EMI</span>
                ₹{emiEstimation}/m
              </span>
            </div>
          </div>

        </div>
        <button
          className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg transform group-hover:scale-105"
        >
          View Details
        </button>
      </div>
    </Link>
  )
}
