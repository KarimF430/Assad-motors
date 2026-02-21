'use client'

import { useState, useRef } from 'react'
import { Play, ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react'

interface CarVideosProps {
  carData: {
    fullName: string
    brand: string
  }
}

export default function CarVideos({ carData }: CarVideosProps) {
  const [activeVideo, setActiveVideo] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const videos = [
    {
      id: 1,
      title: `${carData.fullName} - First Drive Review`,
      thumbnail: '/api/placeholder/320/180',
      duration: '12:45',
      views: '2.3M',
      channel: 'CarWale',
      type: 'Review'
    },
    {
      id: 2,
      title: `${carData.fullName} - Interior & Exterior Tour`,
      thumbnail: '/api/placeholder/320/180',
      duration: '8:30',
      views: '1.8M',
      channel: 'AutoCar India',
      type: 'Tour'
    },
    {
      id: 3,
      title: `${carData.fullName} vs Competitors - Comparison`,
      thumbnail: '/api/placeholder/320/180',
      duration: '15:20',
      views: '950K',
      channel: 'gadizone',
      type: 'Comparison'
    },
    {
      id: 4,
      title: `${carData.fullName} - Road Test & Performance`,
      thumbnail: '/api/placeholder/320/180',
      duration: '10:15',
      views: '1.2M',
      channel: 'CarDekho',
      type: 'Test Drive'
    },
    {
      id: 5,
      title: `${carData.fullName} - Ownership Experience`,
      thumbnail: '/api/placeholder/320/180',
      duration: '7:45',
      views: '680K',
      channel: 'Car Blog India',
      type: 'Experience'
    }
  ]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {carData.fullName} Videos
        </h2>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Featured Video */}
      <div className="mb-6">
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <img
            src={videos[activeVideo].thumbnail}
            alt={videos[activeVideo].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <button className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors">
              <Play className="h-8 w-8 text-white ml-1" />
            </button>
          </div>
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            {videos[activeVideo].duration}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">{videos[activeVideo].title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{videos[activeVideo].channel}</span>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{videos[activeVideo].views} views</span>
            </div>
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
              {videos[activeVideo].type}
            </span>
          </div>
        </div>
      </div>

      {/* Video Thumbnails */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(index)}
              className={`flex-shrink-0 cursor-pointer transition-all ${
                index === activeVideo ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <div className="w-40 sm:w-48 bg-gray-100 rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="text-sm font-medium line-clamp-2 mb-1">
                    {video.title}
                  </h4>
                  <div className="text-xs text-gray-600">
                    <div>{video.channel}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Eye className="h-3 w-3" />
                      <span>{video.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Categories */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold mb-4">Browse by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Reviews', 'Comparisons', 'Test Drives', 'Walkarounds'].map((category) => (
            <button
              key={category}
              className="p-3 border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 text-center transition-colors"
            >
              <div className="font-medium text-sm">{category}</div>
              <div className="text-xs text-gray-600 mt-1">
                {Math.floor(Math.random() * 20) + 5} videos
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Subscribe CTA */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 text-center">
        <h3 className="font-semibold mb-2">Stay Updated with Latest Videos</h3>
        <p className="text-gray-600 mb-4">Get notified when new {carData.brand} videos are uploaded</p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
          Subscribe to Updates
        </button>
      </div>
    </div>
  )
}
