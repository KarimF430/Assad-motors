'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CarData {
  brand: string
  model: string
  fullName: string
}

interface ModelPriceSEOProps {
  carData: CarData
}

export default function ModelPriceSEO({ carData }: ModelPriceSEOProps) {
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({})

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const variantDescriptions = [
    {
      variant: 'LXI',
      price: '₹6.19 Lakh',
      description: 'The Maruti Suzuki Swift LXI is the base variant that comes with essential features like power steering, central locking, and manual air conditioning. This variant offers excellent value for money with reliable performance and fuel efficiency. The LXI variant includes dual front airbags, ABS with EBD, and reverse parking sensors as standard safety features. It features fabric upholstery, power windows for front doors, and a basic music system with Bluetooth connectivity.'
    },
    {
      variant: 'VXI',
      price: '₹6.89 Lakh',
      description: 'The Swift VXI variant adds more comfort and convenience features over the base LXI. It includes automatic climate control, all four power windows, and a more advanced infotainment system with smartphone connectivity. The VXI also gets body-colored door handles and ORVMs, making it more aesthetically appealing. Additional features include rear power windows, electrically adjustable ORVMs, and enhanced interior styling with premium fabric seats.'
    },
    {
      variant: 'ZXI',
      price: '₹7.59 Lakh',
      description: 'The Swift ZXI is the premium manual variant that offers the best features in the manual transmission lineup. It comes with a 7-inch SmartPlay Studio touchscreen infotainment system, 15-inch alloy wheels, and LED projector headlamps with LED DRLs. The ZXI variant also includes fog lamps, rear defogger, and premium interior styling. Safety features are enhanced with additional airbags and electronic stability program.'
    },
    {
      variant: 'ZXI+ AMT',
      price: '₹8.29 Lakh',
      description: 'The top-of-the-line Swift ZXI+ AMT variant combines all premium features with the convenience of automatic transmission. It features the AGS (Auto Gear Shift) technology that provides smooth gear transitions without compromising on fuel efficiency. This variant includes push-button start/stop, keyless entry, and all the premium features from the ZXI variant. The AMT technology makes city driving effortless while maintaining the Swift\'s sporty character.'
    }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {carData.fullName} - Model Price
      </h2>

      <div className="space-y-4">
        {variantDescriptions.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {carData.fullName} {item.variant} - {item.price}
                  </h3>
                </div>
                <button
                  onClick={() => toggleExpanded(index)}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <span className="text-sm font-medium">
                    {expandedItems[index] ? 'Read Less' : 'Read More'}
                  </span>
                  {expandedItems[index] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {expandedItems[index] 
                    ? item.description
                    : `${item.description.substring(0, 120)}...`
                  }
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
