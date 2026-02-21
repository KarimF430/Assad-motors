'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Heart, Plus, Check } from 'lucide-react'
import PageSection from '../common/PageSection'
import Card from '../common/Card'

interface ComparisonCar {
  id: string
  name: string
  brand: string
  price: string
  priceRange: string
  image: string
  rating: number
  reviewCount: number
  mileage: string
  engine: string
  fuelType: string
  transmission: string
  seating: number
  safetyRating: number
  keyFeatures: string[]
  pros: string[]
  cons: string[]
}

interface CarComparisonSectionProps {
  comparisonCars?: ComparisonCar[]
  currentCar?: ComparisonCar
}

export default function CarComparisonSection({ comparisonCars = [], currentCar }: CarComparisonSectionProps) {
  const [selectedCars, setSelectedCars] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock comparison cars removed - using real data from backend only
  const carsToShow = comparisonCars

  // Don't render if no comparison cars
  if (carsToShow.length === 0) {
    return null
  }

  const toggleCarSelection = (carId: string) => {
    setSelectedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : prev.length < 3 ? [...prev, carId] : prev
    )
  }

  const nextCars = () => {
    setCurrentIndex((prev) => 
      prev + 3 >= carsToShow.length ? 0 : prev + 3
    )
  }

  const prevCars = () => {
    setCurrentIndex((prev) => 
      prev - 3 < 0 ? Math.max(0, carsToShow.length - 3) : prev - 3
    )
  }

  const ComparisonCard = ({ car, isSelected }: { car: ComparisonCar; isSelected: boolean }) => (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'}`}>
      <div className="relative">
        {/* Selection Checkbox */}
        <button
          onClick={() => toggleCarSelection(car.id)}
          className="absolute top-2 right-2 z-10"
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'bg-white border-gray-300 hover:border-blue-400'
          }`}>
            {isSelected && <Check className="w-4 h-4" />}
          </div>
        </button>

        {/* Wishlist Button */}
        <button className="absolute top-2 left-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* Car Image */}
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          <img 
            src={car.image} 
            alt={`${car.brand} ${car.name}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Car Details */}
        <div className="space-y-3">
          {/* Brand and Name */}
          <div>
            <p className="text-sm text-gray-600">{car.brand}</p>
            <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded text-sm">
              <Star className="w-3 h-3 mr-1 fill-current" />
              <span className="font-medium">{car.rating}</span>
            </div>
            <span className="text-sm text-gray-600">({car.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div>
            <p className="text-2xl font-bold text-green-600">₹{car.price}</p>
            <p className="text-sm text-gray-600">Ex-showroom price</p>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Mileage:</span>
              <span className="font-medium ml-1">{car.mileage}</span>
            </div>
            <div>
              <span className="text-gray-600">Engine:</span>
              <span className="font-medium ml-1">{car.engine}</span>
            </div>
            <div>
              <span className="text-gray-600">Fuel:</span>
              <span className="font-medium ml-1">{car.fuelType}</span>
            </div>
            <div>
              <span className="text-gray-600">Safety:</span>
              <span className="font-medium ml-1">{car.safetyRating}★</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Get On-Road Price
            </button>
            <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg font-medium transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Card>
  )

  const ComparisonTable = () => (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-medium text-gray-900">Specification</th>
              {selectedCars.slice(0, 3).map(carId => {
                const car = carsToShow.find(c => c.id === carId)
                return car ? (
                  <th key={car.id} className="text-center py-4 px-4">
                    <div className="space-y-2">
                      <img src={car.image} alt={car.name} className="w-20 h-15 object-cover rounded mx-auto" />
                      <div>
                        <p className="font-bold text-gray-900">{car.brand} {car.name}</p>
                        <p className="text-sm text-green-600 font-semibold">₹{car.price}</p>
                      </div>
                    </div>
                  </th>
                ) : null
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { label: 'Price Range', key: 'priceRange' },
              { label: 'Mileage', key: 'mileage' },
              { label: 'Engine', key: 'engine' },
              { label: 'Transmission', key: 'transmission' },
              { label: 'Seating Capacity', key: 'seating' },
              { label: 'Safety Rating', key: 'safetyRating' },
              { label: 'User Rating', key: 'rating' }
            ].map((spec) => (
              <tr key={spec.key} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{spec.label}</td>
                {selectedCars.slice(0, 3).map(carId => {
                  const car = carsToShow.find(c => c.id === carId)
                  return car ? (
                    <td key={car.id} className="py-3 px-4 text-center">
                      <span className="font-medium">
                        {spec.key === 'safetyRating' ? `${car[spec.key as keyof ComparisonCar]}★` : 
                         spec.key === 'rating' ? `${car[spec.key as keyof ComparisonCar]}★` :
                         spec.key === 'seating' ? `${car[spec.key as keyof ComparisonCar]} Seater` :
                         car[spec.key as keyof ComparisonCar]}
                      </span>
                    </td>
                  ) : null
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )

  return (
    <PageSection 
      title="Compare Similar Cars"
      subtitle="Select up to 3 cars to compare specifications, features, and prices"
      background="gray"
    >
      <div className="space-y-6">
        {/* View Toggle and Selected Cars Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('table')}
              disabled={selectedCars.length === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'table' && selectedCars.length > 0
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              Compare Table
            </button>
          </div>
          
          {selectedCars.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedCars.length} car{selectedCars.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedCars([])}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content based on view mode */}
        {viewMode === 'cards' ? (
          <div className="space-y-4">
            {/* Navigation for cards */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevCars}
                disabled={currentIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <span className="text-sm text-gray-600">
                Showing {currentIndex + 1}-{Math.min(currentIndex + 3, carsToShow.length)} of {carsToShow.length} cars
              </span>
              
              <button
                onClick={nextCars}
                disabled={currentIndex + 3 >= carsToShow.length}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Car Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carsToShow.slice(currentIndex, currentIndex + 3).map((car) => (
                <ComparisonCard 
                  key={car.id} 
                  car={car} 
                  isSelected={selectedCars.includes(car.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {selectedCars.length > 0 ? (
              <ComparisonTable />
            ) : (
              <Card className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select cars to compare
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Choose up to 3 cars from the card view to see a detailed comparison table
                  </p>
                  <button
                    onClick={() => setViewMode('cards')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Browse Cars
                  </button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Quick Compare Button for selected cars */}
        {selectedCars.length >= 2 && viewMode === 'cards' && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setViewMode('table')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg font-medium transition-all transform hover:scale-105"
            >
              Compare {selectedCars.length} Cars
            </button>
          </div>
        )}
      </div>
    </PageSection>
  )
}
