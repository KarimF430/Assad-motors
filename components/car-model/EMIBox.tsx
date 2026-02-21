'use client'

import { Calculator } from 'lucide-react'

interface EMIBoxProps {
  startingPrice: number
  carName: string
}

export default function EMIBox({ startingPrice, carName }: EMIBoxProps) {
  // Calculate approximate EMI (simplified calculation)
  const approximateEMI = Math.round((startingPrice * 100000 * 0.015) / 1000) * 1000 // Rough 1.5% of price

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Starting EMI
            </h3>
            <p className="text-sm text-gray-600">
              *At 8.5% for 5 years
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ₹{(approximateEMI / 1000).toFixed(0)},000/month
          </div>
          <p className="text-sm text-gray-500">
            Down payment: ₹{(startingPrice * 0.2).toFixed(1)} Lakh
          </p>
        </div>
      </div>
    </div>
  )
}
