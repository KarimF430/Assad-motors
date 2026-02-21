
'use client'

import { useState } from 'react'

interface ModelSummarySectionProps {
  carName: string
  summaryData: {
    description: string[]
    exteriorDesign: string[]
    comfortConvenience: string[]
  }
}

export default function ModelSummarySection({ carName, summaryData }: ModelSummarySectionProps) {
  const [showDescription, setShowDescription] = useState(false)
  const [showExterior, setShowExterior] = useState(false)
  const [showComfort, setShowComfort] = useState(false)

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          {carName} Summary
        </h2>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

          {/* Description Section */}
          {summaryData.description && summaryData.description.length > 0 && (
            <div className="mb-5 last:mb-0">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></div>
                Description
              </h3>
              <div className="ml-4">
                <div className={`text-gray-700 text-sm leading-relaxed font-normal space-y-2 ${!showDescription ? 'line-clamp-4' : ''}`}>
                  {summaryData.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-red-500 hover:text-red-600 font-normal text-sm transition-colors mt-1"
                >
                  {showDescription ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
          )}

          {/* Exterior Design Section */}
          {summaryData.exteriorDesign && summaryData.exteriorDesign.length > 0 && (
            <div className="mb-5 last:mb-0">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></div>
                Exterior Design
              </h3>
              <div className="ml-4">
                <div className={`text-gray-700 text-sm leading-relaxed font-normal space-y-2 ${!showExterior ? 'line-clamp-4' : ''}`}>
                  {summaryData.exteriorDesign.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <button
                  onClick={() => setShowExterior(!showExterior)}
                  className="text-red-500 hover:text-red-600 font-normal text-sm transition-colors mt-1"
                >
                  {showExterior ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
          )}

          {/* Comfort & Convenience Section */}
          {summaryData.comfortConvenience && summaryData.comfortConvenience.length > 0 && (
            <div className="mb-5 last:mb-0">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></div>
                Comfort & Convenience
              </h3>
              <div className="ml-4">
                <div className={`text-gray-700 text-sm leading-relaxed font-normal space-y-2 ${!showComfort ? 'line-clamp-4' : ''}`}>
                  {summaryData.comfortConvenience.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <button
                  onClick={() => setShowComfort(!showComfort)}
                  className="text-red-500 hover:text-red-600 font-normal text-sm transition-colors mt-1"
                >
                  {showComfort ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
