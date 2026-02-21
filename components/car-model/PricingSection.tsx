'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

interface CarData {
  brand: string
  model: string
  fullName: string
  startingPrice: number
  endingPrice: number
  fuelType?: string
}

interface PricingSectionProps {
  carData: CarData
}

export default function PricingSection({ carData }: PricingSectionProps) {
  const displayStartPrice = carData.startingPrice
  const displayEndPrice = carData.endingPrice
  const priceLabel = 'Ex-Showroom'
  const cityName = 'Delhi' // Fallback city since on-road is removed

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`
    } else {
      return `₹${price.toLocaleString()}`
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
        {carData.fullName} - Price
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Price Display */}
        <div className="space-y-4">
          <div className="text-center lg:text-left">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {formatPrice(displayStartPrice)} - {formatPrice(displayEndPrice)}
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              {priceLabel} price in {cityName}
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base font-medium text-orange-800">Starting EMI</span>
              <span className="text-lg sm:text-xl font-bold text-orange-800">
                ₹{Math.round(displayStartPrice * 0.012).toLocaleString()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-orange-700">
              *EMI calculated for 5 years at 10.5% interest rate
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
            Get On Road Price
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">
              EMI Calculator
            </button>
            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">
              Compare Variants
            </button>
          </div>

          <div className="pt-2 sm:pt-4 border-t border-gray-200">
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p>• Prices may vary by location and dealer</p>
              <p>• Additional charges may apply</p>
              <p>• Offers and discounts subject to availability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
