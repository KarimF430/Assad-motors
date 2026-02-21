'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface ProConItem {
  id: string
  text: string
  isVisible: boolean
}

interface ProsAndConsData {
  pros: ProConItem[]
  cons: ProConItem[]
}

interface ProsAndConsProps {
  carName: string
  data: ProsAndConsData
}

export default function ProsAndCons({ carName, data }: ProsAndConsProps) {
  const [showAllPros, setShowAllPros] = useState(false)
  const [showAllCons, setShowAllCons] = useState(false)

  const visiblePros = showAllPros ? data.pros : data.pros.filter(pro => pro.isVisible)
  const visibleCons = showAllCons ? data.cons : data.cons.filter(con => con.isVisible)
  
  const hasMorePros = data.pros.length > data.pros.filter(pro => pro.isVisible).length
  const hasMoreCons = data.cons.length > data.cons.filter(con => con.isVisible).length

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          {carName} Pros & Cons
        </h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pros Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center mb-5">
              <div className="flex items-center justify-center w-8 h-8 mr-3">
                <ThumbsUp className="w-6 h-6 text-teal-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Pros</h3>
            </div>
            
            <ul className="space-y-3">
              {visiblePros.map((pro) => (
                <li key={pro.id} className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm leading-relaxed font-normal">{pro.text}</p>
                </li>
              ))}
            </ul>
            
            {hasMorePros && !showAllPros && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowAllPros(true)}
                  className="text-gray-600 hover:text-gray-800 font-normal text-sm transition-colors"
                >
                  ...more
                </button>
              </div>
            )}
          </div>

          {/* Cons Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center mb-5">
              <div className="flex items-center justify-center w-8 h-8 mr-3">
                <ThumbsDown className="w-6 h-6 text-orange-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Cons</h3>
            </div>
            
            <ul className="space-y-3">
              {visibleCons.map((con) => (
                <li key={con.id} className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm leading-relaxed font-normal">{con.text}</p>
                </li>
              ))}
            </ul>
            
            {hasMoreCons && !showAllCons && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowAllCons(true)}
                  className="text-gray-600 hover:text-gray-800 font-normal text-sm transition-colors"
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
