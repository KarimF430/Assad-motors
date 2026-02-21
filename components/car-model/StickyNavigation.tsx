'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarData {
  brand: string
  model: string
  fullName: string
}

interface StickyNavigationProps {
  activeSection: string
  carData: CarData
}

export default function StickyNavigation({ activeSection, carData }: StickyNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: 'hero', label: 'Overview' },
    { id: 'pricing', label: 'Price' },
    { id: 'specifications', label: 'Specs' },
    { id: 'variants', label: 'Variants' },
    { id: 'highlights', label: 'Features' },
    { id: 'colors', label: 'Colors' },
    { id: 'pros-cons', label: 'Pros & Cons' },
    { id: 'summary', label: 'Summary' },
    { id: 'engine', label: 'Engine' },
    { id: 'mileage', label: 'Mileage' },
    { id: 'similar-cars', label: 'Similar Cars' },
    { id: 'compare', label: 'Compare' },
    { id: 'news', label: 'News' },
    { id: 'videos', label: 'Videos' },
    { id: 'faq', label: 'FAQ' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'new-launches', label: 'New Cars' },
    { id: 'consultation', label: 'Consult' }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollContainer = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Car Name - Hidden on mobile to save space */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {carData.fullName}
            </h3>
          </div>

          {/* Navigation Sections */}
          <div className="flex items-center flex-1 md:flex-initial">
            {/* Left Scroll Button - Hidden on mobile */}
            <button
              onClick={() => scrollContainer('left')}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mr-3 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>

            {/* Scrollable Navigation */}
            <div
              ref={scrollContainerRef}
              className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide flex-1 md:flex-initial"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Right Scroll Button - Hidden on mobile */}
            <button
              onClick={() => scrollContainer('right')}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ml-3 flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Quick Action Button */}
          <div className="hidden lg:block ml-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Price
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
