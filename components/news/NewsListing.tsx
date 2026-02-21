'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, Calendar, Clock, Eye, MessageCircle } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  slug: string
  authorId: string
  publishDate: string
  views: number
  comments: number
  featuredImage: string
  categoryId: string
  isFeatured: boolean
  isBreaking: boolean
  contentBlocks: any[]
}

export default function NewsListing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'news-reviews' | 'images-videos'>('news-reviews')
  const [selectedFilter, setSelectedFilter] = useState<'news' | 'reviews' | 'special-reports'>('news')
  const [currentPage, setCurrentPage] = useState(1)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 8

  // Fetch articles from API
  useEffect(() => {
    async function fetchArticles() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const res = await fetch(`${apiUrl}/api/news?limit=50`)
        if (res.ok) {
          const data = await res.json()
          setArticles(data.articles || [])
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Calculate reading time from content blocks
  const calculateReadTime = (blocks: any[]) => {
    const wordCount = blocks.reduce((count, block) => {
      return count + (block.content?.split(' ').length || 0)
    }, 0)
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  // Get first image from featuredImage or content blocks
  const getFirstImage = (article: NewsArticle) => {
    // First, try featuredImage
    if (article.featuredImage && article.featuredImage.trim() !== '') {
      return article.featuredImage
    }

    // Fallback to contentBlocks
    if (!article.contentBlocks || !Array.isArray(article.contentBlocks)) {
      return null
    }

    const imageBlock = article.contentBlocks.find(block => block.type === 'image' && block.imageUrl)
    if (!imageBlock?.imageUrl) return null

    if (imageBlock.imageUrl.startsWith('/uploads')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      return `${apiUrl}${imageBlock.imageUrl}`
    }
    return imageBlock.imageUrl
  }

  // Mock news articles removed - using real data from backend only
  const allArticles = articles

  // Filter articles
  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase())
    // For now, show all articles regardless of filter since we don't have categories yet
    return matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Latest Car News in India {new Date().getFullYear()}</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type to select car name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('news-reviews')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'news-reviews'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                News & Reviews
              </button>
              <button
                onClick={() => setActiveTab('images-videos')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'images-videos'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Images & Videos
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        {activeTab === 'news-reviews' && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedFilter('news')
                  setCurrentPage(1)
                }}
                className={`px-5 py-2 rounded-full border font-medium text-sm transition-colors ${selectedFilter === 'news'
                  ? 'border-red-600 bg-red-50 text-red-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
              >
                News
              </button>
              <button
                onClick={() => {
                  setSelectedFilter('reviews')
                  setCurrentPage(1)
                }}
                className={`px-5 py-2 rounded-full border font-medium text-sm transition-colors ${selectedFilter === 'reviews'
                  ? 'border-red-600 bg-red-50 text-red-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
              >
                Reviews
              </button>
              <button
                onClick={() => {
                  setSelectedFilter('special-reports')
                  setCurrentPage(1)
                }}
                className={`px-5 py-2 rounded-full border font-medium text-sm transition-colors ${selectedFilter === 'special-reports'
                  ? 'border-red-600 bg-red-50 text-red-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
              >
                Special Reports
              </button>
            </div>
          </div>
        )}

        {/* News Grid */}
        {activeTab === 'news-reviews' && (
          <>
            {currentArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {currentArticles.map((article, index) => (
                  <div key={`${article.id}-${index}`}>
                    {/* News Card */}
                    <Link
                      href={`/news/${article.slug || article.id}`}
                      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Gradient Header with Badges or Image */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-6">
                        {/* Show image if available */}
                        {getFirstImage(article) ? (
                          <img
                            src={getFirstImage(article)!}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : null}

                        {/* Overlay gradient for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2 z-10">
                          {article.isFeatured && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#291e6a]">
                              Featured
                            </span>
                          )}
                          {article.isBreaking && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-600">
                              Breaking
                            </span>
                          )}
                          {!article.isFeatured && !article.isBreaking && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-blue-500">
                              News
                            </span>
                          )}
                        </div>

                        {/* NEWS Label */}
                        {!getFirstImage(article) && (
                          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg z-10">
                            <span className="text-white font-bold text-lg">NEWS</span>
                          </div>
                        )}

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                          <h3 className="text-white font-bold text-lg line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-gray-900 font-bold text-lg mb-3 line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {article.excerpt || 'Read more...'}
                        </p>

                        {/* Author & Date */}
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="font-medium">Haji Karim</span>
                          <span className="mx-2">•</span>
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{new Date(article.publishDate || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{calculateReadTime(article.contentBlocks || [])} min read</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            <span>{(article.views || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-3.5 w-3.5 mr-1" />
                            <span>{article.comments || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* AD Banner after every 2 articles */}
                    {(index + 1) % 2 === 0 && index < currentArticles.length - 1 && (
                      <div className="bg-gray-200 rounded-lg py-16 mt-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-500">AD Banner</h2>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Back</span>
                </button>

                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => goToPage(page as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Images & Videos Tab */}
        {activeTab === 'images-videos' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Images & Videos coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
