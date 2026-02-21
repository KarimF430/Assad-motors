'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Fuel, MapPin, Car, Building2, Zap } from 'lucide-react'

interface CarData {
  fullName: string
  brand: string
  model: string
}

interface ModelMileageProps {
  carData: CarData
}

export default function ModelMileage({ carData }: ModelMileageProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedMileage, setSelectedMileage] = useState(0)

  const mileageOptions = [
    {
      type: 'ARAI Certified',
      value: '23.26',
      unit: 'kmpl',
      description: 'Official fuel efficiency rating',
      icon: Fuel,
      color: 'blue',
      conditions: 'Standard test conditions',
      badge: 'Official'
    },
    {
      type: 'City Driving',
      value: '19.5',
      unit: 'kmpl',
      description: 'Heavy traffic & frequent stops',
      icon: Building2,
      color: 'orange',
      conditions: 'Urban traffic conditions',
      badge: 'Real World'
    },
    {
      type: 'Highway',
      value: '25.8',
      unit: 'kmpl',
      description: 'Consistent speed driving',
      icon: Car,
      color: 'green',
      conditions: 'Cruising at 80-100 kmph',
      badge: 'Best Case'
    },
    {
      type: 'Mixed Driving',
      value: '21.2',
      unit: 'kmpl',
      description: 'Combination of city & highway',
      icon: MapPin,
      color: 'purple',
      conditions: '60% city, 40% highway',
      badge: 'Average'
    },
    {
      type: 'Eco Mode',
      value: '24.1',
      unit: 'kmpl',
      description: 'With eco driving techniques',
      icon: Zap,
      color: 'teal',
      conditions: 'Optimized driving style',
      badge: 'Efficient'
    }
  ]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    teal: 'bg-teal-50 border-teal-200 text-teal-600'
  }

  const badgeColors = {
    'Official': 'bg-blue-100 text-blue-700',
    'Real World': 'bg-orange-100 text-orange-700',
    'Best Case': 'bg-green-100 text-green-700',
    'Average': 'bg-purple-100 text-purple-700',
    'Efficient': 'bg-teal-100 text-teal-700'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Fuel className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {carData.fullName} - Mileage & Fuel Efficiency
            </h2>
            <p className="text-gray-600">
              Fuel efficiency across different driving conditions
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Mileage Cards */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 mb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mileageOptions.map((option, index) => {
            const IconComponent = option.icon
            const isSelected = selectedMileage === index

            return (
              <div
                key={index}
                onClick={() => setSelectedMileage(index)}
                className={`flex-shrink-0 w-72 p-6 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                  ? `${colorClasses[option.color as keyof typeof colorClasses]} border-current shadow-lg`
                  : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-6 w-6 ${isSelected ? 'text-current' : 'text-gray-500'}`} />
                    <h3 className={`font-semibold ${isSelected ? 'text-current' : 'text-gray-900'}`}>
                      {option.type}
                    </h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${badgeColors[option.badge as keyof typeof badgeColors]}`}>
                    {option.badge}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className={`text-3xl font-bold ${isSelected ? 'text-current' : 'text-gray-900'}`}>
                      {option.value}
                    </span>
                    <span className={`text-lg font-medium ${isSelected ? 'text-current opacity-80' : 'text-gray-600'}`}>
                      {option.unit}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={`text-sm ${isSelected ? 'text-current opacity-90' : 'text-gray-600'}`}>
                    {option.description}
                  </p>
                  <p className={`text-xs ${isSelected ? 'text-current opacity-75' : 'text-gray-500'}`}>
                    {option.conditions}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
      </div>

      {/* Selected Mileage Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[mileageOptions[selectedMileage].color as keyof typeof colorClasses]}`}>
            {(() => {
              const IconComponent = mileageOptions[selectedMileage].icon
              return <IconComponent className="h-6 w-6" />
            })()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {mileageOptions[selectedMileage].type} - {mileageOptions[selectedMileage].value} {mileageOptions[selectedMileage].unit}
            </h3>
            <p className="text-gray-600">
              {mileageOptions[selectedMileage].description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Fuel Cost per 100km</h4>
            <p className="text-2xl font-bold text-blue-600">
              ₹{Math.round((100 / parseFloat(mileageOptions[selectedMileage].value)) * 105)}
            </p>
            <p className="text-sm text-gray-600">At ₹105/liter petrol</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Monthly Fuel Cost</h4>
            <p className="text-2xl font-bold text-green-600">
              ₹{Math.round((1200 / parseFloat(mileageOptions[selectedMileage].value)) * 105)}
            </p>
            <p className="text-sm text-gray-600">For 1200km/month</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Range per Tank</h4>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(37 * parseFloat(mileageOptions[selectedMileage].value))}km
            </p>
            <p className="text-sm text-gray-600">37-liter fuel tank</p>
          </div>
        </div>
      </div>

      {/* Mileage Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Tips to Improve Fuel Efficiency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-blue-800">Maintain steady speeds and avoid aggressive acceleration</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-blue-800">Keep tires properly inflated to recommended pressure</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-blue-800">Use air conditioning wisely and service regularly</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-blue-800">Plan routes to avoid heavy traffic and congestion</p>
          </div>
        </div>
      </div>
    </div>
  )
}
