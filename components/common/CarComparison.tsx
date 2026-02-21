'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PageSection from './PageSection'

interface ComparisonCar {
  id: string
  name: string
  brand: string
  priceRange: string
  image: string
}

interface CarComparisonProps {
  title?: string
  cars?: ComparisonCar[]
  showTitle?: boolean
  backgroundColor?: 'white' | 'gray'
}

export default function CarComparison({ 
  title = "Compare Similar Cars", 
  cars = [], 
  showTitle = true,
  backgroundColor = 'white'
}: CarComparisonProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Default cars if none provided (matching CarWale style)
  const defaultCars: ComparisonCar[] = [
    {
      id: '1',
      name: 'Tucson',
      brand: 'Hyundai',
      priceRange: '₹7.99 - 13.96 Lakhs',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format'
    },
    {
      id: '2', 
      name: 'Nexon',
      brand: 'Tata',
      priceRange: '₹7.70 - 14.18 Lakhs',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop&auto=format'
    },
    {
      id: '3',
      name: 'Tucson', 
      brand: 'Hyundai',
      priceRange: '₹7.99 - 13.96 Lakhs',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop&auto=format'
    }
  ]

  const carsToShow = cars.length > 0 ? cars : defaultCars
  const visibleCars = carsToShow.slice(currentIndex, currentIndex + 3)

  const nextCars = () => {
    if (currentIndex + 3 < carsToShow.length) {
      setCurrentIndex(currentIndex + 3)
    }
  }

  const prevCars = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - 3))
    }
  }

  return (
    <PageSection 
      title={showTitle ? title : undefined}
      background={backgroundColor}
    >
      <div className="relative">
        {/* Navigation Arrows - only show if more than 3 cars */}
        {carsToShow.length > 3 && (
          <>
            <button
              onClick={prevCars}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={nextCars}
              disabled={currentIndex + 3 >= carsToShow.length}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Cars Comparison Grid */}
        <div className="flex items-center justify-center space-x-6 lg:space-x-8">
          {visibleCars.map((car, index) => (
            <div key={car.id} className="flex items-center">
              {/* Car Card */}
              <div className="text-center group cursor-pointer">
                {/* Car Image */}
                <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-50">
                  <div className="aspect-[4/3] w-48 lg:w-56">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Car Details */}
                <div className="space-y-2">
                  {/* Brand */}
                  <p className="text-lg text-gray-600 font-medium">
                    {car.brand}
                  </p>
                  
                  {/* Model Name */}
                  <h3 className="text-xl lg:text-2xl font-bold text-red-600 mb-3">
                    {car.name}
                  </h3>
                  
                  {/* Price Range */}
                  <p className="text-lg text-gray-600">
                    {car.priceRange}
                  </p>
                </div>
              </div>

              {/* VS Badge - only between cars, not after the last one */}
              {index < visibleCars.length - 1 && (
                <div className="mx-4 lg:mx-6">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">VS</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination dots if more than 3 cars */}
        {carsToShow.length > 3 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(carsToShow.length / 3) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 3)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  Math.floor(currentIndex / 3) === i
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </PageSection>
  )
}