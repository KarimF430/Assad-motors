'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, Gauge, Fuel, Settings } from 'lucide-react'

interface CarData {
  fullName: string
  brand: string
  model: string
}

interface EngineHighlightsSEOProps {
  carData: CarData
}

export default function EngineHighlightsSEO({ carData }: EngineHighlightsSEOProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const engineData = {
    overview: `The ${carData.fullName} is powered by a state-of-the-art 1.2-liter K-Series petrol engine that exemplifies modern automotive engineering. This refined powerplant delivers an impressive combination of performance, fuel efficiency, and reliability, making it ideal for Indian driving conditions.`,
    
    detailedSpecs: {
      displacement: '1197 cc',
      maxPower: '82 bhp @ 6000 rpm',
      maxTorque: '113 Nm @ 4200 rpm',
      fuelSystem: 'Multi-Point Fuel Injection',
      valveConfiguration: 'DOHC, 16 Valve',
      compressionRatio: '11.0:1',
      fuelType: 'Petrol',
      emissionNorm: 'BS6 Phase 2',
      turbocharger: 'No'
    },
    
    performanceHighlights: [
      {
        title: 'Fuel Efficiency',
        value: '23.26 kmpl',
        description: 'ARAI certified mileage for manual transmission',
        icon: Fuel,
        color: 'green'
      },
      {
        title: 'Power Output',
        value: '82 bhp',
        description: 'Maximum power at 6000 rpm',
        icon: Zap,
        color: 'blue'
      },
      {
        title: 'Torque',
        value: '113 Nm',
        description: 'Peak torque at 4200 rpm',
        icon: Gauge,
        color: 'orange'
      },
      {
        title: 'Technology',
        value: 'K-Series',
        description: 'Advanced engine technology',
        icon: Settings,
        color: 'purple'
      }
    ],
    
    technicalAnalysis: `**Engine Technology**
The K-Series engine in the ${carData.fullName} incorporates advanced technologies including Variable Valve Timing (VVT), which optimizes valve timing for better performance and fuel efficiency across different RPM ranges. The DOHC (Double Overhead Camshaft) configuration with 16 valves ensures optimal air-fuel mixture and exhaust gas flow.

**Fuel Injection System**
The Multi-Point Fuel Injection (MPFI) system precisely controls fuel delivery to each cylinder, resulting in better combustion efficiency, reduced emissions, and improved throttle response. This system adapts to various driving conditions automatically.

**Performance Characteristics**
The engine delivers linear power delivery with good low-end torque, making it suitable for city driving and highway cruising. The power band is well-suited for Indian traffic conditions, providing adequate acceleration when needed while maintaining excellent fuel economy.

**Reliability and Maintenance**
Built with proven Japanese engineering principles, the K-Series engine is known for its durability and low maintenance requirements. The engine features a timing chain instead of a belt, reducing maintenance intervals and costs.`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <Zap className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {carData.fullName} - Engine & Performance
          </h2>
          <p className="text-gray-600">
            Detailed engine specifications and performance analysis
          </p>
        </div>
      </div>

      {/* Engine Overview */}
      <div className="prose prose-gray max-w-none mb-6">
        <p className="text-gray-700 leading-relaxed text-lg">
          {engineData.overview}
        </p>
      </div>

      {/* Performance Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {engineData.performanceHighlights.map((highlight, index) => {
          const IconComponent = highlight.icon
          const colorClasses = {
            green: 'bg-green-50 border-green-200 text-green-600',
            blue: 'bg-blue-50 border-blue-200 text-blue-600',
            orange: 'bg-orange-50 border-orange-200 text-orange-600',
            purple: 'bg-purple-50 border-purple-200 text-purple-600'
          }
          
          return (
            <div key={index} className={`rounded-lg p-4 border ${colorClasses[highlight.color as keyof typeof colorClasses]}`}>
              <div className="flex items-center space-x-3 mb-2">
                <IconComponent className="h-5 w-5" />
                <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
              </div>
              <p className="text-2xl font-bold mb-1">{highlight.value}</p>
              <p className="text-sm opacity-80">{highlight.description}</p>
            </div>
          )
        })}
      </div>

      {/* Engine Specifications Table */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(engineData.detailedSpecs).map(([key, value], index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
              <span className="text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Technical Analysis */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-50 p-3 rounded-lg transition-colors"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Technical Analysis & Engineering Details
            </h3>
            <p className="text-sm text-gray-600">
              In-depth technical information about engine technology and performance
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
          )}
        </button>

        {isExpanded && (
          <div className="prose prose-gray max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {engineData.technicalAnalysis.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  const headerText = paragraph.replace(/\*\*/g, '')
                  return (
                    <h4 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                      {headerText}
                    </h4>
                  )
                } else {
                  return (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  )
                }
              })}
            </div>
          </div>
        )}
      </div>

      {/* Engine Comparison */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engine Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-900">Parameter</th>
                <th className="text-center py-2 px-3 font-semibold text-gray-900">{carData.model}</th>
                <th className="text-center py-2 px-3 font-semibold text-gray-600">Segment Average</th>
                <th className="text-center py-2 px-3 font-semibold text-gray-600">Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3 text-gray-700">Power (bhp)</td>
                <td className="py-2 px-3 text-center font-semibold text-blue-600">82</td>
                <td className="py-2 px-3 text-center text-gray-600">78</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Above Average</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3 text-gray-700">Torque (Nm)</td>
                <td className="py-2 px-3 text-center font-semibold text-blue-600">113</td>
                <td className="py-2 px-3 text-center text-gray-600">110</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Good</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3 text-gray-700">Mileage (kmpl)</td>
                <td className="py-2 px-3 text-center font-semibold text-blue-600">23.26</td>
                <td className="py-2 px-3 text-center text-gray-600">21.5</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Excellent</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
