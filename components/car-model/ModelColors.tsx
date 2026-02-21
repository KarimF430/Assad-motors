'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarColor {
  id: string
  name: string
  hexCode: string
  popular: boolean
}

interface ModelColorsProps {
  colors: CarColor[]
  carName: string
}

export default function ModelColors({ colors, carName }: ModelColorsProps) {
  const [selectedColor, setSelectedColor] = useState(colors?.[0]?.id || '')

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('colors-container')
    if (container) {
      const scrollAmount = 200
      const newScrollLeft = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const selectedColorData = colors?.find(color => color.id === selectedColor)

  // Handle case where colors array is empty or undefined
  if (!colors || colors.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {carName || 'Car'} - Model Colours
        </h2>
        <p className="text-gray-600">Color information not available</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {carName || 'Car'} - Model Colours
      </h2>

      {/* Horizontal Scroll of Car PNGs in Different Colors */}
      <div className="relative">
        <div className="flex items-center">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollContainer('left')}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors mr-3 flex-shrink-0 shadow-sm"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>

          {/* Colors Container */}
          <div
            id="colors-container"
            className="flex space-x-4 overflow-x-auto scrollbar-hide flex-1 pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                className="flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
                onClick={() => setSelectedColor(color.id)}
                aria-label={`Select color ${color.name}`}
                aria-pressed={selectedColor === color.id}
              >
                <div className={`relative p-3 rounded-lg border-2 transition-all ${selectedColor === color.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {/* Car PNG placeholder with color tint */}
                  <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">CAR</span>
                    </div>
                    {/* Color overlay to simulate car color */}
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-multiply"
                      style={{ backgroundColor: color.hexCode }}
                    ></div>
                    {/* Selection indicator */}
                    {selectedColor === color.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                    {/* Popular badge */}
                    {color.popular && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                  </div>

                  {/* Color Name and Color Dot */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hexCode }}
                      ></div>
                      <p className="text-xs font-medium text-gray-900">
                        {color.name}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollContainer('right')}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors ml-3 flex-shrink-0 shadow-sm"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Selected Color Info */}
      {selectedColorData && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: selectedColorData.hexCode }}
            ></div>
            <div>
              <p className="font-semibold text-gray-900">{selectedColorData.name}</p>
              <p className="text-sm text-gray-600">
                {selectedColorData.popular ? 'Popular choice with great resale value' : 'Premium color option'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
