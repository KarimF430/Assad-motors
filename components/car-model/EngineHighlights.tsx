'use client'

import { useState } from 'react'

interface EngineSpec {
  id: number
  name: string
  displacement: string
  power: string
  torque: string
  transmission: string
  fuelType: string
  description: string
  specifications: {
    manual?: {
      power: string
      torque: string
      transmission: string
    }
    automatic?: {
      power: string
      torque: string
      transmission: string
    }
    imt?: {
      power: string
      torque: string
      transmission: string
    }
  }
}

interface EngineHighlightsProps {
  carName: string
  engines: EngineSpec[]
}

export default function EngineHighlights({ carName, engines }: EngineHighlightsProps) {
  const [expandedEngines, setExpandedEngines] = useState<number[]>([])

  const toggleEngine = (engineId: number) => {
    setExpandedEngines(prev =>
      prev.includes(engineId)
        ? prev.filter(id => id !== engineId)
        : [...prev, engineId]
    )
  }

  return (
    <section className="py-6 sm:py-8 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-700 mb-12">
          {carName} Engine
        </h2>

        {/* Engine Cards */}
        <div className="space-y-6">
          {engines.map((engine, index) => (
            <div key={engine.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
              {/* Engine Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <span className="bg-red-500 text-white text-lg font-bold px-3 py-1 rounded mr-4">
                    {index + 1}.
                  </span>
                  {engine.name}
                </h3>
                <p className="text-gray-600 text-base font-normal ml-12">
                  {engine.description}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="ml-12 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {engine.specifications.manual && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 text-center mb-3">Manual</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Power:</span>
                          <span className="font-medium">{engine.specifications.manual.power}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Torque:</span>
                          <span className="font-medium">{engine.specifications.manual.torque}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmission:</span>
                          <span className="font-medium">{engine.specifications.manual.transmission}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {engine.specifications.automatic && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 text-center mb-3">Automatic</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Power:</span>
                          <span className="font-medium">{engine.specifications.automatic.power}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Torque:</span>
                          <span className="font-medium">{engine.specifications.automatic.torque}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmission:</span>
                          <span className="font-medium">{engine.specifications.automatic.transmission}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {engine.specifications.imt && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 text-center mb-3">iMT</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Power:</span>
                          <span className="font-medium">{engine.specifications.imt.power}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Torque:</span>
                          <span className="font-medium">{engine.specifications.imt.torque}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmission:</span>
                          <span className="font-medium">{engine.specifications.imt.transmission}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Read More Button */}
              <div className="flex justify-end ml-12">
                <button
                  onClick={() => toggleEngine(engine.id)}
                  className="text-red-500 hover:text-red-600 font-normal text-base transition-colors"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
