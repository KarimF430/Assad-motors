'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react'

interface CarHeroSectionProps {
  carData: {
    fullName: string
    images: string[]
    rating: number
    reviewCount: number
    description: string
  }
}

export default function CarHeroSection({ carData }: CarHeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === carData.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? carData.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Car Image Section */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={carData.images[currentImageIndex]}
                alt={`${carData.fullName} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              
              {/* Navigation Arrows */}
              {carData.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Image Indicators */}
            {carData.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {carData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'bg-white shadow-lg scale-110' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Car Details Section */}
          <div className="order-1 lg:order-2 text-white">
            <div className="space-y-6">
              
              {/* Car Title and Rating */}
              <div>
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                  {carData.fullName}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{carData.rating}</span>
                    <span className="text-white/80">({carData.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      isWishlisted 
                        ? 'bg-red-500 text-white shadow-lg scale-110' 
                        : 'bg-white/20 hover:bg-white/30 text-white hover:scale-110'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-white/90 leading-relaxed text-lg">
                  {carData.description.length > 150 
                    ? `${carData.description.substring(0, 150)}...` 
                    : carData.description
                  }
                  {carData.description.length > 150 && (
                    <button className="text-yellow-300 hover:text-yellow-200 font-medium ml-2 underline transition-colors">
                      Read more
                    </button>
                  )}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-orange-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                  Book Test Drive
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105">
                  Get Best Price
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
