'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface ProsCon {
  id: string
  text: string
  isVisible: boolean
}

interface ProsConsData {
  pros: ProsCon[]
  cons: ProsCon[]
}

interface ProsConsSectionProps {
  carName: string
  data: ProsConsData
}

export default function ProsConsSection({ carName, data }: ProsConsSectionProps) {
  const [showAllPros, setShowAllPros] = useState(false)
  const [showAllCons, setShowAllCons] = useState(false)

  const visiblePros = showAllPros ? data.pros : data.pros.filter(pro => pro.isVisible)
  const visibleCons = showAllCons ? data.cons : data.cons.filter(con => con.isVisible)

  const hasMorePros = data.pros.length > data.pros.filter(pro => pro.isVisible).length
  const hasMoreCons = data.cons.length > data.cons.filter(con => con.isVisible).length

  return (
    <section className="py-6 sm:py-8 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title - matching screenshot exactly */}
        <h2 className="text-4xl font-bold text-gray-700 mb-12">
          {carName} Pros & Cons
        </h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pros Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-8">
              <div className="flex items-center justify-center w-10 h-10 mr-4">
                <ThumbsUp className="w-8 h-8 text-teal-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Pros</h3>
            </div>

            <ul className="space-y-6">
              {visiblePros.map((pro) => (
                <li key={pro.id} className="flex items-start">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base leading-relaxed font-normal">{pro.text}</p>
                </li>
              ))}
            </ul>

            {hasMorePros && !showAllPros && (
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setShowAllPros(true)}
                  className="text-gray-600 hover:text-gray-800 font-normal text-base transition-colors"
                >
                  ...more
                </button>
              </div>
            )}
          </div>

          {/* Cons Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-8">
              <div className="flex items-center justify-center w-10 h-10 mr-4">
                <ThumbsDown className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Cons</h3>
            </div>

            <ul className="space-y-6">
              {visibleCons.map((con) => (
                <li key={con.id} className="flex items-start">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base leading-relaxed font-normal">{con.text}</p>
                </li>
              ))}
            </ul>

            {hasMoreCons && !showAllCons && (
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setShowAllCons(true)}
                  className="text-gray-600 hover:text-gray-800 font-normal text-base transition-colors"
                >
                  ...more
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
