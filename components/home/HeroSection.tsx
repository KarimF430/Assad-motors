'use client'

import { useState } from 'react'
import { Search, Mic, CarFront, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearchClick = () => {
    router.push('/search')
  }

  const handleVoiceClick = () => {
    router.push('/search')
  }

  return (
    <section className="bg-[#f2f4f8] py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle background decorative element */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#291e6a]/5 to-transparent"></div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Hero Title */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#291e6a] mb-4 tracking-tight">
            Find Your Dream Used Car
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Search from our extensive inventory of premium, inspected second-hand cars.
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onClick={handleSearchClick}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand, model, or body type..."
                className="w-full px-4 py-3 sm:px-6 sm:py-4 text-gray-900 placeholder-gray-500 text-sm sm:text-base lg:text-lg bg-gray-100 rounded-xl sm:rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-[#291e6a] pr-14 sm:pr-20 cursor-pointer"
                aria-label="Search for cars"
                readOnly
              />
              <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={handleVoiceClick}
                  className="p-2 sm:p-2.5 text-gray-400 hover:text-[#291e6a] hover:bg-gray-200 rounded-lg transition-all duration-200"
                  aria-label="Voice search"
                >
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className="w-full bg-[#291e6a] hover:bg-[#1c144a] text-white font-bold py-3.5 px-6 sm:py-4 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg hover:shadow-lg mb-4"
            >
              <Search className="h-6 w-6" />
              <span>Search Cars</span>
            </button>

            {/* Sell Your Car CTA - Integrated into Card */}
            <Link
              href="/sell-your-car"
              className="w-full flex items-center justify-center gap-3 bg-white py-3.5 rounded-2xl border-2 border-[#291e6a] hover:bg-gray-50 transition-all duration-300 group"
            >
              <CarFront className="w-6 h-6 text-[#291e6a]" />
              <span className="text-xl font-black text-[#1c144a] tracking-tight">
                Want to Sell Your Car?
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
