'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Calendar, Clock, Eye, MessageCircle, ArrowRight } from 'lucide-react'
import { OptimizedImage } from '@/components/common/OptimizedImage'

interface ContentBlock {
  id: string
  type: string
  content: string
  imageUrl?: string
  imageCaption?: string
}

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  categoryId: string
  authorId: string
  publishDate: string
  views: number
  likes: number
  contentBlocks: ContentBlock[]
  slug: string
  isFeatured: boolean
  status: string
  featuredImage?: string
}

export default function LatestCarNews({ initialNews = [] }: { initialNews?: NewsArticle[] }) {
  // Use prop data directly
  const newsArticles = initialNews

  // Get first image from featuredImage or contentBlocks
  const getFirstImage = (article: NewsArticle) => {
    // First, try featuredImage
    if (article.featuredImage && article.featuredImage.trim() !== '') {
      return article.featuredImage
    }

    // Fallback to contentBlocks
    const imageBlock = article.contentBlocks.find(block => block.type === 'image' && block.imageUrl)
    if (!imageBlock?.imageUrl) return ''

    return imageBlock.imageUrl
  }

  // Calculate reading time from content blocks
  const calculateReadTime = (blocks: ContentBlock[]) => {
    const wordCount = blocks.reduce((count, block) => {
      return count + (block.content?.split(' ').length || 0)
    }, 0)
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  if (newsArticles.length === 0) {
    return <div className="py-12 text-center text-gray-500">No news articles available</div>
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'review':
        return 'bg-blue-100 text-blue-800'
      case 'news':
        return 'bg-green-100 text-green-800'
      case 'comparison':
        return 'bg-purple-100 text-purple-800'
      case 'guide':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('latest-news-scroll')
    if (container) {
      const scrollAmount = 350
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Latest Car News</h2>
        <Link
          href="/news"
          className="flex items-center text-red-600 hover:text-orange-600 font-medium text-sm sm:text-base"
        >
          <span className="hidden sm:inline">View All News</span>
          <span className="sm:hidden">View All</span>
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </Link>
      </div>

      {/* News Articles Horizontal Scroll */}
      <div className="relative group">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scrollContainer('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Scroll Arrow */}
        <button
          onClick={() => scrollContainer('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          id="latest-news-scroll"
          className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newsArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="flex-shrink-0 w-[260px] sm:w-64 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Article Image - First image from featuredImage or contentBlocks or gradient */}
              <div className="h-32 sm:h-40 relative overflow-hidden">
                {getFirstImage(article) ? (
                  <OptimizedImage
                    src={getFirstImage(article)}
                    alt={article.title}
                    fill
                    className="object-cover bg-gray-100"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                    <div className="text-center text-white px-3">
                      <div className="w-12 h-8 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xs font-medium">NEWS</span>
                      </div>
                      <h3 className="text-sm font-bold leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    News
                  </span>
                </div>

                {/* Featured Badge */}
                {article.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Article Info */}
              <div className="p-2.5 sm:p-3">
                <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base leading-tight line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>

                {/* Author and Date */}
                <div className="flex items-center text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                  <span className="font-medium truncate max-w-[80px]">Haji Karim</span>
                  <span className="mx-1 sm:mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
                  <span className="whitespace-nowrap">{new Date(article.publishDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}</span>
                </div>

                {/* Article Stats */}
                <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
                    <span className="whitespace-nowrap">{calculateReadTime(article.contentBlocks)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
                    <span>{article.likes}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none sm:hidden -z-10" />
      </div>
    </div>
  )
}
