'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Maximize2, X } from 'lucide-react'

interface CarImageGalleryProps {
  images: string[]
  carName: string
}

export default function CarImageGallery({ images, carName }: CarImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<'exterior' | 'interior' | '360'>('exterior')

  const exteriorImages = images.filter(img => img.includes('exterior'))
  const interiorImages = images.filter(img => img.includes('interior'))

  const getCurrentImages = () => {
    switch (activeTab) {
      case 'exterior':
        return exteriorImages
      case 'interior':
        return interiorImages
      case '360':
        return ['/cars/360-placeholder.jpg'] // Placeholder for 360 view
      default:
        return exteriorImages
    }
  }

  const currentImages = getCurrentImages()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length)
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 py-4">
          <button
            onClick={() => {
              setActiveTab('exterior')
              setCurrentImageIndex(0)
            }}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'exterior'
                ? 'text-primary-600 border-primary-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Exterior ({exteriorImages.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('interior')
              setCurrentImageIndex(0)
            }}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'interior'
                ? 'text-primary-600 border-primary-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Interior ({interiorImages.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('360')
              setCurrentImageIndex(0)
            }}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors flex items-center space-x-1 ${
              activeTab === '360'
                ? 'text-primary-600 border-primary-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span>360° View</span>
          </button>
        </nav>
      </div>

      {/* Main Image Display */}
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {/* Placeholder for car image */}
          <div className="text-center">
            <div className="w-32 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {carName.split(' ')[0].charAt(0)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {activeTab === '360' ? '360° View' : `${activeTab} View`} - Image {currentImageIndex + 1} of {currentImages.length}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        {currentImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={openFullscreen}
          className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
        >
          <Maximize2 className="h-5 w-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {currentImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          {currentImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-12 bg-gray-200 rounded border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-primary-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="relative max-w-6xl max-h-full">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="w-48 h-32 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {carName.split(' ')[0].charAt(0)}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    {activeTab === '360' ? '360° View' : `${activeTab} View`} - Image {currentImageIndex + 1} of {currentImages.length}
                  </p>
                </div>
              </div>

              {/* Fullscreen Navigation */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
