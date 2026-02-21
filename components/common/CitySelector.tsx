'use client'

import { useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'
import { dispatchCityChange } from '@/lib/city-events'

interface City {
  id: string
  name: string
  state: string
  icon: string
}

interface CitySelectorProps {
  isOpen: boolean
  onClose: () => void
  selectedCity: string
  onCitySelect: (city: string) => void
}

export default function CitySelector({ isOpen, onClose, selectedCity, onCitySelect }: CitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const popularCities: City[] = [
    { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', icon: '🏙️' },
    { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', icon: '🌆' },
    { id: 'delhi', name: 'Delhi', state: 'Delhi', icon: '🏛️' },
    { id: 'pune', name: 'Pune', state: 'Maharashtra', icon: '🏢' },
    { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', icon: '🕌' },
    { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', icon: '🏘️' },
    { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', icon: '🏖️' },
    { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', icon: '🌉' }
  ]

  const allCities = [
    ...popularCities,
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', icon: '🏰' },
    { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', icon: '🕌' },
    { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', icon: '🏭' },
    { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', icon: '🌳' },
    { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', icon: '🏛️' },
    { id: 'thane', name: 'Thane', state: 'Maharashtra', icon: '🏘️' },
    { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', icon: '🌊' },
    { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', icon: '⛵' },
    { id: 'pimpri', name: 'Pimpri-Chinchwad', state: 'Maharashtra', icon: '🏢' },
    { id: 'patna', name: 'Patna', state: 'Bihar', icon: '🏛️' },
    { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', icon: '🏘️' },
    { id: 'ghaziabad', name: 'Ghaziabad', state: 'Uttar Pradesh', icon: '🏙️' },
    { id: 'ludhiana', name: 'Ludhiana', state: 'Punjab', icon: '🌾' },
    { id: 'agra', name: 'Agra', state: 'Uttar Pradesh', icon: '🕌' },
    { id: 'nashik', name: 'Nashik', state: 'Maharashtra', icon: '🍇' },
    { id: 'faridabad', name: 'Faridabad', state: 'Haryana', icon: '🏭' },
    { id: 'meerut', name: 'Meerut', state: 'Uttar Pradesh', icon: '🏘️' },
    { id: 'rajkot', name: 'Rajkot', state: 'Gujarat', icon: '🏛️' },
    { id: 'kalyan', name: 'Kalyan-Dombivali', state: 'Maharashtra', icon: '🏘️' },
    { id: 'vasai', name: 'Vasai-Virar', state: 'Maharashtra', icon: '🏖️' }
  ]

  const filteredCities = allCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCitySelect = (cityName: string) => {
    // Save to localStorage for persistence across pages
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCity', cityName)
      // Dispatch custom event for instant updates
      dispatchCityChange(cityName)
    }
    onCitySelect(cityName)
    onClose()
  }

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          // For now, we'll just select Mumbai as a fallback
          handleCitySelect('Mumbai')
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to Mumbai
          handleCitySelect('Mumbai')
        }
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Select your City</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type your Pincode or City"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Detect Location */}
          <button
            onClick={handleDetectLocation}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <MapPin className="h-5 w-5" />
            <span>Detect my location</span>
          </button>

          {/* Popular Cities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Cities</h3>
            <div className="grid grid-cols-2 gap-4">
              {(searchQuery ? filteredCities.slice(0, 8) : popularCities).map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city.name)}
                  className="flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-2 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                    <span className="text-2xl">{city.icon}</span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm">{city.name}</span>
                  <span className="text-xs text-gray-500">{city.state}</span>
                </button>
              ))}
            </div>
          </div>

          {/* All Cities List (when searching) */}
          {searchQuery && filteredCities.length > 8 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Cities</h3>
              <div className="space-y-2">
                {filteredCities.slice(8).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.name)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm">{city.icon}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.state}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery && filteredCities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No cities found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
