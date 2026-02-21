'use client'

import { useState } from 'react'
import { Heart, Share2, BarChart3, Calculator, Phone, Shield, Award, Users } from 'lucide-react'

interface CarActionsProps {
  carName: string
  price: string
}

export default function CarActions({ carName, price }: CarActionsProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Delhi')

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata']

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: carName,
        text: `Check out ${carName} - ${price}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Price & Location Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Best Price</h3>
        
        {/* City Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Your City
          </label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <Shield className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-700 mb-1">On-road price in {selectedCity}</p>
          <p className="text-2xl font-bold text-primary-600">{price}</p>
          <p className="text-xs text-primary-600">*Estimated price including RTO & Insurance</p>
        </div>

        {/* Primary Actions */}
        <div className="space-y-3">
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Get Price Quote</span>
          </button>
          
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
            Book Test Drive
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWishlist}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border transition-colors duration-200 ${
              isWishlisted
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">
              {isWishlisted ? 'Saved' : 'Save'}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">Share</span>
          </button>

          <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">Compare</span>
          </button>

          <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
            <Calculator className="h-4 w-4" />
            <span className="text-sm font-medium">EMI</span>
          </button>
        </div>
      </div>

      {/* Tools & Resources */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools & Resources</h3>
        
        <div className="space-y-3">
          <button className="w-full flex items-center space-x-3 py-3 px-4 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <Calculator className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">EMI Calculator</p>
              <p className="text-sm text-gray-500">Calculate monthly payments</p>
            </div>
          </button>

          <button className="w-full flex items-center space-x-3 py-3 px-4 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <Award className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">Price Breakup</p>
              <p className="text-sm text-gray-500">Detailed cost analysis</p>
            </div>
          </button>

          <button className="w-full flex items-center space-x-3 py-3 px-4 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <Users className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">Download Brochure</p>
              <p className="text-sm text-gray-500">Get detailed specifications</p>
            </div>
          </button>

          <button className="w-full flex items-center space-x-3 py-3 px-4 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <Shield className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">Find Dealers</p>
              <p className="text-sm text-gray-500">Locate nearby showrooms</p>
            </div>
          </button>
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p className="text-primary-100 text-sm mb-4">
          Our car experts are here to help you make the right choice
        </p>
        <button className="w-full bg-white text-primary-600 font-semibold py-3 px-4 rounded-lg hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>Call Expert</span>
        </button>
        <p className="text-center text-primary-200 text-xs mt-2">
          Free consultation • No spam calls
        </p>
      </div>

      {/* Safety Badge */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <span className="font-medium text-green-800">Verified Dealer Network</span>
        </div>
        <p className="text-sm text-green-700">
          All our partner dealers are verified and offer transparent pricing with no hidden charges.
        </p>
      </div>
    </div>
  )
}
