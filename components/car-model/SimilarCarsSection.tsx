'use client'

import { useState } from 'react'
import { Users, Fuel, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

interface SimilarCar {
  id: string
  name: string
  brand: string
  price: string
  fuelType: string
  seating: string
  mileage: string
  location: string
  image: string
}

interface SimilarCarsSectionProps {
  carName: string
  similarCars: SimilarCar[]
}

export default function SimilarCarsSection({ carName, similarCars }: SimilarCarsSectionProps) {
  return (
    <section className="py-6 sm:py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Similar cars to {carName}
        </h2>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <button
            onClick={() => {
              const container = document.getElementById('similar-cars-section-scroll')
              container?.scrollBy({ left: -300, behavior: 'smooth' })
            }}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              const container = document.getElementById('similar-cars-section-scroll')
              container?.scrollBy({ left: 300, behavior: 'smooth' })
            }}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Horizontal Scrollable Cars */}
          <div id="similar-cars-section-scroll" className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {similarCars.map((car) => (
              <div
                key={car.id}
                className="flex-shrink-0 w-[280px] sm:w-72 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Car Image */}
                <div className="relative h-44 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="w-12 h-8 bg-gray-500 rounded mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">CAR</span>
                    </div>
                    <p className="text-gray-700 text-xs font-medium">{car.name}</p>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-5">
                  {/* Car Name and Price */}
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg sm:text-lg">{car.name}</h3>
                    <p className="text-red-600 font-bold text-xl sm:text-xl">₹ {car.price}</p>
                  </div>

                  {/* Car Specifications */}
                  <div className="space-y-2 sm:space-y-2.5 text-base sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    <div className="flex items-center">
                      <Fuel className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{car.fuelType}</span>
                    </div>

                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{car.seating}</span>
                    </div>

                    <div className="flex items-center">
                      <div className="h-4 w-4 mr-3 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span>{car.mileage}</span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white py-3 rounded-lg transition-all duration-200 text-sm font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
