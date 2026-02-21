'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ColorOption {
  id: string
  name: string
  hexCode: string
  image: string
}

interface ColorOptionsProps {
  carName: string
  colors: ColorOption[]
}

export default function ColorOptions({ carName, colors }: ColorOptionsProps) {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)

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
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          {carName} Colours
        </h2>

        {/* Main Color Display */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevColor}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>

          <button
            onClick={nextColor}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center group"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>

          {/* Car Image Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mx-8 relative overflow-hidden">
            <div className="relative flex justify-center items-center min-h-[200px]">
              <div className="transition-all duration-500 ease-in-out">
                <img 
                  src={colors[currentColorIndex].image}
                  alt={`${carName} in ${colors[currentColorIndex].name}`}
                  className="max-w-full h-auto max-h-48 object-contain transition-all duration-500"
                />
              </div>
            </div>

            {/* Color Name */}
            <div className="p-3 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {colors[currentColorIndex].name}
              </h3>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {colors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToColor(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentColorIndex
                  ? 'bg-red-500'
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
