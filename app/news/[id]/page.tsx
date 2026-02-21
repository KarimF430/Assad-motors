import Link from 'next/link'
import { Eye, User } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import FeedbackSection from '@/components/car-model/FeedbackSection'
import LatestCarNews from '@/components/home/LatestCarNews'
import ArticleRenderer from '@/components/news/ArticleRenderer'

interface PageProps {
  params: Promise<{ id: string }>
}

// Enable ISR with 2-hour revalidation for news articles
export const revalidate = 7200

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const res = await fetch(`${backendUrl}/api/news/${id}`, {
      next: { revalidate: 7200 }
    })

    if (!res.ok) {
      return {
        title: 'Article Not Found | gadizone',
        description: 'The requested article could not be found.'
      }
    }

    const article = await res.json()

    return {
      title: `${article.title} | gadizone News`,
      description: article.excerpt || article.title,
      keywords: article.tags?.join(', ') || 'car news, automotive news, latest cars',
      openGraph: {
        title: article.title,
        description: article.excerpt || article.title,
        type: 'article',
        publishedTime: article.publishDate,
        authors: [article.authorId || 'gadizone'],
        images: article.featuredImage ? [{
          url: article.featuredImage.startsWith('http')
            ? article.featuredImage
            : `${backendUrl}${article.featuredImage}`
        }] : []
      },
      alternates: {
        canonical: `/news/${id}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Car News | gadizone',
      description: 'Latest automotive news and updates'
    }
  }
}

// Server-side data fetching
async function getArticle(id: string) {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

  try {
    const res = await fetch(`${backendUrl}/api/news/${id}`, {
      next: { revalidate: 7200 }
    })

    if (!res.ok) {
      return null
    }

    const article = await res.json()

    // Fetch details for linked cars to get their brand and slugs
    let linkedCarsData: any[] = []
    if (article.linkedCars && article.linkedCars.length > 0) {
      try {
        const carsPromises = article.linkedCars.map(async (carId: string) => {
          const carRes = await fetch(`${backendUrl}/api/models/${carId}`, { next: { revalidate: 3600 } })
          if (carRes.ok) {
            const car = await carRes.json()
            // Get brand name for slug generation
            const brandRes = await fetch(`${backendUrl}/api/brands`, { next: { revalidate: 3600 } })
            const brands = await brandRes.json()
            const brand = brands.find((b: any) => b.id === car.brandId)

            const brandSlug = brand ? brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'unknown'
            const modelSlug = car.slug || car.name.toLowerCase().replace(/\s+/g, '-')

            return {
              id: car.id,
              name: car.name,
              brandName: brand?.name || 'Unknown',
              brandSlug,
              modelSlug,
              href: `/${brandSlug}-cars/${modelSlug}`
            }
          }
          return { id: carId, name: carId, href: `/models/${carId}` } // Fallback
        })
        linkedCarsData = await Promise.all(carsPromises)
      } catch (err) {
        console.error('Error fetching linked cars data:', err)
      }
    }

    // Format for display
    return {
      id: article.id,
      title: article.title,
      views: article.views || 199,
      author: {
        name: article.authorId || 'Admin',
        image: '/api/placeholder/50/50',
        date: new Date(article.publishDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      },
      featuredImage: article.featuredImage?.startsWith('/uploads')
        ? `${backendUrl}${article.featuredImage}`
        : article.featuredImage || '/api/placeholder/800/500',
      keyPoints: article.keyPoints || [
        'The Curvv comes with impressive features and specifications.',
        'It competes strongly in its segment.',
        'Available in multiple variants and color options.'
      ],
      contentBlocks: article.contentBlocks || [],
      linkedCars: linkedCarsData
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <article>
              {/* Header Section */}
              <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1.5" />
                    <span>{article.views} Views</span>
                  </div>
                </div>

                <div className="flex items-center border-b border-gray-100 pb-6">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                    {/* Placeholder Avatar if no image */}
                    <User className="w-full h-full p-2 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900 text-sm mr-2">{article.author.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{article.author.date}</p>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {article.featuredImage && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Key Highlights Section */}
              <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Key Highlights</h2>
                <ul className="space-y-3">
                  {article.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none text-gray-800">
                <ArticleRenderer blocks={article.contentBlocks} linkedCars={article.linkedCars} />
              </div>
            </article>

            {/* Related Cars Section */}
            {article.linkedCars && article.linkedCars.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold mb-6">Cars Mentioned in this Article</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {article.linkedCars.map((car: any) => (
                    <Link
                      key={car.id}
                      href={car.href}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🚗</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {car.brandName} {car.name}
                        </p>
                        <p className="text-sm text-gray-500">View Full Specs</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Section */}
            <div className="mt-12">
              <FeedbackSection />
            </div>

            {/* Continue Reading Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Continue Reading</h3>
              <Link
                href="/news/2"
                className="block group"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {/* Placeholder for next article image */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      Maruti Suzuki Grand Vitara Hybrid Review: Best Fuel Economy in Segment
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <span>15 Mar</span>
                      <span className="mx-2">•</span>
                      <span>Rajesh Kumar</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Ad Banner */}
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400 font-medium text-sm border border-gray-200">
              ADVERTISEMENT
            </div>

            {/* Trending / Latest News Sidebar Widget */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-lg text-gray-900">Trending News</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {/* This would ideally be a dynamic list, using static items for now to match design intent */}
                {[1, 2, 3, 4].map((i) => (
                  <Link key={i} href="#" className="block p-4 hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      New Tata Nexon CNG launched in India at Rs. 8.99 lakh
                    </div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </Link>
                ))}
              </div>
              <div className="p-3 bg-gray-50 text-center">
                <Link href="/news" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                  View All News
                </Link>
              </div>
            </div>

            {/* Upcoming Cars Widget */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-lg text-gray-900">Upcoming Cars</h3>
              </div>
              <div className="p-4">
                {/* Simplified Upcoming Cars List */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Mahindra Thar 5-Door</div>
                      <div className="text-xs text-gray-500">Exp. Aug 2025</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-16 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Tata Curvv EV</div>
                      <div className="text-xs text-gray-500">Exp. Sep 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Full Width Sections below main content */}
      <div className="bg-gray-50 py-12 mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
          <LatestCarNews />
        </div>
      </div>

      <Footer />
    </div>
  )
}
