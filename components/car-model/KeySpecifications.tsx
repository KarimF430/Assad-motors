'use client'

import { Car, Gauge, Shield, Users, Zap, Settings } from 'lucide-react'

interface KeySpecificationsProps {
  specifications: {
    engine?: string
    power?: string
    torque?: string
    transmission?: string
    mileage?: string
    fuelType?: string
    seatingCapacity?: number
    safetyRating?: string
    groundClearance?: string
    driveType?: string
  }
  carName: string
}

export default function KeySpecifications({ specifications, carName }: KeySpecificationsProps) {
  const keySpecs = [
    {
      icon: <Car className="h-6 w-6" />,
      label: 'Engine',
      value: specifications.engine || 'N/A',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      label: 'Ground Clearance',
      value: specifications.groundClearance || 'N/A',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      borderColor: 'border-gray-200'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: 'Power',
      value: specifications.power || 'N/A',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      label: 'Torque',
      value: specifications.torque || 'N/A',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: 'Seating Capacity',
      value: specifications.seatingCapacity?.toString() || 'N/A',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      label: 'Drive Type',
      value: specifications.driveType || 'N/A',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      label: 'Global NCAP Safety Rating',
      value: specifications.safetyRating || 'N/A',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">
          {carName} Specifications
        </h2>
        <p className="text-gray-300 text-sm mt-1">
          Key technical specifications and features
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keySpecs.map((spec, index) => (
            <div
              key={index}
              className={`${spec.bgColor} ${spec.borderColor} border-2 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-105 group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${spec.iconColor} p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    {spec.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {spec.label}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {spec.value}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Performance & Efficiency
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                These specifications represent the optimal balance of performance, efficiency, and safety. 
                Actual values may vary based on driving conditions and variant selected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
