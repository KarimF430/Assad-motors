'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import CitySelector from './CitySelector'

export default function LocationHeader() {
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false)

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    // Here you would typically update the global state/context
    // and trigger price updates based on the selected city
  }

  return (
    <>
      {/* Minimal Location Icon Button */}
      <button
        onClick={() => setIsCitySelectorOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
        title={`Current location: ${selectedCity}`}
        aria-label="Select city"
      >
        <MapPin className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
      </button>

      <CitySelector
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
      />
    </>
  )
}
