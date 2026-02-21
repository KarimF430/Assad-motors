'use client'

import { IndianRupee, TrendingUp } from 'lucide-react'

interface CarPricingSectionProps {
  carData: {
    startingPrice: number
    endingPrice: number
    fullName: string
  }
}

export default function CarPricingSection({ carData }: CarPricingSectionProps) {
  const formatPrice = (price: number) => {
    return (price / 100000).toFixed(2)
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Price Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                    ₹{formatPrice(carData.startingPrice)}
                  </span>
                  <span className="text-xl text-gray-600">-</span>
                  <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                    ₹{formatPrice(carData.endingPrice)}
                  </span>
                  <span className="text-lg text-gray-600 font-medium">Lakh</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  *Ex-showroom price in New Delhi
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Get On-Road Price
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105">
              View All Variants
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Best-in-class features</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>5-star safety rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Low maintenance cost</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
