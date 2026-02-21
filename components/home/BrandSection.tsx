'use client'

import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { OptimizedImage } from '@/components/common/OptimizedImage'

interface Brand {
  id: string
  name: string
  logo: string
  slug: string
  modelCount?: number
  startingPrice?: number
  models?: string
}

interface BrandSectionProps {
  initialBrands?: Brand[]
}

export default function BrandSection({ initialBrands = [] }: BrandSectionProps) {
  const [showAllBrands, setShowAllBrands] = useState(false)

  // Transform brands to match the display format
  const transformedBrands = initialBrands.map(brand => ({
    id: brand.id,
    name: brand.name,
    logo: brand.logo,
    slug: brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    modelCount: brand.models ? parseInt(brand.models.replace(/[^\d]/g, '')) || 8 : 8,
    startingPrice: brand.startingPrice
  }))

  const allBrands = transformedBrands

  if (allBrands.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Popular Brands</h2>

      {/* Brands Grid - Refined UI */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {(showAllBrands ? allBrands : allBrands.slice(0, 6)).map((brand) => (
          <Link
            key={brand.id}
            href={`/${brand.slug}-cars`}
            className="group bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 p-3 sm:p-4 text-center"
          >
            {/* Brand Logo */}
            <div className="h-12 sm:h-14 flex items-center justify-center mb-2 relative">
              {brand.logo ? (
                <OptimizedImage
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              ) : null}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm ${brand.logo ? 'hidden' : ''}`}>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {brand.name.split(' ').map((word: string) => word.charAt(0)).join('')}
                </span>
              </div>
            </div>

            {/* Brand Name */}
            <h3 className="font-medium text-gray-800 text-xs sm:text-sm group-hover:text-orange-600 transition-colors line-clamp-1">{brand.name}</h3>
          </Link>
        ))}
      </div>

      {/* Show All Brands Button - Original Gradient Style */}
      {allBrands.length > 6 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="inline-flex items-center bg-[#291e6a] hover:bg-[#1c144a] text-white px-5 py-2.5 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg transition-all duration-200 shadow-md"
          >
            {showAllBrands ? (
              <>
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Show Less Brands</span>
                <span className="sm:hidden">Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span>Show All {allBrands.length} Brands</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
