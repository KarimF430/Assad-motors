'use client'

import { useRef } from 'react'
import { Calendar, Fuel, Users, ChevronRight, ChevronLeft } from 'lucide-react'

interface NewLaunchCar {
  id: string
  name: string
  brand: string
  price: string
  launchDate: string
  fuelType: string
  seating: string
  image: string
  isNew: boolean
}

interface NewLaunchesSectionProps {
  newLaunches: NewLaunchCar[]
}

export default function NewLaunchesSection({ newLaunches }: NewLaunchesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            New Launched Cars
          </h2>
          <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center transition-colors">
            View All Cars
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Cars Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Horizontal Scroll Container */}
          {/* New Launches Horizontal Scroll */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {newLaunches.map((car) => (
                <div key={car.id} className="flex-none w-72">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Car Image */}
                    <div className="relative h-40 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
                      {/* New Badge */}
                      {car.isNew && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          NEW
                        </div>
                      )}

                      {/* Heart Icon */}
                      <div className="absolute top-3 right-3 w-6 h-6 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>

                      {/* Car Placeholder */}
                      <div className="text-center text-white">
                        <div className="w-20 h-12 bg-white/25 backdrop-blur-sm rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">CAR</span>
                        </div>
                        <p className="text-white text-sm font-semibold">{car.name}</p>
                      </div>
                    </div>

                    {/* Car Details */}
                    <div className="p-4">
                      {/* Car Name and Price */}
                      <div className="mb-3">
                        <h3 className="text-gray-900 font-bold text-lg mb-1">{car.name}</h3>
                        <p className="text-green-600 font-bold text-lg">₹ {car.price}</p>
                      </div>

                      {/* Car Specifications */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="w-3 h-3 mr-2" />
                          <span>{car.launchDate}</span>
                        </div>

                        <div className="flex items-center text-gray-600 text-sm">
                          <Fuel className="w-3 h-3 mr-2" />
                          <span>{car.fuelType}</span>
                        </div>

                        <div className="flex items-center text-gray-600 text-sm">
                          <Users className="w-3 h-3 mr-2" />
                          <span>{car.seating}</span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
