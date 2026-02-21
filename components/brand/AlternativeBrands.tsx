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
}

interface AlternativeBrandsProps {
  currentBrand: string
  initialBrands?: any[]
}

export default function AlternativeBrands({ currentBrand, initialBrands = [] }: AlternativeBrandsProps) {
  const [showAllBrands, setShowAllBrands] = useState(false)

  // Transform backend brands to frontend format, excluding current brand
  const allBrands = initialBrands
    .filter((brand: any) => {
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return brand.status === 'active' && brandSlug !== currentBrand
    })
    .map((brand: any) => {
      return {
        id: brand.id,
        name: brand.name,
        logo: brand.logo || '/brands/default.png',
        slug: brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
    })

  if (allBrands.length === 0) {
    return null
  }

  return (
    <section className="py-3 sm:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Alternative Brands</h2>

        {/* Brands Grid - Matching Home Page BrandSection exactly */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 mb-6">
          {(showAllBrands ? allBrands : allBrands.slice(0, 6)).map((brand) => (
            <Link
              key={brand.id}
              href={`/${brand.slug}-cars`}
              className="group bg-white rounded-xl border border-gray-100 hover:border-[#6b5fc7] hover:shadow-md transition-all duration-300 p-3 sm:p-4 text-center"
            >
              {/* Brand Logo */}
              <div className="h-12 sm:h-14 flex items-center justify-center mb-2">
                {brand.logo ? (
                  <OptimizedImage
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                ) : null}
                <div className={`fallback-logo w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#291e6a] to-red-500 rounded-full flex items-center justify-center shadow-sm ${brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/uploads')) ? 'hidden' : ''}`}>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {brand.name.split(' ').map((word: string) => word.charAt(0)).join('')}
                  </span>
                </div>
              </div>

              {/* Brand Name */}
              <h3 className="font-medium text-gray-800 text-xs sm:text-sm group-hover:text-[#1c144a] transition-colors line-clamp-1">{brand.name}</h3>
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
    </section>
  )
}
