'use client'

import { useState } from 'react'

interface CarColor {
  id: string
  name: string
  hexCode: string
  imageUrl: string
}

interface ColorSectionProps {
  carName: string
  colors: CarColor[]
}

export default function ColorSection({ carName, colors }: ColorSectionProps) {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)

  if (!colors || colors.length === 0) {
    return null
  }

  const currentColor = colors[currentColorIndex]

  const nextColor = () => {
    setCurrentColorIndex((prev) => (prev + 1) % colors.length)
  }

  const prevColor = () => {
    setCurrentColorIndex((prev) => (prev - 1 + colors.length) % colors.length)
  }

  const goToColor = (index: number) => {
    setCurrentColorIndex(index)
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-700 mb-12">
          {carName} Colours
        </h2>

        {/* Main Color Display */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevColor}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextColor}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Car Display Card */}
          <div className="bg-white rounded-2xl shadow-xl mx-8 overflow-hidden">
            <div className="relative h-96 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
              {/* Car Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                {currentColor.imageUrl ? (
                  <img
                    src={currentColor.imageUrl}
                    alt={`${carName} in ${currentColor.name}`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  /* Placeholder car silhouette */
                  <div className="relative">
                    <svg
                      width="400"
                      height="200"
                      viewBox="0 0 400 200"
                      className="text-gray-300"
                      fill="currentColor"
                    >
                      {/* Car silhouette */}
                      <path d="M50 150 L80 120 L120 110 L280 110 L320 120 L350 150 L350 170 L320 170 L320 160 L80 160 L80 170 L50 170 Z" />
                      {/* Wheels */}
                      <circle cx="100" cy="160" r="20" fill="currentColor" />
                      <circle cx="300" cy="160" r="20" fill="currentColor" />
                      {/* Windows */}
                      <path d="M90 120 L110 100 L290 100 L310 120 L280 120 L120 120 Z" fill="rgba(0,0,0,0.1)" />
                    </svg>
                    {/* Color overlay */}
                    <div 
                      className="absolute inset-0 opacity-80"
                      style={{ 
                        background: `linear-gradient(135deg, ${currentColor.hexCode}, ${currentColor.hexCode}dd)`,
                        mixBlendMode: 'multiply'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Color Name */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {currentColor.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {colors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToColor(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentColorIndex
                  ? 'bg-red-500 scale-125'
                  : index === currentColorIndex - 1 || 
                    (currentColorIndex === 0 && index === colors.length - 1)
                  ? 'bg-red-400'
                  : index === currentColorIndex + 1 || 
                    (currentColorIndex === colors.length - 1 && index === 0)
                  ? 'bg-red-400'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Color Thumbnails */}
        <div className="flex justify-center mt-8 space-x-4 overflow-x-auto pb-4">
          {colors.map((color, index) => (
            <button
              key={color.id}
              onClick={() => goToColor(index)}
              className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all duration-200 ${
                index === currentColorIndex
                  ? 'border-red-500 bg-red-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.hexCode }}
                />
                <span className="text-xs font-normal text-gray-700 text-center">
                  {color.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
