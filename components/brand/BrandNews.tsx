import Link from 'next/link'
import { Calendar, Clock, Eye, MessageCircle, ArrowRight } from 'lucide-react'

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
  tags: string[]
}

interface BrandNewsProps {
  brandSlug: string
  brandName: string
}

async function getBrandNews(brandName: string): Promise<NewsArticle[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
    const fullUrl = `${apiUrl}/api/news?tag=${encodeURIComponent(brandName)}&limit=10`

    const res = await fetch(fullUrl, { next: { revalidate: 3600 } }) // Cache for 1 hour

    if (res.ok) {
      const data = await res.json()
      return data.articles || []
    }
    return []
  } catch (error) {
    console.error('❌ Error fetching brand news:', error)
    return []
  }
}

export default async function BrandNews({ brandSlug, brandName }: BrandNewsProps) {
  const articles = await getBrandNews(brandName)

  // Get first image from featuredImage or contentBlocks
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

  // Calculate reading time from content blocks
  const calculateReadTime = (blocks: ContentBlock[]) => {
    const wordCount = blocks.reduce((count, block) => {
      return count + (block.content?.split(' ').length || 0)
    }, 0)
    const minutes = Math.ceil(wordCount / 200)
    return `${minutes} min read`
  }

  if (articles.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{brandName} News</h2>
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
      <div className="relative">
        <div
          id="brand-news-scroll"
          className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="flex-shrink-0 w-[260px] sm:w-64 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Article Image - First image from featuredImage or contentBlocks or gradient */}
              <div className="h-32 sm:h-40 relative overflow-hidden">
                {getFirstImage(article) ? (
                  <img
                    src={getFirstImage(article)!}
                    alt={article.title}
                    className="w-full h-full object-cover bg-gray-100"
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
