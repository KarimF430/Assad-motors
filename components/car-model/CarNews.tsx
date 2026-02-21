'use client'

import { useState } from 'react'
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface CarNewsProps {
  carData: {
    fullName: string
    brand: string
  }
}

export default function CarNews({ carData }: CarNewsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const news = [
    {
      id: 1,
      title: `${carData.fullName} Gets New Safety Features in Latest Update`,
      excerpt: 'The latest update brings advanced safety features including 6 airbags, ESP, and hill hold assist as standard across all variants.',
      image: '/api/placeholder/300/200',
      date: '2024-01-15',
      readTime: '3 min read',
      category: 'Updates',
      trending: true
    },
    {
      id: 2,
      title: `${carData.brand} Announces Price Revision for ${carData.fullName}`,
      excerpt: 'Starting next month, the company will implement a price increase of ₹15,000 to ₹25,000 across all variants due to rising input costs.',
      image: '/api/placeholder/300/200',
      date: '2024-01-12',
      readTime: '2 min read',
      category: 'Pricing',
      trending: false
    },
    {
      id: 3,
      title: `${carData.fullName} Wins Car of the Year Award 2024`,
      excerpt: 'Recognized for its outstanding design, performance, and value proposition in the compact SUV segment.',
      image: '/api/placeholder/300/200',
      date: '2024-01-10',
      readTime: '4 min read',
      category: 'Awards',
      trending: true
    },
    {
      id: 4,
      title: `New Color Options Available for ${carData.fullName}`,
      excerpt: 'Two new premium color options - Midnight Blue and Pearl White - are now available across all variants.',
      image: '/api/placeholder/300/200',
      date: '2024-01-08',
      readTime: '2 min read',
      category: 'Updates',
      trending: false
    },
    {
      id: 5,
      title: `${carData.fullName} Service Campaign: Free Check-up`,
      excerpt: 'Owners can avail free 25-point vehicle check-up at authorized service centers until end of January.',
      image: '/api/placeholder/300/200',
      date: '2024-01-05',
      readTime: '3 min read',
      category: 'Service',
      trending: false
    }
  ]

  const categories = ['all', 'Updates', 'Pricing', 'Awards', 'Service', 'Reviews']

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {carData.fullName} Latest News
        </h2>
        <Link 
          href="/news"
          className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
        >
          View All News
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All News' : category}
          </button>
        ))}
      </div>

      {/* Featured News */}
      {filteredNews.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <img
                src={filteredNews[0].image}
                alt={filteredNews[0].title}
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
              {filteredNews[0].trending && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-3">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {filteredNews[0].category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 line-clamp-2">
                {filteredNews[0].title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {filteredNews[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(filteredNews[0].date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {filteredNews[0].readTime}
                </div>
              </div>
              <Link
                href={`/news/${filteredNews[0].id}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2 w-fit"
              >
                Read Full Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.slice(1).map((article) => (
          <Link key={article.id} href={`/news/${article.id}`} className="group">
            <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.trending && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {article.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">Stay Updated with Car News</h3>
          <p className="text-gray-600 mb-4">
            Get the latest updates about {carData.fullName} and other cars delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
