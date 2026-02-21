'use client'

import { useRef } from 'react'
import { Calendar, Fuel, Users, ChevronRight, ChevronLeft } from 'lucide-react'

interface UpcomingCar {
  id: string
  name: string
  brand: string
  expectedPrice: string
  launchDate: string
  fuelType: string
  seating: string
  image: string
  status: 'Coming' | 'Expected'
}

interface UpcomingCarsSectionProps {
  upcomingCars: UpcomingCar[]
}

export default function UpcomingCarsSection({ upcomingCars }: UpcomingCarsSectionProps) {
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
            Upcoming Cars
          </h2>
          <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center transition-colors">
            View All Cars
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Cars Container */}
        <div className="relative mb-6">
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
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {upcomingCars.map((car) => (
              <div key={car.id} className="flex-none w-72">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Car Image */}
                  <div className="relative h-40 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-4">
                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${car.status === 'Coming' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
                      {car.status}
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
                      <p className="text-green-600 font-bold text-lg">₹ {car.expectedPrice}</p>
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

                    {/* Get Notified Button */}
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                      Get Notified
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AD Banner */}
        <div className="bg-gray-300 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-600">AD Banner</h3>
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
