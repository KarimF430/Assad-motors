'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Clock, Eye, MessageCircle, Calendar } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  views: string
  comments: string
  category: 'Review' | 'Featured' | 'News'
  image: string
}

interface ModelNewsSectionProps {
  carName: string
  newsArticles: NewsArticle[]
}

export default function ModelNewsSection({ carName, newsArticles }: ModelNewsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Review':
        return {
          badge: 'bg-blue-500 text-white',
          gradient: 'from-blue-400 to-blue-600'
        }
      case 'Featured':
        return {
          badge: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
          gradient: 'from-blue-400 via-purple-500 to-pink-500'
        }
      case 'News':
        return {
          badge: 'bg-green-500 text-white',
          gradient: 'from-blue-400 to-green-500'
        }
      default:
        return {
          badge: 'bg-gray-500 text-white',
          gradient: 'from-gray-400 to-gray-600'
        }
    }
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {carName} News
          </h2>
          <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center transition-colors">
            View All News
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* News Container */}
        <div className="relative group">
          {/* Navigation Arrows - Hover to reveal */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* News Articles Horizontal Scroll */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {newsArticles.map((article) => {
                const styles = getCategoryStyles(article.category)
                return (
                  <div key={article.id} className="flex-none w-72">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      {/* Article Image with Gradient */}
                      <div className={`relative h-40 bg-gradient-to-br ${styles.gradient} flex flex-col items-center justify-center p-4`}>
                        {/* Category Badge */}
                        <div className={`absolute top-3 left-3 ${styles.badge} px-3 py-1 rounded-full text-xs font-medium`}>
                          {article.category}
                        </div>

                        {/* Central News Label */}
                        <div className="bg-white/25 backdrop-blur-sm rounded-xl px-4 py-2 mb-3">
                          <div className="text-white text-sm font-bold">NEWS</div>
                        </div>

                        {/* Title in Center */}
                        <div className="text-center px-3">
                          <h3 className="text-white font-semibold text-sm leading-tight">
                            {article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title}
                          </h3>
                        </div>
                      </div>

                      {/* Article Content */}
                      <div className="p-4">
                        <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>

                        {/* Author and Date */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span className="font-medium">{article.author}</span>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{article.date}</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            <span>{article.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden -z-10" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
