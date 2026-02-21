'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, ChevronRight } from 'lucide-react'

interface BrandCarItemProps {
    car: {
        id: string
        name: string
        brandName: string
        image: string
        startingPrice: number
        variantCount?: number
        rating?: number
        reviewCount?: number
        isPopular?: boolean
    }
    brandSlug: string
}

export default function BrandCarItem({ car, brandSlug }: BrandCarItemProps) {
    const router = useRouter()
    

    const brandSlugFormatted = car.brandName.toLowerCase().replace(/\s+/g, '-')
    const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-')
    const modelPageUrl = `/${brandSlugFormatted}-cars/${modelSlug}`
    const rateReviewUrl = `/${brandSlugFormatted}-cars/${modelSlug}/rate-review`

    const displayPrice = car.startingPrice
    const priceLabel = 'Price'

    const formatPrice = (price: number) => {
        if (price === 0) return 'Price Not Available'
        const lakhs = price / 100000
        return `₹ ${lakhs.toFixed(2)} Lakh`
    }

    const handleCardClick = (e: React.MouseEvent) => {
        // Configure click handler to ignore clicks on links or buttons
        if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) {
            return
        }
        router.push(modelPageUrl)
    }

    return (
        <div
            onClick={handleCardClick}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                {/* Car Image */}
                <div className="relative flex-shrink-0 w-32 h-24 sm:w-40 sm:h-28">
                    {car.isPopular && (
                        <span className="absolute top-0 left-0 px-2 py-1 bg-[#291e6a] text-white text-xs font-bold rounded z-10">
                            POPULAR
                        </span>
                    )}
                    <img
                        src={car.image || '/car-placeholder.jpg'}
                        alt={car.name}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Car Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {car.brandName} {car.name}
                    </h3>

                    {/* Rating */}
                    {car.rating && car.reviewCount && car.reviewCount > 0 ? (
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-green-600 fill-current" />
                                <span className="text-sm font-semibold text-gray-900">{car.rating}/5</span>
                                <span className="text-sm text-gray-500">({car.reviewCount} Ratings)</span>
                            </div>
                            <Link
                                href={rateReviewUrl}
                                className="text-sm font-medium text-[#291e6a] hover:text-[#1c144a] hover:underline z-10"
                            >
                                Rate & Review
                            </Link>
                        </div>
                    ) : null}

                    {/* Variant Count */}
                    {car.variantCount !== undefined && car.variantCount > 0 && (
                        <p className="text-sm text-gray-600 mb-2">{car.variantCount} Variants</p>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-red-600">{formatPrice(displayPrice)}</span>
                        <span className="text-sm text-gray-500">Onwards</span>
                    </div>
                    <p className="text-xs text-gray-500">{priceLabel}</p>
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
            </div>
        </div>
    )
}
