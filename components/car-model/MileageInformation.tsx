'use client'

import { useState } from 'react'

interface MileageData {
  id: string
  engineType: string
  transmission: string
  companyClaimed: string
  cityRealWorld: string
  highwayRealWorld: string
}

interface MileageInformationProps {
  carName: string
  mileageData: MileageData[]
}

export default function MileageInformation({ carName, mileageData }: MileageInformationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          {carName} Mileage
        </h2>

        {/* Horizontal Scrollable Container */}
        {/* Mileage Cards Horizontal Scroll */}
        <div className="relative">
          <div className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {mileageData.map((mileage, index) => (
              <div
                key={mileage.id}
                className="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 min-w-[280px]"
              >
                {/* Engine & Transmission Header */}
                <div className="text-center mb-4">
                  <h3 className="text-red-500 font-bold text-sm mb-1">
                    Engine & Transmission
                  </h3>
                  <p className="text-red-500 font-bold text-base">
                    {mileage.engineType}
                  </p>
                  <p className="text-red-500 font-bold text-base">
                    {mileage.transmission}
                  </p>
                </div>

                {/* Mileage Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">Company Claimed</span>
                    <span className="text-gray-900 font-bold text-sm">{mileage.companyClaimed}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">City Real World</span>
                    <span className="text-gray-900 font-bold text-sm">{mileage.cityRealWorld}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium text-sm">Highway Real World</span>
                    <span className="text-gray-900 font-bold text-sm">{mileage.highwayRealWorld}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {mileageData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                  ? 'bg-red-500'
                  : 'bg-gray-400 hover:bg-gray-500'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
