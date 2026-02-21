'use client'

import { Calendar, Fuel, Users, Gauge, Shield, Trophy, Star, Settings } from 'lucide-react'

interface CarOverviewProps {
  carName: string
  brand: string
  price: string
}

export default function CarOverview({ carName, brand, price }: CarOverviewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Car Title and Rating */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {carName}
        </h1>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold text-gray-900">4.5</span>
            </div>
            <span className="text-gray-600">(1,234 reviews)</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Launched 2022</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl lg:text-3xl font-bold text-primary-600 mb-1">
            {price}
          </p>
          <p className="text-sm text-gray-500">
            Ex-showroom price in Delhi
          </p>
        </div>
      </div>

      {/* Key Specifications */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Specifications</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Fuel className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Mileage</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">20 kmpl</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Engine</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">1498 cc</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Seating</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">5 Seater</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Body Type</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">Sedan</p>
          </div>
        </div>
      </div>

      {/* Engine Performance */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Engine & Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Max Power</p>
            <p className="text-lg font-semibold text-gray-900">110 bhp</p>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Max Torque</p>
            <p className="text-lg font-semibold text-gray-900">140 Nm</p>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Transmission</p>
            <p className="text-lg font-semibold text-gray-900">Manual</p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-primary-600" />
              <span>Comfort & Convenience</span>
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Air Conditioner</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Power Steering</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Safety Features</span>
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Airbags</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm text-gray-700">ABS</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-600">4.5</p>
            <p className="text-sm text-gray-600">User Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">20</p>
            <p className="text-sm text-gray-600">Mileage (kmpl)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">1498</p>
            <p className="text-sm text-gray-600">Engine (cc)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">5</p>
            <p className="text-sm text-gray-600">Seating</p>
          </div>
        </div>
      </div>
    </div>
  )
}
