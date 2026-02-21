'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ModelHighlightsProps {
  carData: {
    brand: string
    model: string
    fullName?: string
    images?: string[]
  }
}

export default function ModelHighlights({ carData }: ModelHighlightsProps) {
  const [activeTab, setActiveTab] = useState('features')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const tabs = [
    { id: 'features', label: 'Key Features' },
    { id: 'comfort', label: 'Space & Comfort' },
    { id: 'storage', label: 'Storage & Convenience' }
  ]

  const featuresContent = {
    features: [
      {
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        title: '17-INCH ALLOY WHEELS',
        description: 'Premium diamond-cut alloy wheels with distinctive design and superior performance'
      },
      {
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        title: '8-INCH TOUCHSCREEN INFOTAINMENT',
        description: 'Advanced touchscreen system with smartphone connectivity and navigation'
      }
    ],
    comfort: [
      {
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        title: 'SPACIOUS CABIN DESIGN',
        description: 'Generous legroom and headroom for maximum passenger comfort'
      },
      {
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        title: 'PREMIUM UPHOLSTERY',
        description: 'High-quality fabric seats with ergonomic design and superior comfort'
      }
    ],
    storage: [
      {
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        title: 'LARGE BOOT SPACE',
        description: '382 liters of cargo capacity with flexible loading options'
      },
      {
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        title: 'MULTIPLE STORAGE COMPARTMENTS',
        description: 'Convenient storage solutions throughout the cabin'
      }
    ]
  }

  const nextImage = () => {
    const currentContent = featuresContent[activeTab as keyof typeof featuresContent]
    const currentFeature = currentContent[Math.floor(currentImageIndex / 2)]
    const maxImages = currentFeature.images.length * currentContent.length
    setCurrentImageIndex((prev) => (prev + 1) % maxImages)
  }

  const prevImage = () => {
    const currentContent = featuresContent[activeTab as keyof typeof featuresContent]
    const currentFeature = currentContent[Math.floor(currentImageIndex / 2)]
    const maxImages = currentFeature.images.length * currentContent.length
    setCurrentImageIndex((prev) => (prev - 1 + maxImages) % maxImages)
  }

  const currentContent = featuresContent[activeTab as keyof typeof featuresContent]
  const currentFeatureIndex = Math.floor(currentImageIndex / 2)
  const currentFeature = currentContent[currentFeatureIndex]

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          {carData.brand} {carData.model} Highlights
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setCurrentImageIndex(0)
              }}
              className={`pb-4 px-1 font-medium text-lg transition-all duration-300 relative ${
                activeTab === tab.id
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Image */}
        <div className="relative">
          <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={currentFeature?.images[0] || '/api/placeholder/600/400'}
              alt={currentFeature?.title}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrow - Left */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          
          {/* Feature Title - Left */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-gray-700 uppercase tracking-wide">
              {currentFeature?.title}
            </h3>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={currentFeature?.images[1] || '/api/placeholder/600/400'}
              alt={currentFeature?.title}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrow - Right */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          
          {/* Feature Title - Right */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-gray-700 uppercase tracking-wide">
              {currentContent[currentFeatureIndex + 1]?.title || '8-INCH TOUCHSCREEN INFOTAINMENT'}
            </h3>
          </div>
        </div>
      </div>

      {/* Feature Navigation Dots */}
      <div className="flex justify-center mt-8 space-x-3">
        {currentContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index * 2)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              Math.floor(currentImageIndex / 2) === index
                ? 'bg-teal-500 scale-125'
                : 'bg-gray-300 hover:bg-teal-300'
            }`}
          />
        ))}
      </div>

      {/* Description */}
      <div className="mt-8 text-center max-w-3xl mx-auto">
        <p className="text-gray-600 text-lg leading-relaxed">
          {currentFeature?.description}
        </p>
      </div>
    </div>
  )
}
