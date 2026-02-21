'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar, MapPin, Fuel, Clock, Bell } from 'lucide-react'
import Link from 'next/link'

interface UpcomingCarsProps {
  carData: {
    brand: string
  }
}

export default function UpcomingCars({ carData }: UpcomingCarsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Mock upcoming cars removed - will fetch real data from backend
  const upcomingCars: any[] = []

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Don't render if no upcoming cars
  if (upcomingCars.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Upcoming {carData.brand} Cars
        </h2>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {upcomingCars.map((car) => (
            <div key={car.id} className="flex-shrink-0 w-72">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>

                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${car.status === 'Confirmed'
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-black'
                    }`}>
                    {car.status}
                  </span>
                  <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                    <Bell className="h-4 w-4" />
                  </button>
                </div>

                {/* Car Image Placeholder */}
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4 text-center">
                  <div className="text-6xl font-bold opacity-50">CAR</div>
                </div>

                {/* Car Details */}
                <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                <p className="text-lg font-semibold mb-4">{car.expectedPrice}</p>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{car.launchDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Fuel className="h-4 w-4" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{car.bodyType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{car.city}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {car.keyFeatures.slice(0, 3).map((feature: string, index: number) => (
                      <span key={index} className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {car.keyFeatures.length > 3 && (
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                        +{car.keyFeatures.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-white text-orange-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Get Notified
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Timeline */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold mb-4">Launch Timeline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingCars.map((car, index) => (
            <div key={car.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${car.status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
              <div>
                <div className="font-medium text-sm">{car.name}</div>
                <div className="text-xs text-gray-600">{car.launchDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 text-center">
        <h3 className="font-semibold mb-2">Never Miss a Launch</h3>
        <p className="text-gray-600 mb-4">Get notified about upcoming {carData.brand} car launches</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}
